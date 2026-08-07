import Mark from '../models/Marks.js';
import Student from '../models/Student.js';
import Subject from '../models/Subject.js';

export const addMarks = async (req, res) => {
    try {
        const { studentId, subjectId, term, obtainedMarks, totalMarks } = req.body;

        if (obtainedMarks < 0 || obtainedMarks > totalMarks) {
            return res.status(400).json({ message: "Obtained Marks should be between 0 and Total Marks" });
        }

        const student = await Student.findOne({
            StudentId: studentId , isDeleted : false
        });
        if (!student) {
            return res.status(404).json({ message: "Student Not Found" });
        }
        const subject = await Subject.findOne({
            subjectCode: subjectId,
            isDeleted : false
        });
        if (!subject) {
            return res.status(404).json({
                message: "Subject Not Found"
            })
        }

        const existing = await Mark.findOne({
            studentId: student._id,
            subjectId: subject._id,
            term,
            createdBy: req.user._id
        });

        if (existing) {
            return res.status(400).json({ message: "Marks for this student, subject and term already exist" });
        }

        const mark = new Mark({
            studentId: student._id,
            subjectId: subject._id,
            term,
            obtainedMarks,
            totalMarks,
            createdBy: req.user._id
        });
        await mark.save();
        res.status(201).json({ message: "Marks Added Successfully", mark });

    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}


export const getMarks = async (req, res) => {
    try {
        const marks = await Mark.find().populate('studentId').populate('subjectId');
      
        res.status(200).json(marks);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


export const getMarksByStudentId = async (req, res) => {

    try {

        const student = await Student.findOne({
            StudentId: req.params.studentId , isDeleted:false
        });

        if (!student) {
            return res.status(404).json({
                message: "Student Not Found"
            });
        }

        const marks = await Mark.find({
            studentId: student._id,
            createdBy: req.user._id
        })
            .populate("studentId")
            .populate("subjectId");

        res.status(200).json(marks);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }

};


export const getMarksBySubjectId = async (req, res) => {

    try {

        const subject = await Subject.findOne({
            subjectCode: req.params.subjectId
        });

        if (!subject) {
            return res.status(404).json({
                message: "Subject Not Found"
            });
        }

        const marks = await Mark.find({
            subjectId: subject._id,
            createdBy: req.user._id
        })
            .populate("studentId")
            .populate("subjectId");

        res.status(200).json(marks);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }

};


export const updateMarks = async (req, res) => {
    try {

        const {studentId,subjectId,term,obtainedMarks,totalMarks} = req.body;

        // Validate marks
        if (obtainedMarks < 0 || obtainedMarks > totalMarks) {
            return res.status(400).json({
                message: "Obtained Marks should be between 0 and Total Marks"
            });
        }

        const mark = await Mark.findById(req.params.id);

        if(mark.createdBy.toString() !== req.user._id.toString()){
            return res.status(403).json({
                message:"Unauthorized!"
            })
        }

        if (!mark) {
            return res.status(404).json({
                message: "Marks Not Found"
            });
        }

        // Find student using StudentId
        const student = await Student.findOne({
            StudentId: studentId , isDeleted:false
        });

        if (!student) {
            return res.status(404).json({
                message: "Student Not Found"
            });
        }

        // Find subject using subjectCode
        const subject = await Subject.findOne({
            subjectCode: subjectId
        });

        if (!subject) {
            return res.status(404).json({
                message: "Subject Not Found"
            });
        }

        // Check duplicate
        const existing = await Mark.findOne({
            studentId: student._id,
            subjectId: subject._id,
            term,
            _id: { $ne: mark._id }
        });

        if (existing) {
            return res.status(400).json({
                message: "Marks already exist for this student, subject and term"
            });
        }

        mark.studentId = student._id;
        mark.subjectId = subject._id;
        mark.term = term;
        mark.obtainedMarks = obtainedMarks;
        mark.totalMarks = totalMarks;

        await mark.save();

        res.status(200).json({
            message: "Marks Updated Successfully",
            mark
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
};


export const deleteMarks = async (req, res) => {
    try {
        const mark = await Mark.findById(req.params.id);
        if (!mark) {
            return res.status(404).json({ message: "Marks Not Found" });
        }
        if(mark.createdBy.toString() !== req.user._id.toString()){
            return res.status(403).json({
                message:"Unauthorized !"
            })
        }
        await mark.deleteOne();
        res.status(200).json({ message: "Marks Deleted Successfully" });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}