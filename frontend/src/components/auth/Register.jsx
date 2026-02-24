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
    Grid,
    alpha,
    useTheme,
    CircularProgress,
    Fade,
    Zoom,
    Divider,
    FormControlLabel,
    Checkbox
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
import VerifiedIcon from '@mui/icons-material/Verified';

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
        middleName: '' // Добавляем отчество
    });
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [hover, setHover] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleAgreementChange = (e) => {
        setAgreedToTerms(e.target.checked);
    };

   const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { email, password, confirmPassword, firstName, lastName, middleName } = formData;
    
    if (password !== confirmPassword) {
        setError('Пароли не совпадают');
        setLoading(false);
        return;
    }
    
    if (password.length < 6) {
        setError('Пароль должен содержать минимум 6 символов');
        setLoading(false);
        return;
    }
    
    const userData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        middleName: middleName ? middleName.trim() : '',
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

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(circle at 100% 0%, rgba(139, 92, 246, 0.08) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(99, 102, 241, 0.08) 0%, transparent 50%)',
                backgroundColor: '#f8fafc',
                py: { xs: 2, sm: 4 },
                px: { xs: 1, sm: 2 },
            }}
        >
            <Container maxWidth="md">
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
                                        Начните своё путешествие
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
                                        Присоединяйтесь к тысячам профессионалов, которые уже нашли свой путь
                                    </Typography>
                                </Box>

                                {error && (
                                    <Fade in>
                                        <Alert 
                                            severity="error" 
                                            sx={{ 
                                                mb: 4,
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
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={4}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary', fontWeight: 600 }}>
                                                    Фамилия*
                                                </Typography>
                                                <TextField
                                                    fullWidth
                                                    placeholder="Иванов"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={loading}
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
                                                                <PersonIcon 
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
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary', fontWeight: 600 }}>
                                                    Имя*
                                                </Typography>
                                                <TextField
                                                    fullWidth
                                                    placeholder="Иван"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={loading}
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
                                                                <PersonIcon 
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
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary', fontWeight: 600 }}>
                                                    Отчество
                                                </Typography>
                                                <TextField
                                                    fullWidth
                                                    placeholder="Иванович"
                                                    name="middleName"
                                                    value={formData.middleName}
                                                    onChange={handleChange}
                                                    disabled={loading}
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
                                                                <PersonIcon 
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
                                        </Grid>
                                    </Grid>

                                    <Box sx={{ mb: 2, mt: 1 }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary', fontWeight: 600 }}>
                                            Email*
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            placeholder="your.email@example.com"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            disabled={loading}
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
                                            Пароль*
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            placeholder="Минимум 6 символов"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            disabled={loading}
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
                                                            disabled={loading}
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
                                        <Typography variant="caption" color="text.secondary" sx={{ ml: 2, mt: 0.5, display: 'block' }}>
                                            Минимум 6 символов
                                        </Typography>
                                    </Box>

                                    <Box sx={{ mb: 4 }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary', fontWeight: 600 }}>
                                            Подтвердите пароль*
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            placeholder="Повторите пароль"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            disabled={loading}
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
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            edge="end"
                                                            disabled={loading}
                                                            sx={{
                                                                mr: 0.5,
                                                                color: alpha(theme.palette.primary.main, 0.6),
                                                                '&:hover': {
                                                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                                }
                                                            }}
                                                        >
                                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Box>

                                    <Box 
                                        sx={{ 
                                            mb: 4,
                                            p: 3,
                                            borderRadius: 3,
                                            backgroundColor: alpha(theme.palette.primary.main, 0.02),
                                            border: '1px solid',
                                            borderColor: alpha(theme.palette.primary.main, 0.1),
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                backgroundColor: alpha(theme.palette.primary.main, 0.04),
                                                borderColor: alpha(theme.palette.primary.main, 0.2),
                                            }
                                        }}
                                    >
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={agreedToTerms}
                                                    onChange={handleAgreementChange}
                                                    disabled={loading}
                                                    icon={
                                                        <Box
                                                            sx={{
                                                                width: 20,
                                                                height: 20,
                                                                borderRadius: 1,
                                                                border: '2px solid',
                                                                borderColor: alpha(theme.palette.primary.main, 0.3),
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            }}
                                                        />
                                                    }
                                                    checkedIcon={
                                                        <Box
                                                            sx={{
                                                                width: 20,
                                                                height: 20,
                                                                borderRadius: 1,
                                                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: 'white',
                                                            }}
                                                        >
                                                            <VerifiedIcon sx={{ fontSize: 14 }} />
                                                        </Box>
                                                    }
                                                    sx={{
                                                        '&:hover': {
                                                            '& .MuiBox-root': {
                                                                borderColor: alpha(theme.palette.primary.main, 0.6),
                                                            }
                                                        }
                                                    }}
                                                />
                                            }
                                            label={
                                                <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.6 }}>
                                                    Я согласен(на) на обработку моих персональных данных в соответствии с{' '}
                                                    <Button
                                                        component={Link}
                                                        to="/privacy"
                                                        sx={{
                                                            textTransform: 'none',
                                                            fontWeight: 600,
                                                            color: 'primary.main',
                                                            fontSize: '0.875rem',
                                                            p: 0,
                                                            minWidth: 'auto',
                                                            verticalAlign: 'baseline',
                                                            '&:hover': {
                                                                color: theme.palette.primary.dark,
                                                                backgroundColor: 'transparent',
                                                            }
                                                        }}
                                                    >
                                                        Политикой конфиденциальности
                                                    </Button>
                                                    {' '}и даю согласие на получение информационных материалов
                                                </Typography>
                                            }
                                            sx={{
                                                alignItems: 'flex-start',
                                                m: 0,
                                                '& .MuiFormControlLabel-label': {
                                                    marginTop: 0.5,
                                                }
                                            }}
                                        />
                                    </Box>

                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2, textAlign: 'center' }}>
                                        * - обязательные поля
                                    </Typography>

                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        disabled={loading || !agreedToTerms}
                                        onMouseEnter={() => setHover(true)}
                                        onMouseLeave={() => setHover(false)}
                                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
                                        sx={{
                                            py: 1.75,
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            borderRadius: 3,
                                            background: !agreedToTerms 
                                                ? alpha(theme.palette.grey[400], 0.5)
                                                : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                            boxShadow: hover && agreedToTerms
                                                ? '0 20px 40px rgba(99, 102, 241, 0.4)'
                                                : '0 10px 30px rgba(99, 102, 241, 0.3)',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            transform: hover && agreedToTerms ? 'translateY(-2px)' : 'none',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&:hover': {
                                                background: agreedToTerms 
                                                    ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                                                    : alpha(theme.palette.grey[400], 0.5),
                                                transform: agreedToTerms ? 'translateY(-2px)' : 'none',
                                            },
                                            '&:active': {
                                                transform: 'translateY(0)',
                                            },
                                            '&::after': agreedToTerms ? {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: '-100%',
                                                width: '100%',
                                                height: '100%',
                                                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                                                transition: 'left 0.7s',
                                            } : {},
                                            '&:hover::after': agreedToTerms ? {
                                                left: '100%',
                                            } : {}
                                        }}
                                    >
                                        {loading ? 'Регистрируем...' : 'Создать аккаунт'}
                                    </Button>
                                </form>

                                <Divider sx={{ my: 4, color: 'text.secondary', '&::before, &::after': {
                                    borderColor: alpha(theme.palette.divider, 0.3),
                                } }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Уже есть аккаунт?
                                    </Typography>
                                </Divider>

                                <Box sx={{ textAlign: 'center' }}>
                                    <Button
                                        component={Link}
                                        to="/login"
                                        fullWidth
                                        variant="outlined"
                                        startIcon={<LoginIcon />}
                                        disabled={loading}
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
                                        Войти в существующий аккаунт
                                    </Button>
                                </Box>

                                <Box sx={{ mt: 4, textAlign: 'center' }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                        Нажимая "Создать аккаунт", вы также соглашаетесь с нашими{' '}
                                        <Button
                                            component={Link}
                                            to="/terms"
                                            sx={{
                                                textTransform: 'none',
                                                fontWeight: 500,
                                                color: 'text.secondary',
                                                fontSize: '0.75rem',
                                                p: 0,
                                                minWidth: 'auto',
                                                '&:hover': {
                                                    color: 'primary.main',
                                                }
                                            }}
                                        >
                                            Условиями использования
                                        </Button>
                                    </Typography>
                                </Box>
                            </Paper>
                        </Zoom>
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
};

export default Register;