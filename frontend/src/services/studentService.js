import api from "./api";

export const getStudents = async () => {
  const response = await api.get("/students");
  return response.data;
};

export const createStudent = async (studentData) => {
  const response = await api.post(
    "/students",
    studentData
  );

  return response.data;
};

export const updateStudentStatus = async (
  id,
  status
) => {
  const response = await api.patch(
    `/students/${id}/status`,
    { status }
  );

  return response.data;
};

export const searchStudents = async (
  search
) => {
  const response = await api.get(
    `/students/search?search=${search}`
  );

  return response.data;
};

export const updateStudent = async (
  id,
  data
) => {
  const response = await api.put(
    `/students/${id}`,
    data
  );

  return response.data;
};

export const getStudentsWithPagination = async (
  page = 1,
  limit = 10
) => {
  const response = await api.get(
    `/students/pagination?page=${page}&limit=${limit}`
  );

  return response.data;
};

export const deleteStudent = async (
  id
) => {
  const response = await api.delete(
    `/students/${id}`
  );

  return response.data;
};

// =========================================================
// STUDENT PORTAL APIs
// =========================================================

export const getStudentMyClass = async () => {
  const response = await api.get(
    "/students/me/class"
  );

  return response.data;
};


export const getStudentClassmates = async () => {
  const response = await api.get(
    "/students/me/classmates"
  );

  return response.data;
};


export const getStudentMySubjects = async () => {
  const response = await api.get(
    "/students/me/subjects"
  );

  return response.data;
};


export const getStudentMyTimetable = async () => {
  const response = await api.get(
    "/students/me/timetable"
  );

  return response.data;
};


export const getStudentMyAttendance = async () => {
  const response = await api.get(
    "/students/me/attendance"
  );

  return response.data;
};

// =========================================================
// STUDENT PROFILE
// =========================================================

export const getStudentProfile = async () => {

  const response = await api.get(
    "/students/profile"
  );

  return response.data;

};

// =========================================================
// UPDATE STUDENT OWN PROFILE
// =========================================================

export const updateStudentProfile = async (data) => {

  const response = await api.put(
    "/students/profile",
    data
  );

  return response.data;

};


// =========================================================
// STUDENT RESULT
// =========================================================

export const getStudentResult = async () => {

  const response = await api.get(
    "/students/dashboard"
  );

  return response.data;

};


// =========================================================
// STUDENT FEES
// =========================================================

export const getStudentFees = async () => {

  const response = await api.get(
    "/students/dashboard"
  );

  return response.data;

};

export const changeStudentPassword = async (data) => {
  const response = await api.put(
    "/students/change-password",
    data
  );

  return response.data;
};