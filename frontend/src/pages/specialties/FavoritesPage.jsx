import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    CardActionArea,
    Button,
    Chip,
    Stack,
    IconButton,
    alpha,
    useTheme,
    CircularProgress,
    Alert,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    LinearProgress
} from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import CompareIcon from '@mui/icons-material/Compare';
import SchoolIcon from '@mui/icons-material/School';
import PercentIcon from '@mui/icons-material/Percent';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { useAuth } from '../../context/AuthContext';

const KLIMOV_TYPES = {
    'manNature': { 
        name: 'Человек-Природа', 
        color: '#10b981', 
        short: 'П', 
        icon: <PsychologyIcon fontSize="small" />
    },
    'manTech': { 
        name: 'Человек-Техника', 
        color: '#3b82f6', 
        short: 'Т', 
        icon: <PsychologyIcon fontSize="small" />
    },
    'manHuman': { 
        name: 'Человек-Человек', 
        color: '#ec4899', 
        short: 'Ч', 
        icon: <PsychologyIcon fontSize="small" />
    },
    'manSign': { 
        name: 'Человек-Знаковая система', 
        color: '#f59e0b', 
        short: 'З', 
        icon: <PsychologyIcon fontSize="small" />
    },
    'manArt': { 
        name: 'Человек-Искусство', 
        color: '#8b5cf6', 
        short: 'Х', 
        icon: <PsychologyIcon fontSize="small" />
    }
};

