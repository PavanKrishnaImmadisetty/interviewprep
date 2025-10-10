import express from 'express';
import mongoose from 'mongoose';

const roadmapSchema = mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true,

    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'userModel',
        required : true
    },

    status : {
        type : String,
        enum : ['Pending','Approved','Rejected'],
        default : 'Pending'
    },

    likes : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'userModel'
    }]
},
{
    timestamps : true
}
)

const roadmapModel = mongoose.model('roadmapModel',roadmapSchema);
export default roadmapModel;