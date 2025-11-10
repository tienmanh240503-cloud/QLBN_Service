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

// Short-lived token for password reset code verification
const generateResetToken = (payload, expiresIn = '10m') => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn });
};

const verifyResetToken = (token) => {
    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
        return null;
    }
};

export {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    verifyAccessToken,
    generateResetToken,
    verifyResetToken
}