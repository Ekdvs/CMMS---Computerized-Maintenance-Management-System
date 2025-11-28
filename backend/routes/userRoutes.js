import express from "express";
import { auth } from "../middlewares/authMiddleware";
import { getAllUsers, getUserProfile, updateUserProfile } from "../controllers/userController";
import { authorizeRoles } from "../middlewares/roleMiddleware";



const userRouter =  express.Router();

userRouter.get('/me',auth,getUserProfile);
userRouter.get('/all-users',auth ,authorizeRoles('admin', 'manager'),getAllUsers);
userRouter.put('/update-user/:id',auth ,authorizeRoles('admin', 'manager'),updateUserProfile);

export default userRouter;