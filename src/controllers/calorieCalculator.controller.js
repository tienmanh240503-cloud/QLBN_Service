import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import dotenv from 'dotenv';

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

// Hàm chuyển đổi đơn vị sang gram
function convertToGram(amount, unit) {
  const unitLower = unit?.toLowerCase() || 'gram';
  const amountNum = parseFloat(amount) || 0;

  const conversionRates = {
    'gram': 1,
    'g': 1,
    'kg': 1000,
    'kilogram': 1000,
    'bát': 200, // Ước tính 1 bát cơm = 200g
    'đĩa': 300, // Ước tính 1 đĩa = 300g
    'ly': 250, // Ước tính 1 ly = 250ml (nước/sữa)
    'cốc': 250,
    'miếng': 100, // Ước tính 1 miếng = 100g
    'phần': 200, // Ước tính 1 phần = 200g
    'cái': 50, // Ước tính 1 cái = 50g
    'quả': 150, // Ước tính 1 quả = 150g
    'lon': 330, // Ước tính 1 lon = 330ml
    'chai': 500, // Ước tính 1 chai = 500ml
  };

  const rate = conversionRates[unitLower] || 1;
  return amountNum * rate;
}

/**
 * Calculate calories using AI
 */
export const calculateCalories = async (req, res) => {
  try {
    const { meals } = req.body;

    if (!meals || !Array.isArray(meals) || meals.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp danh sách món ăn'
      });
    }

    // Nếu không có API key hợp lệ, trả về lỗi
    if (!hasValidApiKey || !geminiModel) {
      console.warn('⚠️ GEMINI_API_KEY chưa được cấu hình hoặc không hợp lệ');
      return res.status(500).json({
        success: false,
        message: 'Hệ thống tính calories chưa được cấu hình. Vui lòng liên hệ quản trị viên.'
      });
    }

    // Chuẩn bị dữ liệu để gửi cho AI
    let mealsDescription = '';
    let totalCaloriesByMeal = {
      sang: 0,
      trua: 0,
      chieu: 0,
      toi: 0
    };

    meals.forEach((meal, index) => {
      const mealName = meal.ten_mon || `Món ${index + 1}`;
      mealsDescription += `\n${index + 1}. ${mealName}:\n`;
      
      ['sang', 'trua', 'chieu', 'toi'].forEach(mealType => {
        const amount = meal[mealType] || 0;
        const unit = meal[`${mealType}_unit`] || 'gram';
        
        if (amount > 0) {
          const mealTypeName = {
            'sang': 'Bữa sáng',
            'trua': 'Bữa trưa',
            'chieu': 'Bữa chiều',
            'toi': 'Bữa tối'
          }[mealType];
          
          mealsDescription += `   - ${mealTypeName}: ${amount} ${unit}\n`;
        }
      });
    });

    // Tạo prompt cho AI
    const prompt = `Bạn là chuyên gia dinh dưỡng. Hãy tính lượng calories (kcal) cho các món ăn sau đây.

Danh sách món ăn và lượng tiêu thụ:
${mealsDescription}

Yêu cầu:
1. Tính calories cho từng món ăn theo từng buổi (sáng, trưa, chiều, tối)
2. Nếu đơn vị không phải gram, hãy ước tính dựa trên đơn vị đó (ví dụ: 1 bát cơm ≈ 200g, 1 ly nước ≈ 250ml)
3. Trả về kết quả dưới dạng JSON với cấu trúc sau (CHỈ trả về JSON, không có text khác):
{
  "tong_calo_ngay": <tổng calories cả ngày>,
  "calo_theo_bua": {
    "sang": <calories bữa sáng>,
    "trua": <calories bữa trưa>,
    "chieu": <calories bữa chiều>,
    "toi": <calories bữa tối>
  },
  "chi_tiet": [
    {
      "ten_mon": "<tên món>",
      "calo_theo_bua": {
        "sang": <calories>,
        "trua": <calories>,
        "chieu": <calories>,
        "toi": <calories>
      }
    }
  ]
}

Lưu ý:
- Chỉ trả về JSON, không có text giải thích
- Nếu một món không có trong buổi nào, calories của buổi đó = 0
- Sử dụng kiến thức về giá trị dinh dưỡng thực tế của các món ăn Việt Nam`;

    // Gọi Gemini API
    const result = await geminiModel.generateContent(prompt);
    const aiResponse = result?.response?.text() || '';

    // Parse JSON từ response
    let calorieResult;
    try {
      // Loại bỏ markdown code blocks nếu có
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : aiResponse;
      calorieResult = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.error('AI Response:', aiResponse);
      
      // Fallback: Tính calories đơn giản dựa trên ước tính
      calorieResult = calculateCaloriesFallback(meals);
    }

    // Validate và format response theo format frontend mong đợi
    const caloTheoBua = calorieResult.calo_theo_bua || {};
    
    // Map lại thông tin lượng tiêu thụ từ meals gốc
    // Tìm món ăn theo tên để đảm bảo map đúng (không chỉ dựa vào index)
    const chiTietMon = (calorieResult.chi_tiet || []).map((item) => {
      const tenMonAI = (item.ten_mon || '').toLowerCase().trim();
      // Tìm món ăn gốc theo tên (không phân biệt hoa thường)
      let originalMeal = meals.find(meal => {
        const tenMonGoc = (meal.ten_mon || '').toLowerCase().trim();
        return tenMonGoc === tenMonAI || tenMonAI.includes(tenMonGoc) || tenMonGoc.includes(tenMonAI);
      });
      
      // Nếu không tìm thấy theo tên, dùng index làm fallback
      if (!originalMeal && meals.length > 0) {
        const index = calorieResult.chi_tiet.indexOf(item);
        originalMeal = meals[index] || meals[0];
      }
      
      originalMeal = originalMeal || {};
      
      return {
        ten_mon: item.ten_mon || originalMeal.ten_mon || '',
        calo_sang: item.calo_theo_bua?.sang || 0,
        calo_trua: item.calo_theo_bua?.trua || 0,
        calo_chieu: item.calo_theo_bua?.chieu || 0,
        calo_toi: item.calo_theo_bua?.toi || 0,
        luong_sang: originalMeal.sang ? `${originalMeal.sang} ${originalMeal.sang_unit || 'gram'}` : '',
        luong_trua: originalMeal.trua ? `${originalMeal.trua} ${originalMeal.trua_unit || 'gram'}` : '',
        luong_chieu: originalMeal.chieu ? `${originalMeal.chieu} ${originalMeal.chieu_unit || 'gram'}` : '',
        luong_toi: originalMeal.toi ? `${originalMeal.toi} ${originalMeal.toi_unit || 'gram'}` : ''
      };
    });
    
    const response = {
      tong_calo_ngay: calorieResult.tong_calo_ngay || 0,
      calo_sang: caloTheoBua.sang || 0,
      calo_trua: caloTheoBua.trua || 0,
      calo_chieu: caloTheoBua.chieu || 0,
      calo_toi: caloTheoBua.toi || 0,
      chi_tiet_mon: chiTietMon
    };

    return res.status(200).json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('❌ Error calculating calories:', error);
    
    // Nếu có lỗi, thử fallback
    try {
      const { meals } = req.body;
      if (meals && Array.isArray(meals)) {
        const fallbackResult = calculateCaloriesFallback(meals);
        return res.status(200).json({
          success: true,
          data: fallbackResult,
          warning: 'Sử dụng phương pháp tính ước tính do lỗi AI'
        });
      }
    } catch (fallbackError) {
      console.error('Fallback calculation error:', fallbackError);
    }

    return res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Có lỗi xảy ra khi tính calories'
    });
  }
};

