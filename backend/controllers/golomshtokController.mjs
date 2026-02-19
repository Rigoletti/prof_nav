import User from '../models/User.mjs';
import Specialty from '../models/Specialty.mjs';
import mongoose from 'mongoose';

// Вопросы методики "Карта интересов" А.Е. Голомштока
const GOLOMShtok_QUESTIONS = [
    // Физика и математика (1-5)
    { id: 1, text: 'Узнавать об открытиях в области физики и математики.', type: 'physics' },
    { id: 2, text: 'Смотреть передачи о физике и математике по телевидению.', type: 'physics' },
    { id: 3, text: 'Читать научно-популярные журналы о физике и математике.', type: 'physics' },
    { id: 4, text: 'Решать математические задачи и головоломки.', type: 'physics' },
    { id: 5, text: 'Проводить опыты по физике.', type: 'physics' },
    
    // Химия и биология (6-10)
    { id: 6, text: 'Узнавать об открытиях в области химии и биологии.', type: 'chemistry' },
    { id: 7, text: 'Смотреть передачи о химии и биологии по телевидению.', type: 'chemistry' },
    { id: 8, text: 'Читать научно-популярные журналы о химии и биологии.', type: 'chemistry' },
    { id: 9, text: 'Проводить опыты по химии.', type: 'chemistry' },
    { id: 10, text: 'Наблюдать за биологическими процессами, ухаживать за растениями.', type: 'chemistry' },
    
    // Радиотехника и электроника (11-15)
    { id: 11, text: 'Знакомиться с работой электротехника или радиомеханика.', type: 'electronics' },
    { id: 12, text: 'Собирать и ремонтировать радиоприемники, электроприборы.', type: 'electronics' },
    { id: 13, text: 'Разбираться в схемах электронных устройств.', type: 'electronics' },
    { id: 14, text: 'Читать журналы о радиоэлектронике.', type: 'electronics' },
    { id: 15, text: 'Работать с компьютером, программировать.', type: 'electronics' },
    
    // Механика и конструирование (16-20)
    { id: 16, text: 'Знакомиться с работой механика или конструктора.', type: 'mechanics' },
    { id: 17, text: 'Читать журналы о технике, автомобилях.', type: 'mechanics' },
    { id: 18, text: 'Ремонтировать бытовую технику, механизмы.', type: 'mechanics' },
    { id: 19, text: 'Разбираться в чертежах и схемах механизмов.', type: 'mechanics' },
    { id: 20, text: 'Конструировать модели, детали.', type: 'mechanics' },
    
    // География и геология (21-25)
    { id: 21, text: 'Знакомиться с работой геолога или географа.', type: 'geography' },
    { id: 22, text: 'Смотреть передачи о путешествиях и географических открытиях.', type: 'geography' },
    { id: 23, text: 'Собирать коллекции минералов, камней.', type: 'geography' },
    { id: 24, text: 'Изучать карты, путешествовать.', type: 'geography' },
    { id: 25, text: 'Читать о географических открытиях.', type: 'geography' },
    
    // Литература и искусство (26-30)
    { id: 26, text: 'Знакомиться с работой писателя, художника, актера.', type: 'literature' },
    { id: 27, text: 'Посещать театры, музеи, выставки.', type: 'literature' },
    { id: 28, text: 'Читать художественную литературу.', type: 'literature' },
    { id: 29, text: 'Пробовать писать стихи или рассказы.', type: 'literature' },
    { id: 30, text: 'Заниматься рисованием, фотографией.', type: 'literature' },
    
    // История и политика (31-35)
    { id: 31, text: 'Знакомиться с работой историка или политика.', type: 'history' },
    { id: 32, text: 'Смотреть передачи на исторические и политические темы.', type: 'history' },
    { id: 33, text: 'Читать исторические романы, книги по истории.', type: 'history' },
    { id: 34, text: 'Обсуждать политические события.', type: 'history' },
    { id: 35, text: 'Участвовать в исторических реконструкциях.', type: 'history' },
    
    // Педагогика и медицина (36-40)
    { id: 36, text: 'Знакомиться с работой учителя или врача.', type: 'pedagogy' },
    { id: 37, text: 'Заботиться о детях, помогать им.', type: 'pedagogy' },
    { id: 38, text: 'Читать о педагогике или медицине.', type: 'pedagogy' },
    { id: 39, text: 'Оказывать первую помощь.', type: 'pedagogy' },
    { id: 40, text: 'Учить кого-то чему-то.', type: 'pedagogy' },
    
    // Предпринимательство (41-45)
    { id: 41, text: 'Знакомиться с работой предпринимателя.', type: 'entrepreneurship' },
    { id: 42, text: 'Смотреть передачи о бизнесе.', type: 'entrepreneurship' },
    { id: 43, text: 'Заниматься планированием бюджета.', type: 'entrepreneurship' },
    { id: 44, text: 'Участвовать в ярмарках, продажах.', type: 'entrepreneurship' },
    { id: 45, text: 'Организовывать мероприятия.', type: 'entrepreneurship' },
    
    // Спорт и военное дело (46-50)
    { id: 46, text: 'Знакомиться с работой спортсмена или военного.', type: 'sports' },
    { id: 47, text: 'Смотреть спортивные передачи.', type: 'sports' },
    { id: 48, text: 'Заниматься спортом, участвовать в соревнованиях.', type: 'sports' },
    { id: 49, text: 'Читать о спорте или военном деле.', type: 'sports' },
    { id: 50, text: 'Ходить в походы, заниматься туризмом.', type: 'sports' }
];

