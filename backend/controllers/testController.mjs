import User from '../models/User.mjs';
import Specialty from '../models/Specialty.mjs';

const KLIMOV_QUESTIONS = [
    {
        id: 1,
        text: 'Легко знакомлюсь с людьми.',
        type: 'manHuman'
    },
    {
        id: 2,
        text: 'Охотно и подолгу могу что-нибудь мастерить.',
        type: 'manTech'
    },
    {
        id: 3,
        text: 'Люблю ходить в музеи, театры, на выставки.',
        type: 'manArt'
    },
    {
        id: 4,
        text: 'Охотно и постоянно ухаживаю за растениями, животными.',
        type: 'manNature'
    },
    {
        id: 5,
        text: 'Охотно и подолгу могу что-нибудь вычислять, чертить.',
        type: 'manSign'
    },
    {
        id: 6,
        text: 'С удовольствием общаюсь со сверстниками или малышами.',
        type: 'manHuman'
    },
    {
        id: 7,
        text: 'С удовольствием ухаживаю за растениями и животными.',
        type: 'manNature'
    },
    {
        id: 8,
        text: 'Обычно делаю мало ошибок в письменных работах.',
        type: 'manSign'
    },
    {
        id: 9,
        text: 'Мои изделия обычно вызывают интерес у товарищей, старших.',
        type: 'manTech'
    },
    {
        id: 10,
        text: 'Люди считают, что у меня есть художественные способности.',
        type: 'manArt'
    },
    {
        id: 11,
        text: 'Охотно читаю о растениях, животных.',
        type: 'manNature'
    },
    {
        id: 12,
        text: 'Принимаю участие в спектаклях, концертах.',
        type: 'manArt'
    },
    {
        id: 13,
        text: 'Люблю читать об устройстве механизмов, приборов, машин.',
        type: 'manTech'
    },
    {
        id: 14,
        text: 'Подолгу могу разгадывать головоломки, задачи, ребусы.',
        type: 'manSign'
    },
    {
        id: 15,
        text: 'Легко улаживаю разногласия между людьми.',
        type: 'manHuman'
    },
    {
        id: 16,
        text: 'Считают, что у меня есть способности к работе с техникой.',
        type: 'manTech'
    },
    {
        id: 17,
        text: 'Людям нравится мое художественное творчество.',
        type: 'manArt'
    },
    {
        id: 18,
        text: 'У меня есть способности к работе с растениями и животными.',
        type: 'manNature'
    },
    {
        id: 19,
        text: 'Я могу ясно излагать свои мысли в письменной форме.',
        type: 'manSign'
    },
    {
        id: 20,
        text: 'Я почти никогда ни с кем не ссорюсь.',
        type: 'manHuman'
    },
    {
        id: 21,
        text: 'Мне нравится ремонтировать различные приборы и устройства.',
        type: 'manTech'
    },
    {
        id: 22,
        text: 'Мне нравится помогать людям.',
        type: 'manHuman'
    },
    {
        id: 23,
        text: 'Мне нравится создавать красивые вещи.',
        type: 'manArt'
    },
    {
        id: 24,
        text: 'Мне нравится работать на свежем воздухе.',
        type: 'manNature'
    },
    {
        id: 25,
        text: 'Мне нравится работать с документами и отчетами.',
        type: 'manSign'
    },
    {
        id: 26,
        text: 'Мне нравится учить других людей.',
        type: 'manHuman'
    },
    {
        id: 27,
        text: 'Мне нравится разбираться в технических чертежах.',
        type: 'manTech'
    },
    {
        id: 28,
        text: 'Мне нравится составлять букеты и композиции.',
        type: 'manArt'
    },
    {
        id: 29,
        text: 'Мне нравится ухаживать за животными.',
        type: 'manNature'
    },
    {
        id: 30,
        text: 'Мне нравится вести учет и подсчеты.',
        type: 'manSign'
    },
    {
        id: 31,
        text: 'Мне нравится организовывать мероприятия.',
        type: 'manHuman'
    },
    {
        id: 32,
        text: 'Мне нравится работать с инструментами.',
        type: 'manTech'
    },
    {
        id: 33,
        text: 'Мне нравится рисовать или фотографировать.',
        type: 'manArt'
    },
    {
        id: 34,
        text: 'Мне нравится работать в саду или огороде.',
        type: 'manNature'
    },
    {
        id: 35,
        text: 'Мне нравится анализировать данные.',
        type: 'manSign'
    },
    {
        id: 36,
        text: 'Мне нравится заботиться о больных.',
        type: 'manHuman'
    },
    {
        id: 37,
        text: 'Мне нравится собирать и разбирать механизмы.',
        type: 'manTech'
    },
    {
        id: 38,
        text: 'Мне нравится сочинять стихи или рассказы.',
        type: 'manArt'
    },
    {
        id: 39,
        text: 'Мне нравится наблюдать за природными явлениями.',
        type: 'manNature'
    },
    {
        id: 40,
        text: 'Мне нравится работать с компьютерными программами.',
        type: 'manSign'
    },
    {
        id: 41,
        text: 'Я часто принимаю участие в общественных мероприятиях.',
        type: 'manHuman'
    },
    {
        id: 42,
        text: 'Мне интересно, как работают разные приборы.',
        type: 'manTech'
    },
    {
        id: 43,
        text: 'Я люблю посещать художественные выставки.',
        type: 'manArt'
    },
    {
        id: 44,
        text: 'Я интересуюсь биологией и зоологией.',
        type: 'manNature'
    },
    {
        id: 45,
        text: 'Мне нравится решать логические задачи.',
        type: 'manSign'
    },
    {
        id: 46,
        text: 'Я умею находить подход к разным людям.',
        type: 'manHuman'
    },
    {
        id: 47,
        text: 'Я могу починить простые бытовые приборы.',
        type: 'manTech'
    },
    {
        id: 48,
        text: 'Я люблю слушать музыку и разбираться в ней.',
        type: 'manArt'
    },
    {
        id: 49,
        text: 'Мне нравится изучать различные растения.',
        type: 'manNature'
    },
    {
        id: 50,
        text: 'Мне нравится работать с таблицами и графиками.',
        type: 'manSign'
    },
    {
        id: 51,
        text: 'Мне легко работать в коллективе.',
        type: 'manHuman'
    },
    {
        id: 52,
        text: 'Мне интересно проектировать и конструировать.',
        type: 'manTech'
    },
    {
        id: 53,
        text: 'Я люблю делать что-то своими руками творчески.',
        type: 'manArt'
    },
    {
        id: 54,
        text: 'Мне нравится ухаживать за комнатными растениями.',
        type: 'manNature'
    },
    {
        id: 55,
        text: 'Мне нравится систематизировать информацию.',
        type: 'manSign'
    },
    {
        id: 56,
        text: 'Я умею поддерживать разговор с незнакомыми людьми.',
        type: 'manHuman'
    },
    {
        id: 57,
        text: 'Мне интересно следить за новыми технологиями.',
        type: 'manTech'
    },
    {
        id: 58,
        text: 'Я люблю украшать пространство вокруг себя.',
        type: 'manArt'
    },
    {
        id: 59,
        text: 'Мне интересно изучать географию и природные явления.',
        type: 'manNature'
    },
    {
        id: 60,
        text: 'Мне нравится работать с формулами и расчетами.',
        type: 'manSign'
    }
];

