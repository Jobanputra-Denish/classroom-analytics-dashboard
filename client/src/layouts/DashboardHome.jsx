import React, { useState, useEffect } from "react";
import axios from "axios";
import { GraduationCap, Users, ClipboardCheck, BookOpen, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardHome = () => {
  const [studentCount, setStudentCount] = useState(0);
  const [subjectCount, setSubjectCount] = useState(0);
  const [attendanceRate, setAttendanceRate] = useState(0);

  // Dynamic Chart States
  const [attendanceTrend, setAttendanceTrend] = useState({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    data: [0, 0, 0, 0, 0, 0]
  });

  const [subjectPerformance, setSubjectPerformance] = useState({
    labels: [],
    data: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [studentsRes, subjectsRes, attendanceRes, marksRes] = await Promise.allSettled([
          axios.get("http://localhost:5000/api/students", { headers }),
          axios.get("http://localhost:5000/api/subjects", { headers }),
          axios.get("http://localhost:5000/api/attendance", { headers }),
          axios.get("http://localhost:5000/api/marks", { headers })
        ]);

        if (studentsRes.status === "fulfilled") {
          setStudentCount(studentsRes.value.data.length || 0);
        }

        if (subjectsRes.status === "fulfilled") {
          setSubjectCount(subjectsRes.value.data.length || 0);
        }

        // --- 1. DYNAMIC ATTENDANCE TREND ---
        if (attendanceRes.status === "fulfilled") {
          const logs = attendanceRes.value.data || [];
          if (Array.isArray(logs) && logs.length > 0) {
            const presentCount = logs.filter((item) => item.status === "present").length;
            setAttendanceRate((presentCount / logs.length) * 100);

            const daysMap = {
              Mon: { present: 0, total: 0 },
              Tue: { present: 0, total: 0 },
              Wed: { present: 0, total: 0 },
              Thu: { present: 0, total: 0 },
              Fri: { present: 0, total: 0 },
              Sat: { present: 0, total: 0 }
            };

            logs.forEach((log) => {
              const logDate = new Date(log.date || log.createdAt);
              const dayName = logDate.toLocaleDateString("en-US", { weekday: "short" });

              if (daysMap[dayName]) {
                daysMap[dayName].total += 1;
                if (log.status === "present") {
                  daysMap[dayName].present += 1;
                }
              }
            });

            const labels = Object.keys(daysMap);
            const trendData = labels.map((day) => {
              const { present, total } = daysMap[day];
              return total > 0 ? Number(((present / total) * 100).toFixed(1)) : 0;
            });

            setAttendanceTrend({ labels, data: trendData });
          } else {
            setAttendanceRate(0);
          }
        }

        // --- 2. DYNAMIC SUBJECT MARKS PERFORMANCE (FIXED) ---
        if (marksRes.status === "fulfilled") {
          const marksLogs = marksRes.value.data || [];
          if (Array.isArray(marksLogs) && marksLogs.length > 0) {
            const subjectScores = {};

            marksLogs.forEach((item) => {
              // Extract subject name matching your backend structure in Marks.jsx
              const name = item.subjectId?.subjectName || item.subjectName || "Unknown";
              
              // Extract obtained and total marks safely
              const obtained = Number(item.obtainedMarks ?? 0);
              const total = Number(item.totalMarks ?? 100);

              // Calculate individual percentage score
              const percentage = total > 0 ? (obtained / total) * 100 : 0;

              if (!subjectScores[name]) {
                subjectScores[name] = [];
              }
              subjectScores[name].push(percentage);
            });

            // Calculate average percentage per subject
            const labels = Object.keys(subjectScores);
            const averages = labels.map((subject) => {
              const scores = subjectScores[subject];
              const avg = scores.reduce((sum, val) => sum + val, 0) / scores.length;
              return Number(avg.toFixed(1));
            });

            setSubjectPerformance({ labels, data: averages });
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const generateBarColors = (count) => {
    const palette = ["#6d28d9", "#7c3aed", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"];
    return Array.from({ length: count }, (_, i) => palette[i % palette.length]);
  };

  const attendanceChartData = {
    labels: attendanceTrend.labels,
    datasets: [
      {
        label: "Attendance Rate (%)",
        data: attendanceTrend.data,
        borderColor: "#6d28d9",
        backgroundColor: "rgba(109, 40, 217, 0.12)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#6d28d9",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 5
      }
    ]
  };

  const attendanceChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: "#1e1b4b", padding: 10, cornerRadius: 8 }
    },
    scales: {
      y: { min: 0, max: 100, grid: { color: "#f1f5f9" } },
      x: { grid: { display: false } }
    }
  };

  const performanceChartData = {
    labels: subjectPerformance.labels.length > 0 ? subjectPerformance.labels : ["No Data"],
    datasets: [
      {
        label: "Class Average Score (%)",
        data: subjectPerformance.data.length > 0 ? subjectPerformance.data : [0],
        backgroundColor: generateBarColors(subjectPerformance.labels.length || 1),
        borderRadius: 8
      }
    ]
  };

  const performanceChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: "#1e1b4b", padding: 10, cornerRadius: 8 }
    },
    scales: {
      y: { min: 0, max: 100, grid: { color: "#f1f5f9" } },
      x: { grid: { display: false } }
    }
  };

  return (
    <div className="dashboard-home-content">
      <div className="dashboard-welcome">
        <h2>Welcome back, Administrator</h2>
        <p>Here is what is happening across your classroom portal today.</p>
      </div>

      {/* STAT CARDS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div>
              <span className="stat-title">SUBJECTS</span>
              <h3 className="stat-value">{subjectCount}</h3>
              <span className="stat-subtitle">Total Subjects</span>
            </div>
            <div className="stat-icon icon-purple">
              <GraduationCap size={22} />
            </div>
          </div>
          <Link to="/subjects" className="stat-link">
            View <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div>
              <span className="stat-title">STUDENTS</span>
              <h3 className="stat-value">{studentCount}</h3>
              <span className="stat-subtitle">Total Students</span>
            </div>
            <div className="stat-icon icon-blue">
              <Users size={22} />
            </div>
          </div>
          <Link to="/view-students" className="stat-link">
            View <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div>
              <span className="stat-title">ATTENDANCE</span>
              <h3 className="stat-value">{Number(attendanceRate).toFixed(1)}%</h3>
              <span className="stat-subtitle">Overall Attendance</span>
            </div>
            <div className="stat-icon icon-green">
              <ClipboardCheck size={22} />
            </div>
          </div>
          <Link to="/attendance" className="stat-link">
            View <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div>
              <span className="stat-title">PERFORMANCE</span>
              <h3 className="stat-value">
                {subjectPerformance.data.length > 0
                  ? (
                      subjectPerformance.data.reduce((a, b) => a + b, 0) /
                      subjectPerformance.data.length
                    ).toFixed(1)
                  : "0.0"}
                %
              </h3>
              <span className="stat-subtitle">Average Marks</span>
            </div>
            <div className="stat-icon icon-amber">
              <BookOpen size={22} />
            </div>
          </div>
          <Link to="/view-marks" className="stat-link">
            View <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Attendance Trends</h3>
            <span className="chart-badge">Weekly View</span>
          </div>
          <div className="chart-body">
            <Line data={attendanceChartData} options={attendanceChartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Subject Performance</h3>
            <span className="chart-badge">Average Marks</span>
          </div>
          <div className="chart-body">
            <Bar data={performanceChartData} options={performanceChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;