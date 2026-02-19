import College from '../models/College.mjs';
import Specialty from '../models/Specialty.mjs';

export const getColleges = async (req, res) => {
    try {
        const { page = 1, limit = 20, region, city, search } = req.query;
        
        const query = {};
        
        if (region) {
            query.region = region;
        }
        
        if (city) {
            query.city = city;
        }
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } }
            ];
        }
        
        const colleges = await College.find(query)
            .populate({
                path: 'specialties',
                select: 'name code description duration'
            })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ name: 1 });
        
        const total = await College.countDocuments(query);
        
        const regions = await College.distinct('region');
        const cities = await College.distinct('city');
        
        res.json({
            success: true,
            colleges,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            filters: {
                regions,
                cities
            }
        });
    } catch (error) {
        console.error('Ошибка при получении колледжей:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении колледжей'
        });
    }
};

export const getCollegeById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const college = await College.findById(id).populate({
            path: 'specialties',
            select: 'name code description duration form klimovTypes'
        });
        
        if (!college) {
            return res.status(404).json({
                success: false,
                message: 'Колледж не найден'
            });
        }
        
        res.json({
            success: true,
            college
        });
    } catch (error) {
        console.error('Ошибка при получении колледжа:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении колледжа'
        });
    }
};

export const getCollegeSpecialties = async (req, res) => {
    try {
        const { id } = req.params;
        
        const specialties = await Specialty.find({ colleges: id })
            .populate('colleges')
            .sort({ name: 1 });
        
        res.json({
            success: true,
            specialties
        });
    } catch (error) {
        console.error('Ошибка при получении специальностей колледжа:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении специальностей колледжа'
        });
    }
};

export const searchCollegesPublic = async (req, res) => {
    try {
        const { search = '', limit = 10 } = req.query;
        
        const query = {};
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } }
            ];
        }
        
        const colleges = await College.find(query)
            .select('name city region')
            .limit(parseInt(limit))
            .sort({ name: 1 });
        
        res.json({
            success: true,
            colleges
        });
    } catch (error) {
        console.error('Ошибка при поиске колледжей:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при поиске колледжей'
        });
    }
};