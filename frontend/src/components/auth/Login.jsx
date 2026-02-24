import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Login = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [hover, setHover] = useState(false);

    const from = location.state?.from?.pathname || '/';

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };


const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    console.log('Login form submitted with:', { email: formData.email, password: '***' });
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
        console.log('Login successful, redirecting to profile');
        navigate('/profile');
    } else {
        console.log('Login failed:', result.error);
        setError(result.error);
    }
    
    setLoading(false);
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
                                    p: { xs: 3, sm: 4, md: 6 },
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
                                <Box sx={{ textAlign: 'center', mb: 5 }}>
                                    <Box
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: 3,
                                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mx: 'auto',
                                            mb: 3,
                                            color: 'white',
                                            boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)',
                                            position: 'relative',
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                top: -5,
                                                left: -5,
                                                right: -5,
                                                bottom: -5,
                                                borderRadius: 4,
                                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                                opacity: 0.2,
                                                zIndex: -1,
                                            }
                                        }}
                                    >
                                        <PsychologyIcon sx={{ fontSize: 40 }} />
                                    </Box>
                                    <Typography 
                                        variant="h3" 
                                        sx={{ 
                                            fontWeight: 800, 
                                            mb: 1.5,
                                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                        }}
                                    >
                                        С возвращением!
                                    </Typography>
                                    <Typography 
                                        variant="body1" 
                                        color="text.secondary"
                                        sx={{ 
                                            fontSize: '1.1rem',
                                            maxWidth: '400px',
                                            mx: 'auto',
                                            lineHeight: 1.6
                                        }}
                                    >
                        Продолжите ваш путь к работе мечты вместе с нами
                                    </Typography>
                                </Box>

                                {error && (
                                    <Fade in>
                                        <Alert 
                                            severity="error" 
                                            sx={{ 
                                                mb: 3,
                                                borderRadius: 2,
                                                border: '1px solid',
                                                borderColor: 'error.light',
                                                backgroundColor: alpha(theme.palette.error.main, 0.05),
                                                '& .MuiAlert-icon': {
                                                    color: 'error.main'
                                                }
                                            }}
                                        >
                                            {error}
                                        </Alert>
                                    </Fade>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <Box sx={{ mb: 4 }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary', fontWeight: 600 }}>
                                            Email
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            placeholder="your.email@example.com"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 3,
                                                    backgroundColor: alpha(theme.palette.primary.main, 0.02),
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                                                        '& fieldset': {
                                                            borderColor: alpha(theme.palette.primary.main, 0.4),
                                                        }
                                                    },
                                                    '&.Mui-focused': {
                                                        backgroundColor: 'white',
                                                        '& fieldset': {
                                                            borderWidth: 2,
                                                            borderColor: theme.palette.primary.main,
                                                        }
                                                    },
                                                    '& fieldset': {
                                                        borderColor: alpha(theme.palette.divider, 0.5),
                                                    }
                                                },
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <EmailIcon 
                                                            sx={{ 
                                                                color: alpha(theme.palette.primary.main, 0.6),
                                                                ml: 0.5
                                                            }} 
                                                        />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary', fontWeight: 600 }}>
                                            Пароль
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            placeholder="Введите ваш пароль"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 3,
                                                    backgroundColor: alpha(theme.palette.primary.main, 0.02),
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                                                        '& fieldset': {
                                                            borderColor: alpha(theme.palette.primary.main, 0.4),
                                                        }
                                                    },
                                                    '&.Mui-focused': {
                                                        backgroundColor: 'white',
                                                        '& fieldset': {
                                                            borderWidth: 2,
                                                            borderColor: theme.palette.primary.main,
                                                        }
                                                    },
                                                    '& fieldset': {
                                                        borderColor: alpha(theme.palette.divider, 0.5),
                                                    }
                                                },
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LockIcon 
                                                            sx={{ 
                                                                color: alpha(theme.palette.primary.main, 0.6),
                                                                ml: 0.5
                                                            }} 
                                                        />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            edge="end"
                                                            sx={{
                                                                mr: 0.5,
                                                                color: alpha(theme.palette.primary.main, 0.6),
                                                                '&:hover': {
                                                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                                }
                                                            }}
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
                                        <Button
                                            component={Link}
                                            to="/forgot-password"
                                            sx={{
                                                textTransform: 'none',
                                                fontWeight: 500,
                                                color: 'text.secondary',
                                                p: 0,
                                                fontSize: '0.9rem',
                                                borderRadius: 1,
                                                px: 1,
                                                '&:hover': {
                                                    color: 'primary.main',
                                                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                                                }
                                            }}
                                        >
                                            Забыли пароль?
                                        </Button>
                                    </Box>

                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        disabled={loading}
                                        onMouseEnter={() => setHover(true)}
                                        onMouseLeave={() => setHover(false)}
                                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                                        sx={{
                                            py: 1.75,
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            borderRadius: 3,
                                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                            boxShadow: hover 
                                                ? '0 20px 40px rgba(99, 102, 241, 0.4)'
                                                : '0 10px 30px rgba(99, 102, 241, 0.3)',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            transform: hover ? 'translateY(-2px)' : 'none',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                                transform: 'translateY(-2px)',
                                            },
                                            '&:active': {
                                                transform: 'translateY(0)',
                                            },
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: '-100%',
                                                width: '100%',
                                                height: '100%',
                                                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                                                transition: 'left 0.7s',
                                            },
                                            '&:hover::after': {
                                                left: '100%',
                                            }
                                        }}
                                    >
                                        {loading ? 'Входим...' : 'Войти в аккаунт'}
                                    </Button>
                                </form>

                                <Divider sx={{ my: 4, color: 'text.secondary', '&::before, &::after': {
                                    borderColor: alpha(theme.palette.divider, 0.3),
                                } }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Нет аккаунта?
                                    </Typography>
                                </Divider>

                                <Box sx={{ textAlign: 'center' }}>
                                    <Button
                                        component={Link}
                                        to="/register"
                                        fullWidth
                                        variant="outlined"
                                        startIcon={<PersonAddIcon />}
                                        sx={{
                                            py: 1.5,
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            borderRadius: 3,
                                            borderWidth: 2,
                                            borderColor: alpha(theme.palette.primary.main, 0.3),
                                            color: 'primary.main',
                                            transition: 'all 0.3s',
                                            '&:hover': {
                                                borderColor: 'primary.main',
                                                backgroundColor: alpha(theme.palette.primary.main, 0.04),
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 10px 25px rgba(99, 102, 241, 0.15)',
                                            }
                                        }}
                                    >
                                        Создать новый аккаунт
                                    </Button>
                                </Box>
                            </Paper>
                        </Zoom>
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
};

export default Login;