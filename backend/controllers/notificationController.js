import Notification from "../models/Notification";


//get notifications for a user
export const getNotifications =async (request ,response)=>{
    try {
        const userId = request.userId;

        //check user id
        if (!userId) {
            return response.status(401).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }

        //find notifications from database
        const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
        return response.status(200).json({
            message: "Notifications fetched successfully",
            data:notifications,
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

export const markNotificationAsRead = async (request, response) => {
    try {
        const notificationId = request.params.id;

        // Find the notification by ID and update its read status
        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { read: true },
            { new: true }
        );
        if(!notification){
            return response.status(404).json({
                message: "Notification not found", 
                error: true,
                success: false, 
            });
        }
        return response.status(200).json({
            message: "Notification marked as read",
            data: notification,
            success: true,
            error: false,
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