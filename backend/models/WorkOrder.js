import mongoose from "mongoose";

const noteSchema=new mongoose.Schema(
    {
        author:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
        },
        text:{
            type:String,
        },
        createdAt:{
            type:Date,
            default:Date.now,
        }
    }
)

const AttachmentSchema=new mongoose.Schema(
    {
        url:{
            type:String,
            
        },
        fileName:{
            type:String,
        },
        publicId: {
            type: String,
            required: true,
        },
        contentType: {
            type: String,
            required: true,
        },
        size: {
            type: Number,
        },
    }
)

const workOrderSchema=new mongoose.Schema(
    {
        title:{
            type:String,
            required:true
        },
        description:{
            type:String
        },
        category:{
            type:String,
        },
        priority:{
            type:String,
            enum:['Low','Medium','High','Emergency'],
            default:'Low'
        },
        asset:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Asset',
        },
        reportedBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
        },
        assignedTo:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
        },
        status:{
            type:String,
            enum:['Open','In Progress','On Hold','Completed','Cancelled'],
            default:'Open'
        },
        notes:[noteSchema],
        attachments:[AttachmentSchema],
        location:{
            type:String
        },
        createdAt:{
            type:Date,
            default:Date.now,
        },
        updatedAt:{
            type:Date,
            
        },
        dueDate:{
            type:Date,
        },
        estimatedCompletionTime:{
            type:Number, // in hours
        }
    },
    {
        timestamps: true,
    }
)

const WorkOrder=mongoose.model('WorkOrder',workOrderSchema);

export default WorkOrder;