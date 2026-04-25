// backend/services/aiService.mjs
import axios from 'axios';
import dotenv from 'dotenv';
import Specialty from '../models/Specialty.mjs';

// Загружаем переменные окружения
dotenv.config();

// Конфигурация OpenRouter
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = process.env.OPENROUTER_API_KEY;

// Логируем состояние API-ключа (после объявления)
console.log('🔑 API_KEY загружен:', API_KEY ? '✅ Да (' + API_KEY.slice(0, 10) + '...)' : '❌ Нет');

// Промпт для анализа сочинения
const SYSTEM_PROMPT = `Ты — профессиональный психолог-профориентолог для абитуриентов 9-11 классов.
Проанализируй текст, который написал пользователь о себе, своих интересах, увлечениях и характере.

Верни ТОЛЬКО JSON-объект в строгом формате, без лишнего текста:
{
  "traits": ["черта1", "черта2", "черта3", "черта4", "черта5"],
  "klimovTypes": ["manTech", "manHuman", ...],
  "reasoning": "краткое обоснование выбора типов (2-3 предложения)"
}

Возможные типы по Климову (выбери 2-3 наиболее подходящих):
- manNature: интерес к растениям, животным, природе, экологии, биологии
- manTech: интерес к технике, механизмам, ремонту, программированию, компьютерам
- manHuman: интерес к общению, помощи людям, медицине, педагогике, психологии
- manSign: интерес к цифрам, схемам, документам, языкам, математике, анализу данных
- manArt: интерес к творчеству, рисованию, музыке, дизайну, актерству

ВАЖНО: Если пользователь пишет, что НЕ ЛЮБИТ ОБЩАТЬСЯ с людьми, НЕ назначай тип manHuman.

Пример сочинения: "Я очень люблю помогать людям. Всегда выступаю старостой, организую мероприятия в классе. Мне нравятся уроки биологии и химии, хочу стать врачом. В свободное время играю на гитаре и пою."

Пример ответа:
{
  "traits": ["коммуникабельность", "ответственность", "эмпатия", "интерес к биологии", "творческие способности"],
  "klimovTypes": ["manHuman", "manNature", "manArt"],
  "reasoning": "Сочинение показывает склонность к работе с людьми (организация мероприятий), интерес к природе (биология, медицина) и творческие способности (музыка)."
}

Пример сочинения с отрицанием: "Я люблю сидеть за компьютером, писать код, не люблю общаться с людьми"
Пример ответа:
{
  "traits": ["интерес к IT", "аналитическое мышление", "предпочтение работы в одиночестве"],
  "klimovTypes": ["manTech", "manSign"],
  "reasoning": "Пользователь явно указал, что не любит общаться с людьми, но интересуется компьютерами и программированием, что соответствует типам Человек-Техника и Человек-Знаковая система."
}`;

/**
 * Анализирует сочинение пользователя через OpenRouter API
 */
export const analyzeEssay = async (essay) => {
  console.log('🔍 Начинаем анализ сочинения...');
  console.log('📝 Текст:', essay.slice(0, 100) + (essay.length > 100 ? '...' : ''));
  
  if (!API_KEY) {
    console.warn('⚠️ OPENROUTER_API_KEY не настроен, используем fallback-анализ');
    return fallbackAnalysis(essay);
  }

  console.log('✅ API_KEY найден, отправляем запрос в OpenRouter...');

  try {
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: 'qwen/qwen-3.6-plus-preview:free',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: essay.slice(0, 3000) }
        ],
        temperature: 0.3,
        max_tokens: 800
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'ProfNavigator'
        },
        timeout: 20000
      }
    );

    console.log('📡 Ответ от OpenRouter получен, статус:', response.status);
    
    const rawResponse = response.data.choices[0].message.content;
    console.log('📄 Сырой ответ от ИИ:', rawResponse);
    
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('❌ Не удалось извлечь JSON из ответа');
      throw new Error('Не удалось извлечь JSON из ответа ИИ');
    }

    const analysis = JSON.parse(jsonMatch[0]);
    console.log('✅ Разобранный анализ:', analysis);
    
    return {
      traits: analysis.traits || [],
      klimovTypes: analysis.klimovTypes || [],
      reasoning: analysis.reasoning || 'Анализ выполнен на основе вашего текста.'
    };
    
  } catch (error) {
    console.error('❌ Ошибка при вызове OpenRouter API:');
    console.error('Сообщение:', error.message);
    if (error.response) {
      console.error('Статус:', error.response.status);
      console.error('Данные:', JSON.stringify(error.response.data, null, 2));
    }
    console.log('🔄 Используем fallback-анализ');
    return fallbackAnalysis(essay);
  }
};

