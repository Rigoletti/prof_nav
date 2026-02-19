import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Grid,
    Chip,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Alert,
    CircularProgress,
    useTheme,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    alpha
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PsychologyIcon from '@mui/icons-material/Psychology';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SchoolIcon from '@mui/icons-material/School';
import PercentIcon from '@mui/icons-material/Percent';
import StarIcon from '@mui/icons-material/Star';
import { useAuth } from '../../context/AuthContext';

const KLIMOV_TYPES = {
    manNature: { name: 'Человек-Природа', color: '#10b981' },
    manTech: { name: 'Человек-Техника', color: '#3b82f6' },
    manHuman: { name: 'Человек-Человек', color: '#ec4899' },
    manSign: { name: 'Человек-Знаковая система', color: '#f59e0b' },
    manArt: { name: 'Человек-Искусство', color: '#8b5cf6' }
};

const TestHistory = () => {
    const theme = useTheme();
    const { api } = useAuth();
    const [testResults, setTestResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadTestHistory();
    }, []);

    const loadTestHistory = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await api.get('/tests/results');
            
            if (response.data.success) {
                setTestResults(response.data.testResults || []);
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Ошибка загрузки истории тестов');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getMatchColor = (percentage) => {
        if (percentage >= 80) return '#10b981';
        if (percentage >= 60) return '#f59e0b';
        if (percentage >= 40) return '#3b82f6';
        return '#6b7280';
    };

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '80vh',
                flexDirection: 'column',
                gap: 2 
            }}>
                <CircularProgress />
                <Typography variant="body2" color="text.secondary">
                    Загрузка истории тестов...
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
            <Container maxWidth="lg">
                <Box sx={{ mb: 6 }}>
                    <Button
                        component={Link}
                        to="/profile"
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            mb: 2,
                            color: 'text.secondary',
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            },
                        }}
                    >
                        В профиль
                    </Button>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <HistoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 800 }}>
                                История тестирований
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Все пройденные вами тесты
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 4 }}>
                        {error}
                    </Alert>
                )}

                {testResults.length === 0 ? (
                    <Card sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                        <PsychologyIcon sx={{ 
                            fontSize: 60, 
                            color: 'text.secondary', 
                            mb: 3, 
                            opacity: 0.5 
                        }} />
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                            Тесты еще не пройдены
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                            Пройдите тест Климова, чтобы увидеть здесь результаты
                        </Typography>
                        <Button
                            component={Link}
                            to="/test/klimov"
                            variant="contained"
                            size="large"
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                }
                            }}
                        >
                            Пройти тест Климова
                        </Button>
                    </Card>
                ) : (
                    <Stack spacing={3}>
                        {testResults.map((test, index) => {
                            const primaryType = KLIMOV_TYPES[test.primaryKlimovType];
                            
                            return (
                                <Accordion key={index} sx={{ borderRadius: 3 }}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                            <Box sx={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: '50%',
                                                backgroundColor: primaryType?.color || '#6366f1',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white'
                                            }}>
                                                <PsychologyIcon />
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                    {primaryType?.name || 'Не определен'}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {formatDate(test.date)}
                                                </Typography>
                                            </Box>
                                            <Chip 
                                                label={test.testType === 'klimov' ? 'Тест Климова' : 'Карта интересов'}
                                                color="primary"
                                                size="small"
                                                sx={{ fontWeight: 500 }}
                                            />
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} md={6}>
                                                <Card sx={{ borderRadius: 2 }}>
                                                    <CardContent>
                                                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                                            Результаты по типам
                                                        </Typography>
                                                        {test.klimovScores && (
                                                            <Stack spacing={2}>
                                                                {Object.entries(test.klimovScores)
                                                                    .sort((a, b) => b[1] - a[1])
                                                                    .map(([type, score]) => {
                                                                        const typeInfo = KLIMOV_TYPES[type];
                                                                        return (
                                                                            <Box key={type}>
                                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                                        <Box sx={{
                                                                                            width: 8,
                                                                                            height: 8,
                                                                                            borderRadius: '50%',
                                                                                            backgroundColor: typeInfo?.color || '#6366f1'
                                                                                        }} />
                                                                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                                            {typeInfo?.name || type}
                                                                                        </Typography>
                                                                                    </Box>
                                                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: typeInfo?.color || '#6366f1' }}>
                                                                                        {score}%
                                                                                    </Typography>
                                                                                </Box>
                                                                            </Box>
                                                                        );
                                                                    })}
                                                            </Stack>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                            
                                            <Grid item xs={12} md={6}>
                                                <Card sx={{ borderRadius: 2 }}>
                                                    <CardContent>
                                                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <SchoolIcon /> Рекомендованные специальности
                                                        </Typography>
                                                        
                                                        {test.recommendedSpecialties && test.recommendedSpecialties.length > 0 ? (
                                                            <Stack spacing={2}>
                                                                {test.recommendedSpecialties.slice(0, 3).map((specialty, idx) => {
                                                                    const matchColor = getMatchColor(specialty.matchPercentage);
                                                                    return (
                                                                        <Box 
                                                                            key={idx}
                                                                            sx={{ 
                                                                                p: 2, 
                                                                                borderRadius: 2,
                                                                                border: `1px solid ${alpha(matchColor, 0.2)}`,
                                                                                backgroundColor: alpha(matchColor, 0.05)
                                                                            }}
                                                                        >
                                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                                                    {specialty.name}
                                                                                </Typography>
                                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                                    <PercentIcon sx={{ fontSize: 16, color: matchColor }} />
                                                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: matchColor }}>
                                                                                        {specialty.matchPercentage}%
                                                                                    </Typography>
                                                                                </Box>
                                                                            </Box>
                                                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                                                {specialty.code} • {specialty.collegeName}
                                                                            </Typography>
                                                                            {specialty.matchReasons && specialty.matchReasons.length > 0 && (
                                                                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                                                                    {specialty.matchReasons.join(', ')}
                                                                                </Typography>
                                                                            )}
                                                                        </Box>
                                                                    );
                                                                })}
                                                                
                                                                {test.recommendedSpecialties.length > 3 && (
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        и еще {test.recommendedSpecialties.length - 3} специальностей
                                                                    </Typography>
                                                                )}
                                                            </Stack>
                                                        ) : (
                                                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                                                                Нет рекомендаций
                                                            </Typography>
                                                        )}
                                                        
                                                        <Button
                                                            component={Link}
                                                            to="/test/results"
                                                            variant="outlined"
                                                            size="small"
                                                            fullWidth
                                                            sx={{ mt: 2 }}
                                                        >
                                                            Подробнее о результатах
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            );
                        })}
                    </Stack>
                )}
            </Container>
        </Box>
    );
};

export default TestHistory;