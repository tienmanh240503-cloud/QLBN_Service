import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import dotenv from 'dotenv';
import { ChuyenKhoa } from '../models/index.js';

dotenv.config();

// Kiểm tra API key có được cấu hình không (Gemini)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim();
const GEMINI_MODEL = (process.env.GEMINI_MODEL?.trim()) || 'gemini-2.0-flash';
const hasValidApiKey = GEMINI_API_KEY && GEMINI_API_KEY.length > 0 && GEMINI_API_KEY !== '';

// Khởi tạo Gemini client (chỉ khi có API key)
const genAI = hasValidApiKey ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

const SAFETY_SETTINGS = [
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const geminiModel = genAI
  ? genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      safetySettings: SAFETY_SETTINGS,
    })
  : null;

/**
 * Phân tích triệu chứng và gợi ý chuyên khoa
 */
export const analyzeSymptoms = async (req, res) => {
  try {
    const { ly_do_kham, trieu_chung } = req.body;

    // Validate input
    if (!ly_do_kham || !ly_do_kham.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập lý do khám'
      });
    }

    // Lấy danh sách chuyên khoa từ database
    const chuyenKhoaList = await ChuyenKhoa.getAll();
    
    if (!chuyenKhoaList || chuyenKhoaList.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Không tìm thấy danh sách chuyên khoa'
      });
    }

    // Tạo danh sách chuyên khoa để gửi cho AI
    const chuyenKhoaInfo = chuyenKhoaList.map(ck => ({
      id: ck.id_chuyen_khoa,
      ten: ck.ten_chuyen_khoa,
      mo_ta: ck.mo_ta || ''
    }));

    // Nếu không có API key hợp lệ, trả về gợi ý đơn giản
    if (!hasValidApiKey || !geminiModel) {
      console.warn('⚠️ GEMINI_API_KEY chưa được cấu hình hoặc không hợp lệ');
      
      // Fallback: Gợi ý chuyên khoa đầu tiên (hoặc có thể làm logic đơn giản hơn)
      return res.status(200).json({
        success: true,
        data: {
          suggested_specialties: [chuyenKhoaList[0]],
          confidence: 0.5,
          explanation: 'Hệ thống AI chưa được cấu hình. Vui lòng liên hệ quản trị viên.',
          warning: 'Đây là gợi ý mặc định, không phải từ AI'
        }
      });
    }

    // Tạo prompt cho AI
    const symptomsText = trieu_chung && trieu_chung.trim() 
      ? `Lý do khám: ${ly_do_kham}\nTriệu chứng: ${trieu_chung}`
      : `Lý do khám: ${ly_do_kham}`;

    const prompt = `Bạn là chuyên gia y tế AI. Hãy phân tích thông tin sau và gợi ý chuyên khoa phù hợp nhất.

Thông tin bệnh nhân:
${symptomsText}

Danh sách chuyên khoa có sẵn trong hệ thống:
${chuyenKhoaInfo.map((ck, idx) => `${idx + 1}. ${ck.ten} (ID: ${ck.id})${ck.mo_ta ? ` - ${ck.mo_ta}` : ''}`).join('\n')}

Yêu cầu:
1. Phân tích lý do khám và triệu chứng (nếu có)
2. Gợi ý 1-3 chuyên khoa phù hợp nhất từ danh sách trên
3. Sắp xếp theo mức độ phù hợp (phù hợp nhất trước)
4. Đánh giá mức độ tự tin (confidence) từ 0-1
5. Giải thích ngắn gọn lý do gợi ý

Trả về kết quả dưới dạng JSON với cấu trúc sau (CHỈ trả về JSON, không có text khác):
{
  "suggested_specialties": [
    {
      "id_chuyen_khoa": "<id chuyên khoa>",
      "ten_chuyen_khoa": "<tên chuyên khoa>",
      "confidence": <số từ 0-1>,
      "reason": "<lý do gợi ý ngắn gọn>"
    }
  ],
  "overall_confidence": <tổng thể tự tin từ 0-1>,
  "explanation": "<giải thích tổng quan ngắn gọn>",
  "urgency_level": "<khẩn_cap/thuong/khong_khan_cap>"
}

Lưu ý:
- Chỉ trả về JSON, không có text giải thích khác
- ID chuyên khoa phải khớp với danh sách trên
- Nếu không chắc chắn, confidence thấp hơn
- Nếu có dấu hiệu khẩn cấp, đánh dấu urgency_level là "khẩn_cap"`;

    // Gọi Gemini API
    const result = await geminiModel.generateContent(prompt);
    const aiResponse = result?.response?.text() || '';

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
      
      // Fallback: Trả về chuyên khoa đầu tiên
      return res.status(200).json({
        success: true,
        data: {
          suggested_specialties: [chuyenKhoaList[0]],
          confidence: 0.5,
          explanation: 'Không thể phân tích được phản hồi từ AI. Vui lòng thử lại hoặc chọn chuyên khoa thủ công.',
          warning: 'Đây là gợi ý mặc định'
        }
      });
    }

    // Validate và map lại với dữ liệu thực từ database
    const suggestedSpecialties = [];
    
    if (analysisResult.suggested_specialties && Array.isArray(analysisResult.suggested_specialties)) {
      for (const suggestion of analysisResult.suggested_specialties) {
        // Tìm chuyên khoa trong database theo ID hoặc tên
        const foundSpecialty = chuyenKhoaList.find(
          ck => ck.id_chuyen_khoa === suggestion.id_chuyen_khoa || 
                ck.ten_chuyen_khoa.toLowerCase().includes(suggestion.ten_chuyen_khoa?.toLowerCase() || '')
        );
        
        if (foundSpecialty) {
          suggestedSpecialties.push({
            ...foundSpecialty,
            confidence: suggestion.confidence || 0.5,
            reason: suggestion.reason || '',
            ai_suggested: true
          });
        }
      }
    }

    // Nếu không tìm thấy chuyên khoa nào, trả về chuyên khoa đầu tiên
    if (suggestedSpecialties.length === 0) {
      suggestedSpecialties.push({
        ...chuyenKhoaList[0],
        confidence: 0.3,
        reason: 'Không thể xác định chuyên khoa phù hợp từ AI',
        ai_suggested: false
      });
    }

    // Response
    return res.status(200).json({
      success: true,
      data: {
        suggested_specialties: suggestedSpecialties,
        overall_confidence: analysisResult.overall_confidence || 0.5,
        explanation: analysisResult.explanation || 'AI đã phân tích và đưa ra gợi ý',
        urgency_level: analysisResult.urgency_level || 'thuong'
      }
    });

  } catch (error) {
    console.error('❌ Error analyzing symptoms:', error);
    
    // Fallback: Trả về chuyên khoa đầu tiên
    try {
      const chuyenKhoaList = await ChuyenKhoa.getAll();
      return res.status(200).json({
        success: true,
        data: {
          suggested_specialties: chuyenKhoaList.length > 0 ? [chuyenKhoaList[0]] : [],
          confidence: 0.3,
          explanation: 'Có lỗi xảy ra khi phân tích. Vui lòng thử lại hoặc chọn chuyên khoa thủ công.',
          warning: 'Đây là gợi ý mặc định do lỗi hệ thống'
        }
      });
    } catch (fallbackError) {
      return res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra khi phân tích triệu chứng',
        error: error.message
      });
    }
  }
};

