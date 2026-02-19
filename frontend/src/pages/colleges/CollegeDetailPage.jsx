import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Box,
    Chip,
    CircularProgress,
    Alert,
    Paper,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Avatar,
    Fade,
    Grow,
    Zoom,
    useTheme,
    alpha,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    LocationOn as LocationIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Language as LanguageIcon,
    School as SchoolIcon,
    ArrowBack as ArrowBackIcon,
    Star as StarIcon,
    Share as ShareIcon,
    Bookmark as BookmarkIcon,
    BookmarkBorder as BookmarkBorderIcon,
    CalendarToday as CalendarIcon,
    CheckCircle as CheckCircleIcon,
    Apartment as ApartmentIcon,
    MenuBook as MenuBookIcon
} from '@mui/icons-material';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const API_URL = 'http://localhost:5000/api';

// Стилизованные компоненты
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: 24,
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 48px rgba(0,0,0,0.12)',
    },
}));

const SpecialtyCard = styled(Card)(({ theme }) => ({
    borderRadius: 16,
    transition: 'all 0.3s ease-in-out',
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
        borderColor: theme.palette.primary.main,
    },
}));

const InfoChip = styled(Chip)(({ theme }) => ({
    borderRadius: 12,
    fontWeight: 500,
    '& .MuiChip-icon': {
        color: theme.palette.primary.main,
    },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
    borderRadius: 12,
    marginBottom: theme.spacing(1),
    transition: 'background-color 0.2s ease',
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.04),
    },
}));

