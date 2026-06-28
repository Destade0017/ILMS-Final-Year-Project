# CHAPTER FOUR: DESIGN AND IMPLEMENTATION

## 4.1 Introduction

This chapter presents a comprehensive account of the design decisions, architectural framework, and implementation details underpinning "Learnova," an Intelligent Learning Management System with Adaptive Content Delivery. The chapter provides a thorough exposition of the system's architecture, the tools and technologies employed during development, and the configuration procedures necessary for deployment. Furthermore, it discusses the nature and structure of the input data processed by the system, the corresponding outputs generated, and concludes with a practical guide for end-users across all supported roles — Student, Lecturer, and Administrator.

The implementation of Learnova was guided by two principal objectives: first, to deliver a fully functional web-based learning management platform capable of supporting core academic workflows such as course management, assignment submission, and quiz administration; and second, to incorporate a rule-based adaptive learning engine that classifies students into proficiency levels and delivers personalised content recommendations based on their demonstrated performance. The system achieves this through a combination of diagnostic testing and continuous performance monitoring via quiz submissions, without reliance on machine learning or artificial intelligence algorithms. Instead, the adaptation logic is implemented through deterministic, threshold-based classification rules embedded directly within the application's business logic layer.

The development followed the MERN stack paradigm — MongoDB, Express.js, React, and Node.js — ensuring a consistent JavaScript-based development environment across both the client and server tiers. This uniformity simplified data interchange, reduced context-switching overhead during development, and facilitated a streamlined deployment pipeline.

---

## 4.2 The Architecture, Installation, and Configuration Tools

### 4.2.1 System Architecture

Learnova adopts a three-tier client-server architecture comprising a presentation tier (frontend), an application logic tier (backend), and a data persistence tier (database). The interaction between these tiers follows the RESTful architectural style, wherein the frontend communicates with the backend exclusively through stateless HTTP requests to well-defined API endpoints.

The system further adheres to the Model-View-Controller (MVC) design pattern on the server side. The **Model** layer encapsulates the data structures and database schemas defined using Mongoose. The **Controller** layer houses the business logic, including the adaptive classification algorithms and auto-grading routines. The **View** is effectively delegated to the React-based frontend, which renders the user interface based on data received from the API.

Authentication is handled via JSON Web Tokens (JWT), which are issued upon successful login or registration and subsequently included in the `Authorization` header of all protected API requests. Role-based access control is enforced through middleware functions that verify both the validity of the token and the user's role before granting access to specific endpoints.

[Insert Figure 4.1: System Architecture Diagram showing the three-tier architecture — React Frontend, Express.js Backend, and MongoDB Database — with arrows indicating RESTful API communication and JWT authentication flow]

The following table summarises the principal API route groups exposed by the backend:

**Table 4.1: Summary of API Route Groups**

| Route Prefix | Purpose | Access Level |
|---|---|---|
| `/api/auth` | User registration, login, password reset | Public / Protected |
| `/api/courses` | Course creation, listing, enrollment, deletion | Protected (role-dependent) |
| `/api/quizzes` | Quiz creation, retrieval, submission, auto-grading | Protected (role-dependent) |
| `/api/diagnostic` | Diagnostic test creation, submission, classification | Protected (role-dependent) |
| `/api/materials` | Material management, adaptive content filtering | Protected (role-dependent) |
| `/api/assignments` | Assignment creation, submission, grading | Protected (role-dependent) |
| `/api/assessments` | Assessment result recording and retrieval | Protected (role-dependent) |
| `/api/admin` | User CRUD, course management, analytics | Admin only |
| `/api/users` | Profile management, user listings | Protected |

[Insert Table 4.1: Summary of API Route Groups]

---

### 4.2.2 Frontend Architecture

The frontend is built using **React 19** as the primary user interface library, with **Vite 8** serving as the build tool and development server. Vite was selected for its superior build performance, which leverages native ES module support to deliver near-instantaneous hot module replacement during development.

**State Management and Routing:**
The application employs React's built-in `useState` hook for local component state management. Navigation between views is implemented through state-based routing, wherein two state variables — `authView` (controlling authentication views such as login, registration, and password reset) and `mainView` (controlling post-authentication views such as the dashboard and profile settings) — determine the currently rendered component. Authentication state is persisted to the browser's `localStorage`, enabling session continuity across page refreshes.

**Component Structure:**
The frontend is organised into the following principal components:

