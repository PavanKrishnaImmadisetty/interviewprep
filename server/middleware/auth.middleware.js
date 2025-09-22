import jwt from 'jsonwebtoken'

const authMiddleware = async(req,res,next) =>{
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer')){
        res.status(400).json({success:false,message:'Unauthorized ! no token provided'})
    }

    const token = authHeader.split(' ')[1]

    try{

        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        req.user = decoded.user
         
        next()

    }catch(error){
        res.status(404).json({success:false,message:error.message})
    }
}

export default authMiddleware