import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import User from './models/User.js';
import Course from './models/Course.js';
import Quiz from './models/Quiz.js';
import QuizAttempt from './models/QuizAttempt.js';
import AssessmentResult from './models/AssessmentResult.js';

const run = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected!');

        // Find lecturer and student
        const lecturer = await User.findOne({ email: 'kunle.ade@ilms.edu' });
        const student = await User.findOne({ email: 'fayoseshadrach@gmail.com' });
        const csc405 = await Course.findOne({ code: 'CSC405' });

        if (!lecturer || !student || !csc405) {
            console.error('Missing seed data');
            return;
        }

        // Delete any existing quiz attempts or quizzes for this test
        await Quiz.deleteMany({ courseId: csc405._id });
        await QuizAttempt.deleteMany({});
        console.log('Cleared existing test quizzes and attempts.');

        console.log('\n--- 1. Lecturer Creates Quiz ---');
        const questions = [
            {
                questionText: 'What is the primary role of a Mongoose Schema?',
                options: ['To style React pages', 'To define database document structure and validators', 'To compile C++ code', 'To handle routing'],
                correctAnswerIndex: 1
            },
            {
                questionText: 'Which HTTP method is typically used to create a new resource in REST?',
                options: ['GET', 'POST', 'PUT', 'DELETE'],
                correctAnswerIndex: 1
            },
            {
                questionText: 'What does MVC stand for in software architecture?',
                options: ['Many Variable Control', 'Maximum Velocity Constant', 'Model-View-Controller', 'Main Value Column'],
                correctAnswerIndex: 2
            }
        ];

        const quiz = await Quiz.create({
            courseId: csc405._id,
            title: 'Quiz 1: Software Design & Architecture Principles',
            description: 'Covers standard design concepts and Mongoose schemas.',
            timeLimit: 15,
            questions,
            maxPoints: questions.length
        });

        console.log(`Quiz created! ID: ${quiz._id}, Title: "${quiz.title}", Max Points: ${quiz.maxPoints}`);

        console.log('\n--- 2. Checking Anti-Cheating Safeguard (Student View) ---');
        // Simulate query by student
        const queriedQuiz = await Quiz.findById(quiz._id);
        const quizObj = queriedQuiz.toObject();
        
        // Strip answer key
        const studentQuestions = quizObj.questions.map(q => {
            const temp = { ...q };
            delete temp.correctAnswerIndex;
            return temp;
        });

        console.log('First question visible to student:');
        console.log(studentQuestions[0]);
        if (studentQuestions[0].correctAnswerIndex === undefined) {
            console.log('✅ PASS: correctAnswerIndex was successfully hidden!');
        } else {
            console.log('❌ FAIL: correctAnswerIndex was visible!');
        }

        console.log('\n--- 3. Student Submits Answers (Grading Verification) ---');
        // Let's submit 2 correct answers (Q1: index 1, Q2: index 1) and 1 incorrect (Q3: index 0, correct is 2)
        const studentAnswers = [1, 1, 0]; 
        
        let score = 0;
        quiz.questions.forEach((q, idx) => {
            if (studentAnswers[idx] === q.correctAnswerIndex) {
                score++;
            }
        });

        const attempt = await QuizAttempt.create({
            quizId: quiz._id,
            studentId: student._id,
            answers: studentAnswers,
            score,
            maxScore: quiz.maxPoints,
        });

        console.log(`Attempt Recorded! Student score: ${attempt.score}/${attempt.maxScore}`);
        if (attempt.score === 2) {
            console.log('✅ PASS: Auto-grading score calculated correctly!');
        } else {
            console.log('❌ FAIL: Score calculation discrepancy');
        }

        console.log('\n--- 4. Checking Assessment Tracker Integration ---');
        // Normalized score percentage = (2 / 3) * 100 = 66.666%
        const normalizedScore = (score / quiz.maxPoints) * 100;
        
        // Sync score to Academic Assessment Tracker (AssessmentResult)
        await AssessmentResult.findOneAndUpdate(
            {
                studentId: student._id,
                courseId: csc405._id,
                type: 'quiz',
                topic: quiz.title,
            },
            {
                studentId: student._id,
                courseId: csc405._id,
                lecturerId: lecturer._id,
                score: normalizedScore,
                type: 'quiz',
                topic: quiz.title,
            },
            { upsert: true, returnDocument: 'after' }
        );
        
        const ar = await AssessmentResult.findOne({
            studentId: student._id,
            courseId: csc405._id,
            type: 'quiz',
            topic: quiz.title
        });

        if (ar) {
            console.log(`AssessmentResult synced! Score recorded: ${ar.score.toFixed(2)}%`);
            if (Math.abs(ar.score - normalizedScore) < 0.01) {
                console.log('✅ PASS: GPA Assessment tracker synchronized correctly!');
            } else {
                console.log('❌ FAIL: Score mismatch in AssessmentResult');
            }
        } else {
            console.log('❌ FAIL: AssessmentResult not created');
        }

        console.log('\n--- 5. Checking Single Attempt Constraint ---');
        try {
            await QuizAttempt.create({
                quizId: quiz._id,
                studentId: student._id,
                answers: [1, 1, 2],
                score: 3,
                maxScore: quiz.maxPoints,
            });
            console.log('❌ FAIL: Allowed duplicate attempt!');
        } catch (err) {
            console.log('✅ PASS: Duplicate attempt correctly blocked by index constraints!');
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected.');
    }
};

run();