| Component | Purpose |
|---|---|
| `App.jsx` | Root component; manages authentication state and view routing |
| `Login.jsx` | User login form with email and password fields |
| `Register.jsx` | User registration form with role selection |
| `ForgotPassword.jsx` | Password recovery initiation form |
| `ResetPassword.jsx` | Password reset form with token validation |
| `Dashboard.jsx` | Primary view for Students and Lecturers; manages courses, assignments, quizzes, materials, and diagnostics |
| `DiagnosticTest.jsx` | Standalone diagnostic test interface with progress tracking and result display |
| `AdminDashboard.jsx` | Administrator shell with tabs for analytics, user management, and course management |
| `AdminAnalytics.jsx` | Platform-wide statistics and recent activity display |
| `AdminUserManagement.jsx` | CRUD operations for user accounts |
| `AdminCourseManagement.jsx` | Lecturer assignment and course oversight |
| `ProfileSettings.jsx` | User profile editing (name, email, password) |
| `Toast.jsx` | Custom toast notification system with auto-dismiss and progress bar |
| `Skeleton.jsx` | Shimmer loading placeholder components |

[Insert Table 4.2: Frontend Component Structure]

**Styling:**
All styling is implemented using custom CSS with CSS custom properties (variables) defined in `index.css`. The design system employs a coherent set of design tokens including:
- A primary colour palette centred on blue (`#2563eb`) with semantic colours for success (green), error (red), and warning (orange).
- The Inter typeface loaded from Google Fonts for consistent, modern typography.
- A standardised spacing and border-radius system (`--radius: 8px`).
- Responsive breakpoints at 1024px and 768px, transitioning the layout from a three-column grid to two columns and finally to a single column on mobile devices.
- Smooth transitions and a `fade-in` animation for page entry effects.

**Icon Library:**
The `lucide-react` library provides a comprehensive set of SVG icons used throughout the interface, including icons for navigation, status indicators, and action buttons.

**API Communication:**
All API calls utilise the native `fetch()` API with the base URL configured via the `VITE_API_URL` environment variable (defaulting to `http://localhost:5001`). Authentication tokens are included as Bearer tokens in the `Authorization` header of all protected requests.

[Insert Figure 4.2: Frontend Component Hierarchy Diagram]

---

### 4.2.3 Backend Architecture

The backend is implemented in **Node.js** using the **Express.js 5** web framework. The application follows the MVC pattern with a clear separation of concerns across the following directories:

```
backend/
├── server.js               # Entry point: environment config, DB connection, server start
├── src/
│   ├── app.js              # Express application configuration and middleware stack
│   ├── config/
│   │   └── db.js           # MongoDB connection logic via Mongoose
│   ├── controllers/        # Business logic for each feature domain
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── quizController.js
│   │   ├── diagnosticController.js
│   │   ├── materialController.js
│   │   ├── assignmentController.js
│   │   ├── assessmentController.js
│   │   ├── adminController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT verification and role-based authorisation
│   ├── models/             # Mongoose schemas and data models
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Quiz.js
│   │   ├── QuizAttempt.js
│   │   ├── Assignment.js
│   │   ├── Submission.js
│   │   ├── Material.js
│   │   ├── DiagnosticTest.js
│   │   ├── DiagnosticResult.js
│   │   ├── AssessmentResult.js
│   │   └── ActivityLog.js
│   ├── routes/             # Route definitions mapping endpoints to controllers
│   └── utils/
│       └── generateToken.js  # JWT generation utility
```

**Middleware Stack:**
The Express application is configured with the following middleware, applied in order:
1. **Helmet** — Sets secure HTTP response headers to mitigate common web vulnerabilities.
2. **CORS** — Enables Cross-Origin Resource Sharing, permitting the frontend to communicate with the backend from a different origin during development.
3. **express.json()** — Parses incoming JSON request bodies.
4. **Morgan** — Logs HTTP requests to the console in the `dev` format for debugging purposes.

**Authentication Middleware:**
Two middleware functions enforce security across all protected routes:
- `protect`: Extracts the JWT from the `Authorization` header, verifies its signature using the `JWT_SECRET` environment variable, retrieves the corresponding user document from the database, and attaches it to `req.user` for downstream handlers.
- `authorize(...roles)`: A factory function that returns middleware checking whether `req.user.role` is included in the specified list of permitted roles. Returns a `403 Forbidden` response if the user's role is not authorised.

---

### 4.2.4 Database Architecture

The data persistence layer employs **MongoDB**, a document-oriented NoSQL database, accessed through the **Mongoose 9** Object Data Modelling (ODM) library. Mongoose provides schema validation, type casting, query building, and middleware hooks that enforce data integrity at the application level.

The database schema comprises eleven collections, whose relationships are illustrated in the entity-relationship diagram below:

