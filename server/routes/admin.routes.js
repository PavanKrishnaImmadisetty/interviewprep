import express from 'express';
import ExperienceModel from '../model/post.model.js';
import authMiddleware from '../middleware/auth.middleware.js';
import adminMiddleware from '../middleware/admin.middleware.js';
import userModel from '../model/user.model.js';
import roadmapModel from '../model/roadmap.model.js';

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

/* rotes for roadmaps */

router.get('/pending-roadmaps',authMiddleware,adminMiddleware,async (req,res) => {

    try{

        const roadmaps = await roadmapModel.find({status : 'Pending'}).populate('author','name').sort({createdAt : -1})

        res.status(200).json({success:true,roadmaps})

    }catch(e){
        res.status(500).json({success:false,message:'Server Error'})    
    }

})



// PUT /api/admin/roadmaps/:id/status - Update a roadmap's status
router.put('/roadmaps/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { status } = req.body; // e.g., { "status": "Approved" }
        const { id } = req.params;

        // Optional: Validate the incoming status to be safe
        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value.' });
        }

        const updatedRoadmap = await roadmapModel.findByIdAndUpdate(
            id,
            { status: status },
            { new: true }
        );

        if (!updatedRoadmap) {
            return res.status(404).json({ message: 'Roadmap not found.' });
        }

        res.status(200).json({ success: true, roadmap: updatedRoadmap });

    } catch (e) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});



export default router;