/**
 * Fallback-анализ на основе ключевых слов (работает без API)
 */
const fallbackAnalysis = (essay) => {
  const text = essay.toLowerCase();
  console.log('📊 Выполняется fallback-анализ для текста:', text);
  
  // Разбиваем на предложения для анализа контекста
  const sentences = text.split(/[.!?]+/);
  
  // Функция для проверки наличия отрицания в предложении
  const hasNegation = (sentence) => {
    const negationWords = ['не люблю', 'не нравится', 'ненавижу', 'не хочу', 'не умею', 'плохо', 'не интересно', 'не общат'];
    return negationWords.some(word => sentence.includes(word));
  };
  
  const klimovScores = {
    manNature: 0,
    manTech: 0,
    manHuman: 0,
    manSign: 0,
    manArt: 0
  };

  // Ключевые слова для каждого типа
  const keywords = {
    manNature: {
      positive: ['природа', 'животные', 'растения', 'сад', 'огород', 'лес', 'экология', 'биология', 'ухаживать', 'цветы', 'питомцы', 'собака', 'кошка', 'ветеринар'],
      negative: ['не природа', 'не животные']
    },
    manTech: {
      positive: ['компьютер', 'программирование', 'код', 'писать код', 'техника', 'ремонт', 'инструмент', 'механизм', 'собирать', 'разбирать', 'робот', 'инженерия', 'математика', 'физика', 'айти', 'it', 'софт', 'железо', 'схема', 'кодить', 'разработка'],
      negative: ['не компьютер', 'не техника', 'не программирование']
    },
    manHuman: {
      positive: ['люди', 'общаться', 'друзья', 'команда', 'учитель', 'врач', 'помогать', 'заботиться', 'дети', 'коллектив', 'общение', 'разговор', 'помощь людям'],
      negative: ['не люблю общаться', 'не люди', 'не общение', 'ненавижу людей', 'не хочу с людьми', 'не работа с людьми', 'не общат']
    },
    manSign: {
      positive: ['цифры', 'схемы', 'чертежи', 'расчёты', 'анализ', 'систематизировать', 'документы', 'языки', 'логика', 'таблицы', 'данные', 'статистика'],
      negative: ['не цифры', 'не схемы']
    },
    manArt: {
      positive: ['рисовать', 'музыка', 'творчество', 'петь', 'танцевать', 'художник', 'дизайн', 'фото', 'сочинять', 'гитара'],
      negative: ['не рисовать', 'не творчество']
    }
  };

  // Анализируем каждое предложение
  for (const sentence of sentences) {
    for (const [type, words] of Object.entries(keywords)) {
      // Проверяем отрицания
      let hasNegative = false;
      for (const neg of words.negative) {
        if (sentence.includes(neg)) {
          hasNegative = true;
          console.log(`⚠️ Найдено отрицание для ${type}: "${neg}"`);
          break;
        }
      }
      
      if (hasNegative) {
        klimovScores[type] -= 50;
        continue;
      }
      
      // Проверяем положительные ключевые слова
      for (const word of words.positive) {
        if (sentence.includes(word)) {
          klimovScores[type] += 20;
          console.log(`✅ Найдено ключевое слово для ${type}: "${word}"`);
        }
      }
    }
  }
  
  // Убираем отрицательные баллы
  for (const type of Object.keys(klimovScores)) {
    klimovScores[type] = Math.max(0, klimovScores[type]);
    klimovScores[type] = Math.min(100, klimovScores[type]);
  }
  
  console.log('📊 Итоговые баллы:', klimovScores);

  // Собираем черты характера
  const traits = [];
  if (text.includes('компьютер') || text.includes('программирование') || text.includes('код')) traits.push('интерес к IT и технологиям');
  if (text.includes('писать код') || text.includes('разработка')) traits.push('любовь к программированию');
  if (text.includes('не люблю общаться') || text.includes('ненавижу людей')) traits.push('предпочтение работы в одиночестве');
  if (text.includes('математика') || text.includes('логика')) traits.push('аналитическое мышление');
  if (text.includes('творчество') || text.includes('рисовать')) traits.push('творческие способности');
  if (text.includes('сидеть') && text.includes('компьютер')) traits.push('усидчивость');
  
  if (traits.length === 0) traits.push('техническая направленность');

  // Определяем топ-3 типа по баллам, исключая manHuman если есть явное отрицание
  let sortedTypes = Object.entries(klimovScores)
    .sort((a, b) => b[1] - a[1]);
  
  // Если есть явное отрицание общения, исключаем manHuman
  if (text.includes('не люблю общаться') || text.includes('ненавижу людей') || text.includes('не общат')) {
    console.log('🚫 Обнаружено отрицание общения, исключаем manHuman');
    sortedTypes = sortedTypes.filter(([type]) => type !== 'manHuman');
  }
  
  const finalTypes = sortedTypes
    .slice(0, 3)
    .filter(entry => entry[1] > 15)
    .map(entry => entry[0]);

  // Если всё равно пусто или только manHuman при отрицании, форсируем manTech
  let resultTypes = finalTypes;
  if (resultTypes.length === 0) {
    console.log('⚠️ Нет подходящих типов, используем manTech как основной');
    resultTypes = ['manTech', 'manSign'];
  }
  
  if (resultTypes.includes('manHuman') && (text.includes('не люблю общаться') || text.includes('не общат'))) {
    console.log('⚠️ manHuman попал в результат несмотря на отрицание, исправляем');
    resultTypes = ['manTech', 'manSign', 'manNature'];
  }

  console.log('🎯 Итоговые типы:', resultTypes);
  console.log('📝 Черты:', traits);

  return {
    traits: traits.slice(0, 5),
    klimovTypes: resultTypes,
    reasoning: `Анализ вашего текста показывает предпочтение к типам: ${resultTypes.join(', ')}. ${traits.join(', ')}.`
  };
};

