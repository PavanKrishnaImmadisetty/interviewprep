import express from 'express';
import bcrypt from 'bcryptjs';
import userModel from '../model/user.model.js';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middleware/auth.middleware.js'; // Import middleware

const router = express.Router();

// --- SIGNUP ROUTE ---
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password,branch , batch } = req.body;

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({ name, email, password: hashedPassword, branch, batch });
        await newUser.save();

        // **SECURITY FIX:** Create a safe response object without the password
        const userResponse = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email
        };

        // Use 201 Created for a successful creation
        return res.status(201).json({ success: true, user: userResponse });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

// --- LOGIN ROUTE ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const payload = { user: { id: user._id } };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email
        };

        res.status(200).json({ success: true, token, user: userResponse });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// In user.routes.js
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        // The user ID comes from the middleware's decoded token
        const user = await userModel.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});


// GET user profile by ID
router.get('/:userId', async (req, res) => {
    try {
        // Find user by ID and exclude the password and email for privacy
        const user = await userModel.findById(req.params.userId).select('-password -email');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});


export default router;