import { ChiDinhXetNghiem, BacSi, CuocHenKhamBenh, BenhNhan, NguoiDung, KetQuaXetNghiem } from "../models/index.js";
import { v4 as uuidv4 } from 'uuid';

// Tạo chỉ định xét nghiệm
export const createChiDinh = async (req, res) => {
    try {
        const id_nguoi_dung = req.decoded.info.id_nguoi_dung;
        const{id_cuoc_hen, ten_dich_vu, yeu_cau_ghi_chu, trang_thai } = req.body;
        const Id = `CD_${uuidv4()}`;
        const chiDinh = await ChiDinhXetNghiem.create({ id_chi_dinh : Id, id_cuoc_hen, ten_dich_vu, yeu_cau_ghi_chu, trang_thai, id_bac_si_chi_dinh : id_nguoi_dung, thoi_gian_chi_dinh : new Date() });
        return res.status(201).json({ success: true, data: chiDinh });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy tất cả chỉ định theo id hồ sơ
export const getChiDinhByHoSo = async (req, res) => {
    try {
        const { id_cuoc_hen } = req.params;
        const chiDinhs = await ChiDinhXetNghiem.findAll({ id_cuoc_hen });
        
        // Enrich với thông tin kết quả và nhân viên xét nghiệm
        const [allKetQua, allNguoiDung] = await Promise.all([
            KetQuaXetNghiem.getAll(),
            NguoiDung.getAll()
        ]);
        
        const allKetQuaData = Array.isArray(allKetQua) ? allKetQua : (allKetQua?.data || []);
        const allNguoiDungData = Array.isArray(allNguoiDung) ? allNguoiDung : (allNguoiDung?.data || []);
        
        const enrichedChiDinhs = chiDinhs.map(cd => {
            const ketQua = allKetQuaData.find(kq => kq.id_chi_dinh === cd.id_chi_dinh);
            const nhanVienXetNghiem = ketQua?.id_nhan_vien_xet_nghiem 
                ? allNguoiDungData.find(nd => nd.id_nguoi_dung === ketQua.id_nhan_vien_xet_nghiem) 
                : null;
            
            return {
                ...cd,
                ket_qua: ketQua ? {
                    ...ketQua,
                    nhan_vien_xet_nghiem: nhanVienXetNghiem || null
                } : null
            };
        });
        
        return res.status(200).json({ success: true, data: enrichedChiDinhs });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy tất cả chỉ định xét nghiệm (cho nhân viên xét nghiệm)
export const getAllChiDinh = async (req, res) => {
    try {
        const { trang_thai } = req.query; // Có thể filter theo trạng thái
        
        // Lấy tất cả chỉ định
        let chiDinhs = await ChiDinhXetNghiem.getAll();
        if (!Array.isArray(chiDinhs)) {
            chiDinhs = chiDinhs?.data || [];
        }

        // Filter theo trạng thái nếu có
        if (trang_thai) {
            chiDinhs = chiDinhs.filter(cd => cd.trang_thai === trang_thai);
        }

        // Lấy thông tin liên quan
        const [allCuocHen, allBenhNhan, allNguoiDung, allBacSi, allKetQua] = await Promise.all([
            CuocHenKhamBenh.getAll(),
            BenhNhan.getAll(),
            NguoiDung.getAll(),
            BacSi.getAll(),
            KetQuaXetNghiem.getAll()
        ]);

        const allCuocHenData = Array.isArray(allCuocHen) ? allCuocHen : (allCuocHen?.data || []);
        const allBenhNhanData = Array.isArray(allBenhNhan) ? allBenhNhan : (allBenhNhan?.data || []);
        const allNguoiDungData = Array.isArray(allNguoiDung) ? allNguoiDung : (allNguoiDung?.data || []);
        const allBacSiData = Array.isArray(allBacSi) ? allBacSi : (allBacSi?.data || []);
        const allKetQuaData = Array.isArray(allKetQua) ? allKetQua : (allKetQua?.data || []);

        // Enrich data với thông tin liên quan
        const enrichedChiDinhs = chiDinhs.map(cd => {
            const cuocHen = allCuocHenData.find(ch => ch.id_cuoc_hen === cd.id_cuoc_hen);
            const benhNhan = cuocHen ? allBenhNhanData.find(bn => bn.id_benh_nhan === cuocHen.id_benh_nhan) : null;
            const nguoiDung = benhNhan ? allNguoiDungData.find(nd => nd.id_nguoi_dung === benhNhan.id_benh_nhan) : null;
            const bacSi = allBacSiData.find(bs => bs.id_bac_si === cd.id_bac_si_chi_dinh);
            const bacSiNguoiDung = bacSi ? allNguoiDungData.find(nd => nd.id_nguoi_dung === bacSi.id_bac_si) : null;
            const ketQua = allKetQuaData.find(kq => kq.id_chi_dinh === cd.id_chi_dinh);
            // Lấy thông tin nhân viên xét nghiệm nếu có
            const nhanVienXetNghiem = ketQua?.id_nhan_vien_xet_nghiem 
                ? allNguoiDungData.find(nd => nd.id_nguoi_dung === ketQua.id_nhan_vien_xet_nghiem) 
                : null;

            return {
                ...cd,
                cuoc_hen: cuocHen || null,
                benh_nhan: benhNhan || null,
                nguoi_dung: nguoiDung || null,
                bac_si: bacSi || null,
                bac_si_nguoi_dung: bacSiNguoiDung || null,
                ket_qua: ketQua ? {
                    ...ketQua,
                    nhan_vien_xet_nghiem: nhanVienXetNghiem || null
                } : null
            };
        });

        return res.status(200).json({ success: true, data: enrichedChiDinhs });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Cập nhật trạng thái chỉ định
export const updateTrangThaiChiDinh = async (req, res) => {
    try {
        const { id_chi_dinh } = req.params;
        const { trang_thai } = req.body;

        const updated = await ChiDinhXetNghiem.update({ trang_thai }, id_chi_dinh);
        if (!updated) return res.status(404).json({ success: false, message: "Không tìm thấy chỉ định" });

        return res.status(200).json({ success: true, message: "Cập nhật thành công", data : updated });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Xóa chỉ định
export const deleteChiDinh = async (req, res) => {
    try {
        const { id_chi_dinh } = req.params;
        const deleted = await ChiDinhXetNghiem.delete(id_chi_dinh);
        if (!deleted) return res.status(404).json({ success: false, message: "Không tìm thấy chỉ định" });

        return res.status(200).json({ success: true, message: "Xóa thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};
