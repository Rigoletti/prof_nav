import express from 'express';
import { 
    register, 
    login, 
    logout, 
    refreshToken, 
    getProfile,
    checkAuth
} from '../controllers/authController.mjs';
import { authenticate } from '../middleware/auth.mjs';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.get('/profile', authenticate, getProfile);
router.get('/check-auth', authenticate, checkAuth);

export default router;