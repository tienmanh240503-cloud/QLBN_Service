import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Kiểm tra API key có được cấu hình không
const OPENAI_API_KEY = process.env.OPENAI_API_KEY?.trim();
const hasValidApiKey = OPENAI_API_KEY && OPENAI_API_KEY.length > 0 && OPENAI_API_KEY !== '';

// Khởi tạo OpenAI client (chỉ khi có API key)
const openai = hasValidApiKey ? new OpenAI({
  apiKey: OPENAI_API_KEY,
}) : null;

// System prompt cho medical assistant
const SYSTEM_PROMPT = `Bạn là một trợ lý y tế AI chuyên nghiệp, thân thiện của bệnh viện. Nhiệm vụ của bạn là:

1. Chào hỏi người dùng một cách thân thiện và chuyên nghiệp
2. Tư vấn về các triệu chứng bệnh thường gặp (cung cấp thông tin tham khảo)
3. Hướng dẫn đặt lịch khám bệnh
4. Thông tin về các dịch vụ y tế
5. Lời khuyên về sức khỏe và dinh dưỡng
6. Giải đáp thắc mắc về quy trình khám bệnh

**Lưu ý quan trọng:**
- Khi người dùng chào hỏi (chào, xin chào, hello, hi...), hãy chào lại một cách thân thiện và giới thiệu ngắn gọn về khả năng hỗ trợ của bạn
- Bạn CHỈ cung cấp thông tin tham khảo, không thể thay thế chẩn đoán của bác sĩ
- Luôn nhấn mạnh rằng người dùng nên đến bệnh viện để được khám và tư vấn chính xác
- Trả lời bằng tiếng Việt, thân thiện và dễ hiểu
- Sử dụng định dạng markdown để làm rõ thông tin (bullet points, bold, emoji khi phù hợp)
- Nếu câu hỏi không liên quan đến y tế, hãy nhẹ nhàng hướng người dùng về các chủ đề y tế mà bạn có thể hỗ trợ`;

// Knowledge base đơn giản cho fallback mode
const FALLBACK_KNOWLEDGE = {
  greetings: [
    'Xin chào! Tôi là trợ lý y tế AI của bệnh viện. Tôi có thể hỗ trợ bạn về các vấn đề y tế, đặt lịch khám bệnh, và tư vấn sức khỏe.',
    'Chào bạn! Tôi rất vui được hỗ trợ bạn về các vấn đề y tế. Bạn cần tôi giúp gì hôm nay?'
  ],
  appointment: 'Để đặt lịch khám bệnh, bạn có thể:\n✅ Sử dụng tính năng đặt lịch trên website\n✅ Gọi hotline: 1900-xxxx\n✅ Đến trực tiếp bệnh viện\n\nGiờ làm việc: 7:00 - 20:00 hàng ngày',
  symptoms: 'Dựa trên các triệu chứng bạn mô tả, tôi khuyên bạn nên:\n✅ Ghi chép đầy đủ các triệu chứng\n✅ Quan sát tần suất và mức độ\n✅ Đến bệnh viện để được bác sĩ thăm khám trực tiếp\n\n💡 Lưu ý: Chẩn đoán chính xác cần có sự thăm khám của bác sĩ.',
  services: 'Bệnh viện cung cấp các dịch vụ:\n✅ Khám đa khoa\n✅ Khám chuyên khoa\n✅ Xét nghiệm\n✅ Chẩn đoán hình ảnh\n✅ Phẫu thuật\n✅ Tư vấn dinh dưỡng\n\nVui lòng liên hệ hotline để biết thêm chi tiết.',
  nutrition: 'Một chế độ dinh dưỡng lành mạnh bao gồm:\n✅ Ăn đủ 4 nhóm thực phẩm\n✅ Uống đủ nước (2-3 lít/ngày)\n✅ Hạn chế đồ ăn nhanh, đường, muối\n✅ Ăn nhiều rau xanh và trái cây\n✅ Tập thể dục đều đặn\n\n💡 Nên tham khảo ý kiến chuyên gia dinh dưỡng để có chế độ phù hợp với tình trạng sức khỏe của bạn.',
  emergency: 'Trong trường hợp khẩn cấp, vui lòng:\n🚨 Gọi cấp cứu: 115\n🏥 Đến ngay bệnh viện gần nhất\n📞 Hotline bệnh viện: 1900-xxxx\n\nKhông tự ý dùng thuốc khi chưa có chỉ định của bác sĩ.'
};

