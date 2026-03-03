import React from 'react';
import { Link } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Grid,
    Button,
    Paper,
    alpha,
    useTheme,
    Chip
} from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import WorkIcon from '@mui/icons-material/Work';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'; // Добавлен импорт
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InfoIcon from '@mui/icons-material/Info';

const TestSelection = () => {
    const theme = useTheme();

    const tests = [
        {
            id: 'klimov',
            title: 'Тест Климова',
            description: 'Определение профессионального типа личности',
            fullDescription: 'Методика Е.А. Климова помогает определить, к какому из пяти типов профессий вы склонны: "Человек-Природа", "Человек-Техника", "Человек-Человек", "Человек-Знаковая система", "Человек-Искусство".',
            icon: <PsychologyIcon sx={{ fontSize: 60 }} />,
            color: '#6366f1',
            questions: '40 вопросов',
            time: '10-15 минут',
            path: '/test/klimov'
        },
        {
            id: 'golomshtok',
            title: 'Карта интересов',
            description: 'Методика А.Е. Голомштока',
            fullDescription: 'Методика "Карта интересов" помогает выявить структуру интересов в различных сферах деятельности: физика, химия, электроника, механика, география, литература, история, педагогика, предпринимательство, спорт.',
            icon: <AutoStoriesIcon sx={{ fontSize: 60 }} />,
            color: '#8b5cf6',
            questions: '50 вопросов',
            time: '15-20 минут',
            path: '/test/golomshtok'
        },
        {
            id: 'holland',
            title: 'Тест Голланда',
            description: 'Типы профессиональной среды',
            fullDescription: 'Методика Дж. Голланда определяет ваш профессиональный тип: реалистичный, исследовательский, артистический, социальный, предприимчивый, конвенциональный. Помогает подобрать подходящую профессиональную среду.',
            icon: <WorkIcon sx={{ fontSize: 60 }} />,
            color: '#10b981',
            questions: '42 вопроса',
            time: '10-15 минут',
            path: '/test/holland'
        },
        {
            id: 'yovaysha',
            title: 'Тест Йовайши',
            description: 'Склонности к сферам деятельности',
            fullDescription: 'Методика Я. Йовайши выявляет склонности к различным сферам профессиональной деятельности: искусство, техника, работа с людьми, умственная работа, эстетика, физическая работа, экономика.',
            icon: <PsychologyAltIcon sx={{ fontSize: 60 }} />,
            color: '#ec4899',
            questions: '42 вопроса',
            time: '10-15 минут',
            path: '/test/yovaysha'
        },
        {
            id: 'yovayshala',
            title: 'Методика Л.А. Йовайши',
            description: 'Предпочтения в работе',
            fullDescription: 'Модифицированная методика Л.А. Йовайши определяет предпочтения в различных видах трудовой деятельности: работа с людьми, умственный труд, техническая работа, эстетическая деятельность, экстремальная деятельность, плановая деятельность.',
            icon: <PsychologyAltIcon sx={{ fontSize: 60 }} />,
            color: '#f59e0b',
            questions: '30 вопросов',
            time: '8-10 минут',
            path: '/test/yovayshala'
        },
        {
            id: 'comprehensive',
            title: 'Комплексный тест',
            description: 'Объединяет 5 методик',
            fullDescription: 'Комплексный тест включает вопросы из всех 5 методик: Климова, Голомштока, Голланда, Йовайши и Л.А. Йовайши. Позволяет получить наиболее полную картину за 15-20 минут.',
            icon: <AutoAwesomeIcon sx={{ fontSize: 60 }} />,
            color: '#764ba2',
            questions: '40 вопросов',
            time: '15-20 минут',
            path: '/test/comprehensive'
        }
    ];

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f0f4ff 0%, #f5f0ff 100%)',
            py: 8,
        }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
                        Выберите тест
                    </Typography>
                    <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
                        Пройдите профориентационные тесты, чтобы определить свои профессиональные склонности и получить рекомендации по выбору специальности
                    </Typography>
                </Box>

                <Grid container spacing={4} justifyContent="center">
                    {tests.map((test) => (
                        <Grid item xs={12} md={6} lg={4} key={test.id}>
                            <Card sx={{ 
                                borderRadius: 4,
                                height: '100%',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: `0 20px 40px ${alpha(test.color, 0.3)}`
                                }
                            }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ 
                                        width: 100,
                                        height: 100,
                                        borderRadius: '50%',
                                        backgroundColor: alpha(test.color, 0.1),
                                        color: test.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 3
                                    }}>
                                        {test.icon}
                                    </Box>
                                    
                                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, textAlign: 'center', color: test.color }}>
                                        {test.title}
                                    </Typography>
                                    
                                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                                        {test.description}
                                    </Typography>
                                    
                                    <Paper sx={{ 
                                        p: 3, 
                                        mb: 3, 
                                        backgroundColor: alpha(test.color, 0.05),
                                        border: `1px solid ${alpha(test.color, 0.2)}`,
                                        borderRadius: 3
                                    }}>
                                        <Typography variant="body2" sx={{ mb: 2 }}>
                                            {test.fullDescription}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                            <Chip 
                                                label={test.questions}
                                                size="small"
                                                sx={{ backgroundColor: alpha(test.color, 0.1), color: test.color }}
                                            />
                                            <Chip 
                                                label={test.time}
                                                size="small"
                                                sx={{ backgroundColor: alpha(test.color, 0.1), color: test.color }}
                                            />
                                        </Box>
                                    </Paper>
                                    
                                    <Button
                                        component={Link}
                                        to={test.path}
                                        fullWidth
                                        variant="contained"
                                        endIcon={<ArrowForwardIcon />}
                                        sx={{
                                            py: 1.5,
                                            backgroundColor: test.color,
                                            '&:hover': {
                                                backgroundColor: test.color,
                                                filter: 'brightness(0.9)'
                                            }
                                        }}
                                    >
                                        Пройти тест
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ mt: 8, textAlign: 'center' }}>
                    <Paper sx={{ p: 4, borderRadius: 4, backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                        <InfoIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                            Почему стоит пройти несколько тестов?
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
                            Каждый тест раскрывает разные аспекты вашей личности и профессиональных предпочтений. 
                            Комплексное тестирование дает наиболее полную картину для выбора будущей профессии 
                            и помогает подобрать наиболее подходящие специальности.
                        </Typography>
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
};

export default TestSelection;