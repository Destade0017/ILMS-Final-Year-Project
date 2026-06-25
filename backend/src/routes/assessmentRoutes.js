import express from 'express';
import {
    createAssessmentResult,
    getStudentResults,
    getCourseResults,
    getMyPerformanceSummary,
} from '../controllers/assessmentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth shield to all assessment paths
router.use(protect);

// 1. Record an assessment result (Restricted to Lecturers and Admins)
router.post('/', authorize('lecturer', 'admin'), createAssessmentResult);

// 2. Fetch a list of results for a course (Restricted to Lecturers and Admins)
router.get('/course/:courseId', authorize('lecturer', 'admin'), getCourseResults);

// 3. Fetch current student's results list (Restricted to Students)
router.get('/me', authorize('student'), getStudentResults);

// 4. Fetch current student's course performance summary averages (Restricted to Students)
router.get('/summary/me', authorize('student'), getMyPerformanceSummary);

export default router;