const TOTAL_QUESTIONS = 50;

const KLIMOV_TYPE_NAMES = {
    manNature: 'Человек-Природа',
    manTech: 'Человек-Техника',
    manHuman: 'Человек-Человек',
    manSign: 'Человек-Знаковая система',
    manArt: 'Человек-Искусство'
};

const GOLOMShtok_TYPE_NAMES = {
    physics: 'Физика и математика',
    chemistry: 'Химия и биология',
    electronics: 'Радиотехника и электроника',
    mechanics: 'Механика и конструирование',
    geography: 'География и геология',
    literature: 'Литература и искусство',
    history: 'История и политика',
    pedagogy: 'Педагогика и медицина',
    entrepreneurship: 'Предпринимательство',
    sports: 'Спорт и военное дело'
};

// Связь типов Голомштока с типами Климова
const GOLOMShtok_TO_KLIMOV = {
    physics: ['manSign', 'manTech'],
    chemistry: ['manNature', 'manSign'],
    electronics: ['manTech', 'manSign'],
    mechanics: ['manTech'],
    geography: ['manNature', 'manSign'],
    literature: ['manArt', 'manHuman'],
    history: ['manHuman', 'manSign'],
    pedagogy: ['manHuman'],
    entrepreneurship: ['manHuman', 'manSign'],
    sports: ['manHuman', 'manTech']
};

export const getGolomshtokTest = async (req, res) => {
    try {
        console.log('Starting Golomshtok test for user:', req.user?._id);
        
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Необходима авторизация'
            });
        }

        // Перемешиваем вопросы для случайного порядка
        const shuffledQuestions = [...GOLOMShtok_QUESTIONS].sort(() => Math.random() - 0.5);
        
        // Создаем копию оставшихся вопросов без первого
        const remainingQuestions = shuffledQuestions.slice(1).map(q => ({ ...q }));
        
        const testSession = {
            sessionId: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            answers: [],
            scores: {
                physics: 0,
                chemistry: 0,
                electronics: 0,
                mechanics: 0,
                geography: 0,
                literature: 0,
                history: 0,
                pedagogy: 0,
                entrepreneurship: 0,
                sports: 0
            },
            remainingQuestions: remainingQuestions,
            previousQuestions: [],
            currentQuestion: { ...shuffledQuestions[0] }
        };

        console.log('Test session created with first question:', testSession.currentQuestion.id);

        res.json({
            success: true,
            testSession,
            question: testSession.currentQuestion,
            totalQuestions: TOTAL_QUESTIONS,
            currentQuestionNumber: 1,
            progress: 0,
            canGoBack: false
        });
    } catch (error) {
        console.error('Ошибка при получении теста Голомштока:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении теста: ' + error.message
        });
    }
};

