import api from "./axios";

export const getAttendance = () => api.get("/attendance");
export const markAttendance = (data) => api.post("/attendance", data);
export const updateAttendance = (id, data) => api.put(`/attendance/${id}`, data);
export const deleteAttendance = (id) => api.delete(`/attendance/${id}`);
export const getAttendanceByStudent = (studentId) => api.get(`/attendance/${studentId}`);
export const searchAttendance = (query) => api.get(`/attendance/search?query=${encodeURIComponent(query)}`);