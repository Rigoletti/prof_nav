import React, { useState } from 'react';
import {
    Box,
    Typography,
    Container,
    Card,
    CardContent,
    Button,
    Paper,
    Alert,
    Snackbar,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    CircularProgress,
    IconButton,
    Collapse,
    TextField,
    Grid,
    alpha,
    useTheme,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tabs,
    Tab,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import {
    Upload as UploadIcon,
    Download as DownloadIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    Warning as WarningIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    CloudUpload as CloudUploadIcon,
    Description as DescriptionIcon,
    Verified as VerifiedIcon,
    Refresh as RefreshIcon,
    ArrowRight as ArrowRightIcon,
    Info as InfoIcon,
    Done as DoneIcon,
    Schedule as ScheduleIcon,
    School as SchoolIcon,
    LocationOn as LocationOnIcon,
    Link as LinkIcon,
    Book as BookIcon,
    Work as WorkIcon,
    Build as BuildIcon,
    Palette as PaletteIcon,
    Calculate as CalculateIcon,
    Nature as NatureIcon,
    TableChart as TableChartIcon,
    FileCopy as FileCopyIcon,
    ContentCopy as ContentCopyIcon,
    ArrowBack as ArrowBackIcon,
    People as PeopleIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const ImportSpecialties = () => {
    const theme = useTheme();
    const { api } = useAuth();
    
    const [activeStep, setActiveStep] = useState(0);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [validating, setValidating] = useState(false);
    const [importing, setImporting] = useState(false);
    const [validationResult, setValidationResult] = useState(null);
    const [importResult, setImportResult] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [expandedRows, setExpandedRows] = useState({});
    const [exampleDialogOpen, setExampleDialogOpen] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [copySuccess, setCopySuccess] = useState(false);

    const steps = [
        'Ознакомление с форматом',
        'Заполнение данных',
        'Загрузка файла',
        'Проверка данных',
        'Импорт данных'
    ];

    const exampleData = [
        {
            Код: '09.02.07',
            Название: 'Информационные системы и программирование',
            Описание: 'Подготовка специалистов по разработке и сопровождению информационных систем',
            'Уровень образования': 'СПО',
            'Типы по Климову': 'Человек-Техника,Человек-Знаковая система',
            Дисциплины: 'Математика,Алгоритмизация,Программирование,Базы данных,Веб-технологии',
            'Срок обучения': '3 года 10 месяцев',
            'Форма обучения': 'очная',
            'Тип финансирования': 'бюджет/платно',
            Колледжи: 'Технологический колледж,Колледж информационных технологий',
            Города: 'Москва,Санкт-Петербург',
            Требования: 'Аттестат,Результаты ЕГЭ/ОГЭ',
            Перспективы: 'Программист,Системный администратор,Веб-разработчик',
            Ссылка: 'https://example.com/specialty'
        },
        {
            Код: '23.02.03',
            Название: 'Техническое обслуживание и ремонт автомобильного транспорта',
            Описание: 'Подготовка специалистов по техническому обслуживанию автомобилей',
            'Уровень образования': 'СПО',
            'Типы по Климову': 'Человек-Техника',
            Дисциплины: 'Техническая механика,Электротехника,Устройство автомобилей',
            'Срок обучения': '2 года 10 месяцев',
            'Форма обучения': 'очная',
            'Тип финансирования': 'бюджет',
            Колледжи: 'Автомобильно-дорожный колледж',
            Города: 'Москва',
            Требования: 'Аттестат,Медицинская справка',
            Перспективы: 'Автомеханик,Мастер по ремонту,Диагност',
            Ссылка: 'https://example.com/auto'
        }
    ];

    const handleFileSelect = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setValidationResult(null);
            setImportResult(null);
            setActiveStep(2);
        }
    };

    const handleValidateFile = async () => {
        if (!file) {
            setSnackbar({
                open: true,
                message: 'Выберите файл для проверки',
                severity: 'warning'
            });
            return;
        }

        setValidating(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/admin/import/validate', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setValidationResult(response.data.validation);
            
            if (response.data.validation.isValid) {
                setSnackbar({
                    open: true,
                    message: 'Файл успешно проверен',
                    severity: 'success'
                });
                setActiveStep(3);
            } else {
                setSnackbar({
                    open: true,
                    message: 'В файле обнаружены ошибки',
                    severity: 'error'
                });
            }
        } catch (error) {
            console.error('Ошибка при проверке файла:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Ошибка при проверке файла',
                severity: 'error'
            });
        } finally {
            setValidating(false);
        }
    };

    const handleImport = async () => {
        if (!file) return;

        setImporting(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/admin/import/specialties', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setImportResult(response.data.results);
            setSnackbar({
                open: true,
                message: 'Импорт успешно завершен',
                severity: 'success'
            });
            setActiveStep(4);
        } catch (error) {
            console.error('Ошибка при импорте:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Ошибка при импорте',
                severity: 'error'
            });
        } finally {
            setImporting(false);
        }
    };

    const handleReset = () => {
        setFile(null);
        setValidationResult(null);
        setImportResult(null);
        setActiveStep(0);
        setExpandedRows({});
    };

    const toggleRowExpand = (index) => {
        setExpandedRows(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const handleCopyExample = () => {
        const headers = Object.keys(exampleData[0]).join('\t');
        const rows = exampleData.map(row => Object.values(row).join('\t')).join('\n');
        const text = `${headers}\n${rows}`;
        
        navigator.clipboard.writeText(text).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
            setSnackbar({
                open: true,
                message: 'Пример данных скопирован в буфер обмена',
                severity: 'success'
            });
        });
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Card sx={{ mt: 3, borderRadius: 3 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <InfoIcon /> Шаг 1: Ознакомьтесь с форматом данных
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Убедитесь, что ваш файл соответствует требуемому формату. Вы можете посмотреть пример данных и структуру файла ниже.
                            </Typography>
                            
                            <Box sx={{ p: 3, backgroundColor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2, mb: 3 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                                    Поддерживаемые форматы файлов:
                                </Typography>
                                <Grid container spacing={1}>
                                    <Grid item xs={6} md={3}>
                                        <Chip label=".xlsx" size="small" />
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <Chip label=".xls" size="small" />
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <Chip label=".ods" size="small" />
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <Chip label=".csv" size="small" />
                                    </Grid>
                                </Grid>
                            </Box>

                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme.palette.primary.main }}>
                                    Структура файла:
                                </Typography>
                                
                                <TableContainer component={Paper} sx={{ borderRadius: 2, mb: 3 }}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 600, width: '200px' }}>Колонка</TableCell>
                                                <TableCell sx={{ fontWeight: 600, width: '100px' }}>Тип</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Описание и примеры</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        Код
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label="Обязательно" size="small" color="error" />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        Уникальный код специальности по ФГОС
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                        <strong>Примеры:</strong> 09.02.07, 15.02.08, 23.02.03
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                            
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        Название
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label="Обязательно" size="small" color="error" />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        Полное название специальности
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                        <strong>Примеры:</strong> Программирование в компьютерных системах, Техническое обслуживание и ремонт автомобильного транспорта
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                            
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        Описание
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label="Опционально" size="small" />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        Краткое описание специальности
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                        <strong>Пример:</strong> Подготовка специалистов по разработке, тестированию и сопровождению программного обеспечения
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                            
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        Уровень образования
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label="Опционально" size="small" />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        Уровень образовательной программы
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                        <strong>Допустимые значения:</strong> СПО (среднее профессиональное образование) или ВО (высшее образование)
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                            
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        Типы по Климову
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label="Опционально" size="small" />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        Профессиональные типы по классификации Е.А. Климова
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                                        <Chip icon={<NatureIcon />} label="Человек-Природа" size="small" />
                                                        <Chip icon={<BuildIcon />} label="Человек-Техника" size="small" />
                                                        <Chip icon={<PeopleIcon />} label="Человек-Человек" size="small" />
                                                        <Chip icon={<CalculateIcon />} label="Человек-Знаковая система" size="small" />
                                                        <Chip icon={<PaletteIcon />} label="Человек-Искусство" size="small" />
                                                    </Box>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                                        <strong>Формат:</strong> Указывайте через запятую
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                        <strong>Пример:</strong> Человек-Техника,Человек-Знаковая система
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                            
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        Дисциплины
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label="Опционально" size="small" />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        Ключевые учебные дисциплины
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                        <strong>Формат:</strong> Указывайте через запятую
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                        <strong>Пример:</strong> Математика,Информатика,Программирование,Базы данных
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                            
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        Срок обучения
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label="Опционально" size="small" />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        Продолжительность обучения
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                        <strong>Примеры:</strong> 2 года 10 месяцев, 3 года 10 месяцев, 4 года 10 месяцев
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                            
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        Форма обучения
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label="Опционально" size="small" />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        Форма получения образования
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                        <strong>Допустимые значения:</strong> очная, очно-заочная, заочная
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                            
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        Тип финансирования
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label="Опционально" size="small" />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        Вид финансирования обучения
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                        <strong>Допустимые значения:</strong> бюджет, платно, бюджет/платно
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                            
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        Колледжи
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label="Опционально" size="small" />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        Названия учебных заведений
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                        <strong>Формат:</strong> Указывайте через запятую. Если колледж уже есть в системе, он будет связан. Если нет - будет создан автоматически.
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                        <strong>Пример:</strong> Колледж информационных технологий,Технический колледж,Политехнический колледж
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                            
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        Города
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label="Опционально" size="small" />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        Города расположения колледжей
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                        <strong>Важно:</strong> Порядок городов должен соответствовать порядку колледжей
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                        <strong>Пример:</strong> Москва,Санкт-Петербург,Казань
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                            
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        Требования
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label="Опционально" size="small" />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        Требования для поступления
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                        <strong>Формат:</strong> Указывайте через запятую
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                        <strong>Пример:</strong> Аттестат о среднем образовании,Медицинская справка,Результаты тестирования
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                            
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        Перспективы
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label="Опционально" size="small" />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        Карьерные перспективы после обучения
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                        <strong>Формат:</strong> Указывайте через запятую
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                        <strong>Пример:</strong> Программист,Тестировщик,Системный администратор,Веб-разработчик
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                            
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        Ссылка
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label="Опционально" size="small" />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        Ссылка на официальную страницу специальности
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                        <strong>Пример:</strong> https://college.ru/specialty/programming
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => setExampleDialogOpen(true)}
                                    startIcon={<VisibilityIcon />}
                                >
                                    Посмотреть пример данных
                                </Button>
                                
                                <Button
                                    variant="contained"
                                    onClick={() => setActiveStep(1)}
                                    endIcon={<ArrowRightIcon />}
                                    sx={{
                                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                        }
                                    }}
                                >
                                    Продолжить
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                );

            case 1:
                return (
                    <Card sx={{ mt: 3, borderRadius: 3 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <DescriptionIcon /> Шаг 2: Подготовка файла
                            </Typography>
                            
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Создайте файл в любом табличном редакторе (Excel, Google Sheets, Numbers) или используйте CSV формат.
                            </Typography>
                            
                            <Alert severity="info" sx={{ mb: 3 }}>
                                <Typography variant="body2">
                                    <strong>Совет:</strong> Вы можете скопировать структуру из примера выше и вставить в свою таблицу
                                </Typography>
                            </Alert>

                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme.palette.warning.main }}>
                                    Правила заполнения:
                                </Typography>
                                
                                <List dense>
                                    <ListItem>
                                        <ListItemIcon>
                                            <InfoIcon color="warning" />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary="Код специальности должен быть уникальным"
                                            secondary="Если код уже существует в системе, запись будет обновлена"
                                        />
                                    </ListItem>
                                    <Divider component="li" />
                                    <ListItem>
                                        <ListItemIcon>
                                            <InfoIcon color="warning" />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary="Сохраняйте формат данных"
                                            secondary="Следуйте примерам для правильного формата"
                                        />
                                    </ListItem>
                                    <Divider component="li" />
                                    <ListItem>
                                        <ListItemIcon>
                                            <InfoIcon color="warning" />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary="Проверьте соответствие колледжей и городов"
                                            secondary="Количество городов должно соответствовать количеству колледжей"
                                        />
                                    </ListItem>
                                    <Divider component="li" />
                                    <ListItem>
                                        <ListItemIcon>
                                            <InfoIcon color="warning" />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary="Используйте правильные названия колонок"
                                            secondary="Или следуйте порядку колонок из примера"
                                        />
                                    </ListItem>
                                </List>
                            </Box>

                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme.palette.success.main }}>
                                    Как создать файл:
                                </Typography>
                                
                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    <Grid item xs={12} md={4}>
                                        <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                                            <TableChartIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                            <Typography variant="h6" sx={{ mb: 1 }}>Excel/Google Sheets</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Создайте новую таблицу с нужными колонками
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                                            <FileCopyIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                            <Typography variant="h6" sx={{ mb: 1 }}>CSV файл</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Используйте текстовый редактор с разделителями
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                                            <ContentCopyIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                            <Typography variant="h6" sx={{ mb: 1 }}>Из существующих данных</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Экспортируйте данные из вашей системы
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Box>

                            <Alert severity="success" sx={{ mb: 3 }}>
                                <Typography variant="body2">
                                    <strong>Готовы к загрузке?</strong> Когда вы подготовите файл с данными, переходите к следующему шагу.
                                </Typography>
                            </Alert>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => setActiveStep(0)}
                                    startIcon={<ArrowBackIcon />}
                                >
                                    Назад
                                </Button>
                                
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        // Создаем скрытый input для загрузки файла
                                        document.getElementById('import-file-step2')?.click();
                                    }}
                                    startIcon={<CloudUploadIcon />}
                                    sx={{
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                        }
                                    }}
                                >
                                    Загрузить файл
                                    <input
                                        accept=".xlsx,.xls,.ods,.csv"
                                        style={{ display: 'none' }}
                                        id="import-file-step2"
                                        type="file"
                                        onChange={handleFileSelect}
                                    />
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                );

            case 2:
                return (
                    <Card sx={{ mt: 3, borderRadius: 3 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                Шаг 3: Загрузите файл
                            </Typography>
                            
                            <Box sx={{ mb: 3 }}>
                                <input
                                    accept=".xlsx,.xls,.ods,.csv"
                                    style={{ display: 'none' }}
                                    id="import-file"
                                    type="file"
                                    onChange={handleFileSelect}
                                />
                                <label htmlFor="import-file">
                                    <Paper
                                        sx={{
                                            p: 6,
                                            textAlign: 'center',
                                            border: '2px dashed',
                                            borderColor: file ? 'success.main' : 'divider',
                                            backgroundColor: file ? alpha(theme.palette.success.main, 0.05) : alpha(theme.palette.primary.main, 0.05),
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                            }
                                        }}
                                    >
                                        {file ? (
                                            <>
                                                <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                                                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                                                    Файл выбран
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {file.name} ({Math.round(file.size / 1024)} KB)
                                                </Typography>
                                            </>
                                        ) : (
                                            <>
                                                <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                                                    Нажмите для выбора файла
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Поддерживаемые форматы: .xlsx, .xls, .ods, .csv
                                                </Typography>
                                            </>
                                        )}
                                    </Paper>
                                </label>
                            </Box>
                            
                            {file && (
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Button
                                        variant="contained"
                                        onClick={handleValidateFile}
                                        disabled={validating}
                                        startIcon={validating ? <CircularProgress size={20} /> : <VerifiedIcon />}
                                    >
                                        {validating ? 'Проверка...' : 'Проверить файл'}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            setFile(null);
                                            setValidationResult(null);
                                        }}
                                    >
                                        Очистить
                                    </Button>
                                </Box>
                            )}
                            
                            <Box sx={{ mt: 3 }}>
                                <Button
                                    variant="text"
                                    onClick={() => setExampleDialogOpen(true)}
                                    startIcon={<VisibilityIcon />}
                                >
                                    Посмотреть пример данных еще раз
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                );

            case 3:
                return (
                    <Card sx={{ mt: 3, borderRadius: 3 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <VerifiedIcon /> Шаг 4: Проверка данных
                            </Typography>
                            
                            {validationResult && (
                                <>
                                    <Box sx={{ mb: 3 }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                                                    <Typography variant="h4" sx={{ fontWeight: 800, color: validationResult.isValid ? 'success.main' : 'error.main' }}>
                                                        {validationResult.stats.totalRows}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        строк данных
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                                                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                                                        {validationResult.stats.columns}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        колонок
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    
                                    {!validationResult.isValid && (
                                        <Alert severity="error" sx={{ mb: 3 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                                Обнаружены ошибки:
                                            </Typography>
                                            <Box sx={{ pl: 2 }}>
                                                {validationResult.errors.map((error, index) => (
                                                    <Typography key={index} variant="body2">
                                                        • {error}
                                                    </Typography>
                                                ))}
                                            </Box>
                                        </Alert>
                                    )}
                                    
                                    {validationResult.warnings && validationResult.warnings.length > 0 && (
                                        <Alert severity="warning" sx={{ mb: 3 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                                Предупреждения:
                                            </Typography>
                                            <Box sx={{ pl: 2 }}>
                                                {validationResult.warnings.map((warning, index) => (
                                                    <Typography key={index} variant="body2">
                                                        • {warning}
                                                    </Typography>
                                                ))}
                                            </Box>
                                        </Alert>
                                    )}
                                    
                                    {validationResult.sampleData && validationResult.sampleData.length > 0 && (
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                                Пример данных (первые {validationResult.sampleData.length} строк):
                                            </Typography>
                                            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            {validationResult.headers.map((header, index) => (
                                                                <TableCell key={index} sx={{ fontWeight: 600 }}>
                                                                    {header}
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {validationResult.sampleData.map((row, rowIndex) => (
                                                            <React.Fragment key={rowIndex}>
                                                                <TableRow
                                                                    hover
                                                                    sx={{ cursor: 'pointer' }}
                                                                    onClick={() => toggleRowExpand(rowIndex)}
                                                                >
                                                                    {validationResult.headers.map((header, colIndex) => (
                                                                        <TableCell key={colIndex}>
                                                                            {row[header] || '-'}
                                                                        </TableCell>
                                                                    ))}
                                                                    <TableCell sx={{ width: 50 }}>
                                                                        <IconButton size="small">
                                                                            {expandedRows[rowIndex] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                                        </IconButton>
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell colSpan={validationResult.headers.length + 1} sx={{ p: 0 }}>
                                                                        <Collapse in={expandedRows[rowIndex]}>
                                                                            <Paper sx={{ p: 2, backgroundColor: alpha(theme.palette.primary.main, 0.03) }}>
                                                                                <Typography variant="caption" color="text.secondary">
                                                                                    <strong>Строка {rowIndex + 2}:</strong>
                                                                                </Typography>
                                                                                <Box sx={{ mt: 1 }}>
                                                                                    {Object.entries(row).map(([key, value]) => (
                                                                                        <Box key={key} sx={{ mb: 0.5 }}>
                                                                                            <Chip 
                                                                                                label={key}
                                                                                                size="small"
                                                                                                sx={{ mr: 1 }}
                                                                                            />
                                                                                            <Typography variant="body2" component="span">
                                                                                                {value || '(пусто)'}
                                                                                            </Typography>
                                                                                        </Box>
                                                                                    ))}
                                                                                </Box>
                                                                            </Paper>
                                                                        </Collapse>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </React.Fragment>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    )}
                                    
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Button
                                            variant="contained"
                                            onClick={handleImport}
                                            disabled={!validationResult.isValid || importing}
                                            startIcon={importing ? <CircularProgress size={20} /> : <UploadIcon />}
                                            sx={{
                                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                                }
                                            }}
                                        >
                                            {importing ? 'Импорт...' : 'Начать импорт'}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={() => setActiveStep(2)}
                                        >
                                            Вернуться
                                        </Button>
                                    </Box>
                                </>
                            )}
                        </CardContent>
                    </Card>
                );

            case 4:
                return (
                    <Card sx={{ mt: 3, borderRadius: 3 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CheckCircleIcon color="success" /> Шаг 5: Результаты импорта
                            </Typography>
                            
                            {importResult && (
                                <>
                                    <Box sx={{ mb: 3 }}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={6} md={3}>
                                                <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center', backgroundColor: alpha(theme.palette.info.main, 0.05) }}>
                                                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'info.main' }}>
                                                        {importResult.total}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Всего обработано
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                            <Grid item xs={6} md={3}>
                                                <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center', backgroundColor: alpha(theme.palette.success.main, 0.05) }}>
                                                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'success.main' }}>
                                                        {importResult.created}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Создано
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                            <Grid item xs={6} md={3}>
                                                <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center', backgroundColor: alpha(theme.palette.warning.main, 0.05) }}>
                                                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'warning.main' }}>
                                                        {importResult.updated}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Обновлено
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                            <Grid item xs={6} md={3}>
                                                <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center', backgroundColor: alpha(theme.palette.error.main, 0.05) }}>
                                                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'error.main' }}>
                                                        {importResult.errors.length}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Ошибок
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    
                                    {importResult.errors.length > 0 && (
                                        <Box sx={{ mb: 3 }}>
                                            <Alert severity="warning" sx={{ mb: 2 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    Обнаружены ошибки в {importResult.errors.length} строках
                                                </Typography>
                                            </Alert>
                                            
                                            <TableContainer component={Paper} sx={{ borderRadius: 2, maxHeight: 300 }}>
                                                <Table size="small" stickyHeader>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell sx={{ fontWeight: 600 }}>Строка</TableCell>
                                                            <TableCell sx={{ fontWeight: 600 }}>Ошибка</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {importResult.errors.map((error, index) => (
                                                            <TableRow key={index} hover>
                                                                <TableCell sx={{ fontFamily: 'monospace' }}>
                                                                    {error.row}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography variant="body2" color="error">
                                                                        {error.error}
                                                                    </Typography>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    )}
                                    
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Button
                                            variant="contained"
                                            onClick={handleReset}
                                            startIcon={<RefreshIcon />}
                                        >
                                            Новый импорт
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={() => setActiveStep(0)}
                                        >
                                            Вернуться к началу
                                        </Button>
                                    </Box>
                                </>
                            )}
                        </CardContent>
                    </Card>
                );

            default:
                return null;
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
                    Импорт специальностей
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Массовая загрузка специальностей из файла Excel или CSV
                </Typography>
            </Box>

            <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 4 }}>
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel
                            StepIconProps={{
                                sx: {
                                    '&.Mui-active': {
                                        color: theme.palette.primary.main,
                                    },
                                    '&.Mui-completed': {
                                        color: theme.palette.success.main,
                                    },
                                }
                            }}
                        >
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {label}
                            </Typography>
                        </StepLabel>
                        <StepContent>
                            {renderStepContent(index)}
                        </StepContent>
                    </Step>
                ))}
            </Stepper>

            {activeStep === steps.length && (
                <Paper square elevation={0} sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Все шаги завершены
                    </Typography>
                    <Button onClick={handleReset} variant="contained">
                        Начать новый импорт
                    </Button>
                </Paper>
            )}

            {/* Диалог с примером данных */}
            <Dialog 
                open={exampleDialogOpen} 
                onClose={() => setExampleDialogOpen(false)}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TableChartIcon />
                        Пример данных для импорта
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 3 }}>
                        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 2 }}>
                            <Tab label="Табличный вид" icon={<TableChartIcon />} />
                            <Tab label="CSV формат" icon={<FileCopyIcon />} />
                        </Tabs>
                        
                        {tabValue === 0 && (
                            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            {Object.keys(exampleData[0]).map((header, index) => (
                                                <TableCell key={index} sx={{ fontWeight: 600, backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
                                                    {header}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {exampleData.map((row, rowIndex) => (
                                            <TableRow key={rowIndex}>
                                                {Object.values(row).map((value, colIndex) => (
                                                    <TableCell key={colIndex}>
                                                        <Typography variant="body2">
                                                            {value}
                                                        </Typography>
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                        
                        {tabValue === 1 && (
                            <Paper sx={{ p: 3, backgroundColor: alpha(theme.palette.grey[100], 0.5) }}>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
{`Код\tНазвание\tОписание\tУровень образования\tТипы по Климову\tДисциплины\tСрок обучения\tФорма обучения\tТип финансирования\tКолледжи\tГорода\tТребования\tПерспективы\tСсылка
09.02.07\tИнформационные системы и программирование\tПодготовка специалистов по разработке и сопровождению информационных систем\tСПО\tЧеловек-Техника,Человек-Знаковая система\tМатематика,Алгоритмизация,Программирование,Базы данных,Веб-технологии\t3 года 10 месяцев\tочная\tбюджет/платно\tТехнологический колледж,Колледж информационных технологий\tМосква,Санкт-Петербург\tАттестат,Результаты ЕГЭ/ОГЭ\tПрограммист,Системный администратор,Веб-разработчик\thttps://example.com/specialty
23.02.03\tТехническое обслуживание и ремонт автомобильного транспорта\tПодготовка специалистов по техническому обслуживанию автомобилей\tСПО\tЧеловек-Техника\tТехническая механика,Электротехника,Устройство автомобилей\t2 года 10 месяцев\tочная\tбюджет\tАвтомобильно-дорожный колледж\tМосква\tАттестат,Медицинская справка\tАвтомеханик,Мастер по ремонту,Диагност\thttps://example.com/auto`}
                                </Typography>
                            </Paper>
                        )}
                    </Box>
                    
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                Инструкция по использованию примера
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List dense>
                                <ListItem>
                                    <ListItemText 
                                        primary="Для Excel/Google Sheets"
                                        secondary="Создайте новую таблицу и скопируйте заголовки и данные из примера"
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary="Для CSV файла"
                                        secondary="Скопируйте текст из вкладки 'CSV формат' и сохраните в файле с расширением .csv"
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary="Разделители"
                                        secondary="Используйте табуляцию (\t) как разделитель колонок и перенос строки (\n) для разделения строк"
                                    />
                                </ListItem>
                            </List>
                        </AccordionDetails>
                    </Accordion>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCopyExample} startIcon={<ContentCopyIcon />}>
                        {copySuccess ? 'Скопировано!' : 'Копировать пример'}
                    </Button>
                    <Button onClick={() => setExampleDialogOpen(false)} variant="contained">
                        Закрыть
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

export default ImportSpecialties;