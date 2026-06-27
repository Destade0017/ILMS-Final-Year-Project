// Native fetch is available globally in Node 18+
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const API_URL = 'http://localhost:5001/api';

// Utility for fetching
const api = async (endpoint, method = 'GET', body = null, token = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(`${API_URL}${endpoint}`, options);
    const data = await res.json();
    return { status: res.status, data };
};

// Test Runner state
let passed = 0;
let failed = 0;

const assert = (condition, message) => {
    if (condition) {
        console.log(`✅ PASS: ${message}`);
        passed++;
    } else {
        console.error(`❌ FAIL: ${message}`);
        failed++;
    }
};

const runTests = async () => {
    console.log('--- STARTING QA ADAPTIVE ENGINE TESTS ---');
    
    // Connect to DB to clean up previous test runs
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB. Cleaning up old test data...');
    
    await mongoose.connection.collection('users').deleteMany({ email: /@qatest\.com$/ });
    await mongoose.connection.collection('courses').deleteMany({ code: /^QA-/ });
    await mongoose.connection.collection('diagnostictests').deleteMany({ title: /^QA Diagnostic/ });
    await mongoose.connection.collection('diagnosticresults').deleteMany({}); // Clears diagnostic results
    await mongoose.connection.collection('quizzes').deleteMany({ title: /^QA Quiz/ });
    await mongoose.connection.collection('quizattempts').deleteMany({});
    
    console.log('Clean up done. Registering users...');

    // 1. Register Lecturer
    const lecRes = await api('/auth/register', 'POST', {
        name: 'QA Lecturer', email: 'lecturer@qatest.com', password: 'password123', role: 'lecturer'
    });
    const lecToken = lecRes.data.token;

    // 2. Register Students
    const students = {};
    for (let i = 1; i <= 5; i++) {
        const sRes = await api('/auth/register', 'POST', {
            name: `QA Student ${i}`, email: `student${i}@qatest.com`, password: 'password123', role: 'student'
        });
        students[`student${i}`] = { id: sRes.data.data._id, token: sRes.data.token };
    }

    // 3. Create Course
    const courseRes = await api('/courses', 'POST', {
        title: 'QA Adaptive Course', code: 'QA-101', description: 'Testing adaptive engine'
    }, lecToken);
    const courseId = courseRes.data.data._id;

    // 4. Enroll Students
    for (const key in students) {
        await api(`/courses/${courseId}/enroll`, 'POST', null, students[key].token);
    }

    // 5. Create Diagnostic Test (4 Questions -> each worth 25%)
    const diagQuestions = [
        { questionText: 'Q1', options: ['A', 'B', 'C', 'D'], correctAnswerIndex: 0 },
        { questionText: 'Q2', options: ['A', 'B', 'C', 'D'], correctAnswerIndex: 1 },
        { questionText: 'Q3', options: ['A', 'B', 'C', 'D'], correctAnswerIndex: 2 },
        { questionText: 'Q4', options: ['A', 'B', 'C', 'D'], correctAnswerIndex: 3 }
    ];
    await api('/diagnostic', 'POST', {
        courseId, title: 'QA Diagnostic', description: 'Test', questions: diagQuestions
    }, lecToken);

    console.log('\n--- CATEGORY 1: DIAGNOSTIC FLOW ---');
    // TC1.01: Score 100% (Answers: [0, 1, 2, 3])
    let s1Res = await api(`/diagnostic/course/${courseId}/submit`, 'POST', { answers: [0, 1, 2, 3] }, students.student1.token);
    assert(s1Res.data.data.level === 'Advanced', `TC1.01: Score 100% gets Advanced. Actual: ${s1Res.data.data?.level}`);

    // TC1.02: Score 50% (Answers: [0, 1, 0, 0])
    let s2Res = await api(`/diagnostic/course/${courseId}/submit`, 'POST', { answers: [0, 1, 0, 0] }, students.student2.token);
    assert(s2Res.data.data.level === 'Intermediate', `TC1.02: Score 50% gets Intermediate. Actual: ${s2Res.data.data?.level}`);

    // TC1.03: Score 75% (Answers: [0, 1, 2, 0])
    let s3Res = await api(`/diagnostic/course/${courseId}/submit`, 'POST', { answers: [0, 1, 2, 0] }, students.student3.token);
    assert(s3Res.data.data.level === 'Intermediate', `TC1.03: Score 75% gets Intermediate. Actual: ${s3Res.data.data?.level}`);

    // TC1.05: Score 0% (Answers: [1, 2, 3, 0])
    let s4Res = await api(`/diagnostic/course/${courseId}/submit`, 'POST', { answers: [1, 2, 3, 0] }, students.student4.token);
    assert(s4Res.data.data.level === 'Beginner', `TC1.05: Score 0% gets Beginner. Actual: ${s4Res.data.data?.level}`);

    // TC1.06: Retake diagnostic
    let s1Retake = await api(`/diagnostic/course/${courseId}/submit`, 'POST', { answers: [1, 2, 3, 0] }, students.student1.token);
    assert(s1Retake.data.data.level === 'Beginner', `TC1.06: Retake updates level (100% -> 0% Beginner). Actual: ${s1Retake.data.data?.level}`);
    
    // Set student1 back to Advanced for later tests
    await api(`/diagnostic/course/${courseId}/submit`, 'POST', { answers: [0, 1, 2, 3] }, students.student1.token);

    console.log('\n--- CATEGORY 3: QUIZ ROLLING AVERAGE ---');
    // Create Quizzes
    const createQuiz = async (numQuestions) => {
        const questions = Array.from({ length: numQuestions }, (_, i) => ({
            questionText: `Quiz Q${i+1}`, options: ['A', 'B', 'C', 'D'], correctAnswerIndex: 0
        }));
        const qRes = await api(`/quizzes/course/${courseId}`, 'POST', {
            title: `QA Quiz ${numQuestions}Q`, description: 'Test Quiz', questions
        }, lecToken);
        return qRes.data.data._id;
    };

    const quiz1Id = await createQuiz(2); // 2 questions
    const quiz2Id = await createQuiz(2); // 2 questions
    const quiz3Id = await createQuiz(2); // 2 questions

    // TC3.01: Beginner (student4, 0%) takes Quiz 1 and scores 100% (Average = 100%). Expected: Advanced
    let qRes = await api(`/quizzes/${quiz1Id}/submit`, 'POST', { answers: [0, 0] }, students.student4.token);
    let levelUpdate = qRes.data.data.levelUpdate;
    assert(levelUpdate && levelUpdate.newLevel === 'Advanced', `TC3.01: Beginner scores 100% on quiz, upgrades to Advanced. Data: ${JSON.stringify(levelUpdate)}`);

    // TC3.02: Advanced (student1, 100%) takes Quiz 1 and scores 0% (Average = 0%). Expected: Beginner
    let qRes2 = await api(`/quizzes/${quiz1Id}/submit`, 'POST', { answers: [1, 1] }, students.student1.token);
    let levelUpdate2 = qRes2.data.data.levelUpdate;
    assert(levelUpdate2 && levelUpdate2.newLevel === 'Beginner', `TC3.02: Advanced scores 0% on quiz, downgrades to Beginner. Data: ${JSON.stringify(levelUpdate2)}`);

    // TC3.03 & TC3.04: Student 2 (Intermediate, 50% diag) takes Q1(100%), Q2(0%), Q3(50%). Average of quizzes: 50%. Expected: stays Intermediate.
    let q1Res = await api(`/quizzes/${quiz1Id}/submit`, 'POST', { answers: [0, 0] }, students.student2.token); // 100%. Avg = 100% -> Advanced
    assert(q1Res.data.data.levelUpdate?.newLevel === 'Advanced', `TC3.03a: 100% upgrades Intermediate to Advanced`);

    let q2Res = await api(`/quizzes/${quiz2Id}/submit`, 'POST', { answers: [1, 1] }, students.student2.token); // 0%. Avg = 50% -> Intermediate
    assert(q2Res.data.data.levelUpdate?.newLevel === 'Intermediate', `TC3.03b: 0% drops Advanced to Intermediate`);

    let q3Res = await api(`/quizzes/${quiz3Id}/submit`, 'POST', { answers: [0, 1] }, students.student2.token); // 50%. Avg = 50% -> Intermediate
    assert(!q3Res.data.data.levelUpdate, `TC3.03c: 50% maintains Intermediate, levelUpdate should be null`);

    // TC3.05 Multiple attempts on same quiz. API allows retakes.
    let q3Retake = await api(`/quizzes/${quiz3Id}/submit`, 'POST', { answers: [0, 0] }, students.student2.token); 
    assert(!q3Retake.data.data.levelUpdate, `TC3.05: Retake works, average is 62.5%, stays Intermediate`);

    console.log('\n--- CATEGORY 4: EDGE CASES ---');
    // TC4.02: Empty state. Student5 never took diagnostic test.
    let s5Q1Res = await api(`/quizzes/${quiz1Id}/submit`, 'POST', { answers: [0, 0] }, students.student5.token);
    assert(s5Q1Res.data.data.levelUpdate?.newLevel === 'Advanced', `TC4.02: Student with no diag takes quiz, gets Advanced.`);
    
    // Verify it actually created the DiagnosticResult
    let s5DiagRes = await api(`/diagnostic/course/${courseId}/my-result`, 'GET', null, students.student5.token);
    assert(s5DiagRes.data.data?.level === 'Advanced', `TC4.02 check: DiagnosticResult was actually created: ${s5DiagRes.data.data?.level}`);

    console.log(`\nTEST RUN COMPLETE: ${passed} Passed, ${failed} Failed.`);
    process.exit(failed > 0 ? 1 : 0);
};

runTests().catch(console.error);
