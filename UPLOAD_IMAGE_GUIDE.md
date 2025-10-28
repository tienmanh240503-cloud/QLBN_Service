# 📸 HƯỚNG DẪN UPLOAD HÌNH ẢNH - PROJECT QLBN

## 🎯 Tổng quan
Project sử dụng **Multer** + **Cloudinary** để xử lý upload hình ảnh một cách hiện đại và hiệu quả cho hệ thống quản lý bệnh viện.

## 🏗️ Kiến trúc hệ thống

```
Client (Frontend) 
    ↓ (multipart/form-data)
Multer Middleware 
    ↓ (req.file)
Upload Controller 
    ↓ (base64 conversion)
Cloudinary API 
    ↓ (secure_url)
Response với URL ảnh
```

## 📦 Dependencies đã cài đặt

```json
{
  "multer": "^1.4.5-lts.1",     // Xử lý file upload
  "cloudinary": "^2.1.0"       // Cloud storage
}
```

## 🔧 Cấu hình

### 1. Multer Middleware (`src/middlewares/uploader.middleware.js`)
```javascript
import multer from "multer";

const storage = multer.memoryStorage();  // Lưu file vào RAM
const uploader = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ cho phép upload file hình ảnh!'), false);
        }
    }
});

export default uploader;
```

### 2. Cloudinary Config (`src/configs/cloudinary.config.js`)
```javascript
import { v2 as cloudinary } from 'cloudinary';
import { DB_CONFID } from './db.config.js';

cloudinary.config({
    cloud_name: DB_CONFID.cloudinary_connect.cloud_name,
    api_key: DB_CONFID.cloudinary_connect.api_key,
    api_secret: DB_CONFID.cloudinary_connect.api_secret
});

export default cloudinary;
```

## 🛣️ API Endpoints Upload

### Base URL: `/upload`

#### 1. Upload hình ảnh cho người dùng
```javascript
POST /upload/user
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
- image: file (required)
```

#### 2. Upload hình ảnh cho chuyên khoa
```javascript
POST /upload/chuyenkhoa
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
- image: file (required)
```

#### 3. Upload hình ảnh tổng quát
```javascript
POST /upload/general
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
- image: file (required)
- folder: string (optional) - Tên thư mục trên Cloudinary
```

#### 4. Xóa hình ảnh
```javascript
DELETE /upload/:publicId
Authorization: Bearer <token>

Params:
- publicId: string (required) - Public ID của hình ảnh trên Cloudinary
```

## 🎯 Logic xử lý trong Controller

### Bước 1: Kiểm tra file
```javascript
const file = req.file;
if (!file) {
    return res.status(400).json({ 
        success: false, 
        message: "Vui lòng chọn một tập tin hình ảnh" 
    });
}
```

### Bước 2: Chuyển đổi sang base64
```javascript
const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
const fileName = `user_${Date.now()}`;
```

### Bước 3: Upload lên Cloudinary
```javascript
const result = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload(dataUrl, {
        public_id: fileName,           // Tên file trên Cloudinary
        resource_type: 'auto',        // Tự động detect loại file
        folder: "QLBN/NguoiDung"      // Thư mục lưu trữ
    }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
    });
});

const imageUrl = result.secure_url;  // URL HTTPS của hình ảnh
```

### Bước 4: Trả về response
```javascript
res.status(200).json({
    success: true,
    message: "Upload hình ảnh thành công",
    data: {
        imageUrl: result.secure_url,
        publicId: result.public_id,
        fileName: fileName
    }
});
```

## 🌐 Cách gửi request từ Frontend

### JavaScript (Fetch API)
```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]); // File từ input

fetch('/upload/user', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer ' + token
    },
    body: formData  // Không cần set Content-Type header
})
.then(response => response.json())
.then(data => {
    console.log('Image URL:', data.data.imageUrl);
    // Sử dụng data.data.imageUrl để lưu vào database
});
```

