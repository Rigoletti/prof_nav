import College from '../models/College.mjs';

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
        
        console.log('🔍 Получен запрос на ближайшие колледжи:');
        console.log('📌 Координаты:', { lat, lng });
        console.log('📏 Радиус:', radius, 'км');
        
        if (!lat || !lng) {
            console.log('❌ Ошибка: нет координат');
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

        console.log(`📚 Всего колледжей в базе: ${colleges.length}`);

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
                    'Тюмень': { lat: 57.1522, lng: 65.5272 }
                };

                const cityCoord = cityCoordinates[collegeObj.city];
                if (cityCoord) {
                    // Добавляем небольшую случайную вариацию
                    const variation = 0.05; // около 5 км вариации
                    collegeObj.location = {
                        lat: cityCoord.lat + (Math.random() - 0.5) * variation,
                        lng: cityCoord.lng + (Math.random() - 0.5) * variation
                    };
                    console.log(`📍 Добавлены координаты для ${collegeObj.name}:`, collegeObj.location);
                } else {
                    // Если город не в списке, генерируем случайные координаты
                    collegeObj.location = {
                        lat: 55.0 + (Math.random() - 0.5) * 20,
                        lng: 50.0 + (Math.random() - 0.5) * 40
                    };
                    console.log(`🔄 Случайные координаты для ${collegeObj.name}:`, collegeObj.location);
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

        console.log(`✅ Найдено колледжей в радиусе ${radiusKm}км: ${collegesWithDistance.length}`);
        
        if (collegesWithDistance.length > 0) {
            console.log('📊 Первые 3 колледжа:');
            collegesWithDistance.slice(0, 3).forEach(c => {
                console.log(`   - ${c.name}: ${c.distance} км`);
            });
        } else {
            console.log('⚠️ Колледжи не найдены в указанном радиусе');
            
            // Для отладки покажем несколько колледжей с их расстоянием
            const allWithDistance = collegesWithCoords
                .map(college => {
                    const distance = calculateDistance(
                        latitude, 
                        longitude, 
                        college.location.lat, 
                        college.location.lng
                    );
                    return {
                        name: college.name,
                        city: college.city,
                        distance: Math.round(distance * 10) / 10
                    };
                })
                .sort((a, b) => a.distance - b.distance)
                .slice(0, 5);
            
            console.log('📌 Ближайшие колледжи (вне радиуса):', allWithDistance);
        }

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