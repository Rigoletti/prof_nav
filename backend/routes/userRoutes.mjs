import express from 'express';
import { 
    updateProfile, 
    updateTestResults, 
    changePassword 
} from '../controllers/userController.mjs';
import { authenticate } from '../middleware/auth.mjs';

const router = express.Router();

router.put('/profile', authenticate, updateProfile);
router.put('/test-results', authenticate, updateTestResults);
router.put('/change-password', authenticate, changePassword);

export default router;