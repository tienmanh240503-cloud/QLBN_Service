import { YeuCauEmail, LichSuGuiEmail, QuanTriVien } from "../models/index.js";
import { v4 as uuidv4 } from 'uuid';
import db from '../configs/connectData.js';
import { sendEmail, getNewsletterWelcomeEmail, getConsultationEmail } from '../services/email.service.js';

// Tạo yêu cầu email mới (từ form đăng ký)
export const createYeuCauEmail = async (req, res) => {
    try {
        const { email, ho_ten, so_dien_thoai, loai_yeu_cau } = req.body;

        if (!email) {
            return res.status(400).json({ 
                success: false, 
                message: "Email là bắt buộc" 
            });
        }

        // Kiểm tra email đã tồn tại chưa
        const existing = await YeuCauEmail.findOne({ email, loai_yeu_cau });
        if (existing && existing.trang_thai !== 'da_huy') {
            return res.status(400).json({ 
                success: false, 
                message: "Email này đã đăng ký nhận tin tức" 
            });
        }

        const id_yeu_cau = `YC_${uuidv4()}`;

        const yeuCau = await YeuCauEmail.create({
            id_yeu_cau,
            email,
            ho_ten: ho_ten || null,
            so_dien_thoai: so_dien_thoai || null,
            loai_yeu_cau: loai_yeu_cau || 'dang_ky_nhan_tin_tuc',
            trang_thai: 'chua_xu_ly'
        });

        // Tự động gửi email chào mừng khi đăng ký
        if (loai_yeu_cau === 'dang_ky_nhan_tin_tuc' || !loai_yeu_cau) {
            try {
                const template = getNewsletterWelcomeEmail(ho_ten, email);
                
                const emailResult = await sendEmail({
                    to: email,
                    subject: 'Chào mừng đến với Bản tin Y tế!',
                    html: template.html,
                    text: template.text
                });

                // Lưu lịch sử gửi email
                const id_lich_su = `LS_${uuidv4()}`;
                await LichSuGuiEmail.create({
                    id_lich_su,
                    id_yeu_cau,
                    email_nguoi_nhan: email,
                    tieu_de: 'Chào mừng đến với Bản tin Y tế!',
                    noi_dung: template.html,
                    loai_email: 'tin_tuc_y_te',
                    trang_thai_gui: emailResult.success ? 'thanh_cong' : 'that_bai',
                    loi_gui: emailResult.error || null,
                    id_quan_tri_vien: null,
                    thoi_gian_gui: emailResult.success ? new Date().toISOString().slice(0, 19).replace('T', ' ') : null
                });

                // Cập nhật trạng thái nếu email gửi thành công
                if (emailResult.success) {
                    await YeuCauEmail.update({
                        trang_thai: 'da_xu_ly',
                        thoi_gian_xu_ly: new Date().toISOString().slice(0, 19).replace('T', ' ')
                    }, id_yeu_cau);
                }
            } catch (emailError) {
                // Không làm lỗi đăng ký nếu email gửi thất bại
                console.error('Error sending welcome email:', emailError);
            }
        }

        return res.status(201).json({ 
            success: true, 
            message: "Đăng ký thành công! Chúng tôi đã gửi email xác nhận đến bạn.",
            data: yeuCau 
        });
    } catch (error) {
        console.error("Error creating yeu cau email:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Lấy tất cả yêu cầu email (cho admin)
export const getAllYeuCauEmail = async (req, res) => {
    try {
        const { trang_thai, loai_yeu_cau, page = 1, pageSize = 10 } = req.query;
        
        let sqlQuery = `SELECT * FROM yeu_cau_email WHERE 1=1`;
        const values = [];

        if (trang_thai) {
            sqlQuery += ` AND trang_thai = ?`;
            values.push(trang_thai);
        }

        if (loai_yeu_cau) {
            sqlQuery += ` AND loai_yeu_cau = ?`;
            values.push(loai_yeu_cau);
        }

        sqlQuery += ` ORDER BY thoi_gian_tao DESC`;

        // Phân trang
        const offset = (parseInt(page) - 1) * parseInt(pageSize);
        sqlQuery += ` LIMIT ? OFFSET ?`;
        values.push(parseInt(pageSize), offset);

        db.query(sqlQuery, values, (err, result) => {
            if (err) {
                console.error("Error fetching yeu cau email:", err);
                return res.status(500).json({ 
                    success: false, 
                    message: "Lỗi server", 
                    error: err.message 
                });
            }

            // Đếm tổng số
            let countQuery = `SELECT COUNT(*) as total FROM yeu_cau_email WHERE 1=1`;
            const countValues = [];
            
            if (trang_thai) {
                countQuery += ` AND trang_thai = ?`;
                countValues.push(trang_thai);
            }
            if (loai_yeu_cau) {
                countQuery += ` AND loai_yeu_cau = ?`;
                countValues.push(loai_yeu_cau);
            }

            db.query(countQuery, countValues, (err, countResult) => {
                if (err) {
                    return res.status(500).json({ 
                        success: false, 
                        message: "Lỗi server", 
                        error: err.message 
                    });
                }

                const total = countResult[0]?.total || 0;
                
                return res.status(200).json({ 
                    success: true, 
                    data: result || [],
                    pagination: {
                        page: parseInt(page),
                        pageSize: parseInt(pageSize),
                        total,
                        totalPages: Math.ceil(total / parseInt(pageSize))
                    }
                });
            });
        });
    } catch (error) {
        console.error("Error in getAllYeuCauEmail:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Lấy yêu cầu email theo ID
export const getYeuCauEmailById = async (req, res) => {
    try {
        const { id_yeu_cau } = req.params;
        const yeuCau = await YeuCauEmail.getById(id_yeu_cau);
        
        if (!yeuCau) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy yêu cầu" 
            });
        }
        
        return res.status(200).json({ success: true, data: yeuCau });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Cập nhật trạng thái yêu cầu
export const updateTrangThai = async (req, res) => {
    try {
        const { id_yeu_cau } = req.params;
        const { trang_thai, ghi_chu } = req.body;
        // id_quan_tri_vien = id_nguoi_dung (vì id_quan_tri_vien có thể giống id_nguoi_dung)
        const id_quan_tri_vien = req.decoded?.info?.id_nguoi_dung;

        if (!trang_thai) {
            return res.status(400).json({ 
                success: false, 
                message: "Trạng thái là bắt buộc" 
            });
        }

        const updateData = {
            trang_thai,
            id_quan_tri_vien: id_quan_tri_vien || null,
            thoi_gian_xu_ly: trang_thai !== 'chua_xu_ly' ? new Date().toISOString().slice(0, 19).replace('T', ' ') : null
        };

        if (ghi_chu) {
            updateData.ghi_chu = ghi_chu;
        }

        await YeuCauEmail.update(updateData, id_yeu_cau);

        return res.status(200).json({ 
            success: true, 
            message: "Cập nhật trạng thái thành công" 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Gửi email (từ admin)
export const sendEmailToUser = async (req, res) => {
    try {
        const { id_yeu_cau, email_nguoi_nhan, tieu_de, noi_dung, loai_email } = req.body;
        // id_quan_tri_vien = id_nguoi_dung (vì id_quan_tri_vien có thể giống id_nguoi_dung)
        let id_quan_tri_vien = req.decoded?.info?.id_nguoi_dung;

        if (!email_nguoi_nhan || !tieu_de || !noi_dung) {
            return res.status(400).json({ 
                success: false, 
                message: "Email người nhận, tiêu đề và nội dung là bắt buộc" 
            });
        }

        // Kiểm tra và đảm bảo id_quan_tri_vien tồn tại trong bảng quan_tri_vien
        let verifiedIdQuanTriVien = null;
        if (id_quan_tri_vien) {
            try {
                const quanTriVien = await QuanTriVien.getById(id_quan_tri_vien);
                if (quanTriVien) {
                    verifiedIdQuanTriVien = id_quan_tri_vien;
                } else {
                    // Nếu chưa tồn tại, tạo record mới
                    try {
                        await QuanTriVien.create({
                            id_quan_tri_vien: id_quan_tri_vien,
                            chuc_vu: 'Quản trị viên',
                            quyen_han: 'Quản trị hệ thống'
                        });
                        // Xác minh lại sau khi tạo
                        const createdQuanTriVien = await QuanTriVien.getById(id_quan_tri_vien);
                        if (createdQuanTriVien) {
                            verifiedIdQuanTriVien = id_quan_tri_vien;
                        } else {
                            console.warn("Warning: Created quan_tri_vien but could not verify");
                        }
                    } catch (createError) {
                        // Nếu lỗi khi tạo (có thể đã tồn tại hoặc constraint), thử kiểm tra lại
                        console.error("Error creating quan_tri_vien:", createError);
                        try {
                            const retryQuanTriVien = await QuanTriVien.getById(id_quan_tri_vien);
                            if (retryQuanTriVien) {
                                verifiedIdQuanTriVien = id_quan_tri_vien;
                            }
                        } catch (retryError) {
                            console.error("Error retrying getById after create error:", retryError);
                        }
                    }
                }
            } catch (error) {
                console.error("Error checking/creating quan_tri_vien:", error);
                // Nếu có lỗi khi kiểm tra, set verifiedIdQuanTriVien = null để tránh foreign key constraint fail
            }
        }
        
        // Nếu không thể verify id_quan_tri_vien, vẫn cho phép gửi email nhưng không lưu id_quan_tri_vien
        // để tránh foreign key constraint fail
        if (!verifiedIdQuanTriVien && id_quan_tri_vien) {
            console.warn(`Warning: Could not verify quan_tri_vien with id ${id_quan_tri_vien}. Will proceed without id_quan_tri_vien.`);
        }

        // Chuẩn bị nội dung email
        let html = noi_dung;
        let text = noi_dung.replace(/<[^>]*>/g, ''); // Loại bỏ HTML tags

        // Chỉ sử dụng template mặc định nếu admin không nhập nội dung
        // Nếu admin đã nhập nội dung, sử dụng nội dung đó thay vì template
        if (!noi_dung || noi_dung.trim() === '') {
            if (loai_email === 'tin_tuc_y_te' && id_yeu_cau) {
                const yeuCau = await YeuCauEmail.getById(id_yeu_cau);
                if (yeuCau) {
                    const template = getNewsletterWelcomeEmail(yeuCau.ho_ten, yeuCau.email);
                    html = template.html;
                    text = template.text;
                }
            }
        }

        // Gửi email
        const emailResult = await sendEmail({
            to: email_nguoi_nhan,
            subject: tieu_de,
            html,
            text
        });

        // Lưu lịch sử gửi email
        const id_lich_su = `LS_${uuidv4()}`;
        try {
            await LichSuGuiEmail.create({
                id_lich_su,
                id_yeu_cau: id_yeu_cau || null,
                email_nguoi_nhan,
                tieu_de,
                noi_dung: html,
                loai_email: loai_email || 'tin_tuc_y_te',
                trang_thai_gui: emailResult.success ? 'thanh_cong' : 'that_bai',
                loi_gui: emailResult.error || null,
                id_quan_tri_vien: verifiedIdQuanTriVien,
                thoi_gian_gui: emailResult.success ? new Date().toISOString().slice(0, 19).replace('T', ' ') : null
            });
        } catch (dbError) {
            console.error("Error saving email history:", dbError);
            // Không throw error, chỉ log để không ảnh hưởng đến việc gửi email
        }

        // Cập nhật trạng thái yêu cầu nếu có
        if (id_yeu_cau && emailResult.success) {
            await YeuCauEmail.update({
                trang_thai: 'da_xu_ly',
                id_quan_tri_vien: verifiedIdQuanTriVien,
                thoi_gian_xu_ly: new Date().toISOString().slice(0, 19).replace('T', ' ')
            }, id_yeu_cau);
        }

        if (emailResult.success) {
            return res.status(200).json({ 
                success: true, 
                message: "Gửi email thành công",
                data: emailResult
            });
        } else {
            return res.status(500).json({ 
                success: false, 
                message: "Gửi email thất bại",
                error: emailResult.error
            });
        }
    } catch (error) {
        console.error("Error sending email:", error);
        console.error("Error stack:", error.stack);
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server khi gửi email", 
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Gửi email hàng loạt
export const sendBulkEmail = async (req, res) => {
    try {
        const { emails, tieu_de, noi_dung, loai_email } = req.body;
        // id_quan_tri_vien = id_nguoi_dung (vì id_quan_tri_vien có thể giống id_nguoi_dung)
        let id_quan_tri_vien = req.decoded?.info?.id_nguoi_dung;

        if (!emails || !Array.isArray(emails) || emails.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Danh sách email là bắt buộc" 
            });
        }

        if (!tieu_de || !noi_dung) {
            return res.status(400).json({ 
                success: false, 
                message: "Tiêu đề và nội dung là bắt buộc" 
            });
        }

        // Kiểm tra và đảm bảo id_quan_tri_vien tồn tại trong bảng quan_tri_vien
        let verifiedIdQuanTriVien = null;
        if (id_quan_tri_vien) {
            try {
                const quanTriVien = await QuanTriVien.getById(id_quan_tri_vien);
                if (quanTriVien) {
                    verifiedIdQuanTriVien = id_quan_tri_vien;
                } else {
                    // Nếu chưa tồn tại, tạo record mới
                    try {
                        await QuanTriVien.create({
                            id_quan_tri_vien: id_quan_tri_vien,
                            chuc_vu: 'Quản trị viên',
                            quyen_han: 'Quản trị hệ thống'
                        });
                        // Xác minh lại sau khi tạo
                        const createdQuanTriVien = await QuanTriVien.getById(id_quan_tri_vien);
                        if (createdQuanTriVien) {
                            verifiedIdQuanTriVien = id_quan_tri_vien;
                        } else {
                            console.warn("Warning: Created quan_tri_vien but could not verify");
                        }
                    } catch (createError) {
                        // Nếu lỗi khi tạo (có thể đã tồn tại hoặc constraint), thử kiểm tra lại
                        console.error("Error creating quan_tri_vien:", createError);
                        try {
                            const retryQuanTriVien = await QuanTriVien.getById(id_quan_tri_vien);
                            if (retryQuanTriVien) {
                                verifiedIdQuanTriVien = id_quan_tri_vien;
                            }
                        } catch (retryError) {
                            console.error("Error retrying getById after create error:", retryError);
                        }
                    }
                }
            } catch (error) {
                console.error("Error checking/creating quan_tri_vien:", error);
                // Nếu có lỗi khi kiểm tra, set verifiedIdQuanTriVien = null để tránh foreign key constraint fail
            }
        }
        
        // Nếu không thể verify id_quan_tri_vien, vẫn cho phép gửi email nhưng không lưu id_quan_tri_vien
        // để tránh foreign key constraint fail
        if (!verifiedIdQuanTriVien && id_quan_tri_vien) {
            console.warn(`Warning: Could not verify quan_tri_vien with id ${id_quan_tri_vien}. Will proceed without id_quan_tri_vien.`);
        }

        const results = [];

        for (const email_nguoi_nhan of emails) {
            const emailResult = await sendEmail({
                to: email_nguoi_nhan,
                subject: tieu_de,
                html: noi_dung,
                text: noi_dung.replace(/<[^>]*>/g, '')
            });

            // Lưu lịch sử
            const id_lich_su = `LS_${uuidv4()}`;
            await LichSuGuiEmail.create({
                id_lich_su,
                email_nguoi_nhan,
                tieu_de,
                noi_dung,
                loai_email: loai_email || 'tin_tuc_y_te',
                trang_thai_gui: emailResult.success ? 'thanh_cong' : 'that_bai',
                loi_gui: emailResult.error || null,
                id_quan_tri_vien: verifiedIdQuanTriVien,
                thoi_gian_gui: emailResult.success ? new Date().toISOString().slice(0, 19).replace('T', ' ') : null
            });

            results.push({
                email: email_nguoi_nhan,
                success: emailResult.success,
                error: emailResult.error || null
            });
        }

        const successCount = results.filter(r => r.success).length;
        const failCount = results.filter(r => !r.success).length;

        return res.status(200).json({ 
            success: true, 
            message: `Đã gửi ${successCount} email thành công, ${failCount} email thất bại`,
            data: results
        });
    } catch (error) {
        console.error("Error sending bulk email:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Lấy lịch sử gửi email
export const getLichSuGuiEmail = async (req, res) => {
    try {
        const { page = 1, pageSize = 10, loai_email } = req.query;
        
        let sqlQuery = `SELECT * FROM lich_su_gui_email WHERE 1=1`;
        const values = [];

        if (loai_email) {
            sqlQuery += ` AND loai_email = ?`;
            values.push(loai_email);
        }

        sqlQuery += ` ORDER BY thoi_gian_tao DESC`;

        const offset = (parseInt(page) - 1) * parseInt(pageSize);
        sqlQuery += ` LIMIT ? OFFSET ?`;
        values.push(parseInt(pageSize), offset);

        db.query(sqlQuery, values, (err, result) => {
            if (err) {
                console.error("Error fetching lich su gui email:", err);
                return res.status(500).json({ 
                    success: false, 
                    message: "Lỗi server", 
                    error: err.message 
                });
            }

            // Đếm tổng số
            let countQuery = `SELECT COUNT(*) as total FROM lich_su_gui_email WHERE 1=1`;
            const countValues = [];
            if (loai_email) {
                countQuery += ` AND loai_email = ?`;
                countValues.push(loai_email);
            }

            db.query(countQuery, countValues, (err, countResult) => {
                if (err) {
                    return res.status(500).json({ 
                        success: false, 
                        message: "Lỗi server", 
                        error: err.message 
                    });
                }

                const total = countResult[0]?.total || 0;
                
                return res.status(200).json({ 
                    success: true, 
                    data: result || [],
                    pagination: {
                        page: parseInt(page),
                        pageSize: parseInt(pageSize),
                        total,
                        totalPages: Math.ceil(total / parseInt(pageSize))
                    }
                });
            });
        });
    } catch (error) {
        console.error("Error in getLichSuGuiEmail:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Xóa yêu cầu email
export const deleteYeuCauEmail = async (req, res) => {
    try {
        const { id_yeu_cau } = req.params;
        
        await YeuCauEmail.update({ trang_thai: 'da_huy' }, id_yeu_cau);

        return res.status(200).json({ 
            success: true, 
            message: "Xóa yêu cầu thành công" 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

