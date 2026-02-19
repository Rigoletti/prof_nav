// models/User.mjs - исправленная схема

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    testResults: [{
        testType: {
            type: String,
            enum: ['klimov_adaptive', 'golomshtok'],
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        klimovScores: {
            manNature: Number,
            manTech: Number,
            manHuman: Number,
            manSign: Number,
            manArt: Number
        },
        primaryKlimovType: String,
        // Результаты Голомштока
        golomshtokScores: {
            physics: Number,
            chemistry: Number,
            electronics: Number,
            mechanics: Number,
            geography: Number,
            literature: Number,
            history: Number,
            pedagogy: Number,
            entrepreneurship: Number,
            sports: Number
        },
        primaryGolomshtokType: String,
        // Исправлено: теперь это массив объектов, а не массив строк
        topGolomshtokTypes: [{
            type: { type: String, required: true },
            score: { type: Number, required: true },
            name: { type: String, required: true }
        }],
        recommendedSpecialties: [{
            specialtyId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Specialty'
            },
            name: String,
            code: String,
            description: String,
            collegeName: String,
            collegeId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'College'
            },
            matchPercentage: Number,
            matchReasons: [String],
            klimovTypes: [String]
        }],
        detailedAnswers: [{
            questionId: Number,
            answer: String,
            timestamp: Date
        }],
        questionsCount: Number
    }],
    savedSpecialties: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Specialty'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Хеширование пароля перед сохранением
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Метод для сравнения паролей
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const User = mongoose.model('User', userSchema);

export default User;