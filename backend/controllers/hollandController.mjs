import User from '../models/User.mjs';
import Specialty from '../models/Specialty.mjs';

// Вопросы методики Голланда (Холланда) - 42 вопроса
const HOLLAND_QUESTIONS = [
    // Реалистичный тип (R) - 1-7
    { id: 1, text: 'Вы любите работать с инструментами, механизмами, станками.', type: 'realistic' },
    { id: 2, text: 'Вам нравится ремонтировать технику, бытовые приборы.', type: 'realistic' },
    { id: 3, text: 'Вы предпочитаете работать на свежем воздухе, а не в помещении.', type: 'realistic' },
    { id: 4, text: 'Вам нравится заниматься спортом, физическими упражнениями.', type: 'realistic' },
    { id: 5, text: 'Вы умеете обращаться с чертежами, схемами.', type: 'realistic' },
    { id: 6, text: 'Вы предпочитаете работать руками, а не головой.', type: 'realistic' },
    { id: 7, text: 'Вам нравится собирать и разбирать различные конструкции.', type: 'realistic' },
    
    // Исследовательский тип (I) - 8-14
    { id: 8, text: 'Вы любите решать сложные задачи, головоломки.', type: 'investigative' },
    { id: 9, text: 'Вам нравится читать научную литературу, статьи.', type: 'investigative' },
    { id: 10, text: 'Вы предпочитаете анализировать данные, проводить исследования.', type: 'investigative' },
    { id: 11, text: 'Вам интересно наблюдать за природными явлениями.', type: 'investigative' },
    { id: 12, text: 'Вы любите экспериментировать, проверять гипотезы.', type: 'investigative' },
    { id: 13, text: 'Вам нравится работать с формулами и вычислениями.', type: 'investigative' },
    { id: 14, text: 'Вы предпочитаете разбираться в причинах явлений.', type: 'investigative' },
    
    // Артистический тип (A) - 15-21
    { id: 15, text: 'Вы любите рисовать, фотографировать, создавать что-то своими руками.', type: 'artistic' },
    { id: 16, text: 'Вам нравится посещать выставки, театры, концерты.', type: 'artistic' },
    { id: 17, text: 'Вы предпочитаете творческие задания.', type: 'artistic' },
    { id: 18, text: 'Вам нравится сочинять истории, стихи, музыку.', type: 'artistic' },
    { id: 19, text: 'Вы любите импровизировать, экспериментировать с образами.', type: 'artistic' },
    { id: 20, text: 'Вам нравится заниматься дизайном, оформлением.', type: 'artistic' },
    { id: 21, text: 'Вы предпочитаете выражать себя через творчество.', type: 'artistic' },
    
    // Социальный тип (S) - 22-28
    { id: 22, text: 'Вам нравится помогать другим людям.', type: 'social' },
    { id: 23, text: 'Вы любите обучать, объяснять что-то другим.', type: 'social' },
    { id: 24, text: 'Вам легко находить общий язык с разными людьми.', type: 'social' },
    { id: 25, text: 'Вы предпочитаете работать в команде, а не в одиночку.', type: 'social' },
    { id: 26, text: 'Вам нравится заботиться о детях, пожилых людях.', type: 'social' },
    { id: 27, text: 'Вы любите организовывать мероприятия для людей.', type: 'social' },
    { id: 28, text: 'Вам важно чувствовать, что вы приносите пользу людям.', type: 'social' },
    
    // Предприимчивый тип (E) - 29-35
    { id: 29, text: 'Вы любите руководить, организовывать работу других.', type: 'enterprising' },
    { id: 30, text: 'Вам нравится убеждать людей, отстаивать свою точку зрения.', type: 'enterprising' },
    { id: 31, text: 'Вы предпочитаете активные действия, а не размышления.', type: 'enterprising' },
    { id: 32, text: 'Вам интересно заниматься бизнесом, продажами.', type: 'enterprising' },
    { id: 33, text: 'Вы любите рисковать, пробовать новое.', type: 'enterprising' },
    { id: 34, text: 'Вам нравится участвовать в конкурсах, соревнованиях.', type: 'enterprising' },
    { id: 35, text: 'Вы предпочитаете быть лидером, а не подчиненным.', type: 'enterprising' },
    
    // Конвенциональный тип (C) - 36-42
    { id: 36, text: 'Вы любите работать с документами, цифрами, отчетами.', type: 'conventional' },
    { id: 37, text: 'Вам нравится систематизировать информацию, вести учет.', type: 'conventional' },
    { id: 38, text: 'Вы предпочитаете четкие инструкции и правила.', type: 'conventional' },
    { id: 39, text: 'Вам нравится работать с компьютерными программами, базами данных.', type: 'conventional' },
    { id: 40, text: 'Вы любите порядок и структуру во всем.', type: 'conventional' },
    { id: 41, text: 'Вам нравится проверять и контролировать качество.', type: 'conventional' },
    { id: 42, text: 'Вы предпочитаете стабильную, предсказуемую работу.', type: 'conventional' }
];

