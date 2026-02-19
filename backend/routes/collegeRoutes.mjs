import express from 'express';
import { 
    getColleges, 
    getCollegeById,
    getCollegeSpecialties,
    searchCollegesPublic
} from '../controllers/collegeController.mjs';

const router = express.Router();

router.get('/', getColleges);
router.get('/:id', getCollegeById);
router.get('/:id/specialties', getCollegeSpecialties);
router.get('/search/public', searchCollegesPublic);
export default router;