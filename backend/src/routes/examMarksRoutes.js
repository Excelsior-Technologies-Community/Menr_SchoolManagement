const express = require("express");

const router = express.Router();

const {
  createExamMark,
  getAllExamMarks,
  getExamMarkById,
  getExamMarksByStudent,
  getExamMarksByExam,
  updateExamMark,
  deleteExamMark
} = require(
  "../controllers/examMarksController"
);

const authMiddleware =
  require("../middlewares/authMiddleware");


// =========================================================
// CREATE
// =========================================================

router.post(
  "/",
  authMiddleware,
  createExamMark
);


// =========================================================
// GET ALL
// =========================================================

router.get(
  "/",
  authMiddleware,
  getAllExamMarks
);


// =========================================================
// GET BY STUDENT
// =========================================================

router.get(
  "/student/:studentId",
  authMiddleware,
  getExamMarksByStudent
);


// =========================================================
// GET BY EXAM
// =========================================================

router.get(
  "/exam/:examId",
  authMiddleware,
  getExamMarksByExam
);


// =========================================================
// GET BY ID
// =========================================================

router.get(
  "/:id",
  authMiddleware,
  getExamMarkById
);


// =========================================================
// UPDATE
// =========================================================

router.put(
  "/:id",
  authMiddleware,
  updateExamMark
);


// =========================================================
// DELETE
// =========================================================

router.delete(
  "/:id",
  authMiddleware,
  deleteExamMark
);


module.exports = router;