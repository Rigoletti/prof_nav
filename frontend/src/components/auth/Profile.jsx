import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Avatar,
  Grid,
  Divider,
  Alert,
  Card,
  CardContent,
  IconButton,
  alpha,
  useTheme,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LockIcon from '@mui/icons-material/Lock';

const Profile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, updateProfile, changePassword } = useAuth();
  
  const [editMode, setEditMode] = useState(false);
  const [passwordEditMode, setPasswordEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '', // Добавляем отчество
    avatar: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        middleName: user.middleName || '', // Загружаем отчество
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setMessage({ type: 'error', text: 'Имя и фамилия не могут быть пустыми' });
      setLoading(false);
      setSnackbarOpen(true);
      return;
    }

    const result = await updateProfile(formData);

    if (result.success) {
      setMessage({ type: 'success', text: 'Профиль успешно обновлён' });
      setEditMode(false);
    } else {
      setMessage({ type: 'error', text: result.message || 'Ошибка обновления профиля' });
    }

    setLoading(false);
    setSnackbarOpen(true);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Новые пароли не совпадают' });
      setLoading(false);
      setSnackbarOpen(true);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Пароль должен содержать минимум 6 символов' });
      setLoading(false);
      setSnackbarOpen(true);
      return;
    }

    const result = await changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });

    if (result.success) {
      setMessage({ type: 'success', text: 'Пароль успешно изменён' });
      setPasswordEditMode(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } else {
      setMessage({ type: 'error', text: result.message || 'Ошибка изменения пароля' });
    }

    setLoading(false);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Функция для отображения полного имени
  const getFullName = () => {
    const parts = [];
    if (user.lastName) parts.push(user.lastName);
    if (user.firstName) parts.push(user.firstName);
    if (user.middleName) parts.push(user.middleName);
    return parts.join(' ');
  };

  // Функция для отображения инициалов
  const getInitials = () => {
    const initials = [];
    if (user.firstName) initials.push(user.firstName[0]);
    if (user.lastName) initials.push(user.lastName[0]);
    if (user.middleName) initials.push(user.middleName[0]);
    return initials.join('');
  };

  if (!user) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Button
          onClick={() => navigate('/')}
          startIcon={<ArrowBackIcon />}
          sx={{
            mb: 4,
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          На главную
        </Button>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                border: '1px solid',
                borderColor: 'grey.200',
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    mb: 3,
                    fontSize: '2.5rem',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  }}
                >
                  {getInitials()}
                </Avatar>

                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  {getFullName()}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                  <CalendarTodayIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    Зарегистрирован {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                  </Typography>
                </Box>

                <Button
                  startIcon={<EditIcon />}
                  onClick={() => setEditMode(!editMode)}
                  variant="outlined"
                  fullWidth
                  disabled={loading}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                  }}
                >
                  {editMode ? 'Отмена' : 'Редактировать профиль'}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={handleSnackbarClose}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Alert 
                onClose={handleSnackbarClose} 
                severity={message.type} 
                sx={{ width: '100%' }}
              >
                {message.text}
              </Alert>
            </Snackbar>

            {editMode ? (
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 3,
                  mb: 4,
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Редактирование профиля
                </Typography>

                <form onSubmit={handleProfileSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Фамилия"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleProfileChange}
                        required
                        disabled={loading}
                        InputProps={{
                          startAdornment: (
                            <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Имя"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleProfileChange}
                        required
                        disabled={loading}
                        InputProps={{
                          startAdornment: (
                            <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Отчество"
                        name="middleName"
                        value={formData.middleName}
                        onChange={handleProfileChange}
                        disabled={loading}
                        InputProps={{
                          startAdornment: (
                            <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          ),
                        }}
                      />
                    </Grid>
               
                  </Grid>

                  <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                      disabled={loading}
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                        },
                      }}
                    >
                      {loading ? 'Сохранение...' : 'Сохранить изменения'}
                    </Button>
                    <Button
                      onClick={() => setEditMode(false)}
                      variant="outlined"
                      disabled={loading}
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                      }}
                    >
                      Отмена
                    </Button>
                  </Box>
                </form>
              </Paper>
            ) : (
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 3,
                  mb: 4,
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Информация профиля
                  </Typography>
                  <IconButton onClick={() => setEditMode(true)} disabled={loading}>
                    <EditIcon />
                  </IconButton>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Фамилия
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {user.lastName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Имя
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {user.firstName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Отчество
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {user.middleName || '—'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Email
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {user.email}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Дата регистрации
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {new Date(user.createdAt).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}

            <Paper
              sx={{
                p: 4,
                borderRadius: 3,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Безопасность
                </Typography>
                <Button
                  onClick={() => setPasswordEditMode(!passwordEditMode)}
                  variant="outlined"
                  size="small"
                  disabled={loading}
                >
                  {passwordEditMode ? 'Отмена' : 'Изменить пароль'}
                </Button>
              </Box>

              {passwordEditMode ? (
                <form onSubmit={handlePasswordSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Текущий пароль"
                        name="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        disabled={loading}
                        InputProps={{
                          startAdornment: <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Новый пароль"
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        disabled={loading}
                        InputProps={{
                          startAdornment: <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Подтвердите новый пароль"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        disabled={loading}
                        InputProps={{
                          startAdornment: <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                        },
                      }}
                    >
                      {loading ? <CircularProgress size={20} color="inherit" /> : 'Изменить пароль'}
                    </Button>
                    <Button
                      onClick={() => {
                        setPasswordEditMode(false);
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                      }}
                      variant="outlined"
                      disabled={loading}
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                      }}
                    >
                      Отмена
                    </Button>
                  </Box>
                </form>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Для изменения пароля нажмите кнопку "Изменить пароль"
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Profile;