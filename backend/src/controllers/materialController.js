import Material from '../models/Material.js';
import Course from '../models/Course.js';
import AssessmentResult from '../models/AssessmentResult.js';

/**
 * @desc    Create a new course learning material
 * @route   POST /api/materials
 * @access  Private (Lecturer / Admin only)
 */
export const createMaterial = async (req, res) => {
    const { courseId, title, description, contentType, fileUrl, bodyText, difficultyLevel } = req.body;

    try {
        if (!courseId || !title || !description || !contentType) {
            return res.status(400).json({
                success: false,
                message: 'Please provide courseId, title, description, and contentType',
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
                message: 'Access Denied: You can only upload materials for courses assigned to you',
            });
        }

        // 3. Create material
        const material = await Material.create({
            courseId,
            title,
            description,
            contentType,
            fileUrl: (contentType === 'pdf' || contentType === 'video') ? fileUrl : undefined,
            bodyText: contentType === 'text' ? bodyText : undefined,
            difficultyLevel: difficultyLevel || 'medium',
        });

        res.status(201).json({
            success: true,
            message: 'Course material created successfully',
            data: material,
        });
    } catch (error) {
        console.error('Create Material Error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid Course ID format',
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error creating course material',
        });
    }
};

/**
 * @desc    Get all materials for a specific course (with optional difficulty filtering)
 * @route   GET /api/materials/course/:courseId
 * @access  Private (Course Members only)
 */
export const getCourseMaterials = async (req, res) => {
    const { courseId } = req.params;
    const { difficulty } = req.query;

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

        // 3. Build query filter and handle ADAPTIVE ENGINE
        const query = { courseId };
        let adaptiveStats = null;

        if (difficulty) {
            const requestedDiff = difficulty.toLowerCase();
            
            if (requestedDiff === 'adaptive') {
                // Adaptive Engine Logic
                // a. Only run for students (lecturers/admins seeing 'adaptive' should just see all, or we calculate for a specific student if passed, but typically this is student-facing)
                if (isStudent) {
                    // b. Fetch all assessment results for this student in this course
                    const results = await AssessmentResult.find({ 
                        studentId: req.user._id, 
                        courseId: courseId 
                    });

                    let avgScore = 0;
                    let recommendedLevel = 'easy'; // Default if no scores

                    if (results.length > 0) {
                        const totalScore = results.reduce((sum, res) => sum + res.score, 0);
                        avgScore = totalScore / results.length;

                        // c. Threshold Algorithm
                        if (avgScore < 50) {
                            recommendedLevel = 'easy';
                        } else if (avgScore >= 50 && avgScore < 80) {
                            recommendedLevel = 'medium';
                        } else {
                            recommendedLevel = 'hard';
                        }
                    }

                    query.difficultyLevel = recommendedLevel;
                    adaptiveStats = {
                        isAdaptive: true,
                        averageScore: Number(avgScore.toFixed(1)),
                        recommendedLevel,
                        assessmentCount: results.length
                    };
                }
            } else if (['easy', 'medium', 'hard'].includes(requestedDiff)) {
                query.difficultyLevel = requestedDiff;
            } else if (requestedDiff !== 'all') {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid difficulty filter. Must be all, adaptive, easy, medium, or hard',
                });
            }
        }

        // 4. Fetch materials
        const materials = await Material.find(query).sort({ createdAt: -1 });

        const responsePayload = {
            success: true,
            count: materials.length,
            data: materials,
        };

        if (adaptiveStats) {
            responsePayload.adaptiveStats = adaptiveStats;
        }

        res.status(200).json(responsePayload);
    } catch (error) {
        console.error('Get Course Materials Error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid Course ID format',
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server Error fetching course materials',
        });
    }
};

/**
 * @desc    Get a single course material by ID
 * @route   GET /api/materials/:id
 * @access  Private (Course Members only)
 */
export const getMaterialById = async (req, res) => {
    const { id } = req.params;

    try {
        // 1. Find material
        const material = await Material.findById(id);
        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Material not found',
            });
        }

        // 2. Verify parent course access control
        const course = await Course.findById(material.courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Parent course for this material was not found',
            });
        }

        const isStudent = course.students.some(sid => sid.toString() === req.user._id.toString());
        const isLecturer = course.lecturer.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isStudent && !isLecturer && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Access Denied: You do not have permission to view this material',
            });
        }

        res.status(200).json({
            success: true,
            data: material,
        });
    } catch (error) {
        console.error('Get Material By ID Error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid Material ID format',
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server Error fetching material details',
        });
    }
};

/**
 * @desc    Delete a course material
 * @route   DELETE /api/materials/:id
 * @access  Private (Lecturer / Admin only)
 */
export const deleteMaterial = async (req, res) => {
    const { id } = req.params;

    try {
        // 1. Find material
        const material = await Material.findById(id);
        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Material not found',
            });
        }

        // 2. Verify parent course ownership
        const course = await Course.findById(material.courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Parent course for this material was not found',
            });
        }

        const isOwner = course.lecturer.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Access Denied: You can only delete materials for courses assigned to you',
            });
        }

        // 3. Delete material
        await Material.deleteOne({ _id: id });

        res.status(200).json({
            success: true,
            message: 'Material deleted successfully',
        });
    } catch (error) {
        console.error('Delete Material Error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid Material ID format',
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server Error deleting material',
        });
    }
};
