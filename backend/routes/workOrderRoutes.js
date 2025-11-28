import express from "express";
import { auth } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { addNoteToWorkOrder, createWorkOrder, deleteWorkOrderById, getAllWorkOrders, getWorkById, updateWorkOrder, uploadAttachmentToWorkOrder } from "../controllers/workOrderController";

const workOrderRouter = express.Router();

workOrderRouter.post('/create-work-order',auth,createWorkOrder);
workOrderRouter.get('/all-work-orders',auth,getAllWorkOrders);
workOrderRouter.get('/get-work-orders/:id',auth,getWorkById);
workOrderRouter.put('/update-work-order/:id',auth,updateWorkOrder);
workOrderRouter.post('/add-note/:id',auth,addNoteToWorkOrder);
workOrderRouter.delete('/delete-work-order/:id',auth,authorizeRoles('admin','manager'),deleteWorkOrderById);
workOrderRouter.post('/attach-file/:id',auth,uploadAttachmentToWorkOrder);

export default workOrderRouter;