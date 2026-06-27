import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course.js';
import DiagnosticTest from './models/DiagnosticTest.js';

dotenv.config();

// ---------------------------------------------------------------------------
// Diagnostic questions keyed by course code / partial title
// ---------------------------------------------------------------------------
const diagnosticData = {
  CSC401: {
    title: 'Advanced Web Technologies – Placement Test',
    description: 'Answer all questions honestly. Your results will personalise the learning materials shown to you.',
    questions: [
      { questionText: 'What does REST stand for in web development?', options: ['Remote Execution State Transfer', 'Representational State Transfer', 'Recursive State Transfer', 'Request State Transmission'], correctAnswerIndex: 1 },
      { questionText: 'Which HTTP method is used to update an existing resource?', options: ['GET', 'POST', 'PUT', 'DELETE'], correctAnswerIndex: 2 },
      { questionText: 'What is the purpose of CORS?', options: ['Compress web content', 'Cache responses', 'Control cross-origin requests', 'Create server routes'], correctAnswerIndex: 2 },
      { questionText: 'Which of these is a JavaScript runtime environment?', options: ['Apache', 'Node.js', 'MySQL', 'Redis'], correctAnswerIndex: 1 },
      { questionText: 'What does the "async/await" syntax do in JavaScript?', options: ['Declares a class', 'Handles asynchronous operations', 'Creates loops', 'Imports modules'], correctAnswerIndex: 1 },
      { questionText: 'Which tool is commonly used for containerising web applications?', options: ['Git', 'Webpack', 'Docker', 'Babel'], correctAnswerIndex: 2 },
      { questionText: 'What is GraphQL primarily used for?', options: ['Styling web pages', 'Querying APIs in a flexible way', 'Managing databases', 'Securing web traffic'], correctAnswerIndex: 1 },
    ],
  },

  CSC402: {
    title: 'AI & Machine Learning – Placement Test',
    description: 'This test gauges your existing knowledge in AI and ML. Be honest — it helps us show you the right materials.',
    questions: [
      { questionText: 'What is supervised learning?', options: ['Training without labelled data', 'Training with labelled input-output pairs', 'Reinforcement with rewards', 'Clustering data into groups'], correctAnswerIndex: 1 },
      { questionText: 'Which algorithm is commonly used for classification tasks?', options: ['K-Means', 'Linear Regression', 'Decision Tree', 'PCA'], correctAnswerIndex: 2 },
      { questionText: 'What does "overfitting" mean in machine learning?', options: ['Model performs too well on unseen data', 'Model memorises training data but fails on new data', 'Model has too few parameters', 'Model runs too slowly'], correctAnswerIndex: 1 },
      { questionText: 'What is a neural network inspired by?', options: ['The structure of a database', 'The human brain', 'Sorting algorithms', 'Graph theory'], correctAnswerIndex: 1 },
      { questionText: 'Which Python library is most popular for machine learning?', options: ['Flask', 'NumPy', 'Scikit-learn', 'Pandas'], correctAnswerIndex: 2 },
      { questionText: 'What is the purpose of a train/test split?', options: ['Speed up model training', 'Evaluate model performance on unseen data', 'Reduce dataset size', 'Visualise data'], correctAnswerIndex: 1 },
      { questionText: 'What does "gradient descent" do?', options: ['Sorts data faster', 'Minimises a model\'s loss function', 'Visualises model accuracy', 'Selects the best features'], correctAnswerIndex: 1 },
    ],
  },

  CSC403: {
    title: 'Database Systems – Placement Test',
    description: 'Test your understanding of databases, SQL, and system design before diving into the course materials.',
    questions: [
      { questionText: 'What does SQL stand for?', options: ['Structured Query Language', 'Sequential Query Logic', 'Simple Queue Language', 'Standard Question Language'], correctAnswerIndex: 0 },
      { questionText: 'Which SQL clause filters rows in a query result?', options: ['ORDER BY', 'GROUP BY', 'WHERE', 'HAVING'], correctAnswerIndex: 2 },
      { questionText: 'What is a primary key?', options: ['A key used to encrypt data', 'A unique identifier for each row in a table', 'A foreign reference to another table', 'A composite index'], correctAnswerIndex: 1 },
      { questionText: 'Which of these is a NoSQL database?', options: ['PostgreSQL', 'Oracle', 'MongoDB', 'MySQL'], correctAnswerIndex: 2 },
      { questionText: 'What is normalisation in databases?', options: ['Encrypting data', 'Backing up data', 'Organising data to reduce redundancy', 'Indexing tables for speed'], correctAnswerIndex: 2 },
      { questionText: 'What does a JOIN operation do in SQL?', options: ['Merges two databases', 'Combines rows from two or more tables', 'Deletes duplicate rows', 'Creates a new table'], correctAnswerIndex: 1 },
      { questionText: 'What is ACID in databases?', options: ['A type of chemical test', 'Atomicity, Consistency, Isolation, Durability', 'Advanced Command Index Design', 'A NoSQL framework'], correctAnswerIndex: 1 },
    ],
  },

  CSC405: {
    title: 'Software Engineering – Placement Test',
    description: 'Let us assess your understanding of software development methodologies and practices.',
    questions: [
      { questionText: 'What is the Software Development Life Cycle (SDLC)?', options: ['A security framework', 'A structured process for planning and building software', 'A programming language paradigm', 'A testing methodology only'], correctAnswerIndex: 1 },
      { questionText: 'Which Agile framework uses Sprints?', options: ['Waterfall', 'Kanban', 'Scrum', 'V-Model'], correctAnswerIndex: 2 },
      { questionText: 'What is a "User Story" in Agile?', options: ['A bug report', 'A description of a feature from the user\'s perspective', 'A technical specification document', 'A project timeline'], correctAnswerIndex: 1 },
      { questionText: 'What does version control (e.g., Git) allow you to do?', options: ['Deploy apps automatically', 'Track changes to code over time', 'Design user interfaces', 'Monitor server uptime'], correctAnswerIndex: 1 },
      { questionText: 'What is the purpose of unit testing?', options: ['Test the full system end-to-end', 'Test individual functions or components in isolation', 'Measure code performance', 'Deploy to production safely'], correctAnswerIndex: 1 },
      { questionText: 'What does "refactoring" mean in software engineering?', options: ['Rewriting the project from scratch', 'Improving existing code without changing its behaviour', 'Adding new features rapidly', 'Running automated tests'], correctAnswerIndex: 1 },
    ],
  },

  CSC407: {
    title: 'Computer Networks & Security – Placement Test',
    description: 'This short test will help us recommend the right learning materials based on your networking knowledge.',
    questions: [
      { questionText: 'What does IP stand for?', options: ['Internet Protocol', 'Internal Process', 'Interconnected Ports', 'Input Pipeline'], correctAnswerIndex: 0 },
      { questionText: 'Which layer of the OSI model handles routing?', options: ['Data Link Layer', 'Transport Layer', 'Network Layer', 'Application Layer'], correctAnswerIndex: 2 },
      { questionText: 'What is the difference between TCP and UDP?', options: ['TCP is faster, UDP is reliable', 'TCP is reliable and connection-oriented; UDP is faster but unreliable', 'They are the same protocol', 'UDP only works on local networks'], correctAnswerIndex: 1 },
      { questionText: 'What does a firewall do?', options: ['Speeds up network traffic', 'Monitors and filters incoming/outgoing network traffic', 'Assigns IP addresses', 'Encrypts hard drives'], correctAnswerIndex: 1 },
      { questionText: 'What is a VPN used for?', options: ['Speed up internet connection', 'Create a secure, encrypted connection over a public network', 'Monitor employee activity', 'Block specific websites'], correctAnswerIndex: 1 },
      { questionText: 'What is the purpose of DNS?', options: ['Assigns MAC addresses', 'Translates domain names to IP addresses', 'Secures network traffic', 'Routes packets between networks'], correctAnswerIndex: 1 },
      { questionText: 'Which protocol is used for secure web browsing?', options: ['HTTP', 'FTP', 'HTTPS', 'SMTP'], correctAnswerIndex: 2 },
    ],
  },

  CSC409: {
    title: 'Human-Computer Interaction – Placement Test',
    description: 'A short placement test to help personalise your HCI learning journey.',
    questions: [
      { questionText: 'What does HCI stand for?', options: ['High-Capacity Interface', 'Human-Computer Interaction', 'Hybrid Computing Infrastructure', 'Hardware Configuration Interface'], correctAnswerIndex: 1 },
      { questionText: 'What is a "wireframe" in UI/UX design?', options: ['A high-fidelity prototype', 'A low-fidelity blueprint of a user interface', 'A type of network topology', 'A testing script'], correctAnswerIndex: 1 },
      { questionText: 'What does UX stand for?', options: ['Universal Exchange', 'User Experience', 'Unified Extension', 'User Execution'], correctAnswerIndex: 1 },
      { questionText: 'Which principle promotes designing for all users, including those with disabilities?', options: ['Minimalism', 'Accessibility', 'Responsiveness', 'Scalability'], correctAnswerIndex: 1 },
      { questionText: 'What is a "usability test"?', options: ['A security audit', 'Observing real users interact with a system to find usability issues', 'A performance benchmark', 'An automated code review'], correctAnswerIndex: 1 },
    ],
  },

  CSC411: {
    title: 'Cloud Computing & DevOps – Placement Test',
    description: 'Tell us what you already know about cloud infrastructure and DevOps practices.',
    questions: [
      { questionText: 'What does IaaS stand for?', options: ['Internet as a Service', 'Infrastructure as a Service', 'Integration as a Service', 'Interface as a System'], correctAnswerIndex: 1 },
      { questionText: 'Which of these is a major cloud provider?', options: ['Oracle DB', 'Amazon Web Services (AWS)', 'Apache Tomcat', 'Redis'], correctAnswerIndex: 1 },
      { questionText: 'What is CI/CD in DevOps?', options: ['Client Interface / Cloud Design', 'Continuous Integration / Continuous Deployment', 'Code Inspection / Code Deployment', 'Containerised Integration / Containerised Delivery'], correctAnswerIndex: 1 },
      { questionText: 'What is the purpose of Kubernetes?', options: ['Write and manage SQL databases', 'Orchestrate and manage containerised applications', 'Design user interfaces', 'Secure web traffic'], correctAnswerIndex: 1 },
      { questionText: 'What does "serverless" mean in cloud computing?', options: ['No internet is used', 'Developers don\'t manage servers; the cloud provider does', 'The app runs on a personal computer', 'No code is needed'], correctAnswerIndex: 1 },
      { questionText: 'Which tool is most commonly used for infrastructure-as-code?', options: ['Figma', 'Terraform', 'Postman', 'Jenkins'], correctAnswerIndex: 1 },
    ],
  },

  CSC413: {
    title: 'Compiler Construction – Placement Test',
    description: 'A short diagnostic to gauge your knowledge of compilers, parsers, and language theory.',
    questions: [
      { questionText: 'What is the first phase of a compiler?', options: ['Code Generation', 'Syntax Analysis', 'Lexical Analysis', 'Semantic Analysis'], correctAnswerIndex: 2 },
      { questionText: 'What does a lexer (tokeniser) produce?', options: ['Assembly code', 'Tokens from source code', 'An abstract syntax tree', 'Optimised machine code'], correctAnswerIndex: 1 },
      { questionText: 'What is a Context-Free Grammar (CFG) used for?', options: ['Defining network protocols', 'Describing the syntax of programming languages', 'Encrypting data', 'Sorting algorithms'], correctAnswerIndex: 1 },
      { questionText: 'What is the purpose of semantic analysis in a compiler?', options: ['Convert code to binary', 'Check that code makes logical sense (e.g., type checking)', 'Parse syntax rules', 'Optimise loops'], correctAnswerIndex: 1 },
      { questionText: 'What is an Abstract Syntax Tree (AST)?', options: ['A tree of file directories', 'A tree representation of the syntactic structure of source code', 'A sorted array of tokens', 'A graph of call stacks'], correctAnswerIndex: 1 },
    ],
  },

  CSC415: {
    title: 'Distributed Systems – Placement Test',
    description: 'Assess your background in distributed computing concepts before we personalise your learning path.',
    questions: [
      { questionText: 'What is a distributed system?', options: ['A system with a single powerful server', 'Multiple computers working together as a single system', 'A system with no central server', 'A cloud storage platform'], correctAnswerIndex: 1 },
      { questionText: 'What does the CAP Theorem state?', options: ['Consistency, Availability, and Partition tolerance cannot all be guaranteed simultaneously', 'Code, Algorithms, and Protocols must be optimised', 'Cache, Access, and Persistence are required in databases', 'Concurrency, Atomicity, and Performance are always achievable'], correctAnswerIndex: 0 },
      { questionText: 'What is a microservice architecture?', options: ['A single large application', 'Breaking an application into small, independent services', 'A type of network topology', 'A database design pattern'], correctAnswerIndex: 1 },
      { questionText: 'What is the purpose of a message queue (e.g., RabbitMQ, Kafka)?', options: ['Store user sessions', 'Enable asynchronous communication between services', 'Manage database migrations', 'Serve static files'], correctAnswerIndex: 1 },
      { questionText: 'What is consensus in distributed systems?', options: ['All nodes agree on a single data value or outcome', 'The fastest node processes all requests', 'All data is stored in a single location', 'Nodes operate independently without coordination'], correctAnswerIndex: 0 },
    ],
  },

  CSC417: {
    title: 'Cyber Security & Cryptography – Placement Test',
    description: 'This test helps identify your current understanding of security principles and cryptographic methods.',
    questions: [
      { questionText: 'What is encryption?', options: ['Deleting sensitive data', 'Converting data into an unreadable format using a key', 'Backing up data to a secure server', 'Monitoring network traffic'], correctAnswerIndex: 1 },
      { questionText: 'What is the difference between symmetric and asymmetric encryption?', options: ['Symmetric uses one key for both encryption and decryption; asymmetric uses a key pair', 'Symmetric is slower; asymmetric is faster', 'They are the same thing', 'Asymmetric only works offline'], correctAnswerIndex: 0 },
      { questionText: 'What is a phishing attack?', options: ['Overloading a server with traffic', 'Tricking users into revealing sensitive information via fake communications', 'Injecting malicious SQL into a database', 'Intercepting network packets'], correctAnswerIndex: 1 },
      { questionText: 'What does SSL/TLS do?', options: ['Stores passwords securely', 'Encrypts data transmitted between a browser and a server', 'Manages user authentication', 'Monitors server logs'], correctAnswerIndex: 1 },
      { questionText: 'What is a hash function?', options: ['A function that encrypts data with a private key', 'A one-way function that produces a fixed-size output from any input', 'A function that compresses files', 'A function that generates random numbers'], correctAnswerIndex: 1 },
      { questionText: 'What is a SQL injection attack?', options: ['Sending too many SQL queries to slow a server', 'Inserting malicious SQL code into an input field to manipulate a database', 'Stealing SQL credentials from an admin', 'Deleting SQL tables remotely'], correctAnswerIndex: 1 },
    ],
  },

  CSC419: {
    title: 'Mobile Application Development – Placement Test',
    description: 'Answer these questions to help us personalise your mobile dev learning path.',
    questions: [
      { questionText: 'What language is used natively for Android development?', options: ['Swift', 'Dart', 'Kotlin', 'JavaScript'], correctAnswerIndex: 2 },
      { questionText: 'What is React Native used for?', options: ['Server-side rendering', 'Building cross-platform mobile apps using JavaScript', 'Managing databases', 'Building desktop applications'], correctAnswerIndex: 1 },
      { questionText: 'What is the purpose of the App Store / Play Store?', options: ['Test mobile apps internally', 'Distribute published mobile applications to users', 'Compile mobile source code', 'Manage app databases'], correctAnswerIndex: 1 },
      { questionText: 'What is an APK file?', options: ['An Apple app package', 'An Android application package', 'A JavaScript bundle', 'A database backup file'], correctAnswerIndex: 1 },
      { questionText: 'Which framework developed by Google supports building mobile, web, and desktop apps from a single codebase?', options: ['Ionic', 'Flutter', 'Xamarin', 'NativeScript'], correctAnswerIndex: 1 },
    ],
  },

  CSC421: {
    title: 'Blockchain & Smart Contracts – Placement Test',
    description: 'A quick diagnostic to understand your starting knowledge of blockchain technology.',
    questions: [
      { questionText: 'What is a blockchain?', options: ['A type of relational database', 'A distributed ledger of records that is immutable and transparent', 'A cloud storage service', 'A programming language for finance'], correctAnswerIndex: 1 },
      { questionText: 'What is a smart contract?', options: ['A legal agreement signed digitally', 'Self-executing code stored on a blockchain that runs when conditions are met', 'A database stored in the cloud', 'An API for financial transactions'], correctAnswerIndex: 1 },
      { questionText: 'What is the role of a "miner" in a Proof of Work blockchain?', options: ['Write smart contracts', 'Validate transactions and add new blocks to the chain', 'Store user data', 'Encrypt blockchain data'], correctAnswerIndex: 1 },
      { questionText: 'What does Ethereum primarily allow developers to build?', options: ['Gaming applications', 'Decentralised applications (dApps) and smart contracts', 'Cloud storage solutions', 'Standard web applications'], correctAnswerIndex: 1 },
      { questionText: 'What is a cryptocurrency wallet?', options: ['A physical device that stores cash digitally', 'Software that stores cryptographic keys to manage digital assets', 'A type of bank account', 'A hardware mining device'], correctAnswerIndex: 1 },
    ],
  },

  // Generic for non-CS courses
  DEFAULT: {
    title: 'Course Placement Diagnostic',
    description: 'Answer all questions to help us personalise the learning materials we show you throughout this course.',
    questions: [
      { questionText: 'How would you rate your prior knowledge of this subject?', options: ['No prior knowledge', 'Basic awareness', 'Comfortable with the fundamentals', 'Very experienced'], correctAnswerIndex: 1 },
      { questionText: 'Which of the following best describes your learning preference?', options: ['Reading textbooks and notes', 'Watching video lectures', 'Hands-on practice and exercises', 'Group discussions and peer learning'], correctAnswerIndex: 2 },
      { questionText: 'What is the scientific method?', options: ['A trial-and-error approach to guessing', 'A systematic process for conducting experiments and forming conclusions', 'A way to memorise facts quickly', 'A teaching philosophy'], correctAnswerIndex: 1 },
      { questionText: 'What does "analysis" mean in academic work?', options: ['Summarising information without critique', 'Breaking a topic into parts to understand it better', 'Writing a long essay', 'Conducting a survey'], correctAnswerIndex: 1 },
      { questionText: 'What is the purpose of a literature review?', options: ['To write a story about past researchers', 'To survey existing research relevant to your topic', 'To list references at the end of an essay', 'To define keywords in a project'], correctAnswerIndex: 1 },
    ],
  },
};

