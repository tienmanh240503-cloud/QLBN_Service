import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Cấu hình transporter cho email
// Sử dụng Gmail hoặc SMTP server khác
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true cho 465, false cho các port khác
    auth: {
      user: process.env.EMAIL_USER, // Email của bạn
      pass: process.env.EMAIL_PASSWORD // Mật khẩu ứng dụng của bạn
    }
  });
};

// Gửi email đơn lẻ
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    // Kiểm tra cấu hình email
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      const errorMsg = 'Email chưa được cấu hình. Vui lòng kiểm tra EMAIL_USER và EMAIL_PASSWORD trong file .env';
      console.error('Email config error:', errorMsg);
      return {
        success: false,
        error: errorMsg
      };
    }

    const transporter = createTransporter();
    
    // Test kết nối trước khi gửi (optional, có thể bỏ qua nếu lỗi)
    try {
      await transporter.verify();
    } catch (verifyError) {
      console.warn('Email transporter verification failed, but continuing:', verifyError.message);
      // Không throw error ở đây, tiếp tục thử gửi email
    }
    
    const mailOptions = {
      from: `"Hệ thống Quản lý Bệnh viện" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html || text,
      text: text || html
    };

    const info = await transporter.sendMail(mailOptions);
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Phân tích và tạo thông báo lỗi chi tiết hơn
    let errorMessage = error.message;
    
    // Kiểm tra lỗi xác thực Gmail
    if (error.code === 'EAUTH' || error.message.includes('Invalid login') || error.message.includes('BadCredentials')) {
      errorMessage = `Lỗi xác thực Gmail: ${error.message}\n\n` +
        `CÁCH KHẮC PHỤC:\n` +
        `1. Đảm bảo đã bật 2-Step Verification trên Google Account\n` +
        `2. Tạo App Password tại: https://myaccount.google.com/apppasswords\n` +
        `3. Chọn App: Mail, Device: Other (Custom name) - Nhập: "Hospital System"\n` +
        `4. Copy mật khẩu 16 ký tự (bỏ dấu cách) và dán vào EMAIL_PASSWORD trong file .env\n` +
        `5. KHÔNG dùng mật khẩu thường của Gmail!\n` +
        `6. Kiểm tra lại EMAIL_USER và EMAIL_PASSWORD trong file .env\n` +
        `7. Khởi động lại server sau khi cập nhật .env`;
    } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      errorMessage = `Lỗi kết nối SMTP: ${error.message}\n\n` +
        `Kiểm tra:\n` +
        `- EMAIL_HOST trong file .env (Gmail: smtp.gmail.com)\n` +
        `- EMAIL_PORT trong file .env (Gmail: 587 hoặc 465)\n` +
        `- Kết nối internet\n` +
        `- Firewall không chặn cổng SMTP`;
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

// Gửi email cho nhiều người nhận
export const sendBulkEmail = async ({ recipients, subject, html, text }) => {
  const results = [];
  
  for (const recipient of recipients) {
    const result = await sendEmail({
      to: recipient,
      subject,
      html,
      text
    });
    results.push({
      recipient,
      ...result
    });
  }
  
  return results;
};

