import express from 'express';
import { 
    getNearbyColleges
} from '../controllers/locationController.mjs';

const router = express.Router();

// Публичный маршрут для получения ближайших колледжей
router.get('/nearby', getNearbyColleges);

export default router;