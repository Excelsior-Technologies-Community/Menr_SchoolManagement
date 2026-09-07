const pool = require("../config/db");


// =========================================================
// EXAM
// =========================================================

const getExamById = async (examId) => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      school_id,
      exam_name,
      start_date,
      end_date
    FROM exams
    WHERE id = ?
    LIMIT 1
    `,
    [examId]
  );

  return rows[0] || null;
};


// =========================================================
// STUDENT
// =========================================================

const getStudentById = async (studentId) => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      school_id,
      batch_id,
      status,
      full_name,
      roll_number
    FROM student
    WHERE id = ?
    LIMIT 1
    `,
    [studentId]
  );

  return rows[0] || null;
};


// =========================================================
// SUBJECT
// =========================================================

const getSubjectById = async (subjectId) => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      subject_name,
      subject_code,
      status
    FROM subjects
    WHERE id = ?
    LIMIT 1
    `,
    [subjectId]
  );

  return rows[0] || null;
};


// =========================================================
// CHECK EXAM SUBJECT
// =========================================================

const checkExamSubject = async (
  examId,
  subjectId
) => {

  const [rows] = await pool.query(
    `
    SELECT
      exam_timetable_id,
      exam_id,
      subject_id,
      batch_id,
      school_id,
      exam_date,
      status
    FROM tbl_exam_timetable
    WHERE
      exam_id = ?
      AND subject_id = ?
      AND status = 'active'
    ORDER BY exam_timetable_id ASC
    LIMIT 1
    `,
    [
      examId,
      subjectId
    ]
  );

  return rows[0] || null;
};


// =========================================================
// DUPLICATE MARK
// =========================================================

const checkDuplicateExamMark = async (
  data,
  excludeId = null
) => {

  let query = `
    SELECT mark_id
    FROM tbl_exam_marks
    WHERE
      exam_id = ?
      AND student_id = ?
      AND exam_subject_id = ?
      AND attempt_number = ?
      AND is_supplementary = ?
      AND status = 'active'
  `;

  const params = [
    data.exam_id,
    data.student_id,
    data.exam_subject_id,
    data.attempt_number,
    data.is_supplementary ? 1 : 0
  ];

  if (excludeId) {
    query += ` AND mark_id != ?`;
    params.push(excludeId);
  }

  query += ` LIMIT 1`;

  const [rows] = await pool.query(
    query,
    params
  );

  return rows[0] || null;
};


// =========================================================
// CREATE
// =========================================================

const createExamMark = async (data) => {

  const [result] = await pool.query(
    `
    INSERT INTO tbl_exam_marks
    (
      exam_id,
      student_id,
      exam_subject_id,
      marks_obtained,
      grade_id,
      remarks,
      status,
      created_by,
      result_status,
      attempt_number,
      is_supplementary,
      grace_marks,
      exam_attendance_status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.exam_id,
      data.student_id,
      data.exam_subject_id,
      JSON.stringify(data.marks_obtained),
      data.grade_id || null,
      data.remarks || null,
      data.status || "active",
      data.created_by || null,
      data.result_status,
      data.attempt_number,
      data.is_supplementary ? 1 : 0,
      data.grace_marks,
      data.exam_attendance_status
    ]
  );

  return result;
};


// =========================================================
// GET ALL
// =========================================================

const getAllExamMarks = async () => {

  const [rows] = await pool.query(
    `
    SELECT
      em.mark_id,
      em.exam_id,
      em.student_id,
      em.exam_subject_id,

      em.marks_obtained,

      em.grade_id,
      em.remarks,
      em.status,

      em.result_status,
      em.attempt_number,
      em.is_supplementary,
      em.grace_marks,
      em.exam_attendance_status,

      em.created_by,
      em.updated_by,
      em.created_at,
      em.updated_at,

      e.exam_name,

      s.full_name,
      s.roll_number,

      sub.subject_name,
      sub.subject_code

    FROM tbl_exam_marks em

    INNER JOIN exams e
      ON e.id = em.exam_id

    INNER JOIN student s
      ON s.id = em.student_id

    INNER JOIN subjects sub
      ON sub.id = em.exam_subject_id

    ORDER BY em.mark_id DESC
    `
  );

  return rows;
};


