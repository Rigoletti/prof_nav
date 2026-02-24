import User from '../models/User.mjs';
import Specialty from '../models/Specialty.mjs';

// Вопросы методики Л.А. Йовайши (Склонности к профессиональной деятельности)
const YOVAYSHA_LA_QUESTIONS = [
    // Работа с людьми (1-5)
    { id: 1, text: 'Вы с удовольствием общаетесь с разными людьми, знакомитесь с новыми людьми.', type: 'workWithPeople' },
    { id: 2, text: 'Вам нравится помогать людям, решать их проблемы.', type: 'workWithPeople' },
    { id: 3, text: 'Вы любите учить, объяснять, передавать знания другим.', type: 'workWithPeople' },
    { id: 4, text: 'Вам легко работать в коллективе, находить общий язык с коллегами.', type: 'workWithPeople' },
    { id: 5, text: 'Вы предпочитаете профессии, связанные с обслуживанием людей.', type: 'workWithPeople' },
    
    // Умственный труд (6-10)
    { id: 6, text: 'Вы любите решать логические задачи, головоломки.', type: 'mentalWork' },
    { id: 7, text: 'Вам нравится анализировать информацию, делать выводы.', type: 'mentalWork' },
    { id: 8, text: 'Вы предпочитаете работу, требующую интеллектуальных усилий.', type: 'mentalWork' },
    { id: 9, text: 'Вам интересно проводить исследования, эксперименты.', type: 'mentalWork' },
    { id: 10, text: 'Вы любите работать с цифрами, формулами, схемами.', type: 'mentalWork' },
    
    // Техническая работа (11-15)
    { id: 11, text: 'Вы любите разбираться в устройстве механизмов и приборов.', type: 'technicalWork' },
    { id: 12, text: 'Вам нравится ремонтировать, собирать, настраивать технику.', type: 'technicalWork' },
    { id: 13, text: 'Вы предпочитаете работу с инструментами, станками.', type: 'technicalWork' },
    { id: 14, text: 'Вам интересно конструировать, проектировать.', type: 'technicalWork' },
    { id: 15, text: 'Вы любите работать с чертежами, схемами, графиками.', type: 'technicalWork' },
    
    // Эстетическая деятельность (16-20)
    { id: 16, text: 'Вы любите создавать красивые вещи своими руками.', type: 'aestheticWork' },
    { id: 17, text: 'Вам нравится заниматься дизайном, оформлением.', type: 'aestheticWork' },
    { id: 18, text: 'Вы предпочитаете творческие профессии (художник, дизайнер, артист).', type: 'aestheticWork' },
    { id: 19, text: 'Вам интересно рисовать, фотографировать, снимать видео.', type: 'aestheticWork' },
    { id: 20, text: 'Вы любите посещать выставки, театры, концерты.', type: 'aestheticWork' },
    
    // Экстремальная деятельность (21-25)
    { id: 21, text: 'Вы любите рисковать, испытывать острые ощущения.', type: 'extremeWork' },
    { id: 22, text: 'Вам нравятся профессии, связанные с экстремальными условиями.', type: 'extremeWork' },
    { id: 23, text: 'Вы предпочитаете работу, требующую быстрой реакции.', type: 'extremeWork' },
    { id: 24, text: 'Вам интересно заниматься спортом, туризмом.', type: 'extremeWork' },
    { id: 25, text: 'Вы любите соревнования, конкурсы, где нужно проявить себя.', type: 'extremeWork' },
    
    // Плановая деятельность (26-30)
    { id: 26, text: 'Вы любите планировать, организовывать свою работу.', type: 'plannedWork' },
    { id: 27, text: 'Вам нравится работать с документами, отчетами.', type: 'plannedWork' },
    { id: 28, text: 'Вы предпочитаете четкие инструкции и правила.', type: 'plannedWork' },
    { id: 29, text: 'Вам интересно вести учет, контроль, проверять качество.', type: 'plannedWork' },
    { id: 30, text: 'Вы любите порядок и систематизацию во всем.', type: 'plannedWork' }
];

const TOTAL_QUESTIONS = 30;

