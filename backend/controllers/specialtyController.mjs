import Specialty from '../models/Specialty.mjs';
import College from '../models/College.mjs';
import User from '../models/User.mjs';
import mongoose from 'mongoose';

const KLIMOV_TYPE_NAMES = {
    manNature: 'Человек-Природа',
    manTech: 'Человек-Техника',
    manHuman: 'Человек-Человек',
    manSign: 'Человек-Знаковая система',
    manArt: 'Человек-Искусство'
};

// Функция для преобразования срока обучения в годы
const parseDurationToYears = (duration) => {
    if (!duration) return 0;
    
    const durationLower = duration.toLowerCase();
    let years = 0;
    
    // Извлечение чисел из строки
    const matches = durationLower.match(/(\d+[,.]?\d*)/g);
    if (matches) {
        if (durationLower.includes('год') || durationLower.includes('лет')) {
            years = parseFloat(matches[0].replace(',', '.'));
        } else if (durationLower.includes('мес') || durationLower.includes('месяц')) {
            const months = parseFloat(matches[0].replace(',', '.'));
            years = months / 12;
        } else {
            // Если не указана единица измерения, считаем годами
            years = parseFloat(matches[0].replace(',', '.'));
        }
    }
    
    return years;
};

// Функция для фильтрации по диапазону сроков
const filterByDurationRange = (specialties, durationFilter) => {
    if (!durationFilter || durationFilter === 'all') return specialties;
    
    const ranges = {
        'less-than-2': [0, 2],
        '2-3': [2, 3],
        '3-4': [3, 4],
        'more-than-4': [4, 100]
    };
    
    const [min, max] = ranges[durationFilter] || [0, 100];
    
    return specialties.filter(specialty => {
        const years = parseDurationToYears(specialty.duration);
        return years >= min && years < max;
    });
};

const calculateMatchPercentage = (userScores, specialtyKlimovTypes) => {
    if (!userScores || !specialtyKlimovTypes || specialtyKlimovTypes.length === 0) {
        return 0;
    }

    let totalScore = 0;
    let matchedTypes = [];

    specialtyKlimovTypes.forEach(type => {
        if (userScores[type] !== undefined) {
            totalScore += userScores[type];
            matchedTypes.push({
                type,
                score: userScores[type],
                name: KLIMOV_TYPE_NAMES[type]
            });
        }
    });

    if (matchedTypes.length === 0) {
        return 0;
    }

    const averageScore = totalScore / matchedTypes.length;
    return Math.round(averageScore);
};

