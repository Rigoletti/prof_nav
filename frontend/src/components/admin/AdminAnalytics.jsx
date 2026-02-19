import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
    alpha,
    useTheme
} from '@mui/material';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import PsychologyIcon from '@mui/icons-material/Psychology';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TimelineIcon from '@mui/icons-material/Timeline';
import PieChartIcon from '@mui/icons-material/PieChart';
import { useAuth } from '../../context/AuthContext';

const AdminAnalytics = () => {
    const theme = useTheme();
    const { api } = useAuth();
    
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [period, setPeriod] = useState('7d');

    useEffect(() => {
        loadData();
    }, [period]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [statsRes, analyticsRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get(`/admin/analytics?period=${period}`)
            ]);
            
            setStats(statsRes.data.stats);
            setAnalytics(analyticsRes.data.analytics);
            setLoading(false);
        } catch (error) {
            console.error('Ошибка загрузки аналитики:', error);
            setLoading(false);
        }
    };

    const KLIMOV_COLORS = {
        manNature: '#10b981',
        manTech: '#3b82f6',
        manHuman: '#ec4899',
        manSign: '#f59e0b',
        manArt: '#8b5cf6'
    };

    const KLIMOV_NAMES = {
        manNature: 'Человек-Природа',
        manTech: 'Человек-Техника',
        manHuman: 'Человек-Человек',
        manSign: 'Человек-Знаковая система',
        manArt: 'Человек-Искусство'
    };

    const formatDate = (data) => {
        if (!data || !data._id) return '';
        return `${data._id.day}.${data._id.month}.${data._id.year}`;
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!stats || !analytics) {
        return null;
    }

    const userStatsData = analytics.userStats.map(item => ({
        date: formatDate(item),
        users: item.count
    }));

    const testStatsData = analytics.testStats.map(item => ({
        date: formatDate(item),
        tests: item.count
    }));

    const specialtyStatsData = analytics.specialtyStats.map(item => ({
        date: formatDate(item),
        specialties: item.count
    }));

    const klimovPieData = stats.klimovDistribution.map(item => ({
        name: KLIMOV_NAMES[item._id] || item._id,
        value: item.count,
        color: KLIMOV_COLORS[item._id] || '#6366f1'
    }));

    const specialtyPopularityData = stats.specialtyPopularity.slice(0, 10).map(item => ({
        name: item.name.substring(0, 20) + (item.name.length > 20 ? '...' : ''),
        saves: item.savedCount || 0
    }));

    const userRoleData = stats.userRoleStats.map(item => ({
        name: item._id === 'admin' ? 'Администраторы' : 'Пользователи',
        value: item.count,
        color: item._id === 'admin' ? '#f59e0b' : '#6366f1'
    }));

    const monthlyUserGrowthData = stats.monthlyUserGrowth.map(item => ({
        month: `${item._id.month}/${item._id.year}`,
        users: item.count
    }));

    const monthlyTestGrowthData = stats.monthlyTestGrowth.map(item => ({
        month: `${item._id.month}/${item._id.year}`,
        tests: item.count
    }));

    const specialtyByRegionData = stats.specialtyByRegion.slice(0, 8).map(item => ({
        region: item._id || 'Не указан',
        specialties: item.specialtyCount || 0,
        colleges: item.collegeCount || 0
    }));

    const testCompletionData = [
        { name: 'Прошли тест', value: stats.testCompletionStats?.totalWithTests || 0, color: '#10b981' },
        { name: 'Не проходили', value: stats.testCompletionStats?.totalWithoutTests || 0, color: '#ef4444' }
    ];

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
                    Аналитика системы
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Статистика и графики активности пользователей
                </Typography>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Card sx={{ p: 2, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <PeopleIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                                        {stats.totalUsers}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Пользователей
                                    </Typography>
                                </Box>
                            </Box>
                        </Card>
                        
                        <Card sx={{ p: 2, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <AssessmentIcon sx={{ fontSize: 32, color: 'success.main' }} />
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                                        {stats.totalTests}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Пройдено тестов
                                    </Typography>
                                </Box>
                            </Box>
                        </Card>
                        
                        <Card sx={{ p: 2, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <SchoolIcon sx={{ fontSize: 32, color: 'warning.main' }} />
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                                        {stats.totalSpecialties}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Специальностей
                                    </Typography>
                                </Box>
                            </Box>
                        </Card>
                        
                        <Card sx={{ p: 2, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <PsychologyIcon sx={{ fontSize: 32, color: 'secondary.main' }} />
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                                        {stats.totalColleges}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Колледжей
                                    </Typography>
                                </Box>
                            </Box>
                        </Card>
                    </Box>
                    
                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Период</InputLabel>
                        <Select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            label="Период"
                            size="small"
                        >
                            <MenuItem value="7d">7 дней</MenuItem>
                            <MenuItem value="30d">30 дней</MenuItem>
                            <MenuItem value="90d">90 дней</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} lg={8}>
                    <Card sx={{ borderRadius: 3, height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <TimelineIcon /> Активность пользователей
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={userStatsData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.primary, 0.1)} />
                                        <XAxis 
                                            dataKey="date" 
                                            stroke={theme.palette.text.secondary}
                                        />
                                        <YAxis 
                                            stroke={theme.palette.text.secondary}
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: theme.palette.background.paper,
                                                borderColor: theme.palette.divider,
                                                borderRadius: 8
                                            }}
                                        />
                                        <Legend />
                                        <Area 
                                            type="monotone" 
                                            dataKey="users" 
                                            stroke="#6366f1" 
                                            fill="#6366f1" 
                                            fillOpacity={0.2}
                                            strokeWidth={2}
                                            name="Регистрации"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} lg={4}>
                    <Card sx={{ borderRadius: 3, height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PieChartIcon /> Распределение по типам Климову
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={klimovPieData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={(entry) => `${entry.name}: ${entry.value}`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {klimovPieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: theme.palette.background.paper,
                                                borderColor: theme.palette.divider,
                                                borderRadius: 8
                                            }}
                                            formatter={(value, name, props) => [`${value} тестов`, props.payload.name]}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} lg={6}>
                    <Card sx={{ borderRadius: 3, height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <TrendingUpIcon /> Активность тестирования
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={testStatsData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.primary, 0.1)} />
                                        <XAxis 
                                            dataKey="date" 
                                            stroke={theme.palette.text.secondary}
                                        />
                                        <YAxis 
                                            stroke={theme.palette.text.secondary}
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: theme.palette.background.paper,
                                                borderColor: theme.palette.divider,
                                                borderRadius: 8
                                            }}
                                        />
                                        <Legend />
                                        <Line 
                                            type="monotone" 
                                            dataKey="tests" 
                                            stroke="#10b981" 
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            activeDot={{ r: 6 }}
                                            name="Пройдено тестов"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} lg={6}>
                    <Card sx={{ borderRadius: 3, height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <SchoolIcon /> Популярность специальностей
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={specialtyPopularityData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.primary, 0.1)} />
                                        <XAxis 
                                            dataKey="name" 
                                            stroke={theme.palette.text.secondary}
                                            angle={-45}
                                            textAnchor="end"
                                            height={60}
                                        />
                                        <YAxis 
                                            stroke={theme.palette.text.secondary}
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: theme.palette.background.paper,
                                                borderColor: theme.palette.divider,
                                                borderRadius: 8
                                            }}
                                            formatter={(value) => [`${value} сохранений`, 'Популярность']}
                                        />
                                        <Legend />
                                        <Bar 
                                            dataKey="saves" 
                                            fill="#8b5cf6" 
                                            name="Сохранений в избранное"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6} lg={4}>
                    <Card sx={{ borderRadius: 3, height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                Распределение пользователей
                            </Typography>
                            <Box sx={{ height: 250 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={userRoleData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={(entry) => `${entry.name}: ${entry.value}`}
                                            outerRadius={70}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {userRoleData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: theme.palette.background.paper,
                                                borderColor: theme.palette.divider,
                                                borderRadius: 8
                                            }}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6} lg={4}>
                    <Card sx={{ borderRadius: 3, height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                Статистика тестирования
                            </Typography>
                            <Box sx={{ height: 250 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={testCompletionData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={(entry) => `${entry.name}: ${entry.value}`}
                                            outerRadius={70}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {testCompletionData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: theme.palette.background.paper,
                                                borderColor: theme.palette.divider,
                                                borderRadius: 8
                                            }}
                                            formatter={(value, name) => [`${value} пользователей`, name]}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={12} lg={4}>
                    <Card sx={{ borderRadius: 3, height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                Региональное распределение
                            </Typography>
                            <Box sx={{ height: 250 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart 
                                        data={specialtyByRegionData}
                                        layout="vertical"
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.primary, 0.1)} horizontal={false} />
                                        <XAxis 
                                            type="number"
                                            stroke={theme.palette.text.secondary}
                                        />
                                        <YAxis 
                                            type="category" 
                                            dataKey="region" 
                                            stroke={theme.palette.text.secondary}
                                            width={80}
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: theme.palette.background.paper,
                                                borderColor: theme.palette.divider,
                                                borderRadius: 8
                                            }}
                                            formatter={(value, name) => [`${value}`, name === 'specialties' ? 'специальностей' : 'колледжей']}
                                        />
                                        <Legend />
                                        <Bar 
                                            dataKey="specialties" 
                                            fill="#3b82f6" 
                                            name="Специальностей"
                                            radius={[0, 4, 4, 0]}
                                        />
                                        <Bar 
                                            dataKey="colleges" 
                                            fill="#10b981" 
                                            name="Колледжей"
                                            radius={[0, 4, 4, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} lg={6}>
                    <Card sx={{ borderRadius: 3, height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                Рост пользователей по месяцам
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={monthlyUserGrowthData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.primary, 0.1)} />
                                        <XAxis 
                                            dataKey="month" 
                                            stroke={theme.palette.text.secondary}
                                        />
                                        <YAxis 
                                            stroke={theme.palette.text.secondary}
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: theme.palette.background.paper,
                                                borderColor: theme.palette.divider,
                                                borderRadius: 8
                                            }}
                                        />
                                        <Legend />
                                        <Line 
                                            type="monotone" 
                                            dataKey="users" 
                                            stroke="#ec4899" 
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            activeDot={{ r: 6 }}
                                            name="Новых пользователей"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} lg={6}>
                    <Card sx={{ borderRadius: 3, height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                Рост тестирований по месяцам
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyTestGrowthData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.primary, 0.1)} />
                                        <XAxis 
                                            dataKey="month" 
                                            stroke={theme.palette.text.secondary}
                                        />
                                        <YAxis 
                                            stroke={theme.palette.text.secondary}
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: theme.palette.background.paper,
                                                borderColor: theme.palette.divider,
                                                borderRadius: 8
                                            }}
                                        />
                                        <Legend />
                                        <Bar 
                                            dataKey="tests" 
                                            fill="#f59e0b" 
                                            name="Пройдено тестов"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Card sx={{ borderRadius: 3, mt: 4 }}>
                <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                        Топ активных пользователей
                    </Typography>
                    <Box>
                        <Grid container spacing={2}>
                            {analytics.userActivity.slice(0, 6).map((user, index) => (
                                <Grid item xs={12} md={6} lg={4} key={user._id}>
                                    <Paper 
                                        elevation={0}
                                        sx={{ 
                                            p: 2, 
                                            borderRadius: 2,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2
                                        }}
                                    >
                                        <Box sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            bgcolor: index === 0 ? '#f59e0b' : '#6366f1',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 600,
                                            fontSize: '1rem'
                                        }}>
                                            {user.firstName?.[0]}{user.lastName?.[0]}
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                {user.firstName} {user.lastName}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                {user.email}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                                <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <AssessmentIcon fontSize="small" />
                                                    {user.testCount} тестов
                                                </Typography>
                                                <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <SchoolIcon fontSize="small" />
                                                    {user.savedCount} сохранений
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default AdminAnalytics;