[Insert Figure 4.3: Database Schema / Entity-Relationship Diagram showing all 11 collections and their relationships]

**Table 4.3: Database Collections and Key Fields**

| Collection | Key Fields | Relationships |
|---|---|---|
| `Users` | name, email, password (hashed), role (admin/student/lecturer) | Referenced by Course, Submission, QuizAttempt, DiagnosticResult |
| `Courses` | title, code (unique, uppercase), description | References User (lecturer, students array) |
| `Quizzes` | title, description, timeLimit, questions (embedded), maxPoints | References Course |
| `QuizAttempts` | answers, score, maxScore, submittedAt | References Quiz, User; unique compound index on (quizId, studentId) |
| `Assignments` | title, description, dueDate, maxPoints | References Course |
| `Submissions` | content, status (pending/graded), score, feedback | References Assignment, User (student, gradedBy); unique compound index on (assignmentId, studentId) |
| `Materials` | title, description, contentType (pdf/video/text), difficultyLevel (Beginner/Intermediate/Advanced/All), fileUrl, bodyText | References Course |
| `DiagnosticTests` | title, description, questions (embedded) | References Course; unique constraint on courseId (one test per course) |
| `DiagnosticResults` | score (0–100), level (Beginner/Intermediate/Advanced), source (diagnostic/quiz_performance) | References User, Course; unique compound index on (studentId, courseId) |
| `AssessmentResults` | score (0–100), type (quiz/assignment/test), topic | References User (student, lecturer), Course |
| `ActivityLogs` | action, target, details (mixed type) | References User |

[Insert Table 4.3: Database Collections and Key Fields]

**Key Design Decisions:**
1. **Embedded Sub-documents:** Quiz and Diagnostic Test questions are stored as embedded arrays within their parent documents, avoiding the overhead of additional collections for question management.
2. **Unique Compound Indexes:** The `QuizAttempt` and `Submission` collections enforce uniqueness on `(quizId, studentId)` and `(assignmentId, studentId)` respectively, ensuring each student can submit only once per assessment.
3. **Password Security:** User passwords are hashed using `bcryptjs` with 10 salt rounds via a Mongoose pre-save hook, and the password field is excluded from query results by default (`select: false`).
4. **Upsert Pattern for Diagnostic Results:** The `DiagnosticResult` collection uses an upsert strategy, allowing both diagnostic test submissions and quiz-based level updates to write to the same document, ensuring a single authoritative level record per student per course.

---

### 4.2.5 Installation Procedures

The following procedures outline the steps required to install and deploy the Learnova system on a development machine.

**Prerequisites:**
- Node.js (version 18.x or later)
- npm (Node Package Manager, bundled with Node.js)
- MongoDB (version 6.0 or later, either installed locally or accessible via a cloud-hosted instance such as MongoDB Atlas)
- A modern web browser (Google Chrome, Mozilla Firefox, or Microsoft Edge)
- Git (for version control and repository cloning)

**Step 1: Clone the Repository**
```
git clone <repository-url>
cd ILMS-Final-Year-Project
```

**Step 2: Install Backend Dependencies**
```
cd backend
npm install
```

**Step 3: Configure Backend Environment Variables**
Create a `.env` file in the `backend/` directory with the following variables:
```
MONGO_URI=mongodb://localhost:27017/learnova
JWT_SECRET=<a-secure-random-string>
JWT_EXPIRE=30d
PORT=5001
```

**Step 4: Install Frontend Dependencies**
```
cd ../frontend
npm install
```

**Step 5: Configure Frontend Environment Variables (Optional)**
Create a `.env` file in the `frontend/` directory:
```
VITE_API_URL=http://localhost:5001
```

**Step 6: Start the Backend Server**
```
cd ../backend
npm run dev
```
This launches the server using `nodemon`, which automatically restarts upon file changes.

**Step 7: Start the Frontend Development Server**
```
cd ../frontend
npm run dev
```
This launches the Vite development server, typically accessible at `http://localhost:5173`.

**Step 8: Seed the Database (Optional)**
Several seed scripts are provided for populating the database with sample data:
```
node src/seed.js                  # General seed data
node src/seedDiagnosticTests.js   # Sample diagnostic tests
node src/seedMaterials.js         # Sample learning materials
node src/seed_assignments.js      # Sample assignments
node src/seed_quizzes.js          # Sample quizzes
```

---

### 4.2.6 Configuration Tools and Packages

**Table 4.4: Backend Dependencies and Their Purposes**

