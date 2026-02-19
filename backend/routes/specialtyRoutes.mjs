import express from 'express';
import { 
    getSpecialties,
    getSpecialtyById,
    saveSpecialty,
    unsaveSpecialty,
    getSavedSpecialties,
    checkSavedStatus,
    clearSavedSpecialties,
    compareSpecialties,
    getRecommendedSpecialties,
    getSpecialtiesForComparison
} from '../controllers/specialtyController.mjs';
import { authenticate } from '../middleware/auth.mjs';

const router = express.Router();

// Публичные маршруты
router.get('/', getSpecialties);
router.get('/compare', compareSpecialties);
router.get('/:id', getSpecialtyById);

// Защищенные маршруты (требуется аутентификация)
router.use(authenticate);

// Избранное
router.post('/save', saveSpecialty);
router.post('/unsave', unsaveSpecialty);
router.get('/saved/list', getSavedSpecialties);
router.post('/saved/check', checkSavedStatus);
router.delete('/saved/clear', clearSavedSpecialties);

// Рекомендации
router.get('/recommendations/list', getRecommendedSpecialties);

// Для сравнения
router.get('/comparison/list', getSpecialtiesForComparison);

export default router;