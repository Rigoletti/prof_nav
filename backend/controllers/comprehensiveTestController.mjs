// backend/controllers/comprehensiveTestController.mjs
import User from '../models/User.mjs';
import Specialty from '../models/Specialty.mjs';
import TestSession from '../models/TestSession.mjs';

// Оптимизированный набор вопросов (всего 40 вопросов)
const COMPREHENSIVE_QUESTIONS = [
    // Тест Климова - базовые типы (10 вопросов)
    { id: 1, text: 'Мне нравится помогать людям, заботиться о них.', method: 'klimov', type: 'manHuman' },
    { id: 2, text: 'Я люблю работать с техникой, механизмами, инструментами.', method: 'klimov', type: 'manTech' },
    { id: 3, text: 'Мне интересно создавать красивые вещи, заниматься творчеством.', method: 'klimov', type: 'manArt' },
    { id: 4, text: 'Я предпочитаю работу с растениями, животными, природой.', method: 'klimov', type: 'manNature' },
    { id: 5, text: 'Мне нравится работать с цифрами, схемами, документами.', method: 'klimov', type: 'manSign' },
    { id: 6, text: 'Я легко нахожу общий язык с разными людьми.', method: 'klimov', type: 'manHuman' },
    { id: 7, text: 'Мне интересно разбираться в устройстве приборов и механизмов.', method: 'klimov', type: 'manTech' },
    { id: 8, text: 'Я люблю рисовать, фотографировать, создавать что-то своими руками.', method: 'klimov', type: 'manArt' },
    { id: 9, text: 'Мне нравится наблюдать за природными явлениями, ухаживать за растениями.', method: 'klimov', type: 'manNature' },
    { id: 10, text: 'Я предпочитаю систематизировать информацию, вести учет.', method: 'klimov', type: 'manSign' },
    
    // Карта интересов Голомштока - конкретные сферы (10 вопросов)
    { id: 11, text: 'Мне интересны открытия в физике и математике, решение задач.', method: 'golomshtok', type: 'physics' },
    { id: 12, text: 'Меня привлекают опыты по химии, наблюдения за биологическими процессами.', method: 'golomshtok', type: 'chemistry' },
    { id: 13, text: 'Мне нравится собирать электронные устройства, разбираться в схемах.', method: 'golomshtok', type: 'electronics' },
    { id: 14, text: 'Я люблю конструировать модели, ремонтировать механизмы.', method: 'golomshtok', type: 'mechanics' },
    { id: 15, text: 'Меня увлекают путешествия, изучение карт, геологические открытия.', method: 'golomshtok', type: 'geography' },
    { id: 16, text: 'Мне нравится читать художественную литературу, посещать театры.', method: 'golomshtok', type: 'literature' },
    { id: 17, text: 'Я интересуюсь историческими событиями, политикой.', method: 'golomshtok', type: 'history' },
    { id: 18, text: 'Мне нравится учить других, заботиться о детях, помогать больным.', method: 'golomshtok', type: 'pedagogy' },
    { id: 19, text: 'Меня привлекает бизнес, планирование бюджета, организация мероприятий.', method: 'golomshtok', type: 'entrepreneurship' },
    { id: 20, text: 'Я люблю заниматься спортом, участвовать в соревнованиях, ходить в походы.', method: 'golomshtok', type: 'sports' },
    
    // Тест Голланда - типы профессиональной среды (10 вопросов)
    { id: 21, text: 'Я предпочитаю работать с инструментами, создавать что-то своими руками.', method: 'holland', type: 'realistic' },
    { id: 22, text: 'Мне нравится исследовать, анализировать, решать сложные задачи.', method: 'holland', type: 'investigative' },
    { id: 23, text: 'Я люблю творческие задания, самовыражение через искусство.', method: 'holland', type: 'artistic' },
    { id: 24, text: 'Мне важно помогать людям, работать в коллективе.', method: 'holland', type: 'social' },
    { id: 25, text: 'Я предпочитаю руководить, убеждать, организовывать.', method: 'holland', type: 'enterprising' },
    { id: 26, text: 'Мне нравится работать с документами, соблюдать порядок.', method: 'holland', type: 'conventional' },
    { id: 27, text: 'Я люблю проводить эксперименты, проверять гипотезы.', method: 'holland', type: 'investigative' },
    { id: 28, text: 'Мне нравится импровизировать, создавать новое.', method: 'holland', type: 'artistic' },
    { id: 29, text: 'Я легко работаю в команде, помогаю коллегам.', method: 'holland', type: 'social' },
    { id: 30, text: 'Мне нравится рисковать, пробовать новое в бизнесе.', method: 'holland', type: 'enterprising' },
    
    // Тест Йовайши - склонности к деятельности (5 вопросов)
    { id: 31, text: 'Мне нравится заниматься дизайном, создавать красивые вещи.', method: 'yovaysha', type: 'aesthetic' },
    { id: 32, text: 'Я предпочитаю интеллектуальный труд, анализ информации.', method: 'yovaysha', type: 'mental' },
    { id: 33, text: 'Мне нравится физический труд, работа на свежем воздухе.', method: 'yovaysha', type: 'physical' },
    { id: 34, text: 'Меня интересует экономика, финансы, планирование.', method: 'yovaysha', type: 'economic' },
    { id: 35, text: 'Я люблю работать с людьми, помогать им.', method: 'yovaysha', type: 'workWithPeople' },
    
    // Методика Л.А. Йовайши - предпочтения в работе (5 вопросов)
    { id: 36, text: 'Я предпочитаю четкие инструкции и правила в работе.', method: 'yovaysha_la', type: 'plannedWork' },
    { id: 37, text: 'Мне нравится экстремальная деятельность, риск.', method: 'yovaysha_la', type: 'extremeWork' },
    { id: 38, text: 'Я люблю конструировать, проектировать, создавать новое.', method: 'yovaysha_la', type: 'technicalWork' },
    { id: 39, text: 'Мне нравится планировать и организовывать свою работу.', method: 'yovaysha_la', type: 'plannedWork' },
    { id: 40, text: 'Я предпочитаю работу, требующую быстрой реакции.', method: 'yovaysha_la', type: 'extremeWork' }
];

