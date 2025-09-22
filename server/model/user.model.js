import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true,

    },

    

    branch:{
        type:String,
        required:true
    },

    batch:{
        type:String,
        required:true
    },
    saves:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Experience'
    }]
},
    {
        timestamps:true
    }

)

const userModel = mongoose.model('userModel',userSchema)
export default userModel;