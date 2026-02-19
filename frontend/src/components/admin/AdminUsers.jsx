import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Snackbar,
    Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../../context/AuthContext';

const AdminUsers = () => {
    const { api } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data.users);
            setLoading(false);
        } catch (error) {
            console.error('Ошибка загрузки пользователей:', error);
            setLoading(false);
        }
    };

    const handleOpenDialog = (user) => {
        setSelectedUser(user);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedUser(null);
    };

    const handleUpdateRole = async (role) => {
        try {
            await api.put(`/admin/users/${selectedUser._id}/role`, { role });
            setSnackbar({ open: true, message: 'Роль обновлена', severity: 'success' });
            handleCloseDialog();
            loadUsers();
        } catch (error) {
            console.error('Ошибка обновления роли:', error);
            setSnackbar({ open: true, message: 'Ошибка обновления', severity: 'error' });
        }
    };

    if (loading) {
        return <Typography>Загрузка...</Typography>;
    }

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>
                Управление пользователями
            </Typography>
            
            <TableContainer component={Paper}>
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
                        {users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>
                                    {user.firstName} {user.lastName}
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                                        color={user.role === 'admin' ? 'primary' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{user.testResults?.length || 0}</TableCell>
                                <TableCell>
                                    {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleOpenDialog(user)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Изменение роли пользователя</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, minWidth: 300 }}>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            {selectedUser?.firstName} {selectedUser?.lastName}
                        </Typography>
                        <FormControl fullWidth>
                            <InputLabel>Роль</InputLabel>
                            <Select
                                value={selectedUser?.role || 'user'}
                                onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
                                label="Роль"
                            >
                                <MenuItem value="user">Пользователь</MenuItem>
                                <MenuItem value="admin">Администратор</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Отмена</Button>
                    <Button 
                        onClick={() => handleUpdateRole(selectedUser.role)}
                        variant="contained"
                    >
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>

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

export default AdminUsers;