const TOTAL_QUESTIONS = 40;

const KLIMOV_TYPE_NAMES = {
    manNature: 'Человек-Природа',
    manTech: 'Человек-Техника',
    manHuman: 'Человек-Человек',
    manSign: 'Человек-Знаковая система',
    manArt: 'Человек-Искусство'
};

function selectNextQuestion(session) {
    if (session.answers.length >= TOTAL_QUESTIONS) {
        return null;
    }

    const askedQuestions = session.answers.map(a => a.questionId);
    const availableQuestions = KLIMOV_QUESTIONS.filter(q => !askedQuestions.includes(q.id));

    if (availableQuestions.length === 0) {
        return null;
    }

    const typeScores = { ...session.scores };
    const answeredByType = {};

    session.answers.forEach(answer => {
        const question = KLIMOV_QUESTIONS.find(q => q.id === answer.questionId);
        if (question) {
            answeredByType[question.type] = (answeredByType[question.type] || 0) + 1;
        }
    });

    const totalAnswered = session.answers.length;
    const typeWeights = {};

    if (totalAnswered < 10) {
        Object.keys(typeScores).forEach(type => {
            typeWeights[type] = 1;
        });
    } else {
        Object.keys(typeScores).forEach(type => {
            const score = typeScores[type] || 0;
            const answered = answeredByType[type] || 0;
            
            if (answered > 0) {
                const successRate = score / answered;
                
                if (successRate > 0.7) {
                    typeWeights[type] = 3;
                } else if (successRate > 0.4) {
                    typeWeights[type] = 2;
                } else {
                    typeWeights[type] = 1;
                }
            } else {
                typeWeights[type] = 2;
            }
        });
    }

    const weightedQuestions = [];
    
    availableQuestions.forEach(question => {
        const weight = typeWeights[question.type] || 1;
        for (let i = 0; i < weight; i++) {
            weightedQuestions.push(question);
        }
    });

    if (weightedQuestions.length === 0) {
        return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    }

    const randomIndex = Math.floor(Math.random() * weightedQuestions.length);
    return weightedQuestions[randomIndex];
}

