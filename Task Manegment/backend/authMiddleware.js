import jwt from 'jsonwebtoken';
import User from './User.js';

const authMiddleware = async (req, res, next) => {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
            return res.status(401).json({ success: false, error: "No token, authorization denied" });
        }

        const token = req.headers.authorization.split(' ')[1];
        if(!token) {
            return res.status(401).json({success: false, error: "Token not found"})
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_KEY);
        } catch (jwtError) {
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false, 
                    error: "Token expired. Please log in again.",
                    expired: true
                });
            } else if (jwtError.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false, 
                    error: "Invalid token. Please log in again.",
                    invalid: true
                });
            }
            throw jwtError; // Re-throw other errors to outer catch
        }

        if(!decoded || !decoded._id) {
            return res.status(401).json({success: false, error: "Token is not valid"})
        }

        req.user = await User.findById(decoded._id).select('-password');
        if(!req.user) {
             return res.status(401).json({success: false, error: "User not found. Please log in again."})
        }
        
        next();
    } catch(error) {
        // Handle any other unexpected errors
        console.error('Auth middleware error:', error);
        return res.status(401).json({success: false, error: "Not authorized, token failed"})
    }
}

export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, error: 'Not authorized as an admin' });
    }
};

export default authMiddleware;