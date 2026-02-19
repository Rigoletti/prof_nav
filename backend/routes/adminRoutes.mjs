import express from 'express';
import { authenticateAdmin } from '../middleware/auth.mjs';
import multer from 'multer';
import {
    createSpecialty,
    updateSpecialty,
    deleteSpecialty,
    createCollege,
    updateCollege,
    deleteCollege,
    getAllColleges,
    getCollegeById,
    searchColleges,
    getStats,
    getUsers,
    updateUserRole,
    getColleges,
    getSpecialtiesAdmin,
    getAnalyticsData
} from '../controllers/adminController.mjs';

import {
    importSpecialties,
    downloadTemplate,
    validateImportFile
} from '../controllers/importController.mjs';


import { forceCleanupGolomshtokData } from '../controllers/golomshtokController.mjs';
const router = express.Router();

// Настройка multer для загрузки файлов
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'application/vnd.oasis.opendocument.spreadsheet',
            'text/csv',
            'application/csv'
        ];
        
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Разрешены только файлы Excel (.xlsx, .xls, .ods) и CSV'));
        }
    }
});




router.post('/cleanup/golomshtok/force', authenticateAdmin, forceCleanupGolomshtokData);



// Импорт специальностей
router.post('/import/specialties', authenticateAdmin, upload.single('file'), importSpecialties);
router.get('/import/template', authenticateAdmin, downloadTemplate);
router.post('/import/validate', authenticateAdmin, upload.single('file'), validateImportFile);

// Специальности
router.post('/specialties', authenticateAdmin, createSpecialty);
router.put('/specialties/:id', authenticateAdmin, updateSpecialty);
router.delete('/specialties/:id', authenticateAdmin, deleteSpecialty);
router.get('/specialties', authenticateAdmin, getSpecialtiesAdmin); // ДОБАВЛЯЕМ ЭТОТ РОУТ

// Колледжи
router.post('/colleges', authenticateAdmin, createCollege);
router.put('/colleges/:id', authenticateAdmin, updateCollege);
router.delete('/colleges/:id', authenticateAdmin, deleteCollege);
router.get('/colleges/all', authenticateAdmin, getColleges); // Для выпадающих списков
router.get('/colleges/search', authenticateAdmin, searchColleges);
router.get('/colleges/:id', authenticateAdmin, getCollegeById);

// Общие роуты
router.get('/stats', authenticateAdmin, getStats);
router.get('/users', authenticateAdmin, getUsers);
router.put('/users/:id/role', authenticateAdmin, updateUserRole);
router.get('/analytics', authenticateAdmin, getAnalyticsData);

// Роут для получения колледжей с пагинацией
router.get('/colleges', authenticateAdmin, getAllColleges);

export default router;