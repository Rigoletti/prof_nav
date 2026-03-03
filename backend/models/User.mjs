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
            enum: ['klimov_adaptive', 'golomshtok', 'holland', 'yovaysha', 'yovaysha_la'],
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        // Результаты Климова
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
        topGolomshtokTypes: [{
            type: { type: String, required: true },
            score: { type: Number, required: true },
            name: { type: String, required: true }
        }],
        
        // Результаты Голланда (Холланда)
        hollandScores: {
            realistic: Number,
            investigative: Number,
            artistic: Number,
            social: Number,
            enterprising: Number,
            conventional: Number
        },
        primaryHollandType: String,
        topHollandTypes: [{
            type: { type: String, required: true },
            score: { type: Number, required: true },
            name: { type: String, required: true }
        }],
        
        // Результаты теста Я. Йовайши
        yovayshaScores: {
            art: Number,
            technical: Number,
            workWithPeople: Number,
            mental: Number,
            aesthetic: Number,
            physical: Number,
            economic: Number
        },
        primaryYovayshaType: String,
        topYovayshaTypes: [{
            type: { type: String, required: true },
            score: { type: Number, required: true },
            name: { type: String, required: true }
        }],
        // Результаты комплексного теста
        comprehensiveScores: {
            klimov: mongoose.Schema.Types.Mixed,
            golomshtok: mongoose.Schema.Types.Mixed,
            holland: mongoose.Schema.Types.Mixed,
            yovaysha: mongoose.Schema.Types.Mixed,
            yovaysha_la: mongoose.Schema.Types.Mixed
        },
        primaryComprehensiveTypes: {
            klimov: String,
            golomshtok: String,
            holland: String,
            yovaysha: String,
            yovaysha_la: String
        },
        // Результаты методики Л.А. Йовайши
        yovayshaLaScores: {
            workWithPeople: Number,
            mentalWork: Number,
            technicalWork: Number,
            aestheticWork: Number,
            extremeWork: Number,
            plannedWork: Number
        },
        primaryYovayshaLaType: String,
        topYovayshaLaTypes: [{
            type: { type: String, required: true },
            score: { type: Number, required: true },
            name: { type: String, required: true }
        }],
        
        // Общие поля для рекомендаций
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
            klimovTypes: [String],
            hollandTypes: [String]
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