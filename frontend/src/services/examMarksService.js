import api from "./api";

export const getExamMarks = async () => {
  const response = await api.get("/exam-marks");
  return response.data;
};

export const getExamMarkById = async (id) => {
  const response = await api.get(`/exam-marks/${id}`);
  return response.data;
};

export const getExamMarksByStudent = async (studentId) => {
  const response = await api.get(
    `/exam-marks/student/${studentId}`
  );

  return response.data;
};

export const getExamMarksByExam = async (examId) => {
  const response = await api.get(
    `/exam-marks/exam/${examId}`
  );

  return response.data;
};

export const createExamMark = async (data) => {
  const response = await api.post(
    "/exam-marks",
    data
  );

  return response.data;
};

export const updateExamMark = async (id, data) => {
  const response = await api.put(
    `/exam-marks/${id}`,
    data
  );

  return response.data;
};

export const deleteExamMark = async (id) => {
  const response = await api.delete(
    `/exam-marks/${id}`
  );

  return response.data;
};