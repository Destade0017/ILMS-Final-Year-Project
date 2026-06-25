import User from '../models/User.js';

/**
 * @desc    Get all students
 * @route   GET /api/users/students
 * @access  Private (All authenticated users)
 */
export const getStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' })
            .select('-password') // Exclude password hashes for security
            .sort({ name: 1 }); // Sort alphabetically by name

        res.status(200).json({
            success: true,
            count: students.length,
            data: students,
        });
    } catch (error) {
        console.error('Get Students Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error retrieving student list',
        });
    }
};

/**
 * @desc    Get all lecturers
 * @route   GET /api/users/lecturers
 * @access  Private (All authenticated users)
 */
export const getLecturers = async (req, res) => {
    try {
        const lecturers = await User.find({ role: 'lecturer' })
            .select('-password') // Exclude password hashes for security
            .sort({ name: 1 }); // Sort alphabetically by name

        res.status(200).json({
            success: true,
            count: lecturers.length,
            data: lecturers,
        });
    } catch (error) {
        console.error('Get Lecturers Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error retrieving lecturer list',
        });
    }
};
