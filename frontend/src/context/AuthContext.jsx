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
            if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/refresh-token')) {
                originalRequest._retry = true;

                try {
                    // Пытаемся обновить токен
                    await api.post('/auth/refresh-token');
                    // Повторяем исходный запрос
                    return api(originalRequest);
                } catch (refreshError) {
                    // Если не удалось обновить токен, разлогиниваем пользователя
                    setUser(null);
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    );

    // Проверка авторизации при загрузке
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await api.get('/auth/check-auth');
                if (response.data.success) {
                    setUser(response.data.user);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
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
            const response = await api.post('/auth/register', userData);
            
            if (response.data.success) {
                setUser(response.data.user);
                return { success: true };
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Ошибка регистрации';
            setError(message);
            return { success: false, error: message };
        }
    };

    const login = async (email, password) => {
        try {
            setError(null);
            const response = await api.post('/auth/login', { email, password });
            
            if (response.data.success) {
                setUser(response.data.user);
                return { success: true };
            }
        } catch (error) {
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

    const value = {
        user,
        loading,
        error,
        register,
        login,
        logout,
        api
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};