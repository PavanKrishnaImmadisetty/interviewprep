import express from 'express';
import ExperienceModel from '../model/post.model.js';
import authMiddleware from '../middleware/auth.middleware.js';
import adminMiddleware from '../middleware/admin.middleware.js';
import userModel from '../model/user.model.js';

const router = express.Router();

// GET all pending experiences (Admin Only)
router.get('/pending', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const pending = await ExperienceModel.find({ status: 'Pending' }).populate('author', 'name');
        res.json({ success: true, experiences: pending });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// PUT to approve an experience (Admin Only)
router.put('/approve/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const experience = await ExperienceModel.findByIdAndUpdate(
            req.params.id,
            { status: 'Approved' },
            { new: true }
        );
        if (!experience) return res.status(404).json({ message: 'Experience not found' });
        res.json({ success: true, experience });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const totalUsers = await userModel.countDocuments();
        const pendingExperiences = await ExperienceModel.countDocuments({ status: 'Pending' });
        const approvedExperiences = await ExperienceModel.countDocuments({ status: 'Approved' });

        res.json({
            success: true,
            stats: {
                totalUsers,
                pendingExperiences,
                approvedExperiences,
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        // Find all users, exclude their passwords, and sort by newest first
        const users = await userModel.find({}).select('-password').sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

router.put('/users/:id/role', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { role } = req.body; // Expecting { "role": "admin" } or { "role": "user" }
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role specified.' });
        }
        const updatedUser = await userModel.findByIdAndUpdate(
            req.params.id,
            { role: role },
            { new: true }
        ).select('-password');

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.json({ success: true, user: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// DELETE /api/admin/users/:id - Delete a user
router.delete('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const deletedUser = await userModel.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

export default router;