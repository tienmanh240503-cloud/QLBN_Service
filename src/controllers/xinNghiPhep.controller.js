import { XinNghiPhep, LichLamViec } from "../models/index.js";
import { v4 as uuidv4 } from 'uuid';

// Tạo đơn xin nghỉ phép
export const createXinNghiPhep = async (req, res) => {
    try {
        const { id_nguoi_dung, ngay_bat_dau, ngay_ket_thuc, ly_do, trang_thai, buoi_nghi } = req.body;

        if (!id_nguoi_dung || !ngay_bat_dau || !ngay_ket_thuc || !ly_do) {
            return res.status(400).json({ 
                success: false, 
                message: "id_nguoi_dung, ngay_bat_dau, ngay_ket_thuc và ly_do là bắt buộc" 
            });
        }

        // Validate id_nguoi_dung format (should start with BS_, YT_, QL_, AD_, CG_, NVQ_, or NVP_)
        const validPrefixes = ['BS_', 'YT_', 'QL_', 'AD_', 'CG_', 'NVQ_', 'NVP_'];
        // Hỗ trợ cả ID cũ như NV_quay001 (backward compatibility)
        const isValidId = validPrefixes.some(prefix => id_nguoi_dung.startsWith(prefix)) ||
                         id_nguoi_dung.startsWith('NV_');
        
        if (!isValidId) {
            return res.status(400).json({ 
                success: false, 
                message: "ID người dùng không hợp lệ. Chỉ hỗ trợ bác sĩ, y tá, quản lý, admin, chuyên gia dinh dưỡng, nhân viên quầy và nhân viên phân công" 
            });
        }

        // Validate buoi_nghi nếu có
        if (buoi_nghi && !['sang', 'chieu', 'toi'].includes(buoi_nghi)) {
            return res.status(400).json({ 
                success: false, 
                message: "buoi_nghi phải là 'sang', 'chieu' hoặc 'toi'" 
            });
        }

        // Nếu nghỉ nửa ngày, đảm bảo ngay_bat_dau = ngay_ket_thuc
        if (buoi_nghi && ngay_bat_dau !== ngay_ket_thuc) {
            return res.status(400).json({ 
                success: false, 
                message: "Khi nghỉ nửa ngày, ngày bắt đầu phải bằng ngày kết thúc" 
            });
        }

        // Kiểm tra lịch làm việc trước khi cho phép xin nghỉ phép
        try {
            // Lấy tất cả lịch làm việc của người dùng
            const allSchedules = await LichLamViec.findAll({ id_nguoi_dung });
            
            // Chuyển đổi buoi_nghi sang format ca trong database (Sang, Chieu, Toi)
            const caMap = {
                'sang': 'Sang',
                'chieu': 'Chieu',
                'toi': 'Toi'
            };

            if (buoi_nghi) {
                // Nghỉ nửa ngày: kiểm tra có lịch làm việc trong buổi đó không
                const ca = caMap[buoi_nghi];
                
                // Normalize ngay_bat_dau để so sánh (format: YYYY-MM-DD)
                const normalizedNgayBatDau = ngay_bat_dau.includes('T') 
                    ? ngay_bat_dau.split('T')[0] 
                    : ngay_bat_dau;
                
                const schedulesInDate = allSchedules.filter(schedule => {
                    // Normalize schedule.ngay_lam_viec - có thể là Date object, string với timezone, hoặc string thuần
                    let scheduleDateStr;
                    if (schedule.ngay_lam_viec instanceof Date) {
                        scheduleDateStr = schedule.ngay_lam_viec.toISOString().slice(0, 10);
                    } else if (typeof schedule.ngay_lam_viec === 'string') {
                        // Nếu có 'T' thì lấy phần trước 'T', nếu không thì dùng trực tiếp
                        scheduleDateStr = schedule.ngay_lam_viec.includes('T') 
                            ? schedule.ngay_lam_viec.split('T')[0] 
                            : schedule.ngay_lam_viec;
                    } else {
                        // Fallback: convert sang Date rồi lấy date string
                        scheduleDateStr = new Date(schedule.ngay_lam_viec).toISOString().slice(0, 10);
                    }
                    
                    return scheduleDateStr === normalizedNgayBatDau && schedule.ca === ca;
                });

                if (schedulesInDate.length === 0) {
                    // Tìm các lịch làm việc gần đó để hiển thị cho người dùng
                    const nearbySchedules = allSchedules
                        .map(schedule => {
                            let scheduleDateStr;
                            if (schedule.ngay_lam_viec instanceof Date) {
                                scheduleDateStr = schedule.ngay_lam_viec.toISOString().slice(0, 10);
                            } else if (typeof schedule.ngay_lam_viec === 'string') {
                                scheduleDateStr = schedule.ngay_lam_viec.includes('T') 
                                    ? schedule.ngay_lam_viec.split('T')[0] 
                                    : schedule.ngay_lam_viec;
                            } else {
                                scheduleDateStr = new Date(schedule.ngay_lam_viec).toISOString().slice(0, 10);
                            }
                            return { date: scheduleDateStr, ca: schedule.ca };
                        })
                        .filter(s => s.date === normalizedNgayBatDau)
                        .map(s => `${s.date} (${s.ca})`);
                    
                    let errorMessage = `Bạn không có lịch làm việc vào buổi ${buoi_nghi === 'sang' ? 'sáng' : buoi_nghi === 'chieu' ? 'chiều' : 'tối'} ngày ${normalizedNgayBatDau}.`;
                    
                    if (nearbySchedules.length > 0) {
                        errorMessage += ` Bạn có lịch làm việc vào ngày này với các ca: ${nearbySchedules.join(', ')}.`;
                    }
                    
                    errorMessage += ' Vui lòng kiểm tra lại lịch làm việc.';
                    
                    return res.status(400).json({ 
                        success: false, 
                        message: errorMessage
                    });
                }
            } else {
                // Nghỉ cả ngày: kiểm tra có lịch làm việc trong khoảng thời gian đó không
                // Normalize dates để so sánh (format: YYYY-MM-DD)
                const normalizedNgayBatDau = ngay_bat_dau.includes('T') 
                    ? ngay_bat_dau.split('T')[0] 
                    : ngay_bat_dau;
                const normalizedNgayKetThuc = ngay_ket_thuc.includes('T') 
                    ? ngay_ket_thuc.split('T')[0] 
                    : ngay_ket_thuc;
                
                const schedulesInRange = allSchedules.filter(schedule => {
                    // Normalize schedule.ngay_lam_viec
                    let scheduleDateStr;
                    if (schedule.ngay_lam_viec instanceof Date) {
                        scheduleDateStr = schedule.ngay_lam_viec.toISOString().slice(0, 10);
                    } else if (typeof schedule.ngay_lam_viec === 'string') {
                        scheduleDateStr = schedule.ngay_lam_viec.includes('T') 
                            ? schedule.ngay_lam_viec.split('T')[0] 
                            : schedule.ngay_lam_viec;
                    } else {
                        scheduleDateStr = new Date(schedule.ngay_lam_viec).toISOString().slice(0, 10);
                    }
                    
                    // So sánh string dates (YYYY-MM-DD format có thể so sánh trực tiếp)
                    return scheduleDateStr >= normalizedNgayBatDau && scheduleDateStr <= normalizedNgayKetThuc;
                });

                if (schedulesInRange.length === 0) {
                    return res.status(400).json({ 
                        success: false, 
                        message: `Bạn không có lịch làm việc trong khoảng thời gian từ ${normalizedNgayBatDau} đến ${normalizedNgayKetThuc}. Vui lòng kiểm tra lại lịch làm việc.` 
                    });
                }
            }
        } catch (scheduleError) {
            console.error("Error checking work schedule:", scheduleError);
            // Không block việc tạo đơn nếu có lỗi khi kiểm tra lịch, chỉ log
        }

        const Id = `XN_${uuidv4()}`;

        const xinNghiPhep = await XinNghiPhep.create({
            id_xin_nghi: Id,
            id_nguoi_dung: id_nguoi_dung,
            ngay_bat_dau,
            ngay_ket_thuc,
            ly_do,
            trang_thai: trang_thai || "cho_duyet",
            buoi_nghi: buoi_nghi || null,
            ngay_tao: new Date().toISOString().slice(0, 10)
        });

        return res.status(201).json({ 
            success: true, 
            message: "Tạo đơn xin nghỉ phép thành công", 
            data: xinNghiPhep 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Lấy tất cả đơn xin nghỉ phép
export const getAllXinNghiPhep = async (req, res) => {
    try {
        const xinNghiPhepList = await XinNghiPhep.getAll();
        return res.status(200).json({ success: true, data: xinNghiPhepList });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Lấy đơn xin nghỉ phép theo ID
export const getXinNghiPhepById = async (req, res) => {
    try {
        const { id_xin_nghi } = req.params;
        const xinNghiPhep = await XinNghiPhep.getById(id_xin_nghi);
        
        if (!xinNghiPhep) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy đơn xin nghỉ phép" 
            });
        }
        
        return res.status(200).json({ success: true, data: xinNghiPhep });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Lấy đơn xin nghỉ phép theo người dùng (bác sĩ, y tá, quản lý, admin, chuyên gia dinh dưỡng, nhân viên quầy, nhân viên phân công)
export const getXinNghiPhepByNguoiDung = async (req, res) => {
    try {
        const { id_nguoi_dung } = req.params;
        
        if (!id_nguoi_dung) {
            return res.status(400).json({ 
                success: false, 
                message: "Thiếu id_nguoi_dung" 
            });
        }

        // Validate id_nguoi_dung format (should start with BS_, YT_, QL_, AD_, CG_, NVQ_, or NVP_)
        const validPrefixes = ['BS_', 'YT_', 'QL_', 'AD_', 'CG_', 'NVQ_', 'NVP_'];
        // Hỗ trợ cả ID cũ như NV_quay001 (backward compatibility)
        const isValidId = validPrefixes.some(prefix => id_nguoi_dung.startsWith(prefix)) ||
                         id_nguoi_dung.startsWith('NV_');
        
        if (!isValidId) {
            return res.status(400).json({ 
                success: false, 
                message: "ID người dùng không hợp lệ. Chỉ hỗ trợ bác sĩ, y tá, quản lý, admin, chuyên gia dinh dưỡng, nhân viên quầy và nhân viên phân công" 
            });
        }

        const xinNghiPhepList = await XinNghiPhep.findAll({ id_nguoi_dung });
        
        return res.status(200).json({ 
            success: true, 
            data: xinNghiPhepList || [] 
        });
    } catch (error) {
        console.error("Error in getXinNghiPhepByNguoiDung:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Aliases để backward compatibility
export const getXinNghiPhepByNhanVien = getXinNghiPhepByNguoiDung;
export const getXinNghiPhepByBacSi = getXinNghiPhepByNguoiDung;

// Cập nhật trạng thái đơn xin nghỉ phép
export const updateTrangThaiXinNghiPhep = async (req, res) => {
    try {
        const { id_xin_nghi } = req.params;
        const { trang_thai } = req.body;

        if (!trang_thai) {
            return res.status(400).json({ 
                success: false, 
                message: "Thiếu trạng thái" 
            });
        }

        const xinNghiPhep = await XinNghiPhep.getById(id_xin_nghi);
        if (!xinNghiPhep) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy đơn xin nghỉ phép" 
            });
        }

        const updated = await XinNghiPhep.update({ trang_thai }, id_xin_nghi);
        
        return res.status(200).json({ 
            success: true, 
            message: "Cập nhật trạng thái thành công", 
            data: updated 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Xóa đơn xin nghỉ phép
export const deleteXinNghiPhep = async (req, res) => {
    try {
        const { id_xin_nghi } = req.params;

        const xinNghiPhep = await XinNghiPhep.getById(id_xin_nghi);
        if (!xinNghiPhep) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy đơn xin nghỉ phép" 
            });
        }

        await XinNghiPhep.delete(id_xin_nghi);
        
        return res.status(200).json({ 
            success: true, 
            message: "Xóa đơn xin nghỉ phép thành công" 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};
