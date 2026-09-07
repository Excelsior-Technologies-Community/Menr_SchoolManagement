const db = require("../config/db");

// =========================================================
// GET STUDENT BY ID
// =========================================================

const getStudentById = async (studentId) => {
  const [rows] = await db.query(
    `
    SELECT
      id,
      school_id,
      branch_id,
      batch_id,
      status,
      full_name
    FROM student
    WHERE id = ?
    LIMIT 1
    `,
    [studentId]
  );

  return rows[0] || null;
};

// =========================================================
// GET EXAM BY ID
// =========================================================

const getExamById = async (examId) => {
  const [rows] = await db.query(
    `
    SELECT
      id,
      school_id,
      start_date,
      end_date,
      status
    FROM exams
    WHERE id = ?
    LIMIT 1
    `,
    [examId]
  );

  return rows[0] || null;
};

// =========================================================
// GET STUDENT EXAM MARKS
// =========================================================

const getStudentExamMarks = async (
  studentId,
  examId
) => {
  const [rows] = await db.query(
    `
    SELECT
      mark_id,
      exam_id,
      student_id,
      exam_subject_id,
      marks_obtained,
      grade_id,
      remarks,
      status,
      result_status,
      attempt_number,
      is_supplementary,
      grace_marks,
      exam_attendance_status
    FROM tbl_exam_marks
    WHERE student_id = ?
      AND exam_id = ?
      AND status = 'active'
    ORDER BY mark_id ASC
    `,
    [studentId, examId]
  );

  return rows;
};

// =========================================================
// GET EXISTING RESULT
// =========================================================

const getExistingResult = async (
  studentId,
  examId,
  attemptType = "Regular"
) => {
  const [rows] = await db.query(
    `
    SELECT *
    FROM tbl_exam_results
    WHERE student_id = ?
      AND exam_id = ?
      AND attempt_type = ?
    LIMIT 1
    `,
    [
      studentId,
      examId,
      attemptType,
    ]
  );

  return rows[0] || null;
};

// =========================================================
// CREATE EXAM RESULT
// =========================================================