| Package | Version | Purpose |
|---|---|---|
| `express` | 5.2.1 | Web application framework for handling HTTP requests and routing |
| `mongoose` | 9.6.3 | MongoDB object data modelling library for schema definition and query building |
| `jsonwebtoken` | 9.0.3 | Generation and verification of JSON Web Tokens for stateless authentication |
| `bcryptjs` | 3.0.3 | Password hashing library using the bcrypt algorithm |
| `cors` | 2.8.6 | Middleware for enabling Cross-Origin Resource Sharing |
| `helmet` | 8.2.0 | Security middleware for setting protective HTTP headers |
| `dotenv` | 17.4.2 | Loads environment variables from `.env` files into `process.env` |
| `morgan` | 1.11.0 | HTTP request logger for development debugging |
| `nodemon` | 3.1.14 (dev) | Automatic server restart on file changes during development |

[Insert Table 4.4: Backend Dependencies]

**Table 4.5: Frontend Dependencies and Their Purposes**

| Package | Version | Purpose |
|---|---|---|
| `react` | 19.2.6 | Core UI library for building component-based user interfaces |
| `react-dom` | 19.2.6 | React rendering engine for the browser DOM |
| `lucide-react` | 1.21.0 | SVG icon library providing consistent, customisable icons |
| `vite` | 8.0.12 (dev) | Next-generation frontend build tool with fast hot module replacement |
| `@vitejs/plugin-react` | 6.0.1 (dev) | Vite plugin enabling React JSX transformation and fast refresh |
| `eslint` | 10.3.0 (dev) | Static code analysis tool for identifying and fixing code quality issues |

[Insert Table 4.5: Frontend Dependencies]

---

## 4.3 System Requirements

### 4.3.1 Hardware Requirements

The following table presents the minimum and recommended hardware specifications for running the Learnova system during development and for end-user access.

**Table 4.6: Hardware Requirements for Development/Server**

| Component | Minimum Requirement | Recommended Specification |
|---|---|---|
| Processor | Dual-core CPU (Intel i3 or equivalent) | Quad-core CPU (Intel i5/i7 or Apple M1/M2) |
| RAM | 4 GB | 8 GB or higher |
| Storage | 10 GB available disk space | 20 GB SSD |
| Network | Broadband internet connection | Stable broadband connection (10 Mbps+) |
| Display | 1366 × 768 resolution | 1920 × 1080 resolution or higher |

[Insert Table 4.6: Hardware Requirements for Development/Server]

**Table 4.7: Hardware Requirements for Client (End-User Access)**

| Component | Minimum Requirement |
|---|---|
| Processor | Any modern processor (2015 or later) |
| RAM | 2 GB |
| Network | Internet connection capable of loading web pages |
| Display | 360px width (mobile) to 1920px (desktop) |

[Insert Table 4.7: Hardware Requirements for Client Access]

---

### 4.3.2 Software Requirements

**Table 4.8: Software Requirements for Development/Server**

| Software | Version | Purpose |
|---|---|---|
| Node.js | 18.x or later | JavaScript runtime for executing the backend server |
| npm | 9.x or later | Package manager for installing project dependencies |
| MongoDB | 6.0 or later | NoSQL database for data persistence |
| Git | 2.x or later | Version control for source code management |
| Visual Studio Code (or equivalent) | Latest stable | Integrated development environment for code editing |
| Operating System | Windows 10/11, macOS 12+, or Ubuntu 20.04+ | Any OS supporting Node.js and MongoDB |

[Insert Table 4.8: Software Requirements for Development/Server]

**Table 4.9: Software Requirements for Client (End-User Access)**

| Software | Version | Purpose |
|---|---|---|
| Google Chrome | 90 or later | Recommended web browser |
| Mozilla Firefox | 88 or later | Alternative web browser |
| Microsoft Edge | 90 or later | Alternative web browser |
| Safari | 14 or later | Alternative web browser (macOS/iOS) |

[Insert Table 4.9: Software Requirements for Client Access]

---

## 4.4 Discussion of the Input Used

This section discusses the various forms of input data that the Learnova system accepts, processes, and stores. Each category of input serves a specific functional purpose within the platform.

### 4.4.1 User Registration Details

During account creation, the system collects the following input from new users:

- **Name:** The full name of the user, stored as a trimmed string.
- **Email Address:** A valid email address, validated against a regular expression pattern and stored in lowercase. The email serves as the unique identifier for authentication.
- **Password:** A minimum of six characters, which is hashed using the `bcryptjs` library with 10 salt rounds before storage. The plaintext password is never persisted.
- **Role:** A selection from three predefined roles — `student`, `lecturer`, or `admin`. This selection determines the user's access privileges throughout the system.

