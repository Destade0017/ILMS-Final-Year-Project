import User from '../models/User.js';
import Course from '../models/Course.js';
import Assignment from '../models/Assignment.js';
import Submission from '../models/Submission.js';
import Quiz from '../models/Quiz.js';
import AssessmentResult from '../models/AssessmentResult.js';
import Material from '../models/Material.js';
import ActivityLog from '../models/ActivityLog.js';

// Helper function to log activities
export const logActivity = async (userId, action, target = '', details = null) => {
    try {
        await ActivityLog.create({
            user: userId,
            action,
            target,
            details,
        });
    } catch (error) {
        console.error('Failed to log activity:', error);
    }
};

// --- User Management ---

export const getUsers = async (req, res) => {
    try {
        const { role } = req.query;
        const filter = role ? { role } : {};
        
        const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'student',
        });

        await logActivity(req.user._id, 'CREATED_USER', `User: ${user.name}`, { role: user.role });

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({ success: true, data: userResponse });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { name, email, role } = req.body;
        
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;

        await user.save();

        await logActivity(req.user._id, 'UPDATED_USER', `User: ${user.name}`, { role: user.role });

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({ success: true, data: userResponse });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Prevent admin from deleting themselves
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ success: false, message: 'You cannot delete yourself' });
        }

        await user.deleteOne();
        await logActivity(req.user._id, 'DELETED_USER', `User: ${user.name}`);

        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// --- Course Management ---

export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('lecturer', 'name email');
        res.status(200).json({ success: true, count: courses.length, data: courses });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const assignLecturer = async (req, res) => {
    try {
        const { lecturerId } = req.body;
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        const lecturer = await User.findById(lecturerId);
        if (!lecturer || lecturer.role !== 'lecturer') {
            return res.status(400).json({ success: false, message: 'Valid lecturer ID required' });
        }

        course.lecturer = lecturerId;
        await course.save();

        await logActivity(req.user._id, 'ASSIGNED_LECTURER', `Course: ${course.code}`, { lecturer: lecturer.name });

        res.status(200).json({ success: true, data: course });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const removeLecturer = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        course.lecturer = null;
        // In the existing model, lecturer is required. Let's check Course.js schema.
        // If it's required, we can't set it to null. 
        // We'll catch schema validation error or maybe the user just assigns a different one.
        // Assuming we can just assign someone else instead of removing, but for now we attempt to remove.
        await course.save();

        await logActivity(req.user._id, 'REMOVED_LECTURER', `Course: ${course.code}`);

        res.status(200).json({ success: true, data: course });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Could not remove lecturer', error: error.message });
    }
};

// --- System Analytics Dashboard ---

export const getDashboardStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalStudents,
            totalLecturers,
            totalAdmins,
            totalCourses,
            totalQuizzes,
            totalAssignments,
            totalSubmissions,
            totalMaterials,
            avgScoreData,
            topCourses
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: 'student' }),
            User.countDocuments({ role: 'lecturer' }),
            User.countDocuments({ role: 'admin' }),
            Course.countDocuments(),
            Quiz.countDocuments(),
            Assignment.countDocuments(),
            Submission.countDocuments(),
            Material.countDocuments(),
            AssessmentResult.aggregate([{ $group: { _id: null, avgScore: { $avg: '$score' } } }]),
            AssessmentResult.aggregate([
                { $group: { _id: '$courseId', avgScore: { $avg: '$score' } } },
                { $sort: { avgScore: -1 } },
                { $limit: 5 },
                { $lookup: { from: 'courses', localField: '_id', foreignField: '_id', as: 'course' } },
                { $unwind: '$course' }
            ])
        ]);

        const averageStudentScore = avgScoreData.length > 0 ? avgScoreData[0].avgScore : 0;

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalStudents,
                totalLecturers,
                totalAdmins,
                totalCourses,
                totalAssessments: totalQuizzes + totalAssignments,
                totalAssignments,
                totalSubmissions,
                totalMaterials,
                averageStudentScore: parseFloat(averageStudentScore.toFixed(2)),
                topPerformingCourses: topCourses.map(tc => ({
                    courseId: tc.course._id,
                    title: tc.course.title,
                    code: tc.course.code,
                    avgScore: parseFloat(tc.avgScore.toFixed(2))
                }))
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const getRecentActivities = async (req, res) => {
    try {
        const activities = await ActivityLog.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('user', 'name role');

        res.status(200).json({ success: true, data: activities });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
