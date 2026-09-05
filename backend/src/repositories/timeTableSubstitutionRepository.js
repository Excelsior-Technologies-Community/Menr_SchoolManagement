const pool = require("../config/db");

// =========================================================
// CREATE SUBSTITUTION
// =========================================================

const createTimeTableSubstitution = async (data) => {

  // Get timetable teacher
  const [timetableRows] = await pool.query(
    `
    SELECT
      tt.time_table_id,
      tt.teacher_id,
      tt.batch_id,
      tt.period_id,
      tt.school_subject_id
    FROM tbl_time_table tt
    WHERE tt.time_table_id = ?
      AND tt.status = 'active'
    `,
    [data.time_table_id]
  );

  if (timetableRows.length === 0) {
    throw new Error("Timetable not found or inactive");
  }

  const timetable = timetableRows[0];

  // Original teacher must come from timetable
  const originalTeacherId = timetable.teacher_id;

  if (!originalTeacherId) {
    throw new Error(
      "No teacher assigned to selected timetable"
    );
  }

  // Substitute teacher cannot be same teacher
  if (
    Number(originalTeacherId) ===
    Number(data.substitute_teacher_id)
  ) {
    throw new Error(
      "Substitute teacher must be different from original teacher"
    );
  }

  // Check substitute teacher
  const [teacherRows] = await pool.query(
    `
    SELECT id, full_name, school_id, status
    FROM staff
    WHERE id = ?
      AND status = 'ACTIVE'
    `,
    [data.substitute_teacher_id]
  );

  if (teacherRows.length === 0) {
    throw new Error(
      "Substitute teacher not found or inactive"
    );
  }

  // Check duplicate substitution
  const [duplicateRows] = await pool.query(
    `
    SELECT substitution_id
    FROM tbl_time_table_substitutions
    WHERE time_table_id = ?
      AND substitution_date = ?
      AND status = 'active'
    `,
    [
      data.time_table_id,
      data.substitution_date
    ]
  );

  if (duplicateRows.length > 0) {
    throw new Error(
      "Substitution already exists for this timetable and date"
    );
  }

  const [result] = await pool.query(
    `
    INSERT INTO tbl_time_table_substitutions
    (
      time_table_id,
      original_teacher_id,
      substitute_teacher_id,
      substitution_date,
      reason,
      remark,
      status,
      created_by
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.time_table_id,
      originalTeacherId,
      data.substitute_teacher_id,
      data.substitution_date,
      data.reason || null,
      data.remark || null,
      data.status || "active",
      data.created_by
    ]
  );

  return result;
};


// =========================================================
// GET ALL
// =========================================================

const getAllTimeTableSubstitutions = async () => {

  const [rows] = await pool.query(
    `
    SELECT
      tts.substitution_id,
      tts.time_table_id,

      tts.original_teacher_id,
      tts.substitute_teacher_id,

      tts.substitution_date,
      tts.reason,
      tts.remark,
      tts.status,
      tts.created_at,
      tts.updated_at,

      tt.day_of_week,
      tt.batch_id,
      tt.period_id,
      tt.school_subject_id,

      ot.full_name AS original_teacher,
      st.full_name AS substitute_teacher

    FROM tbl_time_table_substitutions tts

    JOIN tbl_time_table tt
      ON tt.time_table_id =
         tts.time_table_id

    LEFT JOIN staff ot
      ON ot.id =
         tts.original_teacher_id

    LEFT JOIN staff st
      ON st.id =
         tts.substitute_teacher_id

    ORDER BY
      tts.substitution_id DESC
    `
  );

  return rows;
};


// =========================================================
// GET BY ID
// =========================================================

const getTimeTableSubstitutionById =
async (id) => {

  const [rows] = await pool.query(
    `
    SELECT
      tts.substitution_id,
      tts.time_table_id,

      tts.original_teacher_id,
      tts.substitute_teacher_id,

      tts.substitution_date,
      tts.reason,
      tts.remark,
      tts.status,

      tts.created_by,
      tts.updated_by,

      tts.created_at,
      tts.updated_at,

      tt.day_of_week,
      tt.batch_id,
      tt.period_id,
      tt.school_subject_id,

      ot.full_name AS original_teacher,
      st.full_name AS substitute_teacher

    FROM tbl_time_table_substitutions tts

    JOIN tbl_time_table tt
      ON tt.time_table_id =
         tts.time_table_id

    LEFT JOIN staff ot
      ON ot.id =
         tts.original_teacher_id

    LEFT JOIN staff st
      ON st.id =
         tts.substitute_teacher_id

    WHERE
      tts.substitution_id = ?
    `,
    [id]
  );

  return rows[0];
};


// =========================================================
// UPDATE
// =========================================================

const updateTimeTableSubstitution =
async (id, data) => {

  // Check existing substitution
  const [existingRows] = await pool.query(
    `
    SELECT
      substitution_id,
      time_table_id,
      substitution_date
    FROM tbl_time_table_substitutions
    WHERE substitution_id = ?
    `,
    [id]
  );

  if (existingRows.length === 0) {
    throw new Error(
      "Substitution not found"
    );
  }

  const existing = existingRows[0];

  // Same teacher validation
  const [timetableRows] = await pool.query(
    `
    SELECT teacher_id
    FROM tbl_time_table
    WHERE time_table_id = ?
    `,
    [existing.time_table_id]
  );

  if (timetableRows.length === 0) {
    throw new Error(
      "Timetable not found"
    );
  }

  const originalTeacherId =
    timetableRows[0].teacher_id;

  if (
    Number(originalTeacherId) ===
    Number(data.substitute_teacher_id)
  ) {
    throw new Error(
      "Substitute teacher must be different from original teacher"
    );
  }

  // Duplicate check
  const [duplicateRows] = await pool.query(
    `
    SELECT substitution_id
    FROM tbl_time_table_substitutions
    WHERE
      time_table_id = ?
      AND substitution_date = ?
      AND substitution_id != ?
      AND status = 'active'
    `,
    [
      existing.time_table_id,
      data.substitution_date,
      id
    ]
  );

  if (duplicateRows.length > 0) {
    throw new Error(
      "Another substitution already exists for this timetable and date"
    );
  }

  const [result] = await pool.query(
    `
    UPDATE tbl_time_table_substitutions
    SET
      substitute_teacher_id = ?,
      substitution_date = ?,
      reason = ?,
      remark = ?,
      status = ?,
      updated_by = ?,
      updated_at = NOW()

    WHERE substitution_id = ?
    `,
    [
      data.substitute_teacher_id,
      data.substitution_date,
      data.reason || null,
      data.remark || null,
      data.status || "active",
      data.updated_by,
      id
    ]
  );

  return result;
};


// =========================================================
// DELETE
// =========================================================

const deleteTimeTableSubstitution =
async (id) => {

  const [result] = await pool.query(
    `
    DELETE FROM
      tbl_time_table_substitutions

    WHERE
      substitution_id = ?
    `,
    [id]
  );

  return result;
};


module.exports = {

  createTimeTableSubstitution,

  getAllTimeTableSubstitutions,

  getTimeTableSubstitutionById,

  updateTimeTableSubstitution,

  deleteTimeTableSubstitution

};