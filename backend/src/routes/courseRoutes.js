import express from 'express';
import {
    createCourse,
    getCourses,
    getCourseById,
    enrollInCourse,
    deleteCourse,
} from '../controllers/courseController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all course endpoints
router.use(protect);

// Publicly available to any authenticated user (Student, Lecturer, Admin)
router.get('/', getCourses);
router.get('/:id', getCourseById);

// Restricted to Lecturers & Admins (Course creation)
router.post('/', authorize('lecturer', 'admin'), createCourse);

// Restricted to Students (Course enrollment)
router.post('/:id/enroll', authorize('student'), enrollInCourse);

// Restricted to Admins (Course deletion)
router.delete('/:id', authorize('admin'), deleteCourse);

export default router;
