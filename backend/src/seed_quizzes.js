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

        // Clear existing quizzes, attempts, and quiz assessment results
        await Quiz.deleteMany({});
        await QuizAttempt.deleteMany({});
        await AssessmentResult.deleteMany({ type: 'quiz' });
        console.log('Cleared existing quizzes, attempts, and quiz assessment records.');

        // Find key users
        const lecturer = await User.findOne({ email: 'kunle.ade@ilms.edu' });
        const student = await User.findOne({ email: 'fayoseshadrach@gmail.com' });

        if (!lecturer || !student) {
            console.error('Could not find kunle.ade@ilms.edu or fayoseshadrach@gmail.com.');
            return;
        }

        // Find courses
        const csc405 = await Course.findOne({ code: 'CSC405' });
        const csc407 = await Course.findOne({ code: 'CSC407' });
        const csc417 = await Course.findOne({ code: 'CSC417' });

        if (!csc405 || !csc407 || !csc417) {
            console.error('Could not find courses CSC405, CSC407, or CSC417.');
            return;
        }

        console.log('Seeding quizzes...');

        // 1. CSC405 Quizzes
        // Quiz 1: Already Attempted by student
        const q1 = await Quiz.create({
            courseId: csc405._id,
            title: 'Quiz 1: Software Development Life Cycle (SDLC)',
            description: 'Test your understanding of Agile, Waterfall, and Spiral methodologies.',
            timeLimit: 10,
            questions: [
                {
                    questionText: 'Which SDLC model is characterized by linear, sequential phases?',
                    options: ['Agile', 'Waterfall', 'V-Model', 'Iterative'],
                    correctAnswerIndex: 1 // Waterfall
                },
                {
                    questionText: 'What is the duration of a typical sprint in Scrum?',
                    options: ['1 to 4 weeks', '6 months', '1 day', '1 year'],
                    correctAnswerIndex: 0 // 1 to 4 weeks
                },
                {
                    questionText: 'Which methodology emphasizes customer collaboration over contract negotiation?',
                    options: ['Waterfall', 'Agile Manifesto', 'Spiral model', 'Cleanroom software engineering'],
                    correctAnswerIndex: 1 // Agile Manifesto
                },
                {
                    questionText: 'In the Spiral model, what is evaluated during each loop?',
                    options: ['Coding speed', 'Risk analysis', 'Database index parameters', 'User interface styling'],
                    correctAnswerIndex: 1 // Risk analysis
                }
            ],
            maxPoints: 4
        });

        // Quiz 2: Not Attempted yet
        const q2 = await Quiz.create({
            courseId: csc405._id,
            title: 'Quiz 2: Software Architecture & Design Patterns',
            description: 'Covers architectural styles and Gang of Four (GoF) design patterns.',
            timeLimit: 15,
            questions: [
                {
                    questionText: 'Which design pattern ensures a class has only one instance and provides a global point of access to it?',
                    options: ['Factory Method', 'Observer', 'Singleton', 'Strategy'],
                    correctAnswerIndex: 2 // Singleton
                },
                {
                    questionText: 'What type of pattern is the Model-View-Controller (MVC) pattern?',
                    options: ['Creational pattern', 'Architectural pattern', 'Behavioral pattern', 'Structural pattern'],
                    correctAnswerIndex: 1 // Architectural pattern
                },
                {
                    questionText: 'Which pattern defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified?',
                    options: ['Adapter', 'Observer', 'Decorator', 'Facade'],
                    correctAnswerIndex: 1 // Observer
                }
            ],
            maxPoints: 3
        });

        // 2. CSC407 Quiz
        const q3 = await Quiz.create({
            courseId: csc407._id,
            title: 'Quiz 1: OSI Model & Network Layer Protocols',
            description: 'Test your knowledge on routing protocols, OSI layers, and socket ports.',
            timeLimit: 20,
            questions: [
                {
                    questionText: 'Which layer of the OSI model is responsible for routing packets across networks?',
                    options: ['Data Link Layer', 'Transport Layer', 'Network Layer', 'Session Layer'],
                    correctAnswerIndex: 2 // Network Layer
                },
                {
                    questionText: 'What TCP port is standard for secure HTTP traffic (HTTPS)?',
                    options: ['80', '443', '22', '8080'],
                    correctAnswerIndex: 1 // 443
                },
                {
                    questionText: 'What is the purpose of the Address Resolution Protocol (ARP)?',
                    options: ['Map IP addresses to MAC addresses', 'Encrypt web packets', 'Resolve domain names to IP addresses', 'Control packet collision rate'],
                    correctAnswerIndex: 0 // Map IP addresses to MAC addresses
                }
            ],
            maxPoints: 3
        });

        // 3. CSC417 Quiz
        const q4 = await Quiz.create({
            courseId: csc417._id,
            title: 'Quiz 1: Symmetric vs Asymmetric Cryptography',
            description: 'Covers DES, AES, RSA, and public key infrastructures.',
            timeLimit: 10,
            questions: [
                {
                    questionText: 'Which cryptographic algorithm uses the same key for both encryption and decryption?',
                    options: ['Symmetric encryption', 'Asymmetric encryption', 'Hashing', 'Salting'],
                    correctAnswerIndex: 0 // Symmetric encryption
                },
                {
                    questionText: 'Which of the following is a widely used asymmetric key algorithm?',
                    options: ['AES', 'DES', 'RSA', 'Blowfish'],
                    correctAnswerIndex: 2 // RSA
                }
            ],
            maxPoints: 2
        });

        console.log('Seeding student attempt for Quiz 1...');

        // Student makes a 3/4 score attempt on Quiz 1
        // Q1: Correct (1), Q2: Correct (0), Q3: Correct (1), Q4: Incorrect (0 instead of 1)
        const studentAnswers = [1, 0, 1, 0];
        const score = 3;

        const attempt = await QuizAttempt.create({
            quizId: q1._id,
            studentId: student._id,
            answers: studentAnswers,
            score,
            maxScore: q1.maxPoints,
        });

        // Sync student score to AssessmentResult
        const percentageScore = (score / q1.maxPoints) * 100; // 75%
        await AssessmentResult.create({
            studentId: student._id,
            courseId: csc405._id,
            lecturerId: lecturer._id,
            score: percentageScore,
            type: 'quiz',
            topic: q1.title,
            createdAt: attempt.submittedAt
        });

        console.log('Successfully seeded dummy quizzes and attempts!');
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
};

run();
