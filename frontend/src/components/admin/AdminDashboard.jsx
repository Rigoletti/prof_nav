import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    alpha,
    useTheme,
    LinearProgress,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Alert,
    Snackbar,
    CircularProgress,
    Tabs,
    Tab
} from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BarChartIcon from '@mui/icons-material/BarChart';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BookIcon from '@mui/icons-material/Book';
import BusinessIcon from '@mui/icons-material/Business';
import UploadFileIcon from '@mui/icons-material/UploadFile'; // Добавляем иконку импорта
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { api, user } = useAuth();
    
    const [stats, setStats] = useState(null);
    const [specialties, setSpecialties] = useState([]);
    const [colleges, setColleges] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState('');
    const [currentItem, setCurrentItem] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [statsRes, specialtiesRes, usersRes, collegesRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/specialties'),
                api.get('/admin/users'),
                api.get('/admin/colleges?limit=1000')
            ]);
            
            setStats(statsRes.data.stats);
            setSpecialties(specialtiesRes.data.specialties || []);
            setUsers(usersRes.data.users || []);
            setColleges(collegesRes.data.colleges || []);
            setLoading(false);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            setSnackbar({ 
                open: true, 
                message: error.response?.data?.message || 'Ошибка загрузки данных', 
                severity: 'error' 
            });
            setLoading(false);
        }
    };

    const handleOpenDialog = (type, item = null) => {
        setDialogType(type);
        setCurrentItem(item);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentItem(null);
        setDialogType('');
    };

    const handleDeleteSpecialty = async (id) => {
        if (!window.confirm('Удалить специальность?')) return;
        
        try {
            await api.delete(`/admin/specialties/${id}`);
            setSnackbar({ open: true, message: 'Специальность удалена', severity: 'success' });
            loadData();
        } catch (error) {
            console.error('Ошибка удаления:', error);
            setSnackbar({ open: true, message: 'Ошибка удаления', severity: 'error' });
        }
    };

    const handleDeleteCollege = async (id) => {
        if (!window.confirm('Удалить колледж? Все связанные специальности будут обновлены.')) return;
        
        try {
            await api.delete(`/admin/colleges/${id}`);
            setSnackbar({ open: true, message: 'Колледж удален', severity: 'success' });
            loadData();
        } catch (error) {
            console.error('Ошибка удаления:', error);
            setSnackbar({ open: true, message: 'Ошибка удаления', severity: 'error' });
        }
    };

    const handleSaveSpecialty = async (data) => {
        try {
            if (currentItem) {
                await api.put(`/admin/specialties/${currentItem._id}`, data);
                setSnackbar({ open: true, message: 'Специальность обновлена', severity: 'success' });
            } else {
                await api.post('/admin/specialties', data);
                setSnackbar({ open: true, message: 'Специальность создана', severity: 'success' });
            }
            handleCloseDialog();
            loadData();
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            setSnackbar({ open: true, message: 'Ошибка сохранения', severity: 'error' });
        }
    };

    const handleSaveCollege = async (data) => {
        try {
            if (currentItem) {
                await api.put(`/admin/colleges/${currentItem._id}`, data);
                setSnackbar({ open: true, message: 'Колледж обновлен', severity: 'success' });
            } else {
                await api.post('/admin/colleges', data);
                setSnackbar({ open: true, message: 'Колледж создан', severity: 'success' });
            }
            handleCloseDialog();
            loadData();
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            setSnackbar({ open: true, message: 'Ошибка сохранения', severity: 'error' });
        }
    };

    const handleUpdateUserRole = async (userId, role) => {
        try {
            await api.put(`/admin/users/${userId}/role`, { role });
            setSnackbar({ open: true, message: 'Роль обновлена', severity: 'success' });
            loadData();
        } catch (error) {
            console.error('Ошибка обновления роли:', error);
            setSnackbar({ open: true, message: 'Ошибка обновления роли', severity: 'error' });
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    const KLIMOV_TYPES = {
        manNature: { name: 'Человек-Природа', color: '#10b981', short: 'П' },
        manTech: { name: 'Человек-Техника', color: '#3b82f6', short: 'Т' },
        manHuman: { name: 'Человек-Человек', color: '#ec4899', short: 'Ч' },
        manSign: { name: 'Человек-Знаковая система', color: '#f59e0b', short: 'З' },
        manArt: { name: 'Человек-Искусство', color: '#8b5cf6', short: 'Х' }
    };

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            py: 6,
        }}>
            <Container maxWidth="xl">
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
                        <AdminPanelSettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Панель администратора
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Управление системой профориентации
                    </Typography>
                </Box>

                <Paper sx={{ mb: 4, borderRadius: 3 }}>
                    <Tabs 
                        value={activeTab} 
                        onChange={(e, newValue) => setActiveTab(newValue)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{ 
                            borderBottom: 1, 
                            borderColor: 'divider',
                            '& .MuiTab-root': {
                                fontWeight: 600,
                                py: 2,
                                minHeight: 'auto'
                            }
                        }}
                    >
                        <Tab 
                            icon={<BarChartIcon />} 
                            iconPosition="start" 
                            label="Общая статистика" 
                            component={Link}
                            to="/admin"
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveTab(0);
                                navigate('/admin');
                            }}
                        />
                        <Tab 
                            icon={<AnalyticsIcon />} 
                            iconPosition="start" 
                            label="Аналитика и графики" 
                            component={Link}
                            to="/admin/analytics"
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveTab(1);
                                navigate('/admin/analytics');
                            }}
                        />
                        <Tab 
                            icon={<BookIcon />} 
                            iconPosition="start" 
                            label="Управление специальностями" 
                            component={Link}
                            to="/admin/specialties"
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveTab(2);
                                navigate('/admin/specialties');
                            }}
                        />
                        <Tab 
                            icon={<BusinessIcon />} 
                            iconPosition="start" 
                            label="Управление колледжами" 
                            component={Link}
                            to="/admin/colleges"
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveTab(3);
                                navigate('/admin/colleges');
                            }}
                        />
                        <Tab 
                            icon={<UploadFileIcon />} 
                            iconPosition="start" 
                            label="Импорт данных" 
                            component={Link}
                            to="/admin/import"
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveTab(4);
                                navigate('/admin/import');
                            }}
                        />
                    </Tabs>
                </Paper>

                {activeTab === 0 && (
                    <>
                        {stats && (
                            <Grid container spacing={4} sx={{ mb: 6 }}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card sx={{ borderRadius: 3 }}>
                                        <CardContent sx={{ p: 4 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                                                <Box>
                                                    <Typography variant="h3" sx={{ fontWeight: 800 }}>
                                                        {stats.totalUsers || 0}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Пользователей
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <Card sx={{ borderRadius: 3 }}>
                                        <CardContent sx={{ p: 4 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                <SchoolIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
                                                <Box>
                                                    <Typography variant="h3" sx={{ fontWeight: 800 }}>
                                                        {stats.totalSpecialties || 0}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Специальностей
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <Card sx={{ borderRadius: 3 }}>
                                        <CardContent sx={{ p: 4 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                <BusinessIcon sx={{ fontSize: 40, color: 'success.main' }} />
                                                <Box>
                                                    <Typography variant="h3" sx={{ fontWeight: 800 }}>
                                                        {stats.totalColleges || 0}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Колледжей
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <Card sx={{ borderRadius: 3 }}>
                                        <CardContent sx={{ p: 4 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                <PsychologyIcon sx={{ fontSize: 40, color: 'warning.main' }} />
                                                <Box>
                                                    <Typography variant="h3" sx={{ fontWeight: 800 }}>
                                                        {stats.totalTests || 0}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Пройденных тестов
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        )}

                        {stats?.klimovStats && (
                            <Card sx={{ borderRadius: 3, mb: 6 }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                        Распределение типов по Климову
                                    </Typography>
                                    <Grid container spacing={3}>
                                        {stats.klimovStats.map((item, index) => {
                                            const typeInfo = KLIMOV_TYPES[item._id];
                                            const percentage = stats.totalUsers > 0 ? (item.count / stats.totalUsers) * 100 : 0;
                                            
                                            return (
                                                <Grid item xs={12} sm={6} md={4} key={index}>
                                                    <Box sx={{ mb: 2 }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                {typeInfo?.name || item._id}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {item.count} ({percentage.toFixed(1)}%)
                                                            </Typography>
                                                        </Box>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={percentage}
                                                            sx={{
                                                                height: 8,
                                                                borderRadius: 4,
                                                                backgroundColor: alpha(typeInfo?.color || '#6366f1', 0.1),
                                                                '& .MuiLinearProgress-bar': {
                                                                    borderRadius: 4,
                                                                    backgroundColor: typeInfo?.color || '#6366f1',
                                                                },
                                                            }}
                                                        />
                                                    </Box>
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </CardContent>
                            </Card>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                Пользователи
                            </Typography>
                        </Box>

                        <TableContainer component={Paper} sx={{ borderRadius: 3, mb: 6 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Имя</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Роль</TableCell>
                                        <TableCell>Тестов пройдено</TableCell>
                                        <TableCell>Дата регистрации</TableCell>
                                        <TableCell>Действия</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((userItem) => (
                                        <TableRow key={userItem._id}>
                                            <TableCell>
                                                {userItem.firstName} {userItem.lastName}
                                            </TableCell>
                                            <TableCell>{userItem.email}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={userItem.role === 'admin' ? 'Администратор' : 'Пользователь'}
                                                    color={userItem.role === 'admin' ? 'primary' : 'default'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{userItem.testResults?.length || 0}</TableCell>
                                            <TableCell>
                                                {new Date(userItem.createdAt).toLocaleDateString('ru-RU')}
                                            </TableCell>
                                            <TableCell>
                                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                                    <Select
                                                        value={userItem.role}
                                                        onChange={(e) => handleUpdateUserRole(userItem._id, e.target.value)}
                                                        disabled={userItem._id === user._id}
                                                    >
                                                        <MenuItem value="user">Пользователь</MenuItem>
                                                        <MenuItem value="admin">Администратор</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                Специальности
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenDialog('specialty')}
                                sx={{
                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                }}
                            >
                                Добавить специальность
                            </Button>
                        </Box>

                        <TableContainer component={Paper} sx={{ borderRadius: 3, mb: 6 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Код</TableCell>
                                        <TableCell>Название</TableCell>
                                        <TableCell>Типы по Климову</TableCell>
                                        <TableCell>Колледжи</TableCell>
                                        <TableCell>Действия</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {specialties.slice(0, 10).map((specialty) => (
                                        <TableRow key={specialty._id}>
                                            <TableCell>{specialty.code}</TableCell>
                                            <TableCell>
                                                <Typography sx={{ fontWeight: 500 }}>
                                                    {specialty.name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                    {specialty.klimovTypes?.map((type, idx) => (
                                                        <Chip
                                                            key={idx}
                                                            label={KLIMOV_TYPES[type]?.short || type}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: alpha(KLIMOV_TYPES[type]?.color || '#6366f1', 0.1),
                                                                color: KLIMOV_TYPES[type]?.color || '#6366f1',
                                                                fontSize: '0.7rem',
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                {specialty.collegeNames?.slice(0, 2).map((name, idx) => (
                                                    <Typography key={idx} variant="body2" color="text.secondary">
                                                        {name}
                                                        {idx < specialty.collegeNames.length - 1 && ', '}
                                                    </Typography>
                                                ))}
                                                {specialty.collegeNames?.length > 2 && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        +{specialty.collegeNames.length - 2} еще
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleOpenDialog('specialty', specialty)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDeleteSpecialty(specialty._id)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                Колледжи
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenDialog('college')}
                                sx={{
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                }}
                            >
                                Добавить колледж
                            </Button>
                        </Box>

                        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Название</TableCell>
                                        <TableCell>Город</TableCell>
                                        <TableCell>Регион</TableCell>
                                        <TableCell>Специальностей</TableCell>
                                        <TableCell>Действия</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {colleges.slice(0, 10).map((college) => (
                                        <TableRow key={college._id}>
                                            <TableCell>
                                                <Typography sx={{ fontWeight: 500 }}>
                                                    {college.name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{college.city}</TableCell>
                                            <TableCell>{college.region}</TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={college.specialties?.length || 0}
                                                    size="small"
                                                    sx={{ 
                                                        backgroundColor: alpha('#10b981', 0.1),
                                                        color: '#10b981',
                                                        fontWeight: 600
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleOpenDialog('college', college)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDeleteCollege(college._id)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {dialogType === 'specialty' && (
                            <SpecialtyDialog
                                open={openDialog}
                                onClose={handleCloseDialog}
                                onSave={handleSaveSpecialty}
                                specialty={currentItem}
                                colleges={colleges}
                            />
                        )}

                        {dialogType === 'college' && (
                            <CollegeDialog
                                open={openDialog}
                                onClose={handleCloseDialog}
                                onSave={handleSaveCollege}
                                college={currentItem}
                            />
                        )}
                    </>
                )}

                {activeTab === 2 && (
                    <Box>
                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
                            Перейдите на страницу управления специальностями
                        </Typography>
                        <Button
                            component={Link}
                            to="/admin/specialties"
                            variant="contained"
                        >
                            Управление специальностями
                        </Button>
                    </Box>
                )}

                {activeTab === 3 && (
                    <Box>
                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
                            Перейдите на страницу управления колледжами
                        </Typography>
                        <Button
                            component={Link}
                            to="/admin/colleges"
                            variant="contained"
                        >
                            Управление колледжами
                        </Button>
                    </Box>
                )}

                {activeTab === 4 && (
                    <Box>
                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
                            Перейдите на страницу импорта данных
                        </Typography>
                        <Button
                            component={Link}
                            to="/admin/import"
                            variant="contained"
                        >
                            Импорт данных
                        </Button>
                    </Box>
                )}
            </Container>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

const SpecialtyDialog = ({ open, onClose, onSave, specialty, colleges }) => {
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: '',
        educationLevel: 'SPO',
        klimovTypes: [],
        disciplines: '',
        duration: '2 года 10 месяцев',
        form: 'full-time',
        colleges: [],
        requirements: '',
        prospects: '',
        url: ''
    });

    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (specialty) {
            setFormData({
                code: specialty.code || '',
                name: specialty.name || '',
                description: specialty.description || '',
                educationLevel: specialty.educationLevel || 'SPO',
                klimovTypes: specialty.klimovTypes || [],
                disciplines: (specialty.disciplines || []).join(', '),
                duration: specialty.duration || '2 года 10 месяцев',
                form: specialty.form || 'full-time',
                colleges: specialty.colleges?.map(c => c._id) || [],
                requirements: (specialty.requirements || []).join(', '),
                prospects: (specialty.prospects || []).join(', '),
                url: specialty.url || ''
            });
        } else {
            setFormData({
                code: '',
                name: '',
                description: '',
                educationLevel: 'SPO',
                klimovTypes: [],
                disciplines: '',
                duration: '2 года 10 месяцев',
                form: 'full-time',
                colleges: [],
                requirements: '',
                prospects: '',
                url: ''
            });
        }
        setFormErrors({});
    }, [specialty]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const errors = {};
        
        if (!formData.code.trim()) errors.code = 'Код специальности обязателен';
        if (!formData.name.trim()) errors.name = 'Название специальности обязательно';
        if (formData.klimovTypes.length === 0) errors.klimovTypes = 'Выберите хотя бы один тип';
        if (!formData.duration.trim()) errors.duration = 'Срок обучения обязателен';
        if (formData.colleges.length === 0) errors.colleges = 'Выберите хотя бы один колледж';
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        const dataToSend = {
            ...formData,
            disciplines: formData.disciplines.split(',').map(item => item.trim()).filter(item => item),
            requirements: formData.requirements.split(',').map(item => item.trim()).filter(item => item),
            prospects: formData.prospects.split(',').map(item => item.trim()).filter(item => item)
        };
        onSave(dataToSend);
    };

    const KLIMOV_TYPE_OPTIONS = [
        { value: 'manNature', label: 'Человек-Природа' },
        { value: 'manTech', label: 'Человек-Техника' },
        { value: 'manHuman', label: 'Человек-Человек' },
        { value: 'manSign', label: 'Человек-Знаковая система' },
        { value: 'manArt', label: 'Человек-Искусство' }
    ];

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {specialty ? 'Редактирование специальности' : 'Новая специальность'}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                        label="Код специальности"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!formErrors.code}
                        helperText={formErrors.code}
                    />
                    
                    <TextField
                        label="Название специальности"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                    />
                    
                    <TextField
                        label="Описание"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        multiline
                        rows={3}
                        fullWidth
                    />
                    
                    <FormControl fullWidth required error={!!formErrors.klimovTypes}>
                        <InputLabel>Типы по Климову</InputLabel>
                        <Select
                            multiple
                            name="klimovTypes"
                            value={formData.klimovTypes}
                            onChange={handleChange}
                            label="Типы по Климову"
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => {
                                        const option = KLIMOV_TYPE_OPTIONS.find(opt => opt.value === value);
                                        return (
                                            <Chip
                                                key={value}
                                                label={option?.label || value}
                                                size="small"
                                            />
                                        );
                                    })}
                                </Box>
                            )}
                        >
                            {KLIMOV_TYPE_OPTIONS.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                        {formErrors.klimovTypes && (
                            <Typography variant="caption" color="error">
                                {formErrors.klimovTypes}
                            </Typography>
                        )}
                    </FormControl>
                    
                    <TextField
                        label="Дисциплины (через запятую)"
                        name="disciplines"
                        value={formData.disciplines}
                        onChange={handleChange}
                        fullWidth
                        placeholder="Математика, Физика, Информатика"
                    />
                    
                    <TextField
                        label="Срок обучения"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!formErrors.duration}
                        helperText={formErrors.duration}
                    />
                    
                    <FormControl fullWidth>
                        <InputLabel>Форма обучения</InputLabel>
                        <Select
                            name="form"
                            value={formData.form}
                            onChange={handleChange}
                            label="Форма обучения"
                        >
                            <MenuItem value="full-time">Очная</MenuItem>
                            <MenuItem value="part-time">Очно-заочная</MenuItem>
                            <MenuItem value="distance">Заочная</MenuItem>
                        </Select>
                    </FormControl>
                    
                    <FormControl fullWidth required error={!!formErrors.colleges}>
                        <InputLabel>Колледжи</InputLabel>
                        <Select
                            multiple
                            name="colleges"
                            value={formData.colleges}
                            onChange={handleChange}
                            label="Колледжи"
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => {
                                        const college = colleges.find(c => c._id === value);
                                        return college ? (
                                            <Chip
                                                key={value}
                                                label={college.name}
                                                size="small"
                                            />
                                        ) : null;
                                    })}
                                </Box>
                            )}
                        >
                            {colleges.map((college) => (
                                <MenuItem key={college._id} value={college._id}>
                                    {college.name} ({college.city})
                                </MenuItem>
                            ))}
                        </Select>
                        {formErrors.colleges && (
                            <Typography variant="caption" color="error">
                                {formErrors.colleges}
                            </Typography>
                        )}
                    </FormControl>
                    
                    <TextField
                        label="Требования (через запятую)"
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleChange}
                        fullWidth
                        placeholder="Аттестат, Медицинская справка"
                    />
                    
                    <TextField
                        label="Перспективы (через запятую)"
                        name="prospects"
                        value={formData.prospects}
                        onChange={handleChange}
                        fullWidth
                        placeholder="Трудоустройство, Карьерный рост"
                    />
                    
                    <TextField
                        label="Ссылка на страницу"
                        name="url"
                        value={formData.url}
                        onChange={handleChange}
                        fullWidth
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button onClick={handleSubmit} variant="contained">
                    {specialty ? 'Обновить' : 'Создать'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const CollegeDialog = ({ open, onClose, onSave, college }) => {
    const [formData, setFormData] = useState({
        name: '',
        city: '',
        region: '',
        address: '',
        website: '',
        phone: '',
        email: '',
        description: ''
    });

    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (college) {
            setFormData({
                name: college.name || '',
                city: college.city || '',
                region: college.region || '',
                address: college.address || '',
                website: college.website || '',
                phone: college.phone || '',
                email: college.email || '',
                description: college.description || ''
            });
        } else {
            setFormData({
                name: '',
                city: '',
                region: '',
                address: '',
                website: '',
                phone: '',
                email: '',
                description: ''
            });
        }
        setFormErrors({});
    }, [college]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const errors = {};
        
        if (!formData.name.trim()) errors.name = 'Название колледжа обязательно';
        if (!formData.city.trim()) errors.city = 'Город обязателен';
        if (!formData.region.trim()) errors.region = 'Регион обязателен';
        if (!formData.address.trim()) errors.address = 'Адрес обязателен';
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        onSave(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {college ? 'Редактирование колледжа' : 'Новый колледж'}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                        label="Название колледжа"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                    />
                    
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Город"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                fullWidth
                                required
                                error={!!formErrors.city}
                                helperText={formErrors.city}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Регион"
                                name="region"
                                value={formData.region}
                                onChange={handleChange}
                                fullWidth
                                required
                                error={!!formErrors.region}
                                helperText={formErrors.region}
                            />
                        </Grid>
                    </Grid>
                    
                    <TextField
                        label="Адрес"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        fullWidth
                        required
                        multiline
                        rows={2}
                        error={!!formErrors.address}
                        helperText={formErrors.address}
                    />
                    
                    <TextField
                        label="Сайт"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        fullWidth
                        placeholder="https://example.com"
                    />
                    
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Телефон"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                    
                    <TextField
                        label="Описание"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={4}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button onClick={handleSubmit} variant="contained">
                    {college ? 'Обновить' : 'Создать'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AdminDashboard;