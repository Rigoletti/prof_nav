// backend/routes/aiRoutes.mjs
import express from 'express';
import { matchByEssay, getEssayHistory } from '../controllers/aiController.mjs';
import { authenticate } from '../middleware/auth.mjs';

const router = express.Router();

// POST /api/ai/match-by-essay - анализ сочинения
router.post('/match-by-essay', authenticate, matchByEssay);

// GET /api/ai/essay-history - история анализов
router.get('/essay-history', authenticate, getEssayHistory);

export default router;