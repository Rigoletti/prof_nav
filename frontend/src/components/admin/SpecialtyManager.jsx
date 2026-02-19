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
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Chip,
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
    Autocomplete
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import ClearIcon from '@mui/icons-material/Clear';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { useAuth } from '../../context/AuthContext';

const KLIMOV_TYPES = [
    { value: 'manNature', label: 'Человек-Природа', color: '#10b981', short: 'П' },
    { value: 'manTech', label: 'Человек-Техника', color: '#3b82f6', short: 'Т' },
    { value: 'manHuman', label: 'Человек-Человек', color: '#ec4899', short: 'Ч' },
    { value: 'manSign', label: 'Человек-Знаковая система', color: '#f59e0b', short: 'З' },
    { value: 'manArt', label: 'Человек-Искусство', color: '#8b5cf6', short: 'Х' }
];

const KLIMOV_TYPE_MAP = {
    manNature: { name: 'Человек-Природа', color: '#10b981', short: 'П' },
    manTech: { name: 'Человек-Техника', color: '#3b82f6', short: 'Т' },
    manHuman: { name: 'Человек-Человек', color: '#ec4899', short: 'Ч' },
    manSign: { name: 'Человек-Знаковая система', color: '#f59e0b', short: 'З' },
    manArt: { name: 'Человек-Искусство', color: '#8b5cf6', short: 'Х' }
};

