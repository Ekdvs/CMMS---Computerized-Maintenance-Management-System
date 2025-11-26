import Asset from "../models/Asset";

// create asset
export const createAsset = async(request,response)=>{
    try {
       
        const { name, type, location, serialNumber } = request.body;

       //validation
       if(!name || !type || !location || !serialNumber){
        return response.status(400).json({
            message: "All fields are required",
            error: true,
            success: false,
        });
       } 

       const newAsset = await Asset.create({
        name,
        type,
        location,
        serialNumber,
       });

       return response.status(201).json({
        message: "Asset created successfully",
        error: false,
        success: true,
        data: newAsset,
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

// get all assets
export const getAllAssets = async(request , response)=>{
    try {

        //get all assets from db
        const assets = await Asset.find();
        return response.status(200).json({
            message: "Assets fetched successfully",
            error: false,
            success: true,
            data: assets,
        })
        
    } catch (error) {
        console.error(error);
        return response.status(500).json({
            message: "Internal server error",
            error: true,
            success: false,
        }); 
    }
}

//get asset by id
export const getAssetById = async(request,response)=>{
    try {

        const assetId = request.params.id;

        //validate asset id
        if(!assetId){
            return response.status(400).json({
                message: "Asset ID is required",
                error: true,
                success: false,
            });
        }

        //find in data base
        const asset = await Asset.findById(assetId);
        if(!asset){
            return response.status(404).json({
                message: "Asset not found",
                error: true,
                success: false,
            });
        }
        return response.status(200).json({
            message: "Asset fetched successfully",
            error: false,
            success: true,
            data: asset,
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

//update asset
export const updateAssetByid = async (request , response)=>{
    try {
        const assetId = request.params.id;
        const { name, type, location, serialNumber } = request.body;
        //validate asset id
        if(!assetId){
            return response.status(400).json({
                message: "Asset ID is required",
                error: true,
                success: false,
            });
        }

        //find asset in data base
        const asset = await Asset.findByIdAndUpdate(assetId, { name, type, location, serialNumber }, { new: true });
        if(!asset){
            return response.status(404).json({
                message: "Asset not found",
                error: true,
                success: false,
            });
        }

        return response.status(200).json({
            message: "Asset updated successfully",
            error: false,
            success: true,
            data: asset,
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

//delete asset
export const deleteAssetById = async(request , response)=>{
    try {
        const assetId = request.params.id;

        //validate asset id
        if(!assetId){
            return response.status(400).json({
                message: "Asset ID is required",
                error: true,
                success: false,
            });
        }
        //delete asset from data base
        const asset = await Asset.findByIdAndDelete(assetId);
        if(!asset){
            return response.status(404).json({
                message: "Asset not found",
                error: true,
                success: false,
            });
        }
        return response.status(200).json({
            message: "Asset deleted successfully",
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