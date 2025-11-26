import WorkOrder from "../models/WorkOrder";
import { createNotification } from "../sevices/notificationService";
import uploadFileCloudinary from "../util/uploadCloudinary";

//create work order
export const createWorkOrder = async(request , response)=>{
    try {
        const body = request.body;
        body.reportedBy = request.user._id;

        //validation
        if(!body.title || !body.description || !body.asset){
            return response.status(400).json({
                message: "Title, description and asset are required",
                error: true,
                success: false,
            });
        }

        const workOrder = await WorkOrder.create(body);

        //send notification to assignedTo user
        if(workOrder.assignedTo){
            await createNotification({
                userId: workOrder.assignedTo,
                title: "New Work Order Assigned",
                message: `You have been assigned a new work order: ${workOrder.title}`,
                data: { workOrderId: workOrder._id },
            });
        }

        return response.status(201).json({
            message: "Work order created successfully",
            error: false,
            success: true,
            data: workOrder,
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

//get all work orders
export const getAllWorkOrders = async(request , response)=>{
    try {
        const q={}

        //add filters by query params
        if(request.query.status) q.status=request.query.status;
        if(request.query.assignedTo) q.assignedTo=request.query.assignedTo;
        if(request.query.asset) q.asset=request.query.asset;
        if(request.query.priority) q.priority=request.query.priority;

        const list = await WorkOrder.find(q).populate('asset reportedBy assignedTo notes.author');

        return response.status(200).json({
            message: "Work orders fetched successfully",
            error: false,
            success: true,
            data: list,
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

//get work order by id
export const getWorkById = async (request , response)=>{
    try {
        const workOrderId = request.params.id;

        //validate work order id
        if(!workOrderId){
            return response.status(400).json({
                message: "Work Order ID is required",
                error: true,
                success: false,
            });
        }

        //find in data base
        const workOrder = await WorkOrder.findById(workOrderId).populate('asset reportedBy assignedTo notes.author');
        if(!workOrder){
            return response.status(404).json({
                message: "Work Order not found",
                error: true,
                success: false,
            });
        }

        return response.status(200).json({
            message: "Work Order fetched successfully",
            error: false,
            success: true,
            data: workOrder,
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

//update work order
export const updateWorkOrder = async (request , response)=>{
    try {
        const workOrderId = request.params.id;
        const data = request.body;
        const workOrder = await WorkOrder.findByIdAndUpdate(workOrderId, data, { new: true });

        //send notification to assignedTo user if changed
        if(data.assignedTo ){
            await createNotification({
                userId: data.assignedTo,
                title: "Work Order Assigned",
                message: `You have been assigned a work order: ${workOrder.title}`,
                data: { workOrderId: workOrder._id },
            });
        }
        return response.status(200).json({
            message: "Work Order updated successfully",
            error: false,
            success: true,
            data: workOrder,
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

//add note to work order
export const addNoteToWorkOrder = async(request,response)=>{
    try {
        const workOrderId = request.params.id;
        const { note } = {author: request.user._id, text: request.body.text };
        
        if(!workOrderId){
            return response.status(400).json({
                message: "Work Order ID is required",
                error: true,
                success: false,
            }); 
        }

        if(!note.text){
            return response.status(400).json({
                message: "Note text is required",
                error: true,
                success: false,
            }); 
        }

        const workOrder = await WorkOrder.findByIdAndUpdate(workOrderId, { $push: { notes: note } }, { new: true }).populate('notes.author');
        return response.status(200).json({
            message: "Note added successfully",
            error: false,
            success: true,
            data: workOrder,
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

//delete work order
export const deleteWorkOrderById = async(request , response)=>{
    try {
        const workOrderId = request.params.id;
        //validate work order id
        if(!workOrderId){
            return response.status(400).json({
                message: "Work Order ID is required",
                error: true,
                success: false,
            });
        }
        //delete from data base
        const workOrder = await WorkOrder.findByIdAndDelete(workOrderId);
        if(!workOrder){
            return response.status(404).json({
                message: "Work Order not found",
                error: true,
                success: false,
            });
        }
        return response.status(200).json({
            message: "Work Order deleted successfully",
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

//add attachment to work order
export const uploadAttachmentToWorkOrder = async (request, response) => {
  try {
    const workOrderId = request.params.id;
    const file = request.file;

    if (!workOrderId) {
      return response.status(400).json({
        message: "Work Order ID is required",
        error: true,
        success: false,
      });
    }

    if (!file) {
      return response.status(400).json({
        message: "Attachment file is required",
        error: true,
        success: false,
      });
    }

    // Upload to Cloudinary
    const uploadResult = await uploadFileCloudinary(file);

    // Attach data formatted for DB schema
    const attachmentData = {
      fileName: file.originalname,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      contentType: file.mimetype,
      size: file.size,
    };

    const updatedWorkOrder = await WorkOrder.findByIdAndUpdate(
      workOrderId,
      { $push: { attachments: attachmentData } },
      { new: true }
    );

    return response.status(200).json({
      message: "Attachment uploaded successfully",
      error: false,
      success: true,
      data: updatedWorkOrder,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
};