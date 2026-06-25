import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: [true, 'Please provide the parent course ID'],
        },
        title: {
            type: String,
            required: [true, 'Please provide the assignment title'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Please provide the assignment instructions'],
        },
        dueDate: {
            type: Date,
            required: [true, 'Please specify the assignment due date'],
        },
        maxPoints: {
            type: Number,
            required: [true, 'Please provide the maximum points'],
            default: 100,
            min: [1, 'Maximum points must be at least 1'],
        },
    },
    {
        timestamps: true,
    }
);

const Assignment = mongoose.model('Assignment', assignmentSchema);

export default Assignment;
