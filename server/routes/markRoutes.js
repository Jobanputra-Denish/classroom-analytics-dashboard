import express from 'express';
import {addMarks, getMarks , updateMarks , getMarksByStudentId , getMarksBySubjectId , deleteMarks} from '../controllers/marksController.js';
import protect from '../middleware/authMiddleware.js';

const  router = express.Router();

router.post("/",protect,addMarks);
router.get("/",protect,getMarks);
router.get("/student/:studentId",protect,getMarksByStudentId);
router.get("/subject/:subjectId",protect,getMarksBySubjectId);
router.put("/:id",protect,updateMarks);
router.delete("/:id",protect,deleteMarks);

export default router;  

