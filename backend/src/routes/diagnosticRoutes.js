import express from 'express';
import {
    createDiagnosticTest,
    getDiagnosticTest,
    submitDiagnosticTest,
    getMyDiagnosticResult,
    getCourseResults,
} from '../controllers/diagnosticController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// 1. Create / replace a diagnostic test for a course (Lecturer / Admin)
router.post('/', authorize('lecturer', 'admin'), createDiagnosticTest);

// 2. Get the diagnostic test for a course (all enrolled members)
router.get('/course/:courseId', getDiagnosticTest);

// 3. Submit answers and get classified (Students only)
router.post('/course/:courseId/submit', authorize('student'), submitDiagnosticTest);

// 4. Get my current level result for a course (Students only)
router.get('/course/:courseId/my-result', authorize('student'), getMyDiagnosticResult);

// 5. Get all students' results for a course (Lecturer / Admin)
router.get('/course/:courseId/results', authorize('lecturer', 'admin'), getCourseResults);

export default router;
