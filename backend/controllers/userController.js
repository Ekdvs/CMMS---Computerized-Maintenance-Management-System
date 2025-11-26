import User from "../models/User";

//get profile of logged in user
export const getUserProfile = async (request, response)=>{
    try {
        const userId = request.userId;

        //check user id
        if(!userId){
            return response.status(400).json({
                message: "User ID is required",
                error: true,
                success: false,
            });
        }
        
        //find user by id
        const user = await User.findById(userId).select("-password");

        //check user present or not
        if(!user){
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }
        return response.status(200).json({
            message: "User profile fetched successfully",
            error: false,
            success: true,
            data: user,
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({
            message: "Internal server error",
            error: true,
            success: false,
        });
    }
}

//get all users
export const getAllUsers = async(request,response)=>{
    try {
        const users = await User.find().select('-password');

        return response.status(200).json({
            message: "Users fetched successfully",
            error: false,
            success: true,
            data: users,
        });
        
    } catch (error) {
        console.error(error);
        return response.status(500).json({
            message: "Internal server error",
            error: true,
            success: false,
        });   
    }
}

//update user profile
export const updateUserProfile = async(request, response)=>{
    try {
        const userId = request.userId;
        const data = request.body;

        //check user id
        if(!userId){
            return response.status(400).json({
                message: "User ID is required",
                error: true,
                success: false,
            });
        }

        //update user
        const updatedUser = await User.findByIdAndUpdate(userId, data, {new:true}).select('-password');

        //check user present or not
        if(!updatedUser){
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }

        return response.status(200).json({
            message: "User profile updated successfully",
            data: updatedUser,
            error: false,
            success: true,
        });
        
    } catch (error) {
        console.error(error);
        return response.status(500).json({
            message: "Internal server error",
            error: true,
            success: false,
        }); 
    }
}