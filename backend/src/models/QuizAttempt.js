import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    answers: {
        type: [Number], // indices of selected options
        required: true
    },
    score: {
        type: Number,
        required: true,
        min: 0
    },
    maxScore: {
        type: Number,
        required: true,
        min: 0
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Ensure a student can only attempt a quiz once
quizAttemptSchema.index({ quizId: 1, studentId: 1 }, { unique: true });

const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);
export default QuizAttempt;
