const express = require("express");

const router = express.Router();

const {
  createTeacherSubject,
  getAllTeacherSubjects,
  getSubjectsByTeacher,
  deleteTeacherSubject
} = require("../controllers/teacherSubjectController");

const authMiddleware =
  require("../middlewares/authMiddleware");

const authorizeRoles =
  require("../middlewares/roleMiddleware");

// =====================================================
// CREATE TEACHER SUBJECT MAPPING
// =====================================================

router.post(
  "/",
  authMiddleware,
  authorizeRoles(
    "SUPER_ADMIN",
    "SCHOOL_ADMIN"
  ),
  createTeacherSubject
);

// =====================================================
// GET ALL MAPPINGS
// =====================================================

router.get(
  "/",
  authMiddleware,
  getAllTeacherSubjects
);

// =====================================================
// GET SUBJECTS BY TEACHER
// =====================================================

router.get(
  "/teacher/:staffId",
  authMiddleware,
  getSubjectsByTeacher
);

// =====================================================
// DELETE MAPPING
// =====================================================

router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles(
    "SUPER_ADMIN",
    "SCHOOL_ADMIN"
  ),
  deleteTeacherSubject
);

module.exports = router;