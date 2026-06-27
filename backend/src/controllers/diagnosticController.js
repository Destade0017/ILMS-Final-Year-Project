import DiagnosticTest from '../models/DiagnosticTest.js';
import DiagnosticResult from '../models/DiagnosticResult.js';
import Course from '../models/Course.js';

/**
 * Classify a score (0-100) into a level
 */
const classifyLevel = (score) => {
    if (score >= 80) return 'Advanced';
    if (score >= 50) return 'Intermediate';
    return 'Beginner';
};

/**
 * @desc    Create (or replace) a diagnostic test for a course
 * @route   POST /api/diagnostic
 * @access  Private (Lecturer / Admin only)
 */
export const createDiagnosticTest = async (req, res) => {
    const { courseId, title, description, questions } = req.body;

    try {
        if (!courseId || !questions || questions.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide courseId and at least one question',
            });
        }

        // Verify course exists and requester owns it
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        const isOwner = course.lecturer.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Access Denied: You can only create tests for your own courses',
            });
        }

        // Upsert: replace existing test if one already exists for this course
        const test = await DiagnosticTest.findOneAndUpdate(
            { courseId },
            { courseId, title: title || 'Course Diagnostic Test', description, questions },
            { upsert: true, new: true, runValidators: true }
        );

        res.status(201).json({
            success: true,
            message: 'Diagnostic test created successfully',
            data: test,
        });
    } catch (error) {
        console.error('Create Diagnostic Test Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

/**
 * @desc    Get the diagnostic test for a specific course (questions without correct answers for students)
 * @route   GET /api/diagnostic/course/:courseId
 * @access  Private (All enrolled members)
 */
export const getDiagnosticTest = async (req, res) => {
    const { courseId } = req.params;

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        const test = await DiagnosticTest.findOne({ courseId });
        if (!test) {
            return res.status(404).json({
                success: false,
                message: 'No diagnostic test has been created for this course yet',
            });
        }

        // Strip correct answers before sending to students
        const isLecturer = course.lecturer.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        let responseData;
        if (isLecturer || isAdmin) {
            // Lecturers/Admins see the full test including correct answers
            responseData = test;
        } else {
            // Students only see the questions and options, no correct answer
            responseData = {
                _id: test._id,
                courseId: test.courseId,
                title: test.title,
                description: test.description,
                questions: test.questions.map((q) => ({
                    _id: q._id,
                    questionText: q.questionText,
                    options: q.options,
                })),
            };
        }

        res.status(200).json({ success: true, data: responseData });
    } catch (error) {
        console.error('Get Diagnostic Test Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Submit diagnostic test answers - auto-grade and save student level
 * @route   POST /api/diagnostic/course/:courseId/submit
 * @access  Private (Students only)
 */
export const submitDiagnosticTest = async (req, res) => {
    const { courseId } = req.params;
    const { answers } = req.body; // array of selected indices, e.g. [0, 2, 1, 3]

    try {
        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({ success: false, message: 'Please provide an answers array' });
        }

        // 1. Verify course and enrollment
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        const isEnrolled = course.students.some(
            (sid) => sid.toString() === req.user._id.toString()
        );
        if (!isEnrolled) {
            return res.status(403).json({
                success: false,
                message: 'You must be enrolled in this course to take the diagnostic test',
            });
        }

        // 2. Fetch the test
        const test = await DiagnosticTest.findOne({ courseId });
        if (!test) {
            return res.status(404).json({
                success: false,
                message: 'No diagnostic test found for this course',
            });
        }

        // 3. Validate answer count
        if (answers.length !== test.questions.length) {
            return res.status(400).json({
                success: false,
                message: `Please answer all ${test.questions.length} questions`,
            });
        }

        // 4. Auto-grade
        let correct = 0;
        const breakdown = test.questions.map((q, i) => {
            const isCorrect = Number(answers[i]) === q.correctAnswerIndex;
            if (isCorrect) correct++;
            return {
                questionText: q.questionText,
                yourAnswer: q.options[answers[i]],
                correctAnswer: q.options[q.correctAnswerIndex],
                isCorrect,
            };
        });

        const score = Math.round((correct / test.questions.length) * 100);
        const level = classifyLevel(score);

        // 5. Save / overwrite the student's DiagnosticResult
        const result = await DiagnosticResult.findOneAndUpdate(
            { studentId: req.user._id, courseId },
            { studentId: req.user._id, courseId, score, level, source: 'diagnostic' },
            { upsert: true, new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: `Diagnostic complete! You scored ${score}% and have been classified as ${level}.`,
            data: {
                score,
                level,
                correct,
                total: test.questions.length,
                breakdown,
                result,
            },
        });
    } catch (error) {
        console.error('Submit Diagnostic Test Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

/**
 * @desc    Get the current student's diagnostic result (level) for a course
 * @route   GET /api/diagnostic/course/:courseId/my-result
 * @access  Private (Students only)
 */
export const getMyDiagnosticResult = async (req, res) => {
    const { courseId } = req.params;

    try {
        const result = await DiagnosticResult.findOne({
            studentId: req.user._id,
            courseId,
        });

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'No diagnostic result found. Please take the diagnostic test first.',
            });
        }

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error('Get My Diagnostic Result Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Get all students' diagnostic results for a course (for lecturer view)
 * @route   GET /api/diagnostic/course/:courseId/results
 * @access  Private (Lecturer / Admin only)
 */
export const getCourseResults = async (req, res) => {
    const { courseId } = req.params;

    try {
        const results = await DiagnosticResult.find({ courseId })
            .populate('studentId', 'name email')
            .sort({ createdAt: -1 });

        const summary = {
            total: results.length,
            Beginner: results.filter((r) => r.level === 'Beginner').length,
            Intermediate: results.filter((r) => r.level === 'Intermediate').length,
            Advanced: results.filter((r) => r.level === 'Advanced').length,
        };

        res.status(200).json({ success: true, summary, data: results });
    } catch (error) {
        console.error('Get Course Diagnostic Results Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
