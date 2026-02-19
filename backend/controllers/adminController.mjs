import Specialty from '../models/Specialty.mjs';
import College from '../models/College.mjs';
import User from '../models/User.mjs';
import mongoose from 'mongoose';

export const createSpecialty = async (req, res) => {
    try {
        const {
            code,
            name,
            description,
            educationLevel,
            klimovTypes,
            disciplines,
            duration,
            form,
            fundingType,
            colleges,
            collegeNames,
            collegeCities,
            requirements,
            prospects,
            url
        } = req.body;

        // Проверяем, что colleges - это массив
        let collegeIds = [];
        if (colleges) {
            if (Array.isArray(colleges)) {
                collegeIds = colleges.filter(id => mongoose.Types.ObjectId.isValid(id));
            } else if (typeof colleges === 'string') {
                collegeIds = colleges.split(',')
                    .map(id => id.trim())
                    .filter(id => mongoose.Types.ObjectId.isValid(id));
            }
        }

        // Проверяем, что collegeNames - это массив
        let collegeNamesArray = [];
        if (collegeNames) {
            if (Array.isArray(collegeNames)) {
                collegeNamesArray = collegeNames.filter(name => name && name.trim());
            } else if (typeof collegeNames === 'string') {
                collegeNamesArray = collegeNames.split(',')
                    .map(name => name.trim())
                    .filter(name => name);
            }
        }

        // Проверяем, что collegeCities - это массив
        let collegeCitiesArray = [];
        if (collegeCities) {
            if (Array.isArray(collegeCities)) {
                collegeCitiesArray = collegeCities.filter(city => city && city.trim());
            } else if (typeof collegeCities === 'string') {
                collegeCitiesArray = collegeCities.split(',')
                    .map(city => city.trim())
                    .filter(city => city);
            }
        }

        const specialtyData = {
            code,
            name,
            description: description || '',
            educationLevel: educationLevel || 'SPO',
            klimovTypes: Array.isArray(klimovTypes) ? klimovTypes : 
                (klimovTypes ? klimovTypes.split(',').map(item => item.trim()).filter(item => item) : []),
            disciplines: Array.isArray(disciplines) ? disciplines : 
                (disciplines ? disciplines.split(',').map(item => item.trim()).filter(item => item) : []),
            duration: duration || '2 года 10 месяцев',
            form: form || 'full-time',
            fundingType: fundingType || 'both',
            colleges: collegeIds,
            collegeNames: collegeNamesArray,
            collegeCities: collegeCitiesArray,
            requirements: Array.isArray(requirements) ? requirements : 
                (requirements ? requirements.split(',').map(item => item.trim()).filter(item => item) : []),
            prospects: Array.isArray(prospects) ? prospects : 
                (prospects ? prospects.split(',').map(item => item.trim()).filter(item => item) : []),
            url: url || ''
        };

        const specialty = new Specialty(specialtyData);
        await specialty.save();

        // Обновляем колледжи, добавляя им эту специальность
        if (collegeIds.length > 0) {
            await College.updateMany(
                { _id: { $in: collegeIds } },
                { $addToSet: { specialties: specialty._id } }
            );
        }

        res.status(201).json({
            success: true,
            message: 'Специальность создана',
            specialty
        });
    } catch (error) {
        console.error('Ошибка при создании специальности:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при создании специальности'
        });
    }
};

