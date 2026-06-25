import express from 'express';
import {
    createMaterial,
    getCourseMaterials,
    getMaterialById,
    deleteMaterial,
} from '../controllers/materialController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication shield to all routes
router.use(protect);

// 1. Create a course material (Restricted to Lecturers and Admins)
router.post('/', authorize('lecturer', 'admin'), createMaterial);

// 2. Fetch all materials for a course (Course Members only)
router.get('/course/:courseId', getCourseMaterials);

// 3. Fetch a single material by ID (Course Members only)
router.get('/:id', getMaterialById);

// 4. Delete a material by ID (Restricted to Course Lecturers & Admins)
router.delete('/:id', authorize('lecturer', 'admin'), deleteMaterial);

export default router;