[Insert Figure 4.4: Registration Page Screenshot]

### 4.4.2 Authentication Credentials

Returning users provide their email address and password to authenticate. The system validates these credentials against the stored records and, upon successful verification, issues a JWT token that expires after 30 days by default.

[Insert Figure 4.5: Login Page Screenshot]

### 4.4.3 Course Information

Lecturers and administrators provide the following inputs when creating a new course:

- **Course Code:** A unique identifier automatically converted to uppercase (e.g., "CSC401").
- **Course Title:** The descriptive name of the course.
- **Course Description:** A textual summary of the course content and objectives.

The creating lecturer is automatically assigned as the course instructor. Administrators may subsequently reassign lecturers through the course management interface.

### 4.4.4 Quiz Data

Lecturers construct quizzes by providing:

- **Quiz Title:** A descriptive title for the quiz.
- **Quiz Description:** Optional explanatory text regarding the quiz scope or instructions.
- **Time Limit:** An optional duration in minutes (a value of zero indicates no time limit).
- **Questions:** One or more multiple-choice questions, each comprising:
  - A question text string.
  - A minimum of two answer options.
  - The index of the correct answer option.

The system automatically computes the maximum achievable score as equal to the number of questions (one point per question).

[Insert Figure 4.6: Quiz Creation Form Screenshot]

### 4.4.5 Diagnostic Test Responses

Diagnostic tests share a structural similarity with quizzes but serve a distinct purpose — initial student classification. The input comprises:

- **Test Construction (Lecturer):** A set of multiple-choice questions with correct answer indices, associated with a specific course. Only one diagnostic test is permitted per course, enforced by a unique constraint on the `courseId` field.
- **Student Responses:** An array of selected answer indices submitted by the student. The system validates that the number of responses matches the number of questions before processing.

[Insert Figure 4.7: Diagnostic Test Interface Screenshot]

### 4.4.6 Assignment Submissions

Lecturers create assignments by specifying:

- **Assignment Title:** A descriptive title.
- **Description:** Detailed instructions for the assignment.
- **Due Date:** The submission deadline.
- **Maximum Points:** The maximum achievable score (default: 100).

Students submit their work as text content or a URL link. Each student is permitted only one submission per assignment, enforced by a unique compound index.

[Insert Figure 4.8: Assignment Submission Form Screenshot]

### 4.4.7 Material Uploads

Lecturers contribute learning materials by providing:

- **Title:** The material's descriptive title.
- **Description:** A brief summary of the material's content.
- **Content Type:** One of three types — `pdf`, `video`, or `text`.
- **Content:** For text-type materials, the body text is provided directly. For PDF and video materials, a URL pointing to the external resource is supplied.
- **Difficulty Level:** A classification tag of `Beginner`, `Intermediate`, `Advanced`, or `All`. This tag is the cornerstone of the adaptive content delivery system, as it determines which materials are recommended to students based on their current proficiency level.

[Insert Figure 4.9: Material Creation Form Screenshot]

### 4.4.8 Grading Input

Lecturers provide grading input for student assignment submissions:

- **Score:** A numerical value between 0 and the assignment's maximum points.
- **Feedback:** Textual feedback explaining the grade awarded.

Upon grading, the system automatically normalises the score to a percentage and syncs it to the centralised `AssessmentResult` collection.

---

## 4.5 Discussion of the Output Obtained

This section examines the outputs generated by the Learnova system in response to the inputs described in Section 4.4.

### 4.5.1 User Dashboards

The system generates role-specific dashboards that serve as the primary interface for each user type:

**Student Dashboard:**
- A list of enrolled courses with course code, title, and lecturer information.
- A catalogue of available (unenrolled) courses with enrollment buttons.
- Within each course, a tabbed interface providing access to course information, assignments, quizzes, materials, and (where applicable) the student's current proficiency level.

[Insert Figure 4.10: Student Dashboard Screenshot]

**Lecturer Dashboard:**
- A summary of instructing courses with student enrollment counts.
- A course creation form for establishing new courses.
- Within each course, management interfaces for assignments, quizzes, materials, and diagnostic tests.
- Student submission lists with grading capabilities.

[Insert Figure 4.11: Lecturer Dashboard Screenshot]

**Administrator Dashboard:**
- A three-tab interface comprising:
  1. **Analytics Dashboard:** Seven statistical cards displaying total users, student count, lecturer count, total courses, total assessments, total submissions, and average student score. Additionally, a list of the top five performing courses (ranked by average score) and a chronological log of recent administrative activities.
  2. **User Management:** A tabular listing of all registered users with capabilities for creating, editing, and deleting accounts.
  3. **Course Management:** A tabular listing of all courses with functionality for assigning and removing lecturers.

