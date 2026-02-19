import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true,
        default: 'Не указан'
    },
    region: {
        type: String,
        required: true,
        trim: true,
        default: 'Не указан'
    },
    address: {
        type: String,
        default: 'Адрес не указан',
        trim: true
    },
    website: {
        type: String,
        default: '',
        trim: true
    },
    phone: {
        type: String,
        default: '',
        trim: true
    },
    email: {
        type: String,
        default: '',
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    specialties: [{
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
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Виртуальное поле для количества специальностей
collegeSchema.virtual('specialtyCount').get(function() {
    return this.specialties?.length || 0;
});

// Индексы для оптимизации поиска
collegeSchema.index({ name: 1 });
collegeSchema.index({ city: 1 });
collegeSchema.index({ region: 1 });
collegeSchema.index({ name: 1, city: 1 });

collegeSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const College = mongoose.model('College', collegeSchema);

export default College;