import mongoose from 'mongoose';

const diagnosticResultSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Student ID is required'],
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: [true, 'Course ID is required'],
        },
        score: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        level: {
            type: String,
            required: true,
            enum: {
                values: ['Beginner', 'Intermediate', 'Advanced'],
                message: '{VALUE} is not a valid level',
            },
        },
        // Track how the level was determined
        source: {
            type: String,
            enum: ['diagnostic', 'quiz_performance'],
            default: 'diagnostic',
        },
    },
    { timestamps: true }
);

// One result per student per course (upsert when re-taken)
diagnosticResultSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

const DiagnosticResult = mongoose.model('DiagnosticResult', diagnosticResultSchema);
export default DiagnosticResult;
