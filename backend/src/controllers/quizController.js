import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import Course from '../models/Course.js';
import AssessmentResult from '../models/AssessmentResult.js';

/**
 * @desc    Create a new quiz
 * @route   POST /api/quizzes
 * @access  Private (Lecturer / Admin only)
 */
export const createQuiz = async (req, res) => {
    const { courseId, title, description, timeLimit, questions } = req.body;

    try {
        if (!courseId || !title || !questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide courseId, title, and a non-empty array of questions',
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
                message: 'Access Denied: You can only create quizzes for courses assigned to you',
            });
        }

        // 3. Validate questions structure
        for (const q of questions) {
            if (!q.questionText || !Array.isArray(q.options) || q.options.length < 2 || q.correctAnswerIndex === undefined) {
                return res.status(400).json({
                    success: false,
                    message: 'Each question must have questionText, at least 2 options, and a correctAnswerIndex',
                });
            }
            if (q.correctAnswerIndex < 0 || q.correctAnswerIndex >= q.options.length) {
                return res.status(400).json({
                    success: false,
                    message: `correctAnswerIndex must be a valid option index (0 to ${q.options.length - 1})`,
                });
            }
        }

        // 4. Create Quiz
        const quiz = await Quiz.create({
            courseId,
            title,
            description,
            timeLimit: Number(timeLimit) || 0,
            questions,
            maxPoints: questions.length
        });

        res.status(201).json({
            success: true,
            message: 'Quiz created successfully',
            data: quiz,
        });
    } catch (error) {
        console.error('Create Quiz Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error creating quiz',
        });
    }
};

/**
 * @desc    Get all quizzes for a specific course
 * @route   GET /api/quizzes/course/:courseId
 * @access  Private (Course Members only)
 */
export const getCourseQuizzes = async (req, res) => {
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

        // 2. Check course access
        const isStudent = course.students.some(sid => sid.toString() === req.user._id.toString());
        const isLecturer = course.lecturer.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isStudent && !isLecturer && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Access Denied: You are not enrolled or assigned to this course',
            });
        }

        // 3. Fetch quizzes
        let quizzes = await Quiz.find({ courseId }).sort({ createdAt: -1 });

        // 4. Strip answer keys for students
        if (isStudent) {
            quizzes = quizzes.map(quiz => {
                const quizObj = quiz.toObject();
                quizObj.questions = quizObj.questions.map(q => {
                    delete q.correctAnswerIndex;
                    return q;
                });
                return quizObj;
            });
        }

        res.status(200).json({
            success: true,
            count: quizzes.length,
            data: quizzes,
        });
    } catch (error) {
        console.error('Get Course Quizzes Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error fetching quizzes',
        });
    }
};

/**
 * @desc    Get details of a single quiz
 * @route   GET /api/quizzes/:id
 * @access  Private (Course Members only)
 */
export const getQuizDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found',
            });
        }

        // Verify course access
        const course = await Course.findById(quiz.courseId);
        const isStudent = course && course.students.some(sid => sid.toString() === req.user._id.toString());
        const isLecturer = course && course.lecturer.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isStudent && !isLecturer && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Access Denied: You are not enrolled or assigned to this course',
            });
        }

        const quizObj = quiz.toObject();

        // Strip answer keys for students
        if (isStudent) {
            quizObj.questions = quizObj.questions.map(q => {
                delete q.correctAnswerIndex;
                return q;
            });
        }

        res.status(200).json({
            success: true,
            data: quizObj,
        });
    } catch (error) {
        console.error('Get Quiz Details Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error fetching quiz details',
        });
    }
};

/**
 * @desc    Submit student answers for a quiz
 * @route   POST /api/quizzes/:id/submit
 * @access  Private (Student only)
 */