const YOVAYSHA_LA_TYPE_NAMES = {
    workWithPeople: { 
        name: 'Работа с людьми', 
        description: 'Профессии, связанные с общением, помощью, обучением, обслуживанием людей',
        color: '#10b981',
        short: 'Л'
    },
    mentalWork: { 
        name: 'Умственный труд', 
        description: 'Интеллектуальная деятельность, анализ, исследование, работа с информацией',
        color: '#f59e0b',
        short: 'У'
    },
    technicalWork: { 
        name: 'Техническая работа', 
        description: 'Работа с техникой, механизмами, инструментами, конструирование',
        color: '#3b82f6',
        short: 'Т'
    },
    aestheticWork: { 
        name: 'Эстетическая деятельность', 
        description: 'Творческая работа, создание прекрасного, дизайн, искусство',
        color: '#ec4899',
        short: 'Э'
    },
    extremeWork: { 
        name: 'Экстремальная деятельность', 
        description: 'Работа в экстремальных условиях, спорт, туризм, риск',
        color: '#ef4444',
        short: 'К'
    },
    plannedWork: { 
        name: 'Плановая деятельность', 
        description: 'Работа с документами, планирование, учет, контроль',
        color: '#6366f1',
        short: 'П'
    }
};

// Связь типов Л.А. Йовайши с типами Климова
const YOVAYSHA_LA_TO_KLIMOV = {
    workWithPeople: ['manHuman'],
    mentalWork: ['manSign'],
    technicalWork: ['manTech'],
    aestheticWork: ['manArt'],
    extremeWork: ['manNature', 'manTech'],
    plannedWork: ['manSign']
};

export const getYovayshaLaTest = async (req, res) => {
    try {
        console.log('Starting Yovaysha LA test for user:', req.user?._id);
        
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Необходима авторизация'
            });
        }

        // Перемешиваем вопросы для случайного порядка
        const shuffledQuestions = [...YOVAYSHA_LA_QUESTIONS].sort(() => Math.random() - 0.5);
        
        // Создаем копию оставшихся вопросов без первого
        const remainingQuestions = shuffledQuestions.slice(1).map(q => ({ ...q }));
        
        const testSession = {
            sessionId: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            answers: [],
            scores: {
                workWithPeople: 0,
                mentalWork: 0,
                technicalWork: 0,
                aestheticWork: 0,
                extremeWork: 0,
                plannedWork: 0
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
        console.error('Ошибка при получении теста Л.А. Йовайши:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении теста: ' + error.message
        });
    }
};

