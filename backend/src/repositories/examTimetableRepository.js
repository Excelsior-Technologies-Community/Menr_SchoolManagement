const pool = require("../config/db");


// =========================================================
// CHECK DUPLICATE EXAM TIMETABLE
// =========================================================

const checkDuplicateExamTimetable = async (
  data,
  excludeId = null
) => {

  let query = `
    SELECT exam_timetable_id
    FROM tbl_exam_timetable
    WHERE exam_id = ?
      AND subject_id = ?
      AND batch_id = ?
      AND status = 'active'
  `;

  const params = [
    data.exam_id,
    data.subject_id,
    data.batch_id
  ];

  if (excludeId) {

    query += `
      AND exam_timetable_id != ?
    `;

    params.push(excludeId);

  }

  const [rows] =
    await pool.query(
      query,
      params
    );

  return rows[0];

};


// =========================================================
// CHECK BATCH DATE/TIME CONFLICT
// =========================================================

const checkBatchTimeConflict = async (
  data,
  excludeId = null
) => {

  let query = `
    SELECT exam_timetable_id
    FROM tbl_exam_timetable
    WHERE batch_id = ?
      AND exam_date = ?
      AND status = 'active'
      AND start_time < ?
      AND end_time > ?
  `;

  const params = [
    data.batch_id,
    data.exam_date,
    data.end_time,
    data.start_time
  ];

  if (excludeId) {

    query += `
      AND exam_timetable_id != ?
    `;

    params.push(excludeId);

  }

  const [rows] =
    await pool.query(
      query,
      params
    );

  return rows[0];

};


// =========================================================
// CHECK SUPERVISOR TIME CONFLICT
// =========================================================

const checkSupervisorTimeConflict = async (
  data,
  excludeId = null
) => {

  let query = `
    SELECT exam_timetable_id
    FROM tbl_exam_timetable
    WHERE supervisor_id = ?
      AND exam_date = ?
      AND status = 'active'
      AND start_time < ?
      AND end_time > ?
  `;

  const params = [
    data.supervisor_id,
    data.exam_date,
    data.end_time,
    data.start_time
  ];

  if (excludeId) {

    query += `
      AND exam_timetable_id != ?
    `;

    params.push(excludeId);

  }

  const [rows] =
    await pool.query(
      query,
      params
    );

  return rows[0];

};


// =========================================================
// CREATE EXAM TIMETABLE
// =========================================================

const createExamTimetable = async (
  data
) => {

  const [result] =
    await pool.query(
      `INSERT INTO tbl_exam_timetable
      (
        exam_id,
        subject_id,
        batch_id,
        school_id,
        exam_date,
        start_time,
        end_time,
        room_number,
        supervisor_id,
        status,
        created_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.exam_id,
        data.subject_id,
        data.batch_id,
        data.school_id,
        data.exam_date,
        data.start_time,
        data.end_time,
        data.room_number,
        data.supervisor_id,
        data.status,
        data.created_by
      ]
    );

  return result;

};


// =========================================================
// GET ALL EXAM TIMETABLES
// =========================================================

const getAllExamTimetables = async () => {

  const [rows] =
    await pool.query(
      `SELECT
        ett.exam_timetable_id,
        ett.exam_id,
        e.exam_name,

        ett.subject_id,
        s.subject_name,

        ett.batch_id,
        b.batch_code,

        ett.school_id,
        sc.school_name,

        ett.exam_date,
        ett.start_time,
        ett.end_time,
        ett.room_number,

        ett.supervisor_id,
        st.full_name AS supervisor_name,

        ett.status,
        ett.created_at,
        ett.updated_at

      FROM tbl_exam_timetable ett

      INNER JOIN exams e
        ON ett.exam_id = e.id

      INNER JOIN subjects s
        ON ett.subject_id = s.id

      INNER JOIN tbl_batches b
        ON ett.batch_id = b.batch_id

      INNER JOIN school sc
        ON ett.school_id = sc.id

      INNER JOIN staff st
        ON ett.supervisor_id = st.id

      ORDER BY
        ett.exam_timetable_id DESC`
    );

  return rows;

};


// =========================================================
// GET EXAM TIMETABLE BY ID
// =========================================================

const getExamTimetableById = async (
  id
) => {

  const [rows] =
    await pool.query(
      `SELECT
        ett.exam_timetable_id,
        ett.exam_id,
        e.exam_name,

        ett.subject_id,
        s.subject_name,

        ett.batch_id,
        b.batch_code,

        ett.school_id,
        sc.school_name,

        ett.exam_date,
        ett.start_time,
        ett.end_time,
        ett.room_number,

        ett.supervisor_id,
        st.full_name AS supervisor_name,

        ett.status,
        ett.created_at,
        ett.updated_at

      FROM tbl_exam_timetable ett

      INNER JOIN exams e
        ON ett.exam_id = e.id

      INNER JOIN subjects s
        ON ett.subject_id = s.id

      INNER JOIN tbl_batches b
        ON ett.batch_id = b.batch_id

      INNER JOIN school sc
        ON ett.school_id = sc.id

      INNER JOIN staff st
        ON ett.supervisor_id = st.id

      WHERE ett.exam_timetable_id = ?`,
      [id]
    );

  return rows[0];

};


// =========================================================
// UPDATE EXAM TIMETABLE
// =========================================================

const updateExamTimetable = async (
  id,
  data
) => {

  const [result] =
    await pool.query(
      `UPDATE tbl_exam_timetable
       SET
        exam_id = ?,
        subject_id = ?,
        batch_id = ?,
        school_id = ?,
        exam_date = ?,
        start_time = ?,
        end_time = ?,
        room_number = ?,
        supervisor_id = ?,
        updated_by = ?,
        updated_at = NOW()

       WHERE exam_timetable_id = ?`,
      [
        data.exam_id,
        data.subject_id,
        data.batch_id,
        data.school_id,
        data.exam_date,
        data.start_time,
        data.end_time,
        data.room_number,
        data.supervisor_id,
        data.updated_by,
        id
      ]
    );

  return result;

};


// =========================================================
// DELETE EXAM TIMETABLE
// =========================================================

const deleteExamTimetable = async (
  id
) => {

  const [result] =
    await pool.query(
      `DELETE FROM tbl_exam_timetable
       WHERE exam_timetable_id = ?`,
      [id]
    );

  return result;

};


// =========================================================
// EXPORTS
// =========================================================

module.exports = {

  createExamTimetable,

  getAllExamTimetables,

  getExamTimetableById,

  updateExamTimetable,

  deleteExamTimetable,

  checkDuplicateExamTimetable,

  checkBatchTimeConflict,

  checkSupervisorTimeConflict

};