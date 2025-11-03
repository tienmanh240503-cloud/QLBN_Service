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
      console.log('Email transporter verified successfully');
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
    console.log('Email sent:', info.messageId);
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

