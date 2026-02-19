import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Container,
    Typography,
    Button,
    Box,
    Card,
    CardContent,
    Grid,
    Chip,
    Stack,
    alpha,
    LinearProgress,
    Stepper,
    Step,
    StepLabel,
    Paper,
    useTheme,
    CircularProgress
} from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReplayIcon from '@mui/icons-material/Replay';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CompareIcon from '@mui/icons-material/Compare';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PercentIcon from '@mui/icons-material/Percent';
import { useAuth } from '../../context/AuthContext';

const KLIMOV_TYPES = {
    manNature: { 
        name: 'Человек-Природа', 
        short: 'П',
        color: '#10b981',
        description: 'Работа с живой и неживой природой, растениями, животными'
    },
    manTech: { 
        name: 'Человек-Техника', 
        short: 'Т',
        color: '#3b82f6',
        description: 'Работа с механизмами, приборами, техническими системами'
    },
    manHuman: { 
        name: 'Человек-Человек', 
        short: 'Ч',
        color: '#ec4899',
        description: 'Работа с людьми, общение, обучение, обслуживание'
    },
    manSign: { 
        name: 'Человек-Знаковая система', 
        short: 'З',
        color: '#f59e0b',
        description: 'Работа с цифрами, формулами, чертежами, языками'
    },
    manArt: { 
        name: 'Человек-Искусство', 
        short: 'Х',
        color: '#8b5cf6',
        description: 'Творческая работа, создание художественных образов'
    }
};

