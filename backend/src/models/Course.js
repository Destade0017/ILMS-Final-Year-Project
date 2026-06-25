import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide a course title'],
            trim: true,
        },
        code: {
            type: String,
            required: [true, 'Please provide a course code (e.g. CSC401)'],
            unique: true,
            uppercase: true,
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Please provide a course description'],
        },
        lecturer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model who is teaching this course
            required: [true, 'A course must be assigned to a lecturer'],
        },
        students: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User', // List of students enrolled in this course
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Course = mongoose.model('Course', courseSchema);

export default Course;