// Template email đăng ký nhận tin tức
export const getNewsletterWelcomeEmail = (name, email) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Chào mừng đến với Bản tin Y tế!</h1>
        </div>
        <div class="content">
          <p>Xin chào <strong>${name || 'Quý khách'}</strong>,</p>
          <p>Cảm ơn bạn đã đăng ký nhận tin tức y tế từ hệ thống của chúng tôi!</p>
          <p>Bạn sẽ nhận được các thông tin mới nhất về:</p>
          <ul>
            <li>Tin tức y tế và sức khỏe</li>
            <li>Lời khuyên từ bác sĩ chuyên khoa</li>
            <li>Thông báo về các dịch vụ mới</li>
            <li>Các chương trình khuyến mãi đặc biệt</li>
          </ul>
          <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.</p>
          <p>Trân trọng,<br><strong>Đội ngũ Hệ thống Quản lý Bệnh viện</strong></p>
        </div>
        <div class="footer">
          <p>Email này được gửi đến ${email}</p>
          <p>© 2025 Hệ thống Quản lý Bệnh viện. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Chào mừng đến với Bản tin Y tế!
    
    Xin chào ${name || 'Quý khách'},
    
    Cảm ơn bạn đã đăng ký nhận tin tức y tế từ hệ thống của chúng tôi!
    
    Bạn sẽ nhận được các thông tin mới nhất về tin tức y tế, lời khuyên từ bác sĩ, thông báo dịch vụ mới và các chương trình khuyến mãi.
    
    Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.
    
    Trân trọng,
    Đội ngũ Hệ thống Quản lý Bệnh viện
  `;

  return { html, text };
};

// Template email tư vấn y tế
export const getConsultationEmail = (name, content) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thông tin Tư vấn Y tế</h1>
        </div>
        <div class="content">
          <p>Xin chào <strong>${name || 'Quý khách'}</strong>,</p>
          <div style="background: white; padding: 20px; border-left: 4px solid #48bb78; margin: 20px 0;">
            ${content}
          </div>
          <p>Trân trọng,<br><strong>Đội ngũ Hệ thống Quản lý Bệnh viện</strong></p>
        </div>
        <div class="footer">
          <p>© 2025 Hệ thống Quản lý Bệnh viện. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
};

// Template email thông tin tài khoản mới (password được tạo tự động)
export const getNewAccountEmail = (hoTen, tenDangNhap, matKhau, vaiTro, email) => {
  // Chuyển đổi vai trò sang tiếng Việt
  const vaiTroMap = {
    'benh_nhan': 'Bệnh nhân',
    'bac_si': 'Bác sĩ',
    'chuyen_gia_dinh_duong': 'Chuyên gia dinh dưỡng',
    'nhan_vien_quay': 'Nhân viên quầy',
    'nhan_vien_phan_cong': 'Nhân viên phân công',
    'nhan_vien_xet_nghiem': 'Nhân viên xét nghiệm',
    'quan_tri_vien': 'Quản trị viên'
  };
  
  const vaiTroText = vaiTroMap[vaiTro] || vaiTro;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          background-color: #f4f4f4;
        }
        .email-wrapper { 
          max-width: 600px; 
          margin: 0 auto; 
          background-color: #ffffff;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
        }
        .header h1 { 
          font-size: 28px; 
          margin-bottom: 10px;
          font-weight: 600;
        }
        .header p {
          font-size: 16px;
          opacity: 0.95;
        }
        .content { 
          padding: 40px 30px; 
          background: #ffffff;
        }
        .welcome-section {
          margin-bottom: 30px;
        }
        .welcome-section h2 {
          color: #667eea;
          font-size: 22px;
          margin-bottom: 15px;
        }
        .info-box {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border-left: 4px solid #667eea;
          padding: 25px;
          margin: 25px 0;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        .info-box h3 {
          color: #667eea;
          font-size: 18px;
          margin-bottom: 15px;
          font-weight: 600;
        }
        .info-item {
          margin: 12px 0;
          font-size: 15px;
        }
        .info-item strong {
          color: #333;
          display: inline-block;
          min-width: 140px;
        }
        .password-box {
          background: #fff3cd;
          border: 2px solid #ffc107;
          border-radius: 8px;
          padding: 20px;
          margin: 25px 0;
          text-align: center;
        }
        .password-box .password-label {
          font-size: 14px;
          color: #856404;
          margin-bottom: 10px;
          font-weight: 600;
        }
        .password-box .password-value {
          font-size: 24px;
          font-weight: bold;
          color: #d9534f;
          letter-spacing: 2px;
          font-family: 'Courier New', monospace;
          background: white;
          padding: 15px;
          border-radius: 5px;
          border: 1px solid #ffc107;
          word-break: break-all;
        }
        .warning-box {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 25px 0;
          border-radius: 5px;
        }
        .warning-box p {
          color: #856404;
          font-size: 14px;
          margin: 5px 0;
        }
        .warning-box ul {
          margin: 10px 0 0 20px;
          color: #856404;
        }
        .warning-box li {
          margin: 5px 0;
        }
        .instructions {
          background: #e7f3ff;
          border-left: 4px solid #2196F3;
          padding: 20px;
          margin: 25px 0;
          border-radius: 5px;
        }
        .instructions h3 {
          color: #1976D2;
          font-size: 16px;
          margin-bottom: 10px;
        }
        .instructions ol {
          margin: 10px 0 0 20px;
          color: #1565C0;
        }
        .instructions li {
          margin: 8px 0;
          font-size: 14px;
        }
        .footer { 
          background: #f8f9fa;
          padding: 30px;
          text-align: center; 
          color: #666; 
          font-size: 13px;
          border-top: 1px solid #e0e0e0;
        }
        .footer p {
          margin: 8px 0;
        }
        .footer .contact-info {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #e0e0e0;
        }
        .button {
          display: inline-block;
          padding: 14px 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
          font-weight: 600;
          font-size: 15px;
          box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);
        }
        .button:hover {
          box-shadow: 0 6px 8px rgba(102, 126, 234, 0.4);
        }
        @media only screen and (max-width: 600px) {
          .content { padding: 25px 20px; }
          .header { padding: 30px 20px; }
          .header h1 { font-size: 24px; }
          .info-box { padding: 20px; }
          .password-box .password-value { font-size: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="header">
          <h1>🎉 Chào mừng đến với Hệ thống Quản lý Bệnh viện</h1>
          <p>Tài khoản của bạn đã được tạo thành công</p>
        </div>
        <div class="content">
          <div class="welcome-section">
            <h2>Xin chào ${hoTen || 'Quý khách'}!</h2>
            <p>Chúng tôi rất vui mừng thông báo rằng tài khoản của bạn đã được tạo thành công trong hệ thống Quản lý Bệnh viện.</p>
            <p>Bạn đã được cấp quyền truy cập với vai trò: <strong>${vaiTroText}</strong></p>
          </div>

          <div class="info-box">
            <h3>📋 Thông tin đăng nhập của bạn</h3>
            <div class="info-item">
              <strong>Tên đăng nhập:</strong> 
              <span style="color: #667eea; font-weight: 600;">${tenDangNhap}</span>
            </div>
            <div class="info-item">
              <strong>Email:</strong> 
              <span style="color: #667eea;">${email}</span>
            </div>
            <div class="info-item">
              <strong>Vai trò:</strong> 
              <span style="color: #667eea;">${vaiTroText}</span>
            </div>
          </div>

          <div class="password-box">
            <div class="password-label">🔐 Mật khẩu đăng nhập của bạn:</div>
            <div class="password-value">${matKhau}</div>
          </div>

          <div class="warning-box">
            <p><strong>⚠️ Lưu ý quan trọng về bảo mật:</strong></p>
            <ul>
              <li>Mật khẩu này được tạo tự động và chỉ được gửi một lần qua email này</li>
              <li>Vui lòng <strong>đổi mật khẩu ngay sau lần đăng nhập đầu tiên</strong> để đảm bảo an toàn</li>
              <li>Không chia sẻ thông tin đăng nhập với bất kỳ ai</li>
              <li>Nếu bạn không yêu cầu tạo tài khoản này, vui lòng liên hệ ngay với chúng tôi</li>
            </ul>
          </div>

          <div class="instructions">
            <h3>📝 Hướng dẫn đăng nhập lần đầu:</h3>
            <ol>
              <li>Truy cập vào hệ thống qua trình duyệt web</li>
              <li>Sử dụng <strong>Tên đăng nhập</strong> và <strong>Mật khẩu</strong> được cung cấp ở trên</li>
              <li>Sau khi đăng nhập thành công, vui lòng vào phần <strong>"Đổi mật khẩu"</strong> trong cài đặt tài khoản</li>
              <li>Đặt một mật khẩu mới mạnh và dễ nhớ (tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt)</li>
              <li>Lưu mật khẩu mới ở nơi an toàn</li>
            </ol>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <p style="margin-bottom: 15px; color: #666;">Nếu bạn có bất kỳ câu hỏi hoặc cần hỗ trợ, đừng ngần ngại liên hệ với chúng tôi.</p>
            <p style="color: #667eea; font-weight: 600;">Chúc bạn sử dụng hệ thống hiệu quả!</p>
          </div>
        </div>
        <div class="footer">
          <p><strong>Hệ thống Quản lý Bệnh viện</strong></p>
          <p>Email này được gửi tự động từ hệ thống</p>
          <p>Vui lòng không trả lời email này</p>
          <div class="contact-info">
            <p>Nếu bạn có thắc mắc, vui lòng liên hệ:</p>
            <p>Email: support@hospital.com | Hotline: 1900-xxxx</p>
          </div>
          <p style="margin-top: 20px; color: #999; font-size: 12px;">
            © 2025 Hệ thống Quản lý Bệnh viện. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Chào mừng đến với Hệ thống Quản lý Bệnh viện
    ============================================
    
    Xin chào ${hoTen || 'Quý khách'}!
    
    Chúng tôi rất vui mừng thông báo rằng tài khoản của bạn đã được tạo thành công trong hệ thống Quản lý Bệnh viện.
    
    Bạn đã được cấp quyền truy cập với vai trò: ${vaiTroText}
    
    THÔNG TIN ĐĂNG NHẬP CỦA BẠN:
    ============================
    Tên đăng nhập: ${tenDangNhap}
    Email: ${email}
    Vai trò: ${vaiTroText}
    Mật khẩu: ${matKhau}
    
    LƯU Ý QUAN TRỌNG VỀ BẢO MẬT:
    ============================
    - Mật khẩu này được tạo tự động và chỉ được gửi một lần qua email này
    - Vui lòng ĐỔI MẬT KHẨU NGAY sau lần đăng nhập đầu tiên để đảm bảo an toàn
    - Không chia sẻ thông tin đăng nhập với bất kỳ ai
    - Nếu bạn không yêu cầu tạo tài khoản này, vui lòng liên hệ ngay với chúng tôi
    
    HƯỚNG DẪN ĐĂNG NHẬP LẦN ĐẦU:
    ============================
    1. Truy cập vào hệ thống qua trình duyệt web
    2. Sử dụng Tên đăng nhập và Mật khẩu được cung cấp ở trên
    3. Sau khi đăng nhập thành công, vui lòng vào phần "Đổi mật khẩu" trong cài đặt tài khoản
    4. Đặt một mật khẩu mới mạnh và dễ nhớ (tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt)
    5. Lưu mật khẩu mới ở nơi an toàn
    
    Nếu bạn có bất kỳ câu hỏi hoặc cần hỗ trợ, đừng ngần ngại liên hệ với chúng tôi.
    
    Chúc bạn sử dụng hệ thống hiệu quả!
    
    ---
    Hệ thống Quản lý Bệnh viện
    Email: support@hospital.com | Hotline: 1900-xxxx
    © 2025 Hệ thống Quản lý Bệnh viện. All rights reserved.
  `;

  return { html, text };
};

