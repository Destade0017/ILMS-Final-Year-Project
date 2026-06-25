import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true,
        trim: true
    },
    options: {
        type: [String],
        required: true,
        validate: [arr => arr.length >= 2, 'A question must have at least 2 options']
    },
    correctAnswerIndex: {
        type: Number,
        required: true,
        min: 0
    }
});

const quizSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    timeLimit: {
        type: Number, // in minutes
        default: 0 // 0 means no time limit
    },
    questions: {
        type: [questionSchema],
        required: true,
        validate: [arr => arr.length > 0, 'A quiz must contain at least 1 question']
    },
    maxPoints: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});

// Auto-set maxPoints to the number of questions if not specified
quizSchema.pre('save', function() {
    if (!this.maxPoints || this.maxPoints === 0) {
        this.maxPoints = this.questions.length;
    }
});

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
