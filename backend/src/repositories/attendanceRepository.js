const pool = require("../config/db");


// =========================================================
// MARK ATTENDANCE
// =========================================================

const markAttendance = async (
  attendanceData
) => {

  const [result] =
    await pool.query(

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

        attendanceData.school_id,

        attendanceData.school_class_id,

        attendanceData.section_id || null,

        attendanceData.student_id,

        attendanceData.attendance_date,

        attendanceData.status,

        attendanceData.remarks || null,

        attendanceData.created_by || null

      ]

    );


  return result;

};


// =========================================================
// GET ALL ATTENDANCE
// =========================================================

const getAllAttendance = async (
  user
) => {

  let query = `

    SELECT
      a.id,
      a.school_id,
      a.school_class_id,
      a.section_id,
      a.student_id,
      s.full_name,
      s.roll_number,
      a.attendance_date,
      a.status,
      a.remarks,
      a.created_at,
      a.updated_at

    FROM attendance_v2 a

    LEFT JOIN student s
      ON s.id = a.student_id

  `;


  let params = [];


  if (
    user.role !==
    "SUPER_ADMIN"
  ) {

    query += `
      WHERE a.school_id = ?
    `;

    params.push(
      user.schoolId
    );

  }


  query += `
    ORDER BY
      a.attendance_date DESC,
      a.id DESC
  `;


  const [rows] =
    await pool.query(
      query,
      params
    );


  return rows;

};


// =========================================================
// GET STUDENTS FOR ATTENDANCE
// =========================================================

const getAttendanceByGroup = async (
  data
) => {

  let query = `

    SELECT

      s.id AS student_id,

      s.full_name,

      s.roll_number,

      s.school_id,

      s.school_class_id,

      s.section_id,

      s.batch_id,

      a.id AS attendance_id,

      a.attendance_date,

      a.status,

      a.remarks

    FROM student s

    LEFT JOIN attendance_v2 a

      ON a.student_id = s.id

      AND a.attendance_date = ?

  `;


  const params = [

    data.attendanceDate

  ];


  query += `

    WHERE s.school_id = ?

  `;


  params.push(
    data.schoolId
  );


  // CLASS FILTER

  if (
    data.schoolClassId
  ) {

    query += `
      AND s.school_class_id = ?
    `;

    params.push(
      data.schoolClassId
    );

  }


  // SECTION FILTER

  if (
    data.sectionId
  ) {

    query += `
      AND s.section_id = ?
    `;

    params.push(
      data.sectionId
    );

  }


  // BATCH FILTER

  if (
    data.batchId
  ) {

    query += `
      AND s.batch_id = ?
    `;

    params.push(
      data.batchId
    );

  }


  query += `

    AND s.status = 'ACTIVE'

    ORDER BY
      s.roll_number ASC,
      s.id ASC

  `;


  const [rows] =
    await pool.query(
      query,
      params
    );


  return rows;

};


// =========================================================
// UPDATE ATTENDANCE
// =========================================================

const updateAttendance = async (
  id,
  data
) => {

  const [result] =
    await pool.query(

      `UPDATE attendance_v2

       SET
         status = ?,
         remarks = ?,
         updated_by = ?,
         updated_at = CURRENT_TIMESTAMP

       WHERE id = ?`,

      [

        data.status,

        data.remarks || null,

        data.updated_by || null,

        id

      ]

    );


  return result;

};


module.exports = {

  markAttendance,

  getAllAttendance,

  getAttendanceByGroup,

  updateAttendance

};