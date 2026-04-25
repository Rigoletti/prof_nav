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
    Tooltip,
    Paper,
    Drawer,
    useMediaQuery,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    Popover,
    FormGroup,
    FormControlLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SchoolIcon from '@mui/icons-material/School';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import CompareIcon from '@mui/icons-material/Compare';
import SortIcon from '@mui/icons-material/Sort';
import ClearIcon from '@mui/icons-material/Clear';
import BusinessIcon from '@mui/icons-material/Business';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import ClassIcon from '@mui/icons-material/Class';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PsychologyIcon from '@mui/icons-material/Psychology';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useAuth } from '../../context/AuthContext';

const ITEMS_PER_PAGE = 12;

const KLIMOV_TYPES = {
    manNature: { name: 'Человек-Природа', color: '#10b981', short: 'П', icon: '🌿' },
    manTech: { name: 'Человек-Техника', color: '#3b82f6', short: 'Т', icon: '⚙️' },
    manHuman: { name: 'Человек-Человек', color: '#ec4899', short: 'Ч', icon: '👥' },
    manSign: { name: 'Человек-Знаковая система', color: '#f59e0b', short: 'З', icon: '📊' },
    manArt: { name: 'Человек-Искусство', color: '#8b5cf6', short: 'Х', icon: '🎨' }
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
    const [selectedSpecialties, setSelectedSpecialties] = useState([]);
    const [updatingFavorites, setUpdatingFavorites] = useState({});
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [saveFiltersDialogOpen, setSaveFiltersDialogOpen] = useState(false);
    const [filterPresets, setFilterPresets] = useState([]);
    const [newPresetName, setNewPresetName] = useState('');
    
    // Popover states
    const [klimovAnchorEl, setKlimovAnchorEl] = useState(null);
    const [cityAnchorEl, setCityAnchorEl] = useState(null);
    const [regionAnchorEl, setRegionAnchorEl] = useState(null);
    const [formAnchorEl, setFormAnchorEl] = useState(null);
    const [fundingAnchorEl, setFundingAnchorEl] = useState(null);
    const [durationAnchorEl, setDurationAnchorEl] = useState(null);
    const [educationAnchorEl, setEducationAnchorEl] = useState(null);

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
            filters: { searchTerm, selectedKlimovTypes, educationLevel, form, fundingType, city, durationRange, region, sortBy, sortOrder },
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
            prev.includes(specialtyId) ? prev.filter(id => id !== specialtyId) : [...prev, specialtyId]
        );
    };

    const handleSearch = useCallback(() => {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(() => {
            setSearchTerm(searchInput);
            setPage(1);
        }, 500);
    }, [searchInput]);

    useEffect(() => {
        handleSearch();
        return () => {
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
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

    const hasActiveFilters = () => {
        return searchTerm || selectedKlimovTypes.length > 0 || educationLevel || form || fundingType || city || durationRange !== 'all' || region;
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (searchTerm) count++;
        if (city) count++;
        if (region) count++;
        if (form) count++;
        if (fundingType) count++;
        if (durationRange !== 'all') count++;
        if (educationLevel) count++;
        count += selectedKlimovTypes.length;
        return count;
    };

    const getMatchColor = (percentage) => {
        if (percentage >= 80) return '#10b981';
        if (percentage >= 60) return '#f59e0b';
        if (percentage >= 40) return '#3b82f6';
        return '#6b7280';
    };

    const FilterChip = ({ label, icon, active, onClick, onDelete, color }) => (
        <Chip
            label={label}
            icon={icon}
            onClick={onClick}
            onDelete={active ? onDelete : undefined}
            variant={active ? "filled" : "outlined"}
            color={active ? "primary" : "default"}
            sx={{
                height: 40,
                '& .MuiChip-label': { fontWeight: 500 },
                ...(active && { bgcolor: color ? alpha(color, 0.1) : undefined })
            }}
        />
    );

    const renderFilterPopover = (anchorEl, setAnchorEl, title, children) => (
        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            PaperProps={{ sx: { p: 2, minWidth: 250, maxWidth: 350, mt: 1, borderRadius: 2 } }}
        >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>{title}</Typography>
            {children}
        </Popover>
    );

    const renderSpecialtyCard = (specialty) => {
        const isFavorite = favorites.includes(specialty._id);
        const isSelected = selectedSpecialties.includes(specialty._id);
        const collegeCount = specialty.colleges?.length || specialty.collegeNames?.length || 0;
        const years = extractYearsFromDuration(specialty.duration);
        const matchPercentage = specialty.matchPercentage || 0;
        const matchColor = getMatchColor(matchPercentage);
        
        return (
            <Card sx={{
                borderRadius: 3,
                border: `2px solid ${isSelected ? theme.palette.primary.main : 'transparent'}`,
                transition: 'all 0.3s',
                position: 'relative',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: theme.shadows[8] }
            }}>
                {user && matchPercentage > 0 && (
                    <Box sx={{
                        position: 'absolute', top: -12, right: 12,
                        px: 1.5, py: 0.5, borderRadius: 2,
                        bgcolor: matchColor, color: 'white',
                        fontSize: '0.7rem', fontWeight: 700, zIndex: 1
                    }}>
                        {matchPercentage}% совпадение
                    </Box>
                )}
                <Box sx={{ p: 2.5, flex: 1 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace', fontWeight: 600, fontSize: '0.7rem' }}>
                        {specialty.code}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.3, mt: 0.5, mb: 1 }}>
                        {specialty.name}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1.5 }}>
                        <Chip label={FORM_LABELS[specialty.form] || specialty.form} size="small" sx={{ fontSize: '0.6rem', height: 22, bgcolor: alpha('#10b981', 0.1), color: '#10b981' }} />
                        <Chip label={FUNDING_LABELS[specialty.fundingType] || specialty.fundingType} size="small" sx={{ fontSize: '0.6rem', height: 22, bgcolor: alpha('#3b82f6', 0.1), color: '#3b82f6' }} />
                        <Chip label={`${years.toFixed(1)} лет`} size="small" sx={{ fontSize: '0.6rem', height: 22, bgcolor: alpha('#6366f1', 0.1), color: '#6366f1' }} />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mb: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {specialty.description || 'Описание отсутствует'}
                    </Typography>
                    
                    <Box sx={{ mb: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', fontWeight: 500 }}>Типы деятельности:</Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                            {specialty.klimovTypes?.slice(0, 3).map((type, idx) => {
                                const typeInfo = KLIMOV_TYPES[type];
                                return typeInfo ? (
                                    <Chip key={idx} icon={<span>{typeInfo.icon}</span>} label={typeInfo.short} size="small" sx={{ fontSize: '0.55rem', height: 20, bgcolor: alpha(typeInfo.color, 0.1), color: typeInfo.color }} />
                                ) : null;
                            })}
                        </Box>
                    </Box>
                    
                    <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', fontWeight: 500 }}>Доступна в:</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5 }}>
                            <BusinessIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>{collegeCount} колледж{collegeCount > 1 ? 'ах' : 'е'}</Typography>
                        </Box>
                    </Box>
                </Box>
                
                <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
                    <Button component={Link} to={`/specialties/${specialty._id}`} variant="contained" size="small" fullWidth sx={{ fontSize: '0.7rem', py: 0.75, borderRadius: 2 }}>Подробнее</Button>
                    <IconButton size="small" onClick={() => toggleSelectSpecialty(specialty._id)} sx={{ border: '1.5px solid', borderColor: isSelected ? 'primary.main' : 'divider', width: 32, height: 32 }}>
                        <CompareIcon sx={{ color: isSelected ? theme.palette.primary.main : 'text.secondary', fontSize: 16 }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => toggleFavorite(specialty._id)} disabled={updatingFavorites[specialty._id]} sx={{ width: 32, height: 32 }}>
                        {updatingFavorites[specialty._id] ? <CircularProgress size={14} /> : isFavorite ? <BookmarkIcon sx={{ color: '#ec4899' }} /> : <BookmarkBorderIcon />}
                    </IconButton>
                </Box>
            </Card>
        );
    };

    const renderActiveFiltersChips = () => {
        if (!hasActiveFilters()) return null;
        return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {searchTerm && <Chip label={`Поиск: "${searchTerm}"`} size="small" onDelete={() => { setSearchTerm(''); setSearchInput(''); }} />}
                {city && <Chip label={`Город: ${city}`} size="small" onDelete={() => setCity('')} icon={<LocationCityIcon />} />}
                {region && <Chip label={`Регион: ${region}`} size="small" onDelete={() => setRegion('')} />}
                {form && <Chip label={`Форма: ${FORM_LABELS[form]}`} size="small" onDelete={() => setForm('')} icon={<ClassIcon />} />}
                {fundingType && <Chip label={`Финансирование: ${FUNDING_LABELS[fundingType]}`} size="small" onDelete={() => setFundingType('')} icon={<AttachMoneyIcon />} />}
                {durationRange !== 'all' && <Chip label={`Срок: ${DURATION_RANGES.find(r => r.value === durationRange)?.label}`} size="small" onDelete={() => setDurationRange('all')} icon={<AccessTimeIcon />} />}
                {educationLevel && <Chip label={`Уровень: ${educationLevel === 'SPO' ? 'СПО' : 'ВО'}`} size="small" onDelete={() => setEducationLevel('')} icon={<SchoolIcon />} />}
                {selectedKlimovTypes.map(type => (
                    <Chip key={type} label={KLIMOV_TYPES[type]?.name} size="small" onDelete={() => setSelectedKlimovTypes(prev => prev.filter(t => t !== type))} sx={{ bgcolor: alpha(KLIMOV_TYPES[type]?.color, 0.1), color: KLIMOV_TYPES[type]?.color }} />
                ))}
                <Button size="small" onClick={clearFilters} startIcon={<ClearIcon />}>Очистить все</Button>
            </Box>
        );
    };

    if (loading && page === 1) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><CircularProgress size={48} /></Box>;
    }

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', py: 4 }}>
            <Container maxWidth="xl">
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Каталог специальностей СПО</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>Найдите подходящую специальность для поступления в колледж</Typography>

                {/* Search Bar */}
                <Card sx={{ borderRadius: 3, mb: 3, p: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={5}>
                            <TextField fullWidth placeholder="Поиск по названию, коду, колледжу или городу..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                <FormControl sx={{ minWidth: 130 }} size="small">
                                    <InputLabel>Сортировка</InputLabel>
                                    <Select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }} label="Сортировка">
                                        <MenuItem value="name">По названию</MenuItem>
                                        <MenuItem value="code">По коду</MenuItem>
                                        <MenuItem value="duration">По сроку</MenuItem>
                                        <MenuItem value="collegeCount">По колледжам</MenuItem>
                                        {user && <MenuItem value="match">По совпадению</MenuItem>}
                                    </Select>
                                </FormControl>
                                <ToggleButtonGroup value={sortOrder} exclusive onChange={(e, val) => { if (val) { setSortOrder(val); setPage(1); } }} size="small">
                                    <ToggleButton value="asc"><SortIcon sx={{ transform: 'rotate(-90deg)' }} /></ToggleButton>
                                    <ToggleButton value="desc"><SortIcon sx={{ transform: 'rotate(90deg)' }} /></ToggleButton>
                                </ToggleButtonGroup>
                                {selectedSpecialties.length > 0 && (
                                    <Button variant="contained" startIcon={<CompareIcon />} component={Link} to={`/specialties/compare?ids=${selectedSpecialties.join(',')}`} sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}>Сравнить ({selectedSpecialties.length})</Button>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </Card>

                {/* Filter Chips Row */}
                <Paper sx={{ borderRadius: 3, p: 2, mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mr: 1 }}>Фильтры:</Typography>
                    
                    <Chip label="Регион" icon={<LocationCityIcon />} onClick={(e) => setRegionAnchorEl(e.currentTarget)} variant={region ? "filled" : "outlined"} color={region ? "primary" : "default"} onDelete={region ? () => setRegion('') : undefined} />
                    <Chip label="Город" icon={<LocationCityIcon />} onClick={(e) => setCityAnchorEl(e.currentTarget)} variant={city ? "filled" : "outlined"} color={city ? "primary" : "default"} onDelete={city ? () => setCity('') : undefined} />
                    <Chip label="Уровень" icon={<SchoolIcon />} onClick={(e) => setEducationAnchorEl(e.currentTarget)} variant={educationLevel ? "filled" : "outlined"} color={educationLevel ? "primary" : "default"} onDelete={educationLevel ? () => setEducationLevel('') : undefined} />
                    <Chip label="Форма" icon={<ClassIcon />} onClick={(e) => setFormAnchorEl(e.currentTarget)} variant={form ? "filled" : "outlined"} color={form ? "primary" : "default"} onDelete={form ? () => setForm('') : undefined} />
                    <Chip label="Срок" icon={<AccessTimeIcon />} onClick={(e) => setDurationAnchorEl(e.currentTarget)} variant={durationRange !== 'all' ? "filled" : "outlined"} color={durationRange !== 'all' ? "primary" : "default"} onDelete={durationRange !== 'all' ? () => setDurationRange('all') : undefined} />
                    <Chip label="Финансирование" icon={<AttachMoneyIcon />} onClick={(e) => setFundingAnchorEl(e.currentTarget)} variant={fundingType ? "filled" : "outlined"} color={fundingType ? "primary" : "default"} onDelete={fundingType ? () => setFundingType('') : undefined} />
                    <Chip label="Типы по Климову" icon={<PsychologyIcon />} onClick={(e) => setKlimovAnchorEl(e.currentTarget)} variant={selectedKlimovTypes.length > 0 ? "filled" : "outlined"} color={selectedKlimovTypes.length > 0 ? "primary" : "default"} onDelete={selectedKlimovTypes.length > 0 ? () => setSelectedKlimovTypes([]) : undefined} />
                    
                    {hasActiveFilters() && (
                        <Button size="small" onClick={clearFilters} startIcon={<ClearIcon />} sx={{ ml: 'auto' }}>Сбросить все</Button>
                    )}
                </Paper>

                {/* Active Filters Display */}
                {renderActiveFiltersChips()}

                {/* Results Count */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Найдено специальностей: <strong>{total}</strong></Typography>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                {/* Specialties Grid */}
                {specialties.length === 0 ? (
                    <Card sx={{ p: 8, textAlign: 'center' }}>
                        <SchoolIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.3 }} />
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Специальности не найдены</Typography>
                        <Button variant="contained" onClick={clearFilters}>Сбросить фильтры</Button>
                    </Card>
                ) : (
                    <>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
                            {specialties.map((specialty) => (
                                <Box key={specialty._id}>{renderSpecialtyCard(specialty)}</Box>
                            ))}
                        </Box>
                        {totalPages > 1 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                                <Pagination count={totalPages} page={page} onChange={(e, val) => { setPage(val); window.scrollTo({ top: 0, behavior: 'smooth' }); }} color="primary" size="large" showFirstButton showLastButton />
                            </Box>
                        )}
                    </>
                )}

                {/* Popovers for filters */}
                {renderFilterPopover(regionAnchorEl, setRegionAnchorEl, "Выберите регион", (
                    <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                        <Button fullWidth size="small" onClick={() => { setRegion(''); setRegionAnchorEl(null); }} sx={{ justifyContent: 'flex-start', mb: 1 }}>Все регионы</Button>
                        {filtersData.regions.map(r => <Button key={r} fullWidth size="small" onClick={() => { setRegion(r); setRegionAnchorEl(null); setPage(1); }} sx={{ justifyContent: 'flex-start' }}>{r}</Button>)}
                    </Box>
                ))}

                {renderFilterPopover(cityAnchorEl, setCityAnchorEl, "Выберите город", (
                    <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                        <Button fullWidth size="small" onClick={() => { setCity(''); setCityAnchorEl(null); }} sx={{ justifyContent: 'flex-start', mb: 1 }}>Все города</Button>
                        {filtersData.cities.map(c => <Button key={c} fullWidth size="small" onClick={() => { setCity(c); setCityAnchorEl(null); setPage(1); }} sx={{ justifyContent: 'flex-start' }}>{c}</Button>)}
                    </Box>
                ))}

                {renderFilterPopover(educationAnchorEl, setEducationAnchorEl, "Уровень образования", (
                    <Box>
                        <Button fullWidth size="small" onClick={() => { setEducationLevel(''); setEducationAnchorEl(null); }} sx={{ justifyContent: 'flex-start', mb: 1 }}>Все уровни</Button>
                        <Button fullWidth size="small" onClick={() => { setEducationLevel('SPO'); setEducationAnchorEl(null); setPage(1); }} sx={{ justifyContent: 'flex-start' }}>СПО (Среднее профессиональное)</Button>
                        <Button fullWidth size="small" onClick={() => { setEducationLevel('VO'); setEducationAnchorEl(null); setPage(1); }} sx={{ justifyContent: 'flex-start' }}>ВО (Высшее образование)</Button>
                    </Box>
                ))}

                {renderFilterPopover(formAnchorEl, setFormAnchorEl, "Форма обучения", (
                    <Box>
                        <Button fullWidth size="small" onClick={() => { setForm(''); setFormAnchorEl(null); }} sx={{ justifyContent: 'flex-start', mb: 1 }}>Все формы</Button>
                        {filtersData.forms.map(f => <Button key={f} fullWidth size="small" onClick={() => { setForm(f); setFormAnchorEl(null); setPage(1); }} sx={{ justifyContent: 'flex-start' }}>{FORM_LABELS[f]}</Button>)}
                    </Box>
                ))}

                {renderFilterPopover(durationAnchorEl, setDurationAnchorEl, "Срок обучения", (
                    <Box>
                        {DURATION_RANGES.map(d => <Button key={d.value} fullWidth size="small" onClick={() => { setDurationRange(d.value); setDurationAnchorEl(null); setPage(1); }} sx={{ justifyContent: 'flex-start' }}>{d.label}</Button>)}
                    </Box>
                ))}

                {renderFilterPopover(fundingAnchorEl, setFundingAnchorEl, "Тип финансирования", (
                    <Box>
                        <Button fullWidth size="small" onClick={() => { setFundingType(''); setFundingAnchorEl(null); }} sx={{ justifyContent: 'flex-start', mb: 1 }}>Все типы</Button>
                        {filtersData.fundingTypes.map(ft => <Button key={ft} fullWidth size="small" onClick={() => { setFundingType(ft); setFundingAnchorEl(null); setPage(1); }} sx={{ justifyContent: 'flex-start' }}>{FUNDING_LABELS[ft]}</Button>)}
                    </Box>
                ))}

                {renderFilterPopover(klimovAnchorEl, setKlimovAnchorEl, "Типы по Климову", (
                    <Box>
                        {Object.entries(KLIMOV_TYPES).map(([value, type]) => (
                            <Button key={value} fullWidth size="small" onClick={() => {
                                setSelectedKlimovTypes(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
                                setPage(1);
                            }} sx={{ justifyContent: 'flex-start', color: selectedKlimovTypes.includes(value) ? type.color : 'inherit' }}>
                                <Checkbox checked={selectedKlimovTypes.includes(value)} sx={{ p: 0.5, mr: 1, color: type.color }} />
                                <span>{type.icon}</span> <span style={{ marginLeft: 8 }}>{type.name}</span>
                            </Button>
                        ))}
                    </Box>
                ))}

                {/* Compare Bar */}
                {selectedSpecialties.length > 0 && (
                    <Paper elevation={4} sx={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, p: 2, borderRadius: 3, bgcolor: '#10b981', color: 'white', minWidth: { xs: '90%', sm: 400 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>Готовы сравнить?</Typography>
                                <Typography variant="body2">Выбрано {selectedSpecialties.length} из 3 возможных</Typography>
                            </Box>
                            <Button component={Link} to={`/specialties/compare?ids=${selectedSpecialties.join(',')}`} variant="contained" startIcon={<CompareIcon />} sx={{ bgcolor: 'white', color: '#059669', '&:hover': { bgcolor: 'grey.100' } }}>Сравнить</Button>
                        </Box>
                    </Paper>
                )}
            </Container>
        </Box>
    );
};

export default SpecialtiesPage;