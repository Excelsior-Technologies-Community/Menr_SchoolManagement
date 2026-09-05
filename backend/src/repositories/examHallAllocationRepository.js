const pool = require("../config/db");


// =========================================================
// CHECK EXAM
// =========================================================

const checkExamExists = async (
  examId
) => {

  const [rows] = await pool.query(
    `
    SELECT
      id,
      school_id,
      start_date,
      end_date
    FROM exams
    WHERE id = ?
    LIMIT 1
    `,
    [examId]
  );

  return rows[0];
};


// =========================================================
// CHECK STUDENT
// =========================================================

const checkStudentExists = async (
  studentId
) => {

  const [rows] = await pool.query(
    `
    SELECT
      id,
      school_id,
      branch_id,
      batch_id,
      status
    FROM student
    WHERE id = ?
    LIMIT 1
    `,
    [studentId]
  );

  return rows[0];
};


// =========================================================
// CHECK BATCH
// =========================================================

const checkBatchExists = async (
  batchId
) => {

  const [rows] = await pool.query(
    `
    SELECT
      batch_id,
      school_medium_id
    FROM tbl_batches
    WHERE batch_id = ?
    LIMIT 1
    `,
    [batchId]
  );

  return rows[0];
};


// =========================================================
// CHECK HALL
// =========================================================

const getHallById = async (
  hallId
) => {

  const [rows] = await pool.query(
    `
    SELECT
      hall_id,
      school_id,
      branch_id,
      hall_name,
      capacity,
      status
    FROM tbl_exam_halls
    WHERE hall_id = ?
    LIMIT 1
    `,
    [hallId]
  );

  return rows[0];
};


// =========================================================
// CHECK TIMETABLE
// =========================================================

const getTimetableById = async (
  timetableId
) => {

  const [rows] = await pool.query(
    `
    SELECT
      exam_timetable_id,
      exam_id,
      batch_id,
      school_id,
      exam_date,
      start_time,
      end_time,
      status
    FROM tbl_exam_timetable
    WHERE exam_timetable_id = ?
    LIMIT 1
    `,
    [timetableId]
  );

  return rows[0];
};


// =========================================================
// GENERATE UNIQUE TIMETABLE ID
// =========================================================

const generateUniqueTimetableId = (
  data
) => {

  if (data.exam_timetable_id) {

    return `TT-${data.exam_timetable_id}`;

  }

  return `EXAM-${data.exam_id}-${data.exam_date}`;

};


// =========================================================
// CHECK DUPLICATE STUDENT
// =========================================================

const checkDuplicateStudentAllocation = async (
  data,
  excludeId = null
) => {

  let query = `
    SELECT allocation_id
    FROM tbl_exam_hall_allocation
    WHERE unique_timetable_id = ?
      AND student_id = ?
      AND allocation_status = 'active'
  `;

  const params = [
    data.unique_timetable_id,
    data.student_id
  ];

  if (excludeId) {

    query += `
      AND allocation_id != ?
    `;

    params.push(excludeId);

  }

  query += `
    LIMIT 1
  `;

  const [rows] =
    await pool.query(
      query,
      params
    );

  return rows[0];
};


// =========================================================
// CHECK DUPLICATE SEAT
// =========================================================

const checkDuplicateSeat = async (
  data,
  excludeId = null
) => {

  let query = `
    SELECT allocation_id
    FROM tbl_exam_hall_allocation
    WHERE unique_timetable_id = ?
      AND hall_id = ?
      AND seat_number = ?
      AND allocation_status = 'active'
  `;

  const params = [
    data.unique_timetable_id,
    data.hall_id,
    data.seat_number
  ];

  if (excludeId) {

    query += `
      AND allocation_id != ?
    `;

    params.push(excludeId);

  }

  query += `
    LIMIT 1
  `;

  const [rows] =
    await pool.query(
      query,
      params
    );

  return rows[0];
};


// =========================================================
// GET CURRENT HALL ALLOCATION COUNT
// =========================================================

const getActiveHallAllocationCount = async (
  data,
  excludeId = null
) => {

  let query = `
    SELECT COUNT(*) AS total
    FROM tbl_exam_hall_allocation
    WHERE unique_timetable_id = ?
      AND hall_id = ?
      AND allocation_status = 'active'
  `;

  const params = [
    data.unique_timetable_id,
    data.hall_id
  ];

  if (excludeId) {

    query += `
      AND allocation_id != ?
    `;

    params.push(excludeId);

  }

  const [rows] =
    await pool.query(
      query,
      params
    );

  return Number(
    rows[0]?.total || 0
  );
};


// =========================================================
// CREATE ALLOCATION
// =========================================================

