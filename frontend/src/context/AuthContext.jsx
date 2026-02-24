import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const api = axios.create({
        baseURL: 'http://localhost:5000/api',
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // Интерцептор для обработки ошибок
    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            // Если ошибка 401 и это не запрос на refresh token
            if (error.response?.status === 401 && 
                !originalRequest._retry && 
                !originalRequest.url.includes('/auth/refresh-token') &&
                !originalRequest.url.includes('/auth/login') &&
                !originalRequest.url.includes('/auth/register')) {
                
                originalRequest._retry = true;

                try {
                    // Пытаемся обновить токен
                    const refreshResponse = await api.post('/auth/refresh-token');
                    
                    if (refreshResponse.data.success) {
                        // Повторяем исходный запрос
                        return api(originalRequest);
                    }
                } catch (refreshError) {
                    console.error('Failed to refresh token:', refreshError);
                    // Если не удалось обновить токен, разлогиниваем пользователя
                    setUser(null);
                }
            }

            return Promise.reject(error);
        }
    );

    // Проверка авторизации при загрузке
    useEffect(() => {
        const checkAuth = async () => {
            try {
                console.log('Checking authentication...');
                const response = await api.get('/auth/check-auth');
                
                if (response.data.success) {
                    console.log('User authenticated:', response.data.user);
                    setUser(response.data.user);
                } else {
                    console.log('Not authenticated');
                    setUser(null);
                }
            } catch (error) {
                console.error('Auth check failed:', error.response?.data || error.message);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const register = async (userData) => {
        try {
            setError(null);
            console.log('Registering with data:', { ...userData, password: '***' });
            
            const response = await api.post('/auth/register', userData);
            
            if (response.data.success) {
                console.log('Registration successful:', response.data.user);
                setUser(response.data.user);
                return { success: true, user: response.data.user };
            } else {
                throw new Error(response.data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error.response?.data || error.message);
            const message = error.response?.data?.message || 'Ошибка регистрации';
            setError(message);
            return { success: false, error: message };
        }
    };

    const login = async (email, password) => {
        try {
            setError(null);
            console.log('Logging in with:', { email, password: '***' });
            
            const response = await api.post('/auth/login', { email, password });
            
            if (response.data.success) {
                console.log('Login successful:', response.data.user);
                setUser(response.data.user);
                return { success: true, user: response.data.user };
            } else {
                throw new Error(response.data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            const message = error.response?.data?.message || 'Ошибка входа';
            setError(message);
            return { success: false, error: message };
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
        }
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await api.put('/users/profile', profileData);
            
            if (response.data.success) {
                setUser(response.data.user);
                return { success: true, user: response.data.user };
            } else {
                throw new Error(response.data.message || 'Update failed');
            }
        } catch (error) {
            console.error('Profile update error:', error.response?.data || error.message);
            const message = error.response?.data?.message || 'Ошибка обновления профиля';
            return { success: false, message };
        }
    };

    const changePassword = async (passwordData) => {
        try {
            const response = await api.put('/users/password', passwordData);
            
            if (response.data.success) {
                return { success: true };
            } else {
                throw new Error(response.data.message || 'Password change failed');
            }
        } catch (error) {
            console.error('Password change error:', error.response?.data || error.message);
            const message = error.response?.data?.message || 'Ошибка изменения пароля';
            return { success: false, message };
        }
    };

    const value = {
        user,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        changePassword,
        api
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};