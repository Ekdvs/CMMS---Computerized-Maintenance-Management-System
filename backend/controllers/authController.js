import bcrypt from 'bcrypt'
import User from '../models/User';
import generatedAccessToken from '../util/generatedAccessToken';
import generatedRefreshToken from '../util/generatedRefreshTown';

//register user
export const registerUsers=async(requset,response)=>{
    try{
       const{name,email,password} =requset.body;
       if(!name||!email||!password){
        return response.status(400).json({
            message:'All field are required',
            error:true,
            success:false
        })
       }

       //email unique check
       const existingUser=await User.findOne({email});

       //check email unique
       if(existingUser){
        return response.status(400).json({
            message:'User already exists Use another Email',
            error:true,
            success:false,
        });
       }
       const hashedPassword = await bcrypt.hash(password,16);

       //create payload
       const payload={
        name,
        email,
        password:hashedPassword
       };

       // register user into database save
        const newUser = await new User(payload).save();
        

        //send email verify link
        const verifyurl = `${process.env.FRONTEND_URL}/verify-email?code=${newUser?._id}`;

        //send  emailmessage
        //await sendWelcomeEmail(newUser,verifyurl)

         return response.status(201).json({
            message:' User registered Successfully',
            data:newUser,
            error:false,
            success:true,
        });
    }
    catch(error){
        return response.status(500).json({
            message:'Internal sever error',
            error:true,
            success:false,
        })

    }


}

//login
export const loginUsers =async(requset,response)=>{
    try{

        const{email,password}=requset.body;
        //check email and password empty
        if(!email||!password){
            return response.status(400).json({
                message:'All Fields are required',
                error:true,
                success:false
            });
        }
        //find user
        const user=await User.findOne({email});
        if(!user){
            return response.status(400).json({
                message:'User not Registered',
                error:true,
                success:false
            });
        }
        // Check if ACTIVE (only if your schema has "status")
        if(user.status!=='ACTIVE'){
             return response.status(400).json({
                message:'User is inative',
                error:true,
                success:false
            });
        }
          // Verify email
        
        if(!user.verify_email){
            return response.status(400).json({
                message:'Please verify your email before logging in',
                error:true,
                success:false
            });
        }
          // Verify password
        const checkpassword= await bcrypt.compare(password,user.password);
        if(!checkpassword){
            return response.status(400).json({
                message:'Invalid Credentials (Incorrect password)',
                error:true,
                success:false
            });
        }
        // acess and refesh token
        const accessToken =await generatedAccessToken(user._id);
        const refeshToken =await generatedRefreshToken(user._id);

         // Update last login
        const updateUser=await User.findByIdAndUpdate(user._id,{
            last_login_date:new Date()
        },{new:true})

        
        return response.status(201).json({
                message:'User Logged in Successfully',
                data:{
                  updateUser,
                  accessToken, 
                  refeshToken,
                },
                error:false,
                success:true
            });

    }
    catch(error){
      console.log(error)
        return response.status(500).json({
                message:error.message,
                error:true,
                success:false
            });

    }

}

//logout
export const logoutUsers = async (requset, responsepose) => {
  try {
    const userId = requset.userId;

    //check user id
    if (!userId) {
      return responsepose.status(401).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }


    // Remove refresponseh token from database
    await User.findByIdAndUpdate(userId, { refresponseh_token: null });

    return responsepose.status(200).json({
      message: "User logged out successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Logout error:", error);
    return responsepose.status(500).json({
      message: "Something went wrong during logout",
      error: true,
      success: false,
    });
  }
};

//verify email adresponses
export const verifyEmail = async (requset, response) => {
  try {
    const { code } = requset.body; 
    console.log(code);

    //check the code
    if (!code) {
      return response.status(401).json({
        message: "Verification code is missing",
        error: true,
        success: false,
      });
    }

    //check user in in data base
    const user = await User.findById(code);
    if (!user) {
      return response.status(401).json({
        message: "Invalid verification link",
        error: true,
        success: false,
      });
    }
  console.log(user.verify_email)
 //check the before email verify the
    if (user.verify_email) {
      return response.status(200).json({
        message: "Email already verified",
        error: false,
        success: true,
      });
    }

    user.verify_email = true;
    await user.save();
    

    return response.status(200).json({
      message: "Email verified successfully",
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
};