export const submitGolomshtokAnswer = async (req, res) => {
    try {
        console.log('Processing Golomshtok answer for user:', req.user?._id);
        console.log('Request body:', JSON.stringify(req.body, null, 2));

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Необходима авторизация'
            });
        }

        const userId = req.user._id;
        const { questionId, answer, testSession, action = 'next' } = req.body;

        // Валидация входных данных
        if (!questionId) {
            return res.status(400).json({
                success: false,
                message: 'ID вопроса обязателен'
            });
        }

        if (answer === undefined || answer === null) {
            return res.status(400).json({
                success: false,
                message: 'Ответ обязателен'
            });
        }

        if (!testSession) {
            return res.status(400).json({
                success: false,
                message: 'Данные сессии теста обязательны'
            });
        }

        // Проверка допустимых значений ответа
        if (!['+', '+-', '-'].includes(answer)) {
            return res.status(400).json({
                success: false,
                message: 'Недопустимое значение ответа'
            });
        }

        // Поиск вопроса
        const question = GOLOMShtok_QUESTIONS.find(q => q.id === parseInt(questionId));
        if (!question) {
            return res.status(400).json({
                success: false,
                message: `Вопрос с ID ${questionId} не найден`
            });
        }

        console.log('Found question:', question);

        // Создаем глубокую копию сессии для избежания мутаций
        const updatedSession = {
            sessionId: testSession.sessionId,
            answers: testSession.answers ? [...testSession.answers] : [],
            scores: { ...testSession.scores } || {
                physics: 0,
                chemistry: 0,
                electronics: 0,
                mechanics: 0,
                geography: 0,
                literature: 0,
                history: 0,
                pedagogy: 0,
                entrepreneurship: 0,
                sports: 0
            },
            remainingQuestions: testSession.remainingQuestions ? [...testSession.remainingQuestions] : [],
            previousQuestions: testSession.previousQuestions ? [...testSession.previousQuestions] : [],
            currentQuestion: testSession.currentQuestion ? { ...testSession.currentQuestion } : null
        };

        if (action === 'next') {
            console.log('Processing next action');
            
            // Проверяем, отвечали ли уже на этот вопрос
            const existingAnswerIndex = updatedSession.answers.findIndex(a => a.questionId === parseInt(questionId));
            
            // Вычисляем значение ответа
            const answerValue = answer === '+' ? 2 : (answer === '+-' ? 1 : 0);
            
            if (existingAnswerIndex !== -1) {
                // Если уже отвечали, обновляем ответ и корректируем счет
                const oldAnswer = updatedSession.answers[existingAnswerIndex];
                const oldValue = oldAnswer.answer === '+' ? 2 : (oldAnswer.answer === '+-' ? 1 : 0);
                
                // Обновляем счет
                updatedSession.scores[question.type] = (updatedSession.scores[question.type] || 0) - oldValue + answerValue;
                
                // Обновляем ответ - используем Date объект, не toISOString()
                updatedSession.answers[existingAnswerIndex] = {
                    questionId: parseInt(questionId),
                    answer: answer,
                    timestamp: new Date() // !!! ВАЖНО: используем Date объект, а не строку
                };
                
                console.log('Updated existing answer for question', questionId);
            } else {
                // Добавляем новый ответ - используем Date объект, не toISOString()
                updatedSession.answers.push({
                    questionId: parseInt(questionId),
                    answer: answer,
                    timestamp: new Date() // !!! ВАЖНО: используем Date объект, а не строку
                });

                // Обновляем счет
                updatedSession.scores[question.type] = (updatedSession.scores[question.type] || 0) + answerValue;
                
                console.log('Added new answer for question', questionId);
            }

            console.log('Answers count:', updatedSession.answers.length);
            console.log('Current scores:', updatedSession.scores);

            // Проверяем, завершен ли тест
            if (updatedSession.answers.length >= TOTAL_QUESTIONS) {
                console.log('Test completed, calling completeGolomshtokTest');
                return await completeGolomshtokTest(userId, updatedSession, res);
            }

            // Берем следующий вопрос из оставшихся
            if (updatedSession.remainingQuestions && updatedSession.remainingQuestions.length > 0) {
                const nextQuestion = { ...updatedSession.remainingQuestions[0] };
                
                updatedSession.currentQuestion = nextQuestion;
                updatedSession.remainingQuestions = updatedSession.remainingQuestions.slice(1);
                
                // Добавляем в историю предыдущих вопросов
                updatedSession.previousQuestions.push({
                    questionId: parseInt(questionId),
                    answer: answer,
                    question: { ...question }
                });
                
                console.log('Next question:', nextQuestion.id);
            } else {
                // Если нет оставшихся вопросов, завершаем тест
                console.log('No remaining questions, completing test');
                return await completeGolomshtokTest(userId, updatedSession, res);
            }

        } else if (action === 'prev') {
            console.log('Processing prev action');
            
            if (!testSession.previousQuestions || testSession.previousQuestions.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Нет предыдущих вопросов'
                });
            }

            // Возвращаемся к предыдущему вопросу
            const lastQuestionData = testSession.previousQuestions[testSession.previousQuestions.length - 1];
            
            // Удаляем текущий ответ из answers
            const currentAnswerIndex = updatedSession.answers.findIndex(a => a.questionId === parseInt(questionId));
            if (currentAnswerIndex !== -1) {
                const currentAnswer = updatedSession.answers[currentAnswerIndex];
                const currentValue = currentAnswer.answer === '+' ? 2 : (currentAnswer.answer === '+-' ? 1 : 0);
                
                updatedSession.scores[question.type] = (updatedSession.scores[question.type] || 0) - currentValue;
                
                updatedSession.answers.splice(currentAnswerIndex, 1);
            }

            // Возвращаем текущий вопрос в remainingQuestions
            if (updatedSession.currentQuestion) {
                updatedSession.remainingQuestions = [
                    { ...updatedSession.currentQuestion },
                    ...updatedSession.remainingQuestions
                ];
            }

            // Устанавливаем предыдущий вопрос как текущий
            updatedSession.currentQuestion = { ...lastQuestionData.question };
            updatedSession.previousQuestions = testSession.previousQuestions.slice(0, -1);
        }

        const currentQuestionNumber = updatedSession.answers.length + 1;
        const progress = Math.round((updatedSession.answers.length / TOTAL_QUESTIONS) * 100);

        console.log('Sending response with question number:', currentQuestionNumber);

        res.json({
            success: true,
            testSession: updatedSession,
            question: updatedSession.currentQuestion,
            totalQuestions: TOTAL_QUESTIONS,
            currentQuestionNumber: currentQuestionNumber,
            progress: progress,
            canGoBack: updatedSession.previousQuestions && updatedSession.previousQuestions.length > 0
        });

    } catch (error) {
        console.error('Ошибка при обработке ответа Голомштока:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Ошибка при обработке ответа: ' + error.message
        });
    }
};

