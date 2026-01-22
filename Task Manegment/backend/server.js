import express from 'express';
import cors from 'cors';
import authRouter from './auth.js';
import taskRouter from './taskRoutes.js';
import userRouter from './userRoutes.js';
import connectToDatabase from './db.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve the path to the .env file explicitly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/users', userRouter);

connectToDatabase();

// Check if JWT_KEY is loaded
if (!process.env.JWT_KEY) {
    console.error("ERROR: JWT_KEY is not defined. Check your .env file.");
    process.exit(1); // Stop the server if config is missing
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});