const TOTAL_QUESTIONS = 42;

const HOLLAND_TYPE_NAMES = {
    realistic: { 
        name: 'Реалистичный', 
        description: 'Практичный, конкретный, предпочитает работу с инструментами, техникой, механизмами.',
        color: '#3b82f6',
        short: 'Р'
    },
    investigative: { 
        name: 'Исследовательский', 
        description: 'Аналитический, любознательный, предпочитает исследовательскую деятельность.',
        color: '#10b981',
        short: 'И'
    },
    artistic: { 
        name: 'Артистический', 
        description: 'Творческий, эмоциональный, предпочитает самовыражение через искусство.',
        color: '#ec4899',
        short: 'А'
    },
    social: { 
        name: 'Социальный', 
        description: 'Коммуникабельный, предпочитает работу с людьми, помощь и обучение.',
        color: '#f59e0b',
        short: 'С'
    },
    enterprising: { 
        name: 'Предприимчивый', 
        description: 'Энергичный, предпочитает руководящую работу, бизнес, влияние.',
        color: '#8b5cf6',
        short: 'П'
    },
    conventional: { 
        name: 'Конвенциональный', 
        description: 'Организованный, предпочитает работу с документами, учет, контроль.',
        color: '#6b7280',
        short: 'К'
    }
};

// Связь типов Голланда с типами Климова
const HOLLAND_TO_KLIMOV = {
    realistic: ['manTech'],
    investigative: ['manSign', 'manNature'],
    artistic: ['manArt'],
    social: ['manHuman'],
    enterprising: ['manHuman', 'manSign'],
    conventional: ['manSign']
};

export const getHollandTest = async (req, res) => {
    try {
        console.log('Starting Holland test for user:', req.user?._id);
        
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Необходима авторизация'
            });
        }

        // Перемешиваем вопросы для случайного порядка
        const shuffledQuestions = [...HOLLAND_QUESTIONS].sort(() => Math.random() - 0.5);
        
        // Создаем копию оставшихся вопросов без первого
        const remainingQuestions = shuffledQuestions.slice(1).map(q => ({ ...q }));
        
        const testSession = {
            sessionId: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            answers: [],
            scores: {
                realistic: 0,
                investigative: 0,
                artistic: 0,
                social: 0,
                enterprising: 0,
                conventional: 0
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
        console.error('Ошибка при получении теста Голланда:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении теста: ' + error.message
        });
    }
};

export const submitHollandAnswer = async (req, res) => {
    try {
        console.log('Processing Holland answer for user:', req.user?._id);

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
        const question = HOLLAND_QUESTIONS.find(q => q.id === parseInt(questionId));
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
                realistic: 0,
                investigative: 0,
                artistic: 0,
                social: 0,
                enterprising: 0,
                conventional: 0
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
                console.log('Test completed, calling completeHollandTest');
                return await completeHollandTest(userId, updatedSession, res);
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
                return await completeHollandTest(userId, updatedSession, res);
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
        console.error('Ошибка при обработке ответа Голланда:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Ошибка при обработке ответа: ' + error.message
        });
    }
};