// Template email xác thực đăng ký (gửi mã OTP 6 số)
export const getRegisterVerificationEmail = (hoTen, code) => {
  const safeName = hoTen && hoTen.trim() ? hoTen.trim() : 'Quý khách';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color:#333; background:#f4f4f4; }
        .wrapper { max-width:600px; margin:0 auto; background:#fff; box-shadow:0 2px 8px rgba(0,0,0,0.08); }
        .header { background:linear-gradient(135deg,#00b4db 0%,#0083b0 100%); color:#fff; padding:28px 24px; text-align:center; }
        .header h1 { margin:0; font-size:22px; font-weight:600; }
        .content { padding:28px 24px; }
        .greet { margin:0 0 12px 0; }
        .otp-box { display:inline-block; padding:14px 18px; letter-spacing:6px; font-size:22px; font-weight:700; background:#f5f7fa; border-radius:8px; border:1px solid #e6ebf1; }
        .note { margin-top:16px; color:#555; }
        .footer { background:#f8f9fa; padding:18px 24px; text-align:center; color:#777; font-size:12px; border-top:1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <h1>Xác thực đăng ký tài khoản</h1>
        </div>
        <div class="content">
          <p class="greet">Xin chào ${safeName},</p>
          <p>Đây là mã xác thực đăng ký của bạn:</p>
          <div class="otp-box">${code}</div>
          <p class="note">Mã có hiệu lực trong 10 phút. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
        </div>
        <div class="footer">
          Email được gửi tự động từ Hệ thống Quản lý Bệnh viện. Vui lòng không trả lời email này.
        </div>
      </div>
    </body>
    </html>
  `;
  const text = `Xin chào ${safeName},

Mã xác thực đăng ký của bạn: ${code}

Mã có hiệu lực trong 10 phút. Không chia sẻ mã này với bất kỳ ai.

Hệ thống Quản lý Bệnh viện (email tự động)`;
  return { html, text };
};

