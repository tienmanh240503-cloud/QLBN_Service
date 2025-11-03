import {
    CuocHenKhamBenh,
    CuocHenTuVan,
    HoaDon,
    BenhNhan,
    BacSi,
    ChuyenGiaDinhDuong,
    NguoiDung,
    LichLamViec,
    XinNghiPhep,
    HoSoKhamBenh,
    HoSoDinhDuong,
    NhanVienPhanCong,
    NhanVienQuay,
    LichSuKham,
    LichSuTuVan,
} from "../models/index.js";

// ==================== HELPER FUNCTIONS ====================

const formatDate = (date) => {
    if (!date) return null;
    try {
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) return null;
        return dateObj.toISOString().split('T')[0];
    } catch (error) {
        return null;
    }
};

const getToday = () => {
    return formatDate(new Date());
};

const getThisWeek = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    return {
        start: formatDate(startOfWeek),
        end: formatDate(today)
    };
};

const getThisMonth = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return {
        start: formatDate(startOfMonth),
        end: formatDate(today)
    };
};

// ==================== DASHBOARD BÁC SĨ ====================

export const getDoctorDashboard = async (req, res) => {
    try {
        const id_bac_si = req.decoded?.info?.id_nguoi_dung;
        if (!id_bac_si) {
            return res.status(401).json({ success: false, message: "Không tìm thấy thông tin bác sĩ" });
        }

        // Kiểm tra xem có phải bác sĩ không
        const bacSi = await BacSi.findOne({ id_bac_si });
        if (!bacSi) {
            return res.status(403).json({ success: false, message: "Không phải bác sĩ" });
        }

        const today = getToday();
        
        // Lấy tất cả cuộc hẹn khám
        const allCuocHen = await CuocHenKhamBenh.getAll();
        const allCuocHenData = Array.isArray(allCuocHen) ? allCuocHen : (allCuocHen?.data || []);
        
        // Filter cuộc hẹn của bác sĩ này
        const myAppointments = allCuocHenData.filter(ch => ch.id_bac_si === id_bac_si);
        
        // Cuộc hẹn hôm nay
        const appointmentsToday = myAppointments.filter(ch => {
            const ngayKham = formatDate(ch.ngay_kham || ch.ngay_hen);
            return ngayKham === today;
        });

        // Lấy bệnh nhân hôm nay (unique)
        const patientIdsToday = [...new Set(appointmentsToday.map(ch => ch.id_benh_nhan))];
        const patientsToday = patientIdsToday.length;

        // Lịch hẹn sắp tới (từ hôm nay trở đi)
        const upcomingAppointments = myAppointments
            .filter(ch => {
                const ngayKham = formatDate(ch.ngay_kham || ch.ngay_hen);
                return ngayKham >= today;
            })
            .sort((a, b) => {
                const dateA = new Date(a.ngay_kham || a.ngay_hen);
                const dateB = new Date(b.ngay_kham || b.ngay_hen);
                return dateA - dateB;
            })
            .slice(0, 10);

        // Lấy thông tin bệnh nhân cho lịch hẹn sắp tới
        const [allBenhNhan, allNguoiDung] = await Promise.all([
            BenhNhan.getAll(),
            NguoiDung.getAll()
        ]);
        const allBenhNhanData = Array.isArray(allBenhNhan) ? allBenhNhan : (allBenhNhan?.data || []);
        const allNguoiDungData = Array.isArray(allNguoiDung) ? allNguoiDung : (allNguoiDung?.data || []);

        const upcomingAppointmentsWithPatient = upcomingAppointments.map(ch => {
            const benhNhan = allBenhNhanData.find(bn => bn.id_benh_nhan === ch.id_benh_nhan);
            const nguoiDung = benhNhan ? allNguoiDungData.find(nd => nd.id_nguoi_dung === benhNhan.id_benh_nhan) : null;
            
            return {
                ...ch,
                benh_nhan: benhNhan,
                nguoi_dung: nguoiDung
            };
        });

        // Hồ sơ khám bệnh chờ duyệt (lấy hồ sơ liên quan đến bác sĩ này)
        const allHoSo = await HoSoKhamBenh.getAll();
        const allHoSoData = Array.isArray(allHoSo) ? allHoSo : (allHoSo?.data || []);
        const pendingRecords = allHoSoData.filter(hs => 
            hs.id_bac_si === id_bac_si && 
            (!hs.trang_thai || hs.trang_thai === 'cho_duyet')
        ).length;

        // Hoạt động gần đây (từ cuộc hẹn đã hoàn thành)
        const completedAppointments = myAppointments
            .filter(ch => ch.trang_thai === 'hoan_thanh' || ch.trang_thai === 'completed')
            .sort((a, b) => {
                const dateA = new Date(a.ngay_kham || a.ngay_hen);
                const dateB = new Date(b.ngay_kham || b.ngay_hen);
                return dateB - dateA;
            })
            .slice(0, 5);

        const recentActivities = await Promise.all(
            completedAppointments.map(async (ch) => {
                const benhNhan = allBenhNhanData.find(bn => bn.id_benh_nhan === ch.id_benh_nhan);
                const nguoiDung = benhNhan ? allNguoiDungData.find(nd => nd.id_nguoi_dung === benhNhan.id_benh_nhan) : null;
                
                return {
                    time: new Date(ch.ngay_kham || ch.ngay_hen).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                    action: `Hoàn thành khám cho bệnh nhân ${nguoiDung?.ho_ten || 'N/A'}`
                };
            })
        );

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    patientsToday,
                    appointments: appointmentsToday.length,
                    pendingRecords,
                    newReports: 0 // TODO: Implement reports
                },
                upcomingAppointments: upcomingAppointmentsWithPatient,
                recentActivities
            }
        });
    } catch (error) {
        console.error("Error in getDoctorDashboard:", error);
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// ==================== DASHBOARD NHÂN VIÊN QUẦY ====================

export const getReceptionistDashboard = async (req, res) => {
    try {
        const today = getToday();
        const thisMonth = getThisMonth();

        // Lấy tất cả cuộc hẹn
        const [allCuocHenKham, allCuocHenTuVan, allHoaDon, allBenhNhan, allNguoiDung] = await Promise.all([
            CuocHenKhamBenh.getAll(),
            CuocHenTuVan.getAll(),
            HoaDon.getAll(),
            BenhNhan.getAll(),
            NguoiDung.getAll()
        ]);

        const allCuocHenKhamData = Array.isArray(allCuocHenKham) ? allCuocHenKham : (allCuocHenKham?.data || []);
        const allCuocHenTuVanData = Array.isArray(allCuocHenTuVan) ? allCuocHenTuVan : (allCuocHenTuVan?.data || []);
        const allHoaDonData = Array.isArray(allHoaDon) ? allHoaDon : (allHoaDon?.data || []);
        const allBenhNhanData = Array.isArray(allBenhNhan) ? allBenhNhan : (allBenhNhan?.data || []);
        const allNguoiDungData = Array.isArray(allNguoiDung) ? allNguoiDung : (allNguoiDung?.data || []);

        // Cuộc hẹn hôm nay
        const appointmentsToday = [
            ...allCuocHenKhamData.filter(ch => formatDate(ch.ngay_kham || ch.ngay_hen) === today),
            ...allCuocHenTuVanData.filter(ch => formatDate(ch.ngay_tu_van || ch.ngay_hen) === today)
        ];

        // Bệnh nhân hôm nay (unique)
        const patientIdsToday = [...new Set([
            ...allCuocHenKhamData.filter(ch => formatDate(ch.ngay_kham || ch.ngay_hen) === today).map(ch => ch.id_benh_nhan),
            ...allCuocHenTuVanData.filter(ch => formatDate(ch.ngay_tu_van || ch.ngay_hen) === today).map(ch => ch.id_benh_nhan)
        ])];
        const patientsToday = patientIdsToday.length;

        // Cuộc hẹn chờ xác nhận
        const pendingAppointments = [
            ...allCuocHenKhamData.filter(ch => ch.trang_thai === 'cho_xac_nhan' || ch.trang_thai === 'pending'),
            ...allCuocHenTuVanData.filter(ch => ch.trang_thai === 'cho_xac_nhan' || ch.trang_thai === 'pending')
        ].length;

        // Doanh thu hôm nay
        const todayInvoices = allHoaDonData.filter(hd => {
            const ngayTao = formatDate(hd.thoi_gian_tao || hd.ngay_tao);
            return ngayTao === today && hd.trang_thai === 'da_thanh_toan';
        });
        const revenue = todayInvoices.reduce((sum, inv) => sum + (parseFloat(inv.tong_tien) || 0), 0);

        // Lịch hẹn sắp tới
        const upcomingAppointments = [
            ...allCuocHenKhamData.filter(ch => formatDate(ch.ngay_kham || ch.ngay_hen) >= today),
            ...allCuocHenTuVanData.filter(ch => formatDate(ch.ngay_tu_van || ch.ngay_hen) >= today)
        ]
        .sort((a, b) => {
            const dateA = new Date(a.ngay_kham || a.ngay_tu_van || a.ngay_hen);
            const dateB = new Date(b.ngay_kham || b.ngay_tu_van || b.ngay_hen);
            return dateA - dateB;
        })
        .slice(0, 10)
        .map(ch => {
            const benhNhan = allBenhNhanData.find(bn => bn.id_benh_nhan === ch.id_benh_nhan);
            const nguoiDung = benhNhan ? allNguoiDungData.find(nd => nd.id_nguoi_dung === benhNhan.id_benh_nhan) : null;
            return {
                ...ch,
                benh_nhan: benhNhan,
                nguoi_dung: nguoiDung
            };
        });

        // Hoạt động hôm nay (từ hóa đơn)
        const todayActivities = allHoaDonData
            .filter(hd => {
                const ngayTao = formatDate(hd.thoi_gian_tao || hd.ngay_tao);
                return ngayTao === today;
            })
            .sort((a, b) => {
                const timeA = new Date(a.thoi_gian_tao || a.ngay_tao);
                const timeB = new Date(b.thoi_gian_tao || b.ngay_tao);
                return timeB - timeA;
            })
            .slice(0, 10)
            .map(hd => {
                const cuocHen = allCuocHenKhamData.find(ch => ch.id_cuoc_hen === hd.id_cuoc_hen_kham) ||
                               allCuocHenTuVanData.find(ch => ch.id_cuoc_hen === hd.id_cuoc_hen_tu_van);
                const benhNhan = cuocHen ? allBenhNhanData.find(bn => bn.id_benh_nhan === cuocHen.id_benh_nhan) : null;
                const nguoiDung = benhNhan ? allNguoiDungData.find(nd => nd.id_nguoi_dung === benhNhan.id_benh_nhan) : null;
                
                return {
                    time: new Date(hd.thoi_gian_tao || hd.ngay_tao).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                    type: hd.trang_thai === 'da_thanh_toan' ? 'payment' : 'check-in',
                    content: nguoiDung 
                        ? `Thu phí khám cho BN ${nguoiDung.ho_ten} - ${parseFloat(hd.tong_tien || 0).toLocaleString('vi-VN')} VNĐ`
                        : `Hóa đơn ${hd.id_hoa_don}`,
                    status: hd.trang_thai === 'da_thanh_toan' ? 'completed' : 'in-progress'
                };
            });

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    patientsToday,
                    appointmentsToday: appointmentsToday.length,
                    pendingAppointments,
                    revenue
                },
                upcomingAppointments,
                todayActivities
            }
        });
    } catch (error) {
        console.error("Error in getReceptionistDashboard:", error);
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// ==================== DASHBOARD NHÂN VIÊN PHÂN CÔNG ====================

export const getStaffDashboard = async (req, res) => {
    try {
        const today = getToday();
        const thisWeek = getThisWeek();

        // Lấy tất cả dữ liệu
        const [allLichLamViec, allXinNghiPhep, allNhanVienPhanCong, allNhanVienQuay, allBacSi] = await Promise.all([
            LichLamViec.getAll(),
            XinNghiPhep.getAll(),
            NhanVienPhanCong.getAll(),
            NhanVienQuay.getAll(),
            BacSi.getAll()
        ]);

        const allLichLamViecData = Array.isArray(allLichLamViec) ? allLichLamViec : (allLichLamViec?.data || []);
        const allXinNghiPhepData = Array.isArray(allXinNghiPhep) ? allXinNghiPhep : (allXinNghiPhep?.data || []);
        const allNhanVienPhanCongData = Array.isArray(allNhanVienPhanCong) ? allNhanVienPhanCong : (allNhanVienPhanCong?.data || []);
        const allNhanVienQuayData = Array.isArray(allNhanVienQuay) ? allNhanVienQuay : (allNhanVienQuay?.data || []);
        const allBacSiData = Array.isArray(allBacSi) ? allBacSi : (allBacSi?.data || []);

        // Tổng nhân viên
        const totalStaff = allNhanVienPhanCongData.length + allNhanVienQuayData.length + allBacSiData.length;

        // Lịch chờ phân công (lịch làm việc chưa được phân công)
        const pendingSchedules = allLichLamViecData.filter(llv => 
            !llv.id_bac_si || !llv.id_nhan_vien_quay
        ).length;

        // Yêu cầu nghỉ phép chờ duyệt
        const pendingLeaveRequests = allXinNghiPhepData.filter(xnp => 
            xnp.trang_thai === 'cho_duyet' || xnp.trang_thai === 'pending'
        ).length;

        // Hoàn thành tuần này (lịch làm việc đã hoàn thành)
        const completedThisWeek = allLichLamViecData.filter(llv => {
            const ngayLamViec = formatDate(llv.ngay_lam_viec || llv.ngay);
            return ngayLamViec >= thisWeek.start && ngayLamViec <= thisWeek.end &&
                   (llv.trang_thai === 'hoan_thanh' || llv.trang_thai === 'completed');
        }).length;

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalStaff,
                    pendingSchedules,
                    pendingLeaveRequests,
                    completedThisWeek
                }
            }
        });
    } catch (error) {
        console.error("Error in getStaffDashboard:", error);
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// ==================== DASHBOARD ADMIN ====================

export const getAdminDashboard = async (req, res) => {
    try {
        const today = getToday();
        const thisMonth = getThisMonth();

        // Lấy tất cả dữ liệu
        const [
            allBenhNhan,
            allBacSi,
            allNhanVienPhanCong,
            allNhanVienQuay,
            allCuocHenKham,
            allCuocHenTuVan,
            allHoaDon,
            allNguoiDung
        ] = await Promise.all([
            BenhNhan.getAll(),
            BacSi.getAll(),
            NhanVienPhanCong.getAll(),
            NhanVienQuay.getAll(),
            CuocHenKhamBenh.getAll(),
            CuocHenTuVan.getAll(),
            HoaDon.getAll(),
            NguoiDung.getAll()
        ]);

        const allBenhNhanData = Array.isArray(allBenhNhan) ? allBenhNhan : (allBenhNhan?.data || []);
        const allBacSiData = Array.isArray(allBacSi) ? allBacSi : (allBacSi?.data || []);
        const allNhanVienPhanCongData = Array.isArray(allNhanVienPhanCong) ? allNhanVienPhanCong : (allNhanVienPhanCong?.data || []);
        const allNhanVienQuayData = Array.isArray(allNhanVienQuay) ? allNhanVienQuay : (allNhanVienQuay?.data || []);
        const allCuocHenKhamData = Array.isArray(allCuocHenKham) ? allCuocHenKham : (allCuocHenKham?.data || []);
        const allCuocHenTuVanData = Array.isArray(allCuocHenTuVan) ? allCuocHenTuVan : (allCuocHenTuVan?.data || []);
        const allHoaDonData = Array.isArray(allHoaDon) ? allHoaDon : (allHoaDon?.data || []);
        const allNguoiDungData = Array.isArray(allNguoiDung) ? allNguoiDung : (allNguoiDung?.data || []);

        // Tổng bệnh nhân
        const totalPatients = allBenhNhanData.length;

        // Tổng nhân viên
        const totalStaff = allBacSiData.length + allNhanVienPhanCongData.length + allNhanVienQuayData.length;

        // Tổng người dùng
        const totalUsers = allNguoiDungData.length;

        // Cuộc hẹn hôm nay
        const appointmentsToday = [
            ...allCuocHenKhamData.filter(ch => {
                const ngay = formatDate(ch.ngay_kham || ch.ngay_hen);
                return ngay && ngay === today;
            }),
            ...allCuocHenTuVanData.filter(ch => {
                const ngay = formatDate(ch.ngay_tu_van || ch.ngay_hen);
                return ngay && ngay === today;
            })
        ].length;

        // Doanh thu tháng này
        const monthInvoices = allHoaDonData.filter(hd => {
            const ngayTao = formatDate(hd.thoi_gian_tao || hd.ngay_tao);
            return ngayTao && ngayTao >= thisMonth.start && ngayTao <= thisMonth.end &&
                   hd.trang_thai === 'da_thanh_toan';
        });
        const monthlyRevenue = monthInvoices.reduce((sum, inv) => sum + (parseFloat(inv.tong_tien) || 0), 0);

        // Bệnh nhân mới tháng này
        const newPatientsThisMonth = allBenhNhanData.filter(bn => {
            const ngayTao = formatDate(bn.thoi_gian_tao || bn.ngay_dang_ky);
            return ngayTao && ngayTao >= thisMonth.start && ngayTao <= thisMonth.end;
        }).length;

        // Tỷ lệ hoàn thành cuộc hẹn
        const totalAppointments = allCuocHenKhamData.length + allCuocHenTuVanData.length;
        const completedAppointments = [
            ...allCuocHenKhamData.filter(ch => ch.trang_thai === 'hoan_thanh' || ch.trang_thai === 'completed'),
            ...allCuocHenTuVanData.filter(ch => ch.trang_thai === 'hoan_thanh' || ch.trang_thai === 'completed')
        ].length;
        const completionRate = totalAppointments > 0 
            ? Math.round((completedAppointments / totalAppointments) * 100) 
            : 0;

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalPatients,
                    totalStaff,
                    totalUsers,
                    appointmentsToday,
                    monthlyRevenue,
                    newPatientsThisMonth,
                    completionRate
                }
            }
        });
    } catch (error) {
        console.error("Error in getAdminDashboard:", error);
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// ==================== DASHBOARD CHUYÊN GIA DINH DƯỠNG ====================

export const getNutritionistDashboard = async (req, res) => {
    try {
        const id_chuyen_gia = req.decoded?.info?.id_nguoi_dung;
        if (!id_chuyen_gia) {
            return res.status(401).json({ success: false, message: "Không tìm thấy thông tin chuyên gia dinh dưỡng" });
        }

        // Kiểm tra xem có phải chuyên gia dinh dưỡng không
        const chuyenGia = await ChuyenGiaDinhDuong.findOne({ id_chuyen_gia });
        if (!chuyenGia) {
            return res.status(403).json({ success: false, message: "Không phải chuyên gia dinh dưỡng" });
        }

        const today = getToday();
        
        // Lấy tất cả cuộc hẹn tư vấn
        const allCuocHen = await CuocHenTuVan.getAll();
        const allCuocHenData = Array.isArray(allCuocHen) ? allCuocHen : (allCuocHen?.data || []);
        
        // Filter cuộc hẹn của chuyên gia này
        const myAppointments = allCuocHenData.filter(ch => ch.id_chuyen_gia === id_chuyen_gia);
        
        // Cuộc hẹn hôm nay
        const appointmentsToday = myAppointments.filter(ch => {
            const ngayTuVan = formatDate(ch.ngay_kham || ch.ngay_tu_van || ch.ngay_hen);
            return ngayTuVan === today;
        });

        // Lấy bệnh nhân hôm nay (unique)
        const patientIdsToday = [...new Set(appointmentsToday.map(ch => ch.id_benh_nhan))];
        const patientsToday = patientIdsToday.length;

        // Lịch hẹn sắp tới (từ hôm nay trở đi)
        const upcomingAppointments = myAppointments
            .filter(ch => {
                const ngayTuVan = formatDate(ch.ngay_kham || ch.ngay_tu_van || ch.ngay_hen);
                return ngayTuVan >= today;
            })
            .sort((a, b) => {
                const dateA = new Date(a.ngay_kham || a.ngay_tu_van || a.ngay_hen);
                const dateB = new Date(b.ngay_kham || b.ngay_tu_van || b.ngay_hen);
                return dateA - dateB;
            })
            .slice(0, 10);

        // Lấy thông tin bệnh nhân cho lịch hẹn sắp tới
        const [allBenhNhan, allNguoiDung] = await Promise.all([
            BenhNhan.getAll(),
            NguoiDung.getAll()
        ]);
        const allBenhNhanData = Array.isArray(allBenhNhan) ? allBenhNhan : (allBenhNhan?.data || []);
        const allNguoiDungData = Array.isArray(allNguoiDung) ? allNguoiDung : (allNguoiDung?.data || []);

        const upcomingAppointmentsWithPatient = upcomingAppointments.map(ch => {
            const benhNhan = allBenhNhanData.find(bn => bn.id_benh_nhan === ch.id_benh_nhan);
            const nguoiDung = benhNhan ? allNguoiDungData.find(nd => nd.id_nguoi_dung === benhNhan.id_benh_nhan) : null;
            
            return {
                ...ch,
                benh_nhan: benhNhan,
                nguoi_dung: nguoiDung
            };
        });

        // Hồ sơ dinh dưỡng chờ duyệt (lấy hồ sơ liên quan đến chuyên gia này)
        const allHoSo = await HoSoDinhDuong.getAll();
        const allHoSoData = Array.isArray(allHoSo) ? allHoSo : (allHoSo?.data || []);
        const pendingRecords = allHoSoData.filter(hs => 
            hs.id_chuyen_gia === id_chuyen_gia && 
            (!hs.trang_thai || hs.trang_thai === 'cho_duyet')
        ).length;

        // Hoạt động gần đây (từ cuộc hẹn đã hoàn thành)
        const completedAppointments = myAppointments
            .filter(ch => ch.trang_thai === 'da_hoan_thanh' || ch.trang_thai === 'hoan_thanh' || ch.trang_thai === 'completed')
            .sort((a, b) => {
                const dateA = new Date(a.ngay_kham || a.ngay_tu_van || a.ngay_hen);
                const dateB = new Date(b.ngay_kham || b.ngay_tu_van || b.ngay_hen);
                return dateB - dateA;
            })
            .slice(0, 5);

        const recentActivities = await Promise.all(
            completedAppointments.map(async (ch) => {
                const benhNhan = allBenhNhanData.find(bn => bn.id_benh_nhan === ch.id_benh_nhan);
                const nguoiDung = benhNhan ? allNguoiDungData.find(nd => nd.id_nguoi_dung === benhNhan.id_benh_nhan) : null;
                
                return {
                    time: new Date(ch.ngay_kham || ch.ngay_tu_van || ch.ngay_hen).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                    action: `Hoàn thành tư vấn cho bệnh nhân ${nguoiDung?.ho_ten || 'N/A'}`
                };
            })
        );

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    patientsToday,
                    appointments: appointmentsToday.length,
                    pendingRecords,
                    newReports: 0 // TODO: Implement reports
                },
                upcomingAppointments: upcomingAppointmentsWithPatient,
                recentActivities
            }
        });
    } catch (error) {
        console.error("Error in getNutritionistDashboard:", error);
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

