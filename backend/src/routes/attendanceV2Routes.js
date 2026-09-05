const express =
  require("express");

const router =
  express.Router();

const {

  // Student Attendance
  createAttendance,
  getAllAttendance,
  getAttendanceByStudent,
  getAttendanceByDate,

  // Class Attendance Status
  getAllClassAttendanceStatus,
  getClassAttendanceStatus,
  createClassAttendanceStatus,
  updateClassAttendanceStatus

} = require(
  "../controllers/attendanceV2Controller"
);

const authMiddleware =
  require("../middlewares/authMiddleware");

const authorizeRoles =
  require("../middlewares/roleMiddleware");


// =========================================================
// STUDENT ATTENDANCE
// =========================================================


// Mark Student Attendance

router.post(
  "/",

  authMiddleware,

  authorizeRoles(
    "SUPER_ADMIN",
    "SCHOOL_ADMIN",
    "STAFF"
  ),

  createAttendance
);


// Get All Student Attendance

router.get(
  "/",

  authMiddleware,

  getAllAttendance
);


// Get Attendance By Student

router.get(
  "/student/:studentId",

  authMiddleware,

  getAttendanceByStudent
);


// Get Attendance By Date

router.get(
  "/date/:date",

  authMiddleware,

  getAttendanceByDate
);


// =========================================================
// CLASS ATTENDANCE STATUS
// =========================================================


// Get All Class Attendance Status

router.get(
  "/class-status",

  authMiddleware,

  authorizeRoles(
    "SUPER_ADMIN",
    "SCHOOL_ADMIN",
    "STAFF"
  ),

  getAllClassAttendanceStatus
);


// Get Class Attendance Status
// class + section + date

router.get(
  "/class-status/:classId/:sectionId/:date",

  authMiddleware,

  authorizeRoles(
    "SUPER_ADMIN",
    "SCHOOL_ADMIN",
    "STAFF"
  ),

  getClassAttendanceStatus
);


// Create Class Attendance Status
// Initial status = Pending

router.post(
  "/class-status",

  authMiddleware,

  authorizeRoles(
    "SUPER_ADMIN",
    "SCHOOL_ADMIN",
    "STAFF"
  ),

  createClassAttendanceStatus
);


// Update / Submit Class Attendance Status

router.put(
  "/class-status/:id",

  authMiddleware,

  authorizeRoles(
    "SUPER_ADMIN",
    "SCHOOL_ADMIN",
    "STAFF"
  ),

  updateClassAttendanceStatus
);


module.exports = router;