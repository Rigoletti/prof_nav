// frontend/components/test/ComprehensiveResults.jsx
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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Avatar,
    Divider,
    Tab,
    Tabs
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReplayIcon from '@mui/icons-material/Replay';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CompareIcon from '@mui/icons-material/Compare';
import PercentIcon from '@mui/icons-material/Percent';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import WorkIcon from '@mui/icons-material/Work';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import { useAuth } from '../../context/AuthContext';

// Импортируем описания типов из контроллера
const TYPE_NAMES = {
    // Климов
    manHuman: { name: 'Человек-Человек', description: 'Работа с людьми, общение, обучение', color: '#ec4899' },
    manTech: { name: 'Человек-Техника', description: 'Работа с техникой, механизмами', color: '#3b82f6' },
    manArt: { name: 'Человек-Искусство', description: 'Творческая работа, искусство', color: '#8b5cf6' },
    manNature: { name: 'Человек-Природа', description: 'Работа с природой, растениями, животными', color: '#10b981' },
    manSign: { name: 'Человек-Знаковая система', description: 'Работа с цифрами, схемами, документами', color: '#f59e0b' },
    
    // Голомшток
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
    
    // Голланд
    realistic: { name: 'Реалистичный', description: 'Практическая работа с техникой', color: '#3b82f6' },
    investigative: { name: 'Исследовательский', description: 'Научные исследования и анализ', color: '#10b981' },
    artistic: { name: 'Артистический', description: 'Творчество и самовыражение', color: '#ec4899' },
    social: { name: 'Социальный', description: 'Работа с людьми и помощь', color: '#f59e0b' },
    enterprising: { name: 'Предприимчивый', description: 'Бизнес и руководство', color: '#8b5cf6' },
    conventional: { name: 'Конвенциональный', description: 'Работа с документами и учет', color: '#6b7280' },
    
    // Йовайша
    aesthetic: { name: 'Эстетическая сфера', description: 'Дизайн, стиль, красота', color: '#8b5cf6' },
    mental: { name: 'Умственная сфера', description: 'Интеллектуальный труд', color: '#f59e0b' },
    physical: { name: 'Физическая сфера', description: 'Физический труд, спорт', color: '#ef4444' },
    economic: { name: 'Экономическая сфера', description: 'Финансы, бизнес', color: '#6366f1' },
    workWithPeople: { name: 'Работа с людьми', description: 'Общение и помощь', color: '#10b981' },
    
    // Йовайша Л.А.
    plannedWork: { name: 'Плановая деятельность', description: 'Организация и контроль', color: '#6366f1' },
    extremeWork: { name: 'Экстремальная деятельность', description: 'Риск и активность', color: '#ef4444' },
    technicalWork: { name: 'Техническая работа', description: 'Конструирование и ремонт', color: '#3b82f6' }
};

const KLIMOV_TYPES = {
    manNature: { name: 'Человек-Природа', color: '#10b981' },
    manTech: { name: 'Человек-Техника', color: '#3b82f6' },
    manHuman: { name: 'Человек-Человек', color: '#ec4899' },
    manSign: { name: 'Человек-Знаковая система', color: '#f59e0b' },
    manArt: { name: 'Человек-Искусство', color: '#8b5cf6' }
};

