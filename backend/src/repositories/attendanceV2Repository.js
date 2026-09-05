const pool = require("../config/db");

// =========================================================
// MARK STUDENT ATTENDANCE
// =========================================================

const createAttendance = async (data) => {

  const [result] = await pool.query(
    `INSERT INTO attendance_v2
    (
      school_id,
      school_class_id,
      section_id,
      student_id,
      attendance_date,
      status,
      remarks,
      created_by
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.school_id,
      data.school_class_id,
      data.section_id,
      data.student_id,
      data.attendance_date,
      data.status,
      data.remarks,
      data.created_by
    ]
  );

  return result;
};


// =========================================================
// GET ALL STUDENT ATTENDANCE
// =========================================================

const getAllAttendance = async () => {

  const [rows] = await pool.query(`
    SELECT
      a.id,
      a.attendance_date,
      a.status,
      a.remarks,

      s.full_name,
      s.roll_number,

      c.class_name,
      sec.section_name

    FROM attendance_v2 a

    JOIN student s
      ON s.id = a.student_id

    JOIN school_classes sc
      ON sc.id = a.school_class_id

    JOIN classes c
      ON c.id = sc.class_id

    JOIN sections sec
      ON sec.id = a.section_id

    ORDER BY a.id DESC
  `);

  return rows;
};


// =========================================================
// GET ATTENDANCE BY STUDENT
// =========================================================

const getAttendanceByStudent =
async (studentId) => {

  const [rows] = await pool.query(
    `
    SELECT *
    FROM attendance_v2
    WHERE student_id = ?
    ORDER BY attendance_date DESC
    `,
    [studentId]
  );

  return rows;
};


// =========================================================
// GET ATTENDANCE BY DATE
// =========================================================

const getAttendanceByDate =
async (date) => {

  const [rows] = await pool.query(
    `
    SELECT *
    FROM attendance_v2
    WHERE attendance_date = ?
    `,
    [date]
  );

  return rows;
};


// =========================================================
// CLASS ATTENDANCE STATUS
// =========================================================

// Get class attendance status for a particular date

const getClassAttendanceStatus =
async (
  schoolId,
  classId,
  sectionId,
  attendanceDate
) => {

  const [rows] = await pool.query(
    `
    SELECT
      attendance_id,
      school_id,
      class_id,
      section_id,
      staff_id,
      attendance_date,
      attendance_status,
      status,
      present_count,
      absent_count,
      total_students,
      submitted_at,
      created_by,
      updated_by,
      created_at,
      updated_at

    FROM tbl_class_attendance_status

    WHERE school_id = ?
      AND class_id = ?
      AND section_id = ?
      AND attendance_date = ?

    LIMIT 1
    `,
    [
      schoolId,
      classId,
      sectionId,
      attendanceDate
    ]
  );

  return rows[0] || null;
};


// =========================================================
// CREATE CLASS ATTENDANCE STATUS
// =========================================================

const createClassAttendanceStatus =
async (data) => {

  const [result] = await pool.query(
    `
    INSERT INTO tbl_class_attendance_status
    (
      school_id,
      class_id,
      section_id,
      staff_id,
      attendance_date,
      attendance_status,
      status,
      present_count,
      absent_count,
      total_students,
      submitted_at,
      created_by
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.school_id,
      data.class_id,
      data.section_id,
      data.staff_id,
      data.attendance_date,
      data.attendance_status,
      data.status,
      data.present_count,
      data.absent_count,
      data.total_students,
      data.submitted_at,
      data.created_by
    ]
  );

  return result;
};


// =========================================================
// UPDATE CLASS ATTENDANCE STATUS
// =========================================================

const updateClassAttendanceStatus =
async (
  attendanceId,
  data
) => {

  const [result] = await pool.query(
    `
    UPDATE tbl_class_attendance_status

    SET
      attendance_status = ?,
      present_count = ?,
      absent_count = ?,
      total_students = ?,
      submitted_at = ?,
      updated_by = ?,
      updated_at = NOW()

    WHERE attendance_id = ?
      AND school_id = ?
    `,
    [
      data.attendance_status,
      data.present_count,
      data.absent_count,
      data.total_students,
      data.submitted_at,
      data.updated_by,
      attendanceId,
      data.school_id
    ]
  );

  return result;
};


// =========================================================
// GET ALL CLASS ATTENDANCE STATUS
// =========================================================

const getAllClassAttendanceStatus =
async (schoolId) => {

  let query = `
    SELECT
      cas.attendance_id,
      cas.school_id,
      cas.class_id,
      cas.section_id,
      cas.staff_id,
      cas.attendance_date,
      cas.attendance_status,
      cas.status,
      cas.present_count,
      cas.absent_count,
      cas.total_students,
      cas.submitted_at,
      cas.created_by,
      cas.updated_by,
      cas.created_at,
      cas.updated_at,

      c.class_name,
      sec.section_name,
      st.full_name AS staff_name

    FROM tbl_class_attendance_status cas

    LEFT JOIN classes c
      ON c.id = cas.class_id

    LEFT JOIN sections sec
      ON sec.id = cas.section_id

    LEFT JOIN staff st
      ON st.id = cas.staff_id
  `;

  const params = [];

  // SCHOOL ADMIN / STAFF
  if (schoolId) {

    query += `
      WHERE cas.school_id = ?
    `;

    params.push(schoolId);

  }

  query += `
    ORDER BY
      cas.attendance_date DESC,
      cas.attendance_id DESC
  `;

  const [rows] =
    await pool.query(
      query,
      params
    );

  return rows;

};


module.exports = {

  // Student attendance
  createAttendance,
  getAllAttendance,
  getAttendanceByStudent,
  getAttendanceByDate,

  // Class attendance status
  getClassAttendanceStatus,
  createClassAttendanceStatus,
  updateClassAttendanceStatus,
  getAllClassAttendanceStatus

};