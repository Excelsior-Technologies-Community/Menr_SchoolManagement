const pool = require("../config/db");


// =========================================================
// CHECK EXAM EXISTS
// =========================================================

const checkExamExists = async (examId) => {

  const [rows] = await pool.query(
    `
    SELECT id
    FROM exams
    WHERE id = ?
    LIMIT 1
    `,
    [examId]
  );

  return rows[0];
};


// =========================================================
// CHECK BATCH EXISTS
// =========================================================

const checkBatchExists = async (batchId) => {

  const [rows] = await pool.query(
    `
    SELECT batch_id
    FROM tbl_batches
    WHERE batch_id = ?
    LIMIT 1
    `,
    [batchId]
  );

  return rows[0];
};


// =========================================================
// CHECK DUPLICATE ELIGIBILITY
// =========================================================

const checkDuplicateEligibility = async (
  data,
  excludeId = null
) => {

  let query = `
    SELECT criteria_id
    FROM tbl_exam_eligibility_settings
    WHERE exam_id = ?
      AND status = 'active'
      AND (
        batch_id = ?
        OR (
          batch_id IS NULL
          AND ? IS NULL
        )
      )
  `;

  const params = [
    data.exam_id,
    data.batch_id ?? null,
    data.batch_id ?? null
  ];

  if (excludeId) {

    query += `
      AND criteria_id != ?
    `;

    params.push(excludeId);

  }

  query += `
    LIMIT 1
  `;

  const [rows] = await pool.query(
    query,
    params
  );

  return rows[0];
};


// =========================================================
// CREATE ELIGIBILITY SETTINGS
// =========================================================

const createExamEligibility = async (data) => {

  const [result] = await pool.query(
    `
    INSERT INTO tbl_exam_eligibility_settings
    (
      exam_id,
      batch_id,
      minimum_attendance_percentage,
      fee_clearance_required,
      homework_completion_required,
      status,
      created_by
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.exam_id,
      data.batch_id ?? null,
      data.minimum_attendance_percentage,
      data.fee_clearance_required,
      data.homework_completion_required,
      data.status,
      data.created_by
    ]
  );

  return result;
};


// =========================================================
// GET ALL ELIGIBILITY SETTINGS
// =========================================================

const getAllExamEligibility = async () => {

  const [rows] = await pool.query(
    `
    SELECT
      ees.criteria_id,

      ees.exam_id,
      e.exam_name,

      ees.batch_id,
      b.batch_code,

      ees.minimum_attendance_percentage,

      ees.fee_clearance_required,

      ees.homework_completion_required,

      ees.status,

      ees.created_by,
      cb.full_name AS created_by_name,

      ees.updated_by,
      ub.full_name AS updated_by_name,

      ees.created_at,
      ees.updated_at

    FROM tbl_exam_eligibility_settings ees

    INNER JOIN exams e
      ON ees.exam_id = e.id

    LEFT JOIN tbl_batches b
      ON ees.batch_id = b.batch_id

    LEFT JOIN staff cb
      ON ees.created_by = cb.id

    LEFT JOIN staff ub
      ON ees.updated_by = ub.id

    ORDER BY
      ees.criteria_id DESC
    `
  );

  return rows;
};


// =========================================================
// GET ELIGIBILITY BY ID
// =========================================================

const getExamEligibilityById = async (id) => {

  const [rows] = await pool.query(
    `
    SELECT
      ees.criteria_id,

      ees.exam_id,
      e.exam_name,

      ees.batch_id,
      b.batch_code,

      ees.minimum_attendance_percentage,

      ees.fee_clearance_required,

      ees.homework_completion_required,

      ees.status,

      ees.created_by,
      cb.full_name AS created_by_name,

      ees.updated_by,
      ub.full_name AS updated_by_name,

      ees.created_at,
      ees.updated_at

    FROM tbl_exam_eligibility_settings ees

    INNER JOIN exams e
      ON ees.exam_id = e.id

    LEFT JOIN tbl_batches b
      ON ees.batch_id = b.batch_id

    LEFT JOIN staff cb
      ON ees.created_by = cb.id

    LEFT JOIN staff ub
      ON ees.updated_by = ub.id

    WHERE ees.criteria_id = ?

    LIMIT 1
    `,
    [id]
  );

  return rows[0];
};


// =========================================================
// UPDATE ELIGIBILITY SETTINGS
// =========================================================

const updateExamEligibility = async (
  id,
  data
) => {

  const [result] = await pool.query(
    `
    UPDATE tbl_exam_eligibility_settings
    SET
      exam_id = ?,
      batch_id = ?,
      minimum_attendance_percentage = ?,
      fee_clearance_required = ?,
      homework_completion_required = ?,
      status = ?,
      updated_by = ?,
      updated_at = NOW()

    WHERE criteria_id = ?
    `,
    [
      data.exam_id,
      data.batch_id ?? null,
      data.minimum_attendance_percentage,
      data.fee_clearance_required,
      data.homework_completion_required,
      data.status,
      data.updated_by,
      id
    ]
  );

  return result;
};


// =========================================================
// DELETE / DEACTIVATE ELIGIBILITY
// =========================================================

const deleteExamEligibility = async (
  id,
  updatedBy
) => {

  const [result] = await pool.query(
    `
    UPDATE tbl_exam_eligibility_settings
    SET
      status = 'inactive',
      updated_by = ?,
      updated_at = NOW()

    WHERE criteria_id = ?
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

  checkBatchExists,

  checkDuplicateEligibility,

  createExamEligibility,

  getAllExamEligibility,

  getExamEligibilityById,

  updateExamEligibility,

  deleteExamEligibility

};