import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import User from './models/User.js';
import Course from './models/Course.js';
import Assignment from './models/Assignment.js';
import Submission from './models/Submission.js';
import AssessmentResult from './models/AssessmentResult.js';

const run = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected!');

        // Clear existing assignments, submissions, assessment results to clean up
        await Assignment.deleteMany({});
        await Submission.deleteMany({});
        await AssessmentResult.deleteMany({});
        console.log('Cleared existing assignments, submissions, and assessment results.');

        // Find key users
        const lecturer = await User.findOne({ email: 'kunle.ade@ilms.edu' });
        const student = await User.findOne({ email: 'fayoseshadrach@gmail.com' });

        if (!lecturer || !student) {
            console.error('Could not find kunle.ade@ilms.edu or fayoseshadrach@gmail.com. Please run db seed first.');
            return;
        }

        // Find courses owned by lecturer
        const csc405 = await Course.findOne({ code: 'CSC405' });
        const csc407 = await Course.findOne({ code: 'CSC407' });
        const csc417 = await Course.findOne({ code: 'CSC417' });

        if (!csc405 || !csc407 || !csc417) {
            console.error('Could not find courses CSC405, CSC407, or CSC417. Please check your course seed.');
            return;
        }

        console.log('Seeding assignments for courses...');

        // 1. Course CSC405: Software Engineering Principles
        // Assignment 1: Graded
        const a1 = await Assignment.create({
            courseId: csc405._id,
            title: 'Lab 1: Software Requirements Specification (SRS)',
            description: 'Write a comprehensive SRS document for the ILMS project. Follow the IEEE 830 standard. Submit as a github repository link or a text summary of your functional and non-functional requirements.',
            dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000 * 2), // Due 2 days ago
            maxPoints: 100,
        });

        // Assignment 2: Pending Submission
        const a2 = await Assignment.create({
            courseId: csc405._id,
            title: 'Lab 2: Architectural Design Document',
            description: 'Create a system architecture diagram and document the design patterns utilized (e.g. MVC, Singleton, Observer). Submit the link to your Github repository containing the diagrams and architecture description.',
            dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000 * 5), // Due in 5 days
            maxPoints: 50,
        });

        // Assignment 3: Not submitted yet
        const a3 = await Assignment.create({
            courseId: csc405._id,
            title: 'Lab 3: CI/CD Pipeline Implementation',
            description: 'Configure a GitHub Actions workflow to build and test your web application on every push. Submit your .github/workflows/main.yml content or Github repo link.',
            dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000 * 12), // Due in 12 days
            maxPoints: 100,
        });

        // 2. Course CSC407: Computer Networks & Security
        // Assignment 4: Pending review submission
        const a4 = await Assignment.create({
            courseId: csc407._id,
            title: 'Assignment 1: Packet Analysis with Wireshark',
            description: 'Capture a TCP handshake and describe the transition of packet flags (SYN, SYN-ACK, ACK). Submit the detailed sequence diagram and sequence/acknowledgment numbers analysis.',
            dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000 * 3), // Due in 3 days
            maxPoints: 100,
        });

        // 3. Course CSC417: Cyber Security & Cryptography
        // Assignment 5: Not submitted yet
        const a5 = await Assignment.create({
            courseId: csc417._id,
            title: 'Practical: Implement AES Hashing & Salting',
            description: 'Write a Node.js script that securely hashes and salts student passwords. Submit your source code or repository link.',
            dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000 * 9), // Due in 9 days
            maxPoints: 100,
        });

        console.log('Seeding submissions...');

        // Submission 1: Graded by lecturer (A1)
        const sub1 = await Submission.create({
            assignmentId: a1._id,
            studentId: student._id,
            content: 'https://github.com/fayoseshadrach/ilms-srs-document',
            status: 'graded',
            score: 92,
            feedback: 'Excellent requirements breakdown! The UML diagrams are clear and show a good understanding of system boundaries. Keep it up!',
            gradedBy: lecturer._id,
        });

        // Sync to AssessmentResult
        await AssessmentResult.create({
            studentId: student._id,
            courseId: csc405._id,
            lecturerId: lecturer._id,
            score: 92, // (92/100)*100
            type: 'assignment',
            topic: a1.title,
            createdAt: sub1.submittedAt,
        });

        // Submission 2: Pending grading (A2)
        await Submission.create({
            assignmentId: a2._id,
            studentId: student._id,
            content: 'https://github.com/fayoseshadrach/ilms-architecture-design\nImplemented structural diagrams and clean layer architecture description.',
            status: 'pending',
        });

        // Submission 3: Pending grading (A4)
        await Submission.create({
            assignmentId: a4._id,
            studentId: student._id,
            content: 'Here is the TCP sequence analysis:\n1. Client -> Server: [SYN] Seq=0, Win=64240, MSS=1460\n2. Server -> Client: [SYN, ACK] Seq=0, Ack=1, Win=65535, MSS=1460\n3. Client -> Server: [ACK] Seq=1, Ack=1, Win=64240\nConnection established successfully.',
            status: 'pending',
        });

        console.log('Successfully seeded dummy assignments and submissions!');
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
};

run();