const createExamHallAllocation = async (
  data
) => {

  const [result] = await pool.query(
    `
    INSERT INTO tbl_exam_hall_allocation
    (
      exam_id,
      exam_timetable_id,
      unique_timetable_id,
      student_id,
      batch_id,
      hall_id,
      seat_number,
      exam_date,
      allocation_status,
      remarks,
      created_by
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.exam_id,
      data.exam_timetable_id ?? null,
      data.unique_timetable_id,
      data.student_id,
      data.batch_id,
      data.hall_id,
      data.seat_number,
      data.exam_date,
      data.allocation_status,
      data.remarks || null,
      data.created_by
    ]
  );

  return result;
};


// =========================================================
// GET ALL ALLOCATIONS
// =========================================================

const getAllExamHallAllocations = async () => {

  const [rows] = await pool.query(
    `
    SELECT

      eha.allocation_id,

      eha.exam_id,
      e.exam_name,

      eha.exam_timetable_id,

      eha.unique_timetable_id,

      eha.student_id,
      st.full_name AS student_name,
      st.roll_number,

      eha.batch_id,
      b.batch_code,

      eha.hall_id,
      eh.hall_name,
      eh.capacity AS hall_capacity,

      eha.seat_number,

      eha.exam_date,

      eha.allocation_status,

      eha.remarks,

      eha.created_by,
      cb.full_name AS created_by_name,

      eha.updated_by,
      ub.full_name AS updated_by_name,

      eha.created_at,
      eha.updated_at

    FROM tbl_exam_hall_allocation eha

    INNER JOIN exams e
      ON eha.exam_id = e.id

    INNER JOIN student st
      ON eha.student_id = st.id

    INNER JOIN tbl_batches b
      ON eha.batch_id = b.batch_id

    INNER JOIN tbl_exam_halls eh
      ON eha.hall_id = eh.hall_id

    LEFT JOIN staff cb
      ON eha.created_by = cb.id

    LEFT JOIN staff ub
      ON eha.updated_by = ub.id

    ORDER BY
      eha.allocation_id DESC
    `
  );

  return rows;
};


// =========================================================
// GET BY ID
// =========================================================

const getExamHallAllocationById = async (
  id
) => {

  const [rows] = await pool.query(
    `
    SELECT

      eha.allocation_id,

      eha.exam_id,
      e.exam_name,

      eha.exam_timetable_id,

      eha.unique_timetable_id,

      eha.student_id,
      st.full_name AS student_name,
      st.roll_number,

      eha.batch_id,
      b.batch_code,

      eha.hall_id,
      eh.hall_name,
      eh.capacity AS hall_capacity,

      eha.seat_number,

      eha.exam_date,

      eha.allocation_status,

      eha.remarks,

      eha.created_by,
      cb.full_name AS created_by_name,

      eha.updated_by,
      ub.full_name AS updated_by_name,

      eha.created_at,
      eha.updated_at

    FROM tbl_exam_hall_allocation eha

    INNER JOIN exams e
      ON eha.exam_id = e.id

    INNER JOIN student st
      ON eha.student_id = st.id

    INNER JOIN tbl_batches b
      ON eha.batch_id = b.batch_id

    INNER JOIN tbl_exam_halls eh
      ON eha.hall_id = eh.hall_id

    LEFT JOIN staff cb
      ON eha.created_by = cb.id

    LEFT JOIN staff ub
      ON eha.updated_by = ub.id

    WHERE eha.allocation_id = ?

    LIMIT 1
    `,
    [id]
  );

  return rows[0];
};


// =========================================================
// UPDATE ALLOCATION
// =========================================================

const updateExamHallAllocation = async (
  id,
  data
) => {

  const [result] = await pool.query(
    `
    UPDATE tbl_exam_hall_allocation
    SET
      exam_id = ?,
      exam_timetable_id = ?,
      unique_timetable_id = ?,
      student_id = ?,
      batch_id = ?,
      hall_id = ?,
      seat_number = ?,
      exam_date = ?,
      allocation_status = ?,
      remarks = ?,
      updated_by = ?,
      updated_at = NOW()

    WHERE allocation_id = ?
    `,
    [
      data.exam_id,
      data.exam_timetable_id ?? null,
      data.unique_timetable_id,
      data.student_id,
      data.batch_id,
      data.hall_id,
      data.seat_number,
      data.exam_date,
      data.allocation_status,
      data.remarks || null,
      data.updated_by,
      id
    ]
  );

  return result;
};


// =========================================================
// CANCEL ALLOCATION
// =========================================================

const cancelExamHallAllocation = async (
  id,
  updatedBy
) => {

  const [result] = await pool.query(
    `
    UPDATE tbl_exam_hall_allocation
    SET
      allocation_status = 'cancelled',
      updated_by = ?,
      updated_at = NOW()

    WHERE allocation_id = ?
    `,
    [
      updatedBy,
      id
    ]
  );

  return result;
};


// =========================================================
// EXPORTS
// =========================================================

module.exports = {

  checkExamExists,

  checkStudentExists,

  checkBatchExists,

  getHallById,

  getTimetableById,

  generateUniqueTimetableId,

  checkDuplicateStudentAllocation,

  checkDuplicateSeat,

  getActiveHallAllocationCount,

  createExamHallAllocation,

  getAllExamHallAllocations,

  getExamHallAllocationById,

  updateExamHallAllocation,

  cancelExamHallAllocation

};