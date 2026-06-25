import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware to protect routes by validating JSON Web Tokens (JWT).
 * It extracts the bearer token from the Authorization header, verifies it,
 * and attaches the authenticated user to the request object.
 */
export const protect = async (req, res, next) => {
    let token;

    // Check if the authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header: "Bearer <token>"
            token = req.headers.authorization.split(' ')[1];

            // Verify the token signature
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch the user associated with the token ID and attach to request
            // Exclude the password field from the retrieved user object for security
            req.user = await User.findById(decoded.id);

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'User belonging to this token no longer exists.',
                });
            }

            next();
        } catch (error) {
            console.error('JWT Verification Error:', error.message);
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token validation failed',
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token provided',
        });
    }
};

/**
 * Middleware to restrict route access to specific roles.
 * Must be used AFTER the `protect` middleware to ensure req.user is set.
 * 
 * @param {...string} roles - List of allowed roles (e.g. 'admin', 'lecturer')
 */
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user?.role || 'unknown'}' is not authorized to access this resource`,
            });
        }
        next();
    };
};
