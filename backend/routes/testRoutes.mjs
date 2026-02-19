import express from 'express';
import { 
    getKlimovTest, 
    submitKlimovAnswer,
    getTestResults,
    getTestProgress,
    getPreviousQuestion
} from '../controllers/testController.mjs';
import { 
    getGolomshtokTest,
    submitGolomshtokAnswer,
    getGolomshtokResults,
    getGolomshtokProgress,
    getPreviousGolomshtokQuestion
} from '../controllers/golomshtokController.mjs';
import { authenticate } from '../middleware/auth.mjs';

const router = express.Router();

// Тест Климова
router.get('/klimov/start', authenticate, getKlimovTest);
router.post('/klimov/answer', authenticate, submitKlimovAnswer);
router.post('/klimov/previous', authenticate, getPreviousQuestion);

// Тест Голомштока
router.get('/golomshtok/start', authenticate, getGolomshtokTest);
router.post('/golomshtok/answer', authenticate, submitGolomshtokAnswer);
router.post('/golomshtok/previous', authenticate, getPreviousGolomshtokQuestion);
router.get('/golomshtok/results', authenticate, getGolomshtokResults);
router.get('/golomshtok/progress', authenticate, getGolomshtokProgress);

// Общие результаты
router.get('/results', authenticate, getTestResults);
router.get('/progress', authenticate, getTestProgress);

export default router;