import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import userRoutes from './routes/userRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import materialRoutes from './routes/materialRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// JSON Parsing Error Handler (Catches invalid/malformed JSON in requests)
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            success: false,
            message: 'Malformed JSON payload'
        });
    }
    next(err);
});

app.use(morgan('dev')); // Enabled HTTP request logging

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/admin', adminRoutes);
// Base Routes
app.get('/', (req, res) => {
    res.json({
        message: "Precious is a girl"
    });
});

export default app;

