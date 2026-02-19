import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Stack,
  alpha,
  useTheme,
  Paper,
  Divider
} from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import SchoolIcon from '@mui/icons-material/School';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import ExploreIcon from '@mui/icons-material/Explore';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import RouteIcon from '@mui/icons-material/Route';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Home = () => {
  const theme = useTheme();

  const klimovTypes = [
    {
      title: 'Человек-Природа',
      subtitle: 'Агроном · Ветеринар · Эколог',
      description: 'Работа с живой и неживой природой, растениями, животными',
      icon: '🌿',
      color: '#10b981',
      professions: ['Агроном', 'Ветеринар', 'Эколог', 'Технолог пищевой промышленности', 'Лесник'],
    },
    {
      title: 'Человек-Техника',
      subtitle: 'Инженер · Программист · Строитель',
      description: 'Работа с механизмами, приборами, техническими системами',
      icon: '🔧',
      color: '#3b82f6',
      professions: ['Инженер', 'Программист', 'Автомеханик', 'Электрик', 'Строитель'],
    },
    {
      title: 'Человек-Человек',
      subtitle: 'Учитель · Врач · Психолог',
      description: 'Работа с людьми, общение, обучение, обслуживание',
      icon: '👥',
      color: '#ec4899',
      professions: ['Учитель', 'Врач', 'Психолог', 'Менеджер по продажам', 'Социальный работник'],
    },
    {
      title: 'Человек-Знаковая система',
      subtitle: 'Бухгалтер · Программист · Переводчик',
      description: 'Работа с цифрами, формулами, чертежами, языками',
      icon: '📊',
      color: '#f59e0b',
      professions: ['Бухгалтер', 'Программист', 'Переводчик', 'Архитектор', 'Экономист'],
    },
    {
      title: 'Человек-Искусство',
      subtitle: 'Дизайнер · Художник · Архитектор',
      description: 'Творческая работа, создание художественных образов',
      icon: '🎨',
      color: '#8b5cf6',
      professions: ['Дизайнер', 'Художник', 'Архитектор', 'Фотограф', 'Модельер'],
    },
  ];

  const testFeatures = [
    {
      icon: <AssessmentIcon />,
      title: 'Научные методики',
      description: 'Тесты основаны на классификации Климова и карте интересов Голомштока',
      color: '#6366f1'
    },
    {
      icon: <AccessTimeIcon />,
      title: '25-35 минут',
      description: 'Два теста для полного анализа ваших склонностей',
      color: '#10b981'
    },
    {
      icon: <PersonSearchIcon />,
      title: 'Персонализация',
      description: 'Индивидуальные рекомендации специальностей СПО',
      color: '#ec4899'
    },
    {
      icon: <SchoolIcon />,
      title: 'Конкретные советы',
      description: 'Список подходящих колледжей и специальностей',
      color: '#f59e0b'
    },
  ];

  const availableTests = [
    {
      title: 'Тест Климова',
      description: 'Определение профессионального типа личности',
      longDescription: 'Методика Е.А. Климова помогает определить, к какому из пяти типов профессий вы склонны. Это базовая классификация, которая лежит в основе профориентации.',
      icon: <PsychologyIcon sx={{ fontSize: 40 }} />,
      color: '#6366f1',
      path: '/test/klimov',
      time: '10-15 минут',
      questions: '40 вопросов'
    },
    {
      title: 'Карта интересов',
      description: 'Методика А.Е. Голомштока',
      longDescription: 'Более детальный тест, который выявляет ваши интересы в 10 различных сферах: от физики до спорта. Позволяет точнее подобрать специальность.',
      icon: <AutoStoriesIcon sx={{ fontSize: 40 }} />,
      color: '#8b5cf6',
      path: '/test/golomshtok',
      time: '15-20 минут',
      questions: '50 вопросов'
    }
  ];

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #f0f4ff 0%, #fdf2f8 100%)',
          pt: { xs: 8, md: 12 },
          pb: { xs: 12, md: 18 },
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Chip
                label="Профориентация для СПО"
                sx={{
                  mb: 3,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.dark,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  py: 1,
                }}
              />
              
              <Typography
                variant="h1"
                sx={{
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                  lineHeight: 1.1,
                }}
              >
                Найдите профессию,
                <br />
                которая подходит{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline',
                  }}
                >
                  именно вам
                </Box>
              </Typography>
              
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  color: 'text.secondary',
                  fontWeight: 400,
                  lineHeight: 1.6,
                }}
              >
                Два научно обоснованных теста: классификация Климова и карта интересов Голомштока.
                Получите персональные рекомендации специальностей в колледжах.
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  component={Link}
                  to="/test"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    },
                  }}
                >
                  Выбрать тест
                </Button>
                
                <Button
                  component={Link}
                  to="/specialties"
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                    },
                  }}
                >
                  Смотреть специальности
                </Button>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  height: { xs: 500, md: 550 },
                }}
              >
                <Card
                  sx={{
                    position: 'relative',
                    zIndex: 2,
                    p: 4,
                    borderRadius: 4,
                    background: 'white',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    border: '1px solid',
                    borderColor: 'grey.200',
                  }}
                >
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, textAlign: 'center' }}>
                    Выберите свой путь
                  </Typography>
                  
                  <Grid container spacing={3}>
                    {availableTests.map((test, index) => (
                      <Grid item xs={12} key={index}>
                        <Paper
                          component={Link}
                          to={test.path}
                          sx={{
                            p: 3,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            textDecoration: 'none',
                            color: 'inherit',
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: alpha(test.color, 0.3),
                            transition: 'all 0.3s',
                            '&:hover': {
                              transform: 'translateX(8px)',
                              borderColor: test.color,
                              boxShadow: `0 4px 12px ${alpha(test.color, 0.2)}`,
                            }
                          }}
                        >
                          <Avatar sx={{ bgcolor: alpha(test.color, 0.1), color: test.color, width: 56, height: 56 }}>
                            {test.icon}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: test.color }}>
                              {test.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {test.description}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
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
                          </Box>
                          <ArrowForwardIcon sx={{ color: test.color }} />
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                  
                  <Divider sx={{ my: 3 }}>
                    <Chip label="или" size="small" />
                  </Divider>
                  
                  <Button
                    component={Link}
                    to="/specialties"
                    fullWidth
                    variant="outlined"
                    sx={{ py: 1.5 }}
                  >
                    Смотреть все специальности
                  </Button>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" sx={{ mb: 3 }}>
              Почему наши тесты эффективны?
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 800, mx: 'auto' }}>
              Мы используем две научно обоснованные методики для максимально точного результата
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {testFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ height: '100%', borderRadius: 3, p: 3 }}>
                  <Avatar sx={{ bgcolor: alpha(feature.color, 0.1), color: feature.color, mb: 3 }}>
                    {feature.icon}
                  </Avatar>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Klimov Types Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" sx={{ mb: 3 }}>
              5 типов профессий по Климову
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 800, mx: 'auto' }}>
              Классификация помогает определить, с каким предметом труда вам комфортнее работать
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            {klimovTypes.map((type, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    border: '1px solid',
                    borderColor: 'grey.200',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8],
                      borderColor: type.color,
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Box sx={{ fontSize: '2.5rem' }}>{type.icon}</Box>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: type.color }}>
                          {type.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: type.color, fontWeight: 600 }}>
                          {type.subtitle}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                      {type.description}
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                        Примеры профессий:
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                        {type.professions.map((prof, idx) => (
                          <Chip
                            key={idx}
                            label={prof}
                            size="small"
                            sx={{
                              backgroundColor: alpha(type.color, 0.1),
                              color: type.color,
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                    
                    <Button
                      component={Link}
                      to="/test/klimov"
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: type.color,
                        color: type.color,
                        '&:hover': {
                          backgroundColor: alpha(type.color, 0.1),
                        },
                      }}
                    >
                      Пройти тест Климова
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Golomshtok Section */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" sx={{ mb: 3 }}>
                Карта интересов
                <Box component="span" sx={{ display: 'block', fontSize: '1.5rem', color: 'text.secondary', mt: 1 }}>
                  Методика А.Е. Голомштока
                </Box>
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', fontSize: '1.1rem', lineHeight: 1.8 }}>
                Более детальная методика, которая оценивает ваши интересы в 10 различных сферах деятельности:
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 4 }}>
                {[
                  'Физика и математика',
                  'Химия и биология',
                  'Радиотехника и электроника',
                  'Механика и конструирование',
                  'География и геология',
                  'Литература и искусство',
                  'История и политика',
                  'Педагогика и медицина',
                  'Предпринимательство',
                  'Спорт и военное дело'
                ].map((item, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        bgcolor: index < 3 ? '#3b82f6' : index < 6 ? '#8b5cf6' : '#ec4899' 
                      }} />
                      <Typography variant="body2">{item}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              
              <Button
                component={Link}
                to="/test/golomshtok"
                variant="contained"
                size="large"
                startIcon={<AutoStoriesIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
                  }
                }}
              >
                Пройти карту интересов
              </Button>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 4, borderRadius: 4, background: 'linear-gradient(135deg, #f5f3ff 0%, #fdf2f8 100%)' }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
                  Пример результатов
                </Typography>
                
                <Stack spacing={2}>
                  {[
                    { name: 'Физика и математика', value: 85, color: '#3b82f6' },
                    { name: 'Механика и конструирование', value: 72, color: '#f59e0b' },
                    { name: 'Радиотехника и электроника', value: 68, color: '#8b5cf6' },
                  ].map((item, index) => (
                    <Box key={index}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">{item.name}</Typography>
                        <Typography variant="body2" sx={{ color: item.color, fontWeight: 600 }}>
                          {item.value}%
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        width: '100%', 
                        height: 8, 
                        bgcolor: alpha(item.color, 0.1), 
                        borderRadius: 4,
                        position: 'relative',
                        '&:after': {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          height: '100%',
                          width: `${item.value}%`,
                          bgcolor: item.color,
                          borderRadius: 4
                        }
                      }} />
                    </Box>
                  ))}
                </Stack>
                
                <Box sx={{ mt: 4, p: 3, bgcolor: 'white', borderRadius: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Рекомендованные специальности:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    <Chip label="Инженер-конструктор" size="small" sx={{ bgcolor: alpha('#3b82f6', 0.1), color: '#3b82f6' }} />
                    <Chip label="Программист" size="small" sx={{ bgcolor: alpha('#8b5cf6', 0.1), color: '#8b5cf6' }} />
                    <Chip label="Электронщик" size="small" sx={{ bgcolor: alpha('#f59e0b', 0.1), color: '#f59e0b' }} />
                  </Stack>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 12, md: 16 },
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: 'white',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                backgroundColor: 'primary.main',
                mx: 'auto',
                mb: 4,
              }}
            >
              <PsychologyIcon sx={{ fontSize: 40 }} />
            </Avatar>
            
            <Typography
              variant="h2"
              sx={{
                mb: 3,
                color: 'white',
                fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
              Готовы узнать своё призвание?
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                mb: 6,
                fontWeight: 400,
                color: 'rgba(255, 255, 255, 0.9)',
                maxWidth: 800,
                mx: 'auto',
              }}
            >
              Пройдите один или оба теста и получите персональные рекомендации 
              по специальностям среднего профессионального образования
            </Typography>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
              <Button
                component={Link}
                to="/test/klimov"
                variant="outlined"
                size="large"
                startIcon={<PsychologyIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                  }
                }}
              >
                Тест Климова
              </Button>
              
              <Button
                component={Link}
                to="/test/golomshtok"
                variant="contained"
                size="large"
                startIcon={<AutoStoriesIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Карта интересов
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;