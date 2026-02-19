import Specialty from '../models/Specialty.mjs';
import College from '../models/College.mjs';
import mongoose from 'mongoose';
import xlsx from 'xlsx';

export const importSpecialties = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Файл не загружен'
            });
        }

        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

        // Определяем заголовки (первая строка)
        const headers = data[0].map(h => h ? h.toString().trim().toLowerCase() : '');
        
        // Пропускаем заголовки и обрабатываем данные
        const specialtiesData = data.slice(1).filter(row => row.length > 0 && row.some(cell => cell !== null && cell !== ''));

        const results = {
            total: specialtiesData.length,
            created: 0,
            updated: 0,
            errors: [],
            skipped: 0
        };

        // Обрабатываем каждую строку
        for (let i = 0; i < specialtiesData.length; i++) {
            const row = specialtiesData[i];
            
            try {
                const rowData = {};
                headers.forEach((header, index) => {
                    if (header && row[index] !== undefined) {
                        rowData[header] = row[index];
                    }
                });

                // Преобразуем данные в нужный формат
                const specialtyData = await processRowData(rowData, i + 2); // +2 потому что: 1 - заголовок, 1 - индексация с 0

                // Поиск существующей специальности по коду
                const existingSpecialty = await Specialty.findOne({ code: specialtyData.code });

                if (existingSpecialty) {
                    // Обновляем существующую специальность
                    const updatedSpecialty = await Specialty.findByIdAndUpdate(
                        existingSpecialty._id,
                        specialtyData,
                        { new: true, runValidators: true }
                    );
                    
                    // Обновляем связи с колледжами
                    await updateCollegeRelations(existingSpecialty, updatedSpecialty);
                    
                    results.updated++;
                } else {
                    // Создаем новую специальность
                    const specialty = new Specialty(specialtyData);
                    await specialty.save();
                    
                    // Создаем связи с колледжами
                    await createCollegeRelations(specialty);
                    
                    results.created++;
                }
            } catch (error) {
                results.errors.push({
                    row: i + 2,
                    error: error.message,
                    data: row
                });
            }
        }

        res.json({
            success: true,
            message: 'Импорт завершен',
            results
        });
    } catch (error) {
        console.error('Ошибка при импорте специальностей:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при импорте специальностей',
            error: error.message
        });
    }
};

const processRowData = async (rowData, rowNumber) => {
    // Приводим все названия колонок к нижнему регистру и убираем пробелы
    const normalizedData = {};
    Object.keys(rowData).forEach(key => {
        const normalizedKey = key.toString().toLowerCase().trim();
        normalizedData[normalizedKey] = rowData[key];
    });

    // Маппинг полей
    const specialtyData = {
        code: String(normalizedData['код'] || normalizedData['code'] || '').trim(),
        name: String(normalizedData['название'] || normalizedData['name'] || '').trim(),
        description: String(normalizedData['описание'] || normalizedData['description'] || '').trim(),
        educationLevel: (String(normalizedData['уровень образования'] || normalizedData['educationlevel'] || 'спо').trim().toUpperCase() === 'ВО') ? 'VO' : 'SPO',
        duration: String(normalizedData['срок обучения'] || normalizedData['duration'] || normalizedData['срокобучения'] || '2 года 10 месяцев').trim(),
        form: getFormType(String(normalizedData['форма обучения'] || normalizedData['form'] || 'очная').trim()),
        fundingType: getFundingType(String(normalizedData['тип финансирования'] || normalizedData['fundingtype'] || 'бюджет/платно').trim()),
        url: String(normalizedData['ссылка'] || normalizedData['url'] || '').trim()
    };

    // Проверяем обязательные поля
    if (!specialtyData.code) {
        throw new Error(`Строка ${rowNumber}: Отсутствует код специальности`);
    }
    if (!specialtyData.name) {
        throw new Error(`Строка ${rowNumber}: Отсутствует название специальности`);
    }

    // Обрабатываем типы по Климову
    const klimovInput = String(normalizedData['типы по климову'] || normalizedData['klimovtypes'] || normalizedData['типыклимову'] || '').trim();
    specialtyData.klimovTypes = processKlimovTypes(klimovInput);

    // Обрабатываем дисциплины
    const disciplinesInput = String(normalizedData['дисциплины'] || normalizedData['disciplines'] || '').trim();
    specialtyData.disciplines = processArrayInput(disciplinesInput);

    // Обрабатываем требования
    const requirementsInput = String(normalizedData['требования'] || normalizedData['requirements'] || '').trim();
    specialtyData.requirements = processArrayInput(requirementsInput);

    // Обрабатываем перспективы
    const prospectsInput = String(normalizedData['перспективы'] || normalizedData['prospects'] || '').trim();
    specialtyData.prospects = processArrayInput(prospectsInput);

    // Обрабатываем колледжи
    const collegesInput = String(normalizedData['колледжи'] || normalizedData['colleges'] || '').trim();
    const collegeCitiesInput = String(normalizedData['города'] || normalizedData['cities'] || normalizedData['города колледжей'] || '').trim();
    
    const { collegeIds, collegeNames, collegeCities } = await processColleges(collegesInput, collegeCitiesInput, rowNumber);
    
    specialtyData.colleges = collegeIds;
    specialtyData.collegeNames = collegeNames;
    specialtyData.collegeCities = collegeCities;

    return specialtyData;
};

