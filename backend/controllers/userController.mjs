import User from '../models/User.mjs';

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { firstName, lastName, middleName, avatar } = req.body;

        const updateData = {};
        if (firstName !== undefined) {
            if (firstName.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: 'Имя не может быть пустым'
                });
            }
            updateData.firstName = firstName.trim();
        }
        if (lastName !== undefined) {
            if (lastName.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: 'Фамилия не может быть пустой'
                });
            }
            updateData.lastName = lastName.trim();
        }
        if (middleName !== undefined) {
            updateData.middleName = middleName.trim(); // Добавляем отчество
        }
        if (avatar !== undefined) updateData.avatar = avatar;
        updateData.updatedAt = new Date();

        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Пользователь не найден'
            });
        }

        res.json({
            success: true,
            message: 'Профиль успешно обновлён',
            user
        });
    } catch (error) {
        console.error('Ошибка при обновлении профиля:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при обновлении профиля',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const updateTestResults = async (req, res) => {
    try {
        const userId = req.user._id;
        const { testResults } = req.body;

        if (!testResults) {
            return res.status(400).json({
                success: false,
                message: 'Результаты теста обязательны'
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { 
                testResults,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Пользователь не найден'
            });
        }

        res.json({
            success: true,
            message: 'Результаты теста сохранены',
            user
        });
    } catch (error) {
        console.error('Ошибка при сохранении результатов теста:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при сохранении результатов теста'
        });
    }
};

export const changePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Текущий и новый пароль обязательны'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Новый пароль должен содержать минимум 6 символов'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Пользователь не найден'
            });
        }

        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Текущий пароль неверен'
            });
        }

        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Пароль успешно изменён'
        });
    } catch (error) {
        console.error('Ошибка при изменении пароля:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при изменении пароля'
        });
    }
};