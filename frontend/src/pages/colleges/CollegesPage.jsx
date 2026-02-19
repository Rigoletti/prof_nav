import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Pagination,
    Box,
    Chip,
    CircularProgress,
    Alert,
    Paper,
    InputAdornment,
    IconButton,
    Fade,
    Zoom,
    useTheme,
    alpha,
    Avatar,
    Tooltip
} from '@mui/material';
import {
    Search as SearchIcon,
    LocationOn as LocationIcon,
    School as SchoolIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Language as LanguageIcon,
    Clear as ClearIcon,
    FilterList as FilterIcon,
    AccountBalance as CollegeIcon,
    CheckCircle as CheckIcon,
    MenuBook as BookIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'http://localhost:5000/api';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const CollegesPage = () => {
    const theme = useTheme();
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        page: 1,
        limit: 12,
        region: '',
        city: '',
        search: ''
    });
    const [availableFilters, setAvailableFilters] = useState({
        regions: [],
        cities: []
    });
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        totalPages: 1
    });

    useEffect(() => {
        fetchColleges();
    }, [filters.page, filters.region, filters.city, filters.search]);

    const fetchColleges = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: filters.page,
                limit: filters.limit,
                ...(filters.region && { region: filters.region }),
                ...(filters.city && { city: filters.city }),
                ...(filters.search && { search: filters.search })
            });

            const response = await fetch(`${API_URL}/colleges?${params}`);
            const data = await response.json();

            if (data.success) {
                setColleges(data.colleges);
                setPagination({
                    total: data.total,
                    page: data.page,
                    totalPages: data.totalPages
                });
                setAvailableFilters(data.filters);
            }
        } catch (err) {
            console.error('Ошибка:', err);
            setError('Не удалось загрузить список колледжей');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
    };

    const handleRegionChange = (e) => {
        setFilters(prev => ({ ...prev, region: e.target.value, city: '', page: 1 }));
    };

    const handleCityChange = (e) => {
        setFilters(prev => ({ ...prev, city: e.target.value, page: 1 }));
    };

    const handlePageChange = (event, value) => {
        setFilters(prev => ({ ...prev, page: value }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const clearFilters = () => {
        setFilters({
            page: 1,
            limit: 12,
            region: '',
            city: '',
            search: ''
        });
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (filters.search) count++;
        if (filters.region) count++;
        if (filters.city) count++;
        return count;
    };

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Fade in={true}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 6,
                            textAlign: 'center',
                            background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.05)} 0%, ${alpha(theme.palette.error.light, 0.1)} 100%)`,
                            borderRadius: 4,
                            border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`
                        }}
                    >
                        <Alert 
                            severity="error" 
                            sx={{ 
                                mb: 3,
                                borderRadius: 2,
                                '& .MuiAlert-icon': { fontSize: 30 }
                            }}
                        >
                            {error}
                        </Alert>
                        <Button 
                            onClick={fetchColleges} 
                            variant="contained"
                            color="error"
                            size="large"
                            sx={{ 
                                borderRadius: 3,
                                px: 4,
                                py: 1.5,
                                background: `linear-gradient(45deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
                                boxShadow: `0 8px 16px ${alpha(theme.palette.error.main, 0.3)}`
                            }}
                        >
                            Повторить попытку
                        </Button>
                    </Paper>
                </Fade>
            </Container>
        );
    }

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: `linear-gradient(135deg, ${alpha('#667eea', 0.02)} 0%, ${alpha('#764ba2', 0.02)} 100%)`,
        }}>
            {/* Hero секция */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    pt: { xs: 6, md: 10 },
                    pb: { xs: 8, md: 12 },
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                    }
                }}
            >
                <Container maxWidth="lg">
                    <MotionBox
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Typography 
                            variant="h2" 
                            component="h1" 
                            gutterBottom 
                            sx={{ 
                                fontWeight: 800,
                                fontSize: { xs: '2.5rem', md: '3.5rem' },
                                textShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                letterSpacing: '-0.02em'
                            }}
                        >
                            Образовательные учреждения
                        </Typography>
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                maxWidth: 600,
                                opacity: 0.95,
                                mb: 4,
                                fontWeight: 400,
                                textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                            }}
                        >
                            Найдите идеальное место для вашего образования среди лучших колледжей
                        </Typography>
                        
                        {/* Статистика */}
                        <Grid container spacing={3}>
                            {[
                                { label: 'Всего колледжей', value: pagination.total, icon: CollegeIcon, color: '#ffd700' },
                                { label: 'Регионов', value: availableFilters.regions.length, icon: LocationIcon, color: '#87ceeb' },
                                { label: 'Городов', value: availableFilters.cities.length, icon: SchoolIcon, color: '#98fb98' }
                            ].map((stat, index) => (
                                <Grid item xs={12} sm={4} key={index}>
                                    <MotionBox
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + index * 0.1 }}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            p: 2,
                                            background: 'rgba(255,255,255,0.1)',
                                            backdropFilter: 'blur(10px)',
                                            borderRadius: 3,
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            width: '100%'
                                        }}
                                    >
                                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                                            <stat.icon sx={{ fontSize: 30, color: stat.color }} />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h4" sx={{ fontWeight: 700 }}>{stat.value}</Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>{stat.label}</Typography>
                                        </Box>
                                    </MotionBox>
                                </Grid>
                            ))}
                        </Grid>
                    </MotionBox>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: -6, pb: 8, position: 'relative', zIndex: 10 }}>
                {/* Поиск и фильтры */}
                <Zoom in={true} style={{ transitionDelay: '300ms' }}>
                    <Paper
                        elevation={24}
                        sx={{
                            p: 3,
                            mb: 4,
                            borderRadius: 4,
                            background: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(102, 126, 234, 0.1)',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                            width: '100%'
                        }}
                    >
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    placeholder="Поиск по названию, городу, адресу..."
                                    value={filters.search}
                                    onChange={handleSearchChange}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            backgroundColor: 'rgba(245,245,245,0.6)',
                                            transition: 'all 0.3s',
                                            '&:hover, &.Mui-focused': {
                                                backgroundColor: '#ffffff',
                                                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
                                            }
                                        }
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ color: '#667eea' }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: filters.search && (
                                            <InputAdornment position="end">
                                                <IconButton 
                                                    size="small" 
                                                    onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                                                    sx={{ 
                                                        backgroundColor: 'rgba(0,0,0,0.05)',
                                                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' }
                                                    }}
                                                >
                                                    <ClearIcon fontSize="small" />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={4}>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <FormControl fullWidth>
                                        <InputLabel>Регион</InputLabel>
                                        <Select
                                            value={filters.region}
                                            onChange={handleRegionChange}
                                            label="Регион"
                                            sx={{ borderRadius: 3 }}
                                        >
                                            <MenuItem value="">
                                                <em>Все регионы</em>
                                            </MenuItem>
                                            {availableFilters.regions.map(region => (
                                                <MenuItem key={region} value={region}>{region}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    
                                    <FormControl fullWidth>
                                        <InputLabel>Город</InputLabel>
                                        <Select
                                            value={filters.city}
                                            onChange={handleCityChange}
                                            label="Город"
                                            disabled={!filters.region}
                                            sx={{ borderRadius: 3 }}
                                        >
                                            <MenuItem value="">
                                                <em>Все города</em>
                                            </MenuItem>
                                            {availableFilters.cities.map(city => (
                                                <MenuItem key={city} value={city}>{city}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                            
                            <Grid item xs={12} md={2}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={clearFilters}
                                    disabled={!filters.search && !filters.region && !filters.city}
                                    sx={{ 
                                        height: 56,
                                        borderRadius: 3,
                                        borderWidth: 2,
                                        borderColor: '#667eea',
                                        color: '#667eea',
                                        '&:hover': { 
                                            borderWidth: 2,
                                            borderColor: '#764ba2',
                                            color: '#764ba2',
                                            backgroundColor: 'rgba(102, 126, 234, 0.04)'
                                        }
                                    }}
                                    startIcon={<FilterIcon />}
                                >
                                    Сбросить {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Zoom>

                {/* Результаты */}
                {loading ? (
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        py: 12,
                        gap: 3
                    }}>
                        <CircularProgress size={60} thickness={4} sx={{ color: '#667eea' }} />
                        <Typography variant="h6" color="text.secondary">
                            Загружаем колледжи...
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Fade in={!loading}>
                            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CollegeIcon sx={{ color: '#667eea' }} />
                                    Найдено: 
                                    <Box component="span" sx={{ 
                                        fontWeight: 700, 
                                        color: '#667eea',
                                        fontSize: '1.5rem',
                                        ml: 1
                                    }}>
                                        {pagination.total}
                                    </Box>
                                    {' '}
                                    {pagination.total === 1 ? 'колледж' : 
                                     pagination.total > 1 && pagination.total < 5 ? 'колледжа' : 'колледжей'}
                                </Typography>
                                
                                {getActiveFiltersCount() > 0 && (
                                    <Chip
                                        icon={<CheckIcon />}
                                        label={`Активно фильтров: ${getActiveFiltersCount()}`}
                                        sx={{
                                            backgroundColor: alpha('#4CAF50', 0.1),
                                            color: '#2E7D32',
                                            borderColor: '#4CAF50'
                                        }}
                                        variant="outlined"
                                    />
                                )}
                            </Box>
                        </Fade>

                        <AnimatePresence>
                            <Box sx={{ 
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    md: 'repeat(2, 1fr)',
                                    lg: 'repeat(3, 1fr)'
                                },
                                gap: 3,
                                width: '100%'
                            }}>
                                {colleges.length > 0 ? (
                                    colleges.map((college, index) => (
                                        <MotionCard
                                            key={college._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ delay: index * 0.05 }}
                                            whileHover={{ 
                                                y: -8,
                                                boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)'
                                            }}
                                            sx={{ 
                                                width: '100%',
                                                display: 'flex', 
                                                flexDirection: 'column',
                                                borderRadius: 4,
                                                border: '1px solid rgba(0,0,0,0.05)',
                                                background: 'rgba(255,255,255,0.9)',
                                                backdropFilter: 'blur(10px)',
                                                transition: 'all 0.3s ease-in-out',
                                                position: 'relative',
                                                height: '100%',
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    height: 4,
                                                    background: 'linear-gradient(90deg, #667eea, #764ba2)',
                                                }
                                            }}
                                        >
                                            <CardContent sx={{ p: 2.5, flex: 1 }}>
                                                {/* Header */}
                                                <Box sx={{ mb: 1.5 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                                        <Avatar 
                                                            sx={{ 
                                                                width: 40, 
                                                                height: 40,
                                                                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                                                                border: '2px solid rgba(102, 126, 234, 0.2)',
                                                                flexShrink: 0
                                                            }}
                                                        >
                                                            <CollegeIcon sx={{ fontSize: 20, color: '#667eea' }} />
                                                        </Avatar>
                                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                                            <Tooltip title={college.name} arrow>
                                                                <Typography 
                                                                    variant="subtitle2" 
                                                                    component="h3"
                                                                    sx={{ 
                                                                        fontWeight: 700,
                                                                        fontSize: '0.9rem',
                                                                        lineHeight: 1.2,
                                                                        overflow: 'hidden',
                                                                        display: '-webkit-box',
                                                                        WebkitLineClamp: 2,
                                                                        WebkitBoxOrient: 'vertical',
                                                                        cursor: 'help'
                                                                    }}
                                                                >
                                                                    {college.name}
                                                                </Typography>
                                                            </Tooltip>
                                                        </Box>
                                                    </Box>
                                                    
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <LocationIcon sx={{ color: '#667eea', fontSize: 14, flexShrink: 0 }} />
                                                        <Typography variant="caption" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {college.city}, {college.region}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                {/* Address */}
                                                <Box sx={{ mb: 1.5 }}>
                                                    {college.address && college.address !== 'Адрес не указан' ? (
                                                        <Tooltip title={college.address} arrow>
                                                            <Typography 
                                                                variant="caption" 
                                                                sx={{ 
                                                                    p: 0.75,
                                                                    backgroundColor: 'rgba(102, 126, 234, 0.04)',
                                                                    borderRadius: 1.5,
                                                                    border: '1px dashed rgba(102, 126, 234, 0.2)',
                                                                    display: 'block',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    whiteSpace: 'nowrap',
                                                                    cursor: 'help'
                                                                }}
                                                            >
                                                                📍 {college.address}
                                                            </Typography>
                                                        </Tooltip>
                                                    ) : (
                                                        <Typography 
                                                            variant="caption" 
                                                            color="text.disabled"
                                                            sx={{ 
                                                                p: 0.75,
                                                                display: 'block',
                                                                fontStyle: 'italic'
                                                            }}
                                                        >
                                                            Адрес не указан
                                                        </Typography>
                                                    )}
                                                </Box>

                                                {/* Description */}
                                                <Box sx={{ mb: 1.5 }}>
                                                    {college.description && college.description !== 'Описание отсутствует' ? (
                                                        <Tooltip title={college.description} arrow placement="top">
                                                            <Typography 
                                                                variant="caption" 
                                                                color="text.secondary"
                                                                sx={{ 
                                                                    lineHeight: 1.4,
                                                                    fontSize: '0.75rem',
                                                                    overflow: 'hidden',
                                                                    display: '-webkit-box',
                                                                    WebkitLineClamp: 3,
                                                                    WebkitBoxOrient: 'vertical',
                                                                    cursor: 'help',
                                                                    height: '48px'
                                                                }}
                                                            >
                                                                {college.description}
                                                            </Typography>
                                                        </Tooltip>
                                                    ) : (
                                                        <Typography 
                                                            variant="caption" 
                                                            color="text.disabled"
                                                            sx={{ 
                                                                lineHeight: 1.4,
                                                                fontSize: '0.75rem',
                                                                fontStyle: 'italic',
                                                                height: '48px',
                                                                display: 'flex',
                                                                alignItems: 'center'
                                                            }}
                                                        >
                                                            Описание отсутствует
                                                        </Typography>
                                                    )}
                                                </Box>

                                                {/* Specialties */}
                                                <Box sx={{ mb: 1.5 }}>
                                                    <Typography 
                                                        variant="caption" 
                                                        sx={{ 
                                                            fontWeight: 600, 
                                                            display: 'block',
                                                            mb: 0.5,
                                                            fontSize: '0.7rem'
                                                        }}
                                                    >
                                                        <BookIcon sx={{ fontSize: 12, color: '#667eea', mr: 0.5 }} />
                                                        Специальности:
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                        {college.specialties && college.specialties.length > 0 ? (
                                                            <>
                                                                {college.specialties.slice(0, 3).map((spec, idx) => (
                                                                    <Chip
                                                                        key={idx}
                                                                        label={typeof spec === 'object' ? spec.name : spec}
                                                                        size="small"
                                                                        sx={{
                                                                            height: '20px',
                                                                            fontSize: '0.65rem',
                                                                            backgroundColor: alpha('#4CAF50', 0.08),
                                                                            color: '#2E7D32',
                                                                            '& .MuiChip-label': {
                                                                                px: 1,
                                                                                py: 0
                                                                            }
                                                                        }}
                                                                    />
                                                                ))}
                                                                {college.specialties.length > 3 && (
                                                                    <Chip
                                                                        label={`+${college.specialties.length - 3}`}
                                                                        size="small"
                                                                        sx={{
                                                                            height: '20px',
                                                                            fontSize: '0.65rem',
                                                                            backgroundColor: alpha('#9C27B0', 0.08),
                                                                            color: '#7B1FA2'
                                                                        }}
                                                                    />
                                                                )}
                                                            </>
                                                        ) : (
                                                            <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }}>
                                                                Нет информации
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>

                                                {/* Contacts */}
                                                <Box sx={{ 
                                                    backgroundColor: alpha('#F5F5F5', 0.5),
                                                    borderRadius: 1.5,
                                                    p: 1
                                                }}>
                                                    <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5, fontSize: '0.7rem' }}>
                                                        Контакты:
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                        {college.phone ? (
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                <PhoneIcon sx={{ color: '#4CAF50', fontSize: 12, flexShrink: 0 }} />
                                                                <Typography variant="caption" sx={{ fontSize: '0.7rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                    {college.phone}
                                                                </Typography>
                                                            </Box>
                                                        ) : (
                                                            <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }}>
                                                                Телефон не указан
                                                            </Typography>
                                                        )}
                                                        
                                                        {college.email ? (
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                <EmailIcon sx={{ color: '#2196F3', fontSize: 12, flexShrink: 0 }} />
                                                                <Typography variant="caption" sx={{ fontSize: '0.7rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                    {college.email}
                                                                </Typography>
                                                            </Box>
                                                        ) : (
                                                            <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }}>
                                                                Email не указан
                                                            </Typography>
                                                        )}
                                                        
                                                        {college.website ? (
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                <LanguageIcon sx={{ color: '#FF9800', fontSize: 12, flexShrink: 0 }} />
                                                                <Typography 
                                                                    variant="caption" 
                                                                    component="a"
                                                                    href={college.website.startsWith('http') ? college.website : `https://${college.website}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    sx={{ 
                                                                        color: 'primary.main',
                                                                        textDecoration: 'none',
                                                                        fontSize: '0.7rem',
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        whiteSpace: 'nowrap',
                                                                        '&:hover': { textDecoration: 'underline' }
                                                                    }}
                                                                >
                                                                    {college.website.replace(/^https?:\/\//, '')}
                                                                </Typography>
                                                            </Box>
                                                        ) : (
                                                            <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }}>
                                                                Сайт не указан
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                            
                                            <CardActions sx={{ p: 2.5, pt: 0 }}>
                                                <Button
                                                    fullWidth
                                                    component={RouterLink}
                                                    to={`/colleges/${college._id}`}
                                                    variant="contained"
                                                    size="small"
                                                    sx={{ 
                                                        height: '36px',
                                                        borderRadius: 2,
                                                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        fontSize: '0.8rem',
                                                        '&:hover': {
                                                            background: 'linear-gradient(45deg, #5a6fd6, #6a3f8f)',
                                                        }
                                                    }}
                                                >
                                                    Подробнее
                                                </Button>
                                            </CardActions>
                                        </MotionCard>
                                    ))
                                ) : (
                                    <Box sx={{ gridColumn: '1/-1' }}>
                                        <Fade in={true}>
                                            <Paper 
                                                sx={{ 
                                                    p: 8, 
                                                    textAlign: 'center',
                                                    borderRadius: 4,
                                                    background: 'rgba(255,255,255,0.8)',
                                                    backdropFilter: 'blur(10px)',
                                                    border: '1px dashed #667eea'
                                                }}
                                            >
                                                <SchoolIcon sx={{ fontSize: 80, color: alpha('#667eea', 0.3), mb: 2 }} />
                                                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#333' }}>
                                                    Колледжи не найдены
                                                </Typography>
                                                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                                                    Попробуйте изменить параметры поиска или сбросить фильтры
                                                </Typography>
                                                <Button 
                                                    variant="contained" 
                                                    onClick={clearFilters}
                                                    size="large"
                                                    sx={{ 
                                                        borderRadius: 3,
                                                        px: 6,
                                                        py: 1.5,
                                                        background: 'linear-gradient(45deg, #667eea, #764ba2)'
                                                    }}
                                                >
                                                    Сбросить все фильтры
                                                </Button>
                                            </Paper>
                                        </Fade>
                                    </Box>
                                )}
                            </Box>
                        </AnimatePresence>

                        {pagination.totalPages > 1 && (
                            <Fade in={true}>
                                <Box sx={{ 
                                    mt: 6, 
                                    display: 'flex', 
                                    justifyContent: 'center',
                                    '& .MuiPagination-ul': {
                                        gap: 1
                                    }
                                }}>
                                    <Pagination
                                        count={pagination.totalPages}
                                        page={pagination.page}
                                        onChange={handlePageChange}
                                        color="primary"
                                        size="large"
                                        showFirstButton
                                        showLastButton
                                        sx={{
                                            '& .MuiPaginationItem-root': {
                                                borderRadius: 2,
                                                fontSize: '1rem',
                                                '&.Mui-selected': {
                                                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                                    color: 'white',
                                                    '&:hover': {
                                                        background: 'linear-gradient(45deg, #5a6fd6, #6a3f8f)',
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </Box>
                            </Fade>
                        )}
                    </>
                )}
            </Container>
        </Box>
    );
};

export default CollegesPage;