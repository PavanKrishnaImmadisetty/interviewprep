import commentModel from '../model/comment.model.js'
import authMiddleware from '../middleware/auth.middleware.js'
import ExperienceModel from '../model/post.model.js'
import express from 'express'

const router = express.Router()


// In comment.router.js
router.post('/:experienceId', authMiddleware, async (req, res) => {
    try {
        const { experienceId } = req.params;
        const { content } = req.body;

        // Check if the experience exists (good practice)
        const experience = await ExperienceModel.findById(experienceId);
        if (!experience) {
            return res.status(404).json({ message: 'Experience not found' });
        }

        // FIX 1: Use the correct field names from your schema: 'content', 'author', and 'experience'
        const newComment = new commentModel({
            content: content,
            author: req.user.id,
            experience: experienceId,
        });

        const savedComment = await newComment.save();
        
        // FIX 2: Populate the author details after the comment has been saved
        const populatedComment = await savedComment.populate('author', 'name');

        // Use 201 for successful creation and return the new comment
        res.status(200).json({ success: true, comment: populatedComment });

    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

router.get('/:experienceId', async (req, res) => {
    try {
        const { experienceId } = req.params;

        // The corrected Mongoose query
        const comments = await commentModel.find({ experience: experienceId })
            .populate('author', 'name') // Get the author's name
            .sort({ createdAt: 'desc' }); // Show newest comments first

        // Use a more descriptive 'comments' key in the response
        res.status(200).json({ success: true, comments: comments });

    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});



export default router