// Hàm fallback tính calories đơn giản
function calculateCaloriesFallback(meals) {
  // Bảng calories ước tính cho 100g các món ăn phổ biến
  const caloriePer100g = {
    'cơm trắng': 130,
    'cơm': 130,
    'phở': 110,
    'bún': 110,
    'bánh mì': 265,
    'thịt gà': 239,
    'thịt heo': 242,
    'thịt bò': 250,
    'cá': 206,
    'trứng': 155,
    'rau cải': 25,
    'rau': 25,
    'canh': 30,
    'sữa': 42,
    'nước': 0,
  };

  let totalCalories = 0;
  const caloriesByMeal = { sang: 0, trua: 0, chieu: 0, toi: 0 };
  const chiTiet = [];

  meals.forEach(meal => {
    const mealName = (meal.ten_mon || '').toLowerCase();
    let baseCalorie = 150; // Mặc định 150 cal/100g

    // Tìm calories cơ bản
    for (const [key, value] of Object.entries(caloriePer100g)) {
      if (mealName.includes(key)) {
        baseCalorie = value;
        break;
      }
    }

    const mealDetail = {
      ten_mon: meal.ten_mon,
      calo_theo_bua: { sang: 0, trua: 0, chieu: 0, toi: 0 }
    };

    ['sang', 'trua', 'chieu', 'toi'].forEach(mealType => {
      const amount = meal[mealType] || 0;
      const unit = meal[`${mealType}_unit`] || 'gram';
      
      if (amount > 0) {
        const amountInGram = convertToGram(amount, unit);
        const calories = (amountInGram / 100) * baseCalorie;
        mealDetail.calo_theo_bua[mealType] = Math.round(calories);
        caloriesByMeal[mealType] += Math.round(calories);
        totalCalories += Math.round(calories);
      }
    });

    chiTiet.push({
      ...mealDetail,
      luong_sang: meal.sang ? `${meal.sang} ${meal.sang_unit || 'gram'}` : '',
      luong_trua: meal.trua ? `${meal.trua} ${meal.trua_unit || 'gram'}` : '',
      luong_chieu: meal.chieu ? `${meal.chieu} ${meal.chieu_unit || 'gram'}` : '',
      luong_toi: meal.toi ? `${meal.toi} ${meal.toi_unit || 'gram'}` : ''
    });
  });

  return {
    tong_calo_ngay: Math.round(totalCalories),
    calo_theo_bua: {
      sang: Math.round(caloriesByMeal.sang),
      trua: Math.round(caloriesByMeal.trua),
      chieu: Math.round(caloriesByMeal.chieu),
      toi: Math.round(caloriesByMeal.toi)
    },
    chi_tiet: chiTiet.map(item => ({
      ten_mon: item.ten_mon,
      calo_theo_bua: item.calo_theo_bua,
      luong_sang: item.luong_sang,
      luong_trua: item.luong_trua,
      luong_chieu: item.luong_chieu,
      luong_toi: item.luong_toi
    }))
  };
}

