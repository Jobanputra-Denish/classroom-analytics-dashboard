import express from 'express';
import {getStudents, getStudentById, CreateStudent, updateStudent, deleteStudent} from '../controllers/studentController.js';
import protect from '../middleware/authMiddleware.js';

 const router = express.Router();
 router.use(protect);

router.post("/",protect,CreateStudent);
router.get("/",protect,getStudents);
router.get("/:id",protect,getStudentById);
router.put("/:id",protect,updateStudent);
router.delete("/:id",protect,deleteStudent);

export default router;