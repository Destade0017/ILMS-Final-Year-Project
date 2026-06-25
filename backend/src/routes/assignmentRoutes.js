import express from 'express';
import {
    createAssignment,
    getCourseAssignments,
    submitAssignment,
    getMySubmission,
    getAssignmentSubmissions,
    gradeSubmission,
} from '../controllers/assignmentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication shield to all routes
router.use(protect);

// 1. Create an assignment (Restricted to Lecturers and Admins)
router.post('/', authorize('lecturer', 'admin'), createAssignment);

// 2. Fetch assignments for a specific course (Student / Lecturer / Admin members)
router.get('/course/:courseId', getCourseAssignments);

// 3. Submit coursework response (Restricted to Students)
router.post('/:id/submit', authorize('student'), submitAssignment);

// 4. Fetch student's own submission status (Restricted to Students)
router.get('/:id/my-submission', authorize('student'), getMySubmission);

// 5. Fetch all student submissions for an assignment (Restricted to Course Lecturers & Admins)
router.get('/:id/submissions', authorize('lecturer', 'admin'), getAssignmentSubmissions);

// 6. Grade a student's submission (Restricted to Course Lecturers & Admins)
router.put('/submissions/:id/grade', authorize('lecturer', 'admin'), gradeSubmission);

export default router;
