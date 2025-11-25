import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import dotenv from 'dotenv';
import { HoSoDinhDuong, LichSuTuVan, TheoDoiTienDo } from '../models/index.js';

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

const MEAL_TYPES = ['sang', 'trua', 'chieu', 'toi'];

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

function isMeaningfulText(value) {
  if (!value || typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (trimmed.length < 2) return false;
  if (/^[\d\W_]+$/.test(trimmed)) return false;
  return /[a-zA-ZÀ-ỹ]/.test(trimmed);
}

function sanitizeMeals(meals = []) {
  const validMeals = [];
  const invalidMeals = [];

  meals.forEach((meal = {}, index) => {
    const name = meal.ten_mon || '';
    const normalizedName = typeof name === 'string' ? name.trim() : '';

    if (!isMeaningfulText(normalizedName)) {
      invalidMeals.push({
        index,
        ten_mon: normalizedName,
        reason: 'ten_mon_khong_hop_le'
      });
      return;
    }

    const hasAmount = MEAL_TYPES.some(type => Number(meal[type]) > 0);
    if (!hasAmount) {
      invalidMeals.push({
        index,
        ten_mon: normalizedName,
        reason: 'khong_co_so_luong_hop_le'
      });
      return;
    }

    const normalizedMeal = { ...meal, ten_mon: normalizedName };
    MEAL_TYPES.forEach(type => {
      const amount = Number(meal[type]) || 0;
      normalizedMeal[type] = amount > 0 ? amount : 0;
      const unitKey = `${type}_unit`;
      normalizedMeal[unitKey] = meal[unitKey] || 'gram';
    });

    validMeals.push(normalizedMeal);
  });

  return { validMeals, invalidMeals };
}

function sortByDateDesc(arr = [], dateField) {
  return [...arr].sort((a, b) => {
    const dateA = a?.[dateField] ? new Date(a[dateField]) : null;
    const dateB = b?.[dateField] ? new Date(b[dateField]) : null;
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    return dateB - dateA;
  });
}

function buildPatientSummary(context) {
  if (!context) return null;

  const summary = {};
  if (context.latestHoSo) {
    summary.ho_so = {
      ho_ten: context.latestHoSo.ho_ten,
      gioi_tinh: context.latestHoSo.gioi_tinh,
      tuoi: context.latestHoSo.tuoi,
      chieu_cao: context.latestHoSo.chieu_cao,
      can_nang: context.latestHoSo.can_nang,
      vong_eo: context.latestHoSo.vong_eo,
      mo_co_the: context.latestHoSo.mo_co_the,
      khoi_co: context.latestHoSo.khoi_co,
      nuoc_trong_co_the: context.latestHoSo.nuoc_trong_co_the,
      ngay_tao: context.latestHoSo.ngay_tao
    };
  }

  if (context.latestConsultation) {
    summary.tu_van_gan_nhat = {
      thoi_gian_tu_van: context.latestConsultation.thoi_gian_tu_van,
      ket_qua_cls: context.latestConsultation.ket_qua_cls,
      ke_hoach_dinh_duong: context.latestConsultation.ke_hoach_dinh_duong,
      nhu_cau_calo: context.latestConsultation.nhu_cau_calo,
      muc_tieu_dinh_duong: context.latestConsultation.muc_tieu_dinh_duong,
      muc_do_hoat_dong: context.latestConsultation.muc_do_hoat_dong,
      che_do_an: context.latestConsultation.che_do_an,
      di_ung_thuc_pham: context.latestConsultation.di_ung_thuc_pham,
      ngay_tai_kham: context.latestConsultation.ngay_tai_kham,
      mo_ta_muc_tieu: context.latestConsultation.mo_ta_muc_tieu
    };
  }

  if (context.latestTracking) {
    summary.theo_doi_gan_nhat = {
      ngay_kham: context.latestTracking.ngay_kham,
      can_nang: context.latestTracking.can_nang,
      chieu_cao: context.latestTracking.chieu_cao,
      bmi: context.latestTracking.bmi,
      vong_eo: context.latestTracking.vong_eo,
      vong_nguc: context.latestTracking.vong_nguc,
      vong_dui: context.latestTracking.vong_dui,
      mo_co_the: context.latestTracking.mo_co_the,
      khoi_co: context.latestTracking.khoi_co,
      nuoc_trong_co_the: context.latestTracking.nuoc_trong_co_the,
      ghi_chu: context.latestTracking.ghi_chu
    };
  }

  return Object.keys(summary).length > 0 ? summary : null;
}

function buildPatientContextText(summary) {
  if (!summary) return 'Không có hồ sơ sức khỏe nào được cung cấp.';

  const parts = [];
  if (summary.ho_so) {
    parts.push(
      `Hồ sơ dinh dưỡng gần nhất: chiều cao ${summary.ho_so.chieu_cao || 'N/A'} cm, cân nặng ${summary.ho_so.can_nang || 'N/A'} kg, ` +
      `mỡ cơ thể ${summary.ho_so.mo_co_the || 'N/A'}%, khối cơ ${summary.ho_so.khoi_co || 'N/A'} kg, vòng eo ${summary.ho_so.vong_eo || 'N/A'} cm.`
    );
  }

  if (summary.tu_van_gan_nhat) {
    parts.push(
      `Kết quả tư vấn gần nhất: nhu cầu calo mục tiêu ${summary.tu_van_gan_nhat.nhu_cau_calo || 'N/A'} kcal, mục tiêu ${summary.tu_van_gan_nhat.muc_tieu_dinh_duong || 'chưa xác định'}, ` +
      `chế độ ăn khuyến nghị ${summary.tu_van_gan_nhat.che_do_an || 'chưa có'}, dị ứng: ${summary.tu_van_gan_nhat.di_ung_thuc_pham || 'không ghi nhận'}.`
    );
  }

  if (summary.theo_doi_gan_nhat) {
    const bmiValue = Number(summary.theo_doi_gan_nhat.bmi);
    const bmiText = Number.isFinite(bmiValue) ? bmiValue.toFixed(2) : 'N/A';
    parts.push(
      `Theo dõi tiến độ gần nhất ngày ${summary.theo_doi_gan_nhat.ngay_kham || 'N/A'}: cân nặng ${summary.theo_doi_gan_nhat.can_nang || 'N/A'} kg, BMI ${bmiText}, vòng eo ${summary.theo_doi_gan_nhat.vong_eo || 'N/A'} cm.`
    );
  }

  return parts.join('\n') || 'Không có hồ sơ sức khỏe nào được cung cấp.';
}

async function fetchPatientContext(id_benh_nhan) {
  if (!id_benh_nhan) return null;

  try {
    const [hoSoList, lichSuTuVanList, theoDoiList] = await Promise.all([
      HoSoDinhDuong.findAll({ id_benh_nhan }),
      LichSuTuVan.findAll({ id_benh_nhan }),
      TheoDoiTienDo.findAll({ id_benh_nhan })
    ]);

    const latestHoSo = sortByDateDesc(hoSoList, 'ngay_tao')[0];
    const latestConsultation = sortByDateDesc(lichSuTuVanList, 'thoi_gian_tu_van')[0];
    const latestTracking = sortByDateDesc(theoDoiList, 'ngay_kham')[0];

    return {
      latestHoSo,
      latestConsultation,
      latestTracking,
      hoSoList,
      lichSuTuVanList,
      theoDoiList
    };
  } catch (error) {
    console.error('Không thể lấy dữ liệu hồ sơ bệnh nhân:', error);
    return null;
  }
}

function buildFallbackSuggestions(totalCalories, patientSummary) {
  const suggestions = [];
  const warnings = [];

  if (totalCalories < 1200) {
    warnings.push('Tổng năng lượng thấp hơn 1200 kcal, cần kiểm tra nguy cơ thiếu hụt vi chất.');
  } else if (totalCalories > 2600) {
    warnings.push('Tổng năng lượng cao, xem xét giảm khẩu phần tinh bột và chất béo bão hòa.');
  }

  const bmiValue = Number(patientSummary?.theo_doi_gan_nhat?.bmi);
  if (Number.isFinite(bmiValue)) {
    const bmi = bmiValue;
    if (bmi >= 25) {
      suggestions.push('Ưu tiên món luộc/hấp, giảm 20-30% lượng tinh bột nhanh.');
    } else if (bmi < 18.5) {
      suggestions.push('Tăng thêm bữa phụ giàu đạm và tinh bột phức hợp.');
    }
  } else {
    suggestions.push('Duy trì khẩu phần cân bằng 50% tinh bột phức, 25% đạm nạc, 25% rau củ.');
  }

  if (patientSummary?.tu_van_gan_nhat?.di_ung_thuc_pham) {
    warnings.push(`Tránh các thực phẩm dễ gây dị ứng: ${patientSummary.tu_van_gan_nhat.di_ung_thuc_pham}.`);
  }

  return {
    tong_quan_suc_khoe: patientSummary
      ? 'Gợi ý dựa trên hồ sơ gần nhất, ưu tiên tuân thủ mục tiêu đã được tư vấn.'
      : 'Chưa có hồ sơ sức khỏe, gợi ý dựa trên mức năng lượng tổng quát.',
    phan_tich_nguon_an: totalCalories < 1600
      ? 'Khẩu phần khá nhẹ, cần theo dõi năng lượng để tránh thiếu hụt.'
      : 'Khẩu phần đạt mức năng lượng trung bình, nên cân đối giữa các bữa.',
    de_xuat_che_do_an: suggestions,
    canh_bao: warnings
  };
}

function normalizeAiSuggestions(aiSuggestions, fallbackData, patientSummary) {
  if (
    aiSuggestions &&
    typeof aiSuggestions === 'object' &&
    (aiSuggestions.tong_quan_suc_khoe || aiSuggestions.de_xuat_che_do_an || aiSuggestions.canh_bao)
  ) {
    return aiSuggestions;
  }

  return buildFallbackSuggestions(
    fallbackData?.tong_calo_ngay || 0,
    patientSummary
  );
}

/**
 * Calculate calories using AI
 */
export const calculateCalories = async (req, res) => {
  let sanitizedMeals = [];
  let invalidMeals = [];
  let patientSummary = null;
  let patientContextText = 'Không có hồ sơ sức khỏe nào được cung cấp.';

  try {
    const { meals, id_benh_nhan } = req.body;

    if (!meals || !Array.isArray(meals) || meals.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp danh sách món ăn'
      });
    }

    const validation = sanitizeMeals(meals);
    sanitizedMeals = validation.validMeals;
    invalidMeals = validation.invalidMeals;

    if (sanitizedMeals.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không tìm thấy món ăn hợp lệ để tính toán',
        invalid_meals: invalidMeals
      });
    }

    const patientContext = await fetchPatientContext(id_benh_nhan);
    patientSummary = buildPatientSummary(patientContext);
    patientContextText = buildPatientContextText(patientSummary);

    // Nếu không có API key hợp lệ, trả về lỗi
    if (!hasValidApiKey || !geminiModel) {
      console.warn('⚠️ GEMINI_API_KEY chưa được cấu hình hoặc không hợp lệ');
      const fallbackResult = calculateCaloriesFallback(sanitizedMeals, patientSummary);
      return res.status(200).json({
        success: true,
        data: {
          ...fallbackResult,
          invalid_meals: invalidMeals,
          patient_context: patientSummary,
          warning: 'Hệ thống AI chưa được cấu hình, sử dụng phép tính ước tính.'
        }
      });
    }

    // Chuẩn bị dữ liệu để gửi cho AI
    let mealsDescription = '';
    sanitizedMeals.forEach((meal, index) => {
      const mealName = meal.ten_mon || `Món ${index + 1}`;
      mealsDescription += `\n${index + 1}. ${mealName}:\n`;
      
      MEAL_TYPES.forEach(mealType => {
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
    const prompt = `Bạn là chuyên gia dinh dưỡng. Hãy tính lượng calories (kcal) cho các món ăn sau đây và đưa ra gợi ý chăm sóc sức khỏe.

Danh sách món ăn và lượng tiêu thụ:
${mealsDescription}

Thông tin sức khỏe bệnh nhân tham chiếu:
${patientContextText}

Yêu cầu:
1. Tính calories cho từng món ăn theo từng buổi (sáng, trưa, chiều, tối)
2. Nếu đơn vị không phải gram, hãy ước tính dựa trên đơn vị đó (ví dụ: 1 bát cơm ≈ 200g, 1 ly nước ≈ 250ml)
3. Dựa trên dữ liệu bữa ăn + hồ sơ bệnh nhân, đánh giá tính hợp lý khẩu phần hiện tại và đưa ra cảnh báo nếu cần
4. Trả về kết quả dưới dạng JSON với cấu trúc sau (CHỈ trả về JSON, không có text khác):
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
  ],
  "goi_y_ai": {
    "tong_quan_suc_khoe": "<đánh giá chung>",
    "phan_tich_nguon_an": "<điểm mạnh/yếu khẩu phần>",
    "de_xuat_che_do_an": ["<gợi ý 1>", "<gợi ý 2>"],
    "canh_bao": ["<cảnh báo 1 nếu có>"]
  }
}

Lưu ý:
- Chỉ trả về JSON, không có text giải thích
- Nếu một món không có trong buổi nào, calories của buổi đó = 0
- Sử dụng kiến thức về giá trị dinh dưỡng thực tế của các món ăn Việt Nam
- Ưu tiên bám sát các mục tiêu dinh dưỡng đã ghi nhận (nếu hồ sơ cung cấp)`;

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
      calorieResult = calculateCaloriesFallback(sanitizedMeals, patientSummary);
    }

    // Validate và format response theo format frontend mong đợi
    const caloTheoBua = calorieResult.calo_theo_bua || {};
    
    // Map lại thông tin lượng tiêu thụ từ meals gốc
    // Tìm món ăn theo tên để đảm bảo map đúng (không chỉ dựa vào index)
    const chiTietMon = (calorieResult.chi_tiet || []).map((item) => {
      const tenMonAI = (item.ten_mon || '').toLowerCase().trim();
      // Tìm món ăn gốc theo tên (không phân biệt hoa thường)
      let originalMeal = sanitizedMeals.find(meal => {
        const tenMonGoc = (meal.ten_mon || '').toLowerCase().trim();
        return tenMonGoc === tenMonAI || tenMonAI.includes(tenMonGoc) || tenMonGoc.includes(tenMonAI);
      });
      
      // Nếu không tìm thấy theo tên, dùng index làm fallback
      if (!originalMeal && sanitizedMeals.length > 0) {
        const index = calorieResult.chi_tiet.indexOf(item);
        originalMeal = sanitizedMeals[index] || sanitizedMeals[0];
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
      chi_tiet_mon: chiTietMon,
      goi_y_ai: normalizeAiSuggestions(
        calorieResult.goi_y_ai,
        { tong_calo_ngay: calorieResult.tong_calo_ngay },
        patientSummary
      ),
      invalid_meals: invalidMeals,
      patient_context: patientSummary
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
      const validation = sanitizeMeals(meals || []);
      const fallbackResult = calculateCaloriesFallback(validation.validMeals, patientSummary);
      if (validation.validMeals.length > 0) {
        return res.status(200).json({
          success: true,
          data: {
            ...fallbackResult,
            invalid_meals: validation.invalidMeals,
            patient_context: patientSummary
          },
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
function calculateCaloriesFallback(meals, patientSummary) {
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

    MEAL_TYPES.forEach(mealType => {
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

  const fallbackSummary = {
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
    })),
    goi_y_ai: buildFallbackSuggestions(totalCalories, patientSummary)
  };

  return fallbackSummary;
}

