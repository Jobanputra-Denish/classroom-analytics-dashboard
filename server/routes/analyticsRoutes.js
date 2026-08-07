import express from "express";
import {getStudentAnalytics} from "../controllers/analyticsController.js";

const router = express.Router();
router.get('/:studentId',getStudentAnalytics);

export default router;
