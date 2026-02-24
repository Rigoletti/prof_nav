import User from '../models/User.mjs';
import Specialty from '../models/Specialty.mjs';

// Вопросы теста Я. Йовайши (Склонности к сферам профессиональной деятельности)
const YOVAYSHA_QUESTIONS = [
    // Сфера искусства (1-6)
    { id: 1, text: 'Посещать художественные выставки, театры, концерты.', type: 'art' },
    { id: 2, text: 'Читать литературу по искусству (книги о художниках, музыкантах, театре).', type: 'art' },
    { id: 3, text: 'Заниматься в художественной самодеятельности (петь, танцевать, играть на сцене).', type: 'art' },
    { id: 4, text: 'Создавать что-то своими руками (рисовать, лепить, конструировать).', type: 'art' },
    { id: 5, text: 'Фотографировать, снимать видео, заниматься монтажом.', type: 'art' },
    { id: 6, text: 'Посещать мастер-классы по творческим направлениям.', type: 'art' },
    
    // Техническая сфера (7-12)
    { id: 7, text: 'Разбираться в устройстве механизмов, машин, приборов.', type: 'technical' },
    { id: 8, text: 'Ремонтировать бытовую технику, электронику.', type: 'technical' },
    { id: 9, text: 'Читать техническую литературу, журналы о новинках техники.', type: 'technical' },
    { id: 10, text: 'Работать с компьютером, программировать.', type: 'technical' },
    { id: 11, text: 'Собирать конструкторы, модели, пазлы.', type: 'technical' },
    { id: 12, text: 'Участвовать в технических кружках (робототехника, авиамоделирование).', type: 'technical' },
    
    // Сфера работы с людьми (13-18)
    { id: 13, text: 'Помогать другим людям в решении их проблем.', type: 'workWithPeople' },
    { id: 14, text: 'Обучать, объяснять что-то другим людям.', type: 'workWithPeople' },
    { id: 15, text: 'Организовывать мероприятия, работать с коллективом.', type: 'workWithPeople' },
    { id: 16, text: 'Заботиться о детях, пожилых людях, больных.', type: 'workWithPeople' },
    { id: 17, text: 'Консультировать людей по разным вопросам.', type: 'workWithPeople' },
    { id: 18, text: 'Работать в команде, помогать коллегам.', type: 'workWithPeople' },
    
    // Умственная сфера (19-24)
    { id: 19, text: 'Решать логические задачи, головоломки.', type: 'mental' },
    { id: 20, text: 'Анализировать информацию, делать выводы.', type: 'mental' },
    { id: 21, text: 'Читать научно-популярную литературу.', type: 'mental' },
    { id: 22, text: 'Изучать иностранные языки.', type: 'mental' },
    { id: 23, text: 'Проводить исследования, эксперименты.', type: 'mental' },
    { id: 24, text: 'Работать с цифрами, формулами, таблицами.', type: 'mental' },
    
    // Эстетическая сфера (25-30)
    { id: 25, text: 'Оценивать красоту окружающего мира (природа, архитектура, люди).', type: 'aesthetic' },
    { id: 26, text: 'Создавать красивые вещи, оформлять интерьер.', type: 'aesthetic' },
    { id: 27, text: 'Следить за модой, стилем.', type: 'aesthetic' },
    { id: 28, text: 'Заниматься дизайном (одежды, интерьера, графическим).', type: 'aesthetic' },
    { id: 29, text: 'Коллекционировать произведения искусства.', type: 'aesthetic' },
    { id: 30, text: 'Посещать музеи, выставки, любоваться архитектурой.', type: 'aesthetic' },
    
    // Физическая сфера (31-36)
    { id: 31, text: 'Заниматься спортом, физическими упражнениями.', type: 'physical' },
    { id: 32, text: 'Работать на свежем воздухе, в саду, огороде.', type: 'physical' },
    { id: 33, text: 'Участвовать в спортивных соревнованиях.', type: 'physical' },
    { id: 34, text: 'Ходить в походы, путешествовать, заниматься туризмом.', type: 'physical' },
    { id: 35, text: 'Выполнять работу, требующую физической силы и выносливости.', type: 'physical' },
    { id: 36, text: 'Ухаживать за животными, растениями.', type: 'physical' },
    
    // Экономическая сфера (37-42)
    { id: 37, text: 'Планировать бюджет, вести учет расходов и доходов.', type: 'economic' },
    { id: 38, text: 'Интересоваться экономикой, бизнесом, финансами.', type: 'economic' },
    { id: 39, text: 'Заниматься предпринимательством, продажами.', type: 'economic' },
    { id: 40, text: 'Анализировать рынок, цены, спрос.', type: 'economic' },
    { id: 41, text: 'Участвовать в ярмарках, выставках-продажах.', type: 'economic' },
    { id: 42, text: 'Читать литературу по экономике и бизнесу.', type: 'economic' }
];

