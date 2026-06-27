import Course from '../models/Course.js';
import Material from '../models/Material.js';
import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import DiagnosticTest from '../models/DiagnosticTest.js';
import DiagnosticResult from '../models/DiagnosticResult.js';
import Assignment from '../models/Assignment.js';
import Submission from '../models/Submission.js';
import AssessmentResult from '../models/AssessmentResult.js';

/**
 * @desc    Create a new course
 * @route   POST /api/courses
 * @access  Private (Lecturer/Admin only)
 */
export const createCourse = async (req, res) => {
    const { title, code, description } = req.body;

    try {
        if (!title || !code || !description) {
            return res.status(400).json({
                success: false,
                message: 'Please provide course title, code, and description',
            });
        }

        // Check if course code is already registered
        const courseExists = await Course.findOne({ code: code.toUpperCase() });
        if (courseExists) {
            return res.status(400).json({
                success: false,
                message: `Course with code ${code.toUpperCase()} already exists`,
            });
        }

        // The 'lecturer' field is set to the authenticated user ID (from protect middleware)
        const course = await Course.create({
            title,
            code,
            description,
            lecturer: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            data: course,
        });
    } catch (error) {
        console.error('Create Course Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error creating course',
        });
    }
};

/**
 * @desc    Get all courses
 * @route   GET /api/courses
 * @access  Private (All authenticated users)
 */
export const getCourses = async (req, res) => {
    try {
        // Fetch all courses and populate the lecturer's name and email details
        const courses = await Course.find()
            .populate('lecturer', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses,
        });
    } catch (error) {
        console.error('Get Courses Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error fetching courses',
        });
    }
};

/**
 * @desc    Get a single course by ID
 * @route   GET /api/courses/:id
 * @access  Private (All authenticated users)
 */
export const getCourseById = async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch course and populate both the lecturer details and the list of enrolled student details
        const course = await Course.findById(id)
            .populate('lecturer', 'name email')
            .populate('students', 'name email');

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        res.status(200).json({
            success: true,
            data: course,
        });
    } catch (error) {
        console.error('Get Course By ID Error:', error);
        // Cast error for ObjectId failures
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Course not found (invalid ID format)',
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server Error fetching course details',
        });
    }
};

/**
 * @desc    Enroll a student in a course
 * @route   POST /api/courses/:id/enroll
 * @access  Private (Student only)
 */
export const enrollInCourse = async (req, res) => {
    const { id } = req.params;

    try {
        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        // Verify that the student is not already enrolled
        const isEnrolled = course.students.some(studentId => studentId.toString() === req.user._id.toString());
        if (isEnrolled) {
            return res.status(400).json({
                success: false,
                message: 'You are already enrolled in this course',
            });
        }

        // Add the student ID to the course's students array
        course.students.push(req.user._id);
        await course.save();

        res.status(200).json({
            success: true,
            message: `Successfully enrolled in ${course.title} (${course.code})`,
        });
    } catch (error) {
        console.error('Enroll Course Error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Course not found (invalid ID format)',
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server Error during course enrollment',
        });
    }
};

/**
 * @desc    Delete a course and all associated data
 * @route   DELETE /api/courses/:id
 * @access  Private (Admin only)
 */
export const deleteCourse = async (req, res) => {
    const { id } = req.params;

    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access Denied: Only administrators can delete courses',
            });
        }

        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        // CASCADING DELETE LOGIC

        // 1. Delete all materials
        await Material.deleteMany({ courseId: id });

        // 2. Delete all quizzes and their attempts
        const quizzes = await Quiz.find({ courseId: id });
        const quizIds = quizzes.map(q => q._id);
        await QuizAttempt.deleteMany({ quizId: { $in: quizIds } });
        await Quiz.deleteMany({ courseId: id });

        // 3. Delete diagnostic tests and results
        await DiagnosticTest.deleteMany({ courseId: id });
        await DiagnosticResult.deleteMany({ courseId: id });

        // 4. Delete assignments and their submissions
        const assignments = await Assignment.find({ courseId: id });
        const assignmentIds = assignments.map(a => a._id);
        await Submission.deleteMany({ assignment: { $in: assignmentIds } });
        await Assignment.deleteMany({ courseId: id });

        // 5. Delete assessment results
        await AssessmentResult.deleteMany({ courseId: id });

        // 6. Finally, delete the course itself
        await Course.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Course and all associated data permanently deleted',
        });
    } catch (error) {
        console.error('Delete Course Error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Course not found (invalid ID format)',
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server Error during course deletion',
        });
    }
};