export const submitQuiz = async (req, res) => {
    const { id } = req.params;
    const { answers } = req.body; // Array of option indices e.g. [0, 1, 3]

    try {
        // 1. Verify quiz exists
        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found',
            });
        }

        // 2. Verify student enrollment
        const course = await Course.findById(quiz.courseId);
        const isEnrolled = course && course.students.some(sid => sid.toString() === req.user._id.toString());
        if (!isEnrolled) {
            return res.status(403).json({
                success: false,
                message: 'Access Denied: You must be enrolled in the course to take this quiz',
            });
        }

        // 3. Verify single attempt
        const existingAttempt = await QuizAttempt.findOne({
            quizId: id,
            studentId: req.user._id,
        });
        if (existingAttempt) {
            return res.status(400).json({
                success: false,
                message: 'You have already attempted this quiz',
            });
        }

        // 4. Validate answers length
        if (!Array.isArray(answers) || answers.length !== quiz.questions.length) {
            return res.status(400).json({
                success: false,
                message: `Invalid request: Please submit answers for all ${quiz.questions.length} questions`,
            });
        }

        // 5. Grade the quiz
        let score = 0;
        quiz.questions.forEach((q, idx) => {
            if (answers[idx] !== null && answers[idx] !== undefined && answers[idx] === q.correctAnswerIndex) {
                score++;
            }
        });

        // 6. Save attempt
        const attempt = await QuizAttempt.create({
            quizId: id,
            studentId: req.user._id,
            answers,
            score,
            maxScore: quiz.maxPoints,
        });

        // 7. Sync score to Academic Assessment Tracker (AssessmentResult)
        // We normalize the score to a percentage (0 to 100) for summary consistency
        const percentageScore = (score / quiz.maxPoints) * 100;
        await AssessmentResult.findOneAndUpdate(
            {
                studentId: req.user._id,
                courseId: quiz.courseId,
                type: 'quiz',
                topic: quiz.title,
            },
            {
                studentId: req.user._id,
                courseId: quiz.courseId,
                lecturerId: course.lecturer,
                score: percentageScore,
                type: 'quiz',
                topic: quiz.title,
            },
            { upsert: true, returnDocument: 'after' }
        );

        res.status(201).json({
            success: true,
            message: 'Quiz submitted and graded successfully',
            data: {
                attempt,
                correctAnswers: quiz.questions.map(q => q.correctAnswerIndex) // Return correct keys to student now that quiz is submitted
            },
        });
    } catch (error) {
        console.error('Submit Quiz Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error processing quiz submission',
        });
    }
};

/**
 * @desc    Get all student attempts for a quiz
 * @route   GET /api/quizzes/:id/attempts
 * @access  Private (Lecturer / Admin only)
 */
export const getQuizAttempts = async (req, res) => {
    const { id } = req.params;

    try {
        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found',
            });
        }

        // Verify lecturer owns the course
        const course = await Course.findById(quiz.courseId);
        const isOwner = course && course.lecturer.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Access Denied: You are not authorized to view attempts for this quiz',
            });
        }

        const attempts = await QuizAttempt.find({ quizId: id })
            .populate('studentId', 'name email')
            .sort({ submittedAt: -1 });

        res.status(200).json({
            success: true,
            count: attempts.length,
            data: attempts,
        });
    } catch (error) {
        console.error('Get Quiz Attempts Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error fetching quiz attempts',
        });
    }
};

/**
 * @desc    Get student's own attempt details for a quiz
 * @route   GET /api/quizzes/:id/my-attempt
 * @access  Private (Student only)
 */
export const getMyQuizAttempt = async (req, res) => {
    const { id } = req.params;

    try {
        const attempt = await QuizAttempt.findOne({
            quizId: id,
            studentId: req.user._id,
        });

        if (!attempt) {
            return res.status(200).json({
                success: true,
                message: 'No attempt found for this quiz',
                data: null,
            });
        }

        // Fetch quiz with answer key for review
        const quiz = await Quiz.findById(id);

        res.status(200).json({
            success: true,
            data: {
                attempt,
                questions: quiz.questions // Includes correctAnswerIndex for self-review
            },
        });
    } catch (error) {
        console.error('Get My Quiz Attempt Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error fetching attempt details',
        });
    }
};
