// import Analytics from '../models/Analytics.js';
// import Subject from '../models/Subject.js';
import Student from '../models/Student.js';
import Attendance from '../models/Attendance.js';
import Mark from '../models/Marks.js';

export const getStudentAnalytics = async (req, res) => {
    const { studentId } = req.params;
    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student Not Found" });
        }
        const marks = await Mark.find({ studentId: student._id }).populate('subjectId');
        const attendance = await Attendance.find({ studentId: student._id }).populate('subjectId');

        let totalMarks = 0;
        let totalObtainedMarks = 0;

        marks.forEach(mark => {
            totalMarks += mark.totalMarks;
            totalObtainedMarks += mark.obtainedMarks;
        })

        const averageMarks = totalMarks === 0 ? 0 : ((totalObtainedMarks / totalMarks) * 100).toFixed(2);

        const totalClasses = attendance.length;

        const present = attendance.filter(a => a.status === 'present').length;

        const attendancePercentage = totalClasses === 0 ? 0 : ((present / totalClasses) * 100).toFixed(2);

        const subjectAnalytics = marks.map(mark => {
            const subjectAttendance = attendance.filter(a => a.subjectId._id.toString() === mark.subjectId._id.toString());

            const presentSubject = subjectAttendance.filter(a => a.status === 'present').length;

            const attendancePercentage = subjectAttendance.length === 0 ? 0 : ((presentSubject / subjectAttendance.length) * 100).toFixed(2);

            return {
                subject: mark.subjectId.subjectName,
                marks: mark.obtainedMarks,
                totalMarks: mark.totalMarks,
                percentage: ((mark.obtainedMarks / mark.totalMarks) * 100).toFixed(2),
                attendance: attendancePercentage
            }
        })

        res.json(
            {
                studentName: student.fullname,
                averageMarks,
                attendancePercentage,
                subjectAnalytics
            })
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
