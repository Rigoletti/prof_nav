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
    Paper,
    useTheme,
    CircularProgress,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Avatar
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReplayIcon from '@mui/icons-material/Replay';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CompareIcon from '@mui/icons-material/Compare';
import PercentIcon from '@mui/icons-material/Percent';
import BrushIcon from '@mui/icons-material/Brush';
import BuildIcon from '@mui/icons-material/Build';
import PeopleIcon from '@mui/icons-material/People';
import PsychologyIcon from '@mui/icons-material/Psychology';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useAuth } from '../../context/AuthContext';

const KLIMOV_TYPES = {
    manNature: { name: 'Человек-Природа', color: '#10b981' },
    manTech: { name: 'Человек-Техника', color: '#3b82f6' },
    manHuman: { name: 'Человек-Человек', color: '#ec4899' },
    manSign: { name: 'Человек-Знаковая система', color: '#f59e0b' },
    manArt: { name: 'Человек-Искусство', color: '#8b5cf6' }
};

const YOVAYSHA_TYPE_NAMES = {
    art: { 
        name: 'Сфера искусства', 
        description: 'Творческая деятельность, создание художественных образов',
        color: '#ec4899', 
        icon: <BrushIcon />, 
        short: 'И' 
    },
    technical: { 
        name: 'Техническая сфера', 
        description: 'Работа с техникой, механизмами, приборами',
        color: '#3b82f6', 
        icon: <BuildIcon />, 
        short: 'Т' 
    },
    workWithPeople: { 
        name: 'Сфера работы с людьми', 
        description: 'Общение, помощь, обучение, обслуживание людей',
        color: '#10b981', 
        icon: <PeopleIcon />, 
        short: 'Л' 
    },
    mental: { 
        name: 'Умственная сфера', 
        description: 'Интеллектуальная деятельность, анализ, исследование',
        color: '#f59e0b', 
        icon: <PsychologyIcon />, 
        short: 'У' 
    },
    aesthetic: { 
        name: 'Эстетическая сфера', 
        description: 'Создание и оценка прекрасного, дизайн, стиль',
        color: '#8b5cf6', 
        icon: <BrushIcon />, 
        short: 'Э' 
    },
    physical: { 
        name: 'Физическая сфера', 
        description: 'Физический труд, спорт, работа на природе',
        color: '#ef4444', 
        icon: <FitnessCenterIcon />, 
        short: 'Ф' 
    },
    economic: { 
        name: 'Экономическая сфера', 
        description: 'Финансы, бизнес, планирование, учет',
        color: '#6366f1', 
        icon: <AttachMoneyIcon />, 
        short: 'Б' 
    }
};

