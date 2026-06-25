import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

import User from './models/User.js';
import Course from './models/Course.js';
import Assignment from './models/Assignment.js';
import Submission from './models/Submission.js';

const run = async () => {
    try {
        console.log('Connecting to MONGO_URI...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected!');

        console.log('\n--- USERS ---');
        const users = await User.find({});
        users.forEach(u => {
            console.log(`- [${u._id}] ${u.name} (${u.email}) - Role: ${u.role}`);
        });

        console.log('\n--- COURSES ---');
        const courses = await Course.find({});
        courses.forEach(c => {
            console.log(`- [${c._id}] ${c.code}: ${c.title} (Lecturer: ${c.lecturer})`);
            console.log(`  Enrolled Students count: ${c.students.length}`);
            c.students.forEach(sid => console.log(`    * Student ID: ${sid}`));
        });

        console.log('\n--- ASSIGNMENTS ---');
        const assignments = await Assignment.find({});
        assignments.forEach(a => {
            console.log(`- [${a._id}] ${a.title} (Course: ${a.courseId})`);
        });

        console.log('\n--- SUBMISSIONS ---');
        const submissions = await Submission.find({}).populate('studentId', 'name email');
        submissions.forEach(s => {
            console.log(`- [${s._id}] Submission for ${s.assignmentId} by ${s.studentId?.name || s.studentId} - Status: ${s.status}, Score: ${s.score}`);
        });

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
};

run();
