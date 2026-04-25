// backend/controllers/aiController.mjs
import { getRecommendationsFromEssay } from '../services/aiService.mjs';
import User from '../models/User.mjs';

/**
 * POST /api/ai/match-by-essay
 * Анализирует сочинение и возвращает подходящие специальности
 */
export const matchByEssay = async (req, res) => {
  try {
    const { essay } = req.body;
    const userId = req.user?._id;

    // Валидация
    if (!essay || essay.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Пожалуйста, напишите сочинение длиной не менее 20 символов'
      });
    }

    // Получаем рекомендации
    const { analysis, specialties, totalFound } = await getRecommendationsFromEssay(essay.trim());

    // Сохраняем результат в профиль пользователя
    let savedToProfile = false;
    if (userId && specialties.length > 0) {
      try {
        const user = await User.findById(userId);
        if (user) {
          // Создаём баллы для типов Климова
          const klimovScores = {};
          analysis.klimovTypes.forEach(type => {
            klimovScores[type] = 85;
          });
          
          const allTypes = ['manNature', 'manTech', 'manHuman', 'manSign', 'manArt'];
          allTypes.forEach(type => {
            if (!klimovScores[type]) klimovScores[type] = 25;
          });

          const testResult = {
            testType: 'essay_ai',
            date: new Date(),
            klimovScores,
            primaryKlimovType: analysis.klimovTypes[0],
            recommendedSpecialties: specialties.slice(0, 10).map(s => ({
              specialtyId: s._id,
              name: s.name,
              code: s.code,
              description: s.description,
              collegeName: s.collegeNames?.[0] || s.colleges?.[0]?.name || '',
              matchPercentage: s.matchPercentage,
              matchReasons: [analysis.reasoning],
              klimovTypes: s.klimovTypes
            })),
            essayText: essay.slice(0, 500),
            aiAnalysis: {
              traits: analysis.traits,
              reasoning: analysis.reasoning,
              klimovTypes: analysis.klimovTypes
            }
          };

          user.testResults = user.testResults || [];
          user.testResults.push(testResult);
          await user.save();
          savedToProfile = true;
        }
      } catch (saveError) {
        console.error('Ошибка сохранения результата:', saveError);
      }
    }

    // Формируем ответ для фронтенда
    const responseSpecialties = specialties.slice(0, 12).map(s => ({
      _id: s._id,
      code: s.code,
      name: s.name,
      description: s.description,
      duration: s.duration,
      form: s.form,
      fundingType: s.fundingType,
      educationLevel: s.educationLevel,
      klimovTypes: s.klimovTypes,
      matchPercentage: s.matchPercentage,
      isRecommended: s.matchPercentage >= 50,
      collegeCount: s.colleges?.length || s.collegeNames?.length || 0,
      collegeNames: s.collegeNames || [],
      collegeCities: s.collegeCities || []
    }));

    res.json({
      success: true,
      message: 'Сочинение успешно проанализировано',
      analysis: {
        traits: analysis.traits,
        klimovTypes: analysis.klimovTypes,
        reasoning: analysis.reasoning
      },
      specialties: responseSpecialties,
      totalFound,
      savedToProfile
    });

  } catch (error) {
    console.error('Ошибка при анализе сочинения:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при анализе сочинения. Пожалуйста, попробуйте позже.'
    });
  }
};

/**
 * GET /api/ai/essay-history
 * Возвращает историю анализов сочинений пользователя
 */
export const getEssayHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }

    const essayResults = (user.testResults || []).filter(
      result => result.testType === 'essay_ai'
    );

    res.json({
      success: true,
      history: essayResults.map(result => ({
        id: result._id,
        date: result.date,
        klimovTypes: result.aiAnalysis?.klimovTypes || [],
        traits: result.aiAnalysis?.traits || [],
        preview: result.essayText?.slice(0, 150) + '...',
        recommendedCount: result.recommendedSpecialties?.length || 0
      }))
    });
  } catch (error) {
    console.error('Ошибка при получении истории:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении истории'
    });
  }
};