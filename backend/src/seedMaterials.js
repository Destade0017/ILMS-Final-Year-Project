import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course.js';
import Material from './models/Material.js';

dotenv.config();

const dummyMaterialsData = [
    {
        title: 'Course Handbook & Syllabus',
        description: 'Read this first! Covers course objectives, grading, and timetable.',
        contentType: 'text',
        bodyText: '# Course Handbook\n\n## Objectives\nThis course introduces foundational and advanced concepts in the subject area.\n\n## Assessment\n- Assignments: 30%\n- Quizzes: 20%\n- Final Exam: 50%',
        difficultyLevel: 'All'
    },
    {
        title: 'Foundations and Fundamentals (Chapter 1)',
        description: 'An easy-to-read introductory textbook chapter covering the very basics. Start here!',
        contentType: 'pdf',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        difficultyLevel: 'Beginner'
    },
    {
        title: 'Key Terminology Glossary',
        description: 'A comprehensive list of terms and definitions used throughout this module.',
        contentType: 'text',
        bodyText: '# Key Terminology\n- **Algorithm**: A sequence of instructions to solve a problem.\n- **Data Structure**: A way to organize data in a computer so it can be used effectively.\n- **API**: Application Programming Interface — a way for two systems to talk to each other.',
        difficultyLevel: 'Beginner'
    },
    {
        title: 'Core Concepts Masterclass (Video)',
        description: 'A recorded lecture explaining the core mechanics and algorithms at a standard pace.',
        contentType: 'video',
        fileUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        difficultyLevel: 'Intermediate'
    },
    {
        title: 'Mid-term Practice Problems',
        description: 'A set of standard difficulty problems to test your understanding of the curriculum so far.',
        contentType: 'text',
        bodyText: '# Practice Problems\nTry to solve these without looking at the textbook.\n1. Implement a binary search tree.\n2. Explain the difference between a process and a thread.\n3. Write a SQL query with a LEFT JOIN.',
        difficultyLevel: 'Intermediate'
    },
    {
        title: 'Advanced Methodologies & Research Paper',
        description: 'Detailed research paper outlining advanced applications and current industry challenges.',
        contentType: 'pdf',
        fileUrl: 'https://www.orimi.com/pdf-test.pdf',
        difficultyLevel: 'Advanced'
    },
    {
        title: 'Capstone Challenge Task',
        description: 'A highly complex, open-ended problem for advanced students to solve independently.',
        contentType: 'text',
        bodyText: '# Capstone Challenge\nDesign a distributed microservices architecture for a high-traffic e-commerce platform.\n\nYour design must include:\n- API Gateway strategy\n- Database sharding approach\n- Fault tolerance mechanisms\n- A deployment pipeline description',
        difficultyLevel: 'Advanced'
    }
];

const seedMaterials = async () => {
    if (!process.env.MONGO_URI) {
        console.error('Error: MONGO_URI is not defined in your environment variables.');
        process.exit(1);
    }

    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected successfully.');

        // Get all courses
        const courses = await Course.find();
        if (courses.length === 0) {
            console.log('No courses found! Please run the course seeder first.');
            process.exit(1);
        }

        console.log('Clearing old materials...');
        await Material.deleteMany({});

        const materialsToInsert = [];

        // Distribute materials to ALL courses so every course has adaptive data to test
        const targetCourses = courses;
        
        targetCourses.forEach(course => {
            dummyMaterialsData.forEach((materialTemplate, index) => {
                materialsToInsert.push({
                    ...materialTemplate,
                    courseId: course._id,
                });
            });
        });

        console.log(`Inserting ${materialsToInsert.length} dummy materials across ${targetCourses.length} courses...`);
        await Material.insertMany(materialsToInsert);
        
        console.log('Materials seeded successfully! 🎉');

    } catch (error) {
        console.error('Seeding error:', error);
    } finally {
        mongoose.connection.close();
        console.log('Database disconnected.');
    }
};

seedMaterials();
