// middlewares/checkRole.js
export const checkRole = (allowedRoles = []) => {
    return (req, res, next) => {
        try {
            const vai_tro = req.decoded?.vai_tro; // lấy từ token decode

            if (!vai_tro) {
                return res.status(401).json({
                    success: false,
                    message: "Không tìm thấy thông tin vai trò. Vui lòng đăng nhập lại."
                });
            }

            if (!allowedRoles.includes(vai_tro)) {
                return res.status(403).json({
                    success: false,
                    message: "Bạn không có quyền thực hiện chức năng này."
                });
            }

            // Hợp lệ thì cho đi tiếp
            next();
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Lỗi kiểm tra quyền truy cập.",
                error: err.message
            });
        }
    };
};
