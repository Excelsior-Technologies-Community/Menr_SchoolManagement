import api from "./api";

/**
 * Get all exam eligibility settings
 */
export const getExamEligibilitySettings = async () => {
  const response = await api.get("/exam-eligibility");
  return response.data;
};

/**
 * Get eligibility setting by ID
 */
export const getExamEligibilitySettingById = async (id) => {
  const response = await api.get(
    `/exam-eligibility/${id}`
  );
  return response.data;
};

/**
 * Create eligibility setting
 */
export const createExamEligibilitySetting = async (data) => {
  const response = await api.post(
    "/exam-eligibility",
    data
  );
  return response.data;
};

/**
 * Update eligibility setting
 */
export const updateExamEligibilitySetting = async (
  id,
  data
) => {
  const response = await api.put(
    `/exam-eligibility/${id}`,
    data
  );
  return response.data;
};

/**
 * Delete eligibility setting
 */
export const deleteExamEligibilitySetting = async (id) => {
  const response = await api.delete(
    `/exam-eligibility/${id}`
  );
  return response.data;
};