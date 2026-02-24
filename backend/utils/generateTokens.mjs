import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Проверяем наличие секретных ключей
if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET не настроен в переменных окружения');
}

if (!process.env.JWT_REFRESH_SECRET) {
    console.warn('JWT_REFRESH_SECRET не настроен, используется JWT_SECRET');
}

export const generateAccessToken = (userId) => {
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET не настроен в переменных окружения');
        }
        
        return jwt.sign(
            { userId },
            secret,
            { expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m' }
        );
    } catch (error) {
        console.error('Ошибка генерации access токена:', error);
        throw error;
    }
};

export const generateRefreshToken = (userId) => {
    try {
        // Используем JWT_REFRESH_SECRET, если он есть, иначе JWT_SECRET
        const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('Секретный ключ для refresh токена не настроен');
        }
        
        return jwt.sign(
            { userId },
            secret,
            { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
        );
    } catch (error) {
        console.error('Ошибка генерации refresh токена:', error);
        throw error;
    }
};

export const verifyRefreshToken = (token) => {
    try {
        const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('Секретный ключ для refresh токена не настроен');
        }
        return jwt.verify(token, secret);
    } catch (error) {
        console.error('Ошибка верификации refresh токена:', error.message);
        return null;
    }
};

export const verifyAccessToken = (token) => {
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET не настроен в переменных окружения');
        }
        return jwt.verify(token, secret);
    } catch (error) {
        console.error('Ошибка верификации access токена:', error.message);
        return null;
    }
};