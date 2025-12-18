import OpenAI from 'openai';
import dotenv from 'dotenv';
import { ChuyenNganhDinhDuong } from '../models/index.js';

dotenv.config();

// Kiểm tra API key có được cấu hình không (OpenAI)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY?.trim();
const OPENAI_MODEL = (process.env.OPENAI_MODEL?.trim()) || 'gpt-4o-mini';
const hasValidApiKey = OPENAI_API_KEY && OPENAI_API_KEY.length > 0 && OPENAI_API_KEY !== '';

// Log API key info (masked for security)
if (OPENAI_API_KEY) {
  const maskedKey = OPENAI_API_KEY.length > 8 
    ? `${OPENAI_API_KEY.substring(0, 4)}${'*'.repeat(OPENAI_API_KEY.length - 8)}${OPENAI_API_KEY.substring(OPENAI_API_KEY.length - 4)}`
    : '****';
  console.log('🔑 [nutritionAnalysis] OPENAI_API_KEY:', maskedKey, `(length: ${OPENAI_API_KEY.length})`);
} else {
  console.log('⚠️ [nutritionAnalysis] OPENAI_API_KEY: NOT CONFIGURED');
}

// Khởi tạo OpenAI client (chỉ khi có API key)
const openaiClient = hasValidApiKey ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

/**
 * Phân tích lý do tư vấn dinh dưỡng và gợi ý chuyên ngành dinh dưỡng
 */