const SpecialtyManager = () => {
    const { api } = useAuth();
    
    const [specialties, setSpecialties] = useState([]);
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingSpecialty, setEditingSpecialty] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        klimovType: ''
    });

    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: '',
        educationLevel: 'SPO',
        klimovTypes: [],
        disciplines: '',
        duration: '2 года 10 месяцев',
        form: 'full-time',
        colleges: [], // Массив ID колледжей
        collegeNames: [], // Массив названий колледжей
        requirements: '',
        prospects: '',
        url: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [collegeSearch, setCollegeSearch] = useState('');

    useEffect(() => {
        loadData();
        loadColleges();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const specialtiesRes = await api.get('/admin/specialties');
            
            setSpecialties(specialtiesRes.data.specialties || []);
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

    const loadColleges = async () => {
        try {
            const response = await api.get('/admin/colleges?limit=1000');
            setColleges(response.data.colleges || []);
        } catch (error) {
            console.error('Ошибка загрузки колледжей:', error);
        }
    };

    const searchColleges = async (search) => {
        try {
            const response = await api.get(`/admin/colleges/search?search=${search}&limit=10`);
            return response.data.colleges || [];
        } catch (error) {
            console.error('Ошибка поиска колледжей:', error);
            return [];
        }
    };

    const validateForm = () => {
        const errors = {};
        
        if (!formData.code.trim()) {
            errors.code = 'Код специальности обязателен';
        }
        
        if (!formData.name.trim()) {
            errors.name = 'Название специальности обязательно';
        }
        
        if (formData.colleges.length === 0) {
            errors.colleges = 'Выберите хотя бы один колледж';
        }
        
        if (!formData.duration.trim()) {
            errors.duration = 'Срок обучения обязателен';
        }
        
        if (formData.klimovTypes.length === 0) {
            errors.klimovTypes = 'Выберите хотя бы один тип по Климову';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleOpenDialog = async (specialty = null) => {
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
                collegeNames: specialty.collegeNames || [],
                requirements: (specialty.requirements || []).join(', '),
                prospects: (specialty.prospects || []).join(', '),
                url: specialty.url || ''
            });
            setEditingSpecialty(specialty);
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
                collegeNames: [],
                requirements: '',
                prospects: '',
                url: ''
            });
            setEditingSpecialty(null);
        }
        setFormErrors({});
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingSpecialty(null);
        setFormErrors({});
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSaveSpecialty = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const dataToSend = {
                ...formData,
                disciplines: formData.disciplines.split(',').map(item => item.trim()).filter(item => item),
                requirements: formData.requirements.split(',').map(item => item.trim()).filter(item => item),
                prospects: formData.prospects.split(',').map(item => item.trim()).filter(item => item),
                collegeNames: colleges
                    .filter(college => formData.colleges.includes(college._id))
                    .map(college => college.name)
            };

            if (editingSpecialty) {
                await api.put(`/admin/specialties/${editingSpecialty._id}`, dataToSend);
                setSnackbar({ open: true, message: 'Специальность обновлена', severity: 'success' });
            } else {
                await api.post('/admin/specialties', dataToSend);
                setSnackbar({ open: true, message: 'Специальность создана', severity: 'success' });
            }
            
            handleCloseDialog();
            loadData();
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            setSnackbar({ open: true, message: error.response?.data?.message || 'Ошибка сохранения', severity: 'error' });
        }
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

    const clearFilters = () => {
        setSearchTerm('');
        setFilters({ klimovType: '' });
    };

    const filteredSpecialties = useMemo(() => {
        return specialties.filter(specialty => {
            if (searchTerm && 
                !specialty.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
                !specialty.code.toLowerCase().includes(searchTerm.toLowerCase()) &&
                !specialty.collegeNames?.some(name => name.toLowerCase().includes(searchTerm.toLowerCase()))) {
                return false;
            }
            
            if (filters.klimovType && !specialty.klimovTypes?.includes(filters.klimovType)) {
                return false;
            }
            
            return true;
        });
    }, [specialties, searchTerm, filters.klimovType]);

    const selectedColleges = useMemo(() => {
        return colleges.filter(college => formData.colleges.includes(college._id));
    }, [colleges, formData.colleges]);

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
                    Управление специальностями
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Добавление, редактирование и удаление специальностей СПО
                </Typography>
            </Box>

            <Card sx={{ borderRadius: 3, mb: 4 }}>
                <CardContent sx={{ p: 4 }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                placeholder="Поиск по названию, коду или колледжу"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
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
                                                onClick={() => setSearchTerm('')}
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
                                <FormControl sx={{ minWidth: 200 }}>
                                    <InputLabel>Фильтр по типу</InputLabel>
                                    <Select
                                        value={filters.klimovType}
                                        onChange={(e) => setFilters({ ...filters, klimovType: e.target.value })}
                                        label="Фильтр по типу"
                                        size="small"
                                    >
                                        <MenuItem value="">Все типы</MenuItem>
                                        {KLIMOV_TYPES.map(type => (
                                            <MenuItem key={type.value} value={type.value}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Box sx={{
                                                        width: 12,
                                                        height: 12,
                                                        borderRadius: '50%',
                                                        backgroundColor: type.color
                                                    }} />
                                                    {type.label}
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                
                                {(searchTerm || filters.klimovType) && (
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
                                    Добавить специальность
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                    
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Найдено: {filteredSpecialties.length} специальностей
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
                            <TableCell sx={{ width: '100px', fontWeight: 600 }}>Код</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Название</TableCell>
                            <TableCell sx={{ width: '200px', fontWeight: 600 }}>Типы по Климову</TableCell>
                            <TableCell sx={{ width: '250px', fontWeight: 600 }}>Колледжи</TableCell>
                            <TableCell sx={{ width: '150px', fontWeight: 600 }}>Форма обучения</TableCell>
                            <TableCell sx={{ width: '120px', fontWeight: 600 }}>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredSpecialties.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                                    <PsychologyIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                                    <Typography variant="body1" color="text.secondary">
                                        Специальности не найдены
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredSpecialties.map((specialty) => (
                                <TableRow key={specialty._id} hover>
                                    <TableCell>
                                        <Typography sx={{ 
                                            fontWeight: 500, 
                                            fontFamily: 'monospace',
                                            fontSize: '0.9rem'
                                        }}>
                                            {specialty.code}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontWeight: 500, mb: 0.5 }}>
                                            {specialty.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {specialty.educationLevel === 'SPO' ? 'СПО' : 'ВО'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                            {specialty.klimovTypes?.map((type, idx) => {
                                                const typeInfo = KLIMOV_TYPE_MAP[type];
                                                if (!typeInfo) return null;
                                                
                                                return (
                                                    <Tooltip 
                                                        key={idx} 
                                                        title={typeInfo.name}
                                                        arrow
                                                        placement="top"
                                                    >
                                                        <Chip
                                                            label={typeInfo.short}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: alpha(typeInfo.color, 0.1),
                                                                color: typeInfo.color,
                                                                fontSize: '0.75rem',
                                                                fontWeight: 600,
                                                                height: 24,
                                                                '& .MuiChip-label': {
                                                                    px: 1
                                                                }
                                                            }}
                                                        />
                                                    </Tooltip>
                                                );
                                            })}
                                            {(!specialty.klimovTypes || specialty.klimovTypes.length === 0) && (
                                                <Typography variant="caption" color="text.secondary">
                                                    Не указаны
                                                </Typography>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                            {specialty.collegeNames?.slice(0, 3).map((name, idx) => (
                                                <Typography key={idx} variant="body2" sx={{ fontSize: '0.8rem' }}>
                                                    {name}
                                                </Typography>
                                            ))}
                                            {specialty.collegeNames?.length > 3 && (
                                                <Typography variant="caption" color="text.secondary">
                                                    +{specialty.collegeNames.length - 3} еще
                                                </Typography>
                                            )}
                                            {(!specialty.collegeNames || specialty.collegeNames.length === 0) && (
                                                <Typography variant="caption" color="text.secondary">
                                                    Не указаны
                                                </Typography>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {specialty.form === 'full-time' ? (
                                            <Chip 
                                                label="Очная" 
                                                size="small" 
                                                sx={{ 
                                                    backgroundColor: alpha('#10b981', 0.1),
                                                    color: '#10b981',
                                                    fontWeight: 500
                                                }}
                                            />
                                        ) : specialty.form === 'part-time' ? (
                                            <Chip 
                                                label="Очно-заочная" 
                                                size="small" 
                                                sx={{ 
                                                    backgroundColor: alpha('#f59e0b', 0.1),
                                                    color: '#f59e0b',
                                                    fontWeight: 500
                                                }}
                                            />
                                        ) : (
                                            <Chip 
                                                label="Заочная" 
                                                size="small" 
                                                sx={{ 
                                                    backgroundColor: alpha('#6366f1', 0.1),
                                                    color: '#6366f1',
                                                    fontWeight: 500
                                                }}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleOpenDialog(specialty)}
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
                                                onClick={() => handleDeleteSpecialty(specialty._id)}
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

            <Dialog 
                open={openDialog} 
                onClose={handleCloseDialog} 
                maxWidth="lg" 
                fullWidth
                disableRestoreFocus
            >
                <DialogTitle>
                    {editingSpecialty ? 'Редактирование специальности' : 'Новая специальность'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Код специальности по ФГОС*"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleFormChange}
                                    fullWidth
                                    required
                                    placeholder="01.02.03"
                                    error={!!formErrors.code}
                                    helperText={formErrors.code}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Название специальности*"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    fullWidth
                                    required
                                    error={!!formErrors.name}
                                    helperText={formErrors.name}
                                />
                            </Grid>
                        </Grid>
                        
                        <TextField
                            label="Описание (необязательно)"
                            name="description"
                            value={formData.description}
                            onChange={handleFormChange}
                            multiline
                            rows={3}
                            fullWidth
                        />
                        
                        <FormControl fullWidth required error={!!formErrors.klimovTypes}>
                            <InputLabel>Типы по Климову*</InputLabel>
                            <Select
                                multiple
                                name="klimovTypes"
                                value={formData.klimovTypes}
                                onChange={handleFormChange}
                                label="Типы по Климову*"
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => {
                                            const typeInfo = KLIMOV_TYPES.find(t => t.value === value);
                                            return (
                                                <Chip
                                                    key={value}
                                                    label={typeInfo?.label || value}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: alpha(typeInfo?.color || '#6366f1', 0.1),
                                                        color: typeInfo?.color || '#6366f1',
                                                    }}
                                                />
                                            );
                                        })}
                                    </Box>
                                )}
                            >
                                {KLIMOV_TYPES.map((type) => (
                                    <MenuItem key={type.value} value={type.value}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{
                                                width: 12,
                                                height: 12,
                                                borderRadius: '50%',
                                                backgroundColor: type.color
                                            }} />
                                            {type.label}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                            {formErrors.klimovTypes && (
                                <Typography variant="caption" color="error">
                                    {formErrors.klimovTypes}
                                </Typography>
                            )}
                        </FormControl>
                        
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Срок обучения*"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleFormChange}
                                    fullWidth
                                    required
                                    placeholder="2 года 10 месяцев"
                                    error={!!formErrors.duration}
                                    helperText={formErrors.duration}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Форма обучения</InputLabel>
                                    <Select
                                        name="form"
                                        value={formData.form}
                                        onChange={handleFormChange}
                                        label="Форма обучения"
                                    >
                                        <MenuItem value="full-time">Очная</MenuItem>
                                        <MenuItem value="part-time">Очно-заочная</MenuItem>
                                        <MenuItem value="distance">Заочная</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        
                        <FormControl fullWidth required error={!!formErrors.colleges}>
                            <InputLabel>Колледжи*</InputLabel>
                            <Select
                                multiple
                                name="colleges"
                                value={formData.colleges}
                                onChange={handleFormChange}
                                label="Колледжи*"
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => {
                                            const college = colleges.find(c => c._id === value);
                                            return college ? (
                                                <Chip
                                                    key={value}
                                                    label={`${college.name} (${college.city})`}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: alpha('#6366f1', 0.1),
                                                        color: '#6366f1',
                                                    }}
                                                />
                                            ) : null;
                                        })}
                                    </Box>
                                )}
                            >
                                {colleges.map((college) => (
                                    <MenuItem key={college._id} value={college._id}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                {college.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {college.city}, {college.region}
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                            {formErrors.colleges && (
                                <Typography variant="caption" color="error">
                                    {formErrors.colleges}
                                </Typography>
                            )}
                        </FormControl>
                        
                        <Box sx={{ 
                            p: 2, 
                            borderRadius: 1, 
                            backgroundColor: alpha('#6366f1', 0.05),
                            border: `1px solid ${alpha('#6366f1', 0.2)}`
                        }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                <strong>Выбранные колледжи:</strong>
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {selectedColleges.map(college => (
                                    <Chip
                                        key={college._id}
                                        label={`${college.name} (${college.city})`}
                                        size="small"
                                        onDelete={() => {
                                            setFormData(prev => ({
                                                ...prev,
                                                colleges: prev.colleges.filter(id => id !== college._id)
                                            }));
                                        }}
                                    />
                                ))}
                                {selectedColleges.length === 0 && (
                                    <Typography variant="caption" color="text.secondary">
                                        Колледжи не выбраны
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                        
                        <TextField
                            label="Ключевые дисциплины (через запятую)"
                            name="disciplines"
                            value={formData.disciplines}
                            onChange={handleFormChange}
                            fullWidth
                            multiline
                            rows={2}
                            placeholder="Математика, Физика, Информатика, Программирование"
                            helperText="Введите через запятую"
                        />
                        
                        <TextField
                            label="Требования для поступления (через запятую)"
                            name="requirements"
                            value={formData.requirements}
                            onChange={handleFormChange}
                            fullWidth
                            multiline
                            rows={2}
                            placeholder="Аттестат, Медицинская справка, Результаты тестирования"
                            helperText="Введите через запятую"
                        />
                        
                        <TextField
                            label="Перспективы после обучения (через запятую)"
                            name="prospects"
                            value={formData.prospects}
                            onChange={handleFormChange}
                            fullWidth
                            multiline
                            rows={2}
                            placeholder="Трудоустройство, Карьерный рост, Возможность продолжить обучение"
                            helperText="Введите через запятую"
                        />
                        
                        <TextField
                            label="Ссылка на страницу специальности (необязательно)"
                            name="url"
                            value={formData.url}
                            onChange={handleFormChange}
                            fullWidth
                            placeholder="https://example.com/specialty"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Отмена</Button>
                    <Button 
                        onClick={handleSaveSpecialty} 
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        }}
                    >
                        {editingSpecialty ? 'Обновить' : 'Создать'}
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

export default SpecialtyManager;