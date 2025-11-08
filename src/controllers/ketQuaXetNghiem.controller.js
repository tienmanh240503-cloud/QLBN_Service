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
        
        // Cập nhật kèm id_nhan_vien_xet_nghiem nếu chưa có
        const updateData = {
            ...req.body,
            // Nếu chưa có người nhập, cập nhật lại
            id_nhan_vien_xet_nghiem: id_nhan_vien_xet_nghiem || ketqua.id_nhan_vien_xet_nghiem
        };
        
        const updated = await KetQuaXetNghiem.update(updateData, ketqua.id_ket_qua);
        return res.status(200).json({ success: true, message: "Cập nhật thành công", data: updated });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
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
