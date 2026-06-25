import express from 'express';
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getCourses,
    assignLecturer,
    removeLecturer,
    getDashboardStats,
    getRecentActivities
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes here are protected and restricted to 'admin' role
router.use(protect);
router.use(authorize('admin'));

// System Analytics & Activities
router.route('/stats').get(getDashboardStats);
router.route('/activities').get(getRecentActivities);

// User Management
router.route('/users')
    .get(getUsers)
    .post(createUser);

router.route('/users/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

// Course Management
router.route('/courses')
    .get(getCourses);

router.route('/courses/:id/assign')
    .put(assignLecturer);

router.route('/courses/:id/remove')
    .put(removeLecturer);

export default router;