export const updateSpecialty = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Находим текущую специальность
        const currentSpecialty = await Specialty.findById(id);
        if (!currentSpecialty) {
            return res.status(404).json({
                success: false,
                message: 'Специальность не найдена'
            });
        }

        // Обрабатываем колледжи
        if (updateData.colleges !== undefined) {
            let newCollegeIds = [];
            if (updateData.colleges) {
                if (Array.isArray(updateData.colleges)) {
                    newCollegeIds = updateData.colleges.filter(id => mongoose.Types.ObjectId.isValid(id));
                } else if (typeof updateData.colleges === 'string') {
                    newCollegeIds = updateData.colleges.split(',')
                        .map(id => id.trim())
                        .filter(id => mongoose.Types.ObjectId.isValid(id));
                }
            }
            updateData.colleges = newCollegeIds;

            // Обновляем названия колледжей
            if (updateData.collegeNames !== undefined) {
                let newCollegeNames = [];
                if (updateData.collegeNames) {
                    if (Array.isArray(updateData.collegeNames)) {
                        newCollegeNames = updateData.collegeNames.filter(name => name && name.trim());
                    } else if (typeof updateData.collegeNames === 'string') {
                        newCollegeNames = updateData.collegeNames.split(',')
                            .map(name => name.trim())
                            .filter(name => name);
                    }
                }
                updateData.collegeNames = newCollegeNames;
            }

            // Обновляем города колледжей
            if (updateData.collegeCities !== undefined) {
                let newCollegeCities = [];
                if (updateData.collegeCities) {
                    if (Array.isArray(updateData.collegeCities)) {
                        newCollegeCities = updateData.collegeCities.filter(city => city && city.trim());
                    } else if (typeof updateData.collegeCities === 'string') {
                        newCollegeCities = updateData.collegeCities.split(',')
                            .map(city => city.trim())
                            .filter(city => city);
                    }
                }
                updateData.collegeCities = newCollegeCities;
            }

            // Обновляем связи в колледжах
            const oldCollegeIds = currentSpecialty.colleges.map(id => id.toString());
            const collegesToRemove = oldCollegeIds.filter(id => !newCollegeIds.includes(id));
            const collegesToAdd = newCollegeIds.filter(id => !oldCollegeIds.includes(id));

            if (collegesToRemove.length > 0) {
                await College.updateMany(
                    { _id: { $in: collegesToRemove } },
                    { $pull: { specialties: id } }
                );
            }

            if (collegesToAdd.length > 0) {
                await College.updateMany(
                    { _id: { $in: collegesToAdd } },
                    { $addToSet: { specialties: id } }
                );
            }
        }

        // Обрабатываем массивы
        if (updateData.disciplines && typeof updateData.disciplines === 'string') {
            updateData.disciplines = updateData.disciplines.split(',').map(item => item.trim()).filter(item => item);
        }
        if (updateData.requirements && typeof updateData.requirements === 'string') {
            updateData.requirements = updateData.requirements.split(',').map(item => item.trim()).filter(item => item);
        }
        if (updateData.prospects && typeof updateData.prospects === 'string') {
            updateData.prospects = updateData.prospects.split(',').map(item => item.trim()).filter(item => item);
        }
        if (updateData.klimovTypes && typeof updateData.klimovTypes === 'string') {
            updateData.klimovTypes = updateData.klimovTypes.split(',').map(item => item.trim()).filter(item => item);
        }

        const specialty = await Specialty.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('colleges');

        if (!specialty) {
            return res.status(404).json({
                success: false,
                message: 'Специальность не найдена'
            });
        }

        res.json({
            success: true,
            message: 'Специальность обновлена',
            specialty
        });
    } catch (error) {
        console.error('Ошибка при обновлении специальности:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при обновлении специальности'
        });
    }
};

export const deleteSpecialty = async (req, res) => {
    try {
        const { id } = req.params;

        const specialty = await Specialty.findByIdAndDelete(id);

        if (!specialty) {
            return res.status(404).json({
                success: false,
                message: 'Специальность не найдена'
            });
        }

        // Удаляем специальность из колледжей
        if (specialty.colleges && specialty.colleges.length > 0) {
            await College.updateMany(
                { _id: { $in: specialty.colleges } },
                { $pull: { specialties: specialty._id } }
            );
        }

        res.json({
            success: true,
            message: 'Специальность удалена'
        });
    } catch (error) {
        console.error('Ошибка при удалении специальности:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при удалении специальности'
        });
    }
};