async function completeHollandTest(userId, testSession, res) {
    try {
        console.log('Completing Holland test for user:', userId);
        console.log('Test session scores:', testSession.scores);
        console.log('Answers count:', testSession.answers?.length);

        // Подсчитываем количество вопросов по каждому типу
        const typeCounts = {};
        const typeScores = { ...testSession.scores };
        
        // Инициализируем счетчики для всех типов
        const allTypes = ['realistic', 'investigative', 'artistic', 'social', 'enterprising', 'conventional'];
        
        allTypes.forEach(type => {
            typeCounts[type] = 0;
        });

        // Подсчитываем, сколько вопросов было по каждому типу
        testSession.answers.forEach(answer => {
            const question = HOLLAND_QUESTIONS.find(q => q.id === answer.questionId);
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
                name: String(HOLLAND_TYPE_NAMES[type]?.name || type),
                description: HOLLAND_TYPE_NAMES[type]?.description || '',
                color: HOLLAND_TYPE_NAMES[type]?.color || '#6366f1'
            }));

        const primaryType = sortedTypes[0]?.type || '';
        const topThreeTypes = sortedTypes.slice(0, 3);

        console.log('Primary type:', primaryType);
        console.log('Top three types:', topThreeTypes);

        // Определяем типы Климова на основе результатов Голланда
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
            const klimovTypes = HOLLAND_TO_KLIMOV[type] || [];
            
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

        // Рекомендуем специальности на основе типов Климова и Голланда
        const klimovTypesForSearch = [];
        topThreeTypes.forEach(({ type }) => {
            const relatedKlimovTypes = HOLLAND_TO_KLIMOV[type] || [];
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
                hollandTypes: topThreeTypes.map(t => t.type),
                duration: String(specialty.duration || ''),
                form: String(specialty.form || 'full-time'),
                educationLevel: String(specialty.educationLevel || 'SPO')
            };
        });

        specialtiesWithMatch.sort((a, b) => b.matchPercentage - a.matchPercentage);

        // Создаем testResult
        const testResult = {
            testType: 'holland',
            date: new Date(),
            hollandScores: finalScores,
            primaryHollandType: String(primaryType),
            topHollandTypes: topThreeTypes,
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
        console.error('Ошибка при завершении теста Голланда:', error);
        console.error('Error stack:', error.stack);
        
        res.status(500).json({
            success: false,
            message: 'Ошибка при завершении теста: ' + error.message,
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}

export const getHollandResults = async (req, res) => {
    try {
        console.log('Getting Holland results for user:', req.user?._id);
        
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

        const hollandResults = (user.testResults || [])
            .filter(r => r && r.testType === 'holland')
            .map(r => {
                const result = r.toObject ? r.toObject() : r;
                return {
                    ...result,
                    date: result.date || new Date()
                };
            });

        console.log(`Found ${hollandResults.length} Holland results`);

        res.json({
            success: true,
            results: hollandResults
        });
    } catch (error) {
        console.error('Ошибка при получении результатов Голланда:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении результатов: ' + error.message
        });
    }
};

export const getHollandProgress = async (req, res) => {
    try {
        console.log('Getting Holland progress for user:', req.user?._id);
        
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

        const hollandResults = (user.testResults || [])
            .filter(r => r && r.testType === 'holland');
        
        const progress = {
            totalTests: hollandResults.length,
            lastTestDate: hollandResults.length > 0 ? 
                hollandResults[hollandResults.length - 1].date : null,
            primaryTypes: hollandResults.map(r => ({
                type: r.primaryHollandType,
                date: r.date,
                scores: r.hollandScores || {}
            }))
        };

        res.json({
            success: true,
            progress
        });
    } catch (error) {
        console.error('Ошибка при получении прогресса Голланда:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении прогресса: ' + error.message
        });
    }
};

export const getPreviousHollandQuestion = async (req, res) => {
    try {
        console.log('Getting previous Holland question for user:', req.user?._id);
        
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
        console.error('Ошибка при возврате к предыдущему вопросу Голланда:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при возврате к предыдущему вопросу: ' + error.message
        });
    }
};