import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Course from './models/Course.js';

// Load environment variables
dotenv.config();

const dummyCourses = [
    {
        code: 'CSC401',
        title: 'Advanced Web Technologies',
        description: 'Deep dive into modern web engineering architectures. Covers Express.js, MongoDB integration, RESTful APIs, and React single-page app designs.'
    },
    {
        code: 'CSC402',
        title: 'Artificial Intelligence & Machine Learning',
        description: 'Introduction to foundational concepts of AI, search algorithms, neural networks, decision trees, and regression analysis using Python.'
    },
    {
        code: 'CSC403',
        title: 'Database Systems Design & Management',
        description: 'Advanced concepts in relational and non-relational database design, query optimization, indexing, transaction management, and indexing mechanics.'
    },
    {
        code: 'CSC405',
        title: 'Software Engineering Principles',
        description: 'Systematic approach to software development cycles, covering agile methodologies, requirement specification, design patterns, testing, and CI/CD.'
    },
    {
        code: 'CSC407',
        title: 'Computer Networks & Security',
        description: 'Study of network layers, routing protocols, sockets programming, packet analysis, and security mechanisms like SSL/TLS and firewalls.'
    },
    {
        code: 'CSC409',
        title: 'Human-Computer Interaction (HCI)',
        description: 'Design principles for human-centered digital experiences. Covers user research, wireframing, high-fidelity prototyping, accessibility guidelines, and usability testing.'
    },
    {
        code: 'CSC411',
        title: 'Cloud Computing & DevOps',
        description: 'Introduction to cloud infrastructure (AWS/GCP), containerization with Docker, orchestration with Kubernetes, and infrastructure-as-code.'
    },
    {
        code: 'CSC413',
        title: 'Compiler Construction',
        description: 'Theoretical and practical aspects of building compilers: lexical analysis, parsing, semantic checking, intermediate code generation, and optimization.'
    },
    {
        code: 'CSC415',
        title: 'Distributed Systems & Architecture',
        description: 'Design challenges in distributed networks: consensus protocols (Paxos, Raft), replication strategies, system clock synchronization, and microservice mesh.'
    },
    {
        code: 'CSC417',
        title: 'Cyber Security & Cryptography',
        description: 'Exploration of public/private key cryptography, symmetric/asymmetric algorithms, system vulnerabilities, penetration testing, and digital forensics.'
    },
    {
        code: 'CSC419',
        title: 'Mobile Application Development',
        description: 'Practical build methods for mobile applications on iOS and Android platforms, covering native systems, storage, and cross-platform UI frameworks.'
    },
    {
        code: 'CSC421',
        title: 'Blockchain & Smart Contracts',
        description: 'Foundations of decentralized ledgers, consensus mechanisms, cryptography, and writing secure Solidity smart contracts on the Ethereum Virtual Machine.'
    }
];

const seedDB = async () => {
    if (!process.env.MONGO_URI) {
        console.error('Error: MONGO_URI is not defined in your environment variables.');
        process.exit(1);
    }

    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected successfully.');

        // 1. Find or create a lecturer to assign the courses to
        let lecturer = await User.findOne({ role: 'lecturer' });

        if (!lecturer) {
            console.log('No lecturer found in database. Creating a default lecturer...');
            
            // Password will be hashed by pre-save hook in User.js
            lecturer = await User.create({
                name: 'Dr. Sarah Adams',
                email: 'sarah.adams@ilms.edu',
                password: 'securepassword123',
                role: 'lecturer'
            });
            console.log(`Default lecturer created: ${lecturer.email} (Password: securepassword123)`);
        } else {
            console.log(`Using existing lecturer: ${lecturer.name} (${lecturer.email})`);
        }

        // 2. Clear out any existing courses with the same codes to prevent duplication errors
        const courseCodes = dummyCourses.map(c => c.code);
        console.log('Cleaning up existing matching dummy courses...');
        await Course.deleteMany({ code: { $in: courseCodes } });

        // 3. Map lecturer ID to courses
        const coursesToInsert = dummyCourses.map(course => ({
            ...course,
            lecturer: lecturer._id,
            students: []
        }));

        // 4. Insert courses
        console.log(`Inserting ${coursesToInsert.length} dummy courses...`);
        const insertedCourses = await Course.insertMany(coursesToInsert);
        
        console.log('Database seeded successfully! 🎉');
        console.log(`Created ${insertedCourses.length} courses assigned to Lecturer: ${lecturer.name}`);
        
        // Output lists for confirmation
        insertedCourses.forEach(c => {
            console.log(`  - [${c.code}] ${c.title}`);
        });

    } catch (error) {
        console.error('Seeding error:', error);
    } finally {
        // Disconnect from database
        mongoose.connection.close();
        console.log('Database disconnected.');
    }
};

seedDB();
