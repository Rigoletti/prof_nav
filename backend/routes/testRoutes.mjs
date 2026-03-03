// routes/testRoutes.mjs
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
import {
    getHollandTest,
    submitHollandAnswer,
    getHollandResults,
    getHollandProgress,
    getPreviousHollandQuestion
} from '../controllers/hollandController.mjs';
import {
    getYovayshaTest,
    submitYovayshaAnswer,
    getYovayshaResults,
    getYovayshaProgress,
    getPreviousYovayshaQuestion
} from '../controllers/yovayshaController.mjs';
import {
    getYovayshaLaTest,
    submitYovayshaLaAnswer,
    getYovayshaLaResults,
    getYovayshaLaProgress,
    getPreviousYovayshaLaQuestion
} from '../controllers/yovayshaLaController.mjs';
import { authenticate } from '../middleware/auth.mjs';

import {
    getComprehensiveTest,
    submitComprehensiveAnswer,
    getComprehensiveResults,
    getPreviousComprehensiveQuestion
} from '../controllers/comprehensiveTestController.mjs';


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

// Тест Голланда (Холланда)
router.get('/holland/start', authenticate, getHollandTest);
router.post('/holland/answer', authenticate, submitHollandAnswer);
router.post('/holland/previous', authenticate, getPreviousHollandQuestion);
router.get('/holland/results', authenticate, getHollandResults);
router.get('/holland/progress', authenticate, getHollandProgress);

// Тест Я. Йовайши
router.get('/yovaysha/start', authenticate, getYovayshaTest);
router.post('/yovaysha/answer', authenticate, submitYovayshaAnswer);
router.post('/yovaysha/previous', authenticate, getPreviousYovayshaQuestion);
router.get('/yovaysha/results', authenticate, getYovayshaResults);
router.get('/yovaysha/progress', authenticate, getYovayshaProgress);

// Методика Л.А. Йовайши
router.get('/yovayshala/start', authenticate, getYovayshaLaTest);
router.post('/yovayshala/answer', authenticate, submitYovayshaLaAnswer);
router.post('/yovayshala/previous', authenticate, getPreviousYovayshaLaQuestion);
router.get('/yovayshala/results', authenticate, getYovayshaLaResults);
router.get('/yovayshala/progress', authenticate, getYovayshaLaProgress);

// Общие результаты
router.get('/results', authenticate, getTestResults);
router.get('/progress', authenticate, getTestProgress);


// Комплексный тест
router.get('/comprehensive/start', authenticate, getComprehensiveTest);
router.post('/comprehensive/answer', authenticate, submitComprehensiveAnswer);
router.post('/comprehensive/previous', authenticate, getPreviousComprehensiveQuestion);
router.get('/comprehensive/results', authenticate, getComprehensiveResults);
export default router;