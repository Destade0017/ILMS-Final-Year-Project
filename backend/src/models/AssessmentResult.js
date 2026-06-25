import mongoose from 'mongoose';

const assessmentResultSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please provide the student ID'],
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: [true, 'Please provide the course ID'],
        },
        lecturerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please provide the lecturer ID'],
        },
        score: {
            type: Number,
            required: [true, 'Please provide the score'],
            min: [0, 'Score cannot be less than 0'],
            max: [100, 'Score cannot exceed 100'],
        },
        type: {
            type: String,
            required: [true, 'Please specify the assessment type'],
            enum: {
                values: ['quiz', 'assignment', 'test'],
                message: '{VALUE} is not a valid assessment type (must be: quiz, assignment, test)',
            },
        },
        topic: {
            type: String,
            trim: true,
            default: 'General',
        },
    },
    {
        timestamps: true, // Automatically manages createdAt and updatedAt fields
    }
);

const AssessmentResult = mongoose.model('AssessmentResult', assessmentResultSchema);

export default AssessmentResult;