// =========================================================
// GET BY ID
// =========================================================

const getExamMarkById = async (markId) => {

  const [rows] = await pool.query(
    `
    SELECT
      em.*,

      e.exam_name,

      s.full_name,
      s.roll_number,

      sub.subject_name,
      sub.subject_code

    FROM tbl_exam_marks em

    INNER JOIN exams e
      ON e.id = em.exam_id

    INNER JOIN student s
      ON s.id = em.student_id

    INNER JOIN subjects sub
      ON sub.id = em.exam_subject_id

    WHERE em.mark_id = ?

    LIMIT 1
    `,
    [markId]
  );

  return rows[0] || null;
};


// =========================================================
// GET BY STUDENT
// =========================================================

const getExamMarksByStudent = async (
  studentId
) => {

  const [rows] = await pool.query(
    `
    SELECT
      em.*,
      e.exam_name,
      sub.subject_name,
      sub.subject_code

    FROM tbl_exam_marks em

    INNER JOIN exams e
      ON e.id = em.exam_id

    INNER JOIN subjects sub
      ON sub.id = em.exam_subject_id

    WHERE em.student_id = ?

    ORDER BY em.mark_id DESC
    `,
    [studentId]
  );

  return rows;
};


// =========================================================
// GET BY EXAM
// =========================================================

const getExamMarksByExam = async (
  examId
) => {

  const [rows] = await pool.query(
    `
    SELECT
      em.*,

      s.full_name,
      s.roll_number,

      sub.subject_name,
      sub.subject_code

    FROM tbl_exam_marks em

    INNER JOIN student s
      ON s.id = em.student_id

    INNER JOIN subjects sub
      ON sub.id = em.exam_subject_id

    WHERE em.exam_id = ?

    ORDER BY
      s.roll_number ASC,
      sub.subject_name ASC
    `,
    [examId]
  );

  return rows;
};


// =========================================================
// UPDATE
// =========================================================

const updateExamMark = async (
  markId,
  data
) => {

  const [result] = await pool.query(
    `
    UPDATE tbl_exam_marks

    SET
      exam_id = ?,
      student_id = ?,
      exam_subject_id = ?,
      marks_obtained = ?,
      grade_id = ?,
      remarks = ?,
      status = ?,
      updated_by = ?,
      result_status = ?,
      attempt_number = ?,
      is_supplementary = ?,
      grace_marks = ?,
      exam_attendance_status = ?

    WHERE mark_id = ?
    `,
    [
      data.exam_id,
      data.student_id,
      data.exam_subject_id,
      JSON.stringify(data.marks_obtained),
      data.grade_id || null,
      data.remarks || null,
      data.status || "active",
      data.updated_by || null,
      data.result_status,
      data.attempt_number,
      data.is_supplementary ? 1 : 0,
      data.grace_marks,
      data.exam_attendance_status,
      markId
    ]
  );

  return result;
};


// =========================================================
// DELETE / INACTIVE
// =========================================================

const deleteExamMark = async (
  markId,
  updatedBy
) => {

  const [result] = await pool.query(
    `
    UPDATE tbl_exam_marks

    SET
      status = 'inactive',
      updated_by = ?

    WHERE mark_id = ?
    `,
    [
      updatedBy || null,
      markId
    ]
  );

  return result;
};


module.exports = {

  getExamById,
  getStudentById,
  getSubjectById,
  checkExamSubject,

  checkDuplicateExamMark,

  createExamMark,

  getAllExamMarks,
  getExamMarkById,
  getExamMarksByStudent,
  getExamMarksByExam,

  updateExamMark,
  deleteExamMark
};