async function completeGolomshtokTest(userId, testSession, res) {
    try {
        console.log('Completing Golomshtok test for user:', userId);
        console.log('Test session scores:', testSession.scores);
        console.log('Answers count:', testSession.answers?.length);

        // Подсчитываем количество вопросов по каждому типу
        const typeCounts = {};
        const typeScores = { ...testSession.scores };
        
        // Инициализируем счетчики для всех типов
        const allTypes = ['physics', 'chemistry', 'electronics', 'mechanics', 'geography', 
                         'literature', 'history', 'pedagogy', 'entrepreneurship', 'sports'];
        
        allTypes.forEach(type => {
            typeCounts[type] = 0;
        });

        // Подсчитываем, сколько вопросов было по каждому типу
        testSession.answers.forEach(answer => {
            const question = GOLOMShtok_QUESTIONS.find(q => q.id === answer.questionId);
            if (question) {
                typeCounts[question.type] = (typeCounts[question.type] || 0) + 1;
            }
        });

        console.log('Question counts per type:', typeCounts);

        // Вычисляем итоговые проценты на основе количества отвеченных вопросов по каждому типу
        const finalScores = {};
        
        allTypes.forEach(type => {
            const count = typeCounts[type];
            const score = typeScores[type] || 0;
            
            if (count === 0) {
                finalScores[type] = 0;
            } else {
                const maxPossibleScore = count * 2;
                const percentage = Math.round((score / maxPossibleScore) * 100);
                finalScores[type] = Math.min(100, percentage);
            }
        });

        console.log('Final scores (corrected):', finalScores);

        // Сортируем типы по убыванию баллов
        const sortedTypes = Object.entries(finalScores)
            .filter(([_, score]) => !isNaN(score))
            .sort((a, b) => b[1] - a[1])
            .map(([type, score]) => ({ 
                type: String(type), 
                score: Number(score), 
                name: String(GOLOMShtok_TYPE_NAMES[type] || type)
            }));

        const primaryType = sortedTypes[0]?.type || '';
        const topThreeTypes = sortedTypes.slice(0, 3);

        console.log('Primary type:', primaryType);
        console.log('Top three types:', topThreeTypes);

        // Определяем типы Климова на основе результатов Голомштока
        const klimovScores = {
            manNature: 0,
            manTech: 0,
            manHuman: 0,
            manSign: 0,
            manArt: 0
        };

        // Учитываем все типы с весом, пропорциональным баллам
        sortedTypes.forEach(({ type, score }) => {
            const weight = score / 100;
            const klimovTypes = GOLOMShtok_TO_KLIMOV[type] || [];
            
            klimovTypes.forEach(klimovType => {
                if (klimovScores.hasOwnProperty(klimovType)) {
                    klimovScores[klimovType] += weight * 20;
                }
            });
        });

        // Нормализуем баллы Климова до 100
        Object.keys(klimovScores).forEach(type => {
            klimovScores[type] = Math.min(100, Math.round(klimovScores[type]));
        });

        console.log('Klimov scores:', klimovScores);

        // Определяем первичный тип Климова
        const primaryKlimovType = Object.entries(klimovScores)
            .sort((a, b) => b[1] - a[1])
            .map(([type]) => type)[0] || '';

        // Рекомендуем специальности на основе типов Климова
        const klimovTypesForSearch = [];
        topThreeTypes.forEach(({ type }) => {
            const relatedKlimovTypes = GOLOMShtok_TO_KLIMOV[type] || [];
            klimovTypesForSearch.push(...relatedKlimovTypes);
        });

        const uniqueKlimovTypes = [...new Set(klimovTypesForSearch)].slice(0, 3);

        console.log('Searching specialties with Klimov types:', uniqueKlimovTypes);

        let recommendedSpecialties = [];
        try {
            if (uniqueKlimovTypes.length > 0) {
                recommendedSpecialties = await Specialty.find({
                    klimovTypes: { $in: uniqueKlimovTypes }
                })
                .populate('colleges')
                .limit(10)
                .lean();
            }
        } catch (error) {
            console.error('Ошибка при поиске специальностей:', error);
        }

        const specialtiesWithMatch = recommendedSpecialties.map(specialty => {
            let totalScore = 0;
            let matchCount = 0;
            
            const specialtyKlimovTypes = specialty.klimovTypes || [];
            
            specialtyKlimovTypes.forEach(type => {
                if (klimovScores[type] !== undefined) {
                    totalScore += klimovScores[type];
                    matchCount++;
                }
            });

            const matchPercentage = matchCount > 0 ? Math.round(totalScore / matchCount) : 0;
            
            const matchReasons = [];
            specialtyKlimovTypes.forEach(type => {
                if (klimovScores[type] !== undefined) {
                    matchReasons.push(`${KLIMOV_TYPE_NAMES[type]}: ${klimovScores[type]}%`);
                }
            });

            // Получаем название колледжа
            let collegeName = '';
            let collegeId = null;
            
            if (specialty.colleges && specialty.colleges.length > 0) {
                const firstCollege = specialty.colleges[0];
                collegeName = firstCollege.name || '';
                collegeId = firstCollege._id;
            } else if (specialty.collegeNames && specialty.collegeNames.length > 0) {
                collegeName = specialty.collegeNames[0] || '';
            }

            return {
                specialtyId: specialty._id,
                name: String(specialty.name || ''),
                description: String(specialty.description || ''),
                code: String(specialty.code || ''),
                collegeName: String(collegeName),
                collegeId: collegeId,
                matchPercentage: Number(matchPercentage),
                matchReasons: matchReasons.map(r => String(r)),
                klimovTypes: specialtyKlimovTypes.map(t => String(t)),
                duration: String(specialty.duration || ''),
                form: String(specialty.form || 'full-time'),
                educationLevel: String(specialty.educationLevel || 'SPO')
            };
        });

        specialtiesWithMatch.sort((a, b) => b.matchPercentage - a.matchPercentage);

        // Создаем testResult с правильной структурой, соответствующей модели User
        const testResult = {
            testType: 'golomshtok',
            date: new Date(),
            golomshtokScores: finalScores,
            primaryGolomshtokType: String(primaryType),
            topGolomshtokTypes: topThreeTypes,
            klimovScores: {
                manNature: Number(klimovScores.manNature || 0),
                manTech: Number(klimovScores.manTech || 0),
                manHuman: Number(klimovScores.manHuman || 0),
                manSign: Number(klimovScores.manSign || 0),
                manArt: Number(klimovScores.manArt || 0)
            },
            primaryKlimovType: String(primaryKlimovType),
            recommendedSpecialties: specialtiesWithMatch,
            detailedAnswers: testSession.answers.map(a => ({
                questionId: Number(a.questionId),
                answer: String(a.answer),
                timestamp: a.timestamp || new Date()
            })),
            questionsCount: Number(testSession.answers.length)
        };

        console.log('Saving test result to database');
        console.log('Test result structure:', JSON.stringify(testResult, null, 2));

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Пользователь не найден'
            });
        }

        if (!user.testResults) {
            user.testResults = [];
        }

        user.testResults.push(testResult);
        await user.save();

        console.log('Test result saved successfully');

        res.json({
            success: true,
            message: 'Тест завершен',
            testResult: {
                ...testResult,
                recommendedSpecialties: specialtiesWithMatch.slice(0, 5)
            },
            completed: true,
            finalScores,
            topThreeTypes,
            klimovScores,
            recommendedSpecialties: specialtiesWithMatch.slice(0, 5)
        });

    } catch (error) {
        console.error('Ошибка при завершении теста Голомштока:', error);
        console.error('Error stack:', error.stack);
        
        if (error.name === 'ValidationError') {
            console.error('Validation error details:', error.errors);
        }
        
        // Попытка сохранить невалидные данные для отладки
        try {
            console.log('Attempting to save invalid data structure:');
            if (error.errors) {
                Object.keys(error.errors).forEach(key => {
                    console.log(`Field ${key}:`, error.errors[key].message);
                });
            }
        } catch (e) {
            console.log('Could not log validation errors');
        }
        
        res.status(500).json({
            success: false,
            message: 'Ошибка при завершении теста: ' + error.message,
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}

export const getGolomshtokResults = async (req, res) => {
    try {
        console.log('Getting Golomshtok results for user:', req.user?._id);
        
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Необходима авторизация'
            });
        }

        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Пользователь не найден'
            });
        }

        const golomshtokResults = (user.testResults || [])
            .filter(r => r && r.testType === 'golomshtok')
            .map(r => {
                const result = r.toObject ? r.toObject() : r;
                return {
                    ...result,
                    date: result.date || new Date()
                };
            });

        console.log(`Found ${golomshtokResults.length} Golomshtok results`);

        res.json({
            success: true,
            results: golomshtokResults
        });
    } catch (error) {
        console.error('Ошибка при получении результатов Голомштока:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении результатов: ' + error.message
        });
    }
};

