export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({
            success: false,
            message: 'Ошибка валидации',
            errors: messages
        });
    }

    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: 'Пользователь с таким email уже существует'
        });
    }

    res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера',
        error: 'development' === 'development' ? err.message : undefined
    });
};