export const getKlimovTest = async (req, res) => {
    try {
        const sessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9);

        const testSession = {
            sessionId: sessionId,
            currentQuestionIndex: 0,
            answers: [],
            scores: {
                manNature: 0,
                manTech: 0,
                manHuman: 0,
                manSign: 0,
                manArt: 0
            },
            askedQuestions: []
        };

        const firstQuestion = selectNextQuestion(testSession);
        
        if (!firstQuestion) {
            return res.status(400).json({
                success: false,
                message: 'Не удалось начать тест'
            });
        }

        testSession.currentQuestion = firstQuestion;
        testSession.askedQuestions.push(firstQuestion.id);

        res.json({
            success: true,
            testSession: testSession,
            question: firstQuestion,
            totalQuestions: TOTAL_QUESTIONS,
            currentQuestionNumber: 1,
            canGoBack: false,
            previousQuestions: []
        });
    } catch (error) {
        console.error('Ошибка при получении теста:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении теста'
        });
    }
};

export const submitKlimovAnswer = async (req, res) => {
    try {
        const userId = req.user._id;
        const { questionId, answer, testSession, action = 'next' } = req.body;

        if (!questionId || answer === undefined || !testSession) {
            return res.status(400).json({
                success: false,
                message: 'Необходимы данные ответа'
            });
        }

        const question = KLIMOV_QUESTIONS.find(q => q.id === questionId);
        if (!question) {
            return res.status(400).json({
                success: false,
                message: 'Вопрос не найден'
            });
        }

        let updatedSession = { ...testSession };
        
        if (action === 'next') {
            const existingAnswerIndex = updatedSession.answers.findIndex(a => a.questionId === questionId);
            
            if (existingAnswerIndex !== -1) {
                const oldAnswer = updatedSession.answers[existingAnswerIndex].answer;
                const oldValue = oldAnswer === '+' ? 1 : 0;
                updatedSession.scores[question.type] = 
                    (updatedSession.scores[question.type] || 0) - oldValue;
                
                updatedSession.answers[existingAnswerIndex] = {
                    questionId,
                    answer,
                    timestamp: new Date()
                };
            } else {
                updatedSession.answers = [...testSession.answers, {
                    questionId,
                    answer,
                    timestamp: new Date()
                }];
            }

            const answerValue = answer === '+' ? 1 : 0;
            updatedSession.scores[question.type] = 
                (updatedSession.scores[question.type] || 0) + answerValue;

            if (updatedSession.answers.length >= TOTAL_QUESTIONS) {
                return await completeTest(userId, updatedSession, res);
            }

            const nextQuestion = selectNextQuestion(updatedSession);
            
            if (!nextQuestion) {
                return await completeTest(userId, updatedSession, res);
            }

            updatedSession.currentQuestion = nextQuestion;
            updatedSession.askedQuestions = [...testSession.askedQuestions, nextQuestion.id];
            
            updatedSession.previousQuestions = [
                ...(testSession.previousQuestions || []),
                {
                    questionId: questionId,
                    answer: answer
                }
            ];

        } else if (action === 'prev') {
            if (!testSession.previousQuestions || testSession.previousQuestions.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Нет предыдущих вопросов'
                });
            }

            const lastQuestion = testSession.previousQuestions.pop();
            
            const currentAnswerIndex = updatedSession.answers.findIndex(a => a.questionId === lastQuestion.questionId);
            if (currentAnswerIndex !== -1) {
                const currentAnswer = updatedSession.answers[currentAnswerIndex];
                const currentValue = currentAnswer.answer === '+' ? 1 : 0;
                const questionType = KLIMOV_QUESTIONS.find(q => q.id === lastQuestion.questionId)?.type;
                
                if (questionType) {
                    updatedSession.scores[questionType] = 
                        (updatedSession.scores[questionType] || 0) - currentValue;
                }
                
                updatedSession.answers.splice(currentAnswerIndex, 1);
            }

            const askedQuestionsIndex = updatedSession.askedQuestions.indexOf(lastQuestion.questionId);
            if (askedQuestionsIndex !== -1) {
                updatedSession.askedQuestions.splice(askedQuestionsIndex, 1);
            }

            const prevQuestion = KLIMOV_QUESTIONS.find(q => q.id === lastQuestion.questionId);
            if (prevQuestion) {
                updatedSession.currentQuestion = prevQuestion;
            }

            updatedSession.previousQuestions = testSession.previousQuestions;
        }

        res.json({
            success: true,
            testSession: updatedSession,
            question: updatedSession.currentQuestion,
            totalQuestions: TOTAL_QUESTIONS,
            currentQuestionNumber: updatedSession.answers.length + 1,
            progress: Math.round((updatedSession.answers.length / TOTAL_QUESTIONS) * 100),
            canGoBack: updatedSession.previousQuestions && updatedSession.previousQuestions.length > 0,
            previousQuestions: updatedSession.previousQuestions || []
        });

    } catch (error) {
        console.error('Ошибка при обработке ответа:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при обработке ответа'
        });
    }
};