export const getSpecialties = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 20, 
            klimovType, 
            region, 
            search, 
            sortBy = 'name', 
            sortOrder = 'asc',
            form,
            fundingType,
            city,
            durationRange
        } = req.query;
        
        // Создаем базовый запрос
        let query = {};
        
        // Фильтр по типам Климова
        if (klimovType) {
            const klimovTypes = Array.isArray(klimovType) ? klimovType : klimovType.split(',');
            query.klimovTypes = { $in: klimovTypes };
        }
        
        // Фильтр по региону
        if (region) {
            const colleges = await College.find({ region });
            const collegeIds = colleges.map(college => college._id);
            query.colleges = { $in: collegeIds };
        }
        
        // Фильтр по городу
        if (city) {
            query.collegeCities = city;
        }
        
        // Фильтр по форме обучения
        if (form) {
            query.form = form;
        }
        
        // Фильтр по типу финансирования
        if (fundingType) {
            query.fundingType = fundingType;
        }
        
        // Поиск по тексту
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { code: { $regex: search, $options: 'i' } },
                { collegeNames: { $regex: search, $options: 'i' } },
                { collegeCities: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Получаем общее количество
        const total = await Specialty.countDocuments(query);
        
        // Настраиваем сортировку
        let sortOptions = {};
        if (sortBy === 'duration') {
            // Для сортировки по сроку обучения используем агрегацию
            const aggregationPipeline = [
                { $match: query },
                {
                    $addFields: {
                        durationYears: {
                            $cond: {
                                if: { $regexMatch: { input: "$duration", regex: "^\\d+" } },
                                then: {
                                    $divide: [
                                        { $toDouble: { $arrayElemAt: [{ $split: ["$duration", " "] }, 0] } },
                                        { $cond: { 
                                            if: { $regexMatch: { input: "$duration", regex: "мес" } },
                                            then: 12,
                                            else: 1
                                        }}
                                    ]
                                },
                                else: 0
                            }
                        }
                    }
                },
                { $sort: { durationYears: sortOrder === 'desc' ? -1 : 1 } },
                { $skip: (page - 1) * limit },
                { $limit: parseInt(limit) }
            ];
            
            const specialties = await Specialty.aggregate(aggregationPipeline);
            
            // Заполняем данные о колледжах
            const populatedSpecialties = await Specialty.populate(specialties, {
                path: 'colleges',
                select: 'name city region address website phone email description'
            });
            
            // Фильтрация по диапазону сроков
            let filteredSpecialties = populatedSpecialties;
            if (durationRange && durationRange !== 'all') {
                filteredSpecialties = filterByDurationRange(populatedSpecialties, durationRange);
            }
            
            // Добавляем данные о пользователе
            let specialtiesWithMatch = filteredSpecialties;
            if (req.user) {
                const user = await User.findById(req.user._id);
                if (user && user.testResults && user.testResults.length > 0) {
                    const latestTest = user.testResults[user.testResults.length - 1];
                    const userScores = latestTest.klimovScores;
                    
                    specialtiesWithMatch = filteredSpecialties.map(specialty => {
                        const matchPercentage = calculateMatchPercentage(userScores, specialty.klimovTypes);
                        
                        const matchedTypes = [];
                        let matchReasons = [];
                        
                        if (matchPercentage > 0) {
                            specialty.klimovTypes.forEach(type => {
                                if (userScores[type]) {
                                    matchedTypes.push({
                                        type,
                                        score: userScores[type],
                                        name: KLIMOV_TYPE_NAMES[type]
                                    });
                                    matchReasons.push(`${KLIMOV_TYPE_NAMES[type]}: ${userScores[type]}%`);
                                }
                            });
                        }
                        
                        return {
                            ...specialty,
                            matchPercentage,
                            matchedTypes,
                            matchReasons,
                            isRecommended: matchPercentage >= 60
                        };
                    });
                    
                    // Сортировка по совпадению
                    if (sortBy === 'match') {
                        specialtiesWithMatch.sort((a, b) => {
                            return sortOrder === 'desc' 
                                ? b.matchPercentage - a.matchPercentage 
                                : a.matchPercentage - b.matchPercentage;
                        });
                    }
                }
            }
            
            const regions = await College.distinct('region');
            const cities = await Specialty.distinct('collegeCities');
            const forms = ['full-time', 'part-time', 'distance'];
            const fundingTypes = ['budget', 'paid', 'both'];
            const durations = await Specialty.distinct('duration');
            const klimovTypes = ['manNature', 'manTech', 'manHuman', 'manSign', 'manArt'];
            
            return res.json({
                success: true,
                specialties: specialtiesWithMatch,
                total: filteredSpecialties.length,
                page: parseInt(page),
                totalPages: Math.ceil(filteredSpecialties.length / limit),
                filters: {
                    regions,
                    cities: cities.filter(c => c),
                    forms,
                    fundingTypes,
                    durations: durations.filter(d => d).sort(),
                    klimovTypes
                }
            });
        }
        
        // Обычная сортировка для других полей
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
        
        // Получаем специальности
        let specialties = await Specialty.find(query)
            .populate({
                path: 'colleges',
                select: 'name city region address website phone email description'
            })
            .sort(sortOptions);
        
        // Фильтрация по диапазону сроков
        if (durationRange && durationRange !== 'all') {
            specialties = filterByDurationRange(specialties, durationRange);
        }
        
        // Применяем пагинацию
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedSpecialties = specialties.slice(startIndex, endIndex);
        
        const regions = await College.distinct('region');
        const cities = await Specialty.distinct('collegeCities');
        const forms = ['full-time', 'part-time', 'distance'];
        const fundingTypes = ['budget', 'paid', 'both'];
        const durations = await Specialty.distinct('duration');
        const klimovTypes = ['manNature', 'manTech', 'manHuman', 'manSign', 'manArt'];
        
        let specialtiesWithMatch = paginatedSpecialties;
        
        // Добавляем данные о пользователе
        if (req.user) {
            const user = await User.findById(req.user._id);
            if (user && user.testResults && user.testResults.length > 0) {
                const latestTest = user.testResults[user.testResults.length - 1];
                const userScores = latestTest.klimovScores;
                
                specialtiesWithMatch = paginatedSpecialties.map(specialty => {
                    const matchPercentage = calculateMatchPercentage(userScores, specialty.klimovTypes);
                    
                    const matchedTypes = [];
                    let matchReasons = [];
                    
                    if (matchPercentage > 0) {
                        specialty.klimovTypes.forEach(type => {
                            if (userScores[type]) {
                                matchedTypes.push({
                                    type,
                                    score: userScores[type],
                                    name: KLIMOV_TYPE_NAMES[type]
                                });
                                matchReasons.push(`${KLIMOV_TYPE_NAMES[type]}: ${userScores[type]}%`);
                            }
                        });
                    }
                    
                    return {
                        ...specialty.toObject(),
                        matchPercentage,
                        matchedTypes,
                        matchReasons,
                        isRecommended: matchPercentage >= 60
                    };
                });
                
                // Сортировка по совпадению
                if (sortBy === 'match') {
                    specialtiesWithMatch.sort((a, b) => {
                        return sortOrder === 'desc' 
                            ? b.matchPercentage - a.matchPercentage 
                            : a.matchPercentage - b.matchPercentage;
                    });
                }
            }
        }
        
        res.json({
            success: true,
            specialties: specialtiesWithMatch,
            total: specialties.length,
            page: parseInt(page),
            totalPages: Math.ceil(specialties.length / limit),
            filters: {
                regions,
                cities: cities.filter(c => c),
                forms,
                fundingTypes,
                durations: durations.filter(d => d).sort(),
                klimovTypes
            }
        });
    } catch (error) {
        console.error('Ошибка при получении специальностей:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении специальностей'
        });
    }
};

