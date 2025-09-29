import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateAccessToken = (user,vai_tro) => {
    return jwt.sign({info:user, vai_tro : vai_tro}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
};

const generateRefreshToken = (user,vai_tro) => { 
    return jwt.sign({info:user, vai_tro : vai_tro},process.env.REFRESH_TOKEN_SECRET, { expiresIn: '2h' });
};

const verifyAccessToken = (token) => {
    try{
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    }catch(err){
        return null;
    }
};
const verifyRefreshToken = (token) => {
    try{
        return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    }catch(err){
        return null;
    }
};

export {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    verifyAccessToken
}