// Map course code prefixes to question sets
const getQuestionsForCourse = (code, title) => {
  const normalizedCode = code.replace(/\s+/g, '').toUpperCase();
  if (diagnosticData[normalizedCode]) return diagnosticData[normalizedCode];
  // Try prefix match (e.g. CSC 419 → CSC419)
  for (const key of Object.keys(diagnosticData)) {
    if (normalizedCode.startsWith(key)) return diagnosticData[key];
  }
  // Title keyword fallback
  const lower = title.toLowerCase();
  if (lower.includes('network')) return diagnosticData.CSC407;
  if (lower.includes('database')) return diagnosticData.CSC403;
  if (lower.includes('software')) return diagnosticData.CSC405;
  if (lower.includes('artificial') || lower.includes('machine learning')) return diagnosticData.CSC402;
  if (lower.includes('security') || lower.includes('crypto')) return diagnosticData.CSC417;
  if (lower.includes('cloud') || lower.includes('devops')) return diagnosticData.CSC411;
  if (lower.includes('mobile')) return diagnosticData.CSC419;
  if (lower.includes('blockchain')) return diagnosticData.CSC421;
  if (lower.includes('web')) return diagnosticData.CSC401;
  if (lower.includes('compiler')) return diagnosticData.CSC413;
  if (lower.includes('distributed')) return diagnosticData.CSC415;
  if (lower.includes('hci') || lower.includes('human')) return diagnosticData.CSC409;
  return diagnosticData.DEFAULT;
};

const seedDiagnosticTests = async () => {
  if (!process.env.MONGO_URI) {
    console.error('Error: MONGO_URI is not defined.');
    process.exit(1);
  }

  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected.\n');

    const courses = await Course.find();
    if (courses.length === 0) {
      console.log('No courses found. Seed courses first.');
      process.exit(1);
    }

    console.log(`Found ${courses.length} courses. Clearing existing diagnostic tests...`);
    await DiagnosticTest.deleteMany({});

    const testsToInsert = courses.map(course => {
      const testData = getQuestionsForCourse(course.code, course.title);
      return {
        courseId: course._id,
        title: testData.title,
        description: testData.description,
        questions: testData.questions,
      };
    });

    await DiagnosticTest.insertMany(testsToInsert);

    console.log(`\n✅ Inserted ${testsToInsert.length} diagnostic tests:\n`);
    testsToInsert.forEach((t, i) => {
      const course = courses[i];
      console.log(`  ${course.code.padEnd(12)} | ${course.title.padEnd(40)} | ${t.questions.length} questions`);
    });

    console.log('\nDiagnostic tests seeded successfully! 🎉');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database disconnected.');
  }
};

seedDiagnosticTests();
