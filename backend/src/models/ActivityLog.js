import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please provide the user who performed the action'],
        },
        action: {
            type: String,
            required: [true, 'Please specify the action taken'],
            trim: true,
        },
        target: {
            type: String,
            trim: true,
        },
        details: {
            type: mongoose.Schema.Types.Mixed,
        },
    },
    {
        timestamps: true,
    }
);

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;
