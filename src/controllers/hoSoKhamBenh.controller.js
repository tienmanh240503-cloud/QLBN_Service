import { HoSoKhamBenh, BenhNhan, BacSi} from "../models/index.js";
import { v4 as uuidv4 } from 'uuid';

export const createHoSoKham = async (req, res) => {
    try {
        const id_nguoi_dung = req.decoded.info.id_nguoi_dung;
        const {
            id_benh_nhan,
            ho_ten,
            so_dien_thoai,
            tuoi,
            gioi_tinh,
            dan_toc,
            ma_BHYT,
            dia_chi
        } = req.body;

        if (!id_benh_nhan || !ho_ten) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc." });
        }

        // Kiểm tra bệnh nhân tồn tại
        const benhNhan = await BenhNhan.findOne({ id_benh_nhan });
        if (!benhNhan) return res.status(404).json({ success: false, message: "Bệnh nhân không tồn tại." });

        const bacSi = await BacSi.findOne({ id_bac_si : id_nguoi_dung });
        if (!bacSi) return res.status(404).json({ success: false, message: "Bac Si không tồn tại." });

        const Id = `KB_${uuidv4()}`;

        // Tạo hồ sơ khám
        const hoSo = await HoSoKhamBenh.create({
            id_ho_so : Id,
            id_benh_nhan,
            id_bac_si_tao : id_nguoi_dung,
            ho_ten,
            so_dien_thoai,
            tuoi,
            gioi_tinh,
            dan_toc,
            ma_BHYT,
            dia_chi,
            thoi_gian_tao: new Date()
        });

        res.status(201).json({ success: true, message: "Tạo hồ sơ khám thành công.", data: hoSo });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};
// Lấy hồ sơ theo ID hồ sơ Kham benh
export const getHoSoKhamById = async (req, res) => {
    try {
        const { id_ho_so } = req.params;
        const hoSo = await HoSoKhamBenh.getById(id_ho_so);
        if (!hoSo) return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ." });

        res.status(200).json({ success: true, data: hoSo });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    } 
};
export const getAllHoSoKham= async (req, res) => {
    try {
        const hoSo = await HoSoKhamBenh.getAll();
        res.status(200).json({ success: true, data: hoSo});
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};


// Lấy danh sách hồ sơ của 1 bệnh nhân
export const getHoSoKhamByBenhNhan = async (req, res) => {
    try {
        const { id_benh_nhan } = req.params;
        const hoSos = await HoSoKhamBenh.findOne({ id_benh_nhan });

        res.status(200).json({ success: true, data: hoSos });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};

export const updateHoSoKham = async (req, res) => {
    try {
        const { id_ho_so } = req.params;
        console.log(id_ho_so);
        const dataUpdate = req.body;
        console.log(dataUpdate);
        const updatedHoSo = await HoSoKhamBenh.update(dataUpdate, id_ho_so);
        console.log(updatedHoSo);
        res.status(200).json({ success: true, message: "Cập nhật hồ sơ thành công.", data: updatedHoSo });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.msg });
    }
};

export const deleteHoSoKham = async (req, res) => {
    try {
        const { id_ho_so } = req.params;
        await HoSoKhamBenh.delete(id_ho_so);
        res.status(200).json({ success: true, message: "Xóa hồ sơ thành công." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};