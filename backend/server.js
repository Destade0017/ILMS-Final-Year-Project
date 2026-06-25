import dotenv from 'dotenv';
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

// Load environment variables first, so that other modules (like database configuration)
// can access the loaded keys immediately.
dotenv.config();

// Establish connection to MongoDB
connectDB();

const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
    console.log(`Server running in ${NODE_ENV} mode on port http://localhost:${PORT}`);
});