export const getSpecialtyById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Проверяем, является ли id действительным ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Неверный формат ID специальности'
            });
        }
        
        const specialty = await Specialty.findById(id).populate('colleges');
        
        if (!specialty) {
            return res.status(404).json({
                success: false,
                message: 'Специальность не найдена'
            });
        }
        
        let specialtyWithMatch = specialty.toObject();
        
        if (req.user) {
            const user = await User.findById(req.user._id);
            if (user && user.testResults && user.testResults.length > 0) {
                const latestTest = user.testResults[user.testResults.length - 1];
                const userScores = latestTest.klimovScores;
                
                const matchPercentage = calculateMatchPercentage(userScores, specialty.klimovTypes);
                
                const matchedTypes = [];
                let matchReasons = [];
                
                if (matchPercentage > 0) {
                    specialty.klimovTypes.forEach(type => {
                        if (userScores[type]) {
                            matchedTypes.push({
                                type,
                                score: userScores[type],
                                name: KLIMOV_TYPE_NAMES[type]
                            });
                            matchReasons.push(`${KLIMOV_TYPE_NAMES[type]}: ${userScores[type]}%`);
                        }
                    });
                }
                
                specialtyWithMatch = {
                    ...specialtyWithMatch,
                    matchPercentage,
                    matchedTypes,
                    matchReasons,
                    isRecommended: matchPercentage >= 60,
                    userScores
                };
            }
        }
        
        res.json({
            success: true,
            specialty: specialtyWithMatch
        });
    } catch (error) {
        console.error('Ошибка при получении специальности:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении специальности'
        });
    }
};

export const saveSpecialty = async (req, res) => {
    try {
        const userId = req.user._id;
        const { specialtyId } = req.body;
        
        if (!specialtyId) {
            return res.status(400).json({
                success: false,
                message: 'ID специальности обязателен'
            });
        }
        
        const user = await User.findById(userId);
        
        if (!user.savedSpecialties.includes(specialtyId)) {
            user.savedSpecialties.push(specialtyId);
            await user.save();
        }
        
        res.json({
            success: true,
            message: 'Специальность добавлена в избранное',
            savedSpecialties: user.savedSpecialties
        });
    } catch (error) {
        console.error('Ошибка при сохранении специальности:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при сохранении специальности'
        });
    }
};

export const unsaveSpecialty = async (req, res) => {
    try {
        const userId = req.user._id;
        const { specialtyId } = req.body;
        
        if (!specialtyId) {
            return res.status(400).json({
                success: false,
                message: 'ID специальности обязателен'
            });
        }
        
        const user = await User.findById(userId);
        
        user.savedSpecialties = user.savedSpecialties.filter(id => id.toString() !== specialtyId);
        await user.save();
        
        res.json({
            success: true,
            message: 'Специальность удалена из избранного',
            savedSpecialties: user.savedSpecialties
        });
    } catch (error) {
        console.error('Ошибка при удалении из избранного:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при удалении из избранного'
        });
    }
};