const processKlimovTypes = (input) => {
    if (!input) return [];
    
    const klimovMapping = {
        'человек-природа': 'manNature',
        'человекприрода': 'manNature',
        'природа': 'manNature',
        'man-nature': 'manNature',
        'mannature': 'manNature',
        'nature': 'manNature',
        
        'человек-техника': 'manTech',
        'человектехника': 'manTech',
        'техника': 'manTech',
        'man-tech': 'manTech',
        'mantech': 'manTech',
        'tech': 'manTech',
        
        'человек-человек': 'manHuman',
        'человекчеловек': 'manHuman',
        'человек': 'manHuman',
        'man-human': 'manHuman',
        'manhuman': 'manHuman',
        'human': 'manHuman',
        
        'человек-знаковая система': 'manSign',
        'человек-знак': 'manSign',
        'человекзнак': 'manSign',
        'знак': 'manSign',
        'man-sign': 'manSign',
        'mansign': 'manSign',
        'sign': 'manSign',
        
        'человек-искусство': 'manArt',
        'человекискусство': 'manArt',
        'искусство': 'manArt',
        'man-art': 'manArt',
        'manart': 'manArt',
        'art': 'manArt'
    };

    const types = input.split(/[,;|/]/).map(item => item.trim().toLowerCase()).filter(item => item);
    const result = [];

    for (const type of types) {
        if (klimovMapping[type]) {
            result.push(klimovMapping[type]);
        } else {
            // Проверяем частичное совпадение
            for (const [key, value] of Object.entries(klimovMapping)) {
                if (type.includes(key) || key.includes(type)) {
                    result.push(value);
                    break;
                }
            }
        }
    }

    // Удаляем дубликаты
    return [...new Set(result)];
};

const processArrayInput = (input) => {
    if (!input) return [];
    return input.split(/[,;]/).map(item => item.trim()).filter(item => item);
};

const getFormType = (input) => {
    const formMapping = {
        'очная': 'full-time',
        'очная форма': 'full-time',
        'дневная': 'full-time',
        'full-time': 'full-time',
        'очнозаочная': 'part-time',
        'очно-заочная': 'part-time',
        'вечерняя': 'part-time',
        'part-time': 'part-time',
        'заочная': 'distance',
        'дистанционная': 'distance',
        'distance': 'distance'
    };
    
    const lowerInput = input.toLowerCase();
    return formMapping[lowerInput] || 'full-time';
};

const getFundingType = (input) => {
    const fundingMapping = {
        'бюджет': 'budget',
        'бюджетная': 'budget',
        'budget': 'budget',
        'платная': 'paid',
        'платно': 'paid',
        'paid': 'paid',
        'бюджет/платно': 'both',
        'платно/бюджет': 'both',
        'both': 'both'
    };
    
    const lowerInput = input.toLowerCase();
    return fundingMapping[lowerInput] || 'both';
};

