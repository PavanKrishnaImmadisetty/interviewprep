import express from 'express'
import {v2 as cloudinary} from 'cloudinary'
import multer from 'multer'
import authmiddleware from '../middleware/auth.middleware.js'

const router = express.Router()

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret :process.env.CLOUDINARY_API_SECRET
})

const storage = multer.memoryStorage()
const upload = multer({storage})

router.post('/',authmiddleware,upload.single('image'),async(req,res)=>{
    try{
        if(!req.file){
            return res.status(400).json({message:'No file uploaded'})
        }

        const uploadResult = await new Promise((resolve,reject)=>{
            const uploadStream = cloudinary.uploader.upload_stream(
                {folder:'blog_posts'},
                (error,result)=>{
                    if(error) return reject(error)
                    resolve(result)
                }
            )
            uploadStream.end(req.file.buffer)
        })
        res.status(200).json({imageUrl:uploadResult.secure_url})
    }catch(error){
        console.log('Upload failed:',error)
        res.status(404).json({message:'Server error during upload'})
    }
})

export default router;

