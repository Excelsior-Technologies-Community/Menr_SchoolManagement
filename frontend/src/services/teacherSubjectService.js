import api from "./api";

// =====================================================
// GET ALL TEACHER SUBJECT MAPPINGS
// =====================================================

export const getTeacherSubjects = async () => {

  const response =
    await api.get(
      "/teacher-subjects"
    );

  return response.data;
};


// =====================================================
// GET SUBJECTS BY TEACHER
// =====================================================

export const getSubjectsByTeacher =
async (staffId) => {

  const response =
    await api.get(
      `/teacher-subjects/teacher/${staffId}`
    );

  return response.data;
};


// =====================================================
// CREATE MAPPING
// =====================================================

export const createTeacherSubject =
async (data) => {

  const response =
    await api.post(
      "/teacher-subjects",
      data
    );

  return response.data;
};


// =====================================================
// DELETE MAPPING
// =====================================================

export const deleteTeacherSubject =
async (id) => {

  const response =
    await api.delete(
      `/teacher-subjects/${id}`
    );

  return response.data;
};