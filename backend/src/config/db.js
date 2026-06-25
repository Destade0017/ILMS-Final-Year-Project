import mongoose from 'mongoose';

/**
 * Establish a connection to the MongoDB Database.
 * This is an async function because database connections happen asynchronously over the network.
 */
const connectDB = async () => {
    // Validate that the database URI environment variable exists
    if (!process.env.MONGO_URI) {
        console.error("Database Connection Error: MONGO_URI is not defined in the environment variables.");
        process.exit(1);
    }

    try {
        // Attempt to connect using the connection string stored in environment variables
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // If the connection fails, log the error details to the console
        console.error(`Database Connection Error: ${error.message}`);
        
        // Exit the Node.js process with a failure status code (1)
        // This prevents the application from running in an unstable, database-less state.
        process.exit(1);
    }
};

export default connectDB;
