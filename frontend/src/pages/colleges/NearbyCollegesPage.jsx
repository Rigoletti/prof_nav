import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Box,
    Chip,
    CircularProgress,
    Alert,
    Paper,
    Slider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Pagination,
    alpha,
    useTheme,
    TextField,
    InputAdornment,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    Tooltip,
    Avatar,
    Badge,
    Zoom,
    Fade,
    Autocomplete,
    Stack
} from '@mui/material';
import {
    LocationOn,
    MyLocation,
    School,
    Phone,
    Email,
    Refresh,
    Search,
    Clear,
    MenuBook,
    Speed,
    NearMe,
    Edit,
    Place,
    Room,
    GpsFixed,
    GpsNotFixed,
    PinDrop,
    Directions,
    Info,
    ZoomIn
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const POPULAR_CITIES_FALLBACK = [
    'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань',
    'Нижний Новгород', 'Челябинск', 'Самара', 'Омск', 'Ростов-на-Дону',
    'Уфа', 'Красноярск', 'Воронеж', 'Пермь', 'Волгоград',
    'Краснодар', 'Саратов', 'Тюмень'
];

const NearbyCollegesPage = () => {
    const theme = useTheme();
    
    const [location, setLocation] = useState(null);
    const [locationType, setLocationType] = useState('auto');
    const [locationError, setLocationError] = useState(null);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [loadingCityName, setLoadingCityName] = useState(false);
    const [cityName, setCityName] = useState('');
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        radius: 50,
        page: 1,
        limit: 12,
        sortBy: 'distance'
    });
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        totalPages: 1
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredColleges, setFilteredColleges] = useState([]);
    
    const [manualDialogOpen, setManualDialogOpen] = useState(false);
    const [cityDialogOpen, setCityDialogOpen] = useState(false);
    const [manualCoords, setManualCoords] = useState({ lat: '', lng: '' });
    const [selectedCity, setSelectedCity] = useState('');
    const [citiesFromDb, setCitiesFromDb] = useState([]);
    const [citiesLoading, setCitiesLoading] = useState(true);

    const citySearchOptions =
        citiesFromDb.length > 0 ? citiesFromDb : POPULAR_CITIES_FALLBACK;

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(`${API_URL}/colleges?page=1&limit=1`);
                const data = await res.json();
                if (cancelled) return;
                if (data.success && Array.isArray(data.filters?.cities)) {
                    const sorted = [...data.filters.cities]
                        .filter((c) => c != null && String(c).trim())
                        .map((c) => String(c).trim())
                        .sort((a, b) => a.localeCompare(b, 'ru'));
                    setCitiesFromDb(sorted);
                }
            } catch (e) {
                console.error('Не удалось загрузить города колледжей:', e);
            } finally {
                if (!cancelled) setCitiesLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const getCityFromCoords = async (lat, lng) => {
        try {
            setLoadingCityName(true);
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ru`,
                {
                    headers: {
                        'User-Agent': 'ProfNavigator/1.0'
                    }
                }
            );
            const data = await response.json();
            
            if (data && data.address) {
                const city = data.address.city || 
                           data.address.town || 
                           data.address.village || 
                           data.address.municipality ||
                           data.address.county ||
                           'Неизвестный населенный пункт';
                setCityName(city);
                
                setLocation(prev => ({
                    ...prev,
                    name: city
                }));
            }
        } catch (error) {
            console.error('Ошибка при определении города:', error);
            setCityName('Неизвестный населенный пункт');
        } finally {
            setLoadingCityName(false);
        }
    };

    const getCurrentLocation = () => {
        setLoadingLocation(true);
        setLocationError(null);
        setLocationType('auto');

        if (!navigator.geolocation) {
            setLocationError('Ваш браузер не поддерживает геолокацию');
            setLoadingLocation(false);
            setCityDialogOpen(true);
            return;
        }

        setColleges([]);
        setFilteredColleges([]);

        const watchId = navigator.geolocation.watchPosition(
            async (position) => {
                const newLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    name: 'Определяем город...'
                };
                
                setLocation(newLocation);
                await getCityFromCoords(position.coords.latitude, position.coords.longitude);
                setLoadingLocation(false);
                setLocationError(null);
                navigator.geolocation.clearWatch(watchId);
            },
            (error) => {
                console.error('Ошибка геолокации:', error);
                let errorMessage = 'Не удалось определить местоположение';
                
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Доступ к геолокации запрещён. Выберите город или введите координаты вручную';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Информация о местоположении недоступна';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Время ожидания определения местоположения истекло';
                        break;
                }
                
                setLocationError(errorMessage);
                setLoadingLocation(false);
                setCityDialogOpen(true);
                navigator.geolocation.clearWatch(watchId);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    const getCurrentLocationWithPermission = () => {
        setLoadingLocation(true);
        setLocationError(null);
        setLocationType('auto');

        if (!navigator.geolocation) {
            setLocationError('Ваш браузер не поддерживает геолокацию');
            setLoadingLocation(false);
            setCityDialogOpen(true);
            return;
        }

        setColleges([]);
        setFilteredColleges([]);

        if (navigator.permissions && navigator.permissions.query) {
            navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const newLocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            name: 'Определяем город...'
                        };
                        
                        setLocation(newLocation);
                        await getCityFromCoords(position.coords.latitude, position.coords.longitude);
                        setLoadingLocation(false);
                    },
                    (error) => {
                        console.error('Ошибка геолокации:', error);
                        handleLocationError(error);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
                    }
                );
            });
        } else {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const newLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        name: 'Определяем город...'
                    };
                    
                    setLocation(newLocation);
                    await getCityFromCoords(position.coords.latitude, position.coords.longitude);
                    setLoadingLocation(false);
                },
                (error) => {
                    handleLocationError(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        }
    };

    const handleLocationError = (error) => {
        console.error('Ошибка геолокации:', error);
        let errorMessage = 'Не удалось определить местоположение';
        
        switch (error.code) {
            case error.PERMISSION_DENIED:
                errorMessage = 'Доступ к геолокации запрещён. Выберите город или введите координаты вручную';
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage = 'Информация о местоположении недоступна';
                break;
            case error.TIMEOUT:
                errorMessage = 'Время ожидания определения местоположения истекло';
                break;
        }
        
        setLocationError(errorMessage);
        setLoadingLocation(false);
        setCityDialogOpen(true);
    };

    const setLocationByCity = async (city) => {
        setLoadingLocation(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1&accept-language=ru`,
                {
                    headers: {
                        'User-Agent': 'ProfNavigator/1.0'
                    }
                }
            );
            const data = await response.json();
            
            if (data && data.length > 0) {
                setColleges([]);
                setFilteredColleges([]);
                
                setLocation({
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon),
                    name: city
                });
                setLocationType('city');
                setCityDialogOpen(false);
                setLocationError(null);
            } else {
                alert('Не удалось найти координаты для города ' + city);
            }
        } catch (error) {
            console.error('Ошибка при геокодировании:', error);
            alert('Ошибка при определении координат города');
        } finally {
            setLoadingLocation(false);
        }
    };

    const setManualLocation = async () => {
        const lat = parseFloat(manualCoords.lat);
        const lng = parseFloat(manualCoords.lng);
        
        if (isNaN(lat) || isNaN(lng)) {
            alert('Введите корректные координаты');
            return;
        }

        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            alert('Координаты вне допустимого диапазона');
            return;
        }

        setColleges([]);
        setFilteredColleges([]);

        setLocation({
            lat,
            lng,
            name: `Координаты: ${lat.toFixed(4)}, ${lng.toFixed(4)}`
        });
        setLocationType('manual');
        setManualDialogOpen(false);
        setLocationError(null);
        
        await getCityFromCoords(lat, lng);
    };

    const fetchNearbyColleges = async () => {
        if (!location) return;

        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams({
                lat: location.lat,
                lng: location.lng,
                radius: filters.radius,
                page: filters.page,
                limit: filters.limit
            });

            const response = await fetch(`${API_URL}/location/nearby?${params}`);
            const data = await response.json();

            if (data.success) {
                let sortedColleges = [...data.colleges];
                
                if (filters.sortBy === 'name') {
                    sortedColleges.sort((a, b) => a.name.localeCompare(b.name));
                } else if (filters.sortBy === 'specialtiesCount') {
                    sortedColleges.sort((a, b) => (b.specialties?.length || 0) - (a.specialties?.length || 0));
                }

                setColleges(sortedColleges);
                setFilteredColleges(sortedColleges);
                setPagination({
                    total: data.total,
                    page: data.page,
                    totalPages: data.totalPages
                });
            } else {
                setError('Не удалось загрузить данные');
            }
        } catch (err) {
            console.error('Ошибка загрузки:', err);
            setError('Не удалось загрузить ближайшие колледжи');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (colleges.length > 0) {
            const filtered = colleges.filter(college => 
                college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (college.city && college.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (college.address && college.address.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            setFilteredColleges(filtered);
        }
    }, [searchQuery, colleges]);

    useEffect(() => {
        if (location) {
            fetchNearbyColleges();
        }
    }, [location, filters.page, filters.radius, filters.sortBy]);

    useEffect(() => {
        getCurrentLocationWithPermission();
    }, []);

    const handleRadiusChange = (event, newValue) => {
        setFilters(prev => ({ ...prev, radius: newValue, page: 1 }));
    };

    const handleSortChange = (event) => {
        setFilters(prev => ({ ...prev, sortBy: event.target.value, page: 1 }));
    };

    const handlePageChange = (event, value) => {
        setFilters(prev => ({ ...prev, page: value }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    const getDistanceText = (distance) => {
        if (distance < 1) {
            return `${Math.round(distance * 1000)} м`;
        }
        return `${distance.toFixed(1)} км`;
    };

    const getLocationIcon = () => {
        switch (locationType) {
            case 'auto':
                return <GpsFixed />;
            case 'city':
                return <Place />;
            case 'manual':
                return <PinDrop />;
            default:
                return <GpsNotFixed />;
        }
    };

    const getLocationTypeText = () => {
        switch (locationType) {
            case 'auto':
                return 'Автоопределение';
            case 'city':
                return 'Выбран город';
            case 'manual':
                return 'Ручной ввод';
            default:
                return '';
        }
    };

    if (!location && !locationError && !loadingLocation) {
        return (
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Paper sx={{ p: 6, textAlign: 'center' }}>
                    <MyLocation sx={{ fontSize: 80, color: 'primary.main', mb: 3 }} />
                    <Typography variant="h4" gutterBottom>
                        Определение местоположения
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        Для поиска ближайших колледжей нам нужно знать ваше местоположение
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={getCurrentLocationWithPermission}
                            startIcon={<MyLocation />}
                        >
                            Определить автоматически
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => setCityDialogOpen(true)}
                            startIcon={<Place />}
                        >
                            Выбрать город
                        </Button>
                    </Box>
                </Paper>
            </Container>
        );
    }

    if (loadingLocation) {
        return (
            <Box sx={{ 
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3
            }}>
                <CircularProgress size={60} thickness={4} />
                <Typography variant="h6" color="text.secondary">
                    Определяем ваше местоположение...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', pb: 8, bgcolor: '#f5f5f5' }}>
            <Box 
                sx={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    pt: 4,
                    pb: 5,
                    mb: 4,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                        <Avatar sx={{ width: 56, height: 56, bgcolor: 'rgba(255,255,255,0.2)' }}>
                            <NearMe sx={{ fontSize: 32 }} />
                        </Avatar>
                        <Box>
                            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                                Колледжи рядом
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                {loadingCityName ? (
                                    <>Определяем город...</>
                                ) : (
                                    <>
                                        {location?.name || `${location?.lat?.toFixed(2)}, ${location?.lng?.toFixed(2)}`}
                                    </>
                                )}
                            </Typography>
                        </Box>
                    </Stack>

                    <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1 }}>
                        <Chip 
                            icon={getLocationIcon()} 
                            label={getLocationTypeText()}
                            size="small"
                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                        />
                        <Chip 
                            icon={<Refresh />} 
                            label="Обновить"
                            size="small"
                            onClick={getCurrentLocationWithPermission}
                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer' }}
                        />
                        <Chip 
                            icon={<Place />} 
                            label="Выбрать город"
                            size="small"
                            onClick={() => setCityDialogOpen(true)}
                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer' }}
                        />
                        <Chip 
                            icon={<Edit />} 
                            label="Ввести координаты"
                            size="small"
                            onClick={() => setManualDialogOpen(true)}
                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer' }}
                        />
                    </Stack>
                </Container>
            </Box>

            <Container maxWidth="lg">
                <Dialog 
                    open={cityDialogOpen} 
                    onClose={() => setCityDialogOpen(false)}
                    maxWidth="sm"
                    fullWidth
                    TransitionComponent={Zoom}
                >
                    <DialogTitle>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Place color="primary" />
                            <Typography variant="h6">Выберите город</Typography>
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <Autocomplete
                            freeSolo
                            loading={citiesLoading}
                            options={citySearchOptions}
                            value={selectedCity}
                            onChange={(event, newValue) => {
                                setSelectedCity(newValue ?? '');
                            }}
                            onInputChange={(event, newInputValue) => {
                                setSelectedCity(newInputValue);
                            }}
                            filterOptions={(opts, state) => {
                                const q = state.inputValue.trim().toLowerCase();
                                if (!q) return opts;
                                return opts.filter((o) =>
                                    o.toLowerCase().includes(q)
                                );
                            }}
                            noOptionsText={
                                citiesLoading
                                    ? 'Загрузка городов…'
                                    : 'Нет городов с таким названием'
                            }
                            ListboxProps={{ style: { maxHeight: 280 } }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder={
                                        citiesFromDb.length
                                            ? 'Поиск по городам из базы'
                                            : 'Введите название города'
                                    }
                                    sx={{ mt: 2, mb: 2 }}
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}
                        />
                        
                        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                            {citiesFromDb.length > 0
                                ? 'Города, где есть колледжи в базе:'
                                : 'Популярные города:'}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {citySearchOptions.slice(0, 16).map((city) => (
                                <Chip
                                    key={city}
                                    label={city}
                                    onClick={() => setSelectedCity(city)}
                                    sx={{ cursor: 'pointer' }}
                                />
                            ))}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setCityDialogOpen(false)}>Отмена</Button>
                        <Button 
                            onClick={() => {
                                if (selectedCity) {
                                    setLocationByCity(selectedCity);
                                }
                            }}
                            variant="contained"
                            disabled={!selectedCity}
                        >
                            Выбрать
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog 
                    open={manualDialogOpen} 
                    onClose={() => setManualDialogOpen(false)}
                    maxWidth="sm"
                    fullWidth
                    TransitionComponent={Zoom}
                >
                    <DialogTitle>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PinDrop color="primary" />
                            <Typography variant="h6">Введите координаты</Typography>
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Широта (lat)"
                                    value={manualCoords.lat}
                                    onChange={(e) => setManualCoords({ ...manualCoords, lat: e.target.value })}
                                    placeholder="55.7558"
                                    type="number"
                                    inputProps={{ step: 0.0001 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">°</InputAdornment>
                                        )
                                    }}
                                />
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                    от -90 до 90
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Долгота (lng)"
                                    value={manualCoords.lng}
                                    onChange={(e) => setManualCoords({ ...manualCoords, lng: e.target.value })}
                                    placeholder="37.6173"
                                    type="number"
                                    inputProps={{ step: 0.0001 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">°</InputAdornment>
                                        )
                                    }}
                                />
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                    от -180 до 180
                                </Typography>
                            </Grid>
                        </Grid>
                        
                        <Box sx={{ mt: 3, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Info fontSize="small" color="info" />
                                Примеры координат популярных городов:
                            </Typography>
                            <Grid container spacing={1}>
                                {citySearchOptions.slice(0, 6).map((city) => (
                                    <Grid item xs={6} sm={4} key={city}>
                                        <Chip 
                                            label={city}
                                            size="small"
                                            onClick={async () => {
                                                try {
                                                    const response = await fetch(
                                                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`,
                                                        {
                                                            headers: {
                                                                'User-Agent': 'ProfNavigator/1.0'
                                                            }
                                                        }
                                                    );
                                                    const data = await response.json();
                                                    if (data && data.length > 0) {
                                                        setManualCoords({ 
                                                            lat: data[0].lat, 
                                                            lng: data[0].lon 
                                                        });
                                                    }
                                                } catch (error) {
                                                    console.error('Ошибка:', error);
                                                }
                                            }}
                                            sx={{ 
                                                width: '100%',
                                                cursor: 'pointer',
                                                '&:hover': { bgcolor: 'primary.light', color: 'white' }
                                            }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setManualDialogOpen(false)}>Отмена</Button>
                        <Button 
                            onClick={setManualLocation}
                            variant="contained"
                            disabled={!manualCoords.lat || !manualCoords.lng}
                        >
                            Применить
                        </Button>
                    </DialogActions>
                </Dialog>

                <Paper sx={{ p: 2.5, mb: 3, borderRadius: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={5}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Speed fontSize="small" color="primary" />
                                <Typography variant="body2">
                                    Радиус поиска: <strong>{filters.radius} км</strong>
                                </Typography>
                            </Box>
                            <Slider
                                value={filters.radius}
                                onChange={handleRadiusChange}
                                min={5}
                                max={200}
                                step={5}
                                valueLabelDisplay="auto"
                                valueLabelFormat={value => `${value} км`}
                                size="small"
                            />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Сортировка</InputLabel>
                                <Select
                                    value={filters.sortBy}
                                    onChange={handleSortChange}
                                    label="Сортировка"
                                >
                                    <MenuItem value="distance">По расстоянию</MenuItem>
                                    <MenuItem value="name">По названию</MenuItem>
                                    <MenuItem value="specialtiesCount">По кол-ву специальностей</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Поиск по названию или адресу..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search fontSize="small" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: searchQuery && (
                                        <InputAdornment position="end">
                                            <IconButton size="small" onClick={clearSearch}>
                                                <Clear fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                    </Grid>
                </Paper>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress size={50} thickness={4} />
                    </Box>
                ) : error ? (
                    <Fade in>
                        <Alert 
                            severity="error" 
                            sx={{ mb: 3 }}
                            action={
                                <Button color="inherit" size="small" onClick={fetchNearbyColleges}>
                                    Повторить
                                </Button>
                            }
                        >
                            {error}
                        </Alert>
                    </Fade>
                ) : (
                    <>
                        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                Найдено: <strong>{filteredColleges.length}</strong> учебных заведений
                            </Typography>
                            
                            {filteredColleges.length === 0 && (
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => setFilters(prev => ({ ...prev, radius: prev.radius + 50 }))}
                                    startIcon={<ZoomIn />}
                                >
                                    Увеличить радиус
                                </Button>
                            )}
                        </Box>

                        <Grid container spacing={2.5}>
                            {filteredColleges.length > 0 ? (
                                filteredColleges.map((college, index) => (
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        md={4}
                                        key={college._id}
                                        sx={{ 
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Fade in timeout={300 + index * 50}>
                                            <Card 
                                                sx={{ 
                                                    width: '100%',
                                                    maxWidth: 360,
                                                    display: 'flex', 
                                                    flexDirection: 'column',
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: theme.shadows[4]
                                                    }
                                                }}
                                            >
                                                <CardContent sx={{ 
                                                    flex: 1, 
                                                    p: 2,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 1
                                                }}>
                                                    {/* Верхняя панель с расстоянием */}
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                                        <Chip
                                                            icon={<LocationOn sx={{ fontSize: 12 }} />}
                                                            label={getDistanceText(college.distance)}
                                                            size="small"
                                                            color={college.distance < 10 ? "success" : "primary"}
                                                            sx={{ 
                                                                height: 22, 
                                                                fontSize: '0.65rem',
                                                                fontWeight: 600,
                                                                '& .MuiChip-icon': { fontSize: 12, ml: 0.5 }
                                                            }}
                                                        />
                                                        {college.specialties && college.specialties.length > 0 && (
                                                            <Chip
                                                                icon={<MenuBook sx={{ fontSize: 12 }} />}
                                                                label={college.specialties.length}
                                                                size="small"
                                                                variant="outlined"
                                                                sx={{ height: 22, fontSize: '0.65rem' }}
                                                            />
                                                        )}
                                                    </Box>

                                                    {/* Название колледжа */}
                                                    <Typography
                                                        variant="subtitle2"
                                                        component="h3"
                                                        sx={{
                                                            fontWeight: 700,
                                                            fontSize: '0.9rem',
                                                            lineHeight: 1.3,
                                                            minHeight: '2.6em',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            wordBreak: 'break-word',
                                                            mb: 0.5
                                                        }}
                                                        title={college.name}
                                                    >
                                                        {college.name}
                                                    </Typography>
                                                    
                                                    {/* Город и регион */}
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <Room sx={{ fontSize: 12, color: 'text.secondary', flexShrink: 0 }} />
                                                        <Typography 
                                                            variant="caption" 
                                                            color="text.secondary" 
                                                            sx={{ 
                                                                fontSize: '0.65rem',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                                flex: 1
                                                            }}
                                                            title={`${college.city}, ${college.region}`}
                                                        >
                                                            {college.city}, {college.region}
                                                        </Typography>
                                                    </Box>

                                                    {/* Адрес */}
                                                    {college.address && college.address !== 'Адрес не указан' && (
                                                        <Typography 
                                                            variant="caption" 
                                                            sx={{ 
                                                                color: 'text.secondary', 
                                                                fontSize: '0.65rem',
                                                                lineHeight: 1.3,
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: 'vertical',
                                                                overflow: 'hidden',
                                                                minHeight: '2.6em'
                                                            }}
                                                            title={college.address}
                                                        >
                                                            📍 {college.address}
                                                        </Typography>
                                                    )}

                                                    {/* Контакты */}
                                                    <Stack spacing={0.5} sx={{ mt: 'auto' }}>
                                                        {college.phone && (
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
                                                                <Phone sx={{ fontSize: 11, color: 'success.main', flexShrink: 0 }} />
                                                                <Typography 
                                                                    variant="caption" 
                                                                    sx={{ 
                                                                        fontSize: '0.65rem',
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        whiteSpace: 'nowrap',
                                                                        flex: 1
                                                                    }}
                                                                    title={college.phone}
                                                                >
                                                                    {college.phone}
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                        {college.email && (
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
                                                                <Email sx={{ fontSize: 11, color: 'info.main', flexShrink: 0 }} />
                                                                <Typography 
                                                                    variant="caption" 
                                                                    sx={{ 
                                                                        fontSize: '0.65rem',
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        whiteSpace: 'nowrap',
                                                                        flex: 1
                                                                    }}
                                                                    title={college.email}
                                                                >
                                                                    {college.email}
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                    </Stack>

                                                    {/* Специальности */}
                                                    {college.specialties && college.specialties.length > 0 && (
                                                        <Box>
                                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.6rem' }}>
                                                                Специальности:
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                                                                {college.specialties.slice(0, 2).map((spec, idx) => (
                                                                    <Chip
                                                                        key={idx}
                                                                        label={spec.name}
                                                                        size="small"
                                                                        title={spec.name}
                                                                        sx={{
                                                                            fontSize: '0.55rem',
                                                                            height: 18,
                                                                            maxWidth: 'calc(50% - 4px)',
                                                                            backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                                                            '& .MuiChip-label': { 
                                                                                px: 0.75,
                                                                                overflow: 'hidden',
                                                                                textOverflow: 'ellipsis',
                                                                                whiteSpace: 'nowrap'
                                                                            }
                                                                        }}
                                                                    />
                                                                ))}
                                                                {college.specialties.length > 2 && (
                                                                    <Chip
                                                                        label={`+${college.specialties.length - 2}`}
                                                                        size="small"
                                                                        sx={{ fontSize: '0.55rem', height: 18, flexShrink: 0 }}
                                                                    />
                                                                )}
                                                            </Box>
                                                        </Box>
                                                    )}
                                                </CardContent>
                                                
                                                <CardActions sx={{ p: 1.5, pt: 0 }}>
                                                    <Button
                                                        fullWidth
                                                        component={RouterLink}
                                                        to={`/colleges/${college._id}`}
                                                        variant="contained"
                                                        size="small"
                                                        startIcon={<Directions sx={{ fontSize: 14 }} />}
                                                        sx={{ 
                                                            borderRadius: 1.5,
                                                            textTransform: 'none',
                                                            fontSize: '0.75rem',
                                                            py: 0.5
                                                        }}
                                                    >
                                                        Подробнее
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Fade>
                                    </Grid>
                                ))
                            ) : (
                                <Grid item xs={12}>
                                    <Fade in>
                                        <Paper sx={{ p: 6, textAlign: 'center' }}>
                                            <School sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                                            <Typography variant="h6" gutterBottom>
                                                {searchQuery ? 'Ничего не найдено' : 'Колледжи не найдены'}
                                            </Typography>
                                            <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto', fontSize: '0.9rem' }}>
                                                {searchQuery 
                                                    ? `По запросу "${searchQuery}" ничего не найдено. Попробуйте изменить поисковый запрос.`
                                                    : `В радиусе ${filters.radius} км нет колледжей. Попробуйте увеличить радиус поиска.`
                                                }
                                            </Typography>
                                            <Stack direction="row" spacing={2} justifyContent="center">
                                                {searchQuery && (
                                                    <Button 
                                                        variant="contained" 
                                                        onClick={clearSearch}
                                                        size="small"
                                                    >
                                                        Сбросить поиск
                                                    </Button>
                                                )}
                                                <Button 
                                                    variant="outlined"
                                                    onClick={() => setFilters(prev => ({ ...prev, radius: prev.radius + 50 }))}
                                                    size="small"
                                                >
                                                    Увеличить радиус
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => setCityDialogOpen(true)}
                                                    size="small"
                                                >
                                                    Выбрать город
                                                </Button>
                                            </Stack>
                                        </Paper>
                                    </Fade>
                                </Grid>
                            )}
                        </Grid>

                        {pagination.totalPages > 1 && (
                            <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
                                <Pagination
                                    count={pagination.totalPages}
                                    page={pagination.page}
                                    onChange={handlePageChange}
                                    color="primary"
                                    size="medium"
                                    showFirstButton
                                    showLastButton
                                />
                            </Box>
                        )}
                    </>
                )}
            </Container>
        </Box>
    );
};

export default NearbyCollegesPage;