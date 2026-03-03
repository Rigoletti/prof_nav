import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Container,
    Divider,
    useTheme,
    alpha,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import WorkIcon from '@mui/icons-material/Work';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
    const [testsMenuAnchor, setTestsMenuAnchor] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleTestsMenuOpen = (event) => {
        setTestsMenuAnchor(event.currentTarget);
    };

    const handleTestsMenuClose = () => {
        setTestsMenuAnchor(null);
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMenuAnchor(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMenuAnchor(null);
    };

    const handleLogout = async () => {
        await logout();
        handleMenuClose();
        handleMobileMenuClose();
        navigate('/');
    };

    const handleProfile = () => {
        handleMenuClose();
        navigate('/profile');
    };

    const tests = [
        { 
            label: 'Комплексный тест', 
            path: '/test/comprehensive',
            icon: <AutoAwesomeIcon />,
            description: '5 методик за 40 вопросов',
            color: '#764ba2'
        },
        { 
            label: 'Тест Климова', 
            path: '/test/klimov',
            icon: <PsychologyIcon />,
            description: 'Тип личности',
            color: '#6366f1'
        },
        { 
            label: 'Карта интересов', 
            path: '/test/golomshtok',
            icon: <AutoStoriesIcon />,
            description: 'Методика Голомштока',
            color: '#8b5cf6'
        },
        { 
            label: 'Тест Голланда', 
            path: '/test/holland',
            icon: <WorkIcon />,
            description: 'Типы профессиональной среды',
            color: '#10b981'
        },
        { 
            label: 'Тест Йовайши', 
            path: '/test/yovaysha',
            icon: <PsychologyAltIcon />,
            description: 'Склонности к сферам деятельности',
            color: '#ec4899'
        },
        { 
            label: 'Методика Л.А. Йовайши', 
            path: '/test/yovayshala',
            icon: <PsychologyAltIcon />,
            description: 'Предпочтения в работе',
            color: '#f59e0b'
        }
    ];

    const navItems = [
        { label: 'Главная', path: '/' },
        { label: 'Специальности', path: '/specialties' },
        { label: 'Колледжи', path: '/colleges' },
        { label: 'Рядом со мной', path: '/nearby' },
    ];

    return (
        <AppBar 
            position="sticky" 
            sx={{ 
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ py: 1 }}>
                    {/* Логотип */}
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={handleMobileMenuOpen}
                            sx={{ mr: 2, display: { xs: 'flex', md: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        
                        <Box 
                            component={RouterLink} 
                            to="/"
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                textDecoration: 'none',
                                color: 'inherit'
                            }}
                        >
                            <AutoAwesomeIcon sx={{ mr: 1, fontSize: 32 }} />
                            <Typography
                                variant="h6"
                                noWrap
                                sx={{
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    letterSpacing: '.2rem',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                }}
                            >
                                ПрофНавигатор
                            </Typography>
                        </Box>
                    </Box>

                    {/* Десктопное меню */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
                        {navItems.map((item) => (
                            <Button
                                key={item.path}
                                component={RouterLink}
                                to={item.path}
                                sx={{
                                    color: 'white',
                                    fontWeight: location.pathname === item.path ? 700 : 400,
                                    position: 'relative',
                                    '&:after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: -2,
                                        left: 0,
                                        right: 0,
                                        height: '2px',
                                        backgroundColor: location.pathname === item.path ? 'white' : 'transparent',
                                    },
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.common.white, 0.1),
                                    }
                                }}
                            >
                                {item.label}
                            </Button>
                        ))}
                        
                        {/* Кнопка Тесты с выпадающим меню */}
                        <Button
                            onClick={handleTestsMenuOpen}
                            sx={{
                                color: 'white',
                                fontWeight: location.pathname.startsWith('/test') ? 700 : 400,
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                                }
                            }}
                        >
                            Тесты
                        </Button>
                        
                        <Menu
                            anchorEl={testsMenuAnchor}
                            open={Boolean(testsMenuAnchor)}
                            onClose={handleTestsMenuClose}
                            PaperProps={{
                                sx: {
                                    mt: 1.5,
                                    minWidth: 320,
                                    maxHeight: 400,
                                    borderRadius: 2,
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                                }
                            }}
                        >
                            {tests.map((test) => (
                                <MenuItem
                                    key={test.path}
                                    component={RouterLink}
                                    to={test.path}
                                    onClick={handleTestsMenuClose}
                                    selected={location.pathname === test.path}
                                    sx={{
                                        py: 1.5,
                                        '&.Mui-selected': {
                                            backgroundColor: alpha(test.color, 0.1),
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{ color: test.color, minWidth: 40 }}>
                                        {test.icon}
                                    </ListItemIcon>
                                    <ListItemText>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {test.label}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {test.description}
                                        </Typography>
                                    </ListItemText>
                                </MenuItem>
                            ))}
                        </Menu>

                        {user?.isAdmin && (
                            <Button
                                component={RouterLink}
                                to="/admin"
                                sx={{
                                    color: 'white',
                                    fontWeight: location.pathname.startsWith('/admin') ? 700 : 400,
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.common.white, 0.1),
                                    }
                                }}
                            >
                                Админ-панель
                            </Button>
                        )}
                    </Box>

                    {/* Правая часть - пользователь */}
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                        {user ? (
                            <>
                                <IconButton
                                    onClick={handleMenuOpen}
                                    sx={{ 
                                        p: 0.5,
                                        '&:hover': {
                                            backgroundColor: alpha(theme.palette.common.white, 0.1),
                                        }
                                    }}
                                >
                                    <Avatar 
                                        sx={{ 
                                            width: 40, 
                                            height: 40,
                                            backgroundColor: alpha(theme.palette.common.white, 0.2),
                                            color: 'white'
                                        }}
                                    >
                                        {user.firstName?.[0]}{user.lastName?.[0]}
                                    </Avatar>
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                    PaperProps={{
                                        sx: {
                                            mt: 1.5,
                                            minWidth: 200,
                                            borderRadius: 2,
                                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                                        }
                                    }}
                                >
                                    <MenuItem onClick={handleProfile}>
                                        <ListItemIcon>
                                            <Avatar sx={{ width: 24, height: 24, fontSize: '0.875rem' }}>
                                                {user.firstName?.[0]}{user.lastName?.[0]}
                                            </Avatar>
                                        </ListItemIcon>
                                        <ListItemText>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {user.firstName} {user.lastName}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {user.email}
                                            </Typography>
                                        </ListItemText>
                                    </MenuItem>
                                    
                                    <Divider />
                                    
                                    <MenuItem 
                                        component={RouterLink} 
                                        to="/test/comprehensive"
                                        onClick={handleMenuClose}
                                    >
                                        <ListItemIcon>
                                            <AutoAwesomeIcon fontSize="small" sx={{ color: '#764ba2' }} />
                                        </ListItemIcon>
                                        <ListItemText>Комплексный тест</ListItemText>
                                    </MenuItem>
                                    
                                    <MenuItem 
                                        component={RouterLink} 
                                        to="/test/klimov"
                                        onClick={handleMenuClose}
                                    >
                                        <ListItemIcon>
                                            <PsychologyIcon fontSize="small" sx={{ color: '#6366f1' }} />
                                        </ListItemIcon>
                                        <ListItemText>Тест Климова</ListItemText>
                                    </MenuItem>
                                    
                                    <MenuItem 
                                        component={RouterLink} 
                                        to="/test/golomshtok"
                                        onClick={handleMenuClose}
                                    >
                                        <ListItemIcon>
                                            <AutoStoriesIcon fontSize="small" sx={{ color: '#8b5cf6' }} />
                                        </ListItemIcon>
                                        <ListItemText>Карта интересов</ListItemText>
                                    </MenuItem>
                                    
                                    <MenuItem 
                                        component={RouterLink} 
                                        to="/test/holland"
                                        onClick={handleMenuClose}
                                    >
                                        <ListItemIcon>
                                            <WorkIcon fontSize="small" sx={{ color: '#10b981' }} />
                                        </ListItemIcon>
                                        <ListItemText>Тест Голланда</ListItemText>
                                    </MenuItem>
                                    
                                    <MenuItem 
                                        component={RouterLink} 
                                        to="/test/yovaysha"
                                        onClick={handleMenuClose}
                                    >
                                        <ListItemIcon>
                                            <PsychologyAltIcon fontSize="small" sx={{ color: '#ec4899' }} />
                                        </ListItemIcon>
                                        <ListItemText>Тест Йовайши</ListItemText>
                                    </MenuItem>
                                    
                                    <MenuItem 
                                        component={RouterLink} 
                                        to="/test/yovayshala"
                                        onClick={handleMenuClose}
                                    >
                                        <ListItemIcon>
                                            <PsychologyAltIcon fontSize="small" sx={{ color: '#f59e0b' }} />
                                        </ListItemIcon>
                                        <ListItemText>Методика Л.А. Йовайши</ListItemText>
                                    </MenuItem>
                                    
                                    <Divider />
                                    
                                    <MenuItem 
                                        component={RouterLink} 
                                        to="/test/history"
                                        onClick={handleMenuClose}
                                    >
                                        <ListItemIcon>
                                            <HistoryIcon fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText>История тестов</ListItemText>
                                    </MenuItem>
                                    
                                    {user && (
                                        <MenuItem 
                                            component={RouterLink} 
                                            to="/favorites"
                                            onClick={handleMenuClose}
                                        >
                                            <ListItemIcon>
                                                <FavoriteIcon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText>Избранное</ListItemText>
                                        </MenuItem>
                                    )}
                                    
                                    {user?.isAdmin && (
                                        <MenuItem 
                                            component={RouterLink} 
                                            to="/admin"
                                            onClick={handleMenuClose}
                                        >
                                            <ListItemIcon>
                                                <AdminPanelSettingsIcon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText>Админ-панель</ListItemText>
                                        </MenuItem>
                                    )}
                                    
                                    <Divider />
                                    
                                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                                        <ListItemIcon>
                                            <LogoutIcon fontSize="small" sx={{ color: 'error.main' }} />
                                        </ListItemIcon>
                                        <ListItemText>Выйти</ListItemText>
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    component={RouterLink}
                                    to="/login"
                                    variant="outlined"
                                    sx={{
                                        color: 'white',
                                        borderColor: 'white',
                                        '&:hover': {
                                            backgroundColor: alpha(theme.palette.common.white, 0.1),
                                            borderColor: 'white',
                                        }
                                    }}
                                >
                                    Войти
                                </Button>
                                <Button
                                    component={RouterLink}
                                    to="/register"
                                    variant="contained"
                                    sx={{
                                        backgroundColor: 'white',
                                        color: theme.palette.primary.main,
                                        '&:hover': {
                                            backgroundColor: alpha(theme.palette.common.white, 0.9),
                                        }
                                    }}
                                >
                                    Регистрация
                                </Button>
                            </Box>
                        )}
                    </Box>

                    {/* Мобильное меню */}
                    <Menu
                        anchorEl={mobileMenuAnchor}
                        open={Boolean(mobileMenuAnchor)}
                        onClose={handleMobileMenuClose}
                        PaperProps={{
                            sx: {
                                mt: 1.5,
                                minWidth: 280,
                                maxHeight: '80vh',
                                borderRadius: 2,
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                            }
                        }}
                    >
                        <MenuItem 
                            component={RouterLink} 
                            to="/"
                            onClick={handleMobileMenuClose}
                            selected={location.pathname === '/'}
                        >
                            <ListItemText>Главная</ListItemText>
                        </MenuItem>
                        
                        <MenuItem 
                            component={RouterLink} 
                            to="/specialties"
                            onClick={handleMobileMenuClose}
                            selected={location.pathname === '/specialties'}
                        >
                            <ListItemText>Специальности</ListItemText>
                        </MenuItem>
                        
                        <MenuItem 
                            component={RouterLink} 
                            to="/colleges"
                            onClick={handleMobileMenuClose}
                            selected={location.pathname === '/colleges'}
                        >
                            <ListItemText>Колледжи</ListItemText>
                        </MenuItem>
                        
                        <MenuItem 
                            component={RouterLink} 
                            to="/nearby"
                            onClick={handleMobileMenuClose}
                            selected={location.pathname === '/nearby'}
                        >
                            <ListItemText>Рядом со мной</ListItemText>
                        </MenuItem>
                        
                        <Divider />
                        
                        <Typography variant="caption" sx={{ px: 2, py: 1, color: 'text.secondary', display: 'block' }}>
                            ТЕСТЫ
                        </Typography>
                        
                        <MenuItem 
                            component={RouterLink} 
                            to="/test/comprehensive"
                            onClick={handleMobileMenuClose}
                            selected={location.pathname === '/test/comprehensive'}
                        >
                            <ListItemIcon>
                                <AutoAwesomeIcon sx={{ color: '#764ba2' }} />
                            </ListItemIcon>
                            <ListItemText primary="Комплексный тест" secondary="5 методик за 40 вопросов" />
                        </MenuItem>
                        
                        <MenuItem 
                            component={RouterLink} 
                            to="/test/klimov"
                            onClick={handleMobileMenuClose}
                            selected={location.pathname === '/test/klimov'}
                        >
                            <ListItemIcon>
                                <PsychologyIcon sx={{ color: '#6366f1' }} />
                            </ListItemIcon>
                            <ListItemText primary="Тест Климова" secondary="Тип личности" />
                        </MenuItem>
                        
                        <MenuItem 
                            component={RouterLink} 
                            to="/test/golomshtok"
                            onClick={handleMobileMenuClose}
                            selected={location.pathname === '/test/golomshtok'}
                        >
                            <ListItemIcon>
                                <AutoStoriesIcon sx={{ color: '#8b5cf6' }} />
                            </ListItemIcon>
                            <ListItemText primary="Карта интересов" secondary="Методика Голомштока" />
                        </MenuItem>
                        
                        <MenuItem 
                            component={RouterLink} 
                            to="/test/holland"
                            onClick={handleMobileMenuClose}
                            selected={location.pathname === '/test/holland'}
                        >
                            <ListItemIcon>
                                <WorkIcon sx={{ color: '#10b981' }} />
                            </ListItemIcon>
                            <ListItemText primary="Тест Голланда" secondary="Типы профессиональной среды" />
                        </MenuItem>
                        
                        <MenuItem 
                            component={RouterLink} 
                            to="/test/yovaysha"
                            onClick={handleMobileMenuClose}
                            selected={location.pathname === '/test/yovaysha'}
                        >
                            <ListItemIcon>
                                <PsychologyAltIcon sx={{ color: '#ec4899' }} />
                            </ListItemIcon>
                            <ListItemText primary="Тест Йовайши" secondary="Склонности к сферам деятельности" />
                        </MenuItem>
                        
                        <MenuItem 
                            component={RouterLink} 
                            to="/test/yovayshala"
                            onClick={handleMobileMenuClose}
                            selected={location.pathname === '/test/yovayshala'}
                        >
                            <ListItemIcon>
                                <PsychologyAltIcon sx={{ color: '#f59e0b' }} />
                            </ListItemIcon>
                            <ListItemText primary="Методика Л.А. Йовайши" secondary="Предпочтения в работе" />
                        </MenuItem>
                        
                        <Divider />
                        
                        {user ? (
                            <>
                                <MenuItem 
                                    component={RouterLink} 
                                    to="/profile"
                                    onClick={handleMobileMenuClose}
                                >
                                    <ListItemText>Профиль</ListItemText>
                                </MenuItem>
                                <MenuItem 
                                    component={RouterLink} 
                                    to="/test/history"
                                    onClick={handleMobileMenuClose}
                                >
                                    <ListItemText>История тестов</ListItemText>
                                </MenuItem>
                                <MenuItem 
                                    component={RouterLink} 
                                    to="/favorites"
                                    onClick={handleMobileMenuClose}
                                >
                                    <ListItemText>Избранное</ListItemText>
                                </MenuItem>
                                {user.isAdmin && (
                                    <MenuItem 
                                        component={RouterLink} 
                                        to="/admin"
                                        onClick={handleMobileMenuClose}
                                    >
                                        <ListItemText>Админ-панель</ListItemText>
                                    </MenuItem>
                                )}
                                <Divider />
                                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                                    <ListItemText>Выйти</ListItemText>
                                </MenuItem>
                            </>
                        ) : (
                            <>
                                <MenuItem 
                                    component={RouterLink} 
                                    to="/login"
                                    onClick={handleMobileMenuClose}
                                >
                                    <ListItemText>Войти</ListItemText>
                                </MenuItem>
                                <MenuItem 
                                    component={RouterLink} 
                                    to="/register"
                                    onClick={handleMobileMenuClose}
                                >
                                    <ListItemText>Регистрация</ListItemText>
                                </MenuItem>
                            </>
                        )}
                    </Menu>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;