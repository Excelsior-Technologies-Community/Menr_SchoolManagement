const express =
  require("express");

const router =
  express.Router();


const {

  markAttendance,

  updateAttendance,

  getAllAttendance,

  getAttendanceByGroup

} = require(
  "../controllers/attendanceController"
);


const authMiddleware =
  require(
    "../middlewares/authMiddleware"
  );


const authorizeRoles =
  require(
    "../middlewares/roleMiddleware"
  );


// =========================================================
// GET GROUP ATTENDANCE
// =========================================================

router.get(
  "/group",

  authMiddleware,

  authorizeRoles(
    "SUPER_ADMIN",
    "SCHOOL_ADMIN",
    "STAFF"
  ),

  getAttendanceByGroup
);


// =========================================================
// GET ALL
// =========================================================

router.get(
  "/",

  authMiddleware,

  authorizeRoles(
    "SUPER_ADMIN",
    "SCHOOL_ADMIN",
    "STAFF"
  ),

  getAllAttendance
);


// =========================================================
// MARK
// =========================================================

router.post(
  "/",

  authMiddleware,

  authorizeRoles(
    "SUPER_ADMIN",
    "SCHOOL_ADMIN",
    "STAFF"
  ),

  markAttendance
);


// =========================================================
// UPDATE
// =========================================================

router.put(
  "/:id",

  authMiddleware,

  authorizeRoles(
    "SUPER_ADMIN",
    "SCHOOL_ADMIN",
    "STAFF"
  ),

  updateAttendance
);


module.exports = router;