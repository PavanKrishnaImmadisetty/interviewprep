import jwt from 'jsonwebtoken';
import userModel from '../model/user.model.js'; // 1. Import the userModel

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 2. NEW: Fetch the full user from DB using the ID from the token.
        // We use .select('-password') to remove the password for security.
        req.user = await userModel.findById(decoded.user.id).select('-password');
        
        // If the user associated with the token doesn't exist anymore
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }
};

export default authMiddleware;