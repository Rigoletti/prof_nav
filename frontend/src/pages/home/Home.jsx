import React, { useState, useEffect } from 'react';
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
  IconButton,
  Divider,
  LinearProgress,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import WorkIcon from '@mui/icons-material/Work';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SchoolIcon from '@mui/icons-material/School';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import StarIcon from '@mui/icons-material/Star';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import WarningIcon from '@mui/icons-material/Warning';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const theme = useTheme();
  const { api, user } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const [testProgress, setTestProgress] = useState({});
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [showReminder, setShowReminder] = useState(false);
  const [reminderTest, setReminderTest] = useState(null);

  const tests = [
    {
      id: 'klimov',
      name: 'Климов',
      title: 'Тест Климова',
      desc: '5 типов профессий по предмету труда: природа, техника, человек, знак, искусство',
      longDesc: 'Базовая методика, которая определяет, с каким предметом труда вам комфортнее работать. Это фундамент профориентации.',
      icon: <PsychologyIcon />,
      color: '#4F46E5',
      lightColor: '#EEF2FF',
      time: '10 мин',
      questions: 40,
      path: '/test/klimov',
      popular: true,
      apiEndpoint: '/tests/klimov/start',
    },
    {
      id: 'golomshtok',
      name: 'Голомшток',
      title: 'Карта интересов',
      desc: '10 сфер деятельности: от физики до предпринимательства',
      longDesc: 'Детальная методика, оценивающая ваши интересы в конкретных областях. Помогает точно выбрать направление обучения.',
      icon: <AutoStoriesIcon />,
      color: '#059669',
      lightColor: '#ECFDF5',
      time: '15 мин',
      questions: 50,
      path: '/test/golomshtok',
      popular: false,
      apiEndpoint: '/tests/golomshtok/start',
    },
    {
      id: 'holland',
      name: 'Голланд',
      title: 'Тест Голланда',
      desc: '6 типов профессиональной среды',
      longDesc: 'Определяет, в какой рабочей атмосфере вам будет комфортно: от реалистичной до предпринимательской.',
      icon: <WorkIcon />,
      color: '#2563EB',
      lightColor: '#EFF6FF',
      time: '12 мин',
      questions: 42,
      path: '/test/holland',
      popular: true,
      apiEndpoint: '/tests/holland/start',
    },
    {
      id: 'yovaysha',
      name: 'Йовайша',
      title: 'Тест Йовайши',
      desc: '7 сфер профессиональных склонностей',
      longDesc: 'Выявляет природные склонности к различным видам деятельности: искусство, техника, работа с людьми, экономика и другие.',
      icon: <PsychologyAltIcon />,
      color: '#DB2777',
      lightColor: '#FDF2F8',
      time: '12 мин',
      questions: 42,
      path: '/test/yovaysha',
      popular: false,
      apiEndpoint: '/tests/yovaysha/start',
    },
    {
      id: 'yovayshala',
      name: 'Йовайша (мод.)',
      title: 'Методика Л.А. Йовайши',
      desc: '6 видов трудовой деятельности',
      longDesc: 'Модифицированная версия, анализирующая предпочтения в конкретных видах работы: от плановой до экстремальной.',
      icon: <PsychologyAltIcon />,
      color: '#D97706',
      lightColor: '#FFFBEB',
      time: '8 мин',
      questions: 30,
      path: '/test/yovayshala',
      popular: false,
      apiEndpoint: '/tests/yovayshala/start',
    },
    {
      id: 'comprehensive',
      name: 'Комплексный',
      title: 'Комплексный тест',
      desc: 'Объединяет все 5 методик',
      longDesc: 'Полный профориентационный тест, включающий вопросы из всех методик. Дает наиболее полную картину за 15-20 минут.',
      icon: <AssessmentIcon />,
      color: '#7C3AED',
      lightColor: '#EDE9FE',
      time: '20 мин',
      questions: 40,
      path: '/test/comprehensive',
      popular: true,
      apiEndpoint: '/tests/comprehensive/start',
    },
  ];

  const features = [
    {
      icon: <AssessmentIcon />,
      title: '6 научных тестов',
      description: 'Методики Климова, Голомштока, Голланда, Йовайши и комплексный',
      color: '#4F46E5',
      lightColor: '#EEF2FF',
    },
    {
      icon: <AccessTimeIcon />,
      title: '30-60 минут',
      description: 'Комплексное тестирование для полного анализа',
      color: '#059669',
      lightColor: '#ECFDF5',
    },
    {
      icon: <SchoolIcon />,
      title: 'Подбор специальностей',
      description: 'СПО и колледжи с процентом совпадения',
      color: '#DB2777',
      lightColor: '#FDF2F8',
    },
    {
      icon: <AssessmentIcon />,
      title: 'Подробные отчёты',
      description: 'Графики и описание ваших склонностей',
      color: '#D97706',
      lightColor: '#FFFBEB',
    },
  ];

  // Загрузка прогресса тестов
  useEffect(() => {
    if (user) {
      loadAllTestProgress();
    } else {
      setLoadingProgress(false);
    }
  }, [user]);

  const loadAllTestProgress = async () => {
    try {
      setLoadingProgress(true);
      const progressData = {};
      
      // Загружаем прогресс для каждого теста
      for (const test of tests) {
        try {
          const response = await api.get(test.apiEndpoint);
          if (response.data.success && response.data.testSession) {
            const session = response.data.testSession;
            const answeredCount = session.answers?.length || 0;
            const totalQuestions = test.questions;
            const progressPercent = Math.round((answeredCount / totalQuestions) * 100);
            
            if (answeredCount > 0 && answeredCount < totalQuestions) {
              progressData[test.id] = {
                inProgress: true,
                answeredCount: answeredCount,
                totalQuestions: totalQuestions,
                progressPercent: progressPercent,
                currentQuestion: session.currentQuestion,
                testSession: session,
              };
            } else if (answeredCount >= totalQuestions) {
              progressData[test.id] = {
                inProgress: false,
                completed: true,
                answeredCount: totalQuestions,
                totalQuestions: totalQuestions,
                progressPercent: 100,
              };
            } else {
              progressData[test.id] = {
                inProgress: false,
                completed: false,
                answeredCount: 0,
                totalQuestions: totalQuestions,
                progressPercent: 0,
              };
            }
          }
        } catch (error) {
          console.log(`No progress for ${test.id}`);
          progressData[test.id] = {
            inProgress: false,
            completed: false,
            answeredCount: 0,
            totalQuestions: test.questions,
            progressPercent: 0,
          };
        }
      }
      
      setTestProgress(progressData);
      
      // Проверяем есть ли незавершенные тесты для напоминания
      const incompleteTests = tests.filter(test => 
        progressData[test.id]?.inProgress === true && 
        progressData[test.id]?.progressPercent > 0 &&
        progressData[test.id]?.progressPercent < 100
      );
      
      if (incompleteTests.length > 0 && !localStorage.getItem('reminderShown')) {
        setReminderTest(incompleteTests[0]);
        setShowReminder(true);
        localStorage.setItem('reminderShown', 'true');
        setTimeout(() => localStorage.removeItem('reminderShown'), 30000);
      }
    } catch (error) {
      console.error('Error loading test progress:', error);
    } finally {
      setLoadingProgress(false);
    }
  };

  const getProgressForTest = (testId) => {
    return testProgress[testId] || {
      inProgress: false,
      completed: false,
      answeredCount: 0,
      totalQuestions: 0,
      progressPercent: 0,
    };
  };

  const handleContinueTest = (test) => {
    window.location.href = test.path;
  };

  const handleDismissReminder = () => {
    setShowReminder(false);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? tests.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === tests.length - 1 ? 0 : prev + 1));
  };

  const currentTest = tests[activeIndex];
  const currentProgress = getProgressForTest(currentTest?.id);

  return (
    <Box sx={{ bgcolor: '#FFFFFF' }}>
      {/* Snackbar для напоминания о незавершенном тесте */}
      <Snackbar
        open={showReminder}
        autoHideDuration={8000}
        onClose={handleDismissReminder}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="warning"
          icon={<WarningIcon />}
          sx={{
            bgcolor: '#FEF3C7',
            color: '#92400E',
            '& .MuiAlert-icon': { color: '#D97706' },
            borderLeft: `4px solid #D97706`,
          }}
          action={
            <Button color="inherit" size="small" onClick={() => reminderTest && handleContinueTest(reminderTest)}>
              Продолжить
            </Button>
          }
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            У вас есть незавершенный тест!
          </Typography>
          <Typography variant="caption">
            {reminderTest?.title} — пройдено {testProgress[reminderTest?.id]?.answeredCount} из {reminderTest?.questions} вопросов
          </Typography>
        </Alert>
      </Snackbar>

      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 8, md: 12 },
          pb: { xs: 10, md: 16 },
          borderBottom: '1px solid',
          borderColor: '#F0F0F0',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <Chip
                label="Профориентация для СПО"
                sx={{
                  mb: 3,
                  bgcolor: '#EEF2FF',
                  color: '#4F46E5',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              />
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                  fontWeight: 700,
                  lineHeight: 1.2,
                  mb: 3,
                  color: '#111827',
                  letterSpacing: '-0.02em',
                }}
              >
                Найдите профессию,
                <br />
                которая{' '}
                <Box
                  component="span"
                  sx={{
                    color: '#4F46E5',
                    position: 'relative',
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 8,
                      left: 0,
                      right: 0,
                      height: 8,
                      bgcolor: alpha('#4F46E5', 0.2),
                      borderRadius: 1,
                      zIndex: -1,
                    },
                  }}
                >
                  подходит вам
                </Box>
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#6B7280',
                  mb: 4,
                  fontWeight: 400,
                  lineHeight: 1.6,
                  fontSize: '1.125rem',
                }}
              >
                6 профессиональных тестов на основе признанных методик. Персональные рекомендации
                специальностей и колледжей.
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
                    bgcolor: '#111827',
                    '&:hover': { bgcolor: '#374151' },
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
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
                    borderColor: '#E5E7EB',
                    color: '#374151',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
                    '&:hover': { borderColor: '#9CA3AF', bgcolor: '#F9FAFB' },
                  }}
                >
                  Смотреть специальности
                </Button>
              </Stack>
              <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip
                  icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                  label="6 научных тестов"
                  sx={{ bgcolor: '#F9FAFB', color: '#374151' }}
                />
                <Chip
                  icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                  label="Рекомендации специальностей"
                  sx={{ bgcolor: '#F9FAFB', color: '#374151' }}
                />
                <Chip
                  icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                  label="Поиск колледжей"
                  sx={{ bgcolor: '#F9FAFB', color: '#374151' }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 4,
                  bgcolor: '#F9FAFB',
                  border: '1px solid #F0F0F0',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#111827' }}>
                  {user ? 'Ваши тесты' : 'Пройдите тесты'}
                </Typography>
                
                {loadingProgress ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={32} />
                  </Box>
                ) : (
                  <Stack spacing={2}>
                    {tests.slice(0, 3).map((test, idx) => {
                      const progress = getProgressForTest(test.id);
                      const isInProgress = progress.inProgress && progress.progressPercent > 0 && progress.progressPercent < 100;
                      const isCompleted = progress.completed;
                      
                      return (
                        <Box
                          key={idx}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            p: 2,
                            borderRadius: 3,
                            bgcolor: '#FFFFFF',
                            border: `1px solid ${isInProgress ? test.color : '#F0F0F0'}`,
                            transition: 'all 0.2s',
                            '&:hover': { 
                              borderColor: test.color, 
                              boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
                            },
                            position: 'relative',
                            overflow: 'hidden',
                          }}
                        >
                          {/* Прогресс-бар для незавершенного теста */}
                          {isInProgress && (
                            <LinearProgress
                              variant="determinate"
                              value={progress.progressPercent}
                              sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: 3,
                                bgcolor: alpha(test.color, 0.1),
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: test.color,
                                },
                              }}
                            />
                          )}
                          
                          <Avatar sx={{ bgcolor: test.lightColor, color: test.color }}>
                            {test.icon}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                              <Typography sx={{ fontWeight: 600, color: '#111827' }}>
                                {test.title}
                              </Typography>
                              {isInProgress && (
                                <Chip
                                  icon={<PauseIcon sx={{ fontSize: 12 }} />}
                                  label={`${progress.answeredCount}/${progress.totalQuestions}`}
                                  size="small"
                                  sx={{ 
                                    height: 20, 
                                    fontSize: '0.7rem',
                                    bgcolor: alpha(test.color, 0.1),
                                    color: test.color,
                                  }}
                                />
                              )}
                              {isCompleted && (
                                <Chip
                                  icon={<CheckCircleIcon sx={{ fontSize: 12 }} />}
                                  label="Пройден"
                                  size="small"
                                  sx={{ 
                                    height: 20, 
                                    fontSize: '0.7rem',
                                    bgcolor: '#D1FAE5',
                                    color: '#059669',
                                  }}
                                />
                              )}
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {test.time} • {test.questions} вопросов
                            </Typography>
                            {isInProgress && (
                              <Typography variant="caption" sx={{ display: 'block', color: test.color, mt: 0.5 }}>
                                Прогресс: {progress.progressPercent}%
                              </Typography>
                            )}
                          </Box>
                          {isInProgress ? (
                            <Button
                              onClick={() => handleContinueTest(test)}
                              size="small"
                              startIcon={<PlayArrowIcon />}
                              sx={{ color: test.color, textTransform: 'none' }}
                            >
                              Продолжить
                            </Button>
                          ) : (
                            <Button
                              component={Link}
                              to={test.path}
                              size="small"
                              sx={{ color: test.color, textTransform: 'none' }}
                            >
                              {isCompleted ? 'Результаты' : 'Пройти'}
                            </Button>
                          )}
                        </Box>
                      );
                    })}
                  </Stack>
                )}
                
                <Divider sx={{ my: 3 }} />
                <Button
                  component={Link}
                  to="/test"
                  fullWidth
                  variant="outlined"
                  sx={{ textTransform: 'none', borderColor: '#E5E7EB', color: '#374151' }}
                >
                  Смотреть все 6 тестов
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 6, bgcolor: '#F9FAFB', borderBottom: '1px solid #F0F0F0' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {[
              { value: '6', label: 'профессиональных тестов' },
              { value: '244', label: 'вопроса всего' },
              { value: '34', label: 'типа личности' },
              { value: '100+', label: 'специальностей' },
            ].map((stat, idx) => (
              <Grid item xs={6} md={3} key={idx}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#111827', mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Tests Carousel */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.75rem', md: '2.25rem' },
                fontWeight: 700,
                color: '#111827',
                mb: 2,
              }}
            >
              Какой тест вам подходит?
            </Typography>
            <Typography variant="body1" sx={{ color: '#6B7280', maxWidth: 600, mx: 'auto' }}>
              Листайте карточки, чтобы узнать о каждой методике
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={handlePrev}
              sx={{
                bgcolor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                '&:hover': { bgcolor: '#F9FAFB' },
              }}
            >
              <NavigateBeforeIcon />
            </IconButton>

            <Box sx={{ flex: 1 }}>
              <Card
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  border: `1px solid ${alpha(currentTest?.color || '#4F46E5', 0.2)}`,
                  transition: 'all 0.3s',
                  position: 'relative',
                }}
              >
                {currentProgress?.inProgress && currentProgress?.progressPercent > 0 && (
                  <LinearProgress
                    variant="determinate"
                    value={currentProgress.progressPercent}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      bgcolor: alpha(currentTest.color, 0.1),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: currentTest.color,
                      },
                    }}
                  />
                )}
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, flexWrap: 'wrap' }}>
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: currentTest?.lightColor || '#EEF2FF',
                        color: currentTest?.color || '#4F46E5',
                      }}
                    >
                      {currentTest?.icon}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827' }}>
                          {currentTest?.title}
                        </Typography>
                        {currentTest?.popular && (
                          <Chip
                            icon={<StarIcon sx={{ fontSize: 14 }} />}
                            label="Популярный"
                            size="small"
                            sx={{ bgcolor: '#FEF3C7', color: '#D97706' }}
                          />
                        )}
                        {currentProgress?.inProgress && (
                          <Chip
                            icon={<PauseIcon sx={{ fontSize: 14 }} />}
                            label={`Продолжить: ${currentProgress.answeredCount}/${currentProgress.totalQuestions}`}
                            size="small"
                            sx={{ bgcolor: alpha(currentTest?.color, 0.1), color: currentTest?.color }}
                          />
                        )}
                      </Box>
                      <Typography variant="body1" sx={{ color: '#4B5563', mb: 2, lineHeight: 1.6 }}>
                        {currentTest?.longDesc}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTimeIcon sx={{ fontSize: 18, color: '#9CA3AF' }} />
                          <Typography variant="body2" color="text.secondary">
                            {currentTest?.time}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AssessmentIcon sx={{ fontSize: 18, color: '#9CA3AF' }} />
                          <Typography variant="body2" color="text.secondary">
                            {currentTest?.questions} вопросов
                          </Typography>
                        </Box>
                        {currentProgress?.inProgress && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={currentProgress.progressPercent}
                              sx={{ width: 100, height: 6, borderRadius: 3 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {currentProgress.progressPercent}%
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      <Button
                        onClick={() => currentProgress?.inProgress ? handleContinueTest(currentTest) : null}
                        component={currentProgress?.inProgress ? 'button' : Link}
                        to={currentProgress?.inProgress ? undefined : currentTest?.path}
                        variant="contained"
                        startIcon={currentProgress?.inProgress ? <PlayArrowIcon /> : undefined}
                        sx={{
                          bgcolor: currentTest?.color,
                          textTransform: 'none',
                          px: 3,
                          '&:hover': { bgcolor: currentTest?.color, filter: 'brightness(0.9)' },
                        }}
                      >
                        {currentProgress?.inProgress ? 'Продолжить тест' : `Пройти тест ${currentTest?.name}`}
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            <IconButton
              onClick={handleNext}
              sx={{
                bgcolor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                '&:hover': { bgcolor: '#F9FAFB' },
              }}
            >
              <NavigateNextIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 4 }}>
            {tests.map((_, idx) => (
              <Box
                key={idx}
                onClick={() => setActiveIndex(idx)}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: activeIndex === idx ? (tests[activeIndex]?.color || '#4F46E5') : '#E5E7EB',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </Box>
        </Container>
      </Box>

      {/* Features Grid */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#F9FAFB', borderTop: '1px solid #F0F0F0', borderBottom: '1px solid #F0F0F0' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {features.map((feature, idx) => (
              <Grid item xs={12} md={3} key={idx}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: feature.lightColor,
                      color: feature.color,
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827', mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280', lineHeight: 1.5 }}>
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: { xs: 10, md: 14 } }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              fontWeight: 700,
              color: '#111827',
              mb: 3,
            }}
          >
            Начните свой путь к профессии
          </Typography>
          <Typography variant="h6" sx={{ color: '#6B7280', mb: 4, fontWeight: 400 }}>
            Пройдите тесты и получите персональные рекомендации специальностей
          </Typography>
          
          {/* Показываем напоминание о незавершенных тестах в CTA */}
          {!loadingProgress && Object.values(testProgress).some(p => p.inProgress) && (
            <Alert
              severity="info"
              icon={<PlayArrowIcon />}
              sx={{ mb: 3, maxWidth: 500, mx: 'auto', bgcolor: '#EEF2FF', color: '#4F46E5' }}
            >
              <Typography variant="body2">
                У вас есть незавершенные тесты. Продолжите прохождение, чтобы получить полные рекомендации.
              </Typography>
            </Alert>
          )}
          
          <Button
            component={Link}
            to="/test"
            variant="contained"
            size="large"
            sx={{
              px: 5,
              py: 1.75,
              bgcolor: '#111827',
              '&:hover': { bgcolor: '#374151' },
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
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