import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './layouts/DashboardHome';
import Login from './pages/auth/Login.js';
import Register from './pages/auth/Register.js';
import Students from './pages/students/Students.js';
import ViewStudents from './pages/students/ViewStudents.js';
import ProtectedRoute from './routes/ProtectedRoute.js';
import Attendance from './pages/Attendance/Attendance.js';
import Marks from './pages/marks/Marks.js';
import ViewMarks from './pages/marks/ViewMarks.js';
import Analytics from './pages/Analytics/Analytics.js';
import Subjects from './pages/Subjects/Subjects.js';
import Settings from './pages/Setings/Settings.jsx';
import ViewSubjects from './pages/Subjects/ViewSubjects.js';


function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Layout */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Default View inside Layout */}
        <Route index element={<DashboardHome />} />
        
        {/* Sub-pages inside Layout */}
        <Route path="students" element={<Students />} />
        <Route path="view-students" element={<ViewStudents />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="marks" element={<Marks />} />
        <Route path="view-marks" element={<ViewMarks />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="view-subjects" element={<ViewSubjects />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;