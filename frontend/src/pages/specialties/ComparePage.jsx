import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Button,
    IconButton,
    alpha,
    useTheme,
    CircularProgress,
    Alert,
    LinearProgress,
    Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import PercentIcon from '@mui/icons-material/Percent';
import StarIcon from '@mui/icons-material/Star';
import { useAuth } from '../../context/AuthContext';

const KLIMOV_TYPES = {
    manNature: { name: 'Человек-Природа', color: '#10b981', short: 'П' },
    manTech: { name: 'Человек-Техника', color: '#3b82f6', short: 'Т' },
    manHuman: { name: 'Человек-Человек', color: '#ec4899', short: 'Ч' },
    manSign: { name: 'Человек-Знаковая система', color: '#f59e0b', short: 'З' },
    manArt: { name: 'Человек-Искусство', color: '#8b5cf6', short: 'Х' }
};

const ComparePage = () => {
    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const { api, user } = useAuth();
    
    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const ids = params.get('ids')?.split(',') || [];
        
        if (ids.length < 2) {
            setError('Для сравнения необходимо выбрать минимум 2 специальности');
            setLoading(false);
            return;
        }
        
        loadSpecialties(ids);
    }, [location]);

    const loadSpecialties = async (ids) => {
        try {
            setLoading(true);
            const response = await api.get(`/specialties/compare?ids=${ids.join(',')}`);
            
            if (response.data.success) {
                setSpecialties(response.data.specialties || []);
            } else {
                setError(response.data.message);
            }
            setLoading(false);
        } catch (error) {
            setError(error.response?.data?.message || 'Ошибка загрузки специальностей для сравнения');
            setLoading(false);
        }
    };

    const removeFromCompare = (id) => {
        const currentIds = specialties.map(s => s._id).filter(sid => sid !== id);
        
        if (currentIds.length < 2) {
            navigate('/specialties');
        } else {
            navigate(`/specialties/compare?ids=${currentIds.join(',')}`);
        }
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

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || specialties.length < 2) {
        return (
            <Container sx={{ py: 8 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error || 'Недостаточно специальностей для сравнения'}
                </Alert>
                <Button component={Link} to="/specialties" startIcon={<ArrowBackIcon />}>
                    Вернуться к каталогу
                </Button>
            </Container>
        );
    }

    const comparisonFields = [
        { key: 'matchPercentage', label: 'Совпадение с профилем', type: 'match', format: (val) => val || 0 },
        { key: 'name', label: 'Название', type: 'text' },
        { key: 'code', label: 'Код ФГОС', type: 'text' },
        { key: 'collegeName', label: 'Колледж', type: 'text' },
        { key: 'educationLevel', label: 'Уровень', type: 'text', format: (val) => val === 'SPO' ? 'СПО' : 'ВО' },
        { key: 'klimovTypes', label: 'Типы по Климову', type: 'array', format: (types) => types?.map(t => KLIMOV_TYPES[t]?.short) },
        { key: 'duration', label: 'Срок обучения', type: 'text' },
        { key: 'form', label: 'Форма обучения', type: 'text', format: getFormLabel },
        { key: 'disciplines', label: 'Ключевые дисциплины', type: 'array', limit: 3 },
        { key: 'requirements', label: 'Требования', type: 'array', limit: 3 },
        { key: 'prospects', label: 'Перспективы', type: 'array', limit: 3 }
    ];

    const getBestMatch = () => {
        if (!user || specialties.length === 0) return null;
        return specialties.reduce((best, current) => {
            return (current.matchPercentage || 0) > (best.matchPercentage || 0) ? current : best;
        });
    };

    const bestMatch = getBestMatch();

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            py: 6,
        }}>
            <Container maxWidth="xl">
                <Box sx={{ mb: 6 }}>
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
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <CompareArrowsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                        <Box>
                            <Typography variant="h3" sx={{ fontWeight: 800 }}>
                                Сравнение специальностей
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Сравните {specialties.length} специальности по ключевым параметрам
                            </Typography>
                        </Box>
                    </Box>

                    {bestMatch && user && (
                        <Card sx={{ borderRadius: 3, mb: 4, backgroundColor: alpha('#10b981', 0.05), border: `1px solid ${alpha('#10b981', 0.2)}` }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <StarIcon sx={{ color: '#10b981', fontSize: 32 }} />
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#059669' }}>
                                            Лучшее совпадение с вашим профилем
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                            {bestMatch.name} - {bestMatch.matchPercentage}% совпадения
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {bestMatch.collegeName} • {bestMatch.duration}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ ml: 'auto' }}>
                                        <Chip
                                            label={`${bestMatch.matchPercentage}% совпадение`}
                                            sx={{
                                                backgroundColor: '#10b981',
                                                color: 'white',
                                                fontWeight: 700,
                                                fontSize: '1rem',
                                                px: 2,
                                                py: 1
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    )}
                </Box>

                <Grid container spacing={4} sx={{ mb: 6 }}>
                    {specialties.map((specialty, index) => (
                        <Grid item xs={12} md={6} lg={4} key={specialty._id}>
                            <Card sx={{ borderRadius: 3, position: 'relative' }}>
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        zIndex: 1,
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                        '&:hover': {
                                            backgroundColor: 'white',
                                        }
                                    }}
                                    onClick={() => removeFromCompare(specialty._id)}
                                >
                                    <CloseIcon />
                                </IconButton>
                                
                                <CardContent sx={{ p: 4 }}>
                                    <Chip
                                        label={`#${index + 1}`}
                                        color="primary"
                                        size="small"
                                        sx={{ mb: 2 }}
                                    />
                                    
                                    {user && specialty.matchPercentage > 0 && (
                                        <Box sx={{ mb: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <PercentIcon sx={{ color: getMatchColor(specialty.matchPercentage) }} />
                                                <Typography variant="h6" sx={{ 
                                                    fontWeight: 700,
                                                    color: getMatchColor(specialty.matchPercentage)
                                                }}>
                                                    {specialty.matchPercentage}%
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    совпадение
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={specialty.matchPercentage}
                                                sx={{
                                                    height: 8,
                                                    borderRadius: 4,
                                                    backgroundColor: alpha(getMatchColor(specialty.matchPercentage), 0.1),
                                                    '& .MuiLinearProgress-bar': {
                                                        borderRadius: 4,
                                                        backgroundColor: getMatchColor(specialty.matchPercentage),
                                                    },
                                                }}
                                            />
                                            {specialty.matchReasons && specialty.matchReasons.length > 0 && (
                                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                                    {specialty.matchReasons.join(', ')}
                                                </Typography>
                                            )}
                                        </Box>
                                    )}
                                    
                                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                                        {specialty.name}
                                    </Typography>
                                    
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontFamily: 'monospace' }}>
                                        {specialty.code}
                                    </Typography>
                                    
                                    {specialty.collegeName && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <SchoolIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                                            <Typography variant="body2">
                                                {specialty.collegeName}
                                            </Typography>
                                        </Box>
                                    )}
                                    
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                            Типы по Климову:
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                            {specialty.klimovTypes?.map((type, idx) => {
                                                const typeInfo = KLIMOV_TYPES[type];
                                                const matchedType = specialty.matchedTypes?.find(t => t.type === type);
                                                return (
                                                    <Chip
                                                        key={idx}
                                                        label={
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                {typeInfo?.short || type}
                                                                {matchedType && (
                                                                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                                                        {matchedType.score}%
                                                                    </Typography>
                                                                )}
                                                            </Box>
                                                        }
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: matchedType ? 
                                                                alpha(typeInfo?.color || '#6366f1', 0.2) : 
                                                                alpha(typeInfo?.color || '#6366f1', 0.1),
                                                            color: typeInfo?.color || '#6366f1',
                                                            fontSize: '0.7rem',
                                                            border: matchedType ? `1px solid ${typeInfo?.color || '#6366f1'}` : 'none'
                                                        }}
                                                    />
                                                );
                                            })}
                                        </Box>
                                    </Box>
                                    
                                    <Button
                                        component={Link}
                                        to={`/specialties/${specialty._id}`}
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                    >
                                        Подробнее
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Card sx={{ borderRadius: 3, mb: 6 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
                            Детальное сравнение
                        </Typography>
                        
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ width: '25%', fontWeight: 600, backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                                            Параметр
                                        </TableCell>
                                        {specialties.map((specialty, index) => (
                                            <TableCell 
                                                key={specialty._id} 
                                                align="center"
                                                sx={{ fontWeight: 600, backgroundColor: alpha(theme.palette.primary.main, 0.02) }}
                                            >
                                                Вариант #{index + 1}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {comparisonFields.map((field) => (
                                        <TableRow key={field.key}>
                                            <TableCell sx={{ fontWeight: 600 }}>
                                                {field.label}
                                            </TableCell>
                                            {specialties.map((specialty) => {
                                                let value = specialty[field.key];
                                                
                                                if (field.format) {
                                                    value = field.format(value);
                                                }
                                                
                                                if (field.type === 'match') {
                                                    const matchColor = getMatchColor(value);
                                                    return (
                                                        <TableCell key={specialty._id} align="center">
                                                            <Stack spacing={1} alignItems="center">
                                                                <Typography variant="h6" sx={{ 
                                                                    fontWeight: 700,
                                                                    color: matchColor
                                                                }}>
                                                                    {value}%
                                                                </Typography>
                                                                <LinearProgress
                                                                    variant="determinate"
                                                                    value={value}
                                                                    sx={{
                                                                        width: '80%',
                                                                        height: 8,
                                                                        borderRadius: 4,
                                                                        backgroundColor: alpha(matchColor, 0.1),
                                                                        '& .MuiLinearProgress-bar': {
                                                                            borderRadius: 4,
                                                                            backgroundColor: matchColor,
                                                                        },
                                                                    }}
                                                                />
                                                                {value >= 80 && (
                                                                    <Chip
                                                                        label="Высокое"
                                                                        size="small"
                                                                        sx={{ 
                                                                            backgroundColor: '#10b981',
                                                                            color: 'white',
                                                                            fontWeight: 600
                                                                        }}
                                                                    />
                                                                )}
                                                                {value >= 60 && value < 80 && (
                                                                    <Chip
                                                                        label="Хорошее"
                                                                        size="small"
                                                                        sx={{ 
                                                                            backgroundColor: '#f59e0b',
                                                                            color: 'white',
                                                                            fontWeight: 600
                                                                        }}
                                                                    />
                                                                )}
                                                            </Stack>
                                                        </TableCell>
                                                    );
                                                }
                                                
                                                if (field.type === 'array' && Array.isArray(value)) {
                                                    const displayValue = field.limit ? value.slice(0, field.limit) : value;
                                                    return (
                                                        <TableCell key={specialty._id}>
                                                            {displayValue.map((item, idx) => (
                                                                <Chip
                                                                    key={idx}
                                                                    label={item}
                                                                    size="small"
                                                                    sx={{ m: 0.5 }}
                                                                />
                                                            ))}
                                                            {field.limit && value.length > field.limit && (
                                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                                                    +{value.length - field.limit} еще
                                                                </Typography>
                                                            )}
                                                        </TableCell>
                                                    );
                                                }
                                                
                                                return (
                                                    <TableCell key={specialty._id}>
                                                        {value || '—'}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>

                <Box sx={{ textAlign: 'center' }}>
                    <Button
                        component={Link}
                        to="/specialties"
                        variant="contained"
                        size="large"
                        sx={{
                            px: 4,
                            py: 1.5,
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                            }
                        }}
                    >
                        Найти больше специальностей
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default ComparePage;