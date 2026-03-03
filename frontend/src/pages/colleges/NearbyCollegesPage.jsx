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
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Tooltip,
    Avatar,
    Badge,
    Zoom,
    Fade,
    Autocomplete
} from '@mui/material';
import {
    LocationOn,
    MyLocation,
    School,
    Phone,
    Email,
    Language,
    Refresh,
    Error as ErrorIcon,
    Search,
    Clear,
    AccountBalance,
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

// Небольшой список популярных городов для быстрого выбора
const POPULAR_CITIES = [
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
    
    // Состояния для диалогов
    const [manualDialogOpen, setManualDialogOpen] = useState(false);
    const [cityDialogOpen, setCityDialogOpen] = useState(false);
    const [manualCoords, setManualCoords] = useState({ lat: '', lng: '' });
    const [selectedCity, setSelectedCity] = useState('');

    // Функция для получения названия города по координатам (обратное геокодирование)
    const getCityFromCoords = async (lat, lng) => {
        try {
            setLoadingCityName(true);
            // Используем Nominatim API (OpenStreetMap) для обратного геокодирования
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
                // Пробуем получить город из разных полей
                const city = data.address.city || 
                           data.address.town || 
                           data.address.village || 
                           data.address.municipality ||
                           data.address.county ||
                           'Неизвестный населенный пункт';
                setCityName(city);
                
                // Обновляем название местоположения
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

    // Получение текущего местоположения с принудительным обновлением
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

        // Очищаем старые данные
        setColleges([]);
        setFilteredColleges([]);

        // Используем watchPosition для принудительного получения новых координат
        const watchId = navigator.geolocation.watchPosition(
            async (position) => {
                const newLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    name: 'Определяем город...'
                };
                console.log('Получены новые координаты:', newLocation);
                
                setLocation(newLocation);
                
                // Получаем название города по координатам
                await getCityFromCoords(position.coords.latitude, position.coords.longitude);
                
                setLoadingLocation(false);
                setLocationError(null);
                
                // Останавливаем watch после получения координат
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
                // Предлагаем выбрать город
                setCityDialogOpen(true);
                
                // Останавливаем watch в случае ошибки
                navigator.geolocation.clearWatch(watchId);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0  // 0 - не использовать кэшированные данные
            }
        );
    };

    // Альтернативный метод с проверкой разрешений
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

        // Очищаем старые данные
        setColleges([]);
        setFilteredColleges([]);

        // Проверяем, поддерживается ли API permissions
        if (navigator.permissions && navigator.permissions.query) {
            navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
                console.log('Статус разрешения геолокации:', permissionStatus.state);
                
                // Всегда запрашиваем новые координаты, независимо от статуса
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const newLocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            name: 'Определяем город...'
                        };
                        console.log('Получены новые координаты:', newLocation);
                        
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
            // Если API permissions не поддерживается, просто запрашиваем
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const newLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        name: 'Определяем город...'
                    };
                    console.log('Получены новые координаты:', newLocation);
                    
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

    // Обработка ошибок геолокации
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

    // Установка местоположения по выбранному городу
    const setLocationByCity = async (city) => {
        setLoadingLocation(true);
        try {
            // Геокодирование - получаем координаты по названию города
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
                // Сбрасываем старые данные
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

    // Установка местоположения по ручным координатам
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

        // Сбрасываем старые данные
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
        
        // Пытаемся определить город по координатам
        await getCityFromCoords(lat, lng);
    };

    // Загрузка ближайших колледжей
    const fetchNearbyColleges = async () => {
        if (!location) return;

        try {
            setLoading(true);
            setError(null);

            console.log('Загрузка колледжей для координат:', location);

            const params = new URLSearchParams({
                lat: location.lat,
                lng: location.lng,
                radius: filters.radius,
                page: filters.page,
                limit: filters.limit
            });

            const response = await fetch(`${API_URL}/location/nearby?${params}`);
            const data = await response.json();

            console.log('Ответ от сервера:', data);

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

    // Поиск по колледжам
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

    // Загрузка при изменении местоположения или фильтров
    useEffect(() => {
        if (location) {
            fetchNearbyColleges();
        }
    }, [location, filters.page, filters.radius, filters.sortBy]);

    // Автоматическое определение местоположения при загрузке страницы
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
        return `${distance} км`;
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

    // Если местоположение не определено и нет ошибки
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
        <Box sx={{ minHeight: '100vh', pb: 8 }}>
            {/* Hero секция */}
            <Box 
                sx={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    pt: 6,
                    pb: 8,
                    mb: 4,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                    }
                }}
            >
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                                <Tooltip title={getLocationTypeText()}>
                                    <Avatar sx={{ width: 24, height: 24, bgcolor: 'white' }}>
                                        {getLocationIcon()}
                                    </Avatar>
                                </Tooltip>
                            }
                        >
                            <Avatar sx={{ width: 64, height: 64, bgcolor: 'rgba(255,255,255,0.2)' }}>
                                <NearMe sx={{ fontSize: 32 }} />
                            </Avatar>
                        </Badge>
                        <Box>
                            <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
                                Колледжи рядом с вами
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9, mt: 1 }}>
                                {loadingCityName ? (
                                    <>Определяем город...</>
                                ) : (
                                    <>
                                        {location?.name || `${location?.lat?.toFixed(4)}, ${location?.lng?.toFixed(4)}`}
                                    </>
                                )}
                            </Typography>
                        </Box>
                    </Box>

                    <Paper sx={{ 
                        p: 2, 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: 2, 
                        bgcolor: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 3,
                        flexWrap: 'wrap',
                        mt: 2
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {getLocationIcon()}
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {loadingCityName ? 'Определение...' : (location?.name || `${location?.lat?.toFixed(4)}, ${location?.lng?.toFixed(4)}`)}
                                </Typography>
                            </Box>
                            <Chip 
                                label={getLocationTypeText()}
                                size="small"
                                sx={{ 
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    '& .MuiChip-label': { px: 1 }
                                }}
                            />
                        </Box>
                        <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Определить автоматически заново">
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<Refresh />}
                                    onClick={getCurrentLocationWithPermission}
                                    sx={{ 
                                        color: 'white', 
                                        borderColor: 'rgba(255,255,255,0.5)',
                                        '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                                    }}
                                >
                                    Обновить
                                </Button>
                            </Tooltip>
                            <Tooltip title="Выбрать город">
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<Place />}
                                    onClick={() => setCityDialogOpen(true)}
                                    sx={{ 
                                        color: 'white', 
                                        borderColor: 'rgba(255,255,255,0.5)',
                                        '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                                    }}
                                >
                                    Город
                                </Button>
                            </Tooltip>
                            <Tooltip title="Ввести координаты">
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<Edit />}
                                    onClick={() => setManualDialogOpen(true)}
                                    sx={{ 
                                        color: 'white', 
                                        borderColor: 'rgba(255,255,255,0.5)',
                                        '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                                    }}
                                >
                                    Координаты
                                </Button>
                            </Tooltip>
                        </Box>
                    </Paper>
                </Container>
            </Box>

            <Container maxWidth="lg">
                {/* Диалог выбора города */}
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
                            options={POPULAR_CITIES}
                            value={selectedCity}
                            onChange={(event, newValue) => {
                                setSelectedCity(newValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Введите название города"
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
                            Популярные города:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {POPULAR_CITIES.slice(0, 10).map((city) => (
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

                {/* Диалог ручного ввода координат */}
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
                                {POPULAR_CITIES.slice(0, 6).map((city) => (
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

                {/* Фильтры */}
                <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Speed color="primary" />
                                <Typography variant="body2" color="text.secondary">
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
                                sx={{
                                    color: 'primary.main',
                                    '& .MuiSlider-thumb': {
                                        '&:hover, &.Mui-focusVisible': {
                                            boxShadow: `0 0 0 8px ${alpha(theme.palette.primary.main, 0.16)}`
                                        }
                                    }
                                }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">5 км</Typography>
                                <Typography variant="caption" color="text.secondary">200 км</Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Сортировка</InputLabel>
                                <Select
                                    value={filters.sortBy}
                                    onChange={handleSortChange}
                                    label="Сортировка"
                                >
                                    <MenuItem value="distance">По расстоянию (ближе)</MenuItem>
                                    <MenuItem value="name">По названию (А-Я)</MenuItem>
                                    <MenuItem value="specialtiesCount">По количеству специальностей</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                placeholder="Поиск по названию или адресу..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search color="primary" />
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

                {/* Результаты */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
                        <CircularProgress size={60} thickness={4} />
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
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography variant="h6">
                                    Найдено: <strong>{filteredColleges.length}</strong> {filteredColleges.length === 1 ? 'колледж' : 
                                    filteredColleges.length > 1 && filteredColleges.length < 5 ? 'колледжа' : 'колледжей'}
                                </Typography>
                                {filteredColleges.length > 0 && (
                                    <Chip
                                        icon={<LocationOn />}
                                        label={`в радиусе ${filters.radius} км`}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                    />
                                )}
                            </Box>
                            
                            {filteredColleges.length === 0 && (
                                <Button
                                    variant="contained"
                                    onClick={() => setFilters(prev => ({ ...prev, radius: prev.radius + 50 }))}
                                    startIcon={<ZoomIn />}
                                >
                                    Увеличить радиус до {filters.radius + 50} км
                                </Button>
                            )}
                        </Box>

                        <Grid container spacing={3}>
                            {filteredColleges.length > 0 ? (
                                filteredColleges.map((college, index) => (
                                    <Grid item xs={12} md={6} lg={4} key={college._id}>
                                        <Fade in timeout={500 + index * 100}>
                                            <Card 
                                                sx={{ 
                                                    height: '100%', 
                                                    display: 'flex', 
                                                    flexDirection: 'column',
                                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                                    '&:hover': {
                                                        transform: 'translateY(-4px)',
                                                        boxShadow: theme.shadows[10]
                                                    }
                                                }}
                                            >
                                                <CardContent sx={{ flex: 1 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                        <Tooltip title={`Расстояние: ${getDistanceText(college.distance)}`}>
                                                            <Chip
                                                                icon={<LocationOn />}
                                                                label={getDistanceText(college.distance)}
                                                                size="small"
                                                                color={college.distance < 10 ? "success" : college.distance < 30 ? "primary" : "default"}
                                                                sx={{ fontWeight: 600 }}
                                                            />
                                                        </Tooltip>
                                                        {college.specialties && college.specialties.length > 0 && (
                                                            <Tooltip title="Количество специальностей">
                                                                <Chip
                                                                    icon={<MenuBook />}
                                                                    label={college.specialties.length}
                                                                    size="small"
                                                                    variant="outlined"
                                                                />
                                                            </Tooltip>
                                                        )}
                                                    </Box>

                                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, lineHeight: 1.3 }}>
                                                        {college.name}
                                                    </Typography>
                                                    
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                        <Room color="action" fontSize="small" />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {college.city}, {college.region}
                                                        </Typography>
                                                    </Box>

                                                    {college.address && college.address !== 'Адрес не указан' && (
                                                        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', fontSize: '0.9rem' }}>
                                                            📍 {college.address}
                                                        </Typography>
                                                    )}

                                                    {college.phone && (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                            <Phone fontSize="small" color="success" />
                                                            <Typography variant="body2">{college.phone}</Typography>
                                                        </Box>
                                                    )}

                                                    {college.email && (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                            <Email fontSize="small" color="info" />
                                                            <Typography variant="body2">{college.email}</Typography>
                                                        </Box>
                                                    )}

                                                    {college.specialties && college.specialties.length > 0 && (
                                                        <Box sx={{ mt: 2 }}>
                                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                                                Специальности:
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                                                                {college.specialties.slice(0, 3).map((spec, idx) => (
                                                                    <Chip
                                                                        key={idx}
                                                                        label={spec.name}
                                                                        size="small"
                                                                        sx={{
                                                                            fontSize: '0.7rem',
                                                                            backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                                                            color: theme.palette.primary.main
                                                                        }}
                                                                    />
                                                                ))}
                                                                {college.specialties.length > 3 && (
                                                                    <Chip
                                                                        label={`+${college.specialties.length - 3}`}
                                                                        size="small"
                                                                        sx={{ fontSize: '0.7rem' }}
                                                                    />
                                                                )}
                                                            </Box>
                                                        </Box>
                                                    )}
                                                </CardContent>
                                                
                                                <CardActions sx={{ p: 2, pt: 0 }}>
                                                    <Button
                                                        fullWidth
                                                        component={RouterLink}
                                                        to={`/colleges/${college._id}`}
                                                        variant="contained"
                                                        startIcon={<Directions />}
                                                        sx={{ 
                                                            borderRadius: 2,
                                                            textTransform: 'none'
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
                                        <Paper sx={{ p: 8, textAlign: 'center' }}>
                                            <School sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                                                {searchQuery ? 'Ничего не найдено' : 'Колледжи не найдены'}
                                            </Typography>
                                            <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                                                {searchQuery 
                                                    ? `По запросу "${searchQuery}" ничего не найдено. Попробуйте изменить поисковый запрос.`
                                                    : `В радиусе ${filters.radius} км от выбранного местоположения нет колледжей. Попробуйте увеличить радиус поиска или выбрать другой город.`
                                                }
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                                                {searchQuery && (
                                                    <Button 
                                                        variant="contained" 
                                                        onClick={clearSearch}
                                                        startIcon={<Clear />}
                                                    >
                                                        Сбросить поиск
                                                    </Button>
                                                )}
                                                <Button 
                                                    variant={searchQuery ? "outlined" : "contained"}
                                                    onClick={() => setFilters(prev => ({ ...prev, radius: prev.radius + 50 }))}
                                                    startIcon={<ZoomIn />}
                                                >
                                                    Увеличить радиус до {filters.radius + 50} км
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => setCityDialogOpen(true)}
                                                    startIcon={<Place />}
                                                >
                                                    Выбрать другой город
                                                </Button>
                                            </Box>
                                        </Paper>
                                    </Fade>
                                </Grid>
                            )}
                        </Grid>

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
        </Box>
    );
};

export default NearbyCollegesPage;