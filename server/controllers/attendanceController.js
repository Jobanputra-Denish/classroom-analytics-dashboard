import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";
import Subject from "../models/Subject.js";

export const markAttendance = async (req, res) => {
  try {
    const { studentId, date, status, subjectCode } = req.body;

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);


    if (attendanceDate > today) {
      return res.status(400).json({
        message: "Future date is not allowed for attendance marking"
      })
    }

    const student = await Student.findOne({ StudentId: studentId , isDeleted:false });

    if (!student) {
      return res.status(400).json({
        message: "Student not found"
      })
    }

    const subject = await Subject.findOne({ subjectCode , isDeleted : false });

    if (!subject) {
      return res.status(400).json({
        message: "Subject not found"
      })
    }

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const existing = await Attendance.findOne({
      studentId: student._id, subjectId: subject._id,
      createdBy: req.user._id,
      date: { $gte: selectedDate, $lt: nextDate }
    });


    if (existing) {
      return res.status(400).json({ 
        message: "Attendance already marked"
      })
    }

    const attendance = await Attendance.create({
      studentId: student._id,
      subjectId: subject._id,
      date: selectedDate,
      status,
      createdBy: req.user._id
    });


    res.status(201).json({
      message: "Attendance marked successfully",
      attendance
    })

  } catch (error) {

    console.log("Error in markAttendance", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


export const getAttendance = async (req, res) => {

  try {
    const attendance = await Attendance.find({ createdBy: req.user._id, }).populate("studentId").populate("subjectId")
      .sort({ date: -1 });

    res.status(200).json(attendance);

  } catch (error) {

    console.log("Error in getAttendance", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAttendanceByStudent = async (req, res) => {
  try {
    const attendance = await Attendance.find({ studentId: req.params.studentId, createdBy: req.user._id }).populate("studentId").populate("subjectId").sort({ date: -1 });
    res.status(200).json(attendance);
  }
  catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

export const updateAttendance = async (req, res) => {
  try {
    const { status, date } = req.body;
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        message: "Attendance not found"
      })
    }
    attendance.status = status || attendance.status;
    attendance.date = date || attendance.date;

    await attendance.save();
    res.status(200).json({
      message: "Attendance updated successfully",
      attendance
    })
  }
  catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

export const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({
        message: "Attendance not found"
      })
    }
    await attendance.deleteOne();
    res.status(200).json({
      message: "Attendance deleted successfully"
    })
  }
  catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

export const searchAttendance = async (req, res) => {
  try {
    const { query } = req.query;
    const attendance = await Attendance.find({ createdBy: req.user._id }).populate("studentId").populate("subjectId");

    const filterd = attendance.filter(item => {
      return (
        item.studentId?.fullname.toLowerCase()
          .includes(query.toLowerCase()) ||
        item.studentId?.StudentId.toLowerCase()
          .includes(query.toLowerCase()) ||
        item.subjectId?.subjectName.toLowerCase()
          .includes(query.toLowerCase()) ||
        item.subjectId?.subjectCode.toLowerCase()
          .includes(query.toLowerCase())
      );

    });
    res.status(200).json(filterd);

  }

  catch (error) {
    res.status(404).json({
      message: error.message
    })
  }
}