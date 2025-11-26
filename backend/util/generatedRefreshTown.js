import jwt from 'jsonwebtoken'
import User from '../models/User'

const generatedRefreshToken = async(userId) => {
    const token = await jwt.sign(
        {
            id:userId
        },
        process.env.SECRET_KEY_REFRESH_TOKEN,
        {
            expiresIn:'7d'
        }

    )
    const updateRefreshTokenUser= await User.findByIdAndUpdate(
            {_id:userId},
            {refresh_token:token}
        );
    return token;
}

export default generatedRefreshToken