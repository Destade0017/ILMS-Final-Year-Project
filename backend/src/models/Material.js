import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: [true, 'Please provide the parent course ID'],
        },
        title: {
            type: String,
            required: [true, 'Please provide the material title'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Please provide the material description'],
            trim: true,
        },
        contentType: {
            type: String,
            required: [true, 'Please specify the content type'],
            enum: {
                values: ['pdf', 'video', 'text'],
                message: '{VALUE} is not a valid content type (must be: pdf, video, text)',
            },
        },
        fileUrl: {
            type: String,
            trim: true,
            required: [
                function () {
                    return this.contentType === 'pdf' || this.contentType === 'video';
                },
                'File URL is required for PDF or video content',
            ],
        },
        bodyText: {
            type: String,
            trim: true,
            required: [
                function () {
                    return this.contentType === 'text';
                },
                'Body text is required for text content',
            ],
        },
        difficultyLevel: {
            type: String,
            required: [true, 'Please specify the difficulty level'],
            enum: {
                values: ['easy', 'medium', 'hard'],
                message: '{VALUE} is not a valid difficulty level (must be: easy, medium, hard)',
            },
            default: 'medium',
        },
    },
    {
        timestamps: true,
    }
);

const Material = mongoose.model('Material', materialSchema);

export default Material;