export const getGolomshtokProgress = async (req, res) => {
    try {
        console.log('Getting Golomshtok progress for user:', req.user?._id);
        
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Необходима авторизация'
            });
        }

        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Пользователь не найден'
            });
        }

        const golomshtokResults = (user.testResults || [])
            .filter(r => r && r.testType === 'golomshtok');
        
        const progress = {
            totalTests: golomshtokResults.length,
            lastTestDate: golomshtokResults.length > 0 ? 
                golomshtokResults[golomshtokResults.length - 1].date : null,
            primaryTypes: golomshtokResults.map(r => ({
                type: r.primaryGolomshtokType,
                date: r.date,
                scores: r.golomshtokScores || {}
            }))
        };

        res.json({
            success: true,
            progress
        });
    } catch (error) {
        console.error('Ошибка при получении прогресса Голомштока:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении прогресса: ' + error.message
        });
    }
};

export const getPreviousGolomshtokQuestion = async (req, res) => {
    try {
        console.log('Getting previous Golomshtok question for user:', req.user?._id);
        
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Необходима авторизация'
            });
        }

        const { testSession } = req.body;

        if (!testSession) {
            return res.status(400).json({
                success: false,
                message: 'Данные сессии теста обязательны'
            });
        }

        if (!testSession.previousQuestions || testSession.previousQuestions.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Нет предыдущих вопросов'
            });
        }

        // Создаем глубокую копию сессии
        const updatedSession = {
            sessionId: testSession.sessionId,
            answers: testSession.answers ? [...testSession.answers] : [],
            scores: { ...testSession.scores } || {},
            remainingQuestions: testSession.remainingQuestions ? [...testSession.remainingQuestions] : [],
            previousQuestions: testSession.previousQuestions ? [...testSession.previousQuestions] : [],
            currentQuestion: testSession.currentQuestion ? { ...testSession.currentQuestion } : null
        };
        
        const lastQuestionData = updatedSession.previousQuestions.pop();
        
        // Удаляем текущий ответ из answers
        if (updatedSession.currentQuestion) {
            const currentAnswerIndex = updatedSession.answers.findIndex(
                a => a.questionId === updatedSession.currentQuestion.id
            );
            
            if (currentAnswerIndex !== -1) {
                const currentAnswer = updatedSession.answers[currentAnswerIndex];
                const currentValue = currentAnswer.answer === '+' ? 2 : (currentAnswer.answer === '+-' ? 1 : 0);
                
                if (updatedSession.currentQuestion.type) {
                    updatedSession.scores[updatedSession.currentQuestion.type] = 
                        (updatedSession.scores[updatedSession.currentQuestion.type] || 0) - currentValue;
                }
                
                updatedSession.answers.splice(currentAnswerIndex, 1);
            }
        }

        // Возвращаем текущий вопрос в remainingQuestions
        if (updatedSession.currentQuestion) {
            updatedSession.remainingQuestions = [
                { ...updatedSession.currentQuestion },
                ...updatedSession.remainingQuestions
            ];
        }

        // Устанавливаем предыдущий вопрос как текущий
        updatedSession.currentQuestion = { ...lastQuestionData.question };
        updatedSession.previousQuestions = testSession.previousQuestions.slice(0, -1);

        const currentQuestionNumber = updatedSession.answers.length + 1;
        const progress = Math.round((updatedSession.answers.length / TOTAL_QUESTIONS) * 100);

        res.json({
            success: true,
            testSession: updatedSession,
            question: updatedSession.currentQuestion,
            totalQuestions: TOTAL_QUESTIONS,
            currentQuestionNumber: currentQuestionNumber,
            progress: progress,
            canGoBack: updatedSession.previousQuestions && updatedSession.previousQuestions.length > 0
        });

    } catch (error) {
        console.error('Ошибка при возврате к предыдущему вопросу Голомштока:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при возврате к предыдущему вопросу: ' + error.message
        });
    }
};

