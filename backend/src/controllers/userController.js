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

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        // If a new password is provided, update it (Mongoose pre-save hook handles hashing)
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            data: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            }
        });
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error updating profile',
        });
    }
};