export const submitYovayshaLaAnswer = async (req, res) => {
    try {
        console.log('Processing Yovaysha LA answer for user:', req.user?._id);

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
        const question = YOVAYSHA_LA_QUESTIONS.find(q => q.id === parseInt(questionId));
        if (!question) {
            return res.status(400).json({
                success: false,
                message: `Вопрос с ID ${questionId} не найден`
            });
        }

        console.log('Found question:', question);

        // Создаем глубокую копию сессии
        const updatedSession = {
            sessionId: testSession.sessionId,
            answers: testSession.answers ? [...testSession.answers] : [],
            scores: { ...testSession.scores } || {
                workWithPeople: 0,
                mentalWork: 0,
                technicalWork: 0,
                aestheticWork: 0,
                extremeWork: 0,
                plannedWork: 0
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
                
                // Обновляем ответ
                updatedSession.answers[existingAnswerIndex] = {
                    questionId: parseInt(questionId),
                    answer: answer,
                    timestamp: new Date()
                };
                
                console.log('Updated existing answer for question', questionId);
            } else {
                // Добавляем новый ответ
                updatedSession.answers.push({
                    questionId: parseInt(questionId),
                    answer: answer,
                    timestamp: new Date()
                });

                // Обновляем счет
                updatedSession.scores[question.type] = (updatedSession.scores[question.type] || 0) + answerValue;
                
                console.log('Added new answer for question', questionId);
            }

            console.log('Answers count:', updatedSession.answers.length);
            console.log('Current scores:', updatedSession.scores);

            // Проверяем, завершен ли тест
            if (updatedSession.answers.length >= TOTAL_QUESTIONS) {
                console.log('Test completed, calling completeYovayshaLaTest');
                return await completeYovayshaLaTest(userId, updatedSession, res);
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
                return await completeYovayshaLaTest(userId, updatedSession, res);
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
        console.error('Ошибка при обработке ответа Л.А. Йовайши:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Ошибка при обработке ответа: ' + error.message
        });
    }
};

async function completeYovayshaLaTest(userId, testSession, res) {
    try {
        console.log('Completing Yovaysha LA test for user:', userId);
        console.log('Test session scores:', testSession.scores);
        console.log('Answers count:', testSession.answers?.length);

        // Подсчитываем количество вопросов по каждому типу
        const typeCounts = {};
        const typeScores = { ...testSession.scores };
        
        // Инициализируем счетчики для всех типов
        const allTypes = ['workWithPeople', 'mentalWork', 'technicalWork', 'aestheticWork', 'extremeWork', 'plannedWork'];
        
        allTypes.forEach(type => {
            typeCounts[type] = 0;
        });

        // Подсчитываем, сколько вопросов было по каждому типу
        testSession.answers.forEach(answer => {
            const question = YOVAYSHA_LA_QUESTIONS.find(q => q.id === answer.questionId);
            if (question) {
                typeCounts[question.type] = (typeCounts[question.type] || 0) + 1;
            }
        });

        console.log('Question counts per type:', typeCounts);

        // Вычисляем итоговые проценты
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

        console.log('Final scores:', finalScores);

        // Сортируем типы по убыванию баллов
        const sortedTypes = Object.entries(finalScores)
            .filter(([_, score]) => !isNaN(score))
            .sort((a, b) => b[1] - a[1])
            .map(([type, score]) => ({ 
                type: String(type), 
                score: Number(score), 
                name: String(YOVAYSHA_LA_TYPE_NAMES[type]?.name || type),
                description: YOVAYSHA_LA_TYPE_NAMES[type]?.description || '',
                color: YOVAYSHA_LA_TYPE_NAMES[type]?.color || '#6366f1'
            }));

        const primaryType = sortedTypes[0]?.type || '';
        const topThreeTypes = sortedTypes.slice(0, 3);

        console.log('Primary type:', primaryType);
        console.log('Top three types:', topThreeTypes);

        // Определяем типы Климова на основе результатов Л.А. Йовайши
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
            const klimovTypes = YOVAYSHA_LA_TO_KLIMOV[type] || [];
            
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
            const relatedKlimovTypes = YOVAYSHA_LA_TO_KLIMOV[type] || [];
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
                    matchReasons.push(`${type}: ${klimovScores[type]}%`);
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
                yovayshaLaTypes: topThreeTypes.map(t => t.type),
                duration: String(specialty.duration || ''),
                form: String(specialty.form || 'full-time'),
                educationLevel: String(specialty.educationLevel || 'SPO')
            };
        });

        specialtiesWithMatch.sort((a, b) => b.matchPercentage - a.matchPercentage);

        // Создаем testResult
        const testResult = {
            testType: 'yovaysha_la',
            date: new Date(),
            yovayshaLaScores: finalScores,
            primaryYovayshaLaType: String(primaryType),
            topYovayshaLaTypes: topThreeTypes,
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
        console.error('Ошибка при завершении теста Л.А. Йовайши:', error);
        console.error('Error stack:', error.stack);
        
        res.status(500).json({
            success: false,
            message: 'Ошибка при завершении теста: ' + error.message,
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}

export const getYovayshaLaResults = async (req, res) => {
    try {
        console.log('Getting Yovaysha LA results for user:', req.user?._id);
        
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

        const yovayshaLaResults = (user.testResults || [])
            .filter(r => r && r.testType === 'yovaysha_la')
            .map(r => {
                const result = r.toObject ? r.toObject() : r;
                return {
                    ...result,
                    date: result.date || new Date()
                };
            });

        console.log(`Found ${yovayshaLaResults.length} Yovaysha LA results`);

        res.json({
            success: true,
            results: yovayshaLaResults
        });
    } catch (error) {
        console.error('Ошибка при получении результатов Л.А. Йовайши:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении результатов: ' + error.message
        });
    }
};

export const getYovayshaLaProgress = async (req, res) => {
    try {
        console.log('Getting Yovaysha LA progress for user:', req.user?._id);
        
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

        const yovayshaLaResults = (user.testResults || [])
            .filter(r => r && r.testType === 'yovaysha_la');
        
        const progress = {
            totalTests: yovayshaLaResults.length,
            lastTestDate: yovayshaLaResults.length > 0 ? 
                yovayshaLaResults[yovayshaLaResults.length - 1].date : null,
            primaryTypes: yovayshaLaResults.map(r => ({
                type: r.primaryYovayshaLaType,
                date: r.date,
                scores: r.yovayshaLaScores || {}
            }))
        };

        res.json({
            success: true,
            progress
        });
    } catch (error) {
        console.error('Ошибка при получении прогресса Л.А. Йовайши:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении прогресса: ' + error.message
        });
    }
};

export const getPreviousYovayshaLaQuestion = async (req, res) => {
    try {
        console.log('Getting previous Yovaysha LA question for user:', req.user?._id);
        
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
        console.error('Ошибка при возврате к предыдущему вопросу Л.А. Йовайши:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при возврате к предыдущему вопросу: ' + error.message
        });
    }
};