const TOTAL_QUESTIONS = 40;

// Названия типов для каждой методики
const TYPE_NAMES = {
    manHuman: { name: 'Человек-Человек', description: 'Работа с людьми, общение, обучение', color: '#ec4899' },
    manTech: { name: 'Человек-Техника', description: 'Работа с техникой, механизмами', color: '#3b82f6' },
    manArt: { name: 'Человек-Искусство', description: 'Творческая работа, искусство', color: '#8b5cf6' },
    manNature: { name: 'Человек-Природа', description: 'Работа с природой, растениями, животными', color: '#10b981' },
    manSign: { name: 'Человек-Знаковая система', description: 'Работа с цифрами, схемами, документами', color: '#f59e0b' },
    physics: { name: 'Физика и математика', description: 'Научно-техническое направление', color: '#3b82f6' },
    chemistry: { name: 'Химия и биология', description: 'Естественно-научное направление', color: '#10b981' },
    electronics: { name: 'Радиотехника и электроника', description: 'IT и электроника', color: '#8b5cf6' },
    mechanics: { name: 'Механика и конструирование', description: 'Инженерия и конструирование', color: '#f59e0b' },
    geography: { name: 'География и геология', description: 'Изучение Земли и путешествия', color: '#06b6d4' },
    literature: { name: 'Литература и искусство', description: 'Гуманитарное творчество', color: '#ec4899' },
    history: { name: 'История и политика', description: 'Историко-политическое направление', color: '#ef4444' },
    pedagogy: { name: 'Педагогика и медицина', description: 'Образование и здравоохранение', color: '#6366f1' },
    entrepreneurship: { name: 'Предпринимательство', description: 'Бизнес и управление', color: '#f97316' },
    sports: { name: 'Спорт и военное дело', description: 'Физическая культура и безопасность', color: '#6b7280' },
    realistic: { name: 'Реалистичный', description: 'Практическая работа с техникой', color: '#3b82f6' },
    investigative: { name: 'Исследовательский', description: 'Научные исследования и анализ', color: '#10b981' },
    artistic: { name: 'Артистический', description: 'Творчество и самовыражение', color: '#ec4899' },
    social: { name: 'Социальный', description: 'Работа с людьми и помощь', color: '#f59e0b' },
    enterprising: { name: 'Предприимчивый', description: 'Бизнес и руководство', color: '#8b5cf6' },
    conventional: { name: 'Конвенциональный', description: 'Работа с документами и учет', color: '#6b7280' },
    aesthetic: { name: 'Эстетическая сфера', description: 'Дизайн, стиль, красота', color: '#8b5cf6' },
    mental: { name: 'Умственная сфера', description: 'Интеллектуальный труд', color: '#f59e0b' },
    physical: { name: 'Физическая сфера', description: 'Физический труд, спорт', color: '#ef4444' },
    economic: { name: 'Экономическая сфера', description: 'Финансы, бизнес', color: '#6366f1' },
    workWithPeople: { name: 'Работа с людьми', description: 'Общение и помощь', color: '#10b981' },
    plannedWork: { name: 'Плановая деятельность', description: 'Организация и контроль', color: '#6366f1' },
    extremeWork: { name: 'Экстремальная деятельность', description: 'Риск и активность', color: '#ef4444' },
    technicalWork: { name: 'Техническая работа', description: 'Конструирование и ремонт', color: '#3b82f6' }
};

