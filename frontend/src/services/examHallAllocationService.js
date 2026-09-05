import api from "./api";

/**
 * Get all exam hall allocations
 */
export const getExamHallAllocations = async () => {
  const response = await api.get(
    "/exam-hall-allocations"
  );

  return response.data;
};

/**
 * Get allocation by ID
 */
export const getExamHallAllocationById = async (id) => {
  const response = await api.get(
    `/exam-hall-allocations/${id}`
  );

  return response.data;
};

/**
 * Create allocation
 */
export const createExamHallAllocation = async (data) => {
  const response = await api.post(
    "/exam-hall-allocations",
    data
  );

  return response.data;
};

/**
 * Update allocation
 */
export const updateExamHallAllocation = async (
  id,
  data
) => {
  const response = await api.put(
    `/exam-hall-allocations/${id}`,
    data
  );

  return response.data;
};

/**
 * Delete allocation
 */
export const deleteExamHallAllocation = async (id) => {
  const response = await api.delete(
    `/exam-hall-allocations/${id}`
  );

  return response.data;
};