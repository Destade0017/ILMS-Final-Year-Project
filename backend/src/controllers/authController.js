import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import crypto from 'crypto';

/**
 * @desc    Register a new user (Student, Lecturer, or Admin)
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Validate request body
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, and password',
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'A user with this email address already exists',
            });
        }

        // Create the user document (pre-save hook will hash the password)
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'student', // Defaults to student if not specified
        });

        // Generate a JSON Web Token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token,
            },
        });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error during registration',
        });
    }
};

/**
 * @desc    Authenticate user & get token (Login)
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate request body
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both email and password',
            });
        }

        // Find the user by email and explicitly select the password field
        // (needed because 'password' is set to 'select: false' in the Schema)
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token,
            },
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error during login',
        });
    }
};

/**
 * @desc    Get current logged in user profile
 * @route   GET /api/auth/profile
 * @access  Private (Requires JWT token)
 */
export const getUserProfile = async (req, res) => {
    try {
        // req.user is attached by the 'protect' middleware after token verification
        res.status(200).json({
            success: true,
            data: {
                _id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
                createdAt: req.user.createdAt,
            },
        });
    } catch (error) {
        console.error('Profile Retrieval Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error retrieving profile details',
        });
    }
};

/**
 * @desc    Generate password reset token & email it (or return fallback)
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email address',
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'There is no user registered with this email address',
            });
        }

        // Get reset token
        const resetToken = user.getResetPasswordToken();

        await user.save();

        // Create reset URL
        const resetUrl = `http://localhost:5174/reset-password/${resetToken}`;

        console.log('\n========================================');
        console.log('PASSWORD RESET LINK GENERATED FOR LOCAL DEVELOPMENT:');
        console.log(resetUrl);
        console.log('========================================\n');

        // Return the resetUrl directly in the data body to make frontend manual testing super smooth
        res.status(200).json({
            success: true,
            message: 'Email sent/reset link generated',
            data: {
                resetUrl,
                resetToken
            }
        });

    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error processing forgot password request',
        });
    }
};

/**
 * @desc    Reset password using reset token
 * @route   PUT /api/auth/reset-password/:resetToken
 * @access  Public
 */
export const resetPassword = async (req, res) => {
    const { resetToken } = req.params;
    const { password } = req.body;

    try {
        if (!password || password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a new password of at least 6 characters',
            });
        }

        // Get hashed token
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Find user by token and check if it has not expired
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired password reset token',
            });
        }

        // Set new password (pre-save hook will hash it)
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        // Log the user in directly by returning a new JWT token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Password reset successful',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token,
            },
        });

    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error resetting password',
        });
    }
};
