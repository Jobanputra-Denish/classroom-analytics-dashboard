import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import testRoutes from './routes/testRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import marksRoutes from './routes/markRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import helmet from 'helmet';
import morgan from 'morgan';

connectDB();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(
  cors({
    origin: "*",
    credentials: true
  })
);

app.use(helmet());
app.use(morgan('dev'));

app.use('/api/auth',authRoutes);
app.use('/api/test',testRoutes);
app.use('/api/students',studentRoutes);
app.use('/api/attendance',attendanceRoutes);
app.use('/api/marks',marksRoutes);
app.use('/api/analytics',analyticsRoutes);
app.use('/api/subjects',subjectRoutes);


app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Classroom Analytics Dashboard API",
    version: "1.0.0",
    status: "Running"
  });
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});