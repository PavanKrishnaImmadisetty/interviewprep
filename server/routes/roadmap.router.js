import express from 'express'
import { Router } from 'express'
import authMiddleware from '../middleware/auth.middleware.js'
import roadmapModel from '../model/roadmap.model.js'

const router = express.Router()

router.post('/create',authMiddleware,async (req,res) =>{
    try{
        const {title,description} = req.body

        if(!title || !description){
            return res.status(400).json({success:false,message:"Title and Description are required"})
        }

        const newRoadmap = new roadmapModel({
            title,
            description,
            author : req.user.id
        })

        await newRoadmap.save()
        res.status(201).json({success:true,roadmap:newRoadmap})
        
    }catch(e){
        res.status(500).json({success:false,message:e.message}) 
    }
    

})

router.get('/all',authMiddleware,async (req,res) =>{
    try{

        const roadmaps = await roadmapModel.find({status : 'Approved'}).populate('author','name').sort({createdAt : -1})

        res.status(200).json({success:true,roadmaps})   

    }catch(e){
        res.status(500).json({success:false,message:e.message}) 
    }
})

router.get('/:id',authMiddleware,async (req,res) =>{
    try{
        const roadmap = await roadmapModel.findById(req.params.id).populate('author','name')

        if(!roadmap){
            return res.status(400).json({success:false,message:"Roadmap not found"})
        }

        res.status(200).json({success:true,roadmap})    
    }catch(e){
        res.status(500).json({success:false,message:e.message}) 
    }
})

router.put('/:id',authMiddleware,async (req,res) =>{

    try{

        const roadmap = await roadmapModel.findById(req.params.id)

        if(!roadmap){
            return res.status(400).json({success:false,message:"Roadmap not found"})        
        }

        if(req.user.id.toString() !== roadmap.author.toString()){
            return res.status(403).json({success:false,message:"User not authorized"})
        }
        const {title,description} = req.body
        if(!title || !description){
            return res.status(400).json({success:false,message:"Title and Description are required"})
        }

        const updatedRoadmap = await roadmapModel.findByIdAndUpdate(
            req.params.id,
            {
                title : title,
                description : description,
                status : 'Pending'
            },
            {new : true}
        )
        
        res.status(200).json({success:true,roadmap:updatedRoadmap}) 

    }catch(e){
        res.status(500).json({success:false,message:e.message})
    }
})

router.delete('/:id',authMiddleware,async (req,res) => {
    try{
        const roadmap = await roadmapModel.findById(req.params.id)

        if(!roadmap){
            return res.status(400).json({success:false,message:"Roadmap not found"})        
        }

        if(req.user.id.toString() !== roadmap.author.toString()){
            return res.status(403).json({success:false,message:"User not authorized"})
        }

        await roadmapModel.findByIdAndDelete(req.params.id)
        res.status(200).json({success:true,message:"Roadmap deleted successfully"}) 
    }catch(e){
        res.status(500).json({success:false,message:e.message})
    }
}) 


router.put('/like/:id',authMiddleware,async (req,res) => {
    try{

        const roadmap = await roadmapModel.findById(req.params.id)

        if(!roadmap){
            return res.status(400).json({success:false,message:"Roadmap not found"})        
        }

        if(roadmap.likes.includes(req.user.id)){
            roadmap.likes.pull(req.user.id)
        }else{
            roadmap.likes.push(req.user.id)
        }

        await roadmap.save()
        res.status(200).json({success:true,roadmap})    
    }catch(e){
        res.status(500).json({success:false,message:e.message}) 
    }
})

export default router