const KlimovResults = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { api } = useAuth();
    
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [finalScores, setFinalScores] = useState(null);
    const [recommendedSpecialties, setRecommendedSpecialties] = useState([]);

    useEffect(() => {
        if (location.state?.testResult) {
            setResults(location.state.testResult);
            setFinalScores(location.state.finalScores || location.state.testResult.klimovScores);
            setRecommendedSpecialties(location.state.recommendedSpecialties || location.state.testResult.recommendedSpecialties || []);
            setLoading(false);
        } else {
            loadLatestResults();
        }
    }, [location]);

    const loadLatestResults = async () => {
        try {
            const response = await api.get('/tests/results');
            if (response.data.testResults && response.data.testResults.length > 0) {
                const latestResult = response.data.testResults[response.data.testResults.length - 1];
                setResults(latestResult);
                setFinalScores(latestResult.klimovScores);
                setRecommendedSpecialties(latestResult.recommendedSpecialties || []);
            }
            setLoading(false);
        } catch (error) {
            console.error('Ошибка загрузки результатов:', error);
            setLoading(false);
        }
    };

    const handleRetakeTest = () => {
        navigate('/test/klimov');
    };

    const getSortedTypes = () => {
        if (!finalScores) return [];
        return Object.entries(finalScores)
            .sort((a, b) => b[1] - a[1])
            .map(([type, score]) => ({ type, score }));
    };

    const getMatchColor = (percentage) => {
        if (percentage >= 80) return '#10b981';
        if (percentage >= 60) return '#f59e0b';
        if (percentage >= 40) return '#3b82f6';
        return '#6b7280';
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!results) {
        return (
            <Box sx={{ textAlign: 'center', py: 10 }}>
                <Typography variant="h5" sx={{ mb: 3 }}>Результаты не найдены</Typography>
                <Button component={Link} to="/test/klimov" variant="contained">
                    Пройти тест
                </Button>
            </Box>
        );
    }

    const primaryType = KLIMOV_TYPES[results.primaryKlimovType];
    const sortedTypes = getSortedTypes();

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            py: 6,
        }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                        component={Link}
                        to="/"
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            color: 'text.secondary',
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            },
                        }}
                    >
                        На главную
                    </Button>
                    
                    <Button
                        startIcon={<ReplayIcon />}
                        onClick={handleRetakeTest}
                        sx={{
                            color: 'text.secondary',
                            border: '1px solid',
                            borderColor: 'grey.300',
                        }}
                    >
                        Пройти заново
                    </Button>
                </Box>

                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Box sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${primaryType?.color || '#6366f1'} 0%, ${alpha(primaryType?.color || '#6366f1', 0.7)} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                        color: 'white',
                    }}>
                        <EmojiEventsIcon sx={{ fontSize: 40 }} />
                    </Box>
                    
                    <Typography variant="h2" sx={{ mb: 2, fontWeight: 800 }}>
                        Ваш профиль: {primaryType?.name}
                    </Typography>
                    
                    <Typography variant="h5" sx={{ color: 'text.secondary', mb: 4, maxWidth: 800, mx: 'auto' }}>
                        {primaryType?.description}
                    </Typography>
                    
                    <Typography variant="body1" color="text.secondary">
                        Тест пройден: {new Date(results.date).toLocaleDateString('ru-RU')}
                    </Typography>
                </Box>

                <Grid container spacing={4} sx={{ mb: 6 }}>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ borderRadius: 3, height: '100%' }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                    Результаты адаптивного теста
                                </Typography>
                                
                                {sortedTypes.map(({ type, score }) => {
                                    const typeInfo = KLIMOV_TYPES[type];
                                    
                                    return (
                                        <Box key={type} sx={{ mb: 3 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Box sx={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: '50%',
                                                        backgroundColor: typeInfo.color
                                                    }} />
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {typeInfo.name}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: typeInfo.color }}>
                                                    {score}%
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={score}
                                                sx={{
                                                    height: 8,
                                                    borderRadius: 4,
                                                    backgroundColor: alpha(typeInfo.color, 0.1),
                                                    '& .MuiLinearProgress-bar': {
                                                        borderRadius: 4,
                                                        backgroundColor: typeInfo.color,
                                                    },
                                                }}
                                            />
                                        </Box>
                                    );
                                })}
                                
                                <Box sx={{ mt: 4, p: 3, borderRadius: 2, backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        Вопросов пройдено:
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {results.questionsCount} из 40
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <Card sx={{ borderRadius: 3, height: '100%' }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <SchoolIcon /> Подходящие специальности
                                </Typography>
                                
                                {recommendedSpecialties.length === 0 ? (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <PsychologyIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                                        <Typography variant="body1" color="text.secondary">
                                            Нет рекомендаций. Администратор еще не добавил специальности для вашего типа.
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Stack spacing={3}>
                                        {recommendedSpecialties.slice(0, 5).map((specialty, index) => {
                                            const matchColor = getMatchColor(specialty.matchPercentage);
                                            return (
                                                <Card 
                                                    key={specialty.specialtyId || index}
                                                    sx={{ 
                                                        border: `1px solid ${alpha(matchColor, 0.2)}`,
                                                        backgroundColor: alpha(matchColor, 0.05)
                                                    }}
                                                >
                                                    <CardContent>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                            <Box>
                                                                <Typography variant="body2" sx={{ 
                                                                    color: 'text.secondary',
                                                                    fontFamily: 'monospace',
                                                                    fontWeight: 600,
                                                                    fontSize: '0.8rem'
                                                                }}>
                                                                    {specialty.code}
                                                                </Typography>
                                                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                                                    {specialty.name}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <PercentIcon sx={{ color: matchColor }} />
                                                                <Typography variant="h6" sx={{ fontWeight: 700, color: matchColor }}>
                                                                    {specialty.matchPercentage}%
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                        
                                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                            {specialty.description || 'Описание отсутствует'}
                                                        </Typography>
                                                        
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Box>
                                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                                    {specialty.collegeName}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {specialty.duration} • {specialty.form === 'full-time' ? 'Очная' : specialty.form === 'part-time' ? 'Очно-заочная' : 'Заочная'}
                                                                </Typography>
                                                            </Box>
                                                            <Button
                                                                component={Link}
                                                                to={`/specialties/${specialty.specialtyId}`}
                                                                size="small"
                                                                variant="outlined"
                                                            >
                                                                Подробнее
                                                            </Button>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </Stack>
                                )}
                                
                                <Button
                                    component={Link}
                                    to="/specialties"
                                    fullWidth
                                    variant="contained"
                                    sx={{
                                        mt: 3,
                                        py: 1.5,
                                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                    }}
                                >
                                    Смотреть все специальности
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Box sx={{ textAlign: 'center', mt: 8 }}>
                    <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
                        Что дальше?
                    </Typography>
                    
                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={12} sm={4}>
                            <Card sx={{ borderRadius: 3, p: 3, textAlign: 'center' }}>
                                <PsychologyIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Узнать подробнее
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Изучите описание вашего типа и подходящие специальности
                                </Typography>
                                <Button component={Link} to="/profile">
                                    В профиль
                                </Button>
                            </Card>
                        </Grid>
                        
                        <Grid item xs={12} sm={4}>
                            <Card sx={{ borderRadius: 3, p: 3, textAlign: 'center' }}>
                                <CompareIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Сравнить специальности
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Сравните несколько специальностей по ключевым параметрам
                                </Typography>
                                <Button component={Link} to="/specialties/compare">
                                    Сравнить
                                </Button>
                            </Card>
                        </Grid>
                        
                        <Grid item xs={12} sm={4}>
                            <Card sx={{ borderRadius: 3, p: 3, textAlign: 'center' }}>
                                <TrendingUpIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Найти колледжи
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Найдите учебные заведения с подходящими программами
                                </Typography>
                                <Button component={Link} to="/colleges">
                                    Поиск
                                </Button>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
};

export default KlimovResults;