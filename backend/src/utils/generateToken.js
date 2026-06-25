import jwt from 'jsonwebtoken';

/**
 * Generate a JSON Web Token (JWT) containing the user's unique ID.
 * This token is signed with a secret key and expires after a specified duration.
 * 
 * @param {string} id - The MongoDB User ID
 * @returns {string} - The signed JWT token
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d',
    });
};

export default generateToken;