/**
 * Поиск специальностей по полученным типам Климова
 */
export const findSpecialtiesByKlimovTypes = async (klimovTypes, limit = 20) => {
  if (!klimovTypes || klimovTypes.length === 0) {
    return [];
  }

  console.log('🔍 Ищем специальности по типам:', klimovTypes);

  const specialties = await Specialty.find({
    klimovTypes: { $in: klimovTypes }
  })
    .populate('colleges', 'name city region address')
    .limit(limit)
    .lean();

  console.log(`📚 Найдено специальностей: ${specialties.length}`);

  const specialtiesWithMatch = specialties.map((specialty) => {
    const matchedTypes = specialty.klimovTypes.filter(type => 
      klimovTypes.includes(type)
    );
    
    const matchPercentage = specialty.klimovTypes.length > 0 
      ? Math.round((matchedTypes.length / specialty.klimovTypes.length) * 100)
      : 0;

    return {
      ...specialty,
      matchPercentage,
      isRecommended: matchPercentage >= 50
    };
  });

  specialtiesWithMatch.sort((a, b) => b.matchPercentage - a.matchPercentage);
  return specialtiesWithMatch;
};

/**
 * Полный пайплайн: анализ сочинения + поиск специальностей
 */
export const getRecommendationsFromEssay = async (essay) => {
  const analysis = await analyzeEssay(essay);
  const specialties = await findSpecialtiesByKlimovTypes(analysis.klimovTypes, 20);
  
  return {
    analysis,
    specialties,
    totalFound: specialties.length
  };
};