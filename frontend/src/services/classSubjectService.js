import api from "./api";

const CLASS_SUBJECT_BASE_URL = "/class-subjects";

/**
 * Get all class-subject mappings
 */
export const getAllClassSubjects = async () => {
  try {
    const response = await api.get(
      CLASS_SUBJECT_BASE_URL
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch class subjects"
    );
  }
};

/**
 * Get subjects assigned to a particular school class
 */
export const getSubjectsByClass = async (
  schoolClassId
) => {
  try {
    if (!schoolClassId) {
      throw new Error(
        "School class is required"
      );
    }

    const response = await api.get(
      `${CLASS_SUBJECT_BASE_URL}/class/${schoolClassId}`
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch subjects for class"
    );
  }
};

/**
 * Create class-subject mapping
 */
export const createClassSubject = async (
  data
) => {
  try {
    if (!data?.school_class_id) {
      throw new Error(
        "Please select a class"
      );
    }

    if (!data?.subject_id) {
      throw new Error(
        "Please select a subject"
      );
    }

    const response = await api.post(
      CLASS_SUBJECT_BASE_URL,
      {
        school_class_id:
          Number(data.school_class_id),

        subject_id:
          Number(data.subject_id),

        status:
          data.status || "active"
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to create class subject mapping"
    );
  }
};

/**
 * Delete class-subject mapping
 */
export const deleteClassSubject = async (
  id
) => {
  try {
    if (!id) {
      throw new Error(
        "Class subject ID is required"
      );
    }

    const response = await api.delete(
      `${CLASS_SUBJECT_BASE_URL}/${id}`
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to delete class subject mapping"
    );
  }
};