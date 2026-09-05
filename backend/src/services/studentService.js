const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  createStudent,
  getAllStudents,
  getStudentsBySchool,
  getStudentById,
  updateStudent,
  updateStudentStatus,
  deleteStudent,
  getStudentsWithPagination,
  searchStudents,
  findStudentByRollNumber,
  updateStudentPassword,
  getStudentPasswordById,

  getStudentDashboardProfile,
  getStudentDashboardSubjects,
  getStudentDashboardAttendance,
  getStudentDashboardMarks,
  getStudentDashboardFees,

  getStudentMyClass,
  getStudentClassmates,
  getStudentMySubjects,
  getStudentMyTimetable,
  getStudentMyAttendance
} = require("../repositories/studentRepository");


// =========================================================
// CREATE STUDENT
// =========================================================

const createStudentService = async (
  studentData
) => {

  const defaultPassword =
    process.env.DEFAULT_STUDENT_PASSWORD ||
    "Student@123";

  const hashedPassword =
    await bcrypt.hash(
      defaultPassword,
      10
    );

  studentData.password =
    hashedPassword;

  studentData.status =
    "ACTIVE";

  await createStudent(
    studentData
  );

  return {
    message:
      "Student Created Successfully",

    defaultPassword
  };
};


// =========================================================
// GET ALL STUDENTS
// =========================================================

const getAllStudentsService =
async (user) => {

  if (
    user.role === "SUPER_ADMIN"
  ) {

    return await getAllStudents();

  }


  if (
    user.role === "SCHOOL_ADMIN"
  ) {

    return await getStudentsBySchool(
      user.schoolId
    );

  }


  throw new Error(
    "Unauthorized"
  );

};


// =========================================================
// GET STUDENT BY ID
// =========================================================

const getStudentByIdService =
async (id) => {

  return await getStudentById(
    id
  );

};


// =========================================================
// UPDATE STUDENT
// =========================================================

const updateStudentService =
async (
  id,
  data
) => {

  return await updateStudent(
    id,
    data
  );

};


// =========================================================
// UPDATE STUDENT STATUS
// =========================================================

const updateStudentStatusService =
async (
  id,
  status
) => {

  if (
    !status
  ) {

    throw new Error(
      "Status is required"
    );

  }


  if (
    ![
      "ACTIVE",
      "INACTIVE"
    ].includes(status)
  ) {

    throw new Error(
      "Invalid Student Status"
    );

  }


  return await updateStudentStatus(
    id,
    status
  );

};


// =========================================================
// DELETE STUDENT
// =========================================================

const deleteStudentService =
async (
  id
) => {

  const student =
    await getStudentById(
      id
    );


  if (!student) {

    throw new Error(
      "Student Not Found"
    );

  }


  return await deleteStudent(
    id
  );

};


// =========================================================
// PAGINATION
// =========================================================

const getStudentsWithPaginationService =
async (
  limit,
  offset
) => {

  return await getStudentsWithPagination(
    limit,
    offset
  );

};


// =========================================================
// SEARCH STUDENTS
// =========================================================

const searchStudentsService =
async (
  search
) => {

  if (
    !search ||
    !search.trim()
  ) {

    return [];

  }


  return await searchStudents(
    search.trim()
  );

};


// =========================================================
// STUDENT LOGIN
// =========================================================

const loginStudentService =
async (
  rollNumber,
  password
) => {

  const student =
    await findStudentByRollNumber(
      rollNumber
    );


  if (!student) {

    throw new Error(
      "Invalid Roll Number"
    );

  }


  if (
    student.status !==
    "ACTIVE"
  ) {

    throw new Error(
      "Student Account is Inactive"
    );

  }


  const isMatch =
    await bcrypt.compare(
      password,
      student.password
    );


  if (!isMatch) {

    throw new Error(
      "Invalid Password"
    );

  }


  const token =
    jwt.sign(
      {
        id: student.id,

        school_id:
          student.school_id,

        branch_id:
          student.branch_id,

        role:
          "STUDENT"
      },

      process.env.JWT_SECRET,

      {
        expiresIn:
          "1d"
      }
    );


  return token;

};


// =========================================================
// CHANGE STUDENT PASSWORD
// =========================================================

const changeStudentPasswordService =
async (
  studentId,
  oldPassword,
  newPassword
) => {

  if (
    !oldPassword ||
    !newPassword
  ) {

    throw new Error(
      "Old Password and New Password are required"
    );

  }


  if (
    newPassword.length < 6
  ) {

    throw new Error(
      "New Password must be at least 6 characters"
    );

  }


  const student =
    await getStudentPasswordById(
      studentId
    );


  if (!student) {

    throw new Error(
      "Student Not Found"
    );

  }


  const isMatch =
    await bcrypt.compare(
      oldPassword,
      student.password
    );


  if (!isMatch) {

    throw new Error(
      "Old Password Incorrect"
    );

  }


  const hashedPassword =
    await bcrypt.hash(
      newPassword,
      10
    );


  await updateStudentPassword(
    studentId,
    hashedPassword
  );


  return {

    message:
      "Password Changed Successfully"

  };

};


// =========================================================
// STUDENT DASHBOARD
// =========================================================

const getStudentDashboardService =
async (
  studentId
) => {

  const profile =
    await getStudentDashboardProfile(
      studentId
    );


  if (!profile) {

    throw new Error(
      "Student Not Found"
    );

  }


  const subjects =
    await getStudentDashboardSubjects(
      studentId
    );


  const attendance =
    await getStudentDashboardAttendance(
      studentId
    );


  const marks =
    await getStudentDashboardMarks(
      studentId
    );


  const fees =
    await getStudentDashboardFees(
      studentId
    );


  return {

    profile,

    subjects,

    attendance,

    marks,

    fees

  };

};


// =========================================================
// EXPORTS
// =========================================================
// =========================================================
// STUDENT PORTAL - MY CLASS
// =========================================================

const getStudentMyClassService = async (
  studentId
) => {

  const data =
    await getStudentMyClass(
      studentId
    );

  if (!data) {
    throw new Error(
      "Student class details not found"
    );
  }

  return data;
};


// =========================================================
// STUDENT PORTAL - CLASSMATES
// =========================================================

const getStudentClassmatesService = async (
  studentId
) => {

  return await getStudentClassmates(
    studentId
  );

};


// =========================================================
// STUDENT PORTAL - MY SUBJECTS
// =========================================================

const getStudentMySubjectsService = async (
  studentId
) => {

  return await getStudentMySubjects(
    studentId
  );

};


// =========================================================
// STUDENT PORTAL - MY TIMETABLE
// =========================================================

const getStudentMyTimetableService = async (
  studentId
) => {

  return await getStudentMyTimetable(
    studentId
  );

};


// =========================================================
// STUDENT PORTAL - MY ATTENDANCE
// =========================================================

const getStudentMyAttendanceService = async (
  studentId
) => {

  return await getStudentMyAttendance(
    studentId
  );

};


module.exports = {

  createStudentService,

  getAllStudentsService,

  getStudentByIdService,

  updateStudentService,

  updateStudentStatusService,

  deleteStudentService,

  getStudentsWithPaginationService,

  searchStudentsService,

  loginStudentService,

  getStudentDashboardService,
  getStudentMyClassService,
  getStudentClassmatesService,
  getStudentMySubjectsService,
  getStudentMyTimetableService,
  getStudentMyAttendanceService,

  changeStudentPasswordService

};