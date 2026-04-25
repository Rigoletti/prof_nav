import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Paper,
    Alert,
    InputAdornment,
    IconButton,
    alpha,
    useTheme,
    Fade,
    Zoom,
    CircularProgress,
    Divider
} from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LoginIcon from '@mui/icons-material/Login';

const Register = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { register } = useAuth();
    
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        middleName: ''
    });
    const [errors, setErrors] = useState({
        email: '',
        firstName: '',
        lastName: '',
        middleName: '',
        password: '',
        confirmPassword: ''
    });
    const [touched, setTouched] = useState({
        email: false,
        firstName: false,
        lastName: false,
        middleName: false,
        password: false,
        confirmPassword: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [hover, setHover] = useState(false);

    // Регулярные выражения для валидации
    const cyrillicNameRegex = /^[А-ЯЁа-яё\s\-]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateName = (name, fieldName) => {
        if (!name.trim()) {
            return `${fieldName} обязательно для заполнения`;
        }
        if (!cyrillicNameRegex.test(name)) {
            return `${fieldName} должно содержать только буквы кириллицы`;
        }
        if (name.trim().length < 2) {
            return `${fieldName} должно содержать минимум 2 символа`;
        }
        if (name.trim().length > 50) {
            return `${fieldName} должно содержать максимум 50 символов`;
        }
        return '';
    };

    const validateEmail = (email) => {
        if (!email) {
            return 'Email обязателен для заполнения';
        }
        if (!emailRegex.test(email)) {
            return 'Введите корректный email адрес';
        }
        if (email.length > 100) {
            return 'Email не должен превышать 100 символов';
        }
        return '';
    };

    const validatePassword = (password) => {
        if (!password) {
            return 'Пароль обязателен для заполнения';
        }
        if (password.length < 6) {
            return 'Пароль должен содержать минимум 6 символов';
        }
        if (password.length > 50) {
            return 'Пароль должен содержать максимум 50 символов';
        }
        return '';
    };

    const validateConfirmPassword = (password, confirmPassword) => {
        if (!confirmPassword) {
            return 'Подтверждение пароля обязательно';
        }
        if (password !== confirmPassword) {
            return 'Пароли не совпадают';
        }
        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData({
            ...formData,
            [name]: value
        });
        
        setError('');
        
        // Если поле было тронуто, валидируем в реальном времени
        if (touched[name]) {
            let errorMessage = '';
            switch (name) {
                case 'lastName':
                    errorMessage = validateName(value, 'Фамилия');
                    break;
                case 'firstName':
                    errorMessage = validateName(value, 'Имя');
                    break;
                case 'middleName':
                    if (value.trim()) {
                        errorMessage = validateName(value, 'Отчество');
                    }
                    break;
                case 'email':
                    errorMessage = validateEmail(value);
                    break;
                case 'password':
                    errorMessage = validatePassword(value);
                    if (!errorMessage && touched.confirmPassword && formData.confirmPassword) {
                        const confirmError = validateConfirmPassword(value, formData.confirmPassword);
                        setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
                    }
                    break;
                case 'confirmPassword':
                    errorMessage = validateConfirmPassword(formData.password, value);
                    break;
                default:
                    break;
            }
            
            setErrors(prev => ({ ...prev, [name]: errorMessage }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        
        // Отмечаем поле как тронутое
        setTouched(prev => ({ ...prev, [name]: true }));
        
        // Валидируем при потере фокуса
        let errorMessage = '';
        switch (name) {
            case 'lastName':
                errorMessage = validateName(value, 'Фамилия');
                break;
            case 'firstName':
                errorMessage = validateName(value, 'Имя');
                break;
            case 'middleName':
                if (value.trim()) {
                    errorMessage = validateName(value, 'Отчество');
                }
                break;
            case 'email':
                errorMessage = validateEmail(value);
                break;
            case 'password':
                errorMessage = validatePassword(value);
                if (!errorMessage && touched.confirmPassword && formData.confirmPassword) {
                    const confirmError = validateConfirmPassword(value, formData.confirmPassword);
                    setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
                }
                break;
            case 'confirmPassword':
                errorMessage = validateConfirmPassword(formData.password, value);
                break;
            default:
                break;
        }
        
        setErrors(prev => ({ ...prev, [name]: errorMessage }));
    };

    const validateForm = () => {
        // Отмечаем все поля как тронутые
        const allTouched = {
            lastName: true,
            firstName: true,
            middleName: !!formData.middleName.trim(),
            email: true,
            password: true,
            confirmPassword: true
        };
        setTouched(allTouched);
        
        const newErrors = {
            lastName: validateName(formData.lastName, 'Фамилия'),
            firstName: validateName(formData.firstName, 'Имя'),
            middleName: formData.middleName.trim() ? validateName(formData.middleName, 'Отчество') : '',
            email: validateEmail(formData.email),
            password: validatePassword(formData.password),
            confirmPassword: validateConfirmPassword(formData.password, formData.confirmPassword)
        };
        
        setErrors(newErrors);
        
        return !Object.values(newErrors).some(error => error !== '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setError('');
        
        if (!validateForm()) {
            setError('Пожалуйста, исправьте ошибки в форме');
            return;
        }
        
        setLoading(true);
        
        const { email, password, firstName, lastName, middleName } = formData;
        
        const userData = {
            firstName: firstName.trim().replace(/\s+/g, ' '),
            lastName: lastName.trim().replace(/\s+/g, ' '),
            middleName: middleName ? middleName.trim().replace(/\s+/g, ' ') : '',
            email: email.trim().toLowerCase(),
            password
        };
        
        console.log('Register form submitted with:', { ...userData, password: '***' });
        
        const result = await register(userData);
        
        if (result.success) {
            console.log('Registration successful, redirecting to profile');
            navigate('/profile');
        } else {
            console.log('Registration failed:', result.error);
            setError(result.error);
        }
        
        setLoading(false);
    };

    const isFormValid = () => {
        return !errors.lastName && 
               !errors.firstName && 
               !errors.middleName && 
               !errors.email && 
               !errors.password && 
               !errors.confirmPassword &&
               formData.lastName &&
               formData.firstName &&
               formData.email &&
               formData.password &&
               formData.confirmPassword;
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.08) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(139, 92, 246, 0.08) 0%, transparent 50%)',
                backgroundColor: '#f8fafc',
                py: { xs: 2, sm: 4 },
                px: { xs: 1, sm: 2 },
            }}
        >
            <Container maxWidth="sm">
                <Fade in timeout={800}>
                    <Box>
                        <Button
                            component={Link}
                            to="/"
                            startIcon={<ArrowBackIcon />}
                            sx={{
                                mb: 4,
                                color: 'text.secondary',
                                borderRadius: 2,
                                px: 2,
                                py: 1,
                                transition: 'all 0.2s',
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.06),
                                    transform: 'translateX(-4px)',
                                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.1)',
                                },
                            }}
                        >
                            На главную
                        </Button>

                        <Zoom in timeout={1000}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: { xs: 3, sm: 4, md: 5 },
                                    borderRadius: 4,
                                    background: 'linear-gradient(145deg, #ffffff 0%, #fafafa 100%)',
                                    boxShadow: `
                                        0 25px 50px -12px rgba(0, 0, 0, 0.08),
                                        0 0 0 1px rgba(0, 0, 0, 0.02)
                                    `,
                                    backdropFilter: 'blur(20px)',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '6px',
                                        background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                                    }
                                }}
                            >
                                <Box sx={{ textAlign: 'center', mb: 4 }}>
                                    <Box
                                        sx={{
                                            width: 70,
                                            height: 70,
                                            borderRadius: 3,
                                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mx: 'auto',
                                            mb: 2.5,
                                            color: 'white',
                                            boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)',
                                        }}
                                    >
                                        <PsychologyIcon sx={{ fontSize: 35 }} />
                                    </Box>
                                    <Typography 
                                        variant="h4" 
                                        sx={{ 
                                            fontWeight: 700, 
                                            mb: 1,
                                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                        }}
                                    >
                                        Добро пожаловать!
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary"
                                    >
                                        Заполните форму ниже чтобы создать аккаунт
                                    </Typography>
                                </Box>

                                {(error || Object.values(errors).some(e => e && Object.values(touched).some(t => t))) && (
                                    <Fade in>
                                        <Alert 
                                            severity="error" 
                                            sx={{ 
                                                mb: 3,
                                                borderRadius: 2,
                                            }}
                                        >
                                            {error || 'Пожалуйста, исправьте ошибки в форме'}
                                        </Alert>
                                    </Fade>
                                )}

                                <form onSubmit={handleSubmit}>
                                    {/* Фамилия */}
                                    <Box sx={{ mb: 2.5 }}>
                                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#1a1a2e' }}>
                                            Фамилия *
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            placeholder="Иванов"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            required
                                            disabled={loading}
                                            error={touched.lastName && !!errors.lastName}
                                            helperText={touched.lastName && errors.lastName}
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    backgroundColor: '#f8f9fa',
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        backgroundColor: '#f1f3f5',
                                                    },
                                                    '&.Mui-focused': {
                                                        backgroundColor: 'white',
                                                    }
                                                },
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PersonIcon sx={{ color: '#764ba2', fontSize: 20 }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Box>

                                    {/* Имя */}
                                    <Box sx={{ mb: 2.5 }}>
                                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#1a1a2e' }}>
                                            Имя *
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            placeholder="Иван"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            required
                                            disabled={loading}
                                            error={touched.firstName && !!errors.firstName}
                                            helperText={touched.firstName && errors.firstName}
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    backgroundColor: '#f8f9fa',
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        backgroundColor: '#f1f3f5',
                                                    },
                                                    '&.Mui-focused': {
                                                        backgroundColor: 'white',
                                                    }
                                                },
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PersonIcon sx={{ color: '#764ba2', fontSize: 20 }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Box>

                                    {/* Отчество */}
                                    <Box sx={{ mb: 2.5 }}>
                                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#1a1a2e' }}>
                                            Отчество
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            placeholder="Иванович"
                                            name="middleName"
                                            value={formData.middleName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            disabled={loading}
                                            error={touched.middleName && !!errors.middleName}
                                            helperText={touched.middleName && errors.middleName}
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    backgroundColor: '#f8f9fa',
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        backgroundColor: '#f1f3f5',
                                                    },
                                                    '&.Mui-focused': {
                                                        backgroundColor: 'white',
                                                    }
                                                },
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PersonIcon sx={{ color: '#764ba2', fontSize: 20 }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Box>

                                    {/* Email */}
                                    <Box sx={{ mb: 2.5 }}>
                                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#1a1a2e' }}>
                                            Email *
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            placeholder="your@email.com"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            required
                                            disabled={loading}
                                            error={touched.email && !!errors.email}
                                            helperText={touched.email && errors.email}
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    backgroundColor: '#f8f9fa',
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        backgroundColor: '#f1f3f5',
                                                    },
                                                    '&.Mui-focused': {
                                                        backgroundColor: 'white',
                                                    }
                                                },
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <EmailIcon sx={{ color: '#764ba2', fontSize: 20 }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Box>

                                    {/* Пароль */}
                                    <Box sx={{ mb: 2.5 }}>
                                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#1a1a2e' }}>
                                            Пароль *
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            placeholder="Минимум 6 символов"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            required
                                            disabled={loading}
                                            error={touched.password && !!errors.password}
                                            helperText={touched.password && errors.password}
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    backgroundColor: '#f8f9fa',
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        backgroundColor: '#f1f3f5',
                                                    },
                                                    '&.Mui-focused': {
                                                        backgroundColor: 'white',
                                                    }
                                                },
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LockIcon sx={{ color: '#764ba2', fontSize: 20 }} />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            edge="end"
                                                            size="small"
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Box>

                                    {/* Подтверждение пароля */}
                                    <Box sx={{ mb: 3.5 }}>
                                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#1a1a2e' }}>
                                            Подтверждение пароля *
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            placeholder="Повторите пароль"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            required
                                            disabled={loading}
                                            error={touched.confirmPassword && !!errors.confirmPassword}
                                            helperText={touched.confirmPassword && errors.confirmPassword}
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    backgroundColor: '#f8f9fa',
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        backgroundColor: '#f1f3f5',
                                                    },
                                                    '&.Mui-focused': {
                                                        backgroundColor: 'white',
                                                    }
                                                },
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LockIcon sx={{ color: '#764ba2', fontSize: 20 }} />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            edge="end"
                                                            size="small"
                                                        >
                                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Box>

                                    {/* Кнопка регистрации */}
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        disabled={loading || !isFormValid()}
                                        onMouseEnter={() => setHover(true)}
                                        onMouseLeave={() => setHover(false)}
                                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
                                        sx={{
                                            py: 1.3,
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            borderRadius: 2,
                                            background: !isFormValid() 
                                                ? alpha(theme.palette.grey[400], 0.5)
                                                : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                            textTransform: 'none',
                                            boxShadow: hover && isFormValid()
                                                ? '0 8px 20px rgba(99, 102, 241, 0.3)'
                                                : 'none',
                                            transition: 'all 0.3s',
                                            transform: hover && isFormValid() ? 'translateY(-1px)' : 'none',
                                            '&:hover': {
                                                background: isFormValid() 
                                                    ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                                                    : alpha(theme.palette.grey[400], 0.5),
                                                transform: isFormValid() ? 'translateY(-1px)' : 'none',
                                                boxShadow: isFormValid() ? '0 8px 20px rgba(99, 102, 241, 0.3)' : 'none',
                                            }
                                        }}
                                    >
                                        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                                    </Button>
                                </form>

                                <Divider sx={{ my: 3.5 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Уже есть аккаунт?
                                    </Typography>
                                </Divider>

                                <Button
                                    component={Link}
                                    to="/login"
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<LoginIcon />}
                                    sx={{
                                        py: 1.2,
                                        fontSize: '0.95rem',
                                        fontWeight: 600,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        borderColor: '#e0e0e0',
                                        color: '#555',
                                        '&:hover': {
                                            borderColor: '#764ba2',
                                            backgroundColor: alpha('#764ba2', 0.05),
                                        }
                                    }}
                                >
                                    Войти в аккаунт
                                </Button>

                                <Typography 
                                    variant="caption" 
                                    color="text.secondary" 
                                    sx={{ 
                                        display: 'block', 
                                        textAlign: 'center', 
                                        mt: 2.5,
                                        fontSize: '0.7rem'
                                    }}
                                >
                                    * - обязательные поля
                                </Typography>
                            </Paper>
                        </Zoom>
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
};

export default Register;