function calculateMatchPercentage(userScores, klimovTypes) {
    if (!userScores || !klimovTypes || klimovTypes.length === 0) {
        return 0;
    }

    let totalScore = 0;
    let matchedCount = 0;

    klimovTypes.forEach(type => {
        if (userScores[type] !== undefined) {
            totalScore += userScores[type];
            matchedCount++;
        }
    });

    if (matchedCount === 0) {
        return 0;
    }

    return Math.round(totalScore / matchedCount);
}

async function completeTest(userId, testSession, res) {
    try {
        console.log('Starting completeTest for user:', userId);
        
        const finalScores = calculateFinalScores(testSession);
        console.log('Final scores:', finalScores);
        
        const primaryType = findPrimaryType(finalScores);
        console.log('Primary type:', primaryType);
        
        const recommendedSpecialties = await Specialty.find({
            klimovTypes: { $in: [primaryType] }
        })
        .populate('colleges', 'name city region') // Загружаем информацию о колледжах
        .limit(10)
        .lean();
        
        console.log(`Found ${recommendedSpecialties.length} specialties`);
        
        const specialtiesWithMatch = recommendedSpecialties.map(specialty => {
            const matchPercentage = calculateMatchPercentage(finalScores, specialty.klimovTypes);
            const matchReasons = [];
            
            if (specialty.klimovTypes && Array.isArray(specialty.klimovTypes)) {
                specialty.klimovTypes.forEach(type => {
                    if (finalScores[type] !== undefined) {
                        matchReasons.push(`${KLIMOV_TYPE_NAMES[type]}: ${finalScores[type]}%`);
                    }
                });
            }
            
            // Получаем название первого колледжа из загруженных данных
            let collegeName = '';
            let collegeId = null;
            let collegeCity = '';
            
            if (specialty.colleges && specialty.colleges.length > 0) {
                const firstCollege = specialty.colleges[0];
                collegeName = firstCollege.name || '';
                collegeId = firstCollege._id;
                collegeCity = firstCollege.city || '';
            } 
            // Если нет загруженных колледжей, используем collegeNames
            else if (specialty.collegeNames && specialty.collegeNames.length > 0) {
                collegeName = specialty.collegeNames[0] || '';
            }
            
            // Если все еще нет названия, используем название из поля name специальности
            if (!collegeName) {
                collegeName = specialty.name || 'Колледж';
            }
            
            return {
                specialtyId: specialty._id,
                name: specialty.name,
                description: specialty.description || 'Описание отсутствует',
                code: specialty.code,
                collegeName: collegeName,
                collegeId: collegeId,
                collegeCity: collegeCity,
                matchPercentage: matchPercentage || 0,
                matchReasons: matchReasons,
                klimovTypes: specialty.klimovTypes || [],
                duration: specialty.duration || 'Не указано',
                form: specialty.form || 'full-time',
                educationLevel: specialty.educationLevel || 'SPO',
                fundingType: specialty.fundingType || 'both'
            };
        });
        
        specialtiesWithMatch.sort((a, b) => b.matchPercentage - a.matchPercentage);

        const testResult = {
            testType: 'klimov_adaptive',
            date: new Date(),
            klimovScores: finalScores,
            primaryKlimovType: primaryType,
            recommendedSpecialties: specialtiesWithMatch,
            detailedAnswers: testSession.answers.map(a => ({
                questionId: a.questionId,
                answer: a.answer,
                timestamp: a.timestamp || new Date()
            })),
            questionsCount: testSession.answers.length
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

        console.log('Test completed successfully for user:', userId);

        res.json({
            success: true,
            message: 'Тест завершен',
            testResult: {
                ...testResult,
                recommendedSpecialties: specialtiesWithMatch.slice(0, 5) // Отправляем только топ-5 для ответа
            },
            completed: true,
            finalScores,
            recommendedSpecialties: specialtiesWithMatch.slice(0, 5) // Топ-5 специальностей
        });

    } catch (error) {
        console.error('Детальная ошибка при завершении теста:', {
            message: error.message,
            stack: error.stack,
            userId: userId,
            testSessionId: testSession?.sessionId
        });
        
        res.status(500).json({
            success: false,
            message: 'Ошибка при завершении теста: ' + error.message,
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}

function calculateFinalScores(testSession) {
    const typeScores = {
        manNature: 0,
        manTech: 0,
        manHuman: 0,
        manSign: 0,
        manArt: 0
    };

    const typeCounts = {
        manNature: 0,
        manTech: 0,
        manHuman: 0,
        manSign: 0,
        manArt: 0
    };

    testSession.answers.forEach(answer => {
        const question = KLIMOV_QUESTIONS.find(q => q.id === answer.questionId);
        if (question) {
            typeCounts[question.type] = (typeCounts[question.type] || 0) + 1;
            const answerValue = answer.answer === '+' ? 1 : 0;
            typeScores[question.type] += answerValue;
        }
    });

    Object.keys(typeScores).forEach(type => {
        const count = typeCounts[type] || 1;
        typeScores[type] = Math.round((typeScores[type] / count) * 100);
    });

    return typeScores;
}

function findPrimaryType(scores) {
    const entries = Object.entries(scores);
    entries.sort((a, b) => b[1] - a[1]);
    return entries[0][0];
}

export const getTestResults = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Пользователь не найден'
            });
        }

        res.json({
            success: true,
            testResults: user.testResults || []
        });
    } catch (error) {
        console.error('Ошибка при получении результатов:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении результатов'
        });
    }
};