### HTML Form
```html
<form enctype="multipart/form-data">
    <input type="file" name="image" accept="image/*" required>
    <button type="submit">Upload</button>
</form>
```

## 📊 Response Format

### Thành công
```json
{
    "success": true,
    "message": "Upload hình ảnh thành công",
    "data": {
        "imageUrl": "https://res.cloudinary.com/dh0lhvm9l/image/upload/v1234567890/QLBN/NguoiDung/user_1234567890.jpg",
        "publicId": "QLBN/NguoiDung/user_1234567890",
        "fileName": "user_1234567890"
    }
}
```

### Lỗi
```json
{
    "success": false,
    "message": "Vui lòng chọn một tập tin hình ảnh"
}
```

## ⚡ Ưu điểm của hệ thống

- ✅ **API riêng biệt**: Chỉ phục vụ upload hình ảnh
- ✅ **Không lưu file local**: Sử dụng memory storage
- ✅ **CDN Global**: Cloudinary tự động phân phối toàn cầu
- ✅ **Auto Optimization**: Tự động nén và tối ưu hình ảnh
- ✅ **Scalable**: Không giới hạn dung lượng server
- ✅ **Secure**: HTTPS URL và backup tự động
- ✅ **Easy Management**: Quản lý tập trung trên Cloudinary
- ✅ **Flexible**: Có thể chỉ định folder tùy ý

## 🔍 Troubleshooting

### Lỗi thường gặp

1. **"Vui lòng chọn một tập tin hình ảnh"**
   - Kiểm tra field name có đúng là "image" không
   - Đảm bảo form có `enctype="multipart/form-data"`

2. **Cloudinary upload failed**
   - Kiểm tra API credentials trong config
   - Kiểm tra kết nối internet

3. **"Chỉ cho phép upload file hình ảnh!"**
   - Kiểm tra định dạng file có phải là hình ảnh không
   - Kiểm tra MIME type của file

4. **Unauthorized (401)**
   - Kiểm tra token authentication
   - Đảm bảo gửi đúng header Authorization

### Debug Tips

```javascript
// Log file info để debug
console.log('File info:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    buffer: file.buffer.length
});
```

## 📚 Cấu trúc thư mục Cloudinary

```
QLBN/
├── NguoiDung/          # Ảnh đại diện người dùng
│   ├── user_timestamp.jpg
│   └── ...
├── ChuyenKhoa/         # Ảnh chuyên khoa
│   ├── chuyenkhoa_timestamp.jpg
│   └── ...
└── General/            # Ảnh tổng quát
    ├── image_timestamp.jpg
    └── ...
```

## 🚀 Cách test API

### Test với Postman
1. Chọn method POST
2. URL: `http://localhost:5005/upload/user`
3. Headers: `Authorization: Bearer <your-token>`
4. Body → form-data
5. Key: `image`, Type: File, Value: chọn file ảnh
6. Send request

### Test với curl
```bash
curl -X POST http://localhost:5005/upload/user \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/image.jpg"
```

## 💡 Cách sử dụng trong ứng dụng

### 1. Upload ảnh trước
```javascript
// Upload ảnh lên Cloudinary
const uploadResponse = await fetch('/upload/user', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token },
    body: formData
});
const uploadData = await uploadResponse.json();
const imageUrl = uploadData.data.imageUrl;
```

### 2. Sử dụng URL trong API khác
```javascript
// Sử dụng URL ảnh trong API đăng ký/cập nhật
const userData = {
    ho_ten: "Nguyễn Văn A",
    email: "test@example.com",
    anh_dai_dien: imageUrl  // URL từ upload API
};

const registerResponse = await fetch('/nguoi-dung/register', {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token 
    },
    body: JSON.stringify(userData)
});
```

---

*Tạo bởi: tienmanh | Project QLBN - Hệ thống quản lý bệnh viện*
