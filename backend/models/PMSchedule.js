import mongoose from "mongoose";

const PMScheduleSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
        },
        asset:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Asset',
            required:true,
        },
        description:{
            type:String,
        },
        recurrence: {
            type: { 
                    type: String, 
                    enum: ['interval','cron'], 
                    default: 'interval' 
                },
            interval: { // 
                        value: Number, 
                        unit: { 
                            type: String, 
                            enum: ['days','weeks','months','quarters'] 
                        }
    },
            cron: {
                type: String,
            }
        },
        chekList:[
            {
                text:String,
                required:Boolean,
            }
        ],
        assignedTo:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
        },
        active:{
            type:Boolean,
            default:true,
        },
        nextRun:{
            type:Date,
        },
        lastRun:{
            type:Date,
        },
        createdAt:{
            type:Date,
            default:Date.now,
        }
    },
    {
        timestamps: true,
    }
)