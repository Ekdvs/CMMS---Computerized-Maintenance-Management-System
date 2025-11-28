

export const auth = async(request, response ,next)=>{
    try {
        //get token from header
        const token = request.headers.authorization.split(" ")[1];

        //check token
        if(!token){
            return response.status(401).json({
                message:"No token provided",
                error:true,
                success:false
            });
        }

        //verify token
        const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);        request.userId = decoded.userId;

        if (!decoded) {
            return response.status(401).json({
            message: "Invalid token. Unauthorized",
            error: true,
            success: false,
            });
        }
    
        // Find user in DB
    const user = await UserModel.findById(decoded.id).select("-password");
    if (!user) {
      return response.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    // Attach user to request
    request.user = user;
    request.userId = decoded.id;
        next();
    } 
    catch (error) {
        console.error("Auth middleware error:", error);
            return response.status(401).json({
                message: "Invalid or expired token",
                error: true,
                success: false,
            });
        }
}