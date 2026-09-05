const pool = require("../config/db");


// =========================================================
// CHECK SCHOOL
// =========================================================

const checkSchoolExists = async (
  schoolId
) => {

  const [rows] = await pool.query(
    `
    SELECT id
    FROM school
    WHERE id = ?
    LIMIT 1
    `,
    [schoolId]
  );

  return rows[0];
};


// =========================================================
// CHECK BRANCH
// =========================================================

const checkBranchExists = async (
  branchId,
  schoolId
) => {

  const [rows] = await pool.query(
    `
    SELECT id
    FROM school_branches
    WHERE id = ?
      AND school_id = ?
    LIMIT 1
    `,
    [
      branchId,
      schoolId
    ]
  );

  return rows[0];
};


// =========================================================
// DUPLICATE HALL
// =========================================================

const checkDuplicateHall = async (
  data,
  excludeId = null
) => {

  let query = `
    SELECT hall_id
    FROM tbl_exam_halls
    WHERE school_id = ?
      AND hall_name = ?
      AND (
        branch_id = ?
        OR (
          branch_id IS NULL
          AND ? IS NULL
        )
      )
      AND status = 'active'
  `;

  const params = [
    data.school_id,
    data.hall_name,
    data.branch_id ?? null,
    data.branch_id ?? null
  ];

  if (excludeId) {

    query += `
      AND hall_id != ?
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
// CREATE HALL
// =========================================================

const createExamHall = async (
  data
) => {

  const [result] = await pool.query(
    `
    INSERT INTO tbl_exam_halls
    (
      school_id,
      branch_id,
      hall_name,
      capacity,
      status,
      created_by
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      data.school_id,
      data.branch_id ?? null,
      data.hall_name,
      data.capacity,
      data.status,
      data.created_by
    ]
  );

  return result;
};


// =========================================================
// GET ALL HALLS
// =========================================================

const getAllExamHalls = async () => {

  const [rows] = await pool.query(
    `
    SELECT

      eh.hall_id,

      eh.school_id,
      s.school_name,

      eh.branch_id,
      sb.branch_name,

      eh.hall_name,

      eh.capacity,

      eh.status,

      eh.created_by,
      cb.full_name AS created_by_name,

      eh.updated_by,
      ub.full_name AS updated_by_name,

      eh.created_at,
      eh.updated_at

    FROM tbl_exam_halls eh

    INNER JOIN school s
      ON eh.school_id = s.id

    LEFT JOIN school_branches sb
      ON eh.branch_id = sb.id

    LEFT JOIN staff cb
      ON eh.created_by = cb.id

    LEFT JOIN staff ub
      ON eh.updated_by = ub.id

    ORDER BY
      eh.hall_id DESC
    `
  );

  return rows;
};


// =========================================================
// GET HALL BY ID
// =========================================================

const getExamHallById = async (
  id
) => {

  const [rows] = await pool.query(
    `
    SELECT

      eh.hall_id,

      eh.school_id,
      s.school_name,

      eh.branch_id,
      sb.branch_name,

      eh.hall_name,

      eh.capacity,

      eh.status,

      eh.created_by,
      cb.full_name AS created_by_name,

      eh.updated_by,
      ub.full_name AS updated_by_name,

      eh.created_at,
      eh.updated_at

    FROM tbl_exam_halls eh

    INNER JOIN school s
      ON eh.school_id = s.id

    LEFT JOIN school_branches sb
      ON eh.branch_id = sb.id

    LEFT JOIN staff cb
      ON eh.created_by = cb.id

    LEFT JOIN staff ub
      ON eh.updated_by = ub.id

    WHERE eh.hall_id = ?

    LIMIT 1
    `,
    [id]
  );

  return rows[0];
};


// =========================================================
// UPDATE HALL
// =========================================================

const updateExamHall = async (
  id,
  data
) => {

  const [result] = await pool.query(
    `
    UPDATE tbl_exam_halls
    SET
      school_id = ?,
      branch_id = ?,
      hall_name = ?,
      capacity = ?,
      status = ?,
      updated_by = ?,
      updated_at = NOW()

    WHERE hall_id = ?
    `,
    [
      data.school_id,
      data.branch_id ?? null,
      data.hall_name,
      data.capacity,
      data.status,
      data.updated_by,
      id
    ]
  );

  return result;
};


// =========================================================
// DEACTIVATE HALL
// =========================================================

const deleteExamHall = async (
  id,
  updatedBy
) => {

  const [result] = await pool.query(
    `
    UPDATE tbl_exam_halls
    SET
      status = 'inactive',
      updated_by = ?,
      updated_at = NOW()

    WHERE hall_id = ?
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

  checkSchoolExists,

  checkBranchExists,

  checkDuplicateHall,

  createExamHall,

  getAllExamHalls,

  getExamHallById,

  updateExamHall,

  deleteExamHall

};