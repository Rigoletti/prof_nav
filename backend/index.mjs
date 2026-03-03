import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; 
import connectDB from './config/db.mjs';
import authRoutes from './routes/authRoutes.mjs';
import userRoutes from './routes/userRoutes.mjs';
import testRoutes from './routes/testRoutes.mjs';
import specialtyRoutes from './routes/specialtyRoutes.mjs'; 
import collegeRoutes from './routes/collegeRoutes.mjs';
import adminRoutes from './routes/adminRoutes.mjs';
import locationRoutes from './routes/locationRoutes.mjs'; // ДОЛЖНО БЫТЬ!
import { errorHandler } from './middleware/errorHandler.mjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Настройка CORS с учётом credentials
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    exposedHeaders: ['set-cookie']
}));

app.use(cookieParser());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/specialties', specialtyRoutes); 
app.use('/api/colleges', collegeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/location', locationRoutes); // ДОЛЖНО БЫТЬ!

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`📍 Маршрут /api/location/nearby доступен`);
});