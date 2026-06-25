import Assignment from '../models/Assignment.js';
import Submission from '../models/Submission.js';
import Course from '../models/Course.js';
import AssessmentResult from '../models/AssessmentResult.js';

/**
 * @desc    Create a new course assignment
 * @route   POST /api/assignments
 * @access  Private (Lecturer / Admin only)
 */
export const createAssignment = async (req, res) => {
    const { courseId, title, description, dueDate, maxPoints } = req.body;

    try {
        if (!courseId || !title || !description || !dueDate) {
            return res.status(400).json({
                success: false,
                message: 'Please provide courseId, title, description, and dueDate',
            });
        }

        // 1. Verify course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        // 2. Verify lecturer is assigned to this course (Admins bypass check)
        const isOwner = course.lecturer.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Access Denied: You can only create assignments for courses assigned to you',
            });
        }

        // 3. Create assignment
        const assignment = await Assignment.create({
            courseId,
            title,
            description,
            dueDate,
            maxPoints: maxPoints || 100,
        });

        res.status(201).json({
            success: true,
            message: 'Assignment created successfully',
            data: assignment,
        });
    } catch (error) {
        console.error('Create Assignment Error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid Course ID format',
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error creating assignment',
        });
    }
};

/**
 * @desc    Get all assignments for a specific course
 * @route   GET /api/assignments/course/:courseId
 * @access  Private (Course Members only)
 */
export const getCourseAssignments = async (req, res) => {
    const { courseId } = req.params;

    try {
        // 1. Verify course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        // 2. Access Control: Check if user is course student, lecturer, or admin
        const isStudent = course.students.some(sid => sid.toString() === req.user._id.toString());
        const isLecturer = course.lecturer.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isStudent && !isLecturer && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Access Denied: You are not enrolled or assigned to this course',
            });
        }

        // 3. Fetch assignments
        const assignments = await Assignment.find({ courseId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: assignments.length,
            data: assignments,
        });
    } catch (error) {
        console.error('Get Course Assignments Error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid Course ID format',
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server Error fetching assignments',
        });
    }
};

/**
 * @desc    Submit coursework for an assignment
 * @route   POST /api/assignments/:id/submit
 * @access  Private (Student only)
 */
export const submitAssignment = async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    try {
        if (!content) {
            return res.status(400).json({
                success: false,
                message: 'Please provide submission content',
            });
        }

        // 1. Verify assignment exists
        const assignment = await Assignment.findById(id);
        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found',
            });
        }

        // 2. Verify student is enrolled in the course
        const course = await Course.findById(assignment.courseId);
        const isEnrolled = course && course.students.some(sid => sid.toString() === req.user._id.toString());
        if (!isEnrolled) {
            return res.status(403).json({
                success: false,
                message: 'Access Denied: You must be enrolled in the course to submit this assignment',
            });
        }

        // 3. Verify student has not already submitted
        const existingSubmission = await Submission.findOne({
            assignmentId: id,
            studentId: req.user._id,
        });

        if (existingSubmission) {
            return res.status(400).json({
                success: false,
                message: 'You have already submitted this assignment',
            });
        }

        // 4. Create submission record
        const submission = await Submission.create({
            assignmentId: id,
            studentId: req.user._id,
            content,
            status: 'pending',
        });

        res.status(201).json({
            success: true,
            message: 'Assignment submitted successfully',
            data: submission,
        });
    } catch (error) {
        console.error('Submit Assignment Error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid Assignment ID format',
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server Error processing submission',
        });
    }
};

/**
 * @desc    Get student's own submission for an assignment
 * @route   GET /api/assignments/:id/my-submission
 * @access  Private (Student only)
 */
export const getMySubmission = async (req, res) => {
    const { id } = req.params;

    try {
        const submission = await Submission.findOne({
            assignmentId: id,
            studentId: req.user._id,
        }).populate('gradedBy', 'name email');

        if (!submission) {
            return res.status(200).json({
                success: true,
                message: 'No submission found for this assignment',
                data: null,
            });
        }

        res.status(200).json({
            success: true,
            data: submission,
        });
    } catch (error) {
        console.error('Get My Submission Error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid Assignment ID format',
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server Error fetching submission details',
        });
    }
};

/**
 * @desc    Get all submissions for an assignment
 * @route   GET /api/assignments/:id/submissions
 * @access  Private (Lecturer / Admin only)
 */
export const getAssignmentSubmissions = async (req, res) => {
    const { id } = req.params;

    try {
        // 1. Verify assignment exists
        const assignment = await Assignment.findById(id);
        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found',
            });
        }

        // 2. Verify course lecturer permissions (Admins bypass check)
        const course = await Course.findById(assignment.courseId);
        const isOwner = course && course.lecturer.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Access Denied: You are not the lecturer for this course',
            });
        }

        // 3. Fetch submissions and populate student names/emails
        const submissions = await Submission.find({ assignmentId: id })
            .populate('studentId', 'name email')
            .sort({ submittedAt: -1 });

        res.status(200).json({
            success: true,
            count: submissions.length,
            data: submissions,
        });
    } catch (error) {
        console.error('Get Assignment Submissions Error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid Assignment ID format',
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server Error fetching assignment submissions',
        });
    }
};

/**
 * @desc    Grade & leave feedback on a student submission
 * @route   PUT /api/submissions/:id/grade
 * @access  Private (Lecturer / Admin only)
 */
export const gradeSubmission = async (req, res) => {
    const { id } = req.params;
    const { score, feedback } = req.body;

    try {
        if (score === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a grade score',
            });
        }

        // 1. Find the submission
        const submission = await Submission.findById(id);
        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found',
            });
        }

        // 2. Fetch parent assignment & course to check score boundaries and ownership
        const assignment = await Assignment.findById(submission.assignmentId);
        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Parent assignment not found',
            });
        }

        if (score < 0 || score > assignment.maxPoints) {
            return res.status(400).json({
                success: false,
                message: `Grade score must be between 0 and the assignment maximum of ${assignment.maxPoints}`,
            });
        }

        const course = await Course.findById(assignment.courseId);
        const isOwner = course && course.lecturer.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Access Denied: You are not authorized to grade this course work',
            });
        }

        // 3. Update the submission record
        submission.score = score;
        submission.feedback = feedback || '';
        submission.status = 'graded';
        submission.gradedBy = req.user._id;
        await submission.save();

        // 4. SYNC: Automatically create or update the corresponding AssessmentResult record
        // This ensures the student's performance GPA calculations account for this score.
        // We use findOneAndUpdate to avoid duplicates if the lecturer grades it twice.
        await AssessmentResult.findOneAndUpdate(
            {
                studentId: submission.studentId,
                courseId: assignment.courseId,
                type: 'assignment',
                topic: assignment.title,
            },
            {
                studentId: submission.studentId,
                courseId: assignment.courseId,
                lecturerId: req.user._id,
                score: (score / assignment.maxPoints) * 100, // Normalize to percentage (0 - 100) for summary consistency
                type: 'assignment',
                topic: assignment.title,
            },
            { upsert: true, returnDocument: 'after' }
        );

        res.status(200).json({
            success: true,
            message: 'Submission graded and performance records updated successfully',
            data: submission,
        });
    } catch (error) {
        console.error('Grade Submission Error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid Submission ID format',
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server Error grading submission',
        });
    }
};