export const getSavedSpecialties = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const user = await User.findById(userId).populate({
            path: 'savedSpecialties',
            populate: {
                path: 'colleges'
            }
        });
        
        const savedSpecialties = user.savedSpecialties || [];
        
        const userData = await User.findById(userId);
        if (userData && userData.testResults && userData.testResults.length > 0) {
            const latestTest = userData.testResults[userData.testResults.length - 1];
            const userScores = latestTest.klimovScores;
            
            const specialtiesWithMatch = savedSpecialties.map(specialty => {
                const matchPercentage = calculateMatchPercentage(userScores, specialty.klimovTypes);
                
                const matchedTypes = [];
                let matchReasons = [];
                
                if (matchPercentage > 0) {
                    specialty.klimovTypes.forEach(type => {
                        if (userScores[type]) {
                            matchedTypes.push({
                                type,
                                score: userScores[type],
                                name: KLIMOV_TYPE_NAMES[type]
                            });
                            matchReasons.push(`${KLIMOV_TYPE_NAMES[type]}: ${userScores[type]}%`);
                        }
                    });
                }
                
                return {
                    ...specialty.toObject(),
                    matchPercentage,
                    matchedTypes,
                    matchReasons,
                    isRecommended: matchPercentage >= 60
                };
            });
            
            specialtiesWithMatch.sort((a, b) => b.matchPercentage - a.matchPercentage);
            
            return res.json({
                success: true,
                savedSpecialties: specialtiesWithMatch,
                total: specialtiesWithMatch.length
            });
        }
        
        res.json({
            success: true,
            savedSpecialties: savedSpecialties.map(specialty => ({
                ...specialty.toObject(),
                matchPercentage: 0,
                matchedTypes: [],
                matchReasons: [],
                isRecommended: false
            })),
            total: savedSpecialties.length
        });
    } catch (error) {
        console.error('Ошибка при получении сохраненных специальностей:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении сохраненных специальностей'
        });
    }
};

export const checkSavedStatus = async (req, res) => {
    try {
        const userId = req.user._id;
        const { specialtyIds } = req.body;
        
        if (!specialtyIds || !Array.isArray(specialtyIds)) {
            return res.status(400).json({
                success: false,
                message: 'Необходим массив ID специальностей'
            });
        }
        
        const user = await User.findById(userId);
        const savedStatus = {};
        
        specialtyIds.forEach(id => {
            savedStatus[id] = user.savedSpecialties.some(savedId => savedId.toString() === id);
        });
        
        res.json({
            success: true,
            savedStatus
        });
    } catch (error) {
        console.error('Ошибка при проверке статуса сохранения:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при проверке статуса сохранения'
        });
    }
};

export const clearSavedSpecialties = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const user = await User.findById(userId);
        user.savedSpecialties = [];
        await user.save();
        
        res.json({
            success: true,
            message: 'Все специальности удалены из избранного',
            savedSpecialties: []
        });
    } catch (error) {
        console.error('Ошибка при очистке избранного:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при очистке избранного'
        });
    }
};

