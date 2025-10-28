import { v2 as cloudinary } from 'cloudinary';
import { DB_CONFID } from './db.config.js';

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: DB_CONFID.cloudinary_connect.cloud_name,
    api_key: DB_CONFID.cloudinary_connect.api_key,
    api_secret: DB_CONFID.cloudinary_connect.api_secret
});

export default cloudinary;