[Insert Figure 4.12: Administrator Dashboard Screenshot]

### 4.5.2 Student Classification Results

Upon completing a diagnostic test or after quiz submissions trigger a level recalculation, the system outputs a classification result comprising:

- **Score:** The percentage of correctly answered questions (for diagnostic tests) or the rolling average across all quiz attempts in the course (for quiz-based updates).
- **Level Classification:** One of three proficiency levels, determined by the following rule-based thresholds:
  - **Advanced:** Score ≥ 80%
  - **Intermediate:** Score ≥ 50% and < 80%
  - **Beginner:** Score < 50%
- **Source Indicator:** Whether the classification originated from a `diagnostic` test or from ongoing `quiz_performance`.

The diagnostic test result screen displays the classification with a colour-coded badge — green for Beginner, yellow/amber for Intermediate, and red for Advanced — accompanied by a descriptive message indicating the type of content the student will receive.

[Insert Figure 4.13: Diagnostic Test Result Screen Screenshot showing level classification]

When a quiz submission triggers a level change, the system generates a toast notification informing the student of their updated level and the rolling average that prompted the change.

[Insert Figure 4.14: Level Update Notification Screenshot]

### 4.5.3 Recommended Materials

The adaptive content recommendation system produces a filtered list of learning materials tailored to each student's current proficiency level. When the "Adaptive" filter is active:

- Students classified as **Beginner** receive materials tagged as "Beginner" or "All."
- Students classified as **Intermediate** receive materials tagged as "Intermediate" or "All."
- Students classified as **Advanced** receive materials tagged as "Advanced" or "All."
- Students who have not yet completed a diagnostic test default to receiving "Beginner" and "All" materials.

The output includes an **adaptive statistics banner** displaying the student's current course average, their recommended level, and the number of assessments contributing to the recommendation. Materials are displayed with colour-coded difficulty badges for easy identification.

[Insert Figure 4.15: Adaptive Materials View Screenshot showing filtered materials with difficulty badges and adaptive stats banner]

### 4.5.4 Quiz Scores and Results

Upon quiz submission, the auto-grading engine produces the following outputs:

- **Raw Score:** The number of correctly answered questions out of the total.
- **Percentage Score:** The score expressed as a percentage, computed as `(correct answers / total questions) × 100`.
- **Answer Review:** A detailed breakdown showing each question, the student's selected answer, the correct answer, and a visual indicator (correct/incorrect) for self-assessment.
- **Level Update (Conditional):** If the cumulative quiz performance triggers a level reclassification, the response includes the previous level, new level, rolling average percentage, and the number of quizzes contributing to the calculation.

For lecturers, the quiz output includes a performance table listing all student attempts with individual scores and submission timestamps.

[Insert Figure 4.16: Quiz Results Screen Screenshot]
[Insert Figure 4.17: Lecturer Quiz Performance Table Screenshot]

### 4.5.5 Assignment Grades and Feedback

After a lecturer grades a submission, the student receives:

- **Numerical Score:** The awarded score relative to the assignment's maximum points.
- **Textual Feedback:** The lecturer's qualitative assessment of the submission.
- **Submission Status:** Updated from `pending` to `graded`.

The graded score is automatically normalised to a percentage and recorded in the centralised `AssessmentResult` collection, contributing to the student's overall academic performance record.

[Insert Figure 4.18: Graded Assignment View Screenshot]

### 4.5.6 Administrative Reports and Analytics

The administrator analytics dashboard produces the following aggregated outputs:

- **Statistical Summary:** Seven key metrics presented as cards — total users, students, lecturers, courses, assessments, submissions, and the platform-wide average score.
- **Top Performing Courses:** The five courses with the highest average student scores, displayed with course code, title, and average score percentage.
- **Activity Log:** A chronological listing of the ten most recent administrative actions, including the action type, timestamp, performing user, and target entity.

[Insert Figure 4.19: Admin Analytics Dashboard Screenshot]

### 4.5.7 Diagnostic Test Class Overview (Lecturer Output)

Lecturers reviewing the diagnostic tab for their courses receive:

- **Class Level Distribution:** A summary showing the count of students classified at each proficiency level (Beginner, Intermediate, Advanced).
- **Per-Student Results:** A detailed table listing each student's name, score percentage, and assigned level with colour-coded badges.

This output enables lecturers to assess the overall readiness of their class and identify students who may require additional support.

