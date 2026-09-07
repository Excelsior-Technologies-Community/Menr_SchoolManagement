import api from "./api";

export const getExamResults = async () => {
  const response = await api.get("/exam-results");
  return response.data;
};

export const getExamResultById = async (id) => {
  const response = await api.get(`/exam-results/${id}`);
  return response.data;
};

export const getExamResultsByStudent = async (studentId) => {
  const response = await api.get(
    `/exam-results/student/${studentId}`
  );
  return response.data;
};

export const getExamResultsByExam = async (examId) => {
  const response = await api.get(
    `/exam-results/exam/${examId}`
  );
  return response.data;
};

export const createExamResult = async (data) => {
  const response = await api.post(
    "/exam-results",
    data
  );
  return response.data;
};

export const updateExamResult = async (id, data) => {
  const response = await api.put(
    `/exam-results/${id}`,
    data
  );
  return response.data;
};

export const deleteExamResult = async (id) => {
  const response = await api.delete(
    `/exam-results/${id}`
  );
  return response.data;
};