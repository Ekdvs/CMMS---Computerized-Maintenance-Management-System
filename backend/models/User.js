import mongoose from "mongoose";

const userSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true,
        },
        password:{
            type:String,
            required:true,
            trim:true,
            minlength:6
        },
        role: { 
            type: String, 
            enum: ['admin','manager','technician','resident'], 
            default: 'resident' 
        },
        phone:{
            type:String,
            required:true,
            trim:true,
            maxlength:10
        },
        forgot_password_otp: {
            type: String,
            default: "",
        },
        forgot_password_expiry: {
            type: Date,
        },
        refresponseh_token: {
            type: String,
            default: "",
        },
        verify_email: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const User=mongoose.model('User',userSchema);

export default User;