export const createCollege = async (req, res) => {
    try {
        const {
            name,
            city,
            region,
            address,
            website,
            phone,
            email,
            description,
            specialties
        } = req.body;

        // Проверяем существование колледжа с таким же названием в этом городе
        const existingCollege = await College.findOne({ 
            name: new RegExp(`^${name}$`, 'i'), 
            city: new RegExp(`^${city}$`, 'i') 
        });
        
        if (existingCollege) {
            return res.status(400).json({
                success: false,
                message: 'Колледж с таким названием уже существует в этом городе'
            });
        }

        const college = new College({
            name,
            city,
            region,
            address,
            website: website || '',
            phone: phone || '',
            email: email || '',
            description: description || '',
            specialties: specialties || []
        });

        await college.save();

        res.status(201).json({
            success: true,
            message: 'Колледж создан',
            college
        });
    } catch (error) {
        console.error('Ошибка при создании колледжа:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при создании колледжа'
        });
    }
};

export const updateCollege = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const college = await College.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!college) {
            return res.status(404).json({
                success: false,
                message: 'Колледж не найден'
            });
        }

        res.json({
            success: true,
            message: 'Колледж обновлен',
            college
        });
    } catch (error) {
        console.error('Ошибка при обновлении колледжа:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при обновлении колледжа'
        });
    }
};

export const deleteCollege = async (req, res) => {
    try {
        const { id } = req.params;

        const college = await College.findByIdAndDelete(id);

        if (!college) {
            return res.status(404).json({
                success: false,
                message: 'Колледж не найден'
            });
        }

        // Удаляем колледж из специальностей
        await Specialty.updateMany(
            { colleges: id },
            { 
                $pull: { 
                    colleges: id,
                    collegeNames: college.name 
                }
            }
        );

        res.json({
            success: true,
            message: 'Колледж удален'
        });
    } catch (error) {
        console.error('Ошибка при удалении колледжа:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при удалении колледжа'
        });
    }
};

export const getAllColleges = async (req, res) => {
    try {
        const { page = 1, limit = 20, search = '', region = '', city = '' } = req.query;
        
        const query = {};
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } }
            ];
        }
        
        if (region) {
            query.region = region;
        }
        
        if (city) {
            query.city = city;
        }
        
        const colleges = await College.find(query)
            .populate({
                path: 'specialties',
                select: 'name code'
            })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ name: 1 });
        
        const total = await College.countDocuments(query);
        
        const regions = await College.distinct('region');
        const cities = await College.distinct('city');
        
        res.json({
            success: true,
            colleges,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            filters: {
                regions,
                cities
            }
        });
    } catch (error) {
        console.error('Ошибка при получении колледжей:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении колледжей'
        });
    }
};

export const getCollegeById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const college = await College.findById(id)
            .populate({
                path: 'specialties',
                select: 'name code description duration form klimovTypes'
            });
        
        if (!college) {
            return res.status(404).json({
                success: false,
                message: 'Колледж не найден'
            });
        }
        
        res.json({
            success: true,
            college
        });
    } catch (error) {
        console.error('Ошибка при получении колледжа:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении колледжа'
        });
    }
};

export const searchColleges = async (req, res) => {
    try {
        const { search = '', limit = 10 } = req.query;
        
        const query = {};
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } }
            ];
        }
        
        const colleges = await College.find(query)
            .select('name city region')
            .limit(parseInt(limit))
            .sort({ name: 1 });
        
        res.json({
            success: true,
            colleges
        });
    } catch (error) {
        console.error('Ошибка при поиске колледжей:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при поиске колледжей'
        });
    }
};

