import React, { useState } from 'react';
import {
  Box, Container, Typography, TextField, Button, Paper,
  CircularProgress, Alert, Chip, Grid, Card, CardContent,
  LinearProgress
} from '@mui/material';
import { Psychology as PsychologyIcon, School as SchoolIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const EssayAnalyzer = () => {
  const { api } = useAuth();
  const [essay, setEssay] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (essay.trim().length < 20) {
      setError('Напишите сочинение длиной не менее 20 символов');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await api.post('/ai/match-by-essay', { essay: essay.trim() });
      if (response.data.success) {
        setResult(response.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 60) return '#f59e0b';
    if (percentage >= 40) return '#3b82f6';
    return '#9ca3af';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Форма ввода */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 4, textAlign: 'center' }}>
        <PsychologyIcon sx={{ fontSize: 60, color: '#6366f1', mb: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Расскажите о себе
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
          Напишите о своих увлечениях, любимых предметах, о том, кем мечтаете стать.
          ИИ проанализирует ваш текст и подберёт специальности.
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={8}
          placeholder="Пример: Я всегда любил компьютеры и технику. С детства разбирал разные устройства. В школе мне нравятся информатика и физика. В свободное время учусь программировать. Мечтаю создавать полезные приложения..."
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
          disabled={loading}
          sx={{ mb: 3 }}
        />

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Button
          variant="contained"
          size="large"
          onClick={handleAnalyze}
          disabled={loading || essay.trim().length < 20}
          sx={{ px: 4, py: 1.5, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Проанализировать'}
        </Button>
      </Paper>

      {/* Результаты */}
      {result && (
        <>
          <Paper sx={{ p: 4, mb: 4, borderRadius: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              Результаты анализа
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">Выявленные черты:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {result.analysis.traits.map((trait, idx) => (
                  <Chip key={idx} label={trait} variant="outlined" />
                ))}
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">Типы профессий по Климову:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {result.analysis.klimovTypes.map((type, idx) => {
                  const labels = {
                    manNature: '🌿 Человек-Природа',
                    manTech: '⚙️ Человек-Техника',
                    manHuman: '👥 Человек-Человек',
                    manSign: '📊 Человек-Знаковая система',
                    manArt: '🎨 Человек-Искусство'
                  };
                  return (
                    <Chip key={idx} label={labels[type] || type} color="primary" />
                  );
                })}
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              {result.analysis.reasoning}
            </Typography>

            {result.savedToProfile && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Результат сохранён в вашем профиле!
              </Alert>
            )}
          </Paper>

          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            🎓 Рекомендованные специальности ({result.totalFound})
          </Typography>

          <Grid container spacing={3}>
            {result.specialties.map((specialty) => (
              <Grid item xs={12} sm={6} md={4} key={specialty._id}>
                <Card sx={{ borderRadius: 3, height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                  <CardContent>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">Совпадение</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: getMatchColor(specialty.matchPercentage) }}>
                          {specialty.matchPercentage}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={specialty.matchPercentage} 
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>

                    <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace', display: 'block', mb: 0.5 }}>
                      {specialty.code}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                      {specialty.name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {specialty.description || 'Описание отсутствует'}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <SchoolIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {specialty.collegeCount} колледж(ей)
                      </Typography>
                    </Box>
                  </CardContent>

                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button 
                      component={Link} 
                      to={`/specialties/${specialty._id}`} 
                      variant="contained" 
                      fullWidth 
                      size="small"
                    >
                      Подробнее
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default EssayAnalyzer;