import api from "./axios";

export const getMarks = () => {
  return api.get("/marks");
};

// Fetch student list for selector dropdown
export const getStudents = () => {
  return api.get("/students");
};

// Fetch analytics for a specific student
export const getStudentAnalytics = (studentId) => {
  return api.get(`/analytics/${studentId}`);
};