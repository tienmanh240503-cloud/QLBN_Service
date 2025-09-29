import { BacSi } from "../models/index.js";

// Lấy tất cả bác sĩ
export const getAllBacSi = async (req, res) => {
    try {
        const data = await BacSi.findAll();
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy bác sĩ theo ID
export const getBacSiById = async (req, res) => {
    try {
        const { id_bac_si } = req.params;
        const bacSi = await BacSi.findOne({ id_bac_si });
        if (!bacSi) return res.status(404).json({ success: false, message: "Không tìm thấy bác sĩ." });

        res.status(200).json({ success: true, data: bacSi });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Cập nhật thông tin bác sĩ
export const updateBacSi = async (req, res) => {
    try {
        const { id_bac_si } = req.params;
        const dataUpdate = req.body;

        const updated = await BacSi.update(dataUpdate, id_bac_si);
        res.status(200).json({ success: true, message: "Cập nhật thành công", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};
