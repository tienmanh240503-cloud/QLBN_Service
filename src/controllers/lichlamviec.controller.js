import { LichLamViec } from "../models/index.js";
import { v4 as uuidv4 } from 'uuid';

// Tạo lịch làm việc mới
export const createLichLamViec = async (req, res) => {
    try {
        const { id_nguoi_dung, ngay_lam_viec, ca } = req.body;

        if (!id_nguoi_dung || !ngay_lam_viec || !ca) {
            return res.status(400).json({ success: false, message: "id_nguoi_dung, ngay_lam_viec và ca là bắt buộc." });
        }

        const Id = `L_${uuidv4()}`;

        const lich = await LichLamViec.create({
            id_lich_lam_viec: Id,
            id_nguoi_dung,
            id_nguoi_tao: req.user?.id_nguoi_dung || null,
            ngay_lam_viec,
            ca
        });

        return res.status(201).json({ success: true, message: "Thêm lịch làm việc thành công", data: lich });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy tất cả lịch làm việc
export const getAllLichLamViec = async (req, res) => {
    try {
        const liches = await LichLamViec.getAll();
        return res.status(200).json({ success: true, data: liches });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy 1 lịch làm việc theo id
export const getLichLamViecById = async (req, res) => {
    try {
        const { id_lich_lam_viec } = req.params;
        const lich = await LichLamViec.getById(id_lich_lam_viec);
        if (!lich) return res.status(404).json({ success: false, message: "Không tìm thấy lịch làm việc" });
        return res.status(200).json({ success: true, data: lich });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Cập nhật lịch làm việc
export const updateLichLamViec = async (req, res) => {
    try {
        const { id_lich_lam_viec } = req.params;
        const lich = await LichLamViec.getById(id_lich_lam_viec);
        if (!lich) return res.status(404).json({ success: false, message: "Không tìm thấy lịch làm việc" });

        const { id_nguoi_dung, ngay_lam_viec, ca } = req.body;
        const updateLich = await LichLamViec.update({ id_nguoi_dung, ngay_lam_viec, ca }, id_lich_lam_viec);

        return res.status(200).json({ success: true, message: "Cập nhật thành công", data: updateLich });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Xóa lịch làm việc
export const deleteLichLamViec = async (req, res) => {
    try {
        const { id_lich_lam_viec } = req.params;
        const lich = await LichLamViec.getById(id_lich_lam_viec);
        if (!lich) return res.status(404).json({ success: false, message: "Không tìm thấy lịch làm việc" });

        await LichLamViec.delete(id_lich_lam_viec);
        return res.status(200).json({ success: true, message: "Xóa lịch làm việc thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lọc theo ngày
export const getLichLamViecByNgay = async (req, res) => {
    try {
        const { ngay } = req.query;
        const liches = await LichLamViec.getAll();
        const filtered = liches.filter(l => {
            const lvDate = new Date(l.ngay_lam_viec).toISOString().slice(0,10);
            return lvDate === ngay;
        });
        return res.status(200).json({ success: true, data: filtered });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getLichLamViecByWeekforBacSi = async (req, res) => {
    try {
        const { ngay } = req.query;
        const { id } = req.params;
        let liches = null;
        if (!ngay) return res.status(400).json({ success: false, message: "Thiếu tham số 'ngay'" });
        if(id){
            liches = await LichLamViec.findAll({id_nguoi_dung : id});
            console.log(liches);
        }else{
            liches = await LichLamViec.getAll();
        }
        
        const date = new Date(ngay);
        const day = date.getDay(); // 0=CN, 1=T2 ...
        // Tính Thứ 2 tuần hiện tại
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - (day === 0 ? 6 : day - 1));
        // Tính Chủ nhật tuần hiện tại
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const startStr = startOfWeek.toISOString().slice(0, 10);
        const endStr = endOfWeek.toISOString().slice(0, 10);

        const filtered = liches.filter(l => {
            const lvStr = new Date(l.ngay_lam_viec).toISOString().slice(0, 10);
            return lvStr >= startStr && lvStr <= endStr;
        });

        // if (filtered.length === 0) 
        //     return res.status(404).json({ success: false, message: "Không tìm thấy lịch làm việc" });

        return res.status(200).json({ success: true, data: filtered });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const getLichLamViecByWeek = async (req, res) => {
    try {
        const { ngay } = req.query;
        if (!ngay) return res.status(400).json({ success: false, message: "Thiếu tham số 'ngay'" });

        const liches = await LichLamViec.getAll();
        const date = new Date(ngay);
        const day = date.getDay(); // 0=CN, 1=T2 ...
        // Tính Thứ 2 tuần hiện tại
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - (day === 0 ? 6 : day - 1));
        // Tính Chủ nhật tuần hiện tại
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const startStr = startOfWeek.toISOString().slice(0, 10);
        const endStr = endOfWeek.toISOString().slice(0, 10);

        const filtered = liches.filter(l => {
            const lvStr = new Date(l.ngay_lam_viec).toISOString().slice(0, 10);
            return lvStr >= startStr && lvStr <= endStr;
        });

        if (filtered.length === 0) 
            return res.status(404).json({ success: false, message: "Không tìm thấy lịch làm việc" });

        return res.status(200).json({ success: true, data: filtered });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};



// Lọc theo tháng
export const getLichLamViecByMonth = async (req, res) => {
    try {
        const { thang, nam } = req.query;
        const liches = await LichLamViec.getAll();

        const filtered = liches.filter(l => {
            const d = new Date(l.ngay_lam_viec);
            return (d.getMonth() + 1) === parseInt(thang) && d.getFullYear() === parseInt(nam);
        });

        return res.status(200).json({ success: true, data: filtered });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Lọc theo năm
export const getLichLamViecByYear = async (req, res) => {
    try {
        const { nam } = req.query;
        const liches = await LichLamViec.getAll();

        const filtered = liches.filter(l => {
            const d = new Date(l.ngay_lam_viec);
            return d.getFullYear() === parseInt(nam);
        });

        return res.status(200).json({ success: true, data: filtered });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
