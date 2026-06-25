import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
    {
        assignmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Assignment',
            required: [true, 'Please provide the parent assignment ID'],
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please provide the student ID'],
        },
        content: {
            type: String,
            required: [true, 'Please provide the submission content (text or link)'],
            trim: true,
        },
        status: {
            type: String,
            required: [true, 'Please specify the grading status'],
            enum: {
                values: ['pending', 'graded'],
                message: '{VALUE} is not a valid grading status (must be: pending, graded)',
            },
            default: 'pending',
        },
        score: {
            type: Number,
            default: null,
            min: [0, 'Score cannot be less than 0'],
        },
        feedback: {
            type: String,
            trim: true,
            default: '',
        },
        submittedAt: {
            type: Date,
            default: Date.now,
        },
        gradedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure a student can submit only once per assignment
submissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;