export const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalSpecialties = await Specialty.countDocuments();
        const totalColleges = await College.countDocuments();
        
        const totalTests = await User.aggregate([
            { $unwind: '$testResults' },
            { $count: 'total' }
        ]);

        const klimovStats = await User.aggregate([
            { $unwind: '$testResults' },
            { $match: { 'testResults.primaryKlimovType': { $ne: null } } },
            { $group: {
                _id: '$testResults.primaryKlimovType',
                count: { $sum: 1 }
            }},
            { $sort: { count: -1 } }
        ]);

        const recentTests = await User.aggregate([
            { $unwind: '$testResults' },
            { $sort: { 'testResults.date': -1 } },
            { $limit: 10 },
            { $project: {
                firstName: 1,
                lastName: 1,
                'testResults.date': 1,
                'testResults.primaryKlimovType': 1
            }}
        ]);

        const userRegistrationStats = await User.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
            { $limit: 30 }
        ]);

        const testActivityStats = await User.aggregate([
            { $unwind: '$testResults' },
            {
                $group: {
                    _id: {
                        year: { $year: '$testResults.date' },
                        month: { $month: '$testResults.date' },
                        day: { $dayOfMonth: '$testResults.date' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
            { $limit: 30 }
        ]);

        const specialtyPopularity = await Specialty.aggregate([
            { $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: 'savedSpecialties',
                as: 'savedBy'
            }},
            {
                $project: {
                    name: 1,
                    code: 1,
                    collegeNames: 1,
                    savedCount: { $size: '$savedBy' }
                }
            },
            { $sort: { savedCount: -1 } },
            { $limit: 10 }
        ]);

        const specialtyTypeStats = await Specialty.aggregate([
            { $unwind: '$klimovTypes' },
            {
                $group: {
                    _id: '$klimovTypes',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        const userRoleStats = await User.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 }
                }
            }
        ]);

        const monthlyUserGrowth = await User.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
            { $limit: 12 }
        ]);

        const monthlyTestGrowth = await User.aggregate([
            { $unwind: '$testResults' },
            {
                $group: {
                    _id: {
                        year: { $year: '$testResults.date' },
                        month: { $month: '$testResults.date' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
            { $limit: 12 }
        ]);

        const specialtyByCollege = await Specialty.aggregate([
            { $unwind: '$collegeNames' },
            { $group: {
                _id: '$collegeNames',
                count: { $sum: 1 }
            }},
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        const userTestStats = await User.aggregate([
            {
                $project: {
                    testsTaken: { $size: { $ifNull: ['$testResults', []] } }
                }
            },
            {
                $group: {
                    _id: null,
                    averageTests: { $avg: '$testsTaken' },
                    maxTests: { $max: '$testsTaken' },
                    minTests: { $min: '$testsTaken' },
                    totalTestTakers: {
                        $sum: {
                            $cond: [{ $gt: [{ $size: { $ifNull: ['$testResults', []] } }, 0] }, 1, 0]
                        }
                    }
                }
            }
        ]);

        const dailyActivity = await User.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' }
                    },
                    registrations: { $sum: 1 },
                    lastActive: { $max: '$updatedAt' }
                }
            },
            { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } },
            { $limit: 7 }
        ]);

        const specialtyByRegion = await College.aggregate([
            {
                $lookup: {
                    from: 'specialties',
                    localField: '_id',
                    foreignField: 'colleges',
                    as: 'specialties'
                }
            },
            {
                $group: {
                    _id: '$region',
                    collegeCount: { $sum: 1 },
                    specialtyCount: { $sum: { $size: '$specialties' } }
                }
            },
            { $sort: { specialtyCount: -1 } },
            { $limit: 10 }
        ]);

        const testCompletionStats = await User.aggregate([
            {
                $project: {
                    hasTests: { $cond: [{ $gt: [{ $size: { $ifNull: ['$testResults', []] } }, 0] }, 1, 0] }
                }
            },
            {
                $group: {
                    _id: null,
                    totalWithTests: { $sum: '$hasTests' },
                    totalWithoutTests: { $sum: { $cond: [{ $eq: ['$hasTests', 0] }, 1, 0] } }
                }
            }
        ]);

        const specialtyMatchStats = await Specialty.aggregate([
            { $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: 'savedSpecialties',
                as: 'savedBy'
            }},
            {
                $project: {
                    name: 1,
                    savedCount: { $size: '$savedBy' },
                    klimovTypes: 1
                }
            },
            { $sort: { savedCount: -1 } },
            { $limit: 15 }
        ]);

        const klimovDistribution = await User.aggregate([
            { $unwind: '$testResults' },
            {
                $group: {
                    _id: '$testResults.primaryKlimovType',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalSpecialties,
                totalColleges,
                totalTests: totalTests[0]?.total || 0,
                klimovStats,
                recentTests,
                userRegistrationStats,
                testActivityStats,
                specialtyPopularity,
                specialtyTypeStats,
                userRoleStats,
                monthlyUserGrowth,
                monthlyTestGrowth,
                specialtyByCollege,
                userTestStats: userTestStats[0] || {},
                dailyActivity,
                specialtyByRegion,
                testCompletionStats: testCompletionStats[0] || {},
                specialtyMatchStats,
                klimovDistribution
            }
        });
    } catch (error) {
        console.error('Ошибка при получении статистики:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении статистики'
        });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            users
        });
    } catch (error) {
        console.error('Ошибка при получении пользователей:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении пользователей'
        });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Неверная роль'
            });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { 
                role,
                isAdmin: role === 'admin'
            },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Пользователь не найден'
            });
        }

        res.json({
            success: true,
            message: 'Роль обновлена',
            user
        });
    } catch (error) {
        console.error('Ошибка при обновлении роли:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при обновлении роли'
        });
    }
};