const ComprehensiveResults = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { api } = useAuth();
    
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [finalScores, setFinalScores] = useState(null);
    const [klimovScores, setKlimovScores] = useState(null);
    const [primaryTypes, setPrimaryTypes] = useState(null);
    const [recommendedSpecialties, setRecommendedSpecialties] = useState([]);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        if (location.state?.testResult) {
            setResults(location.state.testResult);
            setFinalScores(location.state.finalScores);
            setKlimovScores(location.state.klimovScores);
            setPrimaryTypes(location.state.primaryTypes);
            setRecommendedSpecialties(location.state.recommendedSpecialties || []);
            setLoading(false);
        } else {
            loadLatestResults();
        }
    }, [location]);

    const loadLatestResults = async () => {
        try {
            const response = await api.get('/tests/comprehensive/results');
            if (response.data.results && response.data.results.length > 0) {
                const latestResult = response.data.results[response.data.results.length - 1];
                setResults(latestResult);
                setFinalScores(latestResult.comprehensiveScores);
                setKlimovScores(latestResult.klimovScores);
                setPrimaryTypes(latestResult.primaryComprehensiveTypes);
                setRecommendedSpecialties(latestResult.recommendedSpecialties || []);
            }
            setLoading(false);
        } catch (error) {
            console.error('Ошибка загрузки результатов:', error);
            setLoading(false);
        }
    };

    const handleRetakeTest = () => {
        navigate('/test/comprehensive');
    };

    const getMatchColor = (percentage) => {
        if (percentage >= 80) return '#10b981';
        if (percentage >= 60) return '#f59e0b';
        if (percentage >= 40) return '#3b82f6';
        return '#6b7280';
    };

    const renderMethodScores = (method, scores) => {
        if (!scores) return null;
        
        return Object.entries(scores)
            .sort((a, b) => b[1] - a[1])
            .map(([type, score]) => {
                const typeInfo = TYPE_NAMES[type];
                if (!typeInfo) return null;
                
                return (
                    <Box key={type} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {typeInfo.name}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: typeInfo.color }}>
                                {score}%
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={score}
                            sx={{
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: alpha(typeInfo.color, 0.1),
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: typeInfo.color,
                                    borderRadius: 3,
                                }
                            }}
                        />
                        <Typography variant="caption" color="text.secondary">
                            {typeInfo.description}
                        </Typography>
                    </Box>
                );
            });
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

    const primaryKlimovType = KLIMOV_TYPES[Object.entries(klimovScores || {}).sort((a, b) => b[1] - a[1])[0]?.[0]];

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            py: 6,
        }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                        component={Link}
                        to="/"
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            color: 'white',
                            '&:hover': {
                                backgroundColor: alpha('#fff', 0.1),
                            },
                        }}
                    >
                        На главную
                    </Button>
                    
                    <Button
                        startIcon={<ReplayIcon />}
                        onClick={handleRetakeTest}
                        sx={{
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.3)',
                        }}
                    >
                        Пройти заново
                    </Button>
                </Box>

                <Paper sx={{ p: 4, mb: 6, borderRadius: 3 }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Avatar
                            sx={{
                                width: 80,
                                height: 80,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                mx: 'auto',
                                mb: 3,
                            }}
                        >
                            <AutoAwesomeIcon sx={{ fontSize: 40 }} />
                        </Avatar>
                        
                        <Typography variant="h3" sx={{ mb: 2, fontWeight: 800 }}>
                            Ваш комплексный профиль
                        </Typography>
                        
                        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
                            Основной тип по Климову: {primaryKlimovType?.name}
                        </Typography>
                        
                        <Typography variant="body1" color="text.secondary">
                            Тест пройден: {new Date(results.date).toLocaleDateString('ru-RU')}
                        </Typography>
                    </Box>

                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
                            <Tab label="Климов" icon={<PsychologyIcon />} iconPosition="start" />
                            <Tab label="Голомшток" icon={<AutoStoriesIcon />} iconPosition="start" />
                            <Tab label="Голланд" icon={<WorkIcon />} iconPosition="start" />
                            <Tab label="Йовайша" icon={<PsychologyAltIcon />} iconPosition="start" />
                            <Tab label="Л.А. Йовайша" icon={<PsychologyAltIcon />} iconPosition="start" />
                        </Tabs>
                    </Box>

                    <Box sx={{ mt: 3 }}>
                        {activeTab === 0 && (
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 3 }}>
                                                Результаты по Климову
                                            </Typography>
                                            {renderMethodScores('klimov', finalScores?.klimov)}
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 2 }}>
                                                Ваш ведущий тип
                                            </Typography>
                                            {primaryTypes?.klimov && (
                                                <Box>
                                                    <Typography variant="h5" sx={{ color: TYPE_NAMES[primaryTypes.klimov]?.color, mb: 1 }}>
                                                        {TYPE_NAMES[primaryTypes.klimov]?.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {TYPE_NAMES[primaryTypes.klimov]?.description}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        )}

                        {activeTab === 1 && (
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 3 }}>
                                                Карта интересов
                                            </Typography>
                                            {renderMethodScores('golomshtok', finalScores?.golomshtok)}
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 2 }}>
                                                Основной интерес
                                            </Typography>
                                            {primaryTypes?.golomshtok && (
                                                <Box>
                                                    <Typography variant="h5" sx={{ color: TYPE_NAMES[primaryTypes.golomshtok]?.color, mb: 1 }}>
                                                        {TYPE_NAMES[primaryTypes.golomshtok]?.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {TYPE_NAMES[primaryTypes.golomshtok]?.description}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        )}

                        {activeTab === 2 && (
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 3 }}>
                                                Тип профессиональной среды
                                            </Typography>
                                            {renderMethodScores('holland', finalScores?.holland)}
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 2 }}>
                                                Ведущий тип
                                            </Typography>
                                            {primaryTypes?.holland && (
                                                <Box>
                                                    <Typography variant="h5" sx={{ color: TYPE_NAMES[primaryTypes.holland]?.color, mb: 1 }}>
                                                        {TYPE_NAMES[primaryTypes.holland]?.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {TYPE_NAMES[primaryTypes.holland]?.description}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        )}

                        {activeTab === 3 && (
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 3 }}>
                                                Склонности по Йовайше
                                            </Typography>
                                            {renderMethodScores('yovaysha', finalScores?.yovaysha)}
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 2 }}>
                                                Ведущая склонность
                                            </Typography>
                                            {primaryTypes?.yovaysha && (
                                                <Box>
                                                    <Typography variant="h5" sx={{ color: TYPE_NAMES[primaryTypes.yovaysha]?.color, mb: 1 }}>
                                                        {TYPE_NAMES[primaryTypes.yovaysha]?.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {TYPE_NAMES[primaryTypes.yovaysha]?.description}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        )}

                        {activeTab === 4 && (
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 3 }}>
                                                Предпочтения в работе
                                            </Typography>
                                            {renderMethodScores('yovaysha_la', finalScores?.yovaysha_la)}
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 2 }}>
                                                Ведущее предпочтение
                                            </Typography>
                                            {primaryTypes?.yovaysha_la && (
                                                <Box>
                                                    <Typography variant="h5" sx={{ color: TYPE_NAMES[primaryTypes.yovaysha_la]?.color, mb: 1 }}>
                                                        {TYPE_NAMES[primaryTypes.yovaysha_la]?.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {TYPE_NAMES[primaryTypes.yovaysha_la]?.description}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        )}
                    </Box>

                    <Divider sx={{ my: 4 }} />

                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                                Соответствие типам Климова
                            </Typography>
                        </Grid>
                        {klimovScores && Object.entries(klimovScores)
                            .sort((a, b) => b[1] - a[1])
                            .map(([type, score]) => {
                                const typeInfo = KLIMOV_TYPES[type];
                                return (
                                    <Grid item xs={12} sm={6} md={4} key={type}>
                                        <Paper sx={{ p: 2, bgcolor: alpha(typeInfo?.color, 0.05) }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: typeInfo?.color }}>
                                                {typeInfo?.name}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                                <Box sx={{ flex: 1 }}>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={score}
                                                        sx={{
                                                            height: 8,
                                                            borderRadius: 4,
                                                            backgroundColor: alpha(typeInfo?.color, 0.1),
                                                            '& .MuiLinearProgress-bar': {
                                                                backgroundColor: typeInfo?.color,
                                                            }
                                                        }}
                                                    />
                                                </Box>
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: typeInfo?.color }}>
                                                    {score}%
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                );
                            })}
                    </Grid>
                </Paper>

                <Paper sx={{ p: 4, borderRadius: 3 }}>
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SchoolIcon /> Рекомендованные специальности
                    </Typography>
                    
                    {recommendedSpecialties.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <AutoAwesomeIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                            <Typography variant="body1" color="text.secondary">
                                Нет рекомендаций. Администратор еще не добавил специальности.
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
                                                        {specialty.duration} • {specialty.form === 'full-time' ? 'Очная' : 'Очно-заочная'}
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
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }}
                    >
                        Смотреть все специальности
                    </Button>
                </Paper>

                <Box sx={{ textAlign: 'center', mt: 6 }}>
                    <Typography variant="h5" sx={{ mb: 4, fontWeight: 600, color: 'white' }}>
                        Что дальше?
                    </Typography>
                    
                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={12} sm={4}>
                            <Card sx={{ borderRadius: 3, p: 3, textAlign: 'center', height: '100%' }}>
                                <PsychologyIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    В профиль
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Сохраните результаты и отслеживайте прогресс
                                </Typography>
                                <Button component={Link} to="/profile">
                                    Перейти
                                </Button>
                            </Card>
                        </Grid>
                        
                        <Grid item xs={12} sm={4}>
                            <Card sx={{ borderRadius: 3, p: 3, textAlign: 'center', height: '100%' }}>
                                <CompareIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Сравнить
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Сравните специальности по параметрам
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
                                    Колледжи
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Найдите учебные заведения
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

export default ComprehensiveResults;