import mongoose from 'mongoose';

const testSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    testType: {
        type: String,
        enum: ['klimov', 'golomshtok', 'holland', 'yovaysha', 'yovayshala', 'comprehensive'],
        required: true
    },
    sessionData: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    currentQuestionId: {
        type: Number
    },
    answersCount: {
        type: Number,
        default: 0
    },
    progress: {
        type: Number,
        default: 0
    },
    completed: {
        type: Boolean,
        default: false
    },
    lastActivity: {
        type: Date,
        default: Date.now
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: Date
}, {
    timestamps: true
});

// Индексы для быстрого поиска
testSessionSchema.index({ userId: 1, testType: 1, completed: 1 });
testSessionSchema.index({ lastActivity: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 }); // TTL 7 дней

const TestSession = mongoose.model('TestSession', testSessionSchema);
export default TestSession;