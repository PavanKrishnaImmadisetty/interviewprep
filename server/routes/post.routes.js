import express from 'express';
import ExperienceModel from '../model/post.model.js'; // 1. Use the new model
import authMiddleware from '../middleware/auth.middleware.js';
import userModel from '../model/user.model.js';

const router = express.Router();

// --- CREATE A NEW EXPERIENCE ---
router.post('/postexperience', authMiddleware, async (req, res) => {
    try {
        // 2. Destructure all the new fields from the form
        const {
            companyName, role, location, interviewDate,
            appliedAt, verdict, difficulty, rounds,links, tips
        } = req.body;

        const newExperience = new ExperienceModel({
            companyName, role, location, interviewDate,
            appliedAt, verdict, difficulty, rounds,links, tips,
            author: req.user.id,
        });

        await newExperience.save();
        res.status(201).json({ success: true, experience: newExperience });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- UPDATE AN EXPERIENCE ---
router.put('/experiences/:id', authMiddleware, async (req, res) => {
    try {
        const experience = await ExperienceModel.findById(req.params.id);

        if (!experience) {
            return res.status(404).json({ success: false, message: 'Experience not found' });
        }
        if (experience.author.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'User not authorized' });
        }

        const updatedExperience = await ExperienceModel.findByIdAndUpdate(
            req.params.id,
            req.body, // Pass the whole body to update all fields
            { new: true }
        );
        res.status(200).json({ success: true, experience: updatedExperience });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- DELETE AN EXPERIENCE ---
router.delete('/experiences/:id', authMiddleware, async (req, res) => {
    try {
        const experience = await ExperienceModel.findById(req.params.id);

        if (!experience) {
            return res.status(404).json({ success: false, message: 'Experience not found' });
        }
        if (experience.author.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'User not authorized' });
        }

        await ExperienceModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Experience deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// --- GET ALL EXPERIENCES (PUBLIC) ---
router.get('/experiences',authMiddleware, async (req, res) => {
    try {
        const experiences = await ExperienceModel.find({})
            .populate('author', 'name branch')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, experiences });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// --- GET A SINGLE EXPERIENCE BY ID ---
router.get('/experiences/:id',authMiddleware, async (req, res) => {
    try {
        const experience = await ExperienceModel.findById(req.params.id).populate('author', 'name branch');
        if (!experience) {
            console.log('hello')
            return res.status(404).json({ success: false, message: 'Experience not found' });
        }
        res.status(200).json({ success: true, experience });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// --- GET ALL EXPERIENCES BY A USER ---
router.get('/experiences/user/:userId',authMiddleware, async (req, res) => {
    try {
        const experiences = await ExperienceModel.find({ author: req.params.userId })
            .populate('author', 'name branch')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, experiences });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// In experience.router.js

// This should be a PUT request to /:id/like
router.put('/experiences/:id/like', authMiddleware, async (req, res) => {
    try {
        // First, find the specific experience document by its ID
        const experience = await ExperienceModel.findById(req.params.id);
        
        if (!experience) {
            
            return res.status(404).json({ message: 'Experience not found' });
        }

        const userId = req.user.id;
        const hasLiked = experience.likes.includes(userId);

        if (hasLiked) {
            // If already liked, remove the user's ID from the likes array
            experience.likes.pull(userId);
        } else {
            // If not liked, add the user's ID to the likes array
            experience.likes.push(userId);
        }

        // Save the changes to that specific document
        await experience.save();
        res.status(200).json(experience);

    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});


router.put('/experiences/:id/save', authMiddleware, async (req, res) => {
    try {
        const  id  = req.params.id;
        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const hasSaved = user.saves.includes(experienceId);

        if (hasSaved) {
            // If already saved, remove it (unsave)
            user.saves.pull(id);
        } else {
            // If not saved, add it
            user.saves.push(id);
        }

        await user.save();
        // Return the updated user object (without password)
        const updatedUser = await ExperienceModel.findById(user).select('-password');
        res.status(200).json({ success: true, user: updatedUser });

    } catch (error) {
        console.log(id)
        res.status(500).json({success:false, message: 'server error' });
    }
});

export default router;