const processColleges = async (collegesInput, citiesInput, rowNumber) => {
    const collegeNames = processArrayInput(collegesInput);
    const collegeCities = processArrayInput(citiesInput);
    const collegeIds = [];

    // Если колледжи указаны, но города нет - используем пустые города
    if (collegeNames.length > 0 && collegeCities.length === 0) {
        collegeCities.push(...Array(collegeNames.length).fill(''));
    }

    // Если городов больше чем колледжей - обрезаем
    if (collegeCities.length > collegeNames.length) {
        collegeCities.length = collegeNames.length;
    }

    // Если колледжей больше чем городов - добавляем пустые города
    if (collegeNames.length > collegeCities.length) {
        const needed = collegeNames.length - collegeCities.length;
        collegeCities.push(...Array(needed).fill(''));
    }

    // Для каждого колледжа ищем или создаем
    for (let i = 0; i < collegeNames.length; i++) {
        const collegeName = collegeNames[i].trim();
        const collegeCity = collegeCities[i] ? collegeCities[i].trim() : '';

        if (!collegeName) continue;

        try {
            // Создаем запрос для поиска колледжа
            let query = {
                name: new RegExp(`^${collegeName}$`, 'i')
            };
            
            // Если указан город, добавляем его в запрос
            if (collegeCity) {
                query.city = new RegExp(`^${collegeCity}$`, 'i');
            }

            // Ищем существующий колледж
            let college = await College.findOne(query);

            // Если не нашли - создаем новый
            if (!college) {
                // Для адреса создаем значение по умолчанию на основе названия и города
                const defaultAddress = collegeCity 
                    ? `г. ${collegeCity}, адрес не указан`
                    : 'Адрес не указан';
                
                college = new College({
                    name: collegeName,
                    city: collegeCity || 'Не указан',
                    region: collegeCity || 'Не указан',
                    address: defaultAddress, // Обязательное поле
                    website: '',
                    phone: '',
                    email: '',
                    description: `Колледж "${collegeName}"` + (collegeCity ? ` в г. ${collegeCity}` : '')
                });
                
                await college.save();
                console.log(`Создан новый колледж: "${collegeName}" (г. ${collegeCity || 'Не указан'})`);
            }

            collegeIds.push(college._id);
            collegeNames[i] = college.name;
            collegeCities[i] = college.city || '';

        } catch (error) {
            console.error(`Ошибка при обработке колледжа "${collegeName}" (строка ${rowNumber}):`, error);
            throw new Error(`Ошибка при обработке колледжа "${collegeName}": ${error.message}`);
        }
    }

    return { collegeIds, collegeNames, collegeCities };
};
const createCollegeRelations = async (specialty) => {
    if (specialty.colleges.length > 0) {
        await College.updateMany(
            { _id: { $in: specialty.colleges } },
            { $addToSet: { specialties: specialty._id } }
        );
    }
};

const updateCollegeRelations = async (oldSpecialty, newSpecialty) => {
    const oldCollegeIds = oldSpecialty.colleges.map(id => id.toString());
    const newCollegeIds = newSpecialty.colleges.map(id => id.toString());

    // Удаляем специальность из старых колледжей
    const collegesToRemove = oldCollegeIds.filter(id => !newCollegeIds.includes(id));
    if (collegesToRemove.length > 0) {
        await College.updateMany(
            { _id: { $in: collegesToRemove } },
            { $pull: { specialties: oldSpecialty._id } }
        );
    }

    // Добавляем специальность в новые колледжи
    const collegesToAdd = newCollegeIds.filter(id => !oldCollegeIds.includes(id));
    if (collegesToAdd.length > 0) {
        await College.updateMany(
            { _id: { $in: collegesToAdd } },
            { $addToSet: { specialties: oldSpecialty._id } }
        );
    }
};