// Hàm tìm câu trả lời từ knowledge base
function getFallbackResponse(userMessage) {
  const msg = userMessage.toLowerCase().trim();
  
  // Kiểm tra lời chào
  if (/^(chào|xin chào|hello|hi|hey|chào bạn|xin chào bạn)/.test(msg)) {
    return FALLBACK_KNOWLEDGE.greetings[0];
  }
  
  // Kiểm tra đặt lịch
  if (/đặt lịch|đặt hẹn|đăng ký khám|lịch khám|hẹn khám/.test(msg)) {
    return FALLBACK_KNOWLEDGE.appointment;
  }
  
  // Kiểm tra triệu chứng
  if (/triệu chứng|bị gì|đau|mệt|sốt|ho|cảm/.test(msg)) {
    return FALLBACK_KNOWLEDGE.symptoms;
  }
  
  // Kiểm tra dịch vụ
  if (/dịch vụ|phòng khám|chuyên khoa|bệnh viện có gì/.test(msg)) {
    return FALLBACK_KNOWLEDGE.services;
  }
  
  // Kiểm tra dinh dưỡng
  if (/dinh dưỡng|ăn uống|thực phẩm|chế độ ăn|giảm cân|tăng cân/.test(msg)) {
    return FALLBACK_KNOWLEDGE.nutrition;
  }
  
  // Kiểm tra cấp cứu
  if (/cấp cứu|khẩn cấp|nguy hiểm|gấp/.test(msg)) {
    return FALLBACK_KNOWLEDGE.emergency;
  }
  
  // Trả về thông báo chung nếu không khớp
  return null;
}

/**
 * Get AI response for medical question
 */
