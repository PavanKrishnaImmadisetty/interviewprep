import mongoose from 'mongoose';

// A sub-schema for the dynamic "rounds"
const roundSchema = new mongoose.Schema({
    roundType: {
        type: String,
        required: true,
        enum: ["Online Assessment", "Technical Round", "Managerial Round", "HR Round"]
    },
    description: {
        type: String,
        required: true
    },
    links : [{
        type:String
    }]
});

const experienceSchema = mongoose.Schema(
    {
        // Core Info
        companyName: { type: String, required: true },
        role: { type: String, required: true },
        location: { type: String },
        interviewDate: { type: Date, required: true },
        
        // Dropdown Details
        appliedAt: {
            type: String,
            enum: ['On-campus', 'Off-campus'],
            required: true
        },
        
        verdict: {
            type: String,
            enum: ["Selected", "Not Selected", "In Progress"],
            required: true
        },
        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            required: true
        },

        // Dynamic Rounds
        rounds: [roundSchema],

        

        // Tips / Main Content
        tips: { type: String },

        // Author Link
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userModel',
            required: true
        },

        likes : [{
            type:mongoose.Schema.Types.ObjectId,
            ref:'userModel'
        }],

        status : {
            type : String,
            enum : ['Pending','Approved','Rejected'],
            default : 'Pending'
        }
    }, 
    {
        timestamps: true
    }
);

const ExperienceModel = mongoose.model('Experience', experienceSchema);

export default ExperienceModel;