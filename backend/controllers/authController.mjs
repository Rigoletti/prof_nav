import User from '../models/User.mjs';
import { 
    generateAccessToken, 
    generateRefreshToken,
    verifyRefreshToken 
} from '../utils/generateTokens.mjs';

// Утилита для установки cookies
const setTokensCookies = (res, accessToken, refreshToken) => {
    // Access token cookie - short-lived
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 минут
        path: '/'
    });

    // Refresh token cookie - long-lived
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
        path: '/'
    });
};

// Утилита для очистки cookies
const clearTokensCookies = (res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
};

export const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName, middleName } = req.body;

        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: 'Все обязательные поля должны быть заполнены'
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Пользователь с таким email уже существует'
            });
        }

        const user = await User.create({
            email,
            password,
            firstName,
            lastName,
            middleName: middleName || '', // Добавляем отчество
            role: 'user'
        });

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        setTokensCookies(res, accessToken, refreshToken);

        const userResponse = {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            middleName: user.middleName, 
            avatar: user.avatar,
            testResults: user.testResults,
            role: user.role,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt
        };

        res.status(201).json({
            success: true,
            message: 'Регистрация успешна',
            user: userResponse
        });
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при регистрации'
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email и пароль обязательны'
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Неверный email или пароль'
            });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Неверный email или пароль'
            });
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        setTokensCookies(res, accessToken, refreshToken);

        const userResponse = {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            middleName: user.middleName,
            avatar: user.avatar,
            testResults: user.testResults,
            role: user.role,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt
        };

        res.json({
            success: true,
            message: 'Авторизация успешна',
            user: userResponse
        });
    } catch (error) {
        console.error('Ошибка при авторизации:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при авторизации'
        });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token отсутствует'
            });
        }

        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            clearTokensCookies(res);
            return res.status(401).json({
                success: false,
                message: 'Недействительный refresh token'
            });
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            clearTokensCookies(res);
            return res.status(401).json({
                success: false,
                message: 'Пользователь не найден'
            });
        }

        const newAccessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        setTokensCookies(res, newAccessToken, newRefreshToken);

        res.json({
            success: true,
            message: 'Токены обновлены'
        });
    } catch (error) {
        console.error('Ошибка при обновлении токена:', error);
        clearTokensCookies(res);
        res.status(500).json({
            success: false,
            message: 'Ошибка при обновлении токена'
        });
    }
};

export const logout = async (req, res) => {
    try {
        clearTokensCookies(res);
        
        res.json({
            success: true,
            message: 'Выход выполнен успешно'
        });
    } catch (error) {
        console.error('Ошибка при выходе:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при выходе'
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Пользователь не авторизован'
            });
        }

        res.json({
            success: true,
            user: {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                middleName: user.middleName, 
                avatar: user.avatar,
                testResults: user.testResults,
                role: user.role,
                isAdmin: user.isAdmin,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Ошибка при получении профиля:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении профиля'
        });
    }
};

export const checkAuth = async (req, res) => {
    try {
        const user = req.user;
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Пользователь не авторизован'
            });
        }

        res.json({
            success: true,
            user: {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                middleName: user.middleName,
                avatar: user.avatar,
                testResults: user.testResults,
                role: user.role,
                isAdmin: user.isAdmin,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Ошибка при проверке аутентификации:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при проверке аутентификации'
        });
    }
};