const TYPE_TO_KLIMOV = {
    physics: ['manSign', 'manTech'],
    chemistry: ['manNature', 'manSign'],
    electronics: ['manTech', 'manSign'],
    mechanics: ['manTech'],
    geography: ['manNature', 'manSign'],
    literature: ['manArt', 'manHuman'],
    history: ['manHuman', 'manSign'],
    pedagogy: ['manHuman'],
    entrepreneurship: ['manHuman', 'manSign'],
    sports: ['manHuman', 'manTech'],
    realistic: ['manTech'],
    investigative: ['manSign', 'manNature'],
    artistic: ['manArt'],
    social: ['manHuman'],
    enterprising: ['manHuman', 'manSign'],
    conventional: ['manSign'],
    aesthetic: ['manArt'],
    mental: ['manSign'],
    physical: ['manNature', 'manTech'],
    economic: ['manSign', 'manHuman'],
    workWithPeople: ['manHuman'],
    plannedWork: ['manSign'],
    extremeWork: ['manNature', 'manTech'],
    technicalWork: ['manTech']
};

// Сохранение сессии в БД
async function saveSessionToDB(userId, testSession, testType, completed = false) {
    try {
        const existingSession = await TestSession.findOne({ 
            userId, 
            testType, 
            completed: false 
        });
        
        const sessionData = {
            userId,
            testType,
            sessionData: testSession,
            currentQuestionId: testSession.currentQuestion?.id,
            answersCount: testSession.answers?.length || 0,
            progress: Math.round(((testSession.answers?.length || 0) / TOTAL_QUESTIONS) * 100),
            completed,
            lastActivity: new Date()
        };
        
        if (completed) {
            sessionData.completedAt = new Date();
        }
        
        if (existingSession) {
            existingSession.sessionData = testSession;
            existingSession.currentQuestionId = testSession.currentQuestion?.id;
            existingSession.answersCount = testSession.answers?.length || 0;
            existingSession.progress = sessionData.progress;
            existingSession.completed = completed;
            existingSession.lastActivity = new Date();
            if (completed) existingSession.completedAt = new Date();
            await existingSession.save();
            return existingSession;
        } else {
            const newSession = new TestSession(sessionData);
            await newSession.save();
            return newSession;
        }
    } catch (error) {
        console.error('Ошибка сохранения сессии:', error);
        return null;
    }
}

// Получение сохраненной сессии
async function getSavedSession(userId, testType) {
    try {
        const session = await TestSession.findOne({ 
            userId, 
            testType, 
            completed: false 
        });
        
        if (session && session.sessionData) {
            session.lastActivity = new Date();
            await session.save();
            return session.sessionData;
        }
        return null;
    } catch (error) {
        console.error('Ошибка получения сессии:', error);
        return null;
    }
}

export const getComprehensiveTest = async (req, res) => {
    try {
        console.log('Starting comprehensive test for user:', req.user?._id);
        
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Необходима авторизация'
            });
        }

        const userId = req.user._id;
        
        let savedSession = await getSavedSession(userId, 'comprehensive');
        
        if (savedSession) {
            console.log('Found saved session, restoring...');
            const currentQuestionNumber = savedSession.answers.length + 1;
            const progress = Math.round((savedSession.answers.length / TOTAL_QUESTIONS) * 100);
            
            return res.json({
                success: true,
                testSession: savedSession,
                question: savedSession.currentQuestion,
                totalQuestions: TOTAL_QUESTIONS,
                currentQuestionNumber: currentQuestionNumber,
                progress: progress,
                canGoBack: savedSession.previousQuestions && savedSession.previousQuestions.length > 0
            });
        }

        const shuffledQuestions = [...COMPREHENSIVE_QUESTIONS].sort(() => Math.random() - 0.5);
        const remainingQuestions = shuffledQuestions.slice(1).map(q => ({ ...q }));
        
        const scores = {};
        COMPREHENSIVE_QUESTIONS.forEach(q => {
            scores[`${q.method}_${q.type}`] = 0;
        });
        
        const testSession = {
            sessionId: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            answers: [],
            scores: scores,
            remainingQuestions: remainingQuestions,
            previousQuestions: [],
            currentQuestion: { ...shuffledQuestions[0] }
        };

        await saveSessionToDB(userId, testSession, 'comprehensive');

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
        console.error('Ошибка при получении комплексного теста:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении теста: ' + error.message
        });
    }
};

