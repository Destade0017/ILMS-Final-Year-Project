import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: [true, 'Question text is required'],
        trim: true,
    },
    options: {
        type: [String],
        required: true,
        validate: {
            validator: (arr) => arr.length >= 2,
            message: 'Each question must have at least 2 options',
        },
    },
    correctAnswerIndex: {
        type: Number,
        required: [true, 'Correct answer index is required'],
        min: 0,
    },
});

const diagnosticTestSchema = new mongoose.Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: [true, 'Course ID is required'],
            unique: true, // One diagnostic test per course
        },
        title: {
            type: String,
            required: [true, 'Diagnostic test title is required'],
            trim: true,
            default: 'Course Diagnostic Test',
        },
        description: {
            type: String,
            trim: true,
            default: 'Complete this short test to help us personalise your learning materials.',
        },
        questions: {
            type: [questionSchema],
            required: true,
            validate: {
                validator: (arr) => arr.length >= 1,
                message: 'A diagnostic test must have at least one question',
            },
        },
    },
    { timestamps: true }
);

const DiagnosticTest = mongoose.model('DiagnosticTest', diagnosticTestSchema);
export default DiagnosticTest;
