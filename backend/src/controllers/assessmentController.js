import mongoose from 'mongoose';
import AssessmentResult from '../models/AssessmentResult.js';
import Course from '../models/Course.js';
import User from '../models/User.js';

/**
 * @desc    Record a student's assessment result
 * @route   POST /api/assessments
 * @access  Private (Lecturer / Admin only)
 */
export const createAssessmentResult = async (req, res) => {
    const { studentId, courseId, score, type, topic } = req.body;

    try {
        if (!studentId || !courseId || score === undefined || !type) {
            return res.status(400).json({
                success: false,
                message: 'Please provide studentId, courseId, score, and assessment type',
            });
        }

        // 1. Verify student exists and holds student role
        const student = await User.findById(studentId);
        if (!student || student.role !== 'student') {
            return res.status(400).json({
                success: false,
                message: 'Invalid Student ID. User must be a student.',
            });
        }

        // 2. Verify course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        // 3. Verify lecturer is assigned to this course (Admins bypass ownership check)
        const isOwner = course.lecturer.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Access Denied: You can only record grades for courses assigned to you',
            });
        }

        // 4. Verify student is enrolled in this course
        const isEnrolled = course.students.some(sid => sid.toString() === studentId.toString());
        if (!isEnrolled) {
            return res.status(400).json({
                success: false,
                message: 'Student is not enrolled in this course',
            });
        }

        // 5. Create assessment result record
        const result = await AssessmentResult.create({
            studentId,
            courseId,
            lecturerId: req.user._id,
            score,
            type,
            topic: topic || 'General',
        });

        res.status(201).json({
            success: true,
            message: 'Assessment result recorded successfully',
            data: result,
        });
    } catch (error) {
        console.error('Create Assessment Result Error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid Student ID or Course ID format',
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error recording assessment result',
        });
    }
};

/**
 * @desc    Get current student's results
 * @route   GET /api/assessments/me
 * @access  Private (Student only)
 */
export const getStudentResults = async (req, res) => {
    try {
        const results = await AssessmentResult.find({ studentId: req.user._id })
            .populate('courseId', 'title code')
            .populate('lecturerId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: results.length,
            data: results,
        });
    } catch (error) {
        console.error('Get Student Results Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error fetching your results',
        });
    }
};

/**
 * @desc    Get all results for a course
 * @route   GET /api/assessments/course/:courseId
 * @access  Private (Lecturer / Admin only)
 */
export const getCourseResults = async (req, res) => {
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

        // 2. Verify lecturer is assigned to this course (Admins bypass ownership check)
        const isOwner = course.lecturer.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Access Denied: You can only view results for courses assigned to you',
            });
        }

        // 3. Find results, populate student details (name, email) and course metadata
        const results = await AssessmentResult.find({ courseId })
            .populate('studentId', 'name email')
            .populate('courseId', 'title code')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: results.length,
            data: results,
        });
    } catch (error) {
        console.error('Get Course Results Error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Course not found (invalid ID format)',
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server Error fetching course results',
        });
    }
};

/**
 * @desc    Get current student's performance summary (averages per course)
 * @route   GET /api/assessments/summary/me
 * @access  Private (Student only)
 */
export const getMyPerformanceSummary = async (req, res) => {
    try {
        // Run aggregation pipeline to group by courseId, compute the average score,
        // join on the courses collection, and return a clean representation.
        const summary = await AssessmentResult.aggregate([
            // Stage 1: Filter to get results belonging to the logged-in student
            { $match: { studentId: new mongoose.Types.ObjectId(req.user._id) } },
            
            // Stage 2: Group by courseId and compute averages
            {
                $group: {
                    _id: '$courseId',
                    averageScore: { $avg: '$score' },
                    totalAssessments: { $sum: 1 },
                },
            },
            
            // Stage 3: Lookup course titles and codes from the 'courses' collection
            {
                $lookup: {
                    from: 'courses', // Pluralized collection name for Course model
                    localField: '_id',
                    foreignField: '_id',
                    as: 'courseDetails',
                },
            },
            
            // Stage 4: Deconstruct the courseDetails array to get an object
            { $unwind: '$courseDetails' },
            
            // Stage 5: Project clean outputs with rounded average scores
            {
                $project: {
                    _id: 0,
                    courseId: '$_id',
                    courseTitle: '$courseDetails.title',
                    courseCode: '$courseDetails.code',
                    averageScore: { $round: ['$averageScore', 2] },
                    totalAssessments: 1,
                },
            },
            
            // Stage 6: Sort alphabetically by course code
            { $sort: { courseCode: 1 } }
        ]);

        res.status(200).json({
            success: true,
            count: summary.length,
            data: summary,
        });
    } catch (error) {
        console.error('Get Performance Summary Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error calculating your performance summary',
        });
    }
};
