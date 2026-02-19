// src/pages/specialties/SpecialtiesPage.jsx
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    TextField,
    Button,
    Chip,
    Stack,
    Pagination,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Checkbox,
    alpha,
    useTheme,
    CircularProgress,
    Alert,
    Badge,
    ToggleButton,
    ToggleButtonGroup,
    InputAdornment,
    Avatar,
    AvatarGroup,
    Tooltip,
    Slider,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormLabel,
    Paper,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Divider,
    useMediaQuery,
    Collapse,
    CardActionArea,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SchoolIcon from '@mui/icons-material/School';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CompareIcon from '@mui/icons-material/Compare';
import SortIcon from '@mui/icons-material/Sort';
import ClearIcon from '@mui/icons-material/Clear';
import BusinessIcon from '@mui/icons-material/Business';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PaidIcon from '@mui/icons-material/Paid';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import ClassIcon from '@mui/icons-material/Class';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../../context/AuthContext';

const ITEMS_PER_PAGE = 12;

const KLIMOV_TYPES = {
    manNature: { name: 'Человек-Природа', color: '#10b981', short: 'П' },
    manTech: { name: 'Человек-Техника', color: '#3b82f6', short: 'Т' },
    manHuman: { name: 'Человек-Человек', color: '#ec4899', short: 'Ч' },
    manSign: { name: 'Человек-Знаковая система', color: '#f59e0b', short: 'З' },
    manArt: { name: 'Человек-Искусство', color: '#8b5cf6', short: 'Х' }
};

const FORM_LABELS = {
    'full-time': 'Очная',
    'part-time': 'Очно-заочная',
    'distance': 'Заочная'
};

const FUNDING_LABELS = {
    'budget': 'Бюджетное',
    'paid': 'Платное',
    'both': 'Бюджетное и платное'
};

const DURATION_RANGES = [
    { value: 'all', label: 'Все сроки' },
    { value: 'less-than-2', label: 'До 2 лет', min: 0, max: 2 },
    { value: '2-3', label: '2-3 года', min: 2, max: 3 },
    { value: '3-4', label: '3-4 года', min: 3, max: 4 },
    { value: 'more-than-4', label: 'Более 4 лет', min: 4, max: 100 }
];

const extractYearsFromDuration = (duration) => {
    if (!duration) return 0;
    
    const durationLower = duration.toLowerCase();
    let years = 0;
    
    const matches = durationLower.match(/(\d+[,.]?\d*)/g);
    if (matches) {
        if (durationLower.includes('год') || durationLower.includes('лет')) {
            years = parseFloat(matches[0].replace(',', '.'));
        } else if (durationLower.includes('мес') || durationLower.includes('месяц')) {
            const months = parseFloat(matches[0].replace(',', '.'));
            years = months / 12;
        } else {
            years = parseFloat(matches[0].replace(',', '.'));
        }
    }
    
    return years;
};

const SpecialtiesPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { api, user } = useAuth();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const searchTimeoutRef = useRef(null);
    
    const [specialties, setSpecialties] = useState([]);
    const [filtersData, setFiltersData] = useState({
        regions: [],
        cities: [],
        forms: [],
        fundingTypes: [],
        durations: [],
        klimovTypes: []
    });
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [selectedKlimovTypes, setSelectedKlimovTypes] = useState([]);
    const [educationLevel, setEducationLevel] = useState('');
    const [form, setForm] = useState('');
    const [fundingType, setFundingType] = useState('');
    const [city, setCity] = useState('');
    const [durationRange, setDurationRange] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [region, setRegion] = useState('');
    
    const [showFilters, setShowFilters] = useState(false);
    const [selectedSpecialties, setSelectedSpecialties] = useState([]);
    const [updatingFavorites, setUpdatingFavorites] = useState({});
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [saveFiltersDialogOpen, setSaveFiltersDialogOpen] = useState(false);
    const [filterPresets, setFilterPresets] = useState([]);
    const [newPresetName, setNewPresetName] = useState('');

    useEffect(() => {
        loadSpecialties();
        if (user) {
            loadFavorites();
            loadFilterPresets();
        }
    }, [page, searchTerm, selectedKlimovTypes, educationLevel, form, fundingType, city, durationRange, sortBy, sortOrder, region]);

    const loadSpecialties = async () => {
        try {
            setLoading(true);
            
            const params = new URLSearchParams({
                page: page,
                limit: ITEMS_PER_PAGE,
                ...(searchTerm && { search: searchTerm }),
                ...(selectedKlimovTypes.length > 0 && { klimovType: selectedKlimovTypes.join(',') }),
                ...(educationLevel && { educationLevel }),
                ...(form && { form }),
                ...(fundingType && { fundingType }),
                ...(city && { city }),
                ...(region && { region }),
                ...(durationRange !== 'all' && { durationRange }),
                sortBy,
                sortOrder
            });

            const response = await api.get(`/specialties?${params}`);
            
            if (response.data.success) {
                setSpecialties(response.data.specialties || []);
                setTotal(response.data.total || 0);
                setTotalPages(response.data.totalPages || 1);
                
                if (response.data.filters) {
                    setFiltersData({
                        regions: response.data.filters.regions || [],
                        cities: response.data.filters.cities || [],
                        forms: response.data.filters.forms || [],
                        fundingTypes: response.data.filters.fundingTypes || [],
                        durations: response.data.filters.durations || [],
                        klimovTypes: response.data.filters.klimovTypes || []
                    });
                }
            }
            setLoading(false);
        } catch (error) {
            console.error('Ошибка загрузки специальностей:', error);
            setError('Не удалось загрузить специальности');
            setLoading(false);
        }
    };

    const loadFavorites = async () => {
        if (!user) return;
        
        try {
            const response = await api.get('/specialties/saved/list');
            const favoriteIds = response.data.savedSpecialties.map(fav => fav._id);
            setFavorites(favoriteIds);
        } catch (error) {
            console.error('Ошибка загрузки избранного:', error);
        }
    };

    const loadFilterPresets = async () => {
        if (!user) return;
        
        try {
            const presets = JSON.parse(localStorage.getItem(`filterPresets_${user._id}`) || '[]');
            setFilterPresets(presets);
        } catch (error) {
            console.error('Ошибка загрузки пресетов:', error);
        }
    };

    const saveFilterPreset = () => {
        if (!user) return;
        
        const preset = {
            id: Date.now(),
            name: newPresetName,
            filters: {
                searchTerm,
                selectedKlimovTypes,
                educationLevel,
                form,
                fundingType,
                city,
                durationRange,
                region,
                sortBy,
                sortOrder
            },
            createdAt: new Date().toISOString()
        };
        
        const updatedPresets = [...filterPresets, preset];
        setFilterPresets(updatedPresets);
        localStorage.setItem(`filterPresets_${user._id}`, JSON.stringify(updatedPresets));
        setNewPresetName('');
        setSaveFiltersDialogOpen(false);
    };

    const loadFilterPreset = (preset) => {
        setSearchTerm(preset.filters.searchTerm || '');
        setSearchInput(preset.filters.searchTerm || '');
        setSelectedKlimovTypes(preset.filters.selectedKlimovTypes || []);
        setEducationLevel(preset.filters.educationLevel || '');
        setForm(preset.filters.form || '');
        setFundingType(preset.filters.fundingType || '');
        setCity(preset.filters.city || '');
        setDurationRange(preset.filters.durationRange || 'all');
        setRegion(preset.filters.region || '');
        setSortBy(preset.filters.sortBy || 'name');
        setSortOrder(preset.filters.sortOrder || 'asc');
        setPage(1);
    };

    const deleteFilterPreset = (id) => {
        const updatedPresets = filterPresets.filter(preset => preset.id !== id);
        setFilterPresets(updatedPresets);
        localStorage.setItem(`filterPresets_${user._id}`, JSON.stringify(updatedPresets));
    };

    const toggleFavorite = async (specialtyId) => {
        if (!user) {
            navigate('/login');
            return;
        }

        const isFavorite = favorites.includes(specialtyId);
        setUpdatingFavorites(prev => ({ ...prev, [specialtyId]: true }));

        try {
            if (isFavorite) {
                await api.post('/specialties/unsave', { specialtyId });
                setFavorites(prev => prev.filter(id => id !== specialtyId));
            } else {
                await api.post('/specialties/save', { specialtyId });
                setFavorites(prev => [...prev, specialtyId]);
            }
        } catch (error) {
            console.error('Ошибка обновления избранного:', error);
        } finally {
            setUpdatingFavorites(prev => ({ ...prev, [specialtyId]: false }));
        }
    };

    const toggleSelectSpecialty = (specialtyId) => {
        setSelectedSpecialties(prev => 
            prev.includes(specialtyId) 
                ? prev.filter(id => id !== specialtyId)
                : [...prev, specialtyId]
        );
    };

    const handleSearch = useCallback(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        
        searchTimeoutRef.current = setTimeout(() => {
            setSearchTerm(searchInput);
            setPage(1);
        }, 500);
    }, [searchInput]);

    useEffect(() => {
        handleSearch();
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchInput, handleSearch]);

    const clearFilters = () => {
        setSearchTerm('');
        setSearchInput('');
        setSelectedKlimovTypes([]);
        setEducationLevel('');
        setForm('');
        setFundingType('');
        setCity('');
        setDurationRange('all');
        setRegion('');
        setSortBy('name');
        setSortOrder('asc');
        setPage(1);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchTerm(searchInput);
        setPage(1);
    };

    const hasActiveFilters = () => {
        return searchTerm || 
               selectedKlimovTypes.length > 0 || 
               educationLevel || 
               form || 
               fundingType || 
               city || 
               durationRange !== 'all' ||
               region;
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

    const renderFilters = () => (
        <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FilterListIcon /> Фильтры
                </Typography>
                {user && (
                    <Button
                        size="small"
                        startIcon={<SaveIcon />}
                        onClick={() => setSaveFiltersDialogOpen(true)}
                        variant="outlined"
                    >
                        Сохранить
                    </Button>
                )}
            </Box>
            
            {/* Сохраненные пресеты */}
            {user && filterPresets.length > 0 && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
                        Сохраненные фильтры:
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                        {filterPresets.map(preset => (
                            <Chip
                                key={preset.id}
                                label={preset.name}
                                onClick={() => loadFilterPreset(preset)}
                                onDelete={() => deleteFilterPreset(preset.id)}
                                size="small"
                                sx={{
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                    color: theme.palette.primary.main,
                                }}
                            />
                        ))}
                    </Stack>
                </Box>
            )}
            
            <Grid container spacing={3}>
                {/* Город */}
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Город обучения</InputLabel>
                        <Select
                            value={city}
                            onChange={(e) => {
                                setCity(e.target.value);
                                setPage(1);
                            }}
                            label="Город обучения"
                        >
                            <MenuItem value="">Все города</MenuItem>
                            {filtersData.cities.map(city => (
                                <MenuItem key={city} value={city}>
                                    {city}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                
                {/* Регион */}
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Регион</InputLabel>
                        <Select
                            value={region}
                            onChange={(e) => {
                                setRegion(e.target.value);
                                setPage(1);
                            }}
                            label="Регион"
                        >
                            <MenuItem value="">Все регионы</MenuItem>
                            {filtersData.regions.map(region => (
                                <MenuItem key={region} value={region}>
                                    {region}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                
                {/* Форма обучения */}
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Форма обучения</InputLabel>
                        <Select
                            value={form}
                            onChange={(e) => {
                                setForm(e.target.value);
                                setPage(1);
                            }}
                            label="Форма обучения"
                        >
                            <MenuItem value="">Все формы</MenuItem>
                            {filtersData.forms.map(form => (
                                <MenuItem key={form} value={form}>
                                    {FORM_LABELS[form]}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                
                {/* Тип финансирования */}
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Тип финансирования</InputLabel>
                        <Select
                            value={fundingType}
                            onChange={(e) => {
                                setFundingType(e.target.value);
                                setPage(1);
                            }}
                            label="Тип финансирования"
                        >
                            <MenuItem value="">Все типы</MenuItem>
                            {filtersData.fundingTypes.map(type => (
                                <MenuItem key={type} value={type}>
                                    {FUNDING_LABELS[type]}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                
                {/* Срок обучения */}
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Срок обучения</InputLabel>
                        <Select
                            value={durationRange}
                            onChange={(e) => {
                                setDurationRange(e.target.value);
                                setPage(1);
                            }}
                            label="Срок обучения"
                        >
                            {DURATION_RANGES.map(range => (
                                <MenuItem key={range.value} value={range.value}>
                                    {range.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                
                {/* Уровень образования */}
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Уровень образования</InputLabel>
                        <Select
                            value={educationLevel}
                            onChange={(e) => {
                                setEducationLevel(e.target.value);
                                setPage(1);
                            }}
                            label="Уровень образования"
                        >
                            <MenuItem value="">Все уровни</MenuItem>
                            <MenuItem value="SPO">СПО (Среднее профессиональное)</MenuItem>
                            <MenuItem value="VO">ВО (Высшее образование)</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                
                {/* Типы по Климову */}
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel>Типы по Климову</InputLabel>
                        <Select
                            multiple
                            value={selectedKlimovTypes}
                            onChange={(e) => {
                                setSelectedKlimovTypes(e.target.value);
                                setPage(1);
                            }}
                            label="Типы по Климову"
                            size="small"
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip
                                            key={value}
                                            label={KLIMOV_TYPES[value]?.short || value}
                                            size="small"
                                            sx={{
                                                backgroundColor: alpha(KLIMOV_TYPES[value]?.color || '#6366f1', 0.1),
                                                color: KLIMOV_TYPES[value]?.color || '#6366f1',
                                            }}
                                        />
                                    ))}
                                </Box>
                            )}
                        >
                            {Object.entries(KLIMOV_TYPES).map(([value, type]) => (
                                <MenuItem key={value} value={value}>
                                    <Checkbox checked={selectedKlimovTypes.includes(value)} />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: '50%',
                                            backgroundColor: type.color
                                        }} />
                                        {type.name}
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                
                {/* Кнопки действий */}
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        {hasActiveFilters() && (
                            <Button
                                variant="outlined"
                                startIcon={<ClearIcon />}
                                onClick={clearFilters}
                                size="small"
                            >
                                Сбросить все фильтры
                            </Button>
                        )}
                        
                        {isMobile && (
                            <Button
                                variant="contained"
                                onClick={() => setMobileFiltersOpen(false)}
                                size="small"
                            >
                                Применить фильтры
                            </Button>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );

    const renderMobileFilters = () => (
        <Drawer
            anchor="right"
            open={mobileFiltersOpen}
            onClose={() => setMobileFiltersOpen(false)}
            PaperProps={{
                sx: { width: '100%', maxWidth: 400, p: 2 }
            }}
        >
            <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Фильтры
                    </Typography>
                    <IconButton onClick={() => setMobileFiltersOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                {renderFilters()}
            </Box>
        </Drawer>
    );

    const renderSpecialtyCard = (specialty) => {
        const isFavorite = favorites.includes(specialty._id);
        const isSelected = selectedSpecialties.includes(specialty._id);
        const collegeCount = specialty.colleges?.length || specialty.collegeNames?.length || 0;
        const years = extractYearsFromDuration(specialty.duration);
        const matchPercentage = specialty.matchPercentage || 0;
        const matchColor = getMatchColor(matchPercentage);
        const matchLabel = getMatchLabel(matchPercentage);
        
        return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={specialty._id}>
                <Card
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        border: `2px solid ${isSelected ? theme.palette.primary.main : 'transparent'}`,
                        position: 'relative',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: theme.shadows[8],
                        }
                    }}
                >
                    <CardActionArea 
                        component={Link}
                        to={`/specialties/${specialty._id}`}
                        sx={{ flexGrow: 1, p: 2 }}
                    >
                        <CardContent sx={{ p: 0 }}>
                            {/* Код и заголовок */}
                            <Box sx={{ mb: 2 }}>
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        color: 'text.secondary',
                                        fontFamily: 'monospace',
                                        fontWeight: 600,
                                        display: 'block',
                                        mb: 0.5
                                    }}
                                >
                                    {specialty.code}
                                </Typography>
                                <Typography 
                                    variant="h6" 
                                    sx={{ 
                                        fontWeight: 700,
                                        mb: 1,
                                        lineHeight: 1.3,
                                        fontSize: '1rem'
                                    }}
                                >
                                    {specialty.name}
                                </Typography>
                            </Box>
                            
                            {/* Процент совпадения */}
                            {user && matchPercentage > 0 && (
                                <Box sx={{ mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                        <Box sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            backgroundColor: matchColor
                                        }} />
                                        <Typography variant="caption" sx={{ fontWeight: 600, color: matchColor }}>
                                            {matchPercentage}% совпадение
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                            
                            {/* Фильтры в виде чипсов */}
                            <Stack direction="row" spacing={0.5} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
                                <Chip
                                    label={FORM_LABELS[specialty.form] || specialty.form}
                                    size="small"
                                    sx={{
                                        backgroundColor: alpha('#10b981', 0.1),
                                        color: '#10b981',
                                        fontSize: '0.7rem',
                                        height: 20,
                                    }}
                                />
                                <Chip
                                    label={FUNDING_LABELS[specialty.fundingType] || specialty.fundingType}
                                    size="small"
                                    sx={{
                                        backgroundColor: specialty.fundingType === 'budget' 
                                            ? alpha('#3b82f6', 0.1) 
                                            : specialty.fundingType === 'paid'
                                            ? alpha('#ec4899', 0.1)
                                            : alpha('#f59e0b', 0.1),
                                        color: specialty.fundingType === 'budget' 
                                            ? '#3b82f6' 
                                            : specialty.fundingType === 'paid'
                                            ? '#ec4899'
                                            : '#f59e0b',
                                        fontSize: '0.7rem',
                                        height: 20,
                                    }}
                                />
                                <Chip
                                    label={`${years.toFixed(1)} лет`}
                                    size="small"
                                    sx={{
                                        backgroundColor: alpha('#6366f1', 0.1),
                                        color: '#6366f1',
                                        fontSize: '0.7rem',
                                        height: 20,
                                    }}
                                />
                            </Stack>
                            
                            {/* Краткое описание */}
                            <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                sx={{ 
                                    mb: 2,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    fontSize: '0.85rem'
                                }}
                            >
                                {specialty.description || 'Описание отсутствует'}
                            </Typography>
                            
                            {/* Типы по Климову */}
                            {specialty.klimovTypes && specialty.klimovTypes.length > 0 && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                        Типы:
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                        {specialty.klimovTypes.slice(0, 3).map((type, idx) => {
                                            const typeInfo = KLIMOV_TYPES[type];
                                            return (
                                                <Chip
                                                    key={idx}
                                                    label={typeInfo?.short || type}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: alpha(typeInfo?.color || '#6366f1', 0.1),
                                                        color: typeInfo?.color || '#6366f1',
                                                        fontSize: '0.7rem',
                                                        height: 20,
                                                    }}
                                                />
                                            );
                                        })}
                                    </Box>
                                </Box>
                            )}
                            
                            {/* Колледжи */}
                            {collegeCount > 0 && (
                                <Box sx={{ mt: 'auto' }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                        Доступна в:
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        <Typography variant="caption">
                                            {collegeCount} колледж{collegeCount > 1 ? 'ах' : 'е'}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                        </CardContent>
                    </CardActionArea>
                    
                    {/* Кнопки действий */}
                    <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
                        <Button
                            component={Link}
                            to={`/specialties/${specialty._id}`}
                            variant="outlined"
                            size="small"
                            fullWidth
                        >
                            Подробнее
                        </Button>
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleSelectSpecialty(specialty._id);
                            }}
                            sx={{ 
                                border: '1px solid',
                                borderColor: isSelected ? 'primary.main' : 'divider',
                                bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.1) : 'transparent'
                            }}
                        >
                            <CompareIcon sx={{ 
                                color: isSelected ? theme.palette.primary.main : 'inherit',
                                fontSize: 20
                            }} />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(specialty._id);
                            }}
                            disabled={updatingFavorites[specialty._id]}
                        >
                            {updatingFavorites[specialty._id] ? (
                                <CircularProgress size={20} />
                            ) : isFavorite ? (
                                <BookmarkIcon sx={{ color: '#ec4899' }} />
                            ) : (
                                <BookmarkBorderIcon />
                            )}
                        </IconButton>
                    </Box>
                </Card>
            </Grid>
        );
    };

    const renderActiveFilters = () => {
        if (!hasActiveFilters()) return null;

        return (
            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Активные фильтры:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {searchTerm && (
                        <Chip
                            label={`Поиск: "${searchTerm}"`}
                            size="small"
                            onDelete={() => {
                                setSearchTerm('');
                                setSearchInput('');
                            }}
                        />
                    )}
                    {city && (
                        <Chip
                            label={`Город: ${city}`}
                            size="small"
                            onDelete={() => setCity('')}
                            icon={<LocationCityIcon />}
                        />
                    )}
                    {region && (
                        <Chip
                            label={`Регион: ${region}`}
                            size="small"
                            onDelete={() => setRegion('')}
                        />
                    )}
                    {form && (
                        <Chip
                            label={`Форма: ${FORM_LABELS[form]}`}
                            size="small"
                            onDelete={() => setForm('')}
                            icon={<ClassIcon />}
                        />
                    )}
                    {fundingType && (
                        <Chip
                            label={`Финансирование: ${FUNDING_LABELS[fundingType]}`}
                            size="small"
                            onDelete={() => setFundingType('')}
                            icon={<AttachMoneyIcon />}
                        />
                    )}
                    {durationRange !== 'all' && (
                        <Chip
                            label={`Срок: ${DURATION_RANGES.find(r => r.value === durationRange)?.label}`}
                            size="small"
                            onDelete={() => setDurationRange('all')}
                            icon={<AccessTimeIcon />}
                        />
                    )}
                    {educationLevel && (
                        <Chip
                            label={`Уровень: ${educationLevel === 'SPO' ? 'СПО' : 'ВО'}`}
                            size="small"
                            onDelete={() => setEducationLevel('')}
                            icon={<SchoolIcon />}
                        />
                    )}
                    {selectedKlimovTypes.map(type => (
                        <Chip
                            key={type}
                            label={KLIMOV_TYPES[type]?.short}
                            size="small"
                            onDelete={() => setSelectedKlimovTypes(prev => prev.filter(t => t !== type))}
                            sx={{
                                backgroundColor: alpha(KLIMOV_TYPES[type]?.color || '#6366f1', 0.1),
                                color: KLIMOV_TYPES[type]?.color || '#6366f1',
                            }}
                        />
                    ))}
                    <Button
                        size="small"
                        onClick={clearFilters}
                        sx={{ ml: 'auto' }}
                    >
                        Очистить все
                    </Button>
                </Box>
            </Box>
        );
    };

    const renderSaveFiltersDialog = () => (
        <Dialog open={saveFiltersDialogOpen} onClose={() => setSaveFiltersDialogOpen(false)}>
            <DialogTitle>Сохранить фильтры</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Название пресета"
                    fullWidth
                    value={newPresetName}
                    onChange={(e) => setNewPresetName(e.target.value)}
                    placeholder="Например: Бюджетные в Москве"
                />
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        Сохранятся текущие фильтры:
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                        {searchTerm && <Typography variant="caption" display="block">Поиск: {searchTerm}</Typography>}
                        {city && <Typography variant="caption" display="block">Город: {city}</Typography>}
                        {form && <Typography variant="caption" display="block">Форма: {FORM_LABELS[form]}</Typography>}
                        {fundingType && <Typography variant="caption" display="block">Финансирование: {FUNDING_LABELS[fundingType]}</Typography>}
                        {durationRange !== 'all' && <Typography variant="caption" display="block">Срок: {DURATION_RANGES.find(r => r.value === durationRange)?.label}</Typography>}
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setSaveFiltersDialogOpen(false)}>Отмена</Button>
                <Button 
                    onClick={saveFilterPreset} 
                    variant="contained"
                    disabled={!newPresetName.trim()}
                >
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );

    if (loading && page === 1) {
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
                    Загрузка специальностей...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            py: 6,
        }}>
            <Container maxWidth="xl">
                {/* Заголовок */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
                        Каталог специальностей СПО
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Найдите подходящую специальность для поступления в колледж
                    </Typography>
                </Box>

                {/* Панель поиска и сортировки */}
                <Card sx={{ borderRadius: 3, mb: 4, p: 3 }}>
                    <form onSubmit={handleSearchSubmit}>
                        <Grid container spacing={3} alignItems="center">
                            {/* Поле поиска */}
                            <Grid item xs={12} md={6} lg={4}>
                                <TextField
                                    fullWidth
                                    placeholder="Поиск по названию, коду, колледжу или городу..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon color="action" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: searchInput && (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => {
                                                        setSearchInput('');
                                                        setSearchTerm('');
                                                    }}
                                                    edge="end"
                                                >
                                                    <ClearIcon fontSize="small" />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                        }
                                    }}
                                />
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                    Нажмите Enter для поиска
                                </Typography>
                            </Grid>
                            
                            {/* Сортировка и кнопки */}
                            <Grid item xs={12} md={6} lg={8}>
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                    {/* Сортировка */}
                                    <FormControl sx={{ minWidth: 120 }} size="small">
                                        <InputLabel>Сортировка</InputLabel>
                                        <Select
                                            value={sortBy}
                                            onChange={(e) => {
                                                setSortBy(e.target.value);
                                                setPage(1);
                                            }}
                                            label="Сортировка"
                                        >
                                            <MenuItem value="name">По названию</MenuItem>
                                            <MenuItem value="code">По коду</MenuItem>
                                            <MenuItem value="duration">По сроку обучения</MenuItem>
                                            <MenuItem value="collegeCount">По колледжам</MenuItem>
                                            {user && <MenuItem value="match">По совпадению</MenuItem>}
                                        </Select>
                                    </FormControl>
                                    
                                    {/* Порядок сортировки */}
                                    <ToggleButtonGroup
                                        value={sortOrder}
                                        exclusive
                                        onChange={(e, value) => {
                                            if (value) {
                                                setSortOrder(value);
                                                setPage(1);
                                            }
                                        }}
                                        size="small"
                                    >
                                        <ToggleButton value="asc">
                                            <SortIcon sx={{ transform: 'rotate(-90deg)' }} />
                                        </ToggleButton>
                                        <ToggleButton value="desc">
                                            <SortIcon sx={{ transform: 'rotate(90deg)' }} />
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                    
                                    {/* Кнопка поиска для мобильных */}
                                    {isMobile && (
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            startIcon={<SearchIcon />}
                                            size="small"
                                        >
                                            Поиск
                                        </Button>
                                    )}
                                    
                                    {/* Кнопка фильтров для мобильных */}
                                    {isMobile && (
                                        <Button
                                            variant="outlined"
                                            startIcon={<FilterListIcon />}
                                            onClick={() => setMobileFiltersOpen(true)}
                                            size="small"
                                        >
                                            Фильтры
                                            {hasActiveFilters() && (
                                                <Badge 
                                                    badgeContent="!" 
                                                    color="error" 
                                                    sx={{ ml: 1 }}
                                                />
                                            )}
                                        </Button>
                                    )}
                                    
                                    {/* Кнопка сравнения */}
                                    {selectedSpecialties.length > 0 && (
                                        <Button
                                            variant="contained"
                                            startIcon={<CompareIcon />}
                                            component={Link}
                                            to={`/specialties/compare?ids=${selectedSpecialties.join(',')}`}
                                            size="small"
                                        >
                                            Сравнить ({selectedSpecialties.length})
                                        </Button>
                                    )}
                                    
                                    {/* Кнопка сброса фильтров */}
                                    {hasActiveFilters() && (
                                        <Button
                                            variant="outlined"
                                            startIcon={<ClearIcon />}
                                            onClick={clearFilters}
                                            size="small"
                                        >
                                            Сбросить
                                        </Button>
                                    )}
                                    
                                    {/* Кнопка поиска для десктопа */}
                                    {!isMobile && (
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            startIcon={<SearchIcon />}
                                            size="small"
                                        >
                                            Поиск
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                    
                    {/* Статистика */}
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Найдено специальностей: {total}
                        </Typography>
                        
                        {selectedSpecialties.length > 0 && (
                            <Button
                                size="small"
                                onClick={() => setSelectedSpecialties([])}
                            >
                                Очистить выбор
                            </Button>
                        )}
                    </Box>
                </Card>

                {/* Ошибка */}
                {error && (
                    <Alert severity="error" sx={{ mb: 4 }}>
                        {error}
                    </Alert>
                )}

                {/* Основной контент */}
                <Grid container spacing={4}>
                    {/* Фильтры для десктопа */}
                    {!isMobile && (
                        <Grid item xs={12} md={3}>
                            {renderFilters()}
                        </Grid>
                    )}

                    {/* Список специальностей */}
                    <Grid item xs={12} md={isMobile ? 12 : 9}>
                        {renderActiveFilters()}
                        
                        {specialties.length === 0 ? (
                            <Card sx={{ p: 8, textAlign: 'center', borderRadius: 3 }}>
                                <SchoolIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 3, opacity: 0.5 }} />
                                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                                    Специальности не найдены
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                                    Попробуйте изменить параметры поиска или сбросить фильтры
                                </Typography>
                                <Button variant="contained" onClick={clearFilters}>
                                    Сбросить фильтры
                                </Button>
                            </Card>
                        ) : (
                            <>
                                <Grid container spacing={3}>
                                    {specialties.map(renderSpecialtyCard)}
                                </Grid>
                                
                                {totalPages > 1 && (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                                        <Pagination
                                            count={totalPages}
                                            page={page}
                                            onChange={(event, value) => {
                                                setPage(value);
                                                window.scrollTo({
                                                    top: 0,
                                                    behavior: 'smooth'
                                                });
                                            }}
                                            color="primary"
                                            size="large"
                                            showFirstButton
                                            showLastButton
                                            sx={{
                                                '& .MuiPaginationItem-root': {
                                                    borderRadius: 2,
                                                }
                                            }}
                                        />
                                    </Box>
                                )}
                            </>
                        )}
                        
                        {/* Панель сравнения */}
                        {selectedSpecialties.length > 0 && (
                            <Paper 
                                elevation={4}
                                sx={{ 
                                    position: 'sticky', 
                                    bottom: 20, 
                                    zIndex: 1000, 
                                    mt: 4,
                                    p: 3, 
                                    borderRadius: 3,
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    color: 'white'
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                            Готовы сравнить?
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            Выбрано {selectedSpecialties.length} из 3 возможных специальностей для сравнения
                                        </Typography>
                                    </Box>
                                    <Button
                                        component={Link}
                                        to={`/specialties/compare?ids=${selectedSpecialties.join(',')}`}
                                        variant="contained"
                                        startIcon={<CompareIcon />}
                                        sx={{
                                            bgcolor: 'white',
                                            color: '#059669',
                                            fontWeight: 700,
                                            '&:hover': {
                                                bgcolor: 'grey.100',
                                            }
                                        }}
                                    >
                                        Перейти к сравнению
                                    </Button>
                                </Box>
                            </Paper>
                        )}
                    </Grid>
                </Grid>
                
                {/* Мобильные фильтры */}
                {renderMobileFilters()}
                
                {/* Диалог сохранения фильтров */}
                {renderSaveFiltersDialog()}
            </Container>
        </Box>
    );
};

export default SpecialtiesPage;