import express from 'express';
import { loginUsers, logoutUsers, registerUsers, verifyEmail } from '../controllers/authController';

const userRouter = express.Router();

//registeruser
userRouter.post('/register',registerUsers);

//login
userRouter.post('/login',loginUsers);

//logout
userRouter.post('/logout',auth,logoutUsers);

//verfiy user email 
userRouter.post('/verify-email',verifyEmail)