export const compareSpecialties = async (req, res) => {
    try {
        const { ids } = req.query;
        
        if (!ids) {
            return res.status(400).json({
                success: false,
                message: 'Необходимы ID специальностей для сравнения'
            });
        }
        
        const idArray = Array.isArray(ids) ? ids : ids.split(',');
        
        if (idArray.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Для сравнения необходимо минимум 2 специальности'
            });
        }
        
        if (idArray.length > 5) {
            return res.status(400).json({
                success: false,
                message: 'Можно сравнить не более 5 специальностей одновременно'
            });
        }
        
        // Фильтруем только валидные ObjectId
        const validIds = idArray.filter(id => mongoose.Types.ObjectId.isValid(id));
        
        if (validIds.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Неверный формат ID специальностей'
            });
        }
        
        const specialties = await Specialty.find({
            _id: { $in: validIds }
        }).populate('colleges');
        
        if (specialties.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Не удалось найти специальности для сравнения'
            });
        }
        
        let specialtiesWithMatch = specialties;
        
        if (req.user) {
            const user = await User.findById(req.user._id);
            if (user && user.testResults && user.testResults.length > 0) {
                const latestTest = user.testResults[user.testResults.length - 1];
                const userScores = latestTest.klimovScores;
                
                specialtiesWithMatch = specialties.map(specialty => {
                    const matchPercentage = calculateMatchPercentage(userScores, specialty.klimovTypes);
                    
                    const matchedTypes = [];
                    let matchReasons = [];
                    
                    if (matchPercentage > 0) {
                        specialty.klimovTypes.forEach(type => {
                            if (userScores[type]) {
                                matchedTypes.push({
                                    type,
                                    score: userScores[type],
                                    name: KLIMOV_TYPE_NAMES[type]
                                });
                                matchReasons.push(`${KLIMOV_TYPE_NAMES[type]}: ${userScores[type]}%`);
                            }
                        });
                    }
                    
                    return {
                        ...specialty.toObject(),
                        matchPercentage,
                        matchedTypes,
                        matchReasons,
                        isRecommended: matchPercentage >= 60
                    };
                });
            }
        }
        
        const comparisonData = {
            specialties: specialtiesWithMatch,
            fields: [
                { key: 'name', label: 'Название' },
                { key: 'code', label: 'Код специальности' },
                { key: 'collegeNames', label: 'Колледжи' },
                { key: 'educationLevel', label: 'Уровень образования' },
                { key: 'duration', label: 'Срок обучения' },
                { key: 'form', label: 'Форма обучения' },
                { key: 'fundingType', label: 'Тип финансирования' },
                { key: 'matchPercentage', label: 'Совпадение с профилем' },
                { key: 'klimovTypes', label: 'Типы по Климову' },
                { key: 'disciplines', label: 'Ключевые дисциплины' },
                { key: 'requirements', label: 'Требования' },
                { key: 'prospects', label: 'Перспективы' }
            ]
        };
        
        res.json({
            success: true,
            ...comparisonData
        });
    } catch (error) {
        console.error('Ошибка при сравнении специальностей:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при сравнении специальностей'
        });
    }
};

export const getRecommendedSpecialties = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        
        if (!user || !user.testResults || user.testResults.length === 0) {
            return res.json({
                success: true,
                specialties: []
            });
        }
        
        const latestTest = user.testResults[user.testResults.length - 1];
        const userScores = latestTest.klimovScores;
        
        const sortedTypes = Object.entries(userScores)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(entry => entry[0]);
        
        const query = {
            klimovTypes: { $in: sortedTypes }
        };
        
        const specialties = await Specialty.find(query)
            .populate('colleges')
            .limit(20);
        
        const specialtiesWithMatch = specialties.map(specialty => {
            const matchPercentage = calculateMatchPercentage(userScores, specialty.klimovTypes);
            
            const matchedTypes = [];
            let matchReasons = [];
            
            if (matchPercentage > 0) {
                specialty.klimovTypes.forEach(type => {
                    if (userScores[type]) {
                        matchedTypes.push({
                            type,
                            score: userScores[type],
                            name: KLIMOV_TYPE_NAMES[type]
                        });
                        matchReasons.push(`${KLIMOV_TYPE_NAMES[type]}: ${userScores[type]}%`);
                    }
                });
            }
            
            return {
                ...specialty.toObject(),
                matchPercentage,
                matchedTypes,
                matchReasons,
                isRecommended: matchPercentage >= 60
            };
        });
        
        specialtiesWithMatch.sort((a, b) => b.matchPercentage - a.matchPercentage);
        
        res.json({
            success: true,
            specialties: specialtiesWithMatch
        });
    } catch (error) {
        console.error('Ошибка при получении рекомендаций:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении рекомендаций'
        });
    }
};

export const getSpecialtiesForComparison = async (req, res) => {
    try {
        const userId = req.user._id;
        const { search, limit = 10 } = req.query;
        
        const query = {};
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { code: { $regex: search, $options: 'i' } },
                { collegeNames: { $regex: search, $options: 'i' } }
            ];
        }
        
        const specialties = await Specialty.find(query)
            .populate('colleges')
            .limit(parseInt(limit))
            .sort({ name: 1 });
        
        const user = await User.findById(userId);
        let specialtiesWithMatch = specialties;
        
        if (user && user.testResults && user.testResults.length > 0) {
            const latestTest = user.testResults[user.testResults.length - 1];
            const userScores = latestTest.klimovScores;
            
            specialtiesWithMatch = specialties.map(specialty => {
                const matchPercentage = calculateMatchPercentage(userScores, specialty.klimovTypes);
                
                return {
                    ...specialty.toObject(),
                    matchPercentage,
                    isRecommended: matchPercentage >= 60
                };
            });
        }
        
        res.json({
            success: true,
            specialties: specialtiesWithMatch
        });
    } catch (error) {
        console.error('Ошибка при получении специальностей для сравнения:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении специальностей для сравнения'
        });
    }
};