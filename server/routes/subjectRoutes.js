import express from "express";
import {getSubjects, addSubject , searchSubjects , deleteSubject , updateSubject , getSubjectById} from "../controllers/subjectController.js";

const router = express.Router();

router.get('/',getSubjects);
router.post('/',addSubject);
router.get('/search',searchSubjects);
router.get('/:id',getSubjectById);
router.put('/:id',updateSubject);
router.delete('/:id',deleteSubject);

export default router;