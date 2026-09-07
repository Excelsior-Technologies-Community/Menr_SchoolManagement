const express = require("express");

const router = express.Router();

const {
  createExamResult,
  getAllExamResults,
  getExamResultById,
  getResultsByStudent,
  getResultsByExam,
  updateExamResult,
  deleteExamResult,
} = require("../controllers/examResultController");

// IMPORTANT:
// Project me folder "middlewares" hai, "middleware" nahi.
const authMiddleware = require(
  "../middlewares/authMiddleware"
);


// =========================================================
// CREATE EXAM RESULT
// =========================================================

router.post(
  "/",
  authMiddleware,
  createExamResult
);


// =========================================================
// GET ALL EXAM RESULTS
// =========================================================

router.get(
  "/",
  authMiddleware,
  getAllExamResults
);


// =========================================================
// GET RESULTS BY STUDENT
// =========================================================

router.get(
  "/student/:studentId",
  authMiddleware,
  getResultsByStudent
);


// =========================================================
// GET RESULTS BY EXAM
// =========================================================

router.get(
  "/exam/:examId",
  authMiddleware,
  getResultsByExam
);


// =========================================================
// GET RESULT BY ID
// =========================================================

router.get(
  "/:id",
  authMiddleware,
  getExamResultById
);


// =========================================================
// UPDATE EXAM RESULT
// =========================================================

router.put(
  "/:id",
  authMiddleware,
  updateExamResult
);


// =========================================================
// DELETE EXAM RESULT
// =========================================================

router.delete(
  "/:id",
  authMiddleware,
  deleteExamResult
);


module.exports = router;