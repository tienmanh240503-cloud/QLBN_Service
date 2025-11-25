# Migration: Mở rộng bảng phongkham để hỗ trợ nhiều loại role

## Mục đích
Mở rộng bảng `phongkham` để hỗ trợ phòng khám cho nhiều loại role:
- **Bác sĩ**: Phòng khám bác sĩ (liên kết với chuyên khoa)
- **Chuyên gia dinh dưỡng**: Phòng tư vấn dinh dưỡng (liên kết với chuyên ngành dinh dưỡng)
- **Nhân viên quầy/Phân công**: Phòng làm việc chung
- **Nhân viên xét nghiệm**: Phòng xét nghiệm

## Các thay đổi

### 1. Database Schema
- Thêm trường `loai_phong`: ENUM để phân loại phòng
- Thêm trường `id_chuyen_nganh`: VARCHAR(50) để liên kết với chuyên ngành dinh dưỡng
- Thêm index cho `id_chuyen_nganh`

### 2. Các loại phòng (loai_phong)
- `phong_kham_bac_si`: Phòng khám bác sĩ (có id_chuyen_khoa)
- `phong_tu_van_dinh_duong`: Phòng tư vấn dinh dưỡng (có thể có id_chuyen_nganh)
- `phong_lam_viec`: Phòng làm việc chung cho nhân viên
- `phong_xet_nghiem`: Phòng xét nghiệm
- `phong_khac`: Phòng khác

## Cách chạy migration

1. Kết nối với database MySQL
2. Chạy file SQL:
```sql
source server/migrations/add_loai_phong_to_phongkham.sql
```

Hoặc copy nội dung file và chạy trực tiếp trong MySQL client.

## Cập nhật dữ liệu hiện có

Migration sẽ tự động:
- Cập nhật các phòng có `id_chuyen_khoa` → `loai_phong = 'phong_kham_bac_si'`
- Cập nhật các phòng không có `id_chuyen_khoa` → `loai_phong = 'phong_lam_viec'`

## API Changes

### GET /api/phong-kham
Thêm các query parameters mới:
- `vai_tro`: Tự động filter theo loại phòng phù hợp với vai trò
- `id_chuyen_nganh`: Filter theo chuyên ngành dinh dưỡng
- `loai_phong`: Filter theo loại phòng

Ví dụ:
```
GET /api/phong-kham?vai_tro=chuyen_gia_dinh_duong
GET /api/phong-kham?id_chuyen_nganh=CN_test234
GET /api/phong-kham?loai_phong=phong_lam_viec
```

### POST /api/phong-kham
Thêm các trường mới trong request body:
- `loai_phong`: Loại phòng (tự động xác định nếu không cung cấp)
- `id_chuyen_nganh`: ID chuyên ngành dinh dưỡng (cho phòng tư vấn dinh dưỡng)

### POST /api/nhan-vien-phan-cong/lich-lam-viec
Validation được cập nhật:
- **Bác sĩ**: Phòng phải là `phong_kham_bac_si` và chuyên khoa phải khớp
- **Chuyên gia dinh dưỡng**: Phòng phải là `phong_tu_van_dinh_duong`
- **Nhân viên quầy/Phân công**: Phòng phải là `phong_lam_viec`
- **Nhân viên xét nghiệm**: Phòng phải là `phong_xet_nghiem`

## Frontend Updates (Cần cập nhật)

Khi tạo lịch làm việc cho các role khác nhau, frontend cần:
1. Filter phòng khám theo `vai_tro` khi gọi API
2. Hiển thị phòng khám phù hợp cho từng role
3. Validate phòng khám được chọn phù hợp với role

Ví dụ code frontend:
```javascript
// Lấy phòng khám cho chuyên gia dinh dưỡng
const fetchPhongKhamForChuyenGia = async (id_chuyen_nganh) => {
  const params = {
    vai_tro: 'chuyen_gia_dinh_duong',
    ...(id_chuyen_nganh && { id_chuyen_nganh })
  };
  const response = await apiPhongKham.getAll(params);
  return response.data;
};

// Lấy phòng khám cho nhân viên
const fetchPhongKhamForNhanVien = async () => {
  const params = {
    vai_tro: 'nhan_vien_quay' // hoặc 'nhan_vien_phan_cong'
  };
  const response = await apiPhongKham.getAll(params);
  return response.data;
};
```

## Lưu ý

1. **Backward Compatibility**: Các phòng khám cũ không có `loai_phong` sẽ được xử lý như `phong_kham_bac_si` (nếu có id_chuyen_khoa) hoặc `phong_lam_viec` (nếu không có)

2. **Foreign Key**: Migration có comment phần foreign key constraint cho `id_chuyen_nganh`. Nếu muốn thêm constraint, uncomment và chạy lại.

3. **Validation**: Khi tạo phòng khám mới:
   - Phòng khám bác sĩ phải có `id_chuyen_khoa`
   - Không thể có cả `id_chuyen_khoa` và `id_chuyen_nganh` cùng lúc
   - `loai_phong` sẽ được tự động xác định nếu không cung cấp