export const getTestProgress = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Пользователь не найден'
            });
        }

        const progress = {
            totalTests: user.testResults?.length || 0,
            lastTestDate: user.testResults?.length > 0 ? 
                user.testResults[user.testResults.length - 1].date : null
        };

        res.json({
            success: true,
            progress
        });
    } catch (error) {
        console.error('Ошибка при получении прогресса:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении прогресса'
        });
    }
};

export const getPreviousQuestion = async (req, res) => {
    try {
        const { testSession } = req.body;

        if (!testSession || !testSession.previousQuestions || testSession.previousQuestions.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Нет предыдущих вопросов'
            });
        }

        const updatedSession = { ...testSession };
        const lastQuestion = updatedSession.previousQuestions.pop();
        
        const currentAnswerIndex = updatedSession.answers.findIndex(a => a.questionId === lastQuestion.questionId);
        if (currentAnswerIndex !== -1) {
            const currentAnswer = updatedSession.answers[currentAnswerIndex];
            const currentValue = currentAnswer.answer === '+' ? 1 : 0;
            const questionType = KLIMOV_QUESTIONS.find(q => q.id === lastQuestion.questionId)?.type;
            
            if (questionType) {
                updatedSession.scores[questionType] = 
                    (updatedSession.scores[questionType] || 0) - currentValue;
            }
            
            updatedSession.answers.splice(currentAnswerIndex, 1);
        }

        const askedQuestionsIndex = updatedSession.askedQuestions.indexOf(lastQuestion.questionId);
        if (askedQuestionsIndex !== -1) {
            updatedSession.askedQuestions.splice(askedQuestionsIndex, 1);
        }

        const prevQuestion = KLIMOV_QUESTIONS.find(q => q.id === lastQuestion.questionId);
        if (prevQuestion) {
            updatedSession.currentQuestion = prevQuestion;
        }

        res.json({
            success: true,
            testSession: updatedSession,
            question: updatedSession.currentQuestion,
            totalQuestions: TOTAL_QUESTIONS,
            currentQuestionNumber: updatedSession.answers.length + 1,
            progress: Math.round((updatedSession.answers.length / TOTAL_QUESTIONS) * 100),
            canGoBack: updatedSession.previousQuestions && updatedSession.previousQuestions.length > 0,
            previousQuestions: updatedSession.previousQuestions || []
        });

    } catch (error) {
        console.error('Ошибка при возврате к предыдущему вопросу:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при возврате к предыдущему вопросу'
        });
    }
};