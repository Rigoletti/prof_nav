import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Chip,
    Stack,
    Button,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    alpha,
    useTheme,
    CircularProgress,
    Alert,
    IconButton,
    Paper,
    LinearProgress,
    Avatar,
    AvatarGroup,
    Tooltip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SchoolIcon from '@mui/icons-material/School';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ClassIcon from '@mui/icons-material/Class';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LanguageIcon from '@mui/icons-material/Language';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import CompareIcon from '@mui/icons-material/Compare';
import PsychologyIcon from '@mui/icons-material/Psychology';
import PercentIcon from '@mui/icons-material/Percent';
import StarIcon from '@mui/icons-material/Star';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { useAuth } from '../../context/AuthContext';

const KLIMOV_TYPES = {
    manNature: { 
        name: 'Человек-Природа', 
        color: '#10b981',
        description: 'Работа с живой и неживой природой, растениями, животными'
    },
    manTech: { 
        name: 'Человек-Техника', 
        color: '#3b82f6',
        description: 'Работа с механизмами, приборами, техническими системами'
    },
    manHuman: { 
        name: 'Человек-Человек', 
        color: '#ec4899',
        description: 'Работа с людьми, общение, обучение, обслуживание'
    },
    manSign: { 
        name: 'Человек-Знаковая система', 
        color: '#f59e0b',
        description: 'Работа с цифрами, формулами, чертежами, языками'
    },
    manArt: { 
        name: 'Человек-Искусство', 
        color: '#8b5cf6',
        description: 'Творческая работа, создание художественных образов'
    }
};

