import api from "./axios";

export const getMarks = () => api.get("/marks");

export const getMarksByStudentId = (studentId) =>
  api.get(`/marks/student/${studentId}`);

export const getMarksBySubjectId = (subjectId) =>
  api.get(`/marks/subject/${subjectId}`);

export const addMarks = (data) => api.post("/marks", data);

export const updateMarks = (id, data) => api.put(`/marks/${id}`, data);

export const deleteMarks = (id) => api.delete(`/marks/${id}`);