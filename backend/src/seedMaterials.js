import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course.js';
import Material from './models/Material.js';

dotenv.config();

const dummyMaterialsData = [
    {
        title: 'Introduction to the Subject',
        description: 'A comprehensive overview to get you started with the basics of this course.',
        contentType: 'text',
        bodyText: '# Welcome to the Course\nThis document covers the foundational concepts. Please read through it carefully to grasp the introductory terminology.\n\n## Key Terms\n- **Concept A**: The fundamental basis of this module.\n- **Concept B**: Important derivative methodology.',
        difficultyLevel: 'easy'
    },
    {
        title: 'Core Concepts Masterclass (Video)',
        description: 'Watch this recording of our guest lecture explaining the core mechanics and algorithms.',
        contentType: 'video',
        fileUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        difficultyLevel: 'medium'
    },
    {
        title: 'Advanced Methodologies & Applications',
        description: 'Detailed research paper outlining advanced applications and current industry challenges.',
        contentType: 'pdf',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        difficultyLevel: 'hard'
    },
    {
        title: 'Quick Reference Cheat Sheet',
        description: 'A handy list of formulas and syntax for quick revision before your exams.',
        contentType: 'pdf',
        fileUrl: 'https://www.orimi.com/pdf-test.pdf',
        difficultyLevel: 'easy'
    },
    {
        title: 'Mid-term Practice Problems',
        description: 'A set of challenging problems to test your understanding of the curriculum so far.',
        contentType: 'text',
        bodyText: '# Practice Problems\nTry to solve these without looking at the textbook.\n1. Implement a binary search tree.\n2. Explain the difference between process and thread.\n3. Write a SQL query with a LEFT JOIN.',
        difficultyLevel: 'medium'
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

        // Distribute materials to the first 3 courses just to have some varied data
        const targetCourses = courses.slice(0, 3);
        
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