[Insert Figure 4.20: Class Diagnostic Results Overview Screenshot]

---

## 4.6 Making Use of the Program

This section provides a step-by-step guide for using the Learnova system, organised by user role and workflow.

### 4.6.1 Registration

To create a new account on the Learnova platform:

1. Navigate to the application URL in a web browser.
2. On the login page, click the **"Register here"** link to access the registration form.
3. Complete the following fields:
   - **Name:** Enter your full name.
   - **Email:** Enter a valid email address.
   - **Password:** Enter a password of at least six characters.
   - **Role:** Select your role from the dropdown menu (`Student`, `Lecturer`, or `Admin`).
4. Click the **"Create Account"** button.
5. Upon successful registration, the system automatically logs you in and redirects you to the appropriate dashboard based on your selected role.

[Insert Figure 4.21: Completed Registration Form Screenshot]

### 4.6.2 Login

To access an existing account:

1. Navigate to the application URL.
2. Enter your registered email address and password in the login form.
3. Click the **"Sign In"** button.
4. Upon successful authentication, the system redirects you to:
   - The **Student/Lecturer Dashboard** if your role is `student` or `lecturer`.
   - The **Administrator Dashboard** if your role is `admin`.

If you have forgotten your password, click **"Forgot Password?"** to initiate the password recovery process.

[Insert Figure 4.22: Login Page Screenshot]

### 4.6.3 Course Enrollment (Student)

To enrol in an available course:

1. From the Student Dashboard, scroll to the **"Available Courses"** section.
2. Browse the listed courses, each displaying the course code, title, and instructor name.
3. Click the **"Enroll"** button on the desired course card.
4. The system immediately opens the **Diagnostic Test** overlay for the enrolled course (see Section 4.6.4).
5. After completing or skipping the diagnostic test, the course appears under **"My Enrolled Courses."**

[Insert Figure 4.23: Available Courses Section Screenshot]

### 4.6.4 Taking Diagnostic Tests (Student)

The diagnostic test is presented immediately upon course enrollment, or can be retaken from the course materials tab:

1. The diagnostic test interface displays all questions sequentially with multiple-choice options.
2. A progress bar indicates the number of questions answered (e.g., "3 of 10 answered").
3. Select one answer per question by clicking the corresponding option card.
4. Once all questions are answered, the **"Submit Diagnostic Test"** button becomes active.
5. Click the submit button to receive your results.
6. The result screen displays:
   - Your score as a percentage and a fraction (e.g., "70%, 7 out of 10 correct").
   - Your assigned proficiency level (Beginner, Intermediate, or Advanced) with a colour-coded badge.
   - A brief description of the type of materials you will receive.
7. Click **"Continue to Course"** to proceed to the course content.

If no diagnostic test has been created for the course, the system displays a notification and offers a **"Skip"** button, defaulting the student to the Beginner level.

[Insert Figure 4.24: Diagnostic Test in Progress Screenshot]
[Insert Figure 4.25: Diagnostic Test Results Screenshot]

### 4.6.5 Accessing Adaptive Materials (Student)

To access course materials filtered by your proficiency level:

1. Open a course from **"My Enrolled Courses"** by clicking **"View Details."**
2. Navigate to the **"Materials"** tab within the course detail modal.
3. By default, the **"Adaptive"** filter is active, displaying only materials matching your current proficiency level and those tagged as "All."
4. An adaptive statistics banner appears at the top, showing your current course average and recommended level.
5. To view all materials regardless of level, switch the filter to **"All."**
6. Alternatively, select a specific difficulty level (Beginner, Intermediate, or Advanced) to view materials at that level only.
7. Click on a material to access its content:
   - **Text materials:** The content is displayed directly within the interface.
   - **PDF materials:** An external link opens the PDF document.
   - **Video materials:** An external link opens the video resource.

[Insert Figure 4.26: Adaptive Materials View with Level Filter Screenshot]

### 4.6.6 Taking Quizzes (Student)

To take a quiz within an enrolled course:

1. Open the course detail modal and navigate to the **"Quizzes"** tab.
2. Browse the available quizzes, each showing the title, description, and maximum points.
3. Click on a quiz to begin.
4. Answer each multiple-choice question by selecting the appropriate option.
5. Click the **"Submit Quiz"** button upon completion.
6. The system automatically grades the quiz and displays:
   - Your score (correct answers out of total).
   - A detailed review of each question with correct and incorrect answers highlighted.
7. If your cumulative quiz performance triggers a level reclassification, a toast notification appears indicating your previous and new levels.
8. Each quiz may be attempted only once. Subsequent visits to a completed quiz display your recorded results.