export const submitComprehensiveAnswer = async (req, res) => {
    try {
        console.log('Processing comprehensive answer for user:', req.user?._id);

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Необходима авторизация'
            });
        }

        const userId = req.user._id;
        const { questionId, answer, testSession, action = 'next' } = req.body;

        if (!questionId || answer === undefined || !testSession) {
            return res.status(400).json({
                success: false,
                message: 'Необходимы все данные'
            });
        }

        if (!['+', '+-', '-'].includes(answer)) {
            return res.status(400).json({
                success: false,
                message: 'Недопустимое значение ответа'
            });
        }

        const question = COMPREHENSIVE_QUESTIONS.find(q => q.id === parseInt(questionId));
        if (!question) {
            return res.status(400).json({
                success: false,
                message: `Вопрос с ID ${questionId} не найден`
            });
        }

        const updatedSession = {
            sessionId: testSession.sessionId,
            answers: testSession.answers ? [...testSession.answers] : [],
            scores: { ...testSession.scores },
            remainingQuestions: testSession.remainingQuestions ? [...testSession.remainingQuestions] : [],
            previousQuestions: testSession.previousQuestions ? [...testSession.previousQuestions] : [],
            currentQuestion: testSession.currentQuestion ? { ...testSession.currentQuestion } : null
        };

        if (action === 'next') {
            const existingAnswerIndex = updatedSession.answers.findIndex(a => a.questionId === parseInt(questionId));
            const answerValue = answer === '+' ? 2 : (answer === '+-' ? 1 : 0);
            const scoreKey = `${question.method}_${question.type}`;
            
            if (existingAnswerIndex !== -1) {
                const oldAnswer = updatedSession.answers[existingAnswerIndex];
                const oldValue = oldAnswer.answer === '+' ? 2 : (oldAnswer.answer === '+-' ? 1 : 0);
                updatedSession.scores[scoreKey] = (updatedSession.scores[scoreKey] || 0) - oldValue + answerValue;
                updatedSession.answers[existingAnswerIndex] = {
                    questionId: parseInt(questionId),
                    answer: answer,
                    timestamp: new Date()
                };
            } else {
                updatedSession.answers.push({
                    questionId: parseInt(questionId),
                    answer: answer,
                    timestamp: new Date()
                });
                updatedSession.scores[scoreKey] = (updatedSession.scores[scoreKey] || 0) + answerValue;
            }

            if (updatedSession.answers.length >= TOTAL_QUESTIONS) {
                await TestSession.findOneAndDelete({ userId, testType: 'comprehensive', completed: false });
                return await completeComprehensiveTest(userId, updatedSession, res);
            }

            if (updatedSession.remainingQuestions && updatedSession.remainingQuestions.length > 0) {
                const nextQuestion = { ...updatedSession.remainingQuestions[0] };
                updatedSession.currentQuestion = nextQuestion;
                updatedSession.remainingQuestions = updatedSession.remainingQuestions.slice(1);
                updatedSession.previousQuestions.push({
                    questionId: parseInt(questionId),
                    answer: answer,
                    question: { ...question }
                });
            } else {
                await TestSession.findOneAndDelete({ userId, testType: 'comprehensive', completed: false });
                return await completeComprehensiveTest(userId, updatedSession, res);
            }

        } else if (action === 'prev') {
            if (!testSession.previousQuestions || testSession.previousQuestions.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Нет предыдущих вопросов'
                });
            }

            const lastQuestionData = testSession.previousQuestions[testSession.previousQuestions.length - 1];
            const currentAnswerIndex = updatedSession.answers.findIndex(a => a.questionId === parseInt(questionId));
            
            if (currentAnswerIndex !== -1) {
                const currentAnswer = updatedSession.answers[currentAnswerIndex];
                const currentValue = currentAnswer.answer === '+' ? 2 : (currentAnswer.answer === '+-' ? 1 : 0);
                const scoreKey = `${question.method}_${question.type}`;
                updatedSession.scores[scoreKey] = (updatedSession.scores[scoreKey] || 0) - currentValue;
                updatedSession.answers.splice(currentAnswerIndex, 1);
            }

            if (updatedSession.currentQuestion) {
                updatedSession.remainingQuestions = [
                    { ...updatedSession.currentQuestion },
                    ...updatedSession.remainingQuestions
                ];
            }

            updatedSession.currentQuestion = { ...lastQuestionData.question };
            updatedSession.previousQuestions = testSession.previousQuestions.slice(0, -1);
        }

        await saveSessionToDB(userId, updatedSession, 'comprehensive');

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
        console.error('Ошибка при обработке ответа:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при обработке ответа: ' + error.message
        });
    }
};

