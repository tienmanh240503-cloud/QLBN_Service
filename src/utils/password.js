import bcrypt  from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const hashedPassword = async (password) => {
    const saltRounds = 10; 
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
};

const comparePassword = async (checkPassword, password) =>{
    return await bcrypt.compare(checkPassword,password);
}

// Tạo mật khẩu ngẫu nhiên mạnh (12 ký tự: chữ hoa, chữ thường, số, ký tự đặc biệt)
const generateRandomPassword = (length = 12) => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const allChars = uppercase + lowercase + numbers + special;
    
    // Đảm bảo có ít nhất 1 ký tự từ mỗi loại
    let password = '';
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];
    
    // Thêm các ký tự ngẫu nhiên còn lại
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Xáo trộn các ký tự
    return password.split('').sort(() => Math.random() - 0.5).join('');
};

export { hashedPassword, comparePassword, generateRandomPassword };