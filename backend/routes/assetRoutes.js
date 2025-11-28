import express from "express";
import { auth } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { createAsset, deleteAssetById, getAllAssets, getAssetById, updateAssetByid } from "../controllers/assetController";

const assetRouter = express.Router();  

assetRouter.post('/add-asset',auth,authorizeRoles('admin', 'manager'),createAsset);
assetRouter.get('/all-assets',auth,getAllAssets)
assetRouter.get('/byid/:id',auth,getAssetById);
assetRouter.put('/update-asset/:id',auth,authorizeRoles('admin', 'manager'),updateAssetByid);
assetRouter.delete('/delete-asset/:id',auth,authorizeRoles('admin', 'manager'),deleteAssetById);

export default assetRouter;