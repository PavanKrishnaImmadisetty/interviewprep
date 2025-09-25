import express from 'express'
import mongoose from 'mongoose'

const feedbackSchema = new mongoose.Schema({

    feedbacktype : {
        type : String,
        required : true,
        enum : ['Bug Report', 'Feature Request', 'General comment']
    },

    message : {
        type : String,
        required : true
    },

    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'userModel',
        required : true
    }
},
{   
    timestamps:true

})

const feedback = mongoose.model('feedback',feedbackSchema)
export default feedback;

