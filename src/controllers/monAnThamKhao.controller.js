import { MonAnThamKhao } from "../models/index.js";
import { v4 as uuidv4 } from "uuid";

// Tạo mới món ăn tham khảo
export const createMonAnThamKhao = async (req, res) => {
    try {
        const {
            ten_mon,
            loai_mon,
            khoi_luong_chuan,
            calo,
            protein,
            carb,
            fat,
            fiber,
            mo_ta
        } = req.body;

        if (!ten_mon) {
            return res.status(400).json({ success: false, message: "Tên món ăn là bắt buộc." });
        }

        const id_mon_an = `MA_${uuidv4()}`;

        const monAn = await MonAnThamKhao.create({
            id_mon_an,
            ten_mon,
            loai_mon: loai_mon || 'khac',
            khoi_luong_chuan: khoi_luong_chuan || 100.00,
            calo,
            protein,
            carb,
            fat,
            fiber,
            mo_ta
        });

        res.status(201).json({ success: true, message: "Tạo món ăn tham khảo thành công.", data: monAn });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};

// Lấy tất cả món ăn tham khảo
export const getAllMonAnThamKhao = async (req, res) => {
    try {
        const { loai_mon } = req.query;
        let monAn;
        
        if (loai_mon) {
            monAn = await MonAnThamKhao.findAll({ loai_mon });
        } else {
            monAn = await MonAnThamKhao.getAll();
        }
        
        res.status(200).json({ success: true, data: monAn });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};

// Lấy món ăn tham khảo theo ID
export const getMonAnThamKhaoById = async (req, res) => {
    try {
        const { id_mon_an } = req.params;
        const monAn = await MonAnThamKhao.getById(id_mon_an);
        if (!monAn) return res.status(404).json({ success: false, message: "Không tìm thấy món ăn tham khảo." });

        res.status(200).json({ success: true, data: monAn });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};

// Tìm kiếm món ăn theo tên
export const searchMonAnThamKhao = async (req, res) => {
    try {
        const { ten_mon } = req.query;
        if (!ten_mon) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin tìm kiếm." });
        }

        // Tìm kiếm theo tên (LIKE query)
        const allMonAn = await MonAnThamKhao.getAll();
        const filtered = allMonAn.filter(mon => 
            mon.ten_mon.toLowerCase().includes(ten_mon.toLowerCase())
        );

        res.status(200).json({ success: true, data: filtered });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};

// Cập nhật món ăn tham khảo
export const updateMonAnThamKhao = async (req, res) => {
    try {
        const { id_mon_an } = req.params;
        const dataUpdate = req.body;
        const updated = await MonAnThamKhao.update(dataUpdate, id_mon_an);

        res.status(200).json({ success: true, message: "Cập nhật thành công.", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};

// Xóa món ăn tham khảo
export const deleteMonAnThamKhao = async (req, res) => {
    try {
        const { id_mon_an } = req.params;
        await MonAnThamKhao.delete(id_mon_an);
        res.status(200).json({ success: true, message: "Xóa món ăn tham khảo thành công." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};