const CollegeDetailPage = () => {
    const theme = useTheme();
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [college, setCollege] = useState(null);
    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        fetchCollegeData();
    }, [id]);

    const fetchCollegeData = async () => {
        try {
            setLoading(true);
            
            const collegeRes = await fetch(`${API_URL}/colleges/${id}`);
            const collegeData = await collegeRes.json();
            
            if (collegeData.success) {
                setCollege(collegeData.college);
            } else {
                setError('Колледж не найден');
                return;
            }

            const specialtiesRes = await fetch(`${API_URL}/colleges/${id}/specialties`);
            const specialtiesData = await specialtiesRes.json();
            
            if (specialtiesData.success) {
                setSpecialties(specialtiesData.specialties);
            }
        } catch (err) {
            console.error('Ошибка:', err);
            setError('Не удалось загрузить информацию о колледже');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = () => {
        setIsSaved(!isSaved);
        // Здесь можно добавить логику сохранения в избранное
    };

    const handleShare = () => {
        // Здесь можно добавить логику шаринга
        navigator.clipboard?.writeText(window.location.href);
    };

    if (loading) {
        return (
            <Container sx={{ 
                py: 8, 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '60vh'
            }}>
                <Fade in={loading}>
                    <Box sx={{ textAlign: 'center' }}>
                        <CircularProgress size={60} thickness={4} />
                        <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
                            Загружаем информацию...
                        </Typography>
                    </Box>
                </Fade>
            </Container>
        );
    }

    if (error || !college) {
        return (
            <Container sx={{ py: 4 }}>
                <Fade in={true}>
                    <Box>
                        <Alert 
                            severity="error" 
                            sx={{ 
                                borderRadius: 3,
                                '& .MuiAlert-icon': { fontSize: 24 }
                            }}
                        >
                            {error || 'Колледж не найден'}
                        </Alert>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate('/colleges')}
                            sx={{ mt: 2 }}
                        >
                            Вернуться к списку
                        </Button>
                    </Box>
                </Fade>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Навигация и действия */}
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 3 
            }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/colleges')}
                    sx={{
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 500,
                    }}
                >
                    Назад к списку
                </Button>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Поделиться">
                        <IconButton 
                            onClick={handleShare}
                            sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                                }
                            }}
                        >
                            <ShareIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={isSaved ? "Удалить из избранного" : "Сохранить"}>
                        <IconButton 
                            onClick={handleSave}
                            sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                                },
                                color: isSaved ? theme.palette.primary.main : 'inherit'
                            }}
                        >
                            {isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* Основная информация */}
            <Grow in={true} timeout={500}>
                <StyledPaper sx={{ mb: 3, position: 'relative', overflow: 'hidden' }}>
                    {/* Декоративный элемент */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: -20,
                            right: -20,
                            width: 200,
                            height: 200,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`,
                            zIndex: 0,
                        }}
                    />
                    
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Avatar
                                sx={{
                                    width: 56,
                                    height: 56,
                                    bgcolor: theme.palette.primary.main,
                                    color: 'white',
                                }}
                            >
                                <ApartmentIcon />
                            </Avatar>
                            <Typography variant="h4" component="h1" sx={{ 
                                fontWeight: 700,
                                background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                                {college.name}
                            </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                            <InfoChip
                                icon={<LocationIcon />}
                                label={`${college.city || 'Город не указан'}, ${college.region || 'Регион не указан'}`}
                                variant="outlined"
                                size="medium"
                            />
                            {specialties.length > 0 && (
                                <InfoChip
                                    icon={<SchoolIcon />}
                                    label={`${specialties.length} специальностей`}
                                    variant="filled"
                                    color="primary"
                                    size="medium"
                                />
                            )}
                        </Box>

                        {college.description && (
                            <Box sx={{ 
                                p: 3, 
                                bgcolor: alpha(theme.palette.primary.main, 0.03),
                                borderRadius: 3,
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                            }}>
                                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                                    {college.description}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </StyledPaper>
            </Grow>

            <Grid container spacing={3}>
                {/* Контакты */}
                <Grid item xs={12} md={5}>
                    <Zoom in={true} timeout={600}>
                        <StyledPaper sx={{ height: '100%' }}>
                            <Typography variant="h6" gutterBottom sx={{ 
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <PhoneIcon color="primary" />
                                Контактная информация
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                            
                            <List sx={{ p: 0 }}>
                                {college.address && college.address !== 'Адрес не указан' && (
                                    <StyledListItem>
                                        <ListItemIcon>
                                            <Avatar sx={{ 
                                                width: 32, 
                                                height: 32, 
                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                color: theme.palette.primary.main
                                            }}>
                                                <LocationIcon sx={{ fontSize: 18 }} />
                                            </Avatar>
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary="Адрес"
                                            secondary={college.address}
                                            primaryTypographyProps={{ fontWeight: 500 }}
                                        />
                                    </StyledListItem>
                                )}
                                {college.phone && (
                                    <StyledListItem>
                                        <ListItemIcon>
                                            <Avatar sx={{ 
                                                width: 32, 
                                                height: 32, 
                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                color: theme.palette.primary.main
                                            }}>
                                                <PhoneIcon sx={{ fontSize: 18 }} />
                                            </Avatar>
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary="Телефон"
                                            secondary={
                                                <a 
                                                    href={`tel:${college.phone}`}
                                                    style={{ 
                                                        color: 'inherit', 
                                                        textDecoration: 'none',
                                                        '&:hover': { textDecoration: 'underline' }
                                                    }}
                                                >
                                                    {college.phone}
                                                </a>
                                            }
                                            primaryTypographyProps={{ fontWeight: 500 }}
                                        />
                                    </StyledListItem>
                                )}
                                {college.email && (
                                    <StyledListItem>
                                        <ListItemIcon>
                                            <Avatar sx={{ 
                                                width: 32, 
                                                height: 32, 
                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                color: theme.palette.primary.main
                                            }}>
                                                <EmailIcon sx={{ fontSize: 18 }} />
                                            </Avatar>
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary="Email"
                                            secondary={
                                                <a 
                                                    href={`mailto:${college.email}`}
                                                    style={{ 
                                                        color: 'inherit', 
                                                        textDecoration: 'none',
                                                        '&:hover': { textDecoration: 'underline' }
                                                    }}
                                                >
                                                    {college.email}
                                                </a>
                                            }
                                            primaryTypographyProps={{ fontWeight: 500 }}
                                        />
                                    </StyledListItem>
                                )}
                                {college.website && (
                                    <StyledListItem>
                                        <ListItemIcon>
                                            <Avatar sx={{ 
                                                width: 32, 
                                                height: 32, 
                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                color: theme.palette.primary.main
                                            }}>
                                                <LanguageIcon sx={{ fontSize: 18 }} />
                                            </Avatar>
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary="Сайт"
                                            secondary={
                                                <a 
                                                    href={college.website.startsWith('http') ? college.website : `https://${college.website}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ 
                                                        color: theme.palette.primary.main, 
                                                        textDecoration: 'none',
                                                        fontWeight: 500,
                                                        '&:hover': { textDecoration: 'underline' }
                                                    }}
                                                >
                                                    {college.website.replace(/^https?:\/\//, '')}
                                                </a>
                                            }
                                            primaryTypographyProps={{ fontWeight: 500 }}
                                        />
                                    </StyledListItem>
                                )}
                            </List>

                            {/* Дополнительная информация */}
                            <Box sx={{ 
                                mt: 3, 
                                p: 2, 
                                bgcolor: alpha(theme.palette.success.main, 0.05),
                                borderRadius: 2,
                                border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`
                            }}>
                                <Typography variant="subtitle2" sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 1,
                                    color: theme.palette.success.main,
                                    fontWeight: 600
                                }}>
                                    <CheckCircleIcon fontSize="small" />
                                    Преимущества колледжа
                                </Typography>
                                <List dense>
                                    <ListItem>
                                        <ListItemIcon sx={{ minWidth: 30 }}>
                                            <StarIcon sx={{ fontSize: 16, color: theme.palette.warning.main }} />
                                        </ListItemIcon>
                                        <ListItemText secondary="Государственная аккредитация" />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon sx={{ minWidth: 30 }}>
                                            <StarIcon sx={{ fontSize: 16, color: theme.palette.warning.main }} />
                                        </ListItemIcon>
                                        <ListItemText secondary="Современная материально-техническая база" />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon sx={{ minWidth: 30 }}>
                                            <StarIcon sx={{ fontSize: 16, color: theme.palette.warning.main }} />
                                        </ListItemIcon>
                                        <ListItemText secondary="Квалифицированный преподавательский состав" />
                                    </ListItem>
                                </List>
                            </Box>
                        </StyledPaper>
                    </Zoom>
                </Grid>

                {/* Специальности */}
                <Grid item xs={12} md={7}>
                    <Zoom in={true} timeout={700}>
                        <StyledPaper>
                            <Typography variant="h6" gutterBottom sx={{ 
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <MenuBookIcon color="primary" />
                                Специальности
                                {specialties.length > 0 && (
                                    <Chip 
                                        label={specialties.length}
                                        size="small"
                                        color="primary"
                                        sx={{ ml: 1 }}
                                    />
                                )}
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                            
                            {specialties.length > 0 ? (
                                <Grid container spacing={2}>
                                    {specialties.map((specialty, index) => (
                                        <Grid item xs={12} key={specialty._id}>
                                            <Fade in={true} timeout={500 + index * 100}>
                                                <SpecialtyCard>
                                                    <CardContent>
                                                        <Typography variant="h6" fontWeight={600} gutterBottom>
                                                            {specialty.name}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                                                            {specialty.code && (
                                                                <Chip 
                                                                    label={`Код: ${specialty.code}`}
                                                                    size="small"
                                                                    variant="outlined"
                                                                    sx={{ borderRadius: 2 }}
                                                                />
                                                            )}
                                                            {specialty.duration && (
                                                                <Chip 
                                                                    icon={<CalendarIcon />}
                                                                    label={`Срок обучения: ${specialty.duration}`}
                                                                    size="small"
                                                                    color="primary"
                                                                    variant="outlined"
                                                                    sx={{ borderRadius: 2 }}
                                                                />
                                                            )}
                                                            {specialty.form && (
                                                                <Chip 
                                                                    label={`Форма: ${specialty.form}`}
                                                                    size="small"
                                                                    variant="outlined"
                                                                    sx={{ borderRadius: 2 }}
                                                                />
                                                            )}
                                                        </Box>
                                                        {specialty.description && (
                                                            <Typography variant="body2" color="text.secondary" sx={{ 
                                                                mt: 1,
                                                                lineHeight: 1.7
                                                            }}>
                                                                {specialty.description}
                                                            </Typography>
                                                        )}
                                                    </CardContent>
                                                </SpecialtyCard>
                                            </Fade>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Box sx={{ 
                                    textAlign: 'center', 
                                    py: 6,
                                    bgcolor: alpha(theme.palette.grey[500], 0.05),
                                    borderRadius: 3
                                }}>
                                    <SchoolIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                    <Typography color="text.secondary">
                                        Специальности не указаны
                                    </Typography>
                                </Box>
                            )}
                        </StyledPaper>
                    </Zoom>
                </Grid>
            </Grid>

            {/* Кнопка подачи заявления */}
            <Box sx={{ 
                mt: 4, 
                display: 'flex', 
                justifyContent: 'center',
                position: 'sticky',
                bottom: 20,
                zIndex: 10
            }}>
                <Button
                    variant="contained"
                    size="large"
                    sx={{
                        borderRadius: 4,
                        px: 6,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                        '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: `0 12px 28px ${alpha(theme.palette.primary.main, 0.5)}`,
                        },
                        transition: 'all 0.3s ease'
                    }}
                >
                    Подать заявление
                </Button>
            </Box>
        </Container>
    );
};

export default CollegeDetailPage;