const FavoritesPage = () => {
    const theme = useTheme();
    const { api, user } = useAuth();
    
    const [savedSpecialties, setSavedSpecialties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [compareItems, setCompareItems] = useState([]);
    const [clearDialogOpen, setClearDialogOpen] = useState(false);

    useEffect(() => {
        loadSavedSpecialties();
    }, []);

    const loadSavedSpecialties = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await api.get('/specialties/saved/list');
            
            if (response.data.success) {
                setSavedSpecialties(response.data.savedSpecialties || []);
            } else {
                setError(response.data.message);
            }
            setLoading(false);
        } catch (error) {
            setError(error.response?.data?.message || 'Ошибка загрузки избранного');
            setLoading(false);
        }
    };

    const handleRemoveFromFavorites = async (specialtyId) => {
        try {
            await api.post('/specialties/unsave', { specialtyId });
            setSavedSpecialties(prev => prev.filter(specialty => specialty._id !== specialtyId));
        } catch (error) {
            console.error('Ошибка удаления из избранного:', error);
        }
    };

    const handleAddToCompare = (specialtyId) => {
        if (compareItems.includes(specialtyId)) {
            setCompareItems(prev => prev.filter(id => id !== specialtyId));
        } else {
            if (compareItems.length >= 3) {
                setCompareItems(prev => [specialtyId, ...prev.slice(0, 2)]);
            } else {
                setCompareItems(prev => [...prev, specialtyId]);
            }
        }
    };

    const handleClearAllFavorites = async () => {
        try {
            await api.delete('/specialties/saved/clear');
            setSavedSpecialties([]);
            setClearDialogOpen(false);
        } catch (error) {
            console.error('Ошибка очистки избранного:', error);
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

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            py: 6,
        }}>
            <Container maxWidth="lg">
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
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <BookmarkIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                            <Box>
                                <Typography variant="h3" sx={{ fontWeight: 800 }}>
                                    Избранное
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {savedSpecialties.length} сохраненных специальностей
                                </Typography>
                            </Box>
                        </Box>
                        
                        {savedSpecialties.length > 0 && (
                            <Button
                                variant="outlined"
                                startIcon={<ClearAllIcon />}
                                onClick={() => setClearDialogOpen(true)}
                                sx={{
                                    color: 'error.main',
                                    borderColor: 'error.main',
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                                        borderColor: 'error.main',
                                    }
                                }}
                            >
                                Очистить все
                            </Button>
                        )}
                    </Box>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 4 }}>
                        {error}
                    </Alert>
                )}

                {savedSpecialties.length === 0 ? (
                    <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 3 }}>
                        <BookmarkBorderIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 3, opacity: 0.5 }} />
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                            В избранном пока ничего нет
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                            Сохраняйте понравившиеся специальности, чтобы вернуться к ним позже
                        </Typography>
                        <Button 
                            component={Link} 
                            to="/specialties" 
                            variant="contained"
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            }}
                        >
                            Перейти к каталогу
                        </Button>
                    </Paper>
                ) : (
                    <>
                        {compareItems.length > 0 && (
                            <Box sx={{ mb: 4, p: 3, borderRadius: 3, backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        Выбрано для сравнения: {compareItems.length} специальностей
                                    </Typography>
                                    <Button
                                        component={Link}
                                        to={`/specialties/compare?ids=${compareItems.join(',')}`}
                                        variant="contained"
                                        startIcon={<CompareIcon />}
                                        sx={{
                                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #0da271 0%, #047857 100%)',
                                            }
                                        }}
                                    >
                                        Сравнить выбранные
                                    </Button>
                                </Box>
                            </Box>
                        )}

                        <Grid container spacing={3} sx={{ mb: 6 }}>
                            {savedSpecialties.map((specialty) => {
                                const matchPercentage = specialty.matchPercentage || 0;
                                const matchColor = getMatchColor(matchPercentage);
                                const matchLabel = getMatchLabel(matchPercentage);
                                const isInCompare = compareItems.includes(specialty._id);
                                
                                return (
                                    <Grid item xs={12} sm={6} lg={4} key={specialty._id}>
                                        <Card
                                            sx={{
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                transition: 'all 0.3s ease',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                position: 'relative',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: theme.shadows[6],
                                                    borderColor: matchColor,
                                                },
                                            }}
                                        >
                                            {specialty.isRecommended && (
                                                <Box sx={{
                                                    position: 'absolute',
                                                    top: 12,
                                                    left: 12,
                                                    zIndex: 1,
                                                    bgcolor: '#10b981',
                                                    color: 'white',
                                                    px: 1.5,
                                                    py: 0.5,
                                                    borderRadius: 2,
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5
                                                }}>
                                                    <StarIcon sx={{ fontSize: 14 }} />
                                                    Рекомендовано
                                                </Box>
                                            )}
                                            
                                            <IconButton
                                                sx={{
                                                    position: 'absolute',
                                                    top: 12,
                                                    right: 12,
                                                    zIndex: 1,
                                                    bgcolor: 'white',
                                                    '&:hover': {
                                                        bgcolor: 'grey.100',
                                                    }
                                                }}
                                                onClick={() => handleRemoveFromFavorites(specialty._id)}
                                            >
                                                <BookmarkIcon sx={{ color: 'primary.main' }} />
                                            </IconButton>
                                            
                                            <CardActionArea 
                                                component={Link}
                                                to={`/specialties/${specialty._id}`}
                                                sx={{ flexGrow: 1, p: 3 }}
                                            >
                                                <CardContent sx={{ p: 0 }}>
                                                    {user && matchPercentage > 0 && (
                                                        <Box sx={{ mb: 3 }}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                                <Typography variant="body2" sx={{ fontWeight: 600, color: matchColor }}>
                                                                    <PercentIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                                                                    Совпадение: {matchPercentage}%
                                                                </Typography>
                                                                <Chip 
                                                                    label={matchLabel}
                                                                    size="small"
                                                                    sx={{ 
                                                                        bgcolor: alpha(matchColor, 0.1),
                                                                        color: matchColor,
                                                                        fontWeight: 600,
                                                                        fontSize: '0.7rem'
                                                                    }}
                                                                />
                                                            </Box>
                                                            <LinearProgress 
                                                                variant="determinate" 
                                                                value={matchPercentage}
                                                                sx={{
                                                                    height: 6,
                                                                    borderRadius: 3,
                                                                    bgcolor: alpha(matchColor, 0.1),
                                                                    '& .MuiLinearProgress-bar': {
                                                                        borderRadius: 3,
                                                                        bgcolor: matchColor
                                                                    }
                                                                }}
                                                            />
                                                            {specialty.matchReasons && specialty.matchReasons.length > 0 && (
                                                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                                                    {specialty.matchReasons.join(', ')}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    )}
                                                    
                                                    <Box sx={{ mb: 2 }}>
                                                        <Typography variant="caption" sx={{ 
                                                            color: 'text.secondary',
                                                            fontFamily: 'monospace',
                                                            fontWeight: 600,
                                                            fontSize: '0.8rem'
                                                        }}>
                                                            {specialty.code}
                                                        </Typography>
                                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                                            {specialty.name}
                                                        </Typography>
                                                    </Box>
                                                    
                                                    {specialty.description && (
                                                        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary', lineHeight: 1.6 }}>
                                                            {specialty.description.length > 120 
                                                                ? `${specialty.description.substring(0, 120)}...` 
                                                                : specialty.description}
                                                        </Typography>
                                                    )}
                                                    
                                                    {specialty.klimovTypes && specialty.klimovTypes.length > 0 && (
                                                        <Box sx={{ mb: 3 }}>
                                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                                                                Типы по Климову:
                                                            </Typography>
                                                            <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.5}>
                                                                {specialty.klimovTypes.map((type, idx) => {
                                                                    const typeInfo = KLIMOV_TYPES[type];
                                                                    const matchedType = specialty.matchedTypes?.find(t => t.type === type);
                                                                    const hasMatch = matchedType !== undefined;
                                                                    
                                                                    return (
                                                                        <Chip
                                                                            key={idx}
                                                                            size="small"
                                                                            icon={typeInfo?.icon}
                                                                            label={typeInfo?.short}
                                                                            sx={{
                                                                                bgcolor: hasMatch ? alpha(typeInfo?.color, 0.2) : alpha(typeInfo?.color, 0.1),
                                                                                color: typeInfo?.color,
                                                                                fontWeight: 600,
                                                                                border: hasMatch ? `1px solid ${typeInfo?.color}` : 'none',
                                                                                '& .MuiChip-icon': {
                                                                                    color: typeInfo?.color,
                                                                                    ml: 0.5
                                                                                }
                                                                            }}
                                                                        />
                                                                    );
                                                                })}
                                                            </Stack>
                                                        </Box>
                                                    )}
                                                    
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <AccessTimeIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                                            <Typography variant="body2" color="text.secondary">
                                                                {specialty.duration || '2-4 года'}
                                                            </Typography>
                                                        </Box>
                                                        
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <SchoolIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                                            <Typography variant="caption" color="text.secondary">
                                                                {specialty.educationLevel === 'SPO' ? 'СПО' : 'ВО'}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                            </CardActionArea>
                                            
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
                                                    onClick={() => handleAddToCompare(specialty._id)}
                                                    sx={{ 
                                                        border: '1px solid',
                                                        borderColor: isInCompare ? 'primary.main' : 'divider',
                                                        bgcolor: isInCompare ? alpha(theme.palette.primary.main, 0.1) : 'transparent'
                                                    }}
                                                >
                                                    <CompareIcon sx={{ 
                                                        color: isInCompare ? theme.palette.primary.main : 'inherit',
                                                        fontSize: 20
                                                    }} />
                                                </IconButton>
                                            </Box>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                        
                        {compareItems.length > 0 && (
                            <Box sx={{ position: 'sticky', bottom: 20, zIndex: 1000, mt: 4 }}>
                                <Paper 
                                    elevation={4}
                                    sx={{ 
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
                                                Выбрано {compareItems.length} из 3 возможных специальностей для сравнения
                                            </Typography>
                                        </Box>
                                        <Button
                                            component={Link}
                                            to={`/specialties/compare?ids=${compareItems.join(',')}`}
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
                            </Box>
                        )}
                    </>
                )}

                <Dialog open={clearDialogOpen} onClose={() => setClearDialogOpen(false)}>
                    <DialogTitle>Очистить избранное?</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1">
                            Вы уверены, что хотите удалить все {savedSpecialties.length} специальностей из избранного?
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            Это действие нельзя отменить.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setClearDialogOpen(false)}>Отмена</Button>
                        <Button 
                            onClick={handleClearAllFavorites} 
                            variant="contained" 
                            color="error"
                        >
                            Очистить все
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default FavoritesPage;