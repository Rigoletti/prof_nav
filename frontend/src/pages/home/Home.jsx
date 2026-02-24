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
  Divider,
  LinearProgress
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
import WorkIcon from '@mui/icons-material/Work';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';

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
      description: '5 профессиональных тестов на основе признанных психологических методик',
      color: '#6366f1'
    },
    {
      icon: <AccessTimeIcon />,
      title: '30-50 минут',
      description: 'Комплексное тестирование для полного анализа ваших склонностей',
      color: '#10b981'
    },
    {
      icon: <PersonSearchIcon />,
      title: 'Персонализация',
      description: 'Индивидуальные рекомендации специальностей СПО по каждому тесту',
      color: '#ec4899'
    },
    {
      icon: <SchoolIcon />,
      title: 'Конкретные советы',
      description: 'Список подходящих колледжей и специальностей с % совпадения',
      color: '#f59e0b'
    },
  ];

  const availableTests = [
    {
      id: 'klimov',
      title: 'Тест Климова',
      shortDescription: 'Определение профессионального типа личности',
      description: 'Методика Е.А. Климова помогает определить, к какому из пяти типов профессий вы склонны. Это базовая классификация, которая лежит в основе профориентации.',
      icon: <PsychologyIcon sx={{ fontSize: 40 }} />,
      color: '#6366f1',
      path: '/test/klimov',
      time: '10-15 минут',
      questions: '40 вопросов',
      benefits: [
        'Определяет ваш базовый профессиональный тип',
        'Помогает понять, с чем вам комфортнее работать',
        'Основа для выбора направления обучения'
      ]
    },
    {
      id: 'golomshtok',
      title: 'Карта интересов',
      shortDescription: 'Методика А.Е. Голомштока',
      description: 'Более детальный тест, который выявляет ваши интересы в 10 различных сферах: от физики до спорта. Позволяет точнее подобрать специальность.',
      icon: <AutoStoriesIcon sx={{ fontSize: 40 }} />,
      color: '#8b5cf6',
      path: '/test/golomshtok',
      time: '15-20 минут',
      questions: '50 вопросов',
      benefits: [
        'Оценивает интересы в 10 сферах деятельности',
        'Помогает выбрать конкретное направление',
        'Дополняет результаты теста Климова'
      ]
    },
    {
      id: 'holland',
      title: 'Тест Голланда',
      shortDescription: 'Типы профессиональной среды',
      description: 'Методика Дж. Голланда определяет ваш профессиональный тип: реалистичный, исследовательский, артистический, социальный, предприимчивый, конвенциональный.',
      icon: <WorkIcon sx={{ fontSize: 40 }} />,
      color: '#10b981',
      path: '/test/holland',
      time: '10-15 минут',
      questions: '42 вопроса',
      benefits: [
        'Определяет соответствие типам профессиональной среды',
        'Помогает понять, в какой среде вам комфортно работать',
        'Широко используется в профориентации'
      ]
    },
    {
      id: 'yovaysha',
      title: 'Тест Йовайши',
      shortDescription: 'Склонности к сферам деятельности',
      description: 'Методика Я. Йовайши выявляет склонности к различным сферам профессиональной деятельности: искусство, техника, работа с людьми, умственная работа, эстетика, физическая работа, экономика.',
      icon: <PsychologyAltIcon sx={{ fontSize: 40 }} />,
      color: '#ec4899',
      path: '/test/yovaysha',
      time: '10-15 минут',
      questions: '42 вопроса',
      benefits: [
        'Охватывает 7 ключевых сфер деятельности',
        'Помогает выбрать направление для развития',
        'Учитывает практические склонности'
      ]
    },
    {
      id: 'yovayshala',
      title: 'Методика Л.А. Йовайши',
      shortDescription: 'Предпочтения в работе',
      description: 'Модифицированная методика определяет предпочтения в различных видах трудовой деятельности: работа с людьми, умственный труд, техническая работа, эстетическая деятельность, экстремальная деятельность, плановая деятельность.',
      icon: <PsychologyAltIcon sx={{ fontSize: 40 }} />,
      color: '#f59e0b',
      path: '/test/yovayshala',
      time: '8-10 минут',
      questions: '30 вопросов',
      benefits: [
        'Анализирует предпочтения в трудовой деятельности',
        'Помогает выбрать конкретную профессию',
        'Компактная и точная методика'
      ]
    }
  ];

  const hollandTypes = [
    {
      name: 'Реалистичный',
      description: 'Практичный, предпочитает работу с инструментами и техникой',
      professions: ['Механик', 'Электрик', 'Инженер', 'Строитель'],
      color: '#3b82f6'
    },
    {
      name: 'Исследовательский',
      description: 'Аналитический, любит исследования и эксперименты',
      professions: ['Ученый', 'Лаборант', 'Аналитик', 'Программист'],
      color: '#10b981'
    },
    {
      name: 'Артистический',
      description: 'Творческий, предпочитает самовыражение через искусство',
      professions: ['Дизайнер', 'Художник', 'Актер', 'Музыкант'],
      color: '#ec4899'
    },
    {
      name: 'Социальный',
      description: 'Коммуникабельный, любит работать с людьми',
      professions: ['Учитель', 'Врач', 'Психолог', 'Социальный работник'],
      color: '#f59e0b'
    },
    {
      name: 'Предприимчивый',
      description: 'Энергичный, предпочитает руководящую работу и бизнес',
      professions: ['Менеджер', 'Предприниматель', 'Руководитель'],
      color: '#8b5cf6'
    },
    {
      name: 'Конвенциональный',
      description: 'Организованный, любит работу с документами и учет',
      professions: ['Бухгалтер', 'Экономист', 'Делопроизводитель'],
      color: '#6b7280'
    }
  ];

  const yovayshaTypes = [
    {
      name: 'Искусство',
      description: 'Творческая деятельность, создание художественных образов',
      color: '#ec4899'
    },
    {
      name: 'Техника',
      description: 'Работа с механизмами, приборами, инструментами',
      color: '#3b82f6'
    },
    {
      name: 'Работа с людьми',
      description: 'Общение, помощь, обучение, обслуживание',
      color: '#10b981'
    },
    {
      name: 'Умственный труд',
      description: 'Анализ, исследование, интеллектуальная деятельность',
      color: '#f59e0b'
    },
    {
      name: 'Эстетика',
      description: 'Создание прекрасного, дизайн, стиль',
      color: '#8b5cf6'
    },
    {
      name: 'Физический труд',
      description: 'Работа на природе, физическая активность',
      color: '#ef4444'
    },
    {
      name: 'Экономика',
      description: 'Финансы, бизнес, планирование',
      color: '#6366f1'
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
                5 профессиональных тестов: классификация Климова, карта интересов Голомштока, 
                методика Голланда и две версии теста Йовайши. Получите персональные рекомендации 
                специальностей в колледжах.
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

              <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip icon={<CheckCircleIcon />} label="5 научных тестов" variant="outlined" />
                <Chip icon={<CheckCircleIcon />} label="Рекомендации специальностей" variant="outlined" />
                <Chip icon={<CheckCircleIcon />} label="Поиск колледжей" variant="outlined" />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  height: { xs: 600, md: 650 },
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
                    Доступные тесты
                  </Typography>
                  
                  <Grid container spacing={3}>
                    {availableTests.slice(0, 3).map((test, index) => (
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
                              {test.shortDescription}
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
                    <Chip label="и еще 2 теста" size="small" />
                  </Divider>
                  
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Chip 
                      icon={<WorkIcon />} 
                      label="Голланд" 
                      component={Link}
                      to="/test/holland"
                      clickable
                      sx={{ '&:hover': { bgcolor: alpha('#10b981', 0.1) } }}
                    />
                    <Chip 
                      icon={<PsychologyAltIcon />} 
                      label="Йовайша" 
                      component={Link}
                      to="/test/yovaysha"
                      clickable
                      sx={{ '&:hover': { bgcolor: alpha('#ec4899', 0.1) } }}
                    />
                    <Chip 
                      icon={<PsychologyAltIcon />} 
                      label="Л.А. Йовайша" 
                      component={Link}
                      to="/test/yovayshala"
                      clickable
                      sx={{ '&:hover': { bgcolor: alpha('#f59e0b', 0.1) } }}
                    />
                  </Box>
                  
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
              5 профессиональных тестов
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 800, mx: 'auto' }}>
              Комплексный подход к профориентации с использованием признанных психологических методик
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

      {/* All Tests Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" sx={{ mb: 3 }}>
              Все доступные тесты
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 800, mx: 'auto' }}>
              Выберите один или несколько тестов для наиболее полного анализа
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {availableTests.map((test) => (
              <Grid item xs={12} md={6} lg={4} key={test.id}>
                <Card sx={{ 
                  height: '100%', 
                  borderRadius: 4,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 20px 40px ${alpha(test.color, 0.2)}`,
                    borderColor: test.color
                  }
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Avatar sx={{ bgcolor: alpha(test.color, 0.1), color: test.color, width: 56, height: 56 }}>
                        {test.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: test.color }}>
                          {test.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {test.shortDescription}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                      {test.description}
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: test.color }}>
                        Что вы узнаете:
                      </Typography>
                      <Stack spacing={1}>
                        {test.benefits.map((benefit, idx) => (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircleIcon sx={{ fontSize: 16, color: test.color }} />
                            <Typography variant="body2">{benefit}</Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
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

                    <Button
                      component={Link}
                      to={test.path}
                      fullWidth
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        backgroundColor: test.color,
                        '&:hover': {
                          backgroundColor: test.color,
                          filter: 'brightness(0.9)',
                          transform: 'translateY(-2px)'
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
        </Container>
      </Box>

      {/* Klimov Types Section */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
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

      {/* Holland Types Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%)' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" sx={{ mb: 3 }}>
              6 типов профессиональной среды по Голланду
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 800, mx: 'auto' }}>
              Методика помогает определить, в какой профессиональной среде вам будет комфортно работать
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {hollandTypes.map((type, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  sx={{
                    p: 3,
                    height: '100%',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: alpha(type.color, 0.3),
                    background: `linear-gradient(135deg, ${alpha(type.color, 0.05)} 0%, ${alpha(type.color, 0.1)} 100%)`,
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 700, color: type.color, mb: 2 }}>
                    {type.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                    {type.description}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {type.professions.map((prof, idx) => (
                      <Chip
                        key={idx}
                        label={prof}
                        size="small"
                        sx={{ backgroundColor: alpha(type.color, 0.1), color: type.color }}
                      />
                    ))}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              component={Link}
              to="/test/holland"
              variant="contained"
              size="large"
              startIcon={<WorkIcon />}
              sx={{
                px: 4,
                py: 1.5,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              }}
            >
              Пройти тест Голланда
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Yovaysha Types Section */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" sx={{ mb: 3 }}>
              7 сфер деятельности по Йовайше
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 800, mx: 'auto' }}>
              Методика выявляет ваши склонности к различным сферам профессиональной деятельности
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {yovayshaTypes.map((type, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: alpha(type.color, 0.3),
                    background: `linear-gradient(135deg, ${alpha(type.color, 0.05)} 0%, ${alpha(type.color, 0.1)} 100%)`,
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 700, color: type.color, mb: 2 }}>
                    {type.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {type.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 6, display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={Link}
              to="/test/yovaysha"
              variant="contained"
              size="large"
              startIcon={<PsychologyAltIcon />}
              sx={{
                px: 4,
                py: 1.5,
                background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
              }}
            >
              Пройти тест Йовайши
            </Button>
            
            <Button
              component={Link}
              to="/test/yovayshala"
              variant="contained"
              size="large"
              startIcon={<PsychologyAltIcon />}
              sx={{
                px: 4,
                py: 1.5,
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              }}
            >
              Пройти методику Л.А. Йовайши
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Comparison Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' }}>
        <Container maxWidth="lg">
          <Paper sx={{ p: { xs: 4, md: 6 }, borderRadius: 4 }}>
            <Typography variant="h2" sx={{ mb: 4, textAlign: 'center' }}>
              Сравнение методик
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#6366f1' }}>
                    Тест Климова
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
                    Что определяет:
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Базовый тип личности и предпочтительный предмет труда (природа, техника, человек, знак, искусство)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
                    Для кого подходит:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Для первичной профориентации, понимания своих базовых склонностей
                  </Typography>
                </Card>
              </Grid>
                         <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#8b5cf6' }}>
                    Карта интересов Голомштока
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
                    Что определяет:
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Интересы в 10 конкретных сферах: физика, химия, электроника, механика, география, литература, история, педагогика, предпринимательство, спорт
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
                    Для кого подходит:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Для более детального анализа интересов и выбора конкретного направления
                  </Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#10b981' }}>
                    Тест Голланда
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
                    Что определяет:
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Тип профессиональной среды: реалистичный, исследовательский, артистический, социальный, предприимчивый, конвенциональный
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
                    Для кого подходит:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Для понимания, в какой рабочей среде вам комфортно
                  </Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#ec4899' }}>
                    Тест Я. Йовайши
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
                    Что определяет:
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Склонности к 7 сферам: искусство, техника, работа с людьми, умственная работа, эстетика, физическая работа, экономика
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
                    Для кого подходит:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Для комплексного анализа профессиональных склонностей
                  </Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#f59e0b' }}>
                    Методика Л.А. Йовайши
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
                    Что определяет:
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Предпочтения в трудовой деятельности: работа с людьми, умственный труд, техническая работа, эстетическая деятельность, экстремальная деятельность, плановая деятельность
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
                    Для кого подходит:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Для точного определения предпочтительного вида занятости
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontWeight: 800, mb: 1 }}>
                  5
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  профессиональных тестов
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontWeight: 800, mb: 1 }}>
                  204
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  вопроса всего
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontWeight: 800, mb: 1 }}>
                  28
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  типов личности
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontWeight: 800, mb: 1 }}>
                  100+
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  специальностей
                </Typography>
              </Box>
            </Grid>
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
                Детальная методика, которая оценивает ваши интересы в 10 различных сферах деятельности.
                Помогает определить не только общее направление, но и конкретные области для развития.
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
                    { name: 'Педагогика и медицина', value: 45, color: '#ec4899' },
                    { name: 'Литература и искусство', value: 30, color: '#10b981' },
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
                    <Chip label="Радиомеханик" size="small" sx={{ bgcolor: alpha('#10b981', 0.1), color: '#10b981' }} />
                  </Stack>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Holland Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center" direction="row-reverse">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" sx={{ mb: 3 }}>
                Тест Голланда
                <Box component="span" sx={{ display: 'block', fontSize: '1.5rem', color: 'text.secondary', mt: 1 }}>
                  Типы профессиональной среды
                </Box>
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', fontSize: '1.1rem', lineHeight: 1.8 }}>
                Методика Джона Голланда основана на идее, что люди и профессии могут быть классифицированы 
                по шести типам. Чем ближе ваш тип к типу профессии, тем успешнее и удовлетвореннее вы будете в ней.
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Шесть типов:
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#3b82f6' }} />
                      <Typography variant="body2">Реалистичный</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
                      <Typography variant="body2">Исследовательский</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ec4899' }} />
                      <Typography variant="body2">Артистический</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f59e0b' }} />
                      <Typography variant="body2">Социальный</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#8b5cf6' }} />
                      <Typography variant="body2">Предприимчивый</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#6b7280' }} />
                      <Typography variant="body2">Конвенциональный</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              
              <Button
                component={Link}
                to="/test/holland"
                variant="contained"
                size="large"
                startIcon={<WorkIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  }
                }}
              >
                Пройти тест Голланда
              </Button>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 4, borderRadius: 4 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
                  Ваш профиль по Голланду
                </Typography>
                
                <Box sx={{ position: 'relative', height: 200, mb: 4 }}>
                  {/* Радарная диаграмма в упрощенном виде */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '100%' }}>
                    {[
                      { type: 'Р', value: 85, color: '#3b82f6' },
                      { type: 'И', value: 70, color: '#10b981' },
                      { type: 'А', value: 45, color: '#ec4899' },
                      { type: 'С', value: 60, color: '#f59e0b' },
                      { type: 'П', value: 55, color: '#8b5cf6' },
                      { type: 'К', value: 40, color: '#6b7280' },
                    ].map((item, index) => (
                      <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 40 }}>
                        <Box sx={{ 
                          height: `${item.value}px`, 
                          width: 30, 
                          bgcolor: item.color,
                          borderRadius: '4px 4px 0 0',
                          mb: 1
                        }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: item.color }}>
                          {item.type}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
                
                <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', mb: 3 }}>
                  Ваш ведущий тип: <strong style={{ color: '#3b82f6' }}>Реалистичный (85%)</strong>
                </Typography>
                
                <Box sx={{ p: 3, bgcolor: alpha('#3b82f6', 0.05), borderRadius: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#3b82f6' }}>
                    Рекомендованные профессии:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    <Chip label="Инженер-механик" size="small" sx={{ bgcolor: alpha('#3b82f6', 0.1), color: '#3b82f6' }} />
                    <Chip label="Автомеханик" size="small" sx={{ bgcolor: alpha('#3b82f6', 0.1), color: '#3b82f6' }} />
                    <Chip label="Электрик" size="small" sx={{ bgcolor: alpha('#3b82f6', 0.1), color: '#3b82f6' }} />
                    <Chip label="Строитель" size="small" sx={{ bgcolor: alpha('#3b82f6', 0.1), color: '#3b82f6' }} />
                  </Stack>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Yovaysha Section */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" sx={{ mb: 3 }}>
                Тест Йовайши
                <Box component="span" sx={{ display: 'block', fontSize: '1.5rem', color: 'text.secondary', mt: 1 }}>
                  Склонности к сферам деятельности
                </Box>
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', fontSize: '1.1rem', lineHeight: 1.8 }}>
                Методика Я. Йовайши помогает определить, к каким сферам профессиональной деятельности 
                у вас есть природные склонности. Тест особенно полезен для выбора конкретного направления обучения.
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Две версии теста:
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ p: 2, bgcolor: alpha('#ec4899', 0.05), border: `1px solid ${alpha('#ec4899', 0.2)}` }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#ec4899', mb: 1 }}>
                        Я. Йовайша
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        7 сфер деятельности: искусство, техника, работа с людьми, умственная работа, эстетика, физическая работа, экономика
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ p: 2, bgcolor: alpha('#f59e0b', 0.05), border: `1px solid ${alpha('#f59e0b', 0.2)}` }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#f59e0b', mb: 1 }}>
                        Л.А. Йовайша
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        6 видов деятельности: работа с людьми, умственный труд, техническая работа, эстетическая деятельность, экстремальная деятельность, плановая деятельность
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  component={Link}
                  to="/test/yovaysha"
                  variant="contained"
                  startIcon={<PsychologyAltIcon />}
                  sx={{
                    px: 3,
                    py: 1.5,
                    background: '#ec4899',
                    '&:hover': {
                      background: '#db2777',
                    }
                  }}
                >
                  Тест Я. Йовайши
                </Button>
                
                <Button
                  component={Link}
                  to="/test/yovayshala"
                  variant="contained"
                  startIcon={<PsychologyAltIcon />}
                  sx={{
                    px: 3,
                    py: 1.5,
                    background: '#f59e0b',
                    '&:hover': {
                      background: '#d97706',
                    }
                  }}
                >
                  Методика Л.А. Йовайши
                </Button>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 4, borderRadius: 4, background: 'linear-gradient(135deg, #fdf2f8 0%, #fef3c7 100%)' }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
                  Пример результатов (Я. Йовайша)
                </Typography>
                
                <Stack spacing={2} sx={{ mb: 4 }}>
                  {[
                    { name: 'Техническая сфера', value: 90, color: '#3b82f6' },
                    { name: 'Умственная работа', value: 75, color: '#f59e0b' },
                    { name: 'Работа с людьми', value: 60, color: '#10b981' },
                    { name: 'Экономика', value: 55, color: '#6366f1' },
                    { name: 'Искусство', value: 40, color: '#ec4899' },
                    { name: 'Физическая работа', value: 35, color: '#ef4444' },
                    { name: 'Эстетика', value: 30, color: '#8b5cf6' },
                  ].map((item, index) => (
                    <Box key={index}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption">{item.name}</Typography>
                        <Typography variant="caption" sx={{ color: item.color, fontWeight: 600 }}>
                          {item.value}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={item.value}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: alpha(item.color, 0.1),
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: item.color,
                            borderRadius: 3,
                          }
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
                
                <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Рекомендованные специальности:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    <Chip label="Инженер-конструктор" size="small" sx={{ bgcolor: alpha('#3b82f6', 0.1), color: '#3b82f6' }} />
                    <Chip label="Технолог" size="small" sx={{ bgcolor: alpha('#3b82f6', 0.1), color: '#3b82f6' }} />
                    <Chip label="Программист" size="small" sx={{ bgcolor: alpha('#f59e0b', 0.1), color: '#f59e0b' }} />
                    <Chip label="Системный администратор" size="small" sx={{ bgcolor: alpha('#3b82f6', 0.1), color: '#3b82f6' }} />
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
              Пройдите один или несколько тестов и получите персональные рекомендации 
              по специальностям среднего профессионального образования. Чем больше тестов вы пройдете,
              тем точнее будут рекомендации!
            </Typography>
            
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  component={Link}
                  to="/test/klimov"
                  variant="outlined"
                  fullWidth
                  startIcon={<PsychologyIcon />}
                  sx={{
                    borderColor: '#6366f1',
                    color: '#6366f1',
                    '&:hover': {
                      borderColor: '#4f46e5',
                      backgroundColor: alpha('#6366f1', 0.1),
                    }
                  }}
                >
                  Климова
                </Button>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  component={Link}
                  to="/test/golomshtok"
                  variant="outlined"
                  fullWidth
                  startIcon={<AutoStoriesIcon />}
                  sx={{
                    borderColor: '#8b5cf6',
                    color: '#8b5cf6',
                    '&:hover': {
                      borderColor: '#7c3aed',
                      backgroundColor: alpha('#8b5cf6', 0.1),
                    }
                  }}
                >
                  Голомштока
                </Button>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  component={Link}
                  to="/test/holland"
                  variant="outlined"
                  fullWidth
                  startIcon={<WorkIcon />}
                  sx={{
                    borderColor: '#10b981',
                    color: '#10b981',
                    '&:hover': {
                      borderColor: '#059669',
                      backgroundColor: alpha('#10b981', 0.1),
                    }
                  }}
                >
                  Голланда
                </Button>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  component={Link}
                  to="/test/yovaysha"
                  variant="outlined"
                  fullWidth
                  startIcon={<PsychologyAltIcon />}
                  sx={{
                    borderColor: '#ec4899',
                    color: '#ec4899',
                    '&:hover': {
                      borderColor: '#db2777',
                      backgroundColor: alpha('#ec4899', 0.1),
                    }
                  }}
                >
                  Йовайши
                </Button>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 4 }}>
              <Button
                component={Link}
                to="/test/yovayshala"
                variant="outlined"
                size="large"
                startIcon={<PsychologyAltIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderColor: '#f59e0b',
                  color: '#f59e0b',
                  '&:hover': {
                    borderColor: '#d97706',
                    backgroundColor: alpha('#f59e0b', 0.1),
                  }
                }}
              >
                Методика Л.А. Йовайши
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ mb: 6, textAlign: 'center' }}>
            Часто задаваемые вопросы
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 4, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
                  Зачем проходить несколько тестов?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Каждый тест раскрывает разные аспекты вашей личности и профессиональных предпочтений. 
                  Тест Климова определяет базовый тип, Голомштока - конкретные интересы, Голланда - 
                  предпочтительную рабочую среду, а тесты Йовайши - склонности к определенным видам деятельности. 
                  Вместе они дают наиболее полную картину.
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 4, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
                  Как интерпретировать результаты?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  После каждого теста вы получаете подробный отчет с процентными показателями по каждому типу,
                  описание ваших ведущих склонностей и список рекомендованных специальностей с указанием
                  процента совпадения. Чем выше процент, тем больше специальность соответствует вашим интересам.
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 4, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
                  Можно ли проходить тесты несколько раз?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Да, вы можете проходить тесты неограниченное количество раз. Все результаты сохраняются
                  в вашем профиле в разделе "История тестов". Это позволяет отслеживать изменения ваших
                  интересов и предпочтений с течением времени.
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 4, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
                  Насколько точны рекомендации?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Рекомендации основаны на научных методиках профориентации и сопоставлении ваших результатов
                  с типами специальностей. Мы используем соответствие между типами личности по разным методикам
                  и требованиями профессий для максимально точного подбора.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Final CTA */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ mb: 3, fontWeight: 700 }}>
            Начните с любого теста
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
            Выберите тест, который вас заинтересовал, или пройдите все для максимально точного результата
          </Typography>
          <Button
            component={Link}
            to="/test"
            variant="contained"
            size="large"
            sx={{
              px: 6,
              py: 2,
              fontSize: '1.2rem',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            }}
          >
            Выбрать тест
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;