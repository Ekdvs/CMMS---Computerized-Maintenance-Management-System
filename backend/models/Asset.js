import mongoose from "mongoose";

const assetSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
        },
        category:{
            type:String,
            required:true,
            trim:true,
        },
        location:{
            type:String,
            
        },
        serialNumber:{
            type:String,
            unique:true,
            trim:true,
        },
        metaData:{
            type:mongoose.Schema.Types.Mixed
        },

    },
    {
        timestamps: true,
    }
)

const Asset=mongoose.model('Asset',assetSchema);

export default Asset;