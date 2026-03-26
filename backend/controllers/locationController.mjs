import College from '../models/College.mjs';

// Стабильный микро-сдвиг по городу и id (вместо Math.random — одинаковый результат на каждом запросе)
const stableOffset = (city, id) => {
    const s = `${city}|${id}`;
    let h = 5381;
    for (let i = 0; i < s.length; i++) {
        h = ((h << 5) + h) + s.charCodeAt(i);
    }
    const latJ = (Math.abs(h) % 2000 - 1000) / 130000;
    const lngJ = (Math.abs(h >> 12) % 2000 - 1000) / 130000;
    return { latJ, lngJ };
};

// «г. Альметьевск», «город Казань» → ключ как в словаре
const normalizeCityKey = (city) => {
    if (!city) return '';
    let s = String(city).trim();
    s = s.replace(/^г\.?\s+/i, '').replace(/^город\s+/i, '').trim();
    return s;
};

// Грубая привязка города вне словаря к точке в пределах РФ (детерминированно по названию)
const approxCoordsForUnknownCity = (city) => {
    const str = (city || 'unknown').trim();
    let h = 5381;
    for (let i = 0; i < str.length; i++) {
        h = ((h << 5) + h) + str.charCodeAt(i);
    }
    return {
        lat: 45 + (Math.abs(h) % 1000) / 1000 * 20,
        lng: 30 + (Math.abs(h >> 10) % 1000) / 1000 * 80
    };
};

// Расчет расстояния между двумя точками по формуле гаверсинуса (в километрах)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Радиус Земли в километрах
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
};

// Получение ближайших колледжей
export const getNearbyColleges = async (req, res) => {
    try {
        const { lat, lng, radius = 50, limit = 20, page = 1 } = req.query;
        
        if (!lat || !lng) {
            return res.status(400).json({
                success: false,
                message: 'Необходимо указать координаты (lat и lng)'
            });
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        const radiusKm = parseFloat(radius);
        const pageSize = parseInt(limit);
        const skip = (parseInt(page) - 1) * pageSize;

        // Получаем ВСЕ колледжи
        let colleges = await College.find().populate({
            path: 'specialties',
            select: 'name code'
        });

        // Если у колледжей нет координат, добавляем тестовые
        const collegesWithCoords = colleges.map(college => {
            const collegeObj = college.toObject();
            
            // Если у колледжа нет координат, генерируем на основе города
            if (!collegeObj.location || !collegeObj.location.lat || !collegeObj.location.lng) {
                // Координаты крупных городов России
                const cityCoordinates = {
                    'Москва': { lat: 55.7558, lng: 37.6173 },
                    'Санкт-Петербург': { lat: 59.9343, lng: 30.3351 },
                    'Новосибирск': { lat: 55.0302, lng: 82.9204 },
                    'Екатеринбург': { lat: 56.8389, lng: 60.6057 },
                    'Казань': { lat: 55.7887, lng: 49.1221 },
                    'Нижний Новгород': { lat: 56.2965, lng: 43.9361 },
                    'Челябинск': { lat: 55.1644, lng: 61.4368 },
                    'Самара': { lat: 53.1959, lng: 50.1002 },
                    'Омск': { lat: 54.9885, lng: 73.3242 },
                    'Ростов-на-Дону': { lat: 47.2357, lng: 39.7015 },
                    'Уфа': { lat: 54.7348, lng: 55.9579 },
                    'Красноярск': { lat: 56.0106, lng: 92.8525 },
                    'Воронеж': { lat: 51.6606, lng: 39.2003 },
                    'Пермь': { lat: 58.0105, lng: 56.2502 },
                    'Волгоград': { lat: 48.7071, lng: 44.5169 },
                    'Краснодар': { lat: 45.0355, lng: 38.9753 },
                    'Саратов': { lat: 51.5336, lng: 46.0342 },
                    'Тюмень': { lat: 57.1522, lng: 65.5272 },
                    'Альметьевск': { lat: 54.9014, lng: 52.2973 },
                    'Иркутск': { lat: 52.2864, lng: 104.305 },
                    'Хабаровск': { lat: 48.4802, lng: 135.0719 },
                    'Ярославль': { lat: 57.6266, lng: 39.8978 },
                    'Ульяновск': { lat: 54.3142, lng: 48.4031 }
                };

                const rawCity = collegeObj.city ? String(collegeObj.city).trim() : '';
                const cityKey = normalizeCityKey(collegeObj.city);
                const cityCoord = cityKey
                    ? (cityCoordinates[cityKey] || cityCoordinates[rawCity])
                    : null;
                const idStr = collegeObj._id ? String(collegeObj._id) : (collegeObj.name || '');

                if (cityCoord) {
                    const { latJ, lngJ } = stableOffset(cityKey, idStr);
                    collegeObj.location = {
                        lat: cityCoord.lat + latJ,
                        lng: cityCoord.lng + lngJ
                    };
                } else {
                    const base = approxCoordsForUnknownCity(cityKey);
                    const { latJ, lngJ } = stableOffset(cityKey || 'unknown', idStr);
                    collegeObj.location = {
                        lat: base.lat + latJ,
                        lng: base.lng + lngJ
                    };
                }
            }
            return collegeObj;
        });

        // Рассчитываем расстояние для каждого колледжа
        const collegesWithDistance = collegesWithCoords
            .map(college => {
                const distance = calculateDistance(
                    latitude, 
                    longitude, 
                    college.location.lat, 
                    college.location.lng
                );
                return {
                    ...college,
                    distance: Math.round(distance * 10) / 10
                };
            })
            .filter(college => college.distance <= radiusKm)
            .sort((a, b) => a.distance - b.distance);

        // Пагинация
        const total = collegesWithDistance.length;
        const paginatedColleges = collegesWithDistance.slice(skip, skip + pageSize);

        res.json({
            success: true,
            colleges: paginatedColleges,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / pageSize),
            userLocation: {
                lat: latitude,
                lng: longitude
            }
        });
    } catch (error) {
        console.error('❌ Ошибка при получении ближайших колледжей:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении ближайших колледжей: ' + error.message
        });
    }
}; 