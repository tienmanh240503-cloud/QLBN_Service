import { KetQuaXetNghiem, NguoiDung } from "../models/index.js";
import { v4 as uuidv4 } from 'uuid';

// Tạo kết quả xét nghiệm
export const createKetQua = async (req, res) => {
    try {
        const { id_chi_dinh, ket_qua_van_ban, duong_dan_file_ket_qua, thoi_gian_ket_luan, trang_thai_ket_qua, ghi_chu_ket_qua } = req.body;
        const id_nhan_vien_xet_nghiem = req.decoded?.info?.id_nguoi_dung; // Lấy từ token

        if (!id_chi_dinh) {
            return res.status(400).json({ success: false, message: "id_chi_dinh là bắt buộc." });
        }

        // Kiểm tra đã tồn tại kết quả cho chỉ định này chưa
        const existed = await KetQuaXetNghiem.findOne({id_chi_dinh});
        if (existed) {
            return res.status(400).json({ success: false, message: "Chỉ định này đã có kết quả." });
        }

        const Id = `KQ_${uuidv4()}`;

        const ketqua = await KetQuaXetNghiem.create({ 
            id_ket_qua : Id,
            id_chi_dinh, 
            id_nhan_vien_xet_nghiem,
            ket_qua_van_ban, 
            duong_dan_file_ket_qua, 
            thoi_gian_ket_luan: thoi_gian_ket_luan || new Date(),
            trang_thai_ket_qua,
            ghi_chu_ket_qua
        });

        return res.status(201).json({ success: true, message: "Thêm kết quả thành công", data: ketqua });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy kết quả theo id_chi_dinh
export const getKetQuaByChiDinh = async (req, res) => {
    try {
        const { id_chi_dinh } = req.params;
        const ketqua = await KetQuaXetNghiem.findOne({id_chi_dinh});
        // Nếu chưa có kết quả, trả về null thay vì lỗi 404
        if (!ketqua) return res.status(200).json({ success: true, data: null });
        
        // Enrich với thông tin nhân viên xét nghiệm
        if (ketqua.id_nhan_vien_xet_nghiem) {
            const nhanVien = await NguoiDung.findOne({ id_nguoi_dung: ketqua.id_nhan_vien_xet_nghiem });
            return res.status(200).json({ 
                success: true, 
                data: {
                    ...ketqua,
                    nhan_vien_xet_nghiem: nhanVien || null
                }
            });
        }
        
        return res.status(200).json({ success: true, data: ketqua });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Cập nhật kết quả xét nghiệm
export const updateKetQua = async (req, res) => {
    try {
        const { id_chi_dinh } = req.params;
        const id_nhan_vien_xet_nghiem = req.decoded?.info?.id_nguoi_dung; // Lấy từ token

        const ketqua = await KetQuaXetNghiem.findOne({id_chi_dinh});
        if (!ketqua) return res.status(404).json({ success: false, message: "Không tìm thấy kết quả" });
        
        // Chỉ lấy các field hợp lệ từ req.body và loại bỏ undefined/null không cần thiết
        // Loại bỏ id_chi_dinh vì đây là foreign key và không nên thay đổi
        const { ket_qua_van_ban, duong_dan_file_ket_qua, thoi_gian_ket_luan, trang_thai_ket_qua, ghi_chu_ket_qua } = req.body;
        
        // Xây dựng updateData chỉ với các field có giá trị và hợp lệ
        const updateData = {};
        
        if (ket_qua_van_ban !== undefined) updateData.ket_qua_van_ban = ket_qua_van_ban;
        if (duong_dan_file_ket_qua !== undefined) updateData.duong_dan_file_ket_qua = duong_dan_file_ket_qua;
        if (thoi_gian_ket_luan !== undefined) updateData.thoi_gian_ket_luan = thoi_gian_ket_luan;
        if (trang_thai_ket_qua !== undefined) updateData.trang_thai_ket_qua = trang_thai_ket_qua;
        if (ghi_chu_ket_qua !== undefined) updateData.ghi_chu_ket_qua = ghi_chu_ket_qua;
        
        // Cập nhật id_nhan_vien_xet_nghiem nếu chưa có hoặc có giá trị mới
        if (id_nhan_vien_xet_nghiem) {
            updateData.id_nhan_vien_xet_nghiem = id_nhan_vien_xet_nghiem;
        } else if (!ketqua.id_nhan_vien_xet_nghiem) {
            // Giữ nguyên nếu đã có
            updateData.id_nhan_vien_xet_nghiem = ketqua.id_nhan_vien_xet_nghiem;
        }
        
        // Kiểm tra xem có field nào để update không
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ success: false, message: "Không có dữ liệu để cập nhật" });
        }
        
        const updated = await KetQuaXetNghiem.update(updateData, ketqua.id_ket_qua);
        
        // Xử lý response - update method trả về {msg, result}
        const result = updated?.result || updated;
        
        return res.status(200).json({ success: true, message: "Cập nhật thành công", data: result });
    } catch (error) {
        console.error("Error updating ket qua xet nghiem:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.msg || error.message 
        });
    }
};

// Xóa kết quả xét nghiệm
export const deleteKetQua = async (req, res) => {
    try {
        const { id_chi_dinh } = req.params;
        const ketqua = await KetQuaXetNghiem.findOne({id_chi_dinh});
        if (!ketqua) return res.status(404).json({ success: false, message: "Không tìm thấy kết quả" });

        await KetQuaXetNghiem.delete(id_chi_dinh);
        return res.status(200).json({ success: true, message: "Xóa kết quả thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};
