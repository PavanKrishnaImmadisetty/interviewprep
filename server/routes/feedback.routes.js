import express from 'express'
import authmiddleware from '../middleware/auth.middleware.js'
import feedback from '../model/feedback.model.js'
const router = express.Router()

router.post('/', authmiddleware,async(req,res) => {

    try{

        const user = req.user.id

        const {feedbacktype,message} = req.body

        const report = new feedback({feedbacktype:feedbacktype,message:message,author:user})

        await report.save()

        res.status(200).json({success:true,message:'Feedback posted successfully'})
    }

    

    catch(e){
        res.status(500).json({success:false,message:e.message})
    }


})

export default router