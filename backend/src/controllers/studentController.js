const {
  createStudentService,
  getAllStudentsService,
  getStudentByIdService,
  updateStudentService,
  updateStudentStatusService,
  deleteStudentService,
  getStudentsWithPaginationService,
  searchStudentsService,
  loginStudentService,
  changeStudentPasswordService,
  getStudentDashboardService,
  getStudentMyClassService,
  getStudentClassmatesService,
  getStudentMySubjectsService,
  getStudentMyTimetableService,
  getStudentMyAttendanceService

} = require("../services/studentService");


// =========================================================
// CREATE STUDENT
// =========================================================

const createStudent = async (
  req,
  res
) => {

  try {

    const result =
      await createStudentService(
        req.body
      );

    return res.status(201).json({

      success: true,

      data: result

    });

  } catch (error) {

    console.error(
      "CREATE STUDENT ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};


// =========================================================
// GET ALL STUDENTS
// =========================================================

const getAllStudents = async (
  req,
  res
) => {

  try {

    const students =
      await getAllStudentsService(
        req.user
      );

    return res.status(200).json({

      success: true,

      data: students

    });

  } catch (error) {

    console.error(
      "GET STUDENTS ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};


// =========================================================
// GET STUDENT BY ID
// =========================================================

const getStudentById = async (
  req,
  res
) => {

  try {

    const student =
      await getStudentByIdService(
        req.params.id
      );

    if (!student) {

      return res.status(404).json({

        success: false,

        message:
          "Student Not Found"

      });

    }

    return res.status(200).json({

      success: true,

      data: student

    });

  } catch (error) {

    console.error(
      "GET STUDENT BY ID ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};


// =========================================================
// UPDATE STUDENT
// =========================================================

const updateStudent = async (
  req,
  res
) => {

  try {

    const result =
      await updateStudentService(
        req.params.id,
        req.body
      );

    if (
      result.affectedRows === 0
    ) {

      return res.status(404).json({

        success: false,

        message:
          "Student Not Found"

      });

    }

    return res.status(200).json({

      success: true,

      message:
        "Student Updated Successfully"

    });

  } catch (error) {

    console.error(
      "UPDATE STUDENT ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};


// =========================================================
// UPDATE STUDENT STATUS
// =========================================================

const updateStudentStatus = async (
  req,
  res
) => {

  try {

    const result =
      await updateStudentStatusService(
        req.params.id,
        req.body.status
      );

    if (
      result.affectedRows === 0
    ) {

      return res.status(404).json({

        success: false,

        message:
          "Student Not Found"

      });

    }

    return res.status(200).json({

      success: true,

      message:
        "Student Status Updated Successfully"

    });

  } catch (error) {

    console.error(
      "UPDATE STUDENT STATUS ERROR:",
      error
    );

    return res.status(400).json({

      success: false,

      message:
        error.message

    });

  }

};


// =========================================================
// DELETE STUDENT
// =========================================================

const deleteStudent = async (
  req,
  res
) => {

  try {

    const result =
      await deleteStudentService(
        req.params.id
      );

    return res.status(200).json({

      success: true,

      data: result

    });

  } catch (error) {

    console.error(
      "DELETE STUDENT ERROR:",
      error
    );

    if (
      error.message ===
      "Student Not Found"
    ) {

      return res.status(404).json({

        success: false,

        message:
          error.message

      });

    }

    return res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};


// =========================================================
// PAGINATION
// =========================================================

const getStudentsWithPagination =
async (
  req,
  res
) => {

  try {

    const page =
      Number(
        req.query.page
      ) || 1;

    const limit =
      Number(
        req.query.limit
      ) || 10;

    const offset =
      (page - 1) *
      limit;

    const students =
      await getStudentsWithPaginationService(
        limit,
        offset
      );

    return res.status(200).json({

      success: true,

      data: students,

      pagination: {

        page,

        limit,

        offset

      }

    });

  } catch (error) {

    console.error(
      "STUDENT PAGINATION ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};


// =========================================================
// SEARCH STUDENTS
// =========================================================

const searchStudents = async (
  req,
  res
) => {

  try {

    const students =
      await searchStudentsService(
        req.query.search
      );

    return res.status(200).json({

      success: true,

      data: students

    });

  } catch (error) {

    console.error(
      "SEARCH STUDENTS ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};


// =========================================================
// STUDENT LOGIN
// =========================================================

const loginStudent = async (
  req,
  res
) => {

  try {

    const {
      roll_number,
      password
    } = req.body;

    if (
      !roll_number ||
      !password
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Roll Number and Password are required"

      });

    }

    const token =
      await loginStudentService(
        roll_number,
        password
      );

    return res.status(200).json({

      success: true,

      token,

      role:
        "STUDENT"

    });

  } catch (error) {

    console.error(
      "STUDENT LOGIN ERROR:",
      error
    );

    return res.status(400).json({

      success: false,

      message:
        error.message

    });

  }

};


// =========================================================
// STUDENT PROFILE
// =========================================================

const getStudentProfile = async (
  req,
  res
) => {

  try {

    const student =
      await getStudentByIdService(
        req.user.id
      );

    if (!student) {

      return res.status(404).json({

        success: false,

        message:
          "Student Not Found"

      });

    }

    return res.status(200).json({

      success: true,

      data: student

    });

  } catch (error) {

    console.error(
      "STUDENT PROFILE ERROR:",
      error
    );

    return res.status(400).json({

      success: false,

      message:
        error.message

    });

  }

};


// =========================================================
// UPDATE STUDENT PROFILE
// =========================================================

const updateStudentProfile = async (
  req,
  res
) => {

  try {

    const result =
      await updateStudentService(
        req.user.id,
        req.body
      );

    if (
      result.affectedRows === 0
    ) {

      return res.status(404).json({

        success: false,

        message:
          "Student Not Found"

      });

    }

    return res.status(200).json({

      success: true,

      message:
        "Profile Updated Successfully"

    });

  } catch (error) {

    console.error(
      "UPDATE STUDENT PROFILE ERROR:",
      error
    );

    return res.status(400).json({

      success: false,

      message:
        error.message

    });

  }

};


// =========================================================
// CHANGE STUDENT PASSWORD
// =========================================================

const changeStudentPassword = async (
  req,
  res
) => {

  try {

    const {
      oldPassword,
      newPassword
    } = req.body;

    const result =
      await changeStudentPasswordService(
        req.user.id,
        oldPassword,
        newPassword
      );

    return res.status(200).json({

      success: true,

      data: result

    });

  } catch (error) {

    console.error(
      "CHANGE STUDENT PASSWORD ERROR:",
      error
    );

    return res.status(400).json({

      success: false,

      message:
        error.message

    });

  }

};


// =========================================================
// STUDENT DASHBOARD
// =========================================================

const getStudentDashboard = async (
  req,
  res
) => {

  try {

    const dashboard =
      await getStudentDashboardService(
        req.user.id
      );

    return res.status(200).json({

      success: true,

      data: dashboard

    });

  } catch (error) {

    console.error(
      "STUDENT DASHBOARD ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};

// =========================================================
// STUDENT PORTAL - MY CLASS
// =========================================================

const getStudentMyClass = async (
  req,
  res
) => {

  try {

    const data =
      await getStudentMyClassService(
        req.user.id
      );

    return res.status(200).json({
      success: true,
      data
    });

  } catch (error) {

    console.error(
      "MY CLASS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// =========================================================
// STUDENT PORTAL - CLASSMATES
// =========================================================

const getStudentClassmates = async (
  req,
  res
) => {

  try {

    const data =
      await getStudentClassmatesService(
        req.user.id
      );

    return res.status(200).json({
      success: true,
      data
    });

  } catch (error) {

    console.error(
      "CLASSMATES ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// =========================================================
// STUDENT PORTAL - MY SUBJECTS
// =========================================================

const getStudentMySubjects = async (
  req,
  res
) => {

  try {

    const data =
      await getStudentMySubjectsService(
        req.user.id
      );

    return res.status(200).json({
      success: true,
      data
    });

  } catch (error) {

    console.error(
      "MY SUBJECTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// =========================================================
// STUDENT PORTAL - MY TIMETABLE
// =========================================================

const getStudentMyTimetable = async (
  req,
  res
) => {

  try {

    const data =
      await getStudentMyTimetableService(
        req.user.id
      );

    return res.status(200).json({
      success: true,
      data
    });

  } catch (error) {

    console.error(
      "MY TIMETABLE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// =========================================================
// STUDENT PORTAL - MY ATTENDANCE
// =========================================================

const getStudentMyAttendance = async (
  req,
  res
) => {

  try {

    const data =
      await getStudentMyAttendanceService(
        req.user.id
      );

    return res.status(200).json({
      success: true,
      data
    });

  } catch (error) {

    console.error(
      "MY ATTENDANCE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// =========================================================
// EXPORTS
// =========================================================

module.exports = {

  createStudent,

  getAllStudents,

  getStudentById,

  updateStudent,

  updateStudentProfile,

  updateStudentStatus,

  deleteStudent,

  getStudentsWithPagination,

  searchStudents,

  loginStudent,

  getStudentProfile,

  getStudentDashboard,

  changeStudentPassword,
  getStudentMyClass,
  getStudentClassmates,
  getStudentMySubjects,
  getStudentMyTimetable,
  getStudentMyAttendance

};