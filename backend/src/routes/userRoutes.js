import express from 'express';
import { getStudents, getLecturers, updateUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to protect these routes
router.use(protect);

router.get('/students', getStudents);
router.get('/lecturers', getLecturers);
router.put('/profile', updateUserProfile);

export default router;
