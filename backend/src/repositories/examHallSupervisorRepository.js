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
// CHECK STAFF / SUPERVISOR
// =========================================================

const getSupervisorById = async (
  supervisorId
) => {

  const [rows] = await pool.query(
    `
    SELECT
      id,
      school_id,
      branch_id,
      full_name,
      status
    FROM staff
    WHERE id = ?
    LIMIT 1
    `,
    [supervisorId]
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
// DUPLICATE ASSIGNMENT
// =========================================================

const checkDuplicateSupervisorAssignment =
async (
  data,
  excludeId = null
) => {

  let query = `
    SELECT id
    FROM tbl_exam_hall_supervisors
    WHERE unique_timetable_id = ?
      AND hall_id = ?
      AND supervisor_id = ?
      AND status = 'active'
  `;

  const params = [
    data.unique_timetable_id,
    data.hall_id,
    data.supervisor_id
  ];

  if (excludeId) {

    query += `
      AND id != ?
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
// SUPERVISOR TIME CONFLICT
// =========================================================

const checkSupervisorTimeConflict =
async (
  data,
  excludeId = null
) => {

  let query = `
    SELECT id
    FROM tbl_exam_hall_supervisors
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
      AND id != ?
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
// HALL TIME CONFLICT
// =========================================================

const checkHallTimeConflict =
async (
  data,
  excludeId = null
) => {

  let query = `
    SELECT id
    FROM tbl_exam_hall_supervisors
    WHERE hall_id = ?
      AND exam_date = ?
      AND status = 'active'
      AND start_time < ?
      AND end_time > ?
  `;

  const params = [
    data.hall_id,
    data.exam_date,
    data.end_time,
    data.start_time
  ];

  if (excludeId) {

    query += `
      AND id != ?
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
// CREATE
// =========================================================

const createExamHallSupervisor = async (
  data
) => {

  const [result] = await pool.query(
    `
    INSERT INTO tbl_exam_hall_supervisors
    (
      exam_id,
      exam_timetable_id,
      unique_timetable_id,
      hall_id,
      exam_date,
      supervisor_id,
      start_time,
      end_time,
      status,
      created_by
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.exam_id,
      data.exam_timetable_id ?? null,
      data.unique_timetable_id,
      data.hall_id,
      data.exam_date,
      data.supervisor_id,
      data.start_time,
      data.end_time,
      data.status,
      data.created_by
    ]
  );

  return result;
};


// =========================================================
// GET ALL
// =========================================================

const getAllExamHallSupervisors = async () => {

  const [rows] = await pool.query(
    `
    SELECT

      ehs.id,

      ehs.exam_id,
      e.exam_name,

      ehs.exam_timetable_id,

      ehs.unique_timetable_id,

      ehs.hall_id,
      eh.hall_name,

      ehs.exam_date,

      ehs.supervisor_id,
      st.full_name AS supervisor_name,

      ehs.start_time,
      ehs.end_time,

      ehs.status,

      ehs.created_by,
      cb.full_name AS created_by_name,

      ehs.updated_by,
      ub.full_name AS updated_by_name,

      ehs.created_at,
      ehs.updated_at

    FROM tbl_exam_hall_supervisors ehs

    INNER JOIN exams e
      ON ehs.exam_id = e.id

    INNER JOIN tbl_exam_halls eh
      ON ehs.hall_id = eh.hall_id

    INNER JOIN staff st
      ON ehs.supervisor_id = st.id

    LEFT JOIN staff cb
      ON ehs.created_by = cb.id

    LEFT JOIN staff ub
      ON ehs.updated_by = ub.id

    ORDER BY
      ehs.id DESC
    `
  );

  return rows;
};


// =========================================================
// GET BY ID
// =========================================================

const getExamHallSupervisorById = async (
  id
) => {

  const [rows] = await pool.query(
    `
    SELECT

      ehs.id,

      ehs.exam_id,
      e.exam_name,

      ehs.exam_timetable_id,

      ehs.unique_timetable_id,

      ehs.hall_id,
      eh.hall_name,

      ehs.exam_date,

      ehs.supervisor_id,
      st.full_name AS supervisor_name,

      ehs.start_time,
      ehs.end_time,

      ehs.status,

      ehs.created_by,
      cb.full_name AS created_by_name,

      ehs.updated_by,
      ub.full_name AS updated_by_name,

      ehs.created_at,
      ehs.updated_at

    FROM tbl_exam_hall_supervisors ehs

    INNER JOIN exams e
      ON ehs.exam_id = e.id

    INNER JOIN tbl_exam_halls eh
      ON ehs.hall_id = eh.hall_id

    INNER JOIN staff st
      ON ehs.supervisor_id = st.id

    LEFT JOIN staff cb
      ON ehs.created_by = cb.id

    LEFT JOIN staff ub
      ON ehs.updated_by = ub.id

    WHERE ehs.id = ?

    LIMIT 1
    `,
    [id]
  );

  return rows[0];
};


// =========================================================
// UPDATE
// =========================================================

const updateExamHallSupervisor = async (
  id,
  data
) => {

  const [result] = await pool.query(
    `
    UPDATE tbl_exam_hall_supervisors
    SET
      exam_id = ?,
      exam_timetable_id = ?,
      unique_timetable_id = ?,
      hall_id = ?,
      exam_date = ?,
      supervisor_id = ?,
      start_time = ?,
      end_time = ?,
      status = ?,
      updated_by = ?,
      updated_at = NOW()

    WHERE id = ?
    `,
    [
      data.exam_id,
      data.exam_timetable_id ?? null,
      data.unique_timetable_id,
      data.hall_id,
      data.exam_date,
      data.supervisor_id,
      data.start_time,
      data.end_time,
      data.status,
      data.updated_by,
      id
    ]
  );

  return result;
};


// =========================================================
// DEACTIVATE
// =========================================================

const deleteExamHallSupervisor = async (
  id,
  updatedBy
) => {

  const [result] = await pool.query(
    `
    UPDATE tbl_exam_hall_supervisors
    SET
      status = 'inactive',
      updated_by = ?,
      updated_at = NOW()

    WHERE id = ?
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

  getTimetableById,

  getHallById,

  getSupervisorById,

  generateUniqueTimetableId,

  checkDuplicateSupervisorAssignment,

  checkSupervisorTimeConflict,

  checkHallTimeConflict,

  createExamHallSupervisor,

  getAllExamHallSupervisors,

  getExamHallSupervisorById,

  updateExamHallSupervisor,

  deleteExamHallSupervisor

};