[Insert Figure 4.27: Quiz Taking Interface Screenshot]
[Insert Figure 4.28: Quiz Results with Answer Review Screenshot]

### 4.6.7 Submitting Assignments (Student)

To submit an assignment:

1. Open the course detail modal and navigate to the **"Assignments"** tab.
2. View the list of assignments with their titles, descriptions, due dates, and maximum points.
3. Click on an assignment to view its details.
4. Enter your submission in the text field (text content or a URL link to your work).
5. Click the **"Submit"** button.
6. After submission, the status displays as **"Pending"** until the lecturer grades it.
7. Once graded, the submission displays the awarded score, percentage, and the lecturer's feedback.

[Insert Figure 4.29: Assignment Submission Interface Screenshot]
[Insert Figure 4.30: Graded Assignment with Feedback Screenshot]

### 4.6.8 Lecturer Operations

**Creating a Course:**
1. From the Lecturer Dashboard, locate the **"Create New Course"** section.
2. Enter the course code, title, and description.
3. Click **"Create Course."** The new course appears under **"My Instructing Courses."**

**Creating Assignments:**
1. Open a course and navigate to the **"Assignments"** tab.
2. Click to reveal the assignment creation form.
3. Enter the title, description, due date, and maximum points.
4. Click **"Create Assignment."**

**Grading Submissions:**
1. Within the Assignments tab, click on an assignment to view student submissions.
2. For each submission, enter a score (within the valid range) and feedback.
3. Click **"Grade"** to finalise. The grade is automatically synced to the assessment records.

**Creating Quizzes:**
1. Navigate to the **"Quizzes"** tab within a course.
2. Complete the quiz creation form with a title, description, optional time limit, and questions.
3. For each question, provide the question text, at least two options, and select the correct answer.
4. Click **"Create Quiz."**

**Managing Materials:**
1. Navigate to the **"Materials"** tab within a course.
2. Complete the material creation form with a title, difficulty level, content type, and content (text body or URL).
3. Click **"Create Material."** Materials can also be deleted from this tab.

**Creating Diagnostic Tests:**
1. Navigate to the **"Diagnostic"** tab within a course.
2. Add questions with multiple-choice options and correct answer selections.
3. Save the diagnostic test. Only one test is permitted per course; subsequent saves overwrite the existing test.
4. View the class-level distribution and individual student results in the same tab.

[Insert Figure 4.31: Lecturer Course Management Screenshot]
[Insert Figure 4.32: Quiz Creation Form Screenshot]
[Insert Figure 4.33: Assignment Grading Interface Screenshot]

### 4.6.9 Administrator Operations

**Accessing the Admin Dashboard:**
1. Log in with an administrator account. The system automatically displays the Admin Dashboard.

**Analytics Tab:**
1. The analytics tab displays platform-wide statistics, top-performing courses, and recent activity logs.
2. Data is loaded in parallel for optimal performance.

**User Management Tab:**
1. View all registered users in a tabular format with name, email, role, and registration date.
2. Click **"Create User"** to add a new user account with a specified role.
3. Click **"Edit"** on any user row to modify their name, email, or role.
4. Click **"Delete"** to remove a user account. The system prevents administrators from deleting their own accounts.

**Course Management Tab:**
1. View all courses with their assigned lecturers and student counts.
2. To assign a lecturer, click **"Assign"** on a course row, select a lecturer from the dropdown, and confirm.
3. To remove a lecturer assignment, click **"Unassign."**

[Insert Figure 4.34: Admin User Management Screenshot]
[Insert Figure 4.35: Admin Course Management Screenshot]

### 4.6.10 Profile Management

All users can update their profile information:

1. Click the **"Profile"** button in the dashboard header.
2. Modify your name, email, or password as desired.
3. The password field is optional — leaving it blank retains the current password.
4. Click **"Save Changes"** to update your profile.
5. Click **"Back to Dashboard"** to return to the main interface.

[Insert Figure 4.36: Profile Settings Page Screenshot]

### 4.6.11 Password Recovery

If a user forgets their password:

1. On the login page, click **"Forgot Password?"**
2. Enter the registered email address and click **"Send Reset Link."**
3. The system generates a password reset token valid for 10 minutes.
4. Navigate to the reset link provided (in the development environment, the link is displayed directly in the interface).
5. Enter a new password and confirm it.
6. Click **"Reset Password."** Upon success, the system automatically logs the user in with the new credentials.

[Insert Figure 4.37: Forgot Password Page Screenshot]
[Insert Figure 4.38: Reset Password Page Screenshot]