const TOTAL_QUESTIONS = 42;

const YOVAYSHA_TYPE_NAMES = {
    art: { 
        name: 'Сфера искусства', 
        description: 'Творческая деятельность, создание художественных образов',
        color: '#ec4899',
        short: 'И'
    },
    technical: { 
        name: 'Техническая сфера', 
        description: 'Работа с техникой, механизмами, приборами',
        color: '#3b82f6',
        short: 'Т'
    },
    workWithPeople: { 
        name: 'Сфера работы с людьми', 
        description: 'Общение, помощь, обучение, обслуживание людей',
        color: '#10b981',
        short: 'Л'
    },
    mental: { 
        name: 'Умственная сфера', 
        description: 'Интеллектуальная деятельность, анализ, исследование',
        color: '#f59e0b',
        short: 'У'
    },
    aesthetic: { 
        name: 'Эстетическая сфера', 
        description: 'Создание и оценка прекрасного, дизайн, стиль',
        color: '#8b5cf6',
        short: 'Э'
    },
    physical: { 
        name: 'Физическая сфера', 
        description: 'Физический труд, спорт, работа на природе',
        color: '#ef4444',
        short: 'Ф'
    },
    economic: { 
        name: 'Экономическая сфера', 
        description: 'Финансы, бизнес, планирование, учет',
        color: '#6366f1',
        short: 'Б'
    }
};

// Связь типов Йовайши с типами Климова
const YOVAYSHA_TO_KLIMOV = {
    art: ['manArt'],
    technical: ['manTech'],
    workWithPeople: ['manHuman'],
    mental: ['manSign'],
    aesthetic: ['manArt'],
    physical: ['manNature', 'manTech'],
    economic: ['manSign', 'manHuman']
};

export const getYovayshaTest = async (req, res) => {
    try {
        console.log('Starting Yovaysha test for user:', req.user?._id);
        
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Необходима авторизация'
            });
        }

        // Перемешиваем вопросы для случайного порядка
        const shuffledQuestions = [...YOVAYSHA_QUESTIONS].sort(() => Math.random() - 0.5);
        
        // Создаем копию оставшихся вопросов без первого
        const remainingQuestions = shuffledQuestions.slice(1).map(q => ({ ...q }));
        
        const testSession = {
            sessionId: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            answers: [],
            scores: {
                art: 0,
                technical: 0,
                workWithPeople: 0,
                mental: 0,
                aesthetic: 0,
                physical: 0,
                economic: 0
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
        console.error('Ошибка при получении теста Йовайши:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении теста: ' + error.message
        });
    }
};

export const submitYovayshaAnswer = async (req, res) => {
    try {
        console.log('Processing Yovaysha answer for user:', req.user?._id);

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
        const question = YOVAYSHA_QUESTIONS.find(q => q.id === parseInt(questionId));
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
                art: 0,
                technical: 0,
                workWithPeople: 0,
                mental: 0,
                aesthetic: 0,
                physical: 0,
                economic: 0
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
                console.log('Test completed, calling completeYovayshaTest');
                return await completeYovayshaTest(userId, updatedSession, res);
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
                return await completeYovayshaTest(userId, updatedSession, res);
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
        console.error('Ошибка при обработке ответа Йовайши:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Ошибка при обработке ответа: ' + error.message
        });
    }
};

