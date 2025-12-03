import { PhongKham } from "../models/index.js";
import db from '../configs/connectData.js';

// Lấy tất cả phòng khám, có thể filter theo chuyên khoa, chuyên ngành, loại phòng
export const getAllPhongKham = async (req, res) => {
    try {
        const { id_chuyen_khoa, id_chuyen_nganh, loai_phong, trang_thai, search, vai_tro } = req.query;
        
        let query = `
            SELECT 
                pk.id_phong_kham,
                pk.ten_phong,
                pk.so_phong,
                pk.tang,
                pk.id_chuyen_khoa,
                pk.loai_phong,
                pk.id_chuyen_nganh,
                pk.mo_ta,
                pk.trang_thai,
                pk.thiet_bi,
                pk.so_cho_ngoi,
                pk.thoi_gian_tao,
                ck.ten_chuyen_khoa,
                cndd.ten_chuyen_nganh
            FROM phongkham pk
            LEFT JOIN chuyenkhoa ck ON pk.id_chuyen_khoa = ck.id_chuyen_khoa
            LEFT JOIN chuyennganhdinhduong cndd ON pk.id_chuyen_nganh = cndd.id_chuyen_nganh
            WHERE 1=1
        `;
        
        const values = [];
        
        // Filter theo vai trò (tự động filter loại phòng)
        if (vai_tro) {
            switch(vai_tro) {
                case 'bac_si':
                    query += ` AND (pk.loai_phong = 'phong_kham_bac_si' OR pk.loai_phong IS NULL)`;
                    break;
                case 'chuyen_gia_dinh_duong':
                    query += ` AND pk.loai_phong = 'phong_tu_van_dinh_duong'`;
                    break;
                case 'nhan_vien_quay':
                case 'nhan_vien_phan_cong':
                    query += ` AND pk.loai_phong = 'phong_lam_viec'`;
                    break;
                case 'nhan_vien_xet_nghiem':
                    query += ` AND pk.loai_phong = 'phong_xet_nghiem'`;
                    break;
            }
        }
        
        if (id_chuyen_khoa) {
            query += ` AND pk.id_chuyen_khoa = ?`;
            values.push(id_chuyen_khoa);
        }
        
        if (id_chuyen_nganh) {
            query += ` AND pk.id_chuyen_nganh = ?`;
            values.push(id_chuyen_nganh);
        }
        
        if (loai_phong) {
            query += ` AND pk.loai_phong = ?`;
            values.push(loai_phong);
        }
        
        if (trang_thai) {
            query += ` AND pk.trang_thai = ?`;
            values.push(trang_thai);
        } else {
            // Mặc định chỉ lấy phòng đang hoạt động
            query += ` AND pk.trang_thai = 'HoatDong'`;
        }
        
        if (search) {
            query += ` AND (pk.ten_phong LIKE ? OR pk.so_phong LIKE ? OR ck.ten_chuyen_khoa LIKE ? OR cndd.ten_chuyen_nganh LIKE ?)`;
            const searchPattern = `%${search}%`;
            values.push(searchPattern, searchPattern, searchPattern, searchPattern);
        }
        
        query += ` ORDER BY pk.tang ASC, pk.so_phong ASC`;
        
        db.query(query, values, (err, result) => {
            if (err) {
                console.error("Error fetching phong kham:", err);
                return res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
            }
            res.status(200).json({ success: true, data: result });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy tất cả phòng khám cho Admin (không mặc định lọc trạng thái)
export const getAllPhongKhamAdmin = async (req, res) => {
    try {
        // Thêm đầy đủ các tham số filter để tránh lỗi biến chưa được định nghĩa
        const { id_chuyen_khoa, id_chuyen_nganh, loai_phong, trang_thai, search } = req.query;
        
        let query = `
            SELECT 
                pk.id_phong_kham,
                pk.ten_phong,
                pk.so_phong,
                pk.tang,
                pk.id_chuyen_khoa,
                pk.loai_phong,
                pk.id_chuyen_nganh,
                pk.mo_ta,
                pk.trang_thai,
                pk.thiet_bi,
                pk.so_cho_ngoi,
                pk.thoi_gian_tao,
                ck.ten_chuyen_khoa,
                cndd.ten_chuyen_nganh
            FROM phongkham pk
            LEFT JOIN chuyenkhoa ck ON pk.id_chuyen_khoa = ck.id_chuyen_khoa
            LEFT JOIN chuyennganhdinhduong cndd ON pk.id_chuyen_nganh = cndd.id_chuyen_nganh
            WHERE 1=1
        `;

        const values = [];

        if (id_chuyen_khoa) {
            query += ` AND pk.id_chuyen_khoa = ?`;
            values.push(id_chuyen_khoa);
        }

        if (id_chuyen_nganh) {
            query += ` AND pk.id_chuyen_nganh = ?`;
            values.push(id_chuyen_nganh);
        }

        if (loai_phong) {
            query += ` AND pk.loai_phong = ?`;
            values.push(loai_phong);
        }

        // Admin: chỉ lọc trạng thái khi có tham số, nếu không thì lấy tất cả
        if (trang_thai) {
            query += ` AND pk.trang_thai = ?`;
            values.push(trang_thai);
        }

        if (search) {
            query += ` AND (pk.ten_phong LIKE ? OR pk.so_phong LIKE ? OR ck.ten_chuyen_khoa LIKE ? OR cndd.ten_chuyen_nganh LIKE ?)`;
            const searchPattern = `%${search}%`;
            values.push(searchPattern, searchPattern, searchPattern, searchPattern);
        }

        query += ` ORDER BY pk.tang ASC, pk.so_phong ASC`;

        db.query(query, values, (err, result) => {
            if (err) {
                console.error("Error fetching phong kham (admin):", err);
                return res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
            }
            res.status(200).json({ success: true, data: result });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy phòng khám theo ID
export const getPhongKhamById = async (req, res) => {
    try {
        const { id_phong_kham } = req.params;
        const phongKham = await PhongKham.findOne({ id_phong_kham });
        if (!phongKham) {
            return res.status(404).json({ success: false, message: "Không tìm thấy phòng khám." });
        }

        res.status(200).json({ success: true, data: phongKham });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Tạo phòng khám mới
export const createPhongKham = async (req, res) => {
    try {
        const { ten_phong, so_phong, tang, id_chuyen_khoa, id_chuyen_nganh, loai_phong, mo_ta, trang_thai, thiet_bi, so_cho_ngoi } = req.body;

        if (!ten_phong || !so_phong) {
            return res.status(400).json({ success: false, message: "Tên phòng và số phòng là bắt buộc" });
        }

        // Kiểm tra số phòng đã tồn tại chưa
        const existingPhong = await PhongKham.findOne({ so_phong });
        if (existingPhong) {
            return res.status(400).json({ success: false, message: "Số phòng đã tồn tại" });
        }

        // Xác định loai_phong nếu không được cung cấp
        let finalLoaiPhong = loai_phong;
        if (!finalLoaiPhong) {
            if (id_chuyen_khoa) {
                finalLoaiPhong = 'phong_kham_bac_si';
            } else if (id_chuyen_nganh) {
                finalLoaiPhong = 'phong_tu_van_dinh_duong';
            } else {
                finalLoaiPhong = 'phong_lam_viec';
            }
        }

        // Validate: nếu là phòng khám bác sĩ thì phải có id_chuyen_khoa
        if (finalLoaiPhong === 'phong_kham_bac_si' && !id_chuyen_khoa) {
            return res.status(400).json({ success: false, message: "Phòng khám bác sĩ phải có chuyên khoa" });
        }

        // Validate: nếu là phòng tư vấn dinh dưỡng thì nên có id_chuyen_nganh (không bắt buộc)
        // Validate: không thể có cả id_chuyen_khoa và id_chuyen_nganh
        if (id_chuyen_khoa && id_chuyen_nganh) {
            return res.status(400).json({ success: false, message: "Phòng khám không thể có cả chuyên khoa và chuyên ngành dinh dưỡng" });
        }

        const { v4: uuidv4 } = await import('uuid');
        const id_phong_kham = `PK_${uuidv4()}`;

        const phongKham = await PhongKham.create({
            id_phong_kham,
            ten_phong,
            so_phong,
            tang: tang || null,
            id_chuyen_khoa: id_chuyen_khoa || null,
            loai_phong: finalLoaiPhong,
            id_chuyen_nganh: id_chuyen_nganh || null,
            mo_ta: mo_ta || null,
            trang_thai: trang_thai || 'HoatDong',
            thiet_bi: thiet_bi || null,
            so_cho_ngoi: so_cho_ngoi || null
        });

        res.status(201).json({ success: true, message: "Tạo phòng khám thành công", data: phongKham });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Cập nhật phòng khám
export const updatePhongKham = async (req, res) => {
    try {
        const { id_phong_kham } = req.params;
        const updateData = req.body;

        const phongKham = await PhongKham.findOne({ id_phong_kham });
        if (!phongKham) {
            return res.status(404).json({ success: false, message: "Không tìm thấy phòng khám" });
        }

        // Nếu cập nhật số phòng, kiểm tra trùng lặp
        if (updateData.so_phong && updateData.so_phong !== phongKham.so_phong) {
            const existingPhong = await PhongKham.findOne({ so_phong: updateData.so_phong });
            if (existingPhong) {
                return res.status(400).json({ success: false, message: "Số phòng đã tồn tại" });
            }
        }

        const updated = await PhongKham.update(updateData, id_phong_kham);
        res.status(200).json({ success: true, message: "Cập nhật phòng khám thành công", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Xóa phòng khám
export const deletePhongKham = async (req, res) => {
    try {
        const { id_phong_kham } = req.params;

        const phongKham = await PhongKham.findOne({ id_phong_kham });
        if (!phongKham) {
            return res.status(404).json({ success: false, message: "Không tìm thấy phòng khám" });
        }

        await PhongKham.delete(id_phong_kham);
        res.status(200).json({ success: true, message: "Xóa phòng khám thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};