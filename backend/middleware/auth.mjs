import { verifyAccessToken } from '../utils/generateTokens.mjs';
import User from '../models/User.mjs';

export const authenticate = async (req, res, next) => {
    try {
        let token = null;
        
        // Пробуем получить токен из cookies (приоритет)
        if (req.cookies && req.cookies.accessToken) {
            token = req.cookies.accessToken;
        } 
        // Или из заголовка Authorization
        else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
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
        console.error('Ошибка аутентификации:', error);
        return res.status(401).json({
            success: false,
            message: 'Ошибка авторизации'
        });
    }
};

export const authenticateAdmin = async (req, res, next) => {
    try {
        await authenticate(req, res, async () => {
            if (!req.user || !req.user.isAdmin) {
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