export const downloadTemplate = async (req, res) => {
    try {
        // Создаем шаблон Excel
        const headers = [
            'Код',
            'Название',
            'Описание',
            'Уровень образования',
            'Типы по Климову',
            'Дисциплины',
            'Срок обучения',
            'Форма обучения',
            'Тип финансирования',
            'Колледжи',
            'Города',
            'Требования',
            'Перспективы',
            'Ссылка'
        ];

        const examples = [
            '01.02.03',
            'Программирование в компьютерных системах',
            'Подготовка специалистов по разработке программного обеспечения',
            'СПО',
            'Человек-Техника,Человек-Знаковая система',
            'Математика,Информатика,Программирование,Базы данных',
            '3 года 10 месяцев',
            'очная',
            'бюджет/платно',
            'Колледж информационных технологий,Технический колледж',
            'Москва,Санкт-Петербург',
            'Аттестат,Результаты тестирования',
            'Программист,Тестировщик,Системный администратор',
            'https://example.com/specialty'
        ];

        const data = [headers, examples];

        const worksheet = xlsx.utils.aoa_to_sheet(data);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Шаблон');

        // Настройки ширины столбцов
        const colWidths = [
            { wch: 15 }, // Код
            { wch: 40 }, // Название
            { wch: 50 }, // Описание
            { wch: 20 }, // Уровень образования
            { wch: 30 }, // Типы по Климову
            { wch: 40 }, // Дисциплины
            { wch: 20 }, // Срок обучения
            { wch: 15 }, // Форма обучения
            { wch: 20 }, // Тип финансирования
            { wch: 40 }, // Колледжи
            { wch: 20 }, // Города
            { wch: 30 }, // Требования
            { wch: 40 }, // Перспективы
            { wch: 30 }  // Ссылка
        ];

        worksheet['!cols'] = colWidths;

        // Стили для заголовков
        const range = xlsx.utils.decode_range(worksheet['!ref']);
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = xlsx.utils.encode_cell({ r: 0, c: C });
            if (worksheet[cellAddress]) {
                worksheet[cellAddress].s = {
                    font: { bold: true },
                    fill: { fgColor: { rgb: "E6E6E6" } },
                    alignment: { wrapText: true, vertical: "center" }
                };
            }
        }

        // Примеры данных
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = xlsx.utils.encode_cell({ r: 1, c: C });
            if (worksheet[cellAddress]) {
                worksheet[cellAddress].s = {
                    fill: { fgColor: { rgb: "F2F2F2" } },
                    alignment: { wrapText: true, vertical: "center" }
                };
            }
        }

        const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="template_import_specialties.xlsx"');
        res.send(buffer);

    } catch (error) {
        console.error('Ошибка при создании шаблона:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при создании шаблона'
        });
    }
};

export const validateImportFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Файл не загружен'
            });
        }

        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

        if (data.length < 2) {
            return res.json({
                success: false,
                message: 'Файл должен содержать хотя бы одну строку данных после заголовков',
                validation: { isValid: false, errors: ['Файл пустой или содержит только заголовки'] }
            });
        }

        const headers = data[0].map(h => h ? h.toString().trim().toLowerCase() : '');
        const requiredFields = ['код', 'название'];
        const validation = {
            isValid: true,
            errors: [],
            warnings: [],
            stats: {
                totalRows: data.length - 1,
                columns: headers.length,
                missingColumns: [],
                foundColumns: headers
            }
        };

        // Проверяем обязательные поля
        requiredFields.forEach(field => {
            if (!headers.includes(field)) {
                validation.isValid = false;
                validation.errors.push(`Отсутствует обязательная колонка: "${field}"`);
                validation.stats.missingColumns.push(field);
            }
        });

        // Проверяем данные
        const sampleData = [];
        for (let i = 1; i < Math.min(5, data.length); i++) {
            const row = data[i];
            const rowData = {};
            headers.forEach((header, index) => {
                if (header && row[index] !== undefined) {
                    rowData[header] = row[index];
                }
            });
            sampleData.push(rowData);
        }

        validation.sampleData = sampleData;
        validation.headers = headers;

        res.json({
            success: true,
            message: 'Файл проверен',
            validation
        });
    } catch (error) {
        console.error('Ошибка при проверке файла:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при проверке файла',
            error: error.message
        });
    }
};