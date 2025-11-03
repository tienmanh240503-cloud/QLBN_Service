import { BenhNhan, NguoiDung } from "../models/index.js";

// Lấy thông tin bệnh nhân theo ID
export const getBenhNhanById = async (req, res) => {
    try {
        const { id_benh_nhan } = req.params;
        const benhNhan = await BenhNhan.findOne({ id_benh_nhan });

        if (!benhNhan) return res.status(404).json({ success: false, message: "Không tìm thấy bệnh nhân." });

        const nguoiDung = await NguoiDung.findOne({ id_nguoi_dung: id_benh_nhan });

        const fullInfo = {
            id_benh_nhan: benhNhan.id_benh_nhan,
            ten_dang_nhap: nguoiDung?.ten_dang_nhap || "",
            mat_khau: nguoiDung?.mat_khau || "",
            email: nguoiDung?.email || "",
            so_dien_thoai: nguoiDung?.so_dien_thoai || "",
            ho_ten: nguoiDung?.ho_ten || "",
            ngay_sinh: nguoiDung?.ngay_sinh || "",
            gioi_tinh: nguoiDung?.gioi_tinh || "",
            so_cccd: nguoiDung?.so_cccd || "",
            dia_chi: nguoiDung?.dia_chi || "",
            anh_dai_dien: nguoiDung?.anh_dai_dien || "",
            vai_tro: nguoiDung?.vai_tro || "",
            trang_thai_hoat_dong: nguoiDung?.trang_thai_hoat_dong || "",
            thoi_gian_tao: nguoiDung?.thoi_gian_tao || "",
            thoi_gian_cap_nhat: nguoiDung?.thoi_gian_cap_nhat || "",
            nghe_nghiep: benhNhan.nghe_nghiep || "",
            thong_tin_bao_hiem: benhNhan.thong_tin_bao_hiem || "",
            ten_nguoi_lien_he_khan_cap: benhNhan.ten_nguoi_lien_he_khan_cap || "",
            sdt_nguoi_lien_he_khan_cap: benhNhan.sdt_nguoi_lien_he_khan_cap || "",
            tien_su_benh_ly: benhNhan.tien_su_benh_ly || "",
            tinh_trang_suc_khoe_hien_tai: benhNhan.tinh_trang_suc_khoe_hien_tai || "",
            ma_BHYT: benhNhan.ma_BHYT || ""
        };

        res.status(200).json({ success: true, data: fullInfo });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy tất cả bệnh nhân
export const getAllBenhNhan = async (req, res) => {
    try {
        const benhNhans = await BenhNhan.getAll();
        const allNguoiDung = await NguoiDung.getAll();
        
        // Map bệnh nhân với thông tin người dùng
        const fullBenhNhans = benhNhans.map(benhNhan => {
            const nguoiDung = allNguoiDung.find(nd => nd.id_nguoi_dung === benhNhan.id_benh_nhan);
            
            return {
                ...benhNhan,
                ten_dang_nhap: nguoiDung?.ten_dang_nhap || "",
                email: nguoiDung?.email || "",
                so_dien_thoai: nguoiDung?.so_dien_thoai || "",
                ho_ten: nguoiDung?.ho_ten || "",
                ngay_sinh: nguoiDung?.ngay_sinh || "",
                gioi_tinh: nguoiDung?.gioi_tinh || "",
                so_cccd: nguoiDung?.so_cccd || "",
                dia_chi: nguoiDung?.dia_chi || "",
                anh_dai_dien: nguoiDung?.anh_dai_dien || "",
                vai_tro: nguoiDung?.vai_tro || "",
                trang_thai_hoat_dong: nguoiDung?.trang_thai_hoat_dong || "",
                thoi_gian_tao: nguoiDung?.thoi_gian_tao || "",
                thoi_gian_cap_nhat: nguoiDung?.thoi_gian_cap_nhat || "",
            };
        });
        
        res.status(200).json({ success: true, data: fullBenhNhans });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Cập nhật profile bệnh nhân
export const updateBenhNhan = async (req, res) => {
    try {
        const { id_benh_nhan } = req.params;
        const dataUpdate = req.body;

        const updated = await BenhNhan.update(dataUpdate, id_benh_nhan );
        if (!updated) return res.status(404).json({ success: false, message: "Không tìm thấy bệnh nhân để cập nhật." });
        res.status(200).json({ success: true, message: "Cập nhật thành công", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