export const getMedicalChatResponse = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập câu hỏi'
      });
    }

    // Nếu không có API key hợp lệ, thử tìm câu trả lời từ knowledge base
    if (!hasValidApiKey || !openai) {
      console.warn('⚠️ OPENAI_API_KEY chưa được cấu hình hoặc không hợp lệ');
      
      // Thử tìm câu trả lời từ knowledge base
      const fallbackAnswer = getFallbackResponse(message);
      if (fallbackAnswer) {
        return res.status(200).json({
          success: true,
          message: fallbackAnswer + '\n\n💡 **Lưu ý:** Hiện tại hệ thống đang ở chế độ fallback. Vui lòng cấu hình OPENAI_API_KEY trong file .env để sử dụng tính năng AI đầy đủ.',
          timestamp: new Date().toISOString()
        });
      }
      
      // Nếu không tìm thấy trong knowledge base
      return res.status(200).json({
        success: true,
        message: `Cảm ơn bạn đã liên hệ! Tôi là trợ lý y tế AI và có thể hỗ trợ bạn về:

✅ Tư vấn các triệu chứng bệnh thường gặp
✅ Hướng dẫn đặt lịch khám bệnh
✅ Thông tin về các dịch vụ y tế
✅ Lời khuyên về sức khỏe và dinh dưỡng
✅ Giải đáp thắc mắc về quy trình khám bệnh

💡 **Lưu ý:** Tôi chỉ có thể cung cấp thông tin tham khảo. Để được chẩn đoán chính xác, vui lòng đến bệnh viện khám trực tiếp.

📞 **Liên hệ trực tiếp:** Hotline 1900-xxxx (7:00 - 20:00 hàng ngày)

⚠️ Hiện tại hệ thống đang ở chế độ fallback. Vui lòng cấu hình OPENAI_API_KEY trong file .env để sử dụng tính năng AI đầy đủ.`,
        timestamp: new Date().toISOString()
      });
    }

    // Xây dựng conversation messages
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    // Gọi OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Hoặc 'gpt-4' nếu muốn sử dụng model mạnh hơn
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiResponse = completion.choices[0]?.message?.content || 
      'Xin lỗi, tôi không thể trả lời câu hỏi này lúc này. Vui lòng thử lại sau.';

    return res.status(200).json({
      success: true,
      message: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    // Log chi tiết lỗi để debug
    console.error('❌ OpenAI API Error:', {
      message: error.message,
      status: error.status,
      code: error.code,
      type: error.type,
      response: {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      }
    });
    
    // Lấy message từ request body để sử dụng cho fallback
    const userMessage = req.body?.message;
    
    // Thử tìm câu trả lời từ knowledge base trước
    const fallbackAnswer = userMessage ? getFallbackResponse(userMessage) : null;
    
    // Xử lý lỗi cụ thể
    if (error.status === 401 || error.response?.status === 401) {
      console.error('🔑 OpenAI API Key không hợp lệ hoặc đã hết hạn');
      return res.status(200).json({
        success: true,
        message: fallbackAnswer || `🔑 **Lưu ý:** API key không hợp lệ. Hệ thống đang sử dụng chế độ fallback.

Tôi là trợ lý y tế AI và có thể hỗ trợ bạn về:
✅ Tư vấn các triệu chứng bệnh thường gặp
✅ Hướng dẫn đặt lịch khám bệnh
✅ Thông tin về các dịch vụ y tế
✅ Lời khuyên về sức khỏe và dinh dưỡng

💡 **Lưu ý:** Để sử dụng tính năng AI đầy đủ, vui lòng cấu hình OPENAI_API_KEY hợp lệ trong file .env của server.`,
        timestamp: new Date().toISOString()
      });
    }
    
    if (error.status === 429 || error.response?.status === 429) {
      // Phân biệt giữa insufficient_quota và rate limit
      const isInsufficientQuota = error.code === 'insufficient_quota' || error.type === 'insufficient_quota';
      
      if (isInsufficientQuota) {
        console.error('💰 OpenAI API: Đã hết quota (insufficient_quota)');
      } else {
        console.error('⏰ OpenAI API: Quá nhiều yêu cầu (rate limit)');
      }
      
      // Nếu có câu trả lời từ knowledge base, ưu tiên hiển thị nó
      if (fallbackAnswer) {
        const note = isInsufficientQuota 
          ? '\n\n💰 **Lưu ý:** Tài khoản OpenAI đã hết quota. Hệ thống đang sử dụng chế độ fallback. Vui lòng nạp thêm credit vào tài khoản OpenAI để sử dụng tính năng AI đầy đủ.'
          : '\n\n⏰ **Lưu ý:** Hệ thống đã nhận quá nhiều yêu cầu. Đang sử dụng chế độ fallback. Bạn có thể thử lại sau vài phút để sử dụng tính năng AI đầy đủ.';
        
        return res.status(200).json({
          success: true,
          message: fallbackAnswer + note,
          timestamp: new Date().toISOString()
        });
      }
      
      // Nếu không có fallback answer, hiển thị message mặc định
      const errorMessage = isInsufficientQuota
        ? `💰 **Thông báo:** Tài khoản OpenAI đã hết quota. Hệ thống đang sử dụng chế độ fallback.

Trong thời gian chờ, tôi vẫn có thể hỗ trợ bạn về:
✅ Tư vấn các triệu chứng bệnh thường gặp
✅ Hướng dẫn đặt lịch khám bệnh
✅ Thông tin về các dịch vụ y tế

💡 **Lưu ý:** Vui lòng nạp thêm credit vào tài khoản OpenAI để sử dụng tính năng AI đầy đủ.`
        : `⏰ **Tạm thời:** Hệ thống đã nhận quá nhiều yêu cầu. Vui lòng thử lại sau ít phút.

Trong thời gian chờ, tôi vẫn có thể hỗ trợ bạn về:
✅ Tư vấn các triệu chứng bệnh thường gặp
✅ Hướng dẫn đặt lịch khám bệnh
✅ Thông tin về các dịch vụ y tế

💡 **Lưu ý:** Bạn có thể thử lại sau vài phút để sử dụng tính năng AI đầy đủ.`;
      
      return res.status(200).json({
        success: true,
        message: errorMessage,
        timestamp: new Date().toISOString()
      });
    }

    // Lỗi kết nối hoặc lỗi khác - sử dụng knowledge base
    console.error('⚠️ Lỗi khi gọi OpenAI API:', error.message);
    
    if (fallbackAnswer) {
      return res.status(200).json({
        success: true,
        message: fallbackAnswer + '\n\n⚠️ **Lưu ý:** Hiện tại không thể kết nối với dịch vụ AI. Trên đây là câu trả lời từ hệ thống fallback.',
        timestamp: new Date().toISOString()
      });
    }
    
    return res.status(200).json({
      success: true,
      message: `⚠️ **Thông báo:** Hiện tại không thể kết nối với dịch vụ AI. Hệ thống đang sử dụng chế độ fallback.

Tôi vẫn có thể hỗ trợ bạn về:
✅ Tư vấn các triệu chứng bệnh thường gặp
✅ Hướng dẫn đặt lịch khám bệnh
✅ Thông tin về các dịch vụ y tế
✅ Lời khuyên về sức khỏe và dinh dưỡng

💡 **Lưu ý:** Vui lòng thử lại sau hoặc liên hệ trực tiếp với bệnh viện qua hotline: 1900-xxxx nếu cần hỗ trợ ngay.

Bạn có thể hỏi tôi về các chủ đề y tế, tôi sẽ trả lời dựa trên kiến thức cơ sở.`,
      timestamp: new Date().toISOString()
    });
  }
};

