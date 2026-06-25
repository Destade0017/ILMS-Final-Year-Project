import express from 'express';
import {
    createQuiz,
    getCourseQuizzes,
    getQuizDetails,
    submitQuiz,
    getQuizAttempts,
    getMyQuizAttempt,
} from '../controllers/quizController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication shield to all routes
router.use(protect);

// 1. Create a quiz (Restricted to Lecturers and Admins)
router.post('/', authorize('lecturer', 'admin'), createQuiz);

// 2. Fetch quizzes for a specific course (Student / Lecturer / Admin members)
router.get('/course/:courseId', getCourseQuizzes);

// 3. Fetch single quiz details (All course members)
router.get('/:id', getQuizDetails);

// 4. Submit coursework answers for a quiz (Restricted to Students)
router.post('/:id/submit', authorize('student'), submitQuiz);

// 5. Fetch all student attempts for a quiz (Restricted to Course Lecturers & Admins)
router.get('/:id/attempts', authorize('lecturer', 'admin'), getQuizAttempts);

// 6. Fetch student's own quiz attempt details (Restricted to Students)
router.get('/:id/my-attempt', authorize('student'), getMyQuizAttempt);

export default router;
