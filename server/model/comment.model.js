import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
    content : {
        type : String,
        required : true
    },

    author : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'userModel'
    },

    experience : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Experience',
        required : true
    }


})

const Comment = mongoose.model('Comment',commentSchema)

export default Comment