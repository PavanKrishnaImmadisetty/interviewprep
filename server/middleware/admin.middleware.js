
const adminmiddleware = (req,res,next) =>{
    if(req.user && req.user.role === 'admin'){
        next()
    }else{
        res.status(404).json({success:false,message:'only admins can access'})
    }
}

export default adminmiddleware