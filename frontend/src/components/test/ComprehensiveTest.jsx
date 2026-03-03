// frontend/components/test/ComprehensiveTest.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Button,
    Box,
    LinearProgress,
    Card,
    CardContent,
    alpha,
    useTheme,
    Alert,
    Snackbar,
    CircularProgress,
    Stack,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip,
    Chip,
    Paper
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import UndoIcon from '@mui/icons-material/Undo';
import HistoryIcon from '@mui/icons-material/History';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import InfoIcon from '@mui/icons-material/Info';
import { useAuth } from '../../context/AuthContext';

const TOTAL_QUESTIONS = 40;

const ComprehensiveTest = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { api } = useAuth();
    
    const [testSession, setTestSession] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
    const [canGoBack, setCanGoBack] = useState(false);
    const [answersHistory, setAnswersHistory] = useState([]);
    const [showHistoryDialog, setShowHistoryDialog] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [showInfoDialog, setShowInfoDialog] = useState(false);

    useEffect(() => {
        startTest();
    }, []);

    const startTest = async () => {
        try {
            setLoading(true);
            const response = await api.get('/tests/comprehensive/start');
            
            if (response.data.success) {
                setTestSession(response.data.testSession);
                setCurrentQuestion(response.data.question);
                setCurrentQuestionNumber(response.data.currentQuestionNumber);
                setCanGoBack(response.data.canGoBack || false);
                setProgress(0);
                setAnswersHistory([]);
            } else {
                setError(response.data.message || 'Ошибка при загрузке теста');
                setShowError(true);
            }
            setLoading(false);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Ошибка начала теста';
            setError(errorMessage);
            setShowError(true);
            setLoading(false);
        }
    };

    const handleAnswer = async (action = 'next') => {
        if (!testSession || !currentQuestion) return;
        
        if (action === 'prev' && !canGoBack) {
            return;
        }

        setSubmitting(true);
        setError('');
        setShowError(false);

        try {
            const response = await api.post('/tests/comprehensive/answer', {
                questionId: currentQuestion.id,
                answer: currentAnswer,
                testSession: testSession,
                action: action
            });

            if (response.data.success) {
                if (response.data.completed) {
                    navigate('/test/comprehensive/results', { 
                        state: { 
                            testResult: response.data.testResult,
                            finalScores: response.data.finalScores,
                            klimovScores: response.data.klimovScores,
                            primaryTypes: response.data.primaryTypes
                        }
                    });
                    return;
                }

                setTestSession(response.data.testSession);
                setCurrentQuestion(response.data.question);
                setCurrentQuestionNumber(response.data.currentQuestionNumber);
                setProgress(response.data.progress);
                setCanGoBack(response.data.canGoBack);
                
                if (action === 'next' && currentAnswer) {
                    const newHistory = [...answersHistory];
                    newHistory.push({
                        questionId: currentQuestion.id,
                        questionText: currentQuestion.text,
                        answer: currentAnswer,
                        questionNumber: currentQuestionNumber
                    });
                    if (newHistory.length > 20) newHistory.shift();
                    setAnswersHistory(newHistory);
                }
                
                setCurrentAnswer('');
            } else {
                setError(response.data.message || 'Ошибка при обработке ответа');
                setShowError(true);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Ошибка отправки ответа';
            setError(errorMessage);
            setShowError(true);
        } finally {
            setSubmitting(false);
        }
    };

    const handlePreviousQuestion = () => {
        if (canGoBack) {
            setConfirmAction('prev');
            setShowConfirmDialog(true);
        }
    };

    const handleConfirmAction = () => {
        if (confirmAction === 'prev') {
            handleAnswer('prev');
        } else if (confirmAction === 'restart') {
            startTest();
        }
        setShowConfirmDialog(false);
        setConfirmAction(null);
    };

    const handleRestartTest = () => {
        setConfirmAction('restart');
        setShowConfirmDialog(true);
    };

    const getAnswerIcon = (value) => {
        switch(value) {
            case '+': return <ThumbUpIcon sx={{ color: '#10b981' }} />;
            case '+-': return <SentimentNeutralIcon sx={{ color: '#f59e0b' }} />;
            case '-': return <ThumbDownIcon sx={{ color: '#ef4444' }} />;
            default: return null;
        }
    };

    const getAnswerLabel = (value) => {
        switch(value) {
            case '+': return 'Нравится';
            case '+-': return 'Скорее нравится';
            case '-': return 'Не нравится';
            default: return '';
        }
    };

    const getAnsweredQuestion = (questionId) => {
        return testSession?.answers.find(a => a.questionId === questionId);
    };

    const answerOptions = [
        { value: '+', label: 'Нравится', icon: <ThumbUpIcon />, color: '#10b981' },
        { value: '+-', label: 'Скорее нравится, чем нет', icon: <SentimentNeutralIcon />, color: '#f59e0b' },
        { value: '-', label: 'Не нравится', icon: <ThumbDownIcon />, color: '#ef4444' }
    ];

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '100vh',
                flexDirection: 'column',
                gap: 2 
            }}>
                <CircularProgress />
                <Typography variant="body2" color="text.secondary">
                    Загрузка комплексного теста...
                </Typography>
            </Box>
        );
    }

    if (!testSession || !currentQuestion) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '100vh',
                flexDirection: 'column',
                gap: 3 
            }}>
                <Typography variant="h5" color="text.secondary">
                    Не удалось загрузить тест
                </Typography>
                <Button onClick={startTest} variant="contained">
                    Попробовать снова
                </Button>
            </Box>
        );
    }

    const answeredCount = testSession.answers.length;
    const currentAnswerObj = getAnsweredQuestion(currentQuestion.id);
    const initialAnswer = currentAnswerObj ? currentAnswerObj.answer : '';

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            py: 4,
        }}>
            <Container maxWidth="md">
                <Box sx={{ mb: 4 }}>
                    <Button
                        onClick={() => navigate('/')}
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            mb: 2,
                            color: 'white',
                            '&:hover': {
                                backgroundColor: alpha('#fff', 0.1),
                            },
                        }}
                    >
                        На главную
                    </Button>
                    
                    <Paper sx={{ p: 2, borderRadius: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AutoAwesomeIcon sx={{ color: theme.palette.primary.main }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Комплексный тест профориентации
                                </Typography>
                            </Box>
                            <Tooltip title="О тесте">
                                <IconButton onClick={() => setShowInfoDialog(true)}>
                                    <InfoIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Paper>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ flex: 1, mr: 2 }}>
                            <LinearProgress 
                                variant="determinate" 
                                value={progress} 
                                sx={{ 
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: alpha('#fff', 0.2),
                                    '& .MuiLinearProgress-bar': {
                                        borderRadius: 4,
                                        background: 'linear-gradient(90deg, #fff, #f0f)',
                                    }
                                }}
                            />
                        </Box>
                        <Typography variant="body2" sx={{ color: 'white', minWidth: 80 }}>
                            {answeredCount} / {TOTAL_QUESTIONS}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="История ответов">
                                <IconButton
                                    onClick={() => setShowHistoryDialog(true)}
                                    sx={{
                                        border: '1px solid',
                                        borderColor: 'rgba(255,255,255,0.3)',
                                        borderRadius: 2,
                                        color: 'white'
                                    }}
                                >
                                    <HistoryIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Начать заново">
                                <IconButton
                                    onClick={handleRestartTest}
                                    sx={{
                                        border: '1px solid',
                                        borderColor: 'rgba(255,255,255,0.3)',
                                        borderRadius: 2,
                                        color: 'white'
                                    }}
                                >
                                    <UndoIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Typography variant="body2" sx={{ color: 'white' }}>
                            Прогресс: {progress}%
                        </Typography>
                    </Box>
                </Box>

                <Snackbar 
                    open={showError} 
                    autoHideDuration={6000} 
                    onClose={() => setShowError(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert severity="error" onClose={() => setShowError(false)}>
                        {error}
                    </Alert>
                </Snackbar>

                <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)' }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Box sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                            }}>
                                <AutoAwesomeIcon />
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Вопрос {currentQuestionNumber} из {TOTAL_QUESTIONS}
                                </Typography>
                            </Box>
                            <Box sx={{ ml: 'auto' }}>
                                <Tooltip title="Оцените ваше отношение">
                                    <HelpOutlineIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                </Tooltip>
                            </Box>
                        </Box>

                        <Typography variant="h5" sx={{ mb: 4, fontWeight: 600, lineHeight: 1.4 }}>
                            {currentQuestion.text}
                        </Typography>

                        <Stack spacing={2} sx={{ mb: 4 }}>
                            {answerOptions.map(option => (
                                <Button
                                    key={option.value}
                                    fullWidth
                                    variant={currentAnswer === option.value || initialAnswer === option.value ? "contained" : "outlined"}
                                    onClick={() => !submitting && setCurrentAnswer(option.value)}
                                    disabled={submitting}
                                    startIcon={option.icon}
                                    sx={{
                                        py: 2,
                                        borderRadius: 2,
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                        justifyContent: 'flex-start',
                                        backgroundColor: (currentAnswer === option.value || initialAnswer === option.value) ? option.color : 'transparent',
                                        borderColor: (currentAnswer === option.value || initialAnswer === option.value) ? option.color : 'grey.300',
                                        color: (currentAnswer === option.value || initialAnswer === option.value) ? 'white' : 'text.primary',
                                        '&:hover': {
                                            backgroundColor: (currentAnswer === option.value || initialAnswer === option.value) 
                                                ? option.color 
                                                : alpha(option.color, 0.1),
                                            borderColor: option.color,
                                        },
                                        '& .MuiButton-startIcon': {
                                            color: (currentAnswer === option.value || initialAnswer === option.value) ? 'white' : option.color,
                                        }
                                    }}
                                >
                                    {option.label}
                                </Button>
                            ))}
                        </Stack>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={handlePreviousQuestion}
                                disabled={!canGoBack || submitting}
                                startIcon={<ArrowBackIcon />}
                                sx={{
                                    py: 2,
                                    borderRadius: 2,
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    borderColor: canGoBack ? 'primary.main' : 'grey.300',
                                    color: canGoBack ? 'primary.main' : 'text.disabled',
                                }}
                            >
                                Назад
                            </Button>
                            
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={() => handleAnswer('next')}
                                disabled={(!currentAnswer && !initialAnswer) || submitting}
                                endIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <ArrowForwardIcon />}
                                sx={{
                                    py: 2,
                                    borderRadius: 2,
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                }}
                            >
                                {submitting ? 'Отправка...' : currentQuestionNumber === TOTAL_QUESTIONS ? 'Завершить' : 'Далее'}
                            </Button>
                        </Box>

                        {initialAnswer && (
                            <Box sx={{ mt: 2, p: 2, borderRadius: 2, backgroundColor: alpha(theme.palette.info.main, 0.1), border: `1px solid ${alpha(theme.palette.info.main, 0.2)}` }}>
                                <Typography variant="body2" sx={{ color: 'info.main', textAlign: 'center' }}>
                                    <strong>Вы уже ответили на этот вопрос.</strong> Вы можете изменить ответ.
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>

                <Dialog open={showInfoDialog} onClose={() => setShowInfoDialog(false)} maxWidth="sm">
                    <DialogTitle>О комплексном тесте</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            Этот тест объединяет 5 профессиональных методик:
                        </Typography>
                        <Box component="ul" sx={{ mt: 2 }}>
                            <li>Тест Климова - базовые типы профессий</li>
                            <li>Карта интересов Голомштока - конкретные сферы</li>
                            <li>Тест Голланда - профессиональная среда</li>
                            <li>Тест Йовайши - склонности к деятельности</li>
                            <li>Методика Л.А. Йовайши - предпочтения в работе</li>
                        </Box>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            Всего 40 вопросов, время прохождения 15-20 минут.
                            По окончании вы получите комплексный анализ по всем методикам.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowInfoDialog(false)}>Понятно</Button>
                    </DialogActions>
                </Dialog>

                <Dialog 
                    open={showHistoryDialog} 
                    onClose={() => setShowHistoryDialog(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        История ответов
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ mt: 2 }}>
                            {answersHistory.length === 0 ? (
                                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                                    История ответов пуста
                                </Typography>
                            ) : (
                                <Stack spacing={2}>
                                    {answersHistory.slice().reverse().map((item, index) => (
                                        <Card key={index} variant="outlined">
                                            <CardContent sx={{ p: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600 }}>
                                                        Вопрос {item.questionNumber}
                                                    </Typography>
                                                    <Chip 
                                                        icon={getAnswerIcon(item.answer)}
                                                        label={getAnswerLabel(item.answer)}
                                                        size="small"
                                                        sx={{ 
                                                            backgroundColor: item.answer === '+' ? alpha('#10b981', 0.1) : 
                                                                           item.answer === '+-' ? alpha('#f59e0b', 0.1) : 
                                                                           alpha('#ef4444', 0.1),
                                                            color: item.answer === '+' ? '#10b981' : 
                                                                  item.answer === '+-' ? '#f59e0b' : 
                                                                  '#ef4444',
                                                            fontWeight: 600
                                                        }}
                                                    />
                                                </Box>
                                                <Typography variant="body2">
                                                    {item.questionText}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Stack>
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowHistoryDialog(false)}>Закрыть</Button>
                    </DialogActions>
                </Dialog>

                <Dialog 
                    open={showConfirmDialog} 
                    onClose={() => setShowConfirmDialog(false)}
                >
                    <DialogTitle>
                        {confirmAction === 'prev' ? 'Вернуться к предыдущему вопросу?' : 'Начать тест заново?'}
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            {confirmAction === 'prev' 
                                ? 'Вы уверены, что хотите вернуться к предыдущему вопросу? Текущий ответ не будет сохранен.'
                                : 'Вы уверены, что хотите начать тест заново? Весь прогресс будет потерян.'}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowConfirmDialog(false)}>Отмена</Button>
                        <Button onClick={handleConfirmAction} variant="contained" color={confirmAction === 'prev' ? 'primary' : 'error'}>
                            {confirmAction === 'prev' ? 'Вернуться' : 'Начать заново'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default ComprehensiveTest;