export const forceCleanupGolomshtokData = async (req, res) => {
    try {
        console.log('FORCE CLEANUP: Starting complete cleanup of Golomshtok data...');

        // 1. Удаляем все результаты тестов Голомштока у всех пользователей
        const result = await User.updateMany(
            {}, // все пользователи
            { $pull: { testResults: { testType: 'golomshtok' } } }
        );

        console.log(`Removed Golomshtok results from ${result.modifiedCount} users`);

        // 2. Дополнительно проходим по всем пользователям и проверяем
        const users = await User.find({});
        let fixedCount = 0;

        for (const user of users) {
            let modified = false;
            
            // Фильтруем результаты, оставляем только те, которые не golomshtok
            const validResults = user.testResults.filter(r => r.testType !== 'golomshtok');
            
            if (validResults.length !== user.testResults.length) {
                user.testResults = validResults;
                await user.save();
                fixedCount++;
                modified = true;
            }
            
            if (modified) {
                console.log(`Fixed user: ${user.email}`);
            }
        }

        res.json({
            success: true,
            message: 'Полная очистка данных Голомштока завершена',
            stats: {
                usersUpdated: result.modifiedCount,
                usersFixed: fixedCount
            }
        });

    } catch (error) {
        console.error('Error in force cleanup:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при очистке данных: ' + error.message
        });
    }
};