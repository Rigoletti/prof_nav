import { verifyAccessToken } from '../utils/generateTokens.mjs';
import User from '../models/User.mjs';

export const authenticate = async (req, res, next) => {
    try {
        // Пробуем получить токен из заголовка Authorization
        const authHeader = req.headers.authorization;
        let token;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } 
        // Или из cookies
        else if (req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Требуется авторизация'
            });
        }

        const decoded = verifyAccessToken(token);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Недействительный или просроченный токен'
            });
        }

        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Пользователь не найден'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Ошибка авторизации'
        });
    }
};

export const authenticateAdmin = async (req, res, next) => {
    try {
        await authenticate(req, res, () => {
            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Доступ запрещён. Требуется роль администратора'
                });
            }
            next();
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Ошибка авторизации'
        });
    }
};