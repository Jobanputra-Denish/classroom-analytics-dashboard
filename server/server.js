import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import testRoutes from './routes/testRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import marksRoutes from './routes/markRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';

connectDB();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use('/api/auth',authRoutes);
app.use('/api/test',testRoutes);
app.use('/api/students',studentRoutes);
app.use('/api/attendance',attendanceRoutes);
app.use('/api/marks',marksRoutes);
app.use('/api/analytics',analyticsRoutes);
app.use('/api/subjects',subjectRoutes);

dotenv.config();

app.get('/',(req,res)=>{
    res.send('Welcome to the Authentication API');
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});