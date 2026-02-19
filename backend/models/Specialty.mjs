import mongoose from 'mongoose';

const specialtySchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    educationLevel: {
        type: String,
        enum: ['SPO', 'VO'],
        default: 'SPO'
    },
    klimovTypes: [{
        type: String,
        enum: ['manNature', 'manTech', 'manHuman', 'manSign', 'manArt']
    }],
    disciplines: [{
        type: String,
        trim: true
    }],
    duration: {
        type: String,
        required: true,
        trim: true
    },
    form: {
        type: String,
        enum: ['full-time', 'part-time', 'distance'],
        default: 'full-time'
    },
    fundingType: {
        type: String,
        enum: ['budget', 'paid', 'both'],
        default: 'both'
    },
    colleges: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College'
    }],
    collegeNames: [{
        type: String,
        trim: true
    }],
    collegeCities: [{
        type: String,
        trim: true
    }],
    requirements: [{
        type: String,
        trim: true
    }],
    prospects: [{
        type: String,
        trim: true
    }],
    url: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Виртуальное поле для срока обучения в годах
specialtySchema.virtual('durationYears').get(function() {
    if (!this.duration) return 0;
    
    const durationLower = this.duration.toLowerCase();
    let years = 0;
    
    // Ищем числа в строке
    const matches = durationLower.match(/(\d+[,.]?\d*)/g);
    if (matches) {
        const num = parseFloat(matches[0].replace(',', '.'));
        
        if (durationLower.includes('год') || durationLower.includes('лет')) {
            years = num;
        } else if (durationLower.includes('мес') || durationLower.includes('месяц')) {
            years = num / 12;
        } else {
            // Если не указана единица измерения, считаем годами
            years = num;
        }
    }
    
    return years;
});

// Виртуальное поле для количества колледжей
specialtySchema.virtual('collegeCount').get(function() {
    return this.colleges?.length || this.collegeNames?.length || 0;
});

specialtySchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Индексы для оптимизации поиска
specialtySchema.index({ code: 1 });
specialtySchema.index({ name: 1 });
specialtySchema.index({ colleges: 1 });
specialtySchema.index({ klimovTypes: 1 });
specialtySchema.index({ form: 1 });
specialtySchema.index({ fundingType: 1 });
specialtySchema.index({ collegeCities: 1 });
specialtySchema.index({ duration: 1 });
specialtySchema.index({ educationLevel: 1 });
// Составной индекс для частых запросов
specialtySchema.index({ form: 1, fundingType: 1, educationLevel: 1 });
specialtySchema.index({ collegeCities: 1, region: 1 });

const Specialty = mongoose.model('Specialty', specialtySchema);

export default Specialty;