async function completeYovayshaTest(userId, testSession, res) {
    try {
        console.log('Completing Yovaysha test for user:', userId);
        console.log('Test session scores:', testSession.scores);
        console.log('Answers count:', testSession.answers?.length);

        // Подсчитываем количество вопросов по каждому типу
        const typeCounts = {};
        const typeScores = { ...testSession.scores };
        
        // Инициализируем счетчики для всех типов
        const allTypes = ['art', 'technical', 'workWithPeople', 'mental', 'aesthetic', 'physical', 'economic'];
        
        allTypes.forEach(type => {
            typeCounts[type] = 0;
        });

        // Подсчитываем, сколько вопросов было по каждому типу
        testSession.answers.forEach(answer => {
            const question = YOVAYSHA_QUESTIONS.find(q => q.id === answer.questionId);
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
                name: String(YOVAYSHA_TYPE_NAMES[type]?.name || type),
                description: YOVAYSHA_TYPE_NAMES[type]?.description || '',
                color: YOVAYSHA_TYPE_NAMES[type]?.color || '#6366f1'
            }));

        const primaryType = sortedTypes[0]?.type || '';
        const topThreeTypes = sortedTypes.slice(0, 3);

        console.log('Primary type:', primaryType);
        console.log('Top three types:', topThreeTypes);

        // Определяем типы Климова на основе результатов Йовайши
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
            const klimovTypes = YOVAYSHA_TO_KLIMOV[type] || [];
            
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
            const relatedKlimovTypes = YOVAYSHA_TO_KLIMOV[type] || [];
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
                yovayshaTypes: topThreeTypes.map(t => t.type),
                duration: String(specialty.duration || ''),
                form: String(specialty.form || 'full-time'),
                educationLevel: String(specialty.educationLevel || 'SPO')
            };
        });

        specialtiesWithMatch.sort((a, b) => b.matchPercentage - a.matchPercentage);

        // Создаем testResult
        const testResult = {
            testType: 'yovaysha',
            date: new Date(),
            yovayshaScores: finalScores,
            primaryYovayshaType: String(primaryType),
            topYovayshaTypes: topThreeTypes,
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
        console.error('Ошибка при завершении теста Йовайши:', error);
        console.error('Error stack:', error.stack);
        
        res.status(500).json({
            success: false,
            message: 'Ошибка при завершении теста: ' + error.message,
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}

export const getYovayshaResults = async (req, res) => {
    try {
        console.log('Getting Yovaysha results for user:', req.user?._id);
        
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

        const yovayshaResults = (user.testResults || [])
            .filter(r => r && r.testType === 'yovaysha')
            .map(r => {
                const result = r.toObject ? r.toObject() : r;
                return {
                    ...result,
                    date: result.date || new Date()
                };
            });

        console.log(`Found ${yovayshaResults.length} Yovaysha results`);

        res.json({
            success: true,
            results: yovayshaResults
        });
    } catch (error) {
        console.error('Ошибка при получении результатов Йовайши:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении результатов: ' + error.message
        });
    }
};

export const getYovayshaProgress = async (req, res) => {
    try {
        console.log('Getting Yovaysha progress for user:', req.user?._id);
        
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

        const yovayshaResults = (user.testResults || [])
            .filter(r => r && r.testType === 'yovaysha');
        
        const progress = {
            totalTests: yovayshaResults.length,
            lastTestDate: yovayshaResults.length > 0 ? 
                yovayshaResults[yovayshaResults.length - 1].date : null,
            primaryTypes: yovayshaResults.map(r => ({
                type: r.primaryYovayshaType,
                date: r.date,
                scores: r.yovayshaScores || {}
            }))
        };

        res.json({
            success: true,
            progress
        });
    } catch (error) {
        console.error('Ошибка при получении прогресса Йовайши:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении прогресса: ' + error.message
        });
    }
};

export const getPreviousYovayshaQuestion = async (req, res) => {
    try {
        console.log('Getting previous Yovaysha question for user:', req.user?._id);
        
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
        console.error('Ошибка при возврате к предыдущему вопросу Йовайши:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при возврате к предыдущему вопросу: ' + error.message
        });
    }
};