export const analyzeNutrition = async (req, res) => {
  try {
    const { ly_do_tu_van, trieu_chung } = req.body;

    // Validate input
    if (!ly_do_tu_van || !ly_do_tu_van.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập lý do tư vấn'
      });
    }

    // Lấy danh sách chuyên ngành dinh dưỡng từ database
    const chuyenNganhList = await ChuyenNganhDinhDuong.getAll();
    
    if (!chuyenNganhList || chuyenNganhList.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Không tìm thấy danh sách chuyên ngành dinh dưỡng'
      });
    }

    // Tạo danh sách chuyên ngành để gửi cho AI
    const chuyenNganhInfo = chuyenNganhList.map(cn => ({
      id: cn.id_chuyen_nganh,
      ten: cn.ten_chuyen_nganh,
      mo_ta: cn.mo_ta || '',
      doi_tuong_phuc_vu: cn.doi_tuong_phuc_vu || ''
    }));

    // Nếu không có API key hợp lệ, trả về gợi ý đơn giản
    if (!hasValidApiKey || !openaiClient) {
      console.warn('⚠️ OPENAI_API_KEY chưa được cấu hình hoặc không hợp lệ');
      
      // Fallback: Gợi ý chuyên ngành đầu tiên
      return res.status(200).json({
        success: true,
        data: {
          suggested_specialties: [chuyenNganhList[0]],
          confidence: 0.5,
          explanation: 'Hệ thống AI chưa được cấu hình. Vui lòng liên hệ quản trị viên.',
          warning: 'Đây là gợi ý mặc định, không phải từ AI'
        }
      });
    }

    // Tạo prompt cho AI
    const nutritionText = trieu_chung && trieu_chung.trim() 
      ? `Lý do tư vấn: ${ly_do_tu_van}\nTriệu chứng: ${trieu_chung}`
      : `Lý do tư vấn: ${ly_do_tu_van}`;

    const prompt = `Bạn là chuyên gia dinh dưỡng AI. Hãy phân tích thông tin sau và gợi ý chuyên ngành dinh dưỡng phù hợp nhất.

Thông tin người cần tư vấn:
${nutritionText}

Danh sách chuyên ngành dinh dưỡng có sẵn trong hệ thống:
${chuyenNganhInfo.map((cn, idx) => `${idx + 1}. ${cn.ten} (ID: ${cn.id})${cn.mo_ta ? ` - ${cn.mo_ta}` : ''}${cn.doi_tuong_phuc_vu ? ` - Đối tượng: ${cn.doi_tuong_phuc_vu}` : ''}`).join('\n')}

Yêu cầu:
1. Phân tích lý do tư vấn và triệu chứng (nếu có)
2. Gợi ý 1-3 chuyên ngành dinh dưỡng phù hợp nhất từ danh sách trên
3. Sắp xếp theo mức độ phù hợp (phù hợp nhất trước)
4. Đánh giá mức độ tự tin (confidence) từ 0-1
5. Giải thích ngắn gọn lý do gợi ý

Trả về kết quả dưới dạng JSON với cấu trúc sau (CHỈ trả về JSON, không có text khác):
{
  "suggested_specialties": [
    {
      "id_chuyen_nganh": "<id chuyên ngành>",
      "ten_chuyen_nganh": "<tên chuyên ngành>",
      "confidence": <số từ 0-1>,
      "ly_do": "<lý do gợi ý ngắn gọn>"
    }
  ],
  "overall_confidence": <tổng thể tự tin từ 0-1>,
  "explanation": "<giải thích tổng quan ngắn gọn>"
}

Lưu ý:
- Chỉ trả về JSON, không có text giải thích khác
- ID chuyên ngành phải khớp với danh sách trên
- Nếu không chắc chắn, confidence thấp hơn
- Tập trung vào các vấn đề dinh dưỡng, chế độ ăn uống, và mục tiêu sức khỏe`;

    // Gọi OpenAI API
    const completion = await openaiClient.chat.completions.create({
      model: OPENAI_MODEL,
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'Bạn là chuyên gia dinh dưỡng. Chỉ trả về JSON hợp lệ theo yêu cầu.' },
        { role: 'user', content: prompt }
      ]
    });
    const aiResponse = completion.choices?.[0]?.message?.content || '';

    // Parse JSON từ response
    let analysisResult;
    try {
      // Loại bỏ markdown code blocks nếu có
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : aiResponse;
      analysisResult = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.error('AI Response:', aiResponse);
      
      // Fallback: Trả về chuyên ngành đầu tiên
      return res.status(200).json({
        success: true,
        data: {
          suggested_specialties: [chuyenNganhList[0]],
          confidence: 0.5,
          explanation: 'Không thể phân tích được phản hồi từ AI. Vui lòng thử lại hoặc chọn chuyên ngành thủ công.',
          warning: 'Đây là gợi ý mặc định'
        }
      });
    }

    // Validate và map lại với dữ liệu thực từ database
    const suggestedSpecialties = [];
    
    if (analysisResult.suggested_specialties && Array.isArray(analysisResult.suggested_specialties)) {
      for (const suggestion of analysisResult.suggested_specialties) {
        // Tìm chuyên ngành trong database theo ID hoặc tên
        const foundSpecialty = chuyenNganhList.find(
          cn => cn.id_chuyen_nganh === suggestion.id_chuyen_nganh || 
                cn.ten_chuyen_nganh.toLowerCase().includes(suggestion.ten_chuyen_nganh?.toLowerCase() || '')
        );
        
        if (foundSpecialty) {
          suggestedSpecialties.push({
            ...foundSpecialty,
            confidence: suggestion.confidence || 0.5,
            ly_do: suggestion.ly_do || '',
            ai_suggested: true
          });
        }
      }
    }

    // Nếu không tìm thấy chuyên ngành nào, trả về chuyên ngành đầu tiên
    if (suggestedSpecialties.length === 0) {
      suggestedSpecialties.push({
        ...chuyenNganhList[0],
        confidence: 0.3,
        ly_do: 'Không thể xác định chuyên ngành phù hợp từ AI',
        ai_suggested: false
      });
    }

    // Response
    return res.status(200).json({
      success: true,
      data: {
        suggested_specialties: suggestedSpecialties,
        overall_confidence: analysisResult.overall_confidence || 0.5,
        explanation: analysisResult.explanation || 'AI đã phân tích và đưa ra gợi ý'
      }
    });

  } catch (error) {
    console.error('❌ Error analyzing nutrition:', error);
    
    // Fallback: Trả về chuyên ngành đầu tiên
    try {
      const chuyenNganhList = await ChuyenNganhDinhDuong.getAll();
      return res.status(200).json({
        success: true,
        data: {
          suggested_specialties: chuyenNganhList.length > 0 ? [chuyenNganhList[0]] : [],
          confidence: 0.3,
          explanation: 'Có lỗi xảy ra khi phân tích. Vui lòng thử lại hoặc chọn chuyên ngành thủ công.',
          warning: 'Đây là gợi ý mặc định do lỗi hệ thống'
        }
      });
    } catch (fallbackError) {
      return res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra khi phân tích dinh dưỡng',
        error: error.message
      });
    }
  }
};

