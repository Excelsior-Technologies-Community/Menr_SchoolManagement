import api from "./api";

/**
 * Get all exam halls
 */
export const getExamHalls = async () => {
  const response = await api.get("/exam-halls");
  return response.data;
};

/**
 * Get exam hall by ID
 */
export const getExamHallById = async (id) => {
  const response = await api.get(
    `/exam-halls/${id}`
  );

  return response.data;
};

/**
 * Create exam hall
 */
export const createExamHall = async (data) => {
  const response = await api.post(
    "/exam-halls",
    data
  );

  return response.data;
};

/**
 * Update exam hall
 */
export const updateExamHall = async (
  id,
  data
) => {
  const response = await api.put(
    `/exam-halls/${id}`,
    data
  );

  return response.data;
};

/**
 * Delete exam hall
 */
export const deleteExamHall = async (id) => {
  const response = await api.delete(
    `/exam-halls/${id}`
  );

  return response.data;
};