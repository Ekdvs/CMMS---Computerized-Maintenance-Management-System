import mongoose from "mongoose";

const notifationSchema=new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
        },
        title:{
            type:String,
        },
        message:{
            type:String
        },
        data:{
            type:mongoose.Schema.Types.Mixed,
        },
        read:{
            type:Boolean,
            default:false,
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

const Notification=mongoose.model('Notification',notifationSchema);

export default Notification;