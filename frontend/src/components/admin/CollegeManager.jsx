import React, { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Typography,
    Container,
    Card,
    CardContent,
    Grid,
    TextField,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Alert,
    Snackbar,
    alpha,
    CircularProgress,
    InputAdornment,
    Tooltip,
    Chip,
    Pagination,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Link
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import ClearIcon from '@mui/icons-material/Clear';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import { useAuth } from '../../context/AuthContext';

const CollegeManager = () => {
    const { api } = useAuth();
    
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingCollege, setEditingCollege] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        region: '',
        city: ''
    });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [regions, setRegions] = useState([]);
    const [cities, setCities] = useState([]);

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
        loadData();
    }, [page, searchTerm, filters.region, filters.city]);

    const loadData = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page,
                limit: 10,
                search: searchTerm,
                ...(filters.region && { region: filters.region }),
                ...(filters.city && { city: filters.city })
            }).toString();

            const response = await api.get(`/admin/colleges?${params}`);
            
            setColleges(response.data.colleges || []);
            setTotal(response.data.total || 0);
            setTotalPages(response.data.totalPages || 1);
            setRegions(response.data.filters?.regions || []);
            setCities(response.data.filters?.cities || []);
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

    const validateForm = () => {
        const errors = {};
        
        if (!formData.name.trim()) {
            errors.name = 'Название колледжа обязательно';
        }
        
        if (!formData.city.trim()) {
            errors.city = 'Город обязателен';
        }
        
        if (!formData.region.trim()) {
            errors.region = 'Регион обязателен';
        }
        
        if (!formData.address.trim()) {
            errors.address = 'Адрес обязателен';
        }
        
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Неверный формат email';
        }
        
        if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) {
            errors.website = 'Неверный формат URL сайта';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleOpenDialog = (college = null) => {
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
            setEditingCollege(college);
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
            setEditingCollege(null);
        }
        setFormErrors({});
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingCollege(null);
        setFormErrors({});
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSaveCollege = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            if (editingCollege) {
                await api.put(`/admin/colleges/${editingCollege._id}`, formData);
                setSnackbar({ open: true, message: 'Колледж обновлен', severity: 'success' });
            } else {
                await api.post('/admin/colleges', formData);
                setSnackbar({ open: true, message: 'Колледж создан', severity: 'success' });
            }
            
            handleCloseDialog();
            loadData();
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            setSnackbar({ open: true, message: error.response?.data?.message || 'Ошибка сохранения', severity: 'error' });
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

    const clearFilters = () => {
        setSearchTerm('');
        setFilters({ region: '', city: '' });
        setPage(1);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
                    Управление колледжами
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Добавление, редактирование и удаление колледжей
                </Typography>
            </Box>

            <Card sx={{ borderRadius: 3, mb: 4 }}>
                <CardContent sx={{ p: 4 }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                placeholder="Поиск по названию, городу или описанию"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setPage(1);
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: searchTerm && (
                                        <InputAdornment position="end">
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    setSearchTerm('');
                                                    setPage(1);
                                                }}
                                                edge="end"
                                            >
                                                <ClearIcon fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                <FormControl sx={{ minWidth: 150 }}>
                                    <InputLabel>Регион</InputLabel>
                                    <Select
                                        value={filters.region}
                                        onChange={(e) => {
                                            setFilters({ ...filters, region: e.target.value });
                                            setPage(1);
                                        }}
                                        label="Регион"
                                        size="small"
                                    >
                                        <MenuItem value="">Все регионы</MenuItem>
                                        {regions.map(region => (
                                            <MenuItem key={region} value={region}>
                                                {region}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                
                                <FormControl sx={{ minWidth: 150 }}>
                                    <InputLabel>Город</InputLabel>
                                    <Select
                                        value={filters.city}
                                        onChange={(e) => {
                                            setFilters({ ...filters, city: e.target.value });
                                            setPage(1);
                                        }}
                                        label="Город"
                                        size="small"
                                    >
                                        <MenuItem value="">Все города</MenuItem>
                                        {cities.map(city => (
                                            <MenuItem key={city} value={city}>
                                                {city}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                
                                {(searchTerm || filters.region || filters.city) && (
                                    <Button
                                        variant="outlined"
                                        startIcon={<ClearIcon />}
                                        onClick={clearFilters}
                                        size="small"
                                    >
                                        Сбросить фильтры
                                    </Button>
                                )}
                                
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => handleOpenDialog()}
                                    sx={{
                                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                        }
                                    }}
                                >
                                    Добавить колледж
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                    
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Найдено: {total} колледжей
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Страница {page} из {totalPages}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            <TableContainer 
                component={Paper} 
                sx={{ 
                    borderRadius: 3,
                    overflow: 'auto'
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: '250px', fontWeight: 600 }}>Название</TableCell>
                            <TableCell sx={{ width: '150px', fontWeight: 600 }}>Город</TableCell>
                            <TableCell sx={{ width: '150px', fontWeight: 600 }}>Регион</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Адрес</TableCell>
                            <TableCell sx={{ width: '150px', fontWeight: 600 }}>Контакты</TableCell>
                            <TableCell sx={{ width: '100px', fontWeight: 600 }}>Специальностей</TableCell>
                            <TableCell sx={{ width: '120px', fontWeight: 600 }}>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {colleges.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                                    <SchoolIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                                    <Typography variant="body1" color="text.secondary">
                                        Колледжи не найдены
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            colleges.map((college) => (
                                <TableRow key={college._id} hover>
                                    <TableCell>
                                        <Typography sx={{ fontWeight: 500, mb: 0.5 }}>
                                            {college.name}
                                        </Typography>
                                        {college.website && (
                                            <Link 
                                                href={college.website} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                sx={{ 
                                                    fontSize: '0.8rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5
                                                }}
                                            >
                                                <LanguageIcon fontSize="small" />
                                                Сайт
                                            </Link>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontSize: '0.9rem' }}>
                                            {college.city}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={college.region}
                                            size="small"
                                            sx={{ 
                                                backgroundColor: alpha('#6366f1', 0.1),
                                                color: '#6366f1',
                                                fontWeight: 500
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {college.address}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                            {college.phone && (
                                                <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <PhoneIcon fontSize="small" />
                                                    {college.phone}
                                                </Typography>
                                            )}
                                            {college.email && (
                                                <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <EmailIcon fontSize="small" />
                                                    {college.email}
                                                </Typography>
                                            )}
                                        </Box>
                                    </TableCell>
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
                                                onClick={() => handleOpenDialog(college)}
                                                sx={{
                                                    border: '1px solid',
                                                    borderColor: 'primary.main',
                                                    color: 'primary.main',
                                                    '&:hover': {
                                                        backgroundColor: alpha('#6366f1', 0.1),
                                                    }
                                                }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDeleteCollege(college._id)}
                                                sx={{
                                                    border: '1px solid',
                                                    borderColor: 'error.main',
                                                    color: 'error.main',
                                                    '&:hover': {
                                                        backgroundColor: alpha('#ef4444', 0.1),
                                                    }
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(event, value) => setPage(value)}
                        color="primary"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            )}

            <Dialog 
                open={openDialog} 
                onClose={handleCloseDialog} 
                maxWidth="md" 
                fullWidth
                disableRestoreFocus
            >
                <DialogTitle>
                    {editingCollege ? 'Редактирование колледжа' : 'Новый колледж'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            label="Название колледжа*"
                            name="name"
                            value={formData.name}
                            onChange={handleFormChange}
                            fullWidth
                            required
                            error={!!formErrors.name}
                            helperText={formErrors.name}
                        />
                        
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Город*"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleFormChange}
                                    fullWidth
                                    required
                                    error={!!formErrors.city}
                                    helperText={formErrors.city}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Регион*"
                                    name="region"
                                    value={formData.region}
                                    onChange={handleFormChange}
                                    fullWidth
                                    required
                                    error={!!formErrors.region}
                                    helperText={formErrors.region}
                                />
                            </Grid>
                        </Grid>
                        
                        <TextField
                            label="Адрес*"
                            name="address"
                            value={formData.address}
                            onChange={handleFormChange}
                            fullWidth
                            required
                            multiline
                            rows={2}
                            error={!!formErrors.address}
                            helperText={formErrors.address}
                        />
                        
                        <TextField
                            label="Сайт (необязательно)"
                            name="website"
                            value={formData.website}
                            onChange={handleFormChange}
                            fullWidth
                            placeholder="https://example.com"
                            error={!!formErrors.website}
                            helperText={formErrors.website || "Введите полный URL сайта"}
                        />
                        
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Телефон (необязательно)"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleFormChange}
                                    fullWidth
                                    placeholder="+7 (XXX) XXX-XX-XX"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Email (необязательно)"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleFormChange}
                                    fullWidth
                                    placeholder="example@domain.com"
                                    error={!!formErrors.email}
                                    helperText={formErrors.email}
                                />
                            </Grid>
                        </Grid>
                        
                        <TextField
                            label="Описание (необязательно)"
                            name="description"
                            value={formData.description}
                            onChange={handleFormChange}
                            fullWidth
                            multiline
                            rows={4}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Отмена</Button>
                    <Button 
                        onClick={handleSaveCollege} 
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        }}
                    >
                        {editingCollege ? 'Обновить' : 'Создать'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default CollegeManager;