const createExamResult = async (data) => {
  const {
    student_id,
    exam_id,
    total_marks,
    percentage,
    grade,
    gpa,
    remark,
    status,
    created_by,
    attempt_type,
  } = data;

  const [result] = await db.query(
    `
    INSERT INTO tbl_exam_results (
      student_id,
      exam_id,
      total_marks,
      percentage,
      grade,
      gpa,
      remark,
      status,
      created_by,
      attempt_type
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      student_id,
      exam_id,
      total_marks,
      percentage,
      grade,
      gpa,
      remark || null,
      status || "active",
      created_by || null,
      attempt_type || "Regular",
    ]
  );

  return result.insertId;
};

// =========================================================
// GET ALL EXAM RESULTS
// =========================================================

const getAllExamResults = async () => {
  const [rows] = await db.query(
    `
    SELECT
      r.result_id,
      r.student_id,
      r.exam_id,
      r.total_marks,
      r.percentage,
      r.grade,
      r.gpa,
      r.remark,
      r.status,
      r.created_at,
      r.updated_at,
      r.created_by,
      r.updated_by,
      r.attempt_type,

      s.id AS student_id,
      s.full_name AS student_name,

      e.id AS exam_id,
      e.exam_name AS exam_name

    FROM tbl_exam_results r

    INNER JOIN student s
      ON s.id = r.student_id

    INNER JOIN exams e
      ON e.id = r.exam_id

    ORDER BY r.result_id DESC
    `
  );

  return rows;
};

// =========================================================
// GET EXAM RESULT BY ID
// =========================================================

const getExamResultById = async (
  resultId
) => {
  const [rows] = await db.query(
    `
    SELECT
      r.result_id,
      r.student_id,
      r.exam_id,
      r.total_marks,
      r.percentage,
      r.grade,
      r.gpa,
      r.remark,
      r.status,
      r.created_at,
      r.updated_at,
      r.created_by,
      r.updated_by,
      r.attempt_type,

      s.id AS student_id,
      s.full_name AS student_name,

      e.id AS exam_id,
      e.exam_name AS exam_name

    FROM tbl_exam_results r

    INNER JOIN student s
      ON s.id = r.student_id

    INNER JOIN exams e
      ON e.id = r.exam_id

    WHERE r.result_id = ?

    LIMIT 1
    `,
    [resultId]
  );

  return rows[0] || null;
};

// =========================================================
// GET RESULTS BY STUDENT
// =========================================================

const getResultsByStudent = async (
  studentId
) => {
  const [rows] = await db.query(
    `
    SELECT
      r.result_id,
      r.student_id,
      r.exam_id,
      r.total_marks,
      r.percentage,
      r.grade,
      r.gpa,
      r.remark,
      r.status,
      r.created_at,
      r.updated_at,
      r.created_by,
      r.updated_by,
      r.attempt_type,

      s.id AS student_id,
      s.full_name AS student_name,

      e.id AS exam_id,
      e.exam_name AS exam_name

    FROM tbl_exam_results r

    INNER JOIN student s
      ON s.id = r.student_id

    INNER JOIN exams e
      ON e.id = r.exam_id

    WHERE r.student_id = ?

    ORDER BY r.result_id DESC
    `,
    [studentId]
  );

  return rows;
};

// =========================================================
// GET RESULTS BY EXAM
// =========================================================

const getResultsByExam = async (
  examId
) => {
  const [rows] = await db.query(
    `
    SELECT
      r.result_id,
      r.student_id,
      r.exam_id,
      r.total_marks,
      r.percentage,
      r.grade,
      r.gpa,
      r.remark,
      r.status,
      r.created_at,
      r.updated_at,
      r.created_by,
      r.updated_by,
      r.attempt_type,

      s.id AS student_id,
      s.full_name AS student_name,

      e.id AS exam_id,
      e.exam_name AS exam_name

    FROM tbl_exam_results r

    INNER JOIN student s
      ON s.id = r.student_id

    INNER JOIN exams e
      ON e.id = r.exam_id

    WHERE r.exam_id = ?

    ORDER BY r.result_id DESC
    `,
    [examId]
  );

  return rows;
};

// =========================================================
// UPDATE EXAM RESULT
// =========================================================

const updateExamResult = async (
  resultId,
  data
) => {
  const {
    total_marks,
    percentage,
    grade,
    gpa,
    remark,
    status,
    updated_by,
    attempt_type,
  } = data;

  await db.query(
    `
    UPDATE tbl_exam_results
    SET
      total_marks = ?,
      percentage = ?,
      grade = ?,
      gpa = ?,
      remark = ?,
      status = ?,
      updated_by = ?,
      attempt_type = ?
    WHERE result_id = ?
    `,
    [
      total_marks,
      percentage,
      grade,
      gpa,
      remark || null,
      status || "active",
      updated_by || null,
      attempt_type || "Regular",
      resultId,
    ]
  );

  return getExamResultById(resultId);
};

// =========================================================
// DELETE / SOFT DELETE EXAM RESULT
// =========================================================

const deleteExamResult = async (
  resultId,
  updatedBy
) => {
  await db.query(
    `
    UPDATE tbl_exam_results
    SET
      status = 'inactive',
      updated_by = ?
    WHERE result_id = ?
    `,
    [
      updatedBy || null,
      resultId,
    ]
  );

  return true;
};

// =========================================================
// EXPORTS
// =========================================================

module.exports = {
  getStudentById,
  getExamById,
  getStudentExamMarks,
  getExistingResult,
  createExamResult,
  getAllExamResults,
  getExamResultById,
  getResultsByStudent,
  getResultsByExam,
  updateExamResult,
  deleteExamResult,
};