const YovayshaResults = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { api } = useAuth();
    
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [finalScores, setFinalScores] = useState(null);
    const [topThreeTypes, setTopThreeTypes] = useState([]);
    const [klimovScores, setKlimovScores] = useState(null);
    const [recommendedSpecialties, setRecommendedSpecialties] = useState([]);

    useEffect(() => {
        if (location.state?.testResult) {
            setResults(location.state.testResult);
            setFinalScores(location.state.finalScores || location.state.testResult.yovayshaScores);
            setTopThreeTypes(location.state.topThreeTypes || location.state.testResult.topYovayshaTypes || []);
            setKlimovScores(location.state.klimovScores || location.state.testResult.klimovScores);
            setRecommendedSpecialties(location.state.recommendedSpecialties || location.state.testResult.recommendedSpecialties || []);
            setLoading(false);
        } else {
            loadLatestResults();
        }
    }, [location]);

    const loadLatestResults = async () => {
        try {
            const response = await api.get('/tests/yovaysha/results');
            if (response.data.results && response.data.results.length > 0) {
                const latestResult = response.data.results[response.data.results.length - 1];
                setResults(latestResult);
                setFinalScores(latestResult.yovayshaScores);
                setTopThreeTypes(latestResult.topYovayshaTypes || []);
                setKlimovScores(latestResult.klimovScores);
                setRecommendedSpecialties(latestResult.recommendedSpecialties || []);
            }
            setLoading(false);
        } catch (error) {
            console.error('Ошибка загрузки результатов:', error);
            setLoading(false);
        }
    };

    const handleRetakeTest = () => {
        navigate('/test/yovaysha');
    };

    const getSortedScores = () => {
        if (!finalScores) return [];
        return Object.entries(finalScores)
            .sort((a, b) => b[1] - a[1])
            .map(([type, score]) => ({ type, score, info: YOVAYSHA_TYPE_NAMES[type] }));
    };

    const getMatchColor = (percentage) => {
        if (percentage >= 80) return '#10b981';
        if (percentage >= 60) return '#f59e0b';
        if (percentage >= 40) return '#3b82f6';
        return '#6b7280';
    };

    const getTypeIcon = (type) => {
        return YOVAYSHA_TYPE_NAMES[type]?.icon || <WorkIcon />;
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
                <Button onClick={handleRetakeTest} variant="contained">
                    Пройти тест
                </Button>
            </Box>
        );
    }

    const primaryType = YOVAYSHA_TYPE_NAMES[results.primaryYovayshaType];
    const sortedScores = getSortedScores();
    const topThree = topThreeTypes.length > 0 ? topThreeTypes : sortedScores.slice(0, 3);

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
                    <Avatar
                        sx={{
                            width: 80,
                            height: 80,
                            bgcolor: primaryType?.color || '#6366f1',
                            mx: 'auto',
                            mb: 3,
                        }}
                    >
                        {primaryType?.icon || <EmojiEventsIcon />}
                    </Avatar>
                    
                    <Typography variant="h2" sx={{ mb: 2, fontWeight: 800 }}>
                        Ваши склонности: {primaryType?.name}
                    </Typography>
                    
                    <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2, maxWidth: 800, mx: 'auto' }}>
                        {primaryType?.description}
                    </Typography>
                    
                    <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2, maxWidth: 800, mx: 'auto' }}>
                        Топ-3 сферы ваших склонностей:
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mb: 4 }}>
                        {topThree.map((item, index) => {
                            const typeInfo = YOVAYSHA_TYPE_NAMES[item.type || item];
                            const score = item.score || finalScores[item.type || item];
                            return (
                                <Chip
                                    key={index}
                                    avatar={
                                        <Avatar sx={{ bgcolor: typeInfo?.color }}>
                                            {index + 1}
                                        </Avatar>
                                    }
                                    label={`${typeInfo?.name} - ${score}%`}
                                    sx={{
                                        py: 2,
                                        px: 1,
                                        backgroundColor: alpha(typeInfo?.color || '#6366f1', 0.1),
                                        color: typeInfo?.color || '#6366f1',
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        '& .MuiChip-avatar': {
                                            bgcolor: typeInfo?.color,
                                            color: 'white',
                                        }
                                    }}
                                />
                            );
                        })}
                    </Box>
                    
                    <Typography variant="body1" color="text.secondary">
                        Тест пройден: {new Date(results.date).toLocaleDateString('ru-RU')}
                    </Typography>
                </Box>

                <Grid container spacing={4} sx={{ mb: 6 }}>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ borderRadius: 3, height: '100%' }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                    Результаты по сферам деятельности
                                </Typography>
                                
                                {sortedScores.map(({ type, score, info }) => (
                                    <Box key={type} sx={{ mb: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    backgroundColor: info?.color
                                                }} />
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {info?.name}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: info?.color }}>
                                                {score}%
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={score}
                                            sx={{
                                                height: 8,
                                                borderRadius: 4,
                                                backgroundColor: alpha(info?.color || '#6366f1', 0.1),
                                                '& .MuiLinearProgress-bar': {
                                                    borderRadius: 4,
                                                    backgroundColor: info?.color || '#6366f1',
                                                },
                                            }}
                                        />
                                    </Box>
                                ))}
                                
                                <Box sx={{ mt: 4, p: 3, borderRadius: 2, backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        Вопросов пройдено:
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {results.questionsCount} из 42
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <Card sx={{ borderRadius: 3, height: '100%' }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <PsychologyIcon /> Соответствие типам Климова
                                </Typography>
                                
                                {klimovScores && Object.entries(klimovScores)
                                    .sort((a, b) => b[1] - a[1])
                                    .map(([type, score]) => {
                                        const typeInfo = KLIMOV_TYPES[type];
                                        return (
                                            <Box key={type} sx={{ mb: 3 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Box sx={{
                                                            width: 8,
                                                            height: 8,
                                                            borderRadius: '50%',
                                                            backgroundColor: typeInfo?.color
                                                        }} />
                                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                            {typeInfo?.name}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: typeInfo?.color }}>
                                                        {score}%
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={score}
                                                    sx={{
                                                        height: 8,
                                                        borderRadius: 4,
                                                        backgroundColor: alpha(typeInfo?.color || '#6366f1', 0.1),
                                                        '& .MuiLinearProgress-bar': {
                                                            borderRadius: 4,
                                                            backgroundColor: typeInfo?.color || '#6366f1',
                                                        },
                                                    }}
                                                />
                                            </Box>
                                        );
                                    })}
                                
                                <Box sx={{ mt: 4, p: 3, borderRadius: 2, backgroundColor: alpha(theme.palette.info.main, 0.05) }}>
                                    <Typography variant="body2" color="text.secondary">
                                        На основе ваших склонностей мы определили соответствие типам личности по Климову.
                                        Это поможет подобрать наиболее подходящие специальности.
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Card sx={{ borderRadius: 3, mb: 6 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SchoolIcon /> Рекомендованные специальности
                        </Typography>
                        
                        {recommendedSpecialties.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <WorkIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                                <Typography variant="body1" color="text.secondary">
                                    Нет рекомендаций. Администратор еще не добавил специальности для ваших склонностей.
                                </Typography>
                            </Box>
                        ) : (
                            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600 }}>Код</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Название специальности</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Колледж</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }} align="center">Совпадение</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }} align="center">Действия</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {recommendedSpecialties.slice(0, 10).map((specialty, index) => {
                                            const matchColor = getMatchColor(specialty.matchPercentage);
                                            return (
                                                <TableRow key={specialty.specialtyId || index} hover>
                                                    <TableCell>
                                                        <Typography sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                                                            {specialty.code}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography sx={{ fontWeight: 500 }}>
                                                            {specialty.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {specialty.duration} • {specialty.form === 'full-time' ? 'Очная' : specialty.form === 'part-time' ? 'Очно-заочная' : 'Заочная'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {specialty.collegeName || 'Не указан'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                                            <PercentIcon sx={{ fontSize: 16, color: matchColor }} />
                                                            <Typography sx={{ fontWeight: 600, color: matchColor }}>
                                                                {specialty.matchPercentage}%
                                                            </Typography>
                                                        </Box>
                                                        <Tooltip title={specialty.matchReasons?.join(', ') || ''}>
                                                            <Typography variant="caption" color="text.secondary" sx={{ cursor: 'help' }}>
                                                                подробнее
                                                            </Typography>
                                                        </Tooltip>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Button
                                                            component={Link}
                                                            to={`/specialties/${specialty.specialtyId}`}
                                                            size="small"
                                                            variant="outlined"
                                                        >
                                                            Подробнее
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
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

                <Box sx={{ textAlign: 'center', mt: 8 }}>
                    <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
                        Что дальше?
                    </Typography>
                    
                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={12} sm={4}>
                            <Card sx={{ borderRadius: 3, p: 3, textAlign: 'center', height: '100%' }}>
                                <WorkIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Узнать подробнее
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Изучите описание ваших склонностей и подходящие специальности
                                </Typography>
                                <Button component={Link} to="/profile">
                                    В профиль
                                </Button>
                            </Card>
                        </Grid>
                        
                        <Grid item xs={12} sm={4}>
                            <Card sx={{ borderRadius: 3, p: 3, textAlign: 'center', height: '100%' }}>
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
                            <Card sx={{ borderRadius: 3, p: 3, textAlign: 'center', height: '100%' }}>
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

export default YovayshaResults;