async function completeComprehensiveTest(userId, testSession, res) {
    try {
        console.log('Completing comprehensive test for user:', userId);

        const results = {
            klimov: {},
            golomshtok: {},
            holland: {},
            yovaysha: {},
            yovaysha_la: {}
        };

        const typeCounts = {};

        testSession.answers.forEach(answer => {
            const question = COMPREHENSIVE_QUESTIONS.find(q => q.id === answer.questionId);
            if (question) {
                const method = question.method;
                const type = question.type;
                const key = `${method}_${type}`;
                const value = answer.answer === '+' ? 2 : (answer.answer === '+-' ? 1 : 0);
                
                if (!results[method][type]) {
                    results[method][type] = 0;
                    typeCounts[key] = 0;
                }
                
                results[method][type] += value;
                typeCounts[key] = (typeCounts[key] || 0) + 1;
            }
        });

        const finalScores = {};
        Object.keys(results).forEach(method => {
            finalScores[method] = {};
            Object.keys(results[method]).forEach(type => {
                const key = `${method}_${type}`;
                const count = typeCounts[key] || 1;
                const maxPossible = count * 2;
                const percentage = Math.round((results[method][type] / maxPossible) * 100);
                finalScores[method][type] = Math.min(100, percentage);
            });
        });

        const klimovScores = {
            manNature: 0,
            manTech: 0,
            manHuman: 0,
            manSign: 0,
            manArt: 0
        };

        const allTypeScores = [];
        Object.keys(finalScores).forEach(method => {
            Object.entries(finalScores[method]).forEach(([type, score]) => {
                allTypeScores.push({ type, score });
            });
        });

        allTypeScores.forEach(({ type, score }) => {
            const weight = score / 100;
            const klimovTypes = TYPE_TO_KLIMOV[type] || [];
            
            klimovTypes.forEach(klimovType => {
                if (klimovScores.hasOwnProperty(klimovType)) {
                    klimovScores[klimovType] += weight * 20;
                }
            });
        });

        Object.keys(klimovScores).forEach(type => {
            klimovScores[type] = Math.min(100, Math.round(klimovScores[type]));
        });

        const primaryTypes = {
            klimov: Object.entries(finalScores.klimov || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || '',
            golomshtok: Object.entries(finalScores.golomshtok || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || '',
            holland: Object.entries(finalScores.holland || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || '',
            yovaysha: Object.entries(finalScores.yovaysha || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || '',
            yovaysha_la: Object.entries(finalScores.yovaysha_la || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || ''
        };

        const klimovTypesForSearch = Object.entries(klimovScores)
            .filter(([_, score]) => score >= 40)
            .map(([type]) => type);

        let recommendedSpecialties = [];
        try {
            if (klimovTypesForSearch.length > 0) {
                recommendedSpecialties = await Specialty.find({
                    klimovTypes: { $in: klimovTypesForSearch }
                })
                .populate('colleges')
                .limit(20)
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
                    matchReasons.push(`${TYPE_NAMES[type]?.name || type}: ${klimovScores[type]}%`);
                }
            });

            let collegeName = '';
            let collegeId = null;
            
            if (specialty.colleges && specialty.colleges.length > 0) {
                const firstCollege = specialty.colleges[0];
                collegeName = firstCollege.name || '';
                collegeId = firstCollege._id;
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

        const testResult = {
            testType: 'comprehensive',
            date: new Date(),
            comprehensiveScores: finalScores,
            primaryComprehensiveTypes: primaryTypes,
            klimovScores: {
                manNature: Number(klimovScores.manNature || 0),
                manTech: Number(klimovScores.manTech || 0),
                manHuman: Number(klimovScores.manHuman || 0),
                manSign: Number(klimovScores.manSign || 0),
                manArt: Number(klimovScores.manArt || 0)
            },
            primaryKlimovType: Object.entries(klimovScores).sort((a, b) => b[1] - a[1])[0]?.[0] || '',
            recommendedSpecialties: specialtiesWithMatch,
            detailedAnswers: testSession.answers.map(a => ({
                questionId: Number(a.questionId),
                answer: String(a.answer),
                timestamp: a.timestamp || new Date()
            })),
            questionsCount: Number(testSession.answers.length)
        };

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

        res.json({
            success: true,
            message: 'Комплексный тест завершен',
            testResult: {
                ...testResult,
                recommendedSpecialties: specialtiesWithMatch.slice(0, 10)
            },
            completed: true,
            finalScores,
            klimovScores,
            primaryTypes,
            recommendedSpecialties: specialtiesWithMatch.slice(0, 10)
        });

    } catch (error) {
        console.error('Ошибка при завершении теста:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при завершении теста: ' + error.message
        });
    }
}

export const getComprehensiveResults = async (req, res) => {
    try {
        console.log('Getting comprehensive results for user:', req.user?._id);
        
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Необходима авторизация'
            });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Пользователь не найден'
            });
        }

        const comprehensiveResults = (user.testResults || [])
            .filter(r => r && r.testType === 'comprehensive')
            .map(r => {
                const result = r.toObject ? r.toObject() : r;
                return {
                    ...result,
                    date: result.date || new Date()
                };
            });

        res.json({
            success: true,
            results: comprehensiveResults
        });
    } catch (error) {
        console.error('Ошибка при получении результатов:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении результатов: ' + error.message
        });
    }
};