const SpecialtyDetailPage = () => {
    const theme = useTheme();
    const { id } = useParams();
    const navigate = useNavigate();
    const { api, user } = useAuth();
    
    const [specialty, setSpecialty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [savedSpecialties, setSavedSpecialties] = useState([]);

    useEffect(() => {
        loadSpecialty();
        if (user) {
            loadSavedSpecialties();
        }
    }, [id]);

    const loadSpecialty = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/specialties/${id}`);
            
            if (response.data.success) {
                setSpecialty(response.data.specialty);
            } else {
                setError(response.data.message);
            }
            setLoading(false);
        } catch (error) {
            setError(error.response?.data?.message || 'Ошибка загрузки специальности');
            setLoading(false);
        }
    };

    const loadSavedSpecialties = async () => {
        try {
            const response = await api.get('/specialties/saved/list');
            setSavedSpecialties(response.data.savedSpecialties.map(s => s._id));
        } catch (error) {
            console.error('Ошибка загрузки сохраненных специальностей:', error);
        }
    };

    const handleSaveSpecialty = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        
        try {
            const isSaved = savedSpecialties.includes(specialty._id);
            if (isSaved) {
                await api.post('/specialties/unsave', { specialtyId: specialty._id });
                setSavedSpecialties(prev => prev.filter(id => id !== specialty._id));
            } else {
                await api.post('/specialties/save', { specialtyId: specialty._id });
                setSavedSpecialties(prev => [...prev, specialty._id]);
            }
        } catch (error) {
            console.error('Ошибка сохранения специальности:', error);
        }
    };

    const handleAddToCompare = () => {
        const currentCompare = JSON.parse(localStorage.getItem('compareItems') || '[]');
        if (!currentCompare.includes(id)) {
            if (currentCompare.length >= 3) {
                currentCompare.shift();
            }
            currentCompare.push(id);
            localStorage.setItem('compareItems', JSON.stringify(currentCompare));
        }
        navigate('/specialties/compare');
    };

    const getFormLabel = (form) => {
        switch (form) {
            case 'full-time': return 'Очная';
            case 'part-time': return 'Очно-заочная';
            case 'distance': return 'Заочная';
            default: return form;
        }
    };

    const getMatchColor = (percentage) => {
        if (percentage >= 80) return '#10b981';
        if (percentage >= 60) return '#f59e0b';
        if (percentage >= 40) return '#3b82f6';
        return '#6b7280';
    };

    const getMatchLabel = (percentage) => {
        if (percentage >= 80) return 'Высокое';
        if (percentage >= 60) return 'Хорошее';
        if (percentage >= 40) return 'Среднее';
        if (percentage >= 20) return 'Низкое';
        return 'Минимальное';
    };

    // Функция для отображения колледжей
    const renderColleges = () => {
        if (!specialty.colleges || specialty.colleges.length === 0) {
            if (!specialty.collegeNames || specialty.collegeNames.length === 0) {
                return (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        Информация о колледжах не указана
                    </Alert>
                );
            }
            
            // Если есть только названия колледжей
            return (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessIcon /> Доступна в колледжах:
                    </Typography>
                    <Grid container spacing={2}>
                        {specialty.collegeNames.map((name, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={idx}>
                                <Card 
                                    variant="outlined" 
                                    sx={{ 
                                        height: '100%',
                                        '&:hover': {
                                            borderColor: 'primary.main',
                                            backgroundColor: alpha(theme.palette.primary.main, 0.02)
                                        }
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                            <Avatar 
                                                sx={{ 
                                                    bgcolor: '#6366f1',
                                                    width: 40,
                                                    height: 40
                                                }}
                                            >
                                                {name.charAt(0)}
                                            </Avatar>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                {name}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Информация о колледже не указана
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            );
        }

        // Если есть объекты колледжей
        return (
            <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon /> Доступна в {specialty.colleges.length} колледжах:
                </Typography>
                <Grid container spacing={3}>
                    {specialty.colleges.map((college) => (
                        <Grid item xs={12} md={6} key={college._id}>
                            <Card 
                                variant="outlined" 
                                sx={{ 
                                    height: '100%',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        backgroundColor: alpha(theme.palette.primary.main, 0.02)
                                    }
                                }}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                                        <Avatar 
                                            sx={{ 
                                                bgcolor: '#6366f1',
                                                width: 56,
                                                height: 56,
                                                fontSize: '1.5rem'
                                            }}
                                        >
                                            {college.name.charAt(0)}
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                                {college.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                                <LocationOnIcon fontSize="small" />
                                                {college.city}, {college.region}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2">
                                            <strong>Адрес:</strong> {college.address}
                                        </Typography>
                                    </Box>
                                    
                                    <Grid container spacing={1}>
                                        {college.phone && (
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <PhoneIcon fontSize="small" />
                                                    {college.phone}
                                                </Typography>
                                            </Grid>
                                        )}
                                        {college.email && (
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <EmailIcon fontSize="small" />
                                                    {college.email}
                                                </Typography>
                                            </Grid>
                                        )}
                                        {college.website && (
                                            <Grid item xs={12}>
                                                <Button
                                                    href={college.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    startIcon={<LanguageIcon />}
                                                    size="small"
                                                    sx={{ mt: 1 }}
                                                >
                                                    Посетить сайт колледжа
                                                </Button>
                                            </Grid>
                                        )}
                                    </Grid>
                                    
                                    {college.description && (
                                        <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                                            <Typography variant="body2" color="text.secondary">
                                                {college.description.length > 150 
                                                    ? `${college.description.substring(0, 150)}...` 
                                                    : college.description}
                                            </Typography>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !specialty) {
        return (
            <Container sx={{ py: 8 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error || 'Специальность не найдена'}
                </Alert>
                <Button component={Link} to="/specialties" startIcon={<ArrowBackIcon />}>
                    Вернуться к каталогу
                </Button>
            </Container>
        );
    }

    const isSaved = savedSpecialties.includes(specialty._id);
    const matchPercentage = specialty.matchPercentage || 0;
    const matchColor = getMatchColor(matchPercentage);
    const matchLabel = getMatchLabel(matchPercentage);
    const collegeCount = specialty.colleges?.length || specialty.collegeNames?.length || 0;

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            py: 6,
        }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: 4 }}>
                    <Button
                        component={Link}
                        to="/specialties"
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            mb: 2,
                            color: 'text.secondary',
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            },
                        }}
                    >
                        К каталогу
                    </Button>
                </Box>

                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Paper sx={{ p: 4, borderRadius: 3, position: 'relative' }}>
                            {specialty.isRecommended && (
                                <Box sx={{
                                    position: 'absolute',
                                    top: 16,
                                    right: 16,
                                    zIndex: 1,
                                    bgcolor: '#10b981',
                                    color: 'white',
                                    px: 2,
                                    py: 1,
                                    borderRadius: 2,
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5
                                }}>
                                    <StarIcon sx={{ fontSize: 16 }} />
                                    Рекомендовано
                                </Box>
                            )}
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                                <Box sx={{ flex: 1 }}>
                                    <Chip
                                        label={specialty.educationLevel === 'SPO' ? 'СПО' : 'ВО'}
                                        color="primary"
                                        size="small"
                                        sx={{ mb: 2 }}
                                    />
                                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                                        {specialty.name}
                                    </Typography>
                                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2, fontFamily: 'monospace' }}>
                                        Код ФГОС: {specialty.code}
                                    </Typography>
                                    
                                    {/* Информация о колледжах в заголовке */}
                                    {collegeCount > 0 && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                            <BusinessIcon sx={{ color: 'text.secondary' }} />
                                            <Typography variant="body1" color="text.secondary">
                                                Доступна в {collegeCount} колледж{collegeCount > 1 ? 'ах' : 'е'}
                                            </Typography>
                                            {specialty.colleges && (
                                                <AvatarGroup max={4} sx={{ ml: 1 }}>
                                                    {specialty.colleges.slice(0, 4).map((college, idx) => (
                                                        <Tooltip 
                                                            key={college._id || idx} 
                                                            title={`${college.name} (${college.city})`}
                                                            arrow
                                                        >
                                                            <Avatar 
                                                                alt={college.name}
                                                                sx={{ 
                                                                    bgcolor: '#6366f1',
                                                                    width: 32,
                                                                    height: 32,
                                                                    fontSize: '0.875rem'
                                                                }}
                                                            >
                                                                {college.name.charAt(0)}
                                                            </Avatar>
                                                        </Tooltip>
                                                    ))}
                                                </AvatarGroup>
                                            )}
                                        </Box>
                                    )}
                                </Box>
                                
                                <Stack direction="row" spacing={1}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<CompareIcon />}
                                        onClick={handleAddToCompare}
                                    >
                                        Сравнить
                                    </Button>
                                    <Button
                                        variant={isSaved ? "contained" : "outlined"}
                                        startIcon={isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                                        onClick={handleSaveSpecialty}
                                        sx={{
                                            backgroundColor: isSaved ? '#ec4899' : 'transparent',
                                            '&:hover': {
                                                backgroundColor: isSaved ? '#db2777' : 'transparent',
                                            }
                                        }}
                                    >
                                        {isSaved ? 'В избранном' : 'В избранное'}
                                    </Button>
                                </Stack>
                            </Box>
                            
                            {user && matchPercentage > 0 && (
                                <Box sx={{ mb: 4, p: 3, borderRadius: 2, backgroundColor: alpha(matchColor, 0.05) }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                        <PercentIcon sx={{ fontSize: 32, color: matchColor }} />
                                        <Box>
                                            <Typography variant="h5" sx={{ fontWeight: 700, color: matchColor }}>
                                                Совпадение: {matchPercentage}%
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: matchColor, fontWeight: 600 }}>
                                                {matchLabel} совпадение с вашим профилем
                                            </Typography>
                                        </Box>
                                        <Chip 
                                            label={matchLabel}
                                            size="medium"
                                            sx={{ 
                                                bgcolor: matchColor,
                                                color: 'white',
                                                fontWeight: 700,
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </Box>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={matchPercentage}
                                        sx={{
                                            height: 8,
                                            borderRadius: 4,
                                            bgcolor: alpha(matchColor, 0.1),
                                            '& .MuiLinearProgress-bar': {
                                                borderRadius: 4,
                                                bgcolor: matchColor
                                            }
                                        }}
                                    />
                                    {specialty.matchReasons && specialty.matchReasons.length > 0 && (
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                            <strong>Причины совпадения:</strong> {specialty.matchReasons.join(', ')}
                                        </Typography>
                                    )}
                                </Box>
                            )}
                            
                            <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8, fontSize: '1.1rem' }}>
                                {specialty.description}
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* Секция с колледжами */}
                    {renderColleges()}

                    <Grid item xs={12} md={8}>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <Card sx={{ borderRadius: 3 }}>
                                    <CardContent sx={{ p: 4 }}>
                                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                                            <PsychologyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                            Типы профессий по Климову
                                        </Typography>
                                        {user && specialty.userScores && (
                                            <Box sx={{ mb: 4, p: 3, borderRadius: 2, backgroundColor: alpha(theme.palette.primary.main, 0.03) }}>
                                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                                    Ваши результаты теста:
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    {Object.entries(KLIMOV_TYPES).map(([key, type]) => {
                                                        const userScore = specialty.userScores[key] || 0;
                                                        const isMatched = specialty.klimovTypes?.includes(key);
                                                        return (
                                                            <Grid item xs={6} md={4} key={key}>
                                                                <Box sx={{ 
                                                                    p: 2, 
                                                                    borderRadius: 2,
                                                                    border: `2px solid ${isMatched ? type.color : alpha('#6b7280', 0.3)}`,
                                                                    backgroundColor: isMatched ? alpha(type.color, 0.05) : alpha('#6b7280', 0.03),
                                                                    position: 'relative'
                                                                }}>
                                                                    <Typography variant="body2" sx={{ 
                                                                        fontWeight: 600, 
                                                                        color: isMatched ? type.color : '#6b7280',
                                                                        mb: 1 
                                                                    }}>
                                                                        {type.name}
                                                                    </Typography>
                                                                    <Typography variant="h6" sx={{ 
                                                                        fontWeight: 700,
                                                                        color: isMatched ? type.color : '#6b7280'
                                                                    }}>
                                                                        {userScore}%
                                                                    </Typography>
                                                                    {isMatched && (
                                                                        <StarIcon sx={{
                                                                            position: 'absolute',
                                                                            top: 8,
                                                                            right: 8,
                                                                            color: type.color,
                                                                            fontSize: 16
                                                                        }} />
                                                                    )}
                                                                </Box>
                                                            </Grid>
                                                        );
                                                    })}
                                                </Grid>
                                            </Box>
                                        )}
                                        <Stack direction="row" spacing={2} sx={{ mb: 3 }} flexWrap="wrap" gap={2}>
                                            {specialty.klimovTypes?.map((type, idx) => {
                                                const typeInfo = KLIMOV_TYPES[type];
                                                const matchedType = specialty.matchedTypes?.find(t => t.type === type);
                                                return (
                                                    <Card
                                                        key={idx}
                                                        sx={{
                                                            flex: '1 1 200px',
                                                            minWidth: 200,
                                                            border: `2px solid ${typeInfo.color}`,
                                                            backgroundColor: alpha(typeInfo.color, 0.05),
                                                            position: 'relative'
                                                        }}
                                                    >
                                                        <CardContent>
                                                            {matchedType && (
                                                                <Box sx={{
                                                                    position: 'absolute',
                                                                    top: -10,
                                                                    right: -10,
                                                                    bgcolor: typeInfo.color,
                                                                    color: 'white',
                                                                    width: 32,
                                                                    height: 32,
                                                                    borderRadius: '50%',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    fontWeight: 700,
                                                                    fontSize: '0.875rem'
                                                                }}>
                                                                    {matchedType.score}%
                                                                </Box>
                                                            )}
                                                            <Typography variant="h6" sx={{ color: typeInfo.color, fontWeight: 600, mb: 1 }}>
                                                                {typeInfo.name}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                                {typeInfo.description}
                                                            </Typography>
                                                            {matchedType && (
                                                                <Typography variant="caption" sx={{ 
                                                                    display: 'block', 
                                                                    color: typeInfo.color,
                                                                    fontWeight: 600
                                                                }}>
                                                                    Ваш результат: {matchedType.score}%
                                                                </Typography>
                                                            )}
                                                        </CardContent>
                                                    </Card>
                                                );
                                            })}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Card sx={{ borderRadius: 3, height: '100%' }}>
                                    <CardContent sx={{ p: 4 }}>
                                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                                            <ClassIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                            Ключевые дисциплины
                                        </Typography>
                                        <List>
                                            {specialty.disciplines?.map((discipline, idx) => (
                                                <ListItem key={idx} sx={{ py: 1 }}>
                                                    <ListItemIcon>
                                                        <CheckCircleIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                                    </ListItemIcon>
                                                    <ListItemText primary={discipline} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Card sx={{ borderRadius: 3, height: '100%' }}>
                                    <CardContent sx={{ p: 4 }}>
                                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                                            <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                            Перспективы после обучения
                                        </Typography>
                                        <List>
                                            {specialty.prospects?.map((prospect, idx) => (
                                                <ListItem key={idx} sx={{ py: 1 }}>
                                                    <ListItemIcon>
                                                        <TrendingUpIcon sx={{ color: 'success.main', fontSize: 20 }} />
                                                    </ListItemIcon>
                                                    <ListItemText primary={prospect} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card sx={{ borderRadius: 3, position: 'sticky', top: 20 }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                                    Информация о программе
                                </Typography>
                                
                                <Stack spacing={3}>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                            Уровень образования
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                            {specialty.educationLevel === 'SPO' ? 'Среднее профессиональное образование' : 'Высшее образование'}
                                        </Typography>
                                    </Box>
                                    
                                    <Divider />
                                    
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                            <ScheduleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                            Срок обучения
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                            {specialty.duration}
                                        </Typography>
                                    </Box>
                                    
                                    <Divider />
                                    
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                            Форма обучения
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                            {getFormLabel(specialty.form)}
                                        </Typography>
                                    </Box>
                                    
                                    <Divider />
                                    
                                    {collegeCount > 0 && (
                                        <>
                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                                    <BusinessIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                                    Доступна в колледжах
                                                </Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                    {collegeCount} колледж{collegeCount > 1 ? 'ах' : 'е'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                    Прокрутите вниз, чтобы увидеть список
                                                </Typography>
                                            </Box>
                                            <Divider />
                                        </>
                                    )}
                                    
                                    {specialty.requirements && specialty.requirements.length > 0 && (
                                        <>
                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                                    Требования для поступления
                                                </Typography>
                                                <List dense>
                                                    {specialty.requirements.map((req, idx) => (
                                                        <ListItem key={idx} sx={{ py: 0.5 }}>
                                                            <ListItemIcon sx={{ minWidth: 30 }}>
                                                                <CheckCircleIcon sx={{ color: 'primary.main', fontSize: 16 }} />
                                                            </ListItemIcon>
                                                            <ListItemText primary={req} />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </Box>
                                            <Divider />
                                        </>
                                    )}
                                    
                                    {!user && (
                                        <Box sx={{ p: 2, borderRadius: 2, backgroundColor: alpha(theme.palette.warning.main, 0.1) }}>
                                            <Typography variant="body2" sx={{ textAlign: 'center', mb: 1 }}>
                                                <strong>Пройдите тест Климова</strong>
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
                                                Узнайте точный процент совпадения с этой специальностью
                                            </Typography>
                                            <Button
                                                component={Link}
                                                to="/test/klimov"
                                                variant="contained"
                                                fullWidth
                                                size="small"
                                                sx={{ mt: 2 }}
                                            >
                                                Пройти тест
                                            </Button>
                                        </Box>
                                    )}
                                    
                                    {specialty.url && (
                                        <Button
                                            href={specialty.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            variant="contained"
                                            fullWidth
                                            size="large"
                                            sx={{
                                                py: 1.5,
                                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                                }
                                            }}
                                        >
                                            Официальная страница специальности
                                        </Button>
                                    )}
                                    
                                    <Button
                                        component={Link}
                                        to="/test/klimov"
                                        variant="outlined"
                                        fullWidth
                                        size="large"
                                    >
                                        Пройти тест для рекомендаций
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default SpecialtyDetailPage;