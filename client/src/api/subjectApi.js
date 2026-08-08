import api from "./axios";

export const getSubjects = () => api.get("/subjects");
export const getSubjectById = (id) => api.get(`/subjects/${id}`);
export const createSubject = (data) => api.post("/subjects", data);
export const updateSubject = (id, data) => api.put(`/subjects/${id}`, data);
export const deleteSubject = (id) => api.delete(`/subjects/${id}`);
export const searchSubjects = (query) => api.get(`/subjects/search?query=${query}`);