export const getPreviousComprehensiveQuestion = async (req, res) => {
    try {
        console.log('Getting previous comprehensive question for user:', req.user?._id);
        
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Необходима авторизация'
            });
        }

        const { testSession } = req.body;

        if (!testSession || !testSession.previousQuestions || testSession.previousQuestions.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Нет предыдущих вопросов'
            });
        }

        const updatedSession = {
            sessionId: testSession.sessionId,
            answers: testSession.answers ? [...testSession.answers] : [],
            scores: { ...testSession.scores },
            remainingQuestions: testSession.remainingQuestions ? [...testSession.remainingQuestions] : [],
            previousQuestions: testSession.previousQuestions ? [...testSession.previousQuestions] : [],
            currentQuestion: testSession.currentQuestion ? { ...testSession.currentQuestion } : null
        };
        
        const lastQuestionData = updatedSession.previousQuestions.pop();
        
        if (updatedSession.currentQuestion) {
            const currentAnswerIndex = updatedSession.answers.findIndex(
                a => a.questionId === updatedSession.currentQuestion.id
            );
            
            if (currentAnswerIndex !== -1) {
                const currentAnswer = updatedSession.answers[currentAnswerIndex];
                const currentValue = currentAnswer.answer === '+' ? 2 : (currentAnswer.answer === '+-' ? 1 : 0);
                const scoreKey = `${updatedSession.currentQuestion.method}_${updatedSession.currentQuestion.type}`;
                
                if (scoreKey) {
                    updatedSession.scores[scoreKey] = (updatedSession.scores[scoreKey] || 0) - currentValue;
                }
                
                updatedSession.answers.splice(currentAnswerIndex, 1);
            }
        }

        if (updatedSession.currentQuestion) {
            updatedSession.remainingQuestions = [
                { ...updatedSession.currentQuestion },
                ...updatedSession.remainingQuestions
            ];
        }

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
        console.error('Ошибка при возврате к предыдущему вопросу:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при возврате к предыдущему вопросу: ' + error.message
        });
    }
};

export const cleanupOldSessions = async () => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const result = await TestSession.deleteMany({
            lastActivity: { $lt: sevenDaysAgo },
            completed: true
        });
        
        console.log(`Cleaned up ${result.deletedCount} old sessions`);
    } catch (error) {
        console.error('Error cleaning up sessions:', error);
    }
};