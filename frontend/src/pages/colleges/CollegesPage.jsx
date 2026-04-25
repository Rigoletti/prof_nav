import React, { useState, useEffect, useMemo } from 'react';
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
    Tooltip,
    Popover,
    Badge,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Divider
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
    Close as CloseIcon,
    Search as SearchFilterIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'http://localhost:5000/api';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const CollegesPage = () => {
    const theme = useTheme();
    const [colleges, setColleges] = useState([]);
    const [allColleges, setAllColleges] = useState([]);
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
    
    // Popover states
    const [regionAnchorEl, setRegionAnchorEl] = useState(null);
    const [cityAnchorEl, setCityAnchorEl] = useState(null);
    
    // Search states for filters
    const [regionSearch, setRegionSearch] = useState('');
    const [citySearch, setCitySearch] = useState('');

    // Загружаем все колледжи один раз для получения списка городов по регионам
    useEffect(() => {
        fetchAllColleges();
    }, []);

    useEffect(() => {
        fetchColleges();
    }, [filters.page, filters.region, filters.city, filters.search]);

    const fetchAllColleges = async () => {
        try {
            const response = await fetch(`${API_URL}/colleges?limit=1000`);
            const data = await response.json();
            if (data.success) {
                setAllColleges(data.colleges || []);
                
                // Извлекаем уникальные регионы и группируем города по регионам
                const regionsSet = new Set();
                const citiesByRegionMap = new Map();
                
                data.colleges.forEach(college => {
                    if (college.region) {
                        regionsSet.add(college.region);
                        
                        if (!citiesByRegionMap.has(college.region)) {
                            citiesByRegionMap.set(college.region, new Set());
                        }
                        if (college.city) {
                            citiesByRegionMap.get(college.region).add(college.city);
                        }
                    }
                });
                
                setAvailableFilters(prev => ({
                    regions: Array.from(regionsSet).sort(),
                    citiesByRegion: Object.fromEntries(
                        Array.from(citiesByRegionMap.entries()).map(([region, cities]) => [region, Array.from(cities).sort()])
                    )
                }));
            }
        } catch (err) {
            console.error('Ошибка загрузки всех колледжей:', err);
        }
    };

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
                
                if (data.filters) {
                    setAvailableFilters(prev => ({
                        ...prev,
                        regions: data.filters.regions || prev.regions,
                        cities: data.filters.cities || prev.cities
                    }));
                }
            }
        } catch (err) {
            console.error('Ошибка:', err);
            setError('Не удалось загрузить список колледжей');
        } finally {
            setLoading(false);
        }
    };

    // Получаем города для выбранного региона
    const getCitiesForSelectedRegion = () => {
        if (!filters.region) return [];
        
        if (availableFilters.citiesByRegion && availableFilters.citiesByRegion[filters.region]) {
            return availableFilters.citiesByRegion[filters.region];
        }
        
        const citiesSet = new Set();
        allColleges.forEach(college => {
            if (college.region === filters.region && college.city) {
                citiesSet.add(college.city);
            }
        });
        
        return Array.from(citiesSet).sort();
    };

    // Фильтруем регионы по поиску
    const filteredRegions = useMemo(() => {
        if (!regionSearch) return availableFilters.regions;
        return availableFilters.regions.filter(region => 
            region.toLowerCase().includes(regionSearch.toLowerCase())
        );
    }, [regionSearch, availableFilters.regions]);

    // Фильтруем города по поиску
    const filteredCities = useMemo(() => {
        const cities = getCitiesForSelectedRegion();
        if (!citySearch) return cities;
        return cities.filter(city => 
            city.toLowerCase().includes(citySearch.toLowerCase())
        );
    }, [citySearch, filters.region, availableFilters.citiesByRegion]);

    const handleSearchChange = (e) => {
        setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
    };

    const handleRegionSelect = (region) => {
        setFilters(prev => ({ ...prev, region: region, city: '', page: 1 }));
        setRegionAnchorEl(null);
        setRegionSearch('');
    };

    const handleCitySelect = (city) => {
        setFilters(prev => ({ ...prev, city: city, page: 1 }));
        setCityAnchorEl(null);
        setCitySearch('');
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

    const renderActiveFilters = () => {
        if (getActiveFiltersCount() === 0) return null;
        
        return (
            <Paper sx={{ p: 2, mb: 3, borderRadius: 3, bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FilterIcon fontSize="small" /> 
                        Активные фильтры ({getActiveFiltersCount()})
                    </Typography>
                    <Button size="small" onClick={clearFilters} startIcon={<ClearIcon />} sx={{ textTransform: 'none' }}>
                        Очистить все
                    </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
                    {filters.search && (
                        <Chip
                            label={`Поиск: "${filters.search}"`}
                            size="small"
                            onDelete={() => setFilters(prev => ({ ...prev, search: '' }))}
                            sx={{ borderRadius: 2 }}
                        />
                    )}
                    {filters.region && (
                        <Chip
                            label={`Регион: ${filters.region}`}
                            size="small"
                            onDelete={() => setFilters(prev => ({ ...prev, region: '', city: '' }))}
                            icon={<LocationIcon />}
                            sx={{ borderRadius: 2 }}
                        />
                    )}
                    {filters.city && (
                        <Chip
                            label={`Город: ${filters.city}`}
                            size="small"
                            onDelete={() => setFilters(prev => ({ ...prev, city: '' }))}
                            icon={<LocationIcon />}
                            sx={{ borderRadius: 2 }}
                        />
                    )}
                </Box>
            </Paper>
        );
    };

    const citiesForRegion = useMemo(() => getCitiesForSelectedRegion(), [filters.region, allColleges, availableFilters.citiesByRegion]);
    const isCityFilterDisabled = !filters.region;

    // Render popover with search
    const renderSearchablePopover = (open, anchorEl, onClose, title, items, onSelect, searchValue, onSearchChange, placeholder) => (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={() => {
                onClose();
                onSearchChange('');
            }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            PaperProps={{ 
                sx: { 
                    width: 320,
                    maxWidth: '90vw',
                    mt: 1, 
                    borderRadius: 3,
                    overflow: 'hidden'
                } 
            }}
        >
            <Box sx={{ p: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                    {title}
                </Typography>
                
                <TextField
                    fullWidth
                    size="small"
                    placeholder={placeholder}
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchFilterIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                            </InputAdornment>
                        ),
                        endAdornment: searchValue && (
                            <InputAdornment position="end">
                                <IconButton size="small" onClick={() => onSearchChange('')}>
                                    <ClearIcon fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                    sx={{ mb: 2 }}
                />
                
                <Divider sx={{ mb: 1 }} />
                
                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {items.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                            Ничего не найдено
                        </Typography>
                    ) : (
                        items.map((item) => (
                            <ListItem key={item} disablePadding>
                                <ListItemButton 
                                    onClick={() => onSelect(item)}
                                    sx={{ borderRadius: 1.5, mb: 0.5 }}
                                >
                                    <ListItemText 
                                        primary={item}
                                        primaryTypographyProps={{ fontSize: '0.9rem' }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))
                    )}
                </Box>
            </Box>
        </Popover>
    );

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Fade in={true}>
                    <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 4, bgcolor: alpha(theme.palette.error.main, 0.05) }}>
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>
                        <Button onClick={fetchColleges} variant="contained" color="error" size="large">Повторить попытку</Button>
                    </Paper>
                </Fade>
            </Container>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
            {/* Hero секция */}
            <Box sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                pt: { xs: 6, md: 10 },
                pb: { xs: 8, md: 12 },
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Container maxWidth="xl">
                    <MotionBox initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '3.5rem' } }}>
                            Образовательные учреждения
                        </Typography>
                        <Typography variant="h5" sx={{ maxWidth: 600, opacity: 0.95, mb: 4 }}>
                            Найдите идеальное место для вашего образования среди лучших колледжей
                        </Typography>
                        
                        <Grid container spacing={3}>
                            {[
                                { label: 'Всего колледжей', value: pagination.total, icon: CollegeIcon },
                                { label: 'Регионов', value: availableFilters.regions.length, icon: LocationIcon },
                                { label: 'Городов', value: availableFilters.cities?.length || 0, icon: SchoolIcon }
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
                                            border: '1px solid rgba(255,255,255,0.2)'
                                        }}
                                    >
                                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                                            <stat.icon sx={{ fontSize: 30 }} />
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

            <Container maxWidth="xl" sx={{ mt: -4, pb: 8, position: 'relative', zIndex: 10 }}>
                {/* Поиск */}
                <Zoom in={true}>
                    <Paper elevation={24} sx={{ p: 3, mb: 3, borderRadius: 3, background: 'white' }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    placeholder="Поиск по названию, городу, адресу..."
                                    value={filters.search}
                                    onChange={handleSearchChange}
                                    variant="outlined"
                                    size="medium"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ color: '#667eea' }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: filters.search && (
                                            <InputAdornment position="end">
                                                <IconButton size="small" onClick={() => setFilters(prev => ({ ...prev, search: '' }))}>
                                                    <ClearIcon fontSize="small" />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                    {getActiveFiltersCount() > 0 && (
                                        <Button
                                            variant="outlined"
                                            onClick={clearFilters}
                                            startIcon={<ClearIcon />}
                                            sx={{ borderRadius: 2, textTransform: 'none' }}
                                        >
                                            Сбросить все
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Zoom>

                {/* Фильтры чипсы */}
                <Paper sx={{ borderRadius: 3, p: 2, mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mr: 1 }}>Фильтры:</Typography>
                    
                    <Chip 
                        label={filters.region || "Регион"} 
                        icon={<LocationIcon />} 
                        onClick={(e) => setRegionAnchorEl(e.currentTarget)}
                        variant={filters.region ? "filled" : "outlined"}
                        color={filters.region ? "primary" : "default"}
                        onDelete={filters.region ? () => setFilters(prev => ({ ...prev, region: '', city: '' })) : undefined}
                        sx={{ borderRadius: 2 }}
                    />
                    
                    <Chip 
                        label={filters.city || (filters.region ? "Город" : "Сначала выберите регион")} 
                        icon={<LocationIcon />} 
                        onClick={(e) => {
                            if (filters.region && citiesForRegion.length > 0) {
                                setCityAnchorEl(e.currentTarget);
                            }
                        }}
                        variant={filters.city ? "filled" : "outlined"}
                        color={filters.city ? "primary" : "default"}
                        onDelete={filters.city ? () => setFilters(prev => ({ ...prev, city: '' })) : undefined}
                        sx={{ 
                            borderRadius: 2,
                            opacity: isCityFilterDisabled ? 0.6 : 1,
                            cursor: isCityFilterDisabled ? 'default' : 'pointer'
                        }}
                    />
                    
                    {getActiveFiltersCount() > 0 && (
                        <Button size="small" onClick={clearFilters} startIcon={<ClearIcon />} sx={{ ml: 'auto' }}>
                            Сбросить все
                        </Button>
                    )}
                </Paper>

                {renderActiveFilters()}

                {/* Результаты */}
                {loading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 12, gap: 3 }}>
                        <CircularProgress size={60} sx={{ color: '#667eea' }} />
                        <Typography variant="h6" color="text.secondary">Загружаем колледжи...</Typography>
                    </Box>
                ) : (
                    <>
                        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CollegeIcon sx={{ color: '#667eea' }} />
                                Найдено: <strong style={{ color: '#667eea', fontSize: '1.3rem' }}>{pagination.total}</strong>
                                {pagination.total === 1 ? 'колледж' : pagination.total > 1 && pagination.total < 5 ? 'колледжа' : 'колледжей'}
                            </Typography>
                        </Box>

                        <AnimatePresence>
                            <Box sx={{ 
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(2, 1fr)',
                                    md: 'repeat(3, 1fr)',
                                    lg: 'repeat(4, 1fr)'
                                },
                                gap: 3
                            }}>
                                {colleges.length > 0 ? (
                                    colleges.map((college, index) => (
                                        <MotionCard
                                            key={college._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ delay: index * 0.05 }}
                                            whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)' }}
                                            sx={{ 
                                                borderRadius: 3,
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    height: 4,
                                                    background: 'linear-gradient(90deg, #667eea, #764ba2)'
                                                }
                                            }}
                                        >
                                            <CardContent sx={{ flex: 1, p: 2.5 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                                                    <Avatar sx={{ width: 48, height: 48, background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                                                        <CollegeIcon />
                                                    </Avatar>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Tooltip title={college.name} arrow>
                                                            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                                                                {college.name}
                                                            </Typography>
                                                        </Tooltip>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                                            <LocationIcon sx={{ color: '#667eea', fontSize: 14 }} />
                                                            <Typography variant="caption" color="text.secondary">
                                                                {college.city}, {college.region}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>

                                                {college.address && college.address !== 'Адрес не указан' && (
                                                    <Box sx={{ mb: 1.5 }}>
                                                        <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontSize: '0.7rem' }}>
                                                            📍 {college.address}
                                                        </Typography>
                                                    </Box>
                                                )}

                                                {college.description && college.description !== 'Описание отсутствует' && (
                                                    <Typography variant="body2" color="text.secondary" sx={{ 
                                                        fontSize: '0.75rem', 
                                                        mb: 1.5,
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 3,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden'
                                                    }}>
                                                        {college.description}
                                                    </Typography>
                                                )}

                                                <Box sx={{ mb: 1.5 }}>
                                                    <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5, fontSize: '0.7rem' }}>
                                                        <BookIcon sx={{ fontSize: 12, mr: 0.5 }} />
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
                                                                        sx={{ height: 20, fontSize: '0.6rem' }}
                                                                    />
                                                                ))}
                                                                {college.specialties.length > 3 && (
                                                                    <Chip label={`+${college.specialties.length - 3}`} size="small" sx={{ height: 20, fontSize: '0.6rem' }} />
                                                                )}
                                                            </>
                                                        ) : (
                                                            <Typography variant="caption" color="text.disabled">Нет информации</Typography>
                                                        )}
                                                    </Box>
                                                </Box>

                                                <Box sx={{ bgcolor: alpha('#f5f5f5', 0.5), borderRadius: 2, p: 1.5 }}>
                                                    <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.75, fontSize: '0.7rem' }}>
                                                        Контакты:
                                                    </Typography>
                                                    {college.phone && (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                                                            <PhoneIcon sx={{ color: '#4CAF50', fontSize: 12 }} />
                                                            <Typography variant="caption">{college.phone}</Typography>
                                                        </Box>
                                                    )}
                                                    {college.email && (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                                                            <EmailIcon sx={{ color: '#2196F3', fontSize: 12 }} />
                                                            <Typography variant="caption" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{college.email}</Typography>
                                                        </Box>
                                                    )}
                                                    {college.website && (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                                            <LanguageIcon sx={{ color: '#FF9800', fontSize: 12 }} />
                                                            <Typography 
                                                                variant="caption" 
                                                                component="a"
                                                                href={college.website.startsWith('http') ? college.website : `https://${college.website}`}
                                                                target="_blank"
                                                                sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                                                            >
                                                                {college.website.replace(/^https?:\/\//, '')}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </CardContent>
                                            
                                            <CardActions sx={{ p: 2.5, pt: 0 }}>
                                                <Button
                                                    fullWidth
                                                    component={RouterLink}
                                                    to={`/colleges/${college._id}`}
                                                    variant="contained"
                                                    sx={{ 
                                                        borderRadius: 2,
                                                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        '&:hover': { background: 'linear-gradient(45deg, #5a6fd6, #6a3f8f)' }
                                                    }}
                                                >
                                                    Подробнее
                                                </Button>
                                            </CardActions>
                                        </MotionCard>
                                    ))
                                ) : (
                                    <Box sx={{ gridColumn: '1/-1', textAlign: 'center', py: 8 }}>
                                        <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 3 }}>
                                            <SchoolIcon sx={{ fontSize: 80, color: alpha('#667eea', 0.3), mb: 2 }} />
                                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>Колледжи не найдены</Typography>
                                            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>Попробуйте изменить параметры поиска или сбросить фильтры</Typography>
                                            <Button variant="contained" onClick={clearFilters} size="large" sx={{ background: 'linear-gradient(45deg, #667eea, #764ba2)' }}>Сбросить все фильтры</Button>
                                        </Paper>
                                    </Box>
                                )}
                            </Box>
                        </AnimatePresence>

                        {pagination.totalPages > 1 && (
                            <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
                                <Pagination
                                    count={pagination.totalPages}
                                    page={pagination.page}
                                    onChange={handlePageChange}
                                    color="primary"
                                    size="large"
                                    showFirstButton
                                    showLastButton
                                />
                            </Box>
                        )}
                    </>
                )}
            </Container>

            {/* Popover для выбора региона с поиском */}
            {renderSearchablePopover(
                Boolean(regionAnchorEl),
                regionAnchorEl,
                () => setRegionAnchorEl(null),
                "Выберите регион",
                filteredRegions,
                handleRegionSelect,
                regionSearch,
                setRegionSearch,
                "Поиск региона..."
            )}

            {/* Popover для выбора города с поиском */}
            {renderSearchablePopover(
                Boolean(cityAnchorEl) && !isCityFilterDisabled && citiesForRegion.length > 0,
                cityAnchorEl,
                () => setCityAnchorEl(null),
                `Выберите город в регионе "${filters.region}"`,
                filteredCities,
                handleCitySelect,
                citySearch,
                setCitySearch,
                "Поиск города..."
            )}
        </Box>
    );
};

export default CollegesPage;