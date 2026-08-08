import api from "./axios";

export const getMarks = () => {
    return api.get("/marks");
};