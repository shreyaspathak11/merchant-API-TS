import express from 'express';
import {config} from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/database';

config({ 
    path: './.env' 
});

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

connectDB(MONGO_URI);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// Importing Routes
import authRoutes from './routes/authRoutes';
import merchantRoutes from './routes/merchantRoutes';

// Using Routes
app.use('/auth', authRoutes);
app.use('/api/merchants', merchantRoutes);

// Serve static assets if in production
app.get('/', (req, res) => {
    res.send('API is running');
});

// Listen to port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