export const getColleges = async (req, res) => {
    try {
        const colleges = await College.find()
            .populate('specialties')
            .sort({ name: 1 });
        
        res.json({
            success: true,
            colleges
        });
    } catch (error) {
        console.error('Ошибка при получении колледжей:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении колледжей'
        });
    }
};

export const getSpecialtiesAdmin = async (req, res) => {
    try {
        const specialties = await Specialty.find()
            .populate('colleges')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            specialties
        });
    } catch (error) {
        console.error('Ошибка при получении специальностей:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении специальностей'
        });
    }
};

export const getAnalyticsData = async (req, res) => {
    try {
        const { period = '7d' } = req.query;
        
        let daysLimit = 7;
        if (period === '30d') daysLimit = 30;
        if (period === '90d') daysLimit = 90;
        
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysLimit);

        const userStats = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ]);

        const testStats = await User.aggregate([
            { $unwind: '$testResults' },
            {
                $match: {
                    'testResults.date': { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$testResults.date' },
                        month: { $month: '$testResults.date' },
                        day: { $dayOfMonth: '$testResults.date' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ]);

        const specialtyStats = await Specialty.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ]);

        const topSpecialties = await Specialty.aggregate([
            { $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: 'savedSpecialties',
                as: 'savedBy'
            }},
            {
                $project: {
                    name: 1,
                    code: 1,
                    collegeNames: 1,
                    savedCount: { $size: '$savedBy' },
                    klimovTypes: 1
                }
            },
            { $sort: { savedCount: -1 } },
            { $limit: 5 }
        ]);

        const userActivity = await User.aggregate([
            {
                $project: {
                    _id: 1,
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                    testCount: { $size: { $ifNull: ['$testResults', []] } },
                    savedCount: { $size: { $ifNull: ['$savedSpecialties', []] } },
                    lastActive: '$updatedAt',
                    createdAt: 1
                }
            },
            { $sort: { testCount: -1 } },
            { $limit: 10 }
        ]);

        res.json({
            success: true,
            analytics: {
                userStats,
                testStats,
                specialtyStats,
                topSpecialties,
                userActivity
            }
        });
    } catch (error) {
        console.error('Ошибка при получении аналитики:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении аналитики'
        });
    }
};