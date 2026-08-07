import express from 'express';
import {getAttendance, markAttendance , getAttendanceByStudent , updateAttendance , deleteAttendance ,
    searchAttendance } from '../controllers/attendanceController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/", protect, markAttendance);
router.get("/", protect, getAttendance);
router.get("/search", protect, searchAttendance);
router.get("/:studentId", protect, getAttendanceByStudent);
router.put("/:id", protect, updateAttendance);
router.delete("/:id", protect, deleteAttendance);

export default router;
