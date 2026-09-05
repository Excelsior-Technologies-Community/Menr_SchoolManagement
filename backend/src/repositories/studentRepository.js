const pool = require("../config/db");

// =========================================================
// CREATE STUDENT
// =========================================================

const createStudent = async (data) => {

  const [result] = await pool.query(
    `
    INSERT INTO student
    (
      school_id,
      full_name,
      email,
      roll_number,
      password,
      class_name,
      section,
      gender,
      dob,
      father_name,
      mother_name,
      guardian_name,
guardian_relation,
guardian_contact,
guardian_email,
      phone,
      address,
      status,
      school_class_id,
      section_id,
      branch_id,
      batch_id
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.school_id,
      data.full_name,
      data.email || null,
      data.roll_number || null,
      data.password,

      data.class_name || null,
      data.section || null,

      data.gender || "MALE",
      data.dob || null,
      data.father_name || null,
      data.mother_name || null,

      data.guardian_name || null,
data.guardian_relation || null,
data.guardian_contact || null,
data.guardian_email || null,

      data.phone || null,
      data.address || null,

      data.status || "ACTIVE",

      data.school_class_id || null,
      data.section_id || null,
      data.branch_id || null,
      data.batch_id || null
    ]
  );

  return result;
};


// =========================================================
// GET ALL STUDENTS
// =========================================================

const getAllStudents = async () => {

  const [rows] = await pool.query(
    `
    SELECT
      s.id,
      s.school_id,
      s.branch_id,
      s.school_class_id,
      s.section_id,
      s.batch_id,

      s.full_name,
      s.email,
      s.roll_number,

      s.class_name,
      s.section,

      s.gender,
      s.dob,

      s.father_name,
      s.mother_name,

      s.phone,
      s.address,

      s.status,

      s.created_at,
      s.updated_at,

      c.class_name AS class_master_name,
      sec.section_name,
      sb.branch_name

    FROM student s

    LEFT JOIN school_classes sc
      ON s.school_class_id = sc.id

    LEFT JOIN classes c
      ON sc.class_id = c.id

    LEFT JOIN sections sec
      ON s.section_id = sec.id

    LEFT JOIN school_branches sb
      ON s.branch_id = sb.id

    ORDER BY s.id DESC
    `
  );

  return rows;
};


// =========================================================
// GET STUDENTS BY SCHOOL
// =========================================================

const getStudentsBySchool = async (
  schoolId
) => {

  const [rows] = await pool.query(
    `
    SELECT
      s.id,
      s.school_id,
      s.branch_id,
      s.school_class_id,
      s.section_id,
      s.batch_id,

      s.full_name,
      s.email,
      s.roll_number,

      s.class_name,
      s.section,

      s.gender,
      s.dob,

      s.father_name,
      s.mother_name,

      s.phone,
      s.address,

      s.status,

      s.created_at,
      s.updated_at,

      c.class_name AS class_master_name,
      sec.section_name,
      sb.branch_name

    FROM student s

    LEFT JOIN school_classes sc
      ON s.school_class_id = sc.id

    LEFT JOIN classes c
      ON sc.class_id = c.id

    LEFT JOIN sections sec
      ON s.section_id = sec.id

    LEFT JOIN school_branches sb
      ON s.branch_id = sb.id

    WHERE s.school_id = ?

    ORDER BY s.id DESC
    `,
    [schoolId]
  );

  return rows;
};


// =========================================================
// GET STUDENT BY ID
// =========================================================

const getStudentById = async (
  id
) => {

  const [rows] = await pool.query(
    `
    SELECT

      s.id,
      s.school_id,
      s.branch_id,
      s.school_class_id,
      s.section_id,
      s.batch_id,

      s.full_name,
      s.email,
      s.roll_number,

      s.class_name,
      s.section,

      s.gender,
      s.dob,

      s.father_name,
      s.mother_name,

      s.guardian_name,
s.guardian_relation,
s.guardian_contact,
s.guardian_email,


      s.phone,
      s.address,

      s.status,

      s.created_at,
      s.updated_at,

      c.class_name AS class_master_name,
      sec.section_name,
      sb.branch_name

    FROM student s

    LEFT JOIN school_classes sc
      ON s.school_class_id = sc.id

    LEFT JOIN classes c
      ON sc.class_id = c.id

    LEFT JOIN sections sec
      ON s.section_id = sec.id

    LEFT JOIN school_branches sb
      ON s.branch_id = sb.id

    WHERE s.id = ?
    `,
    [id]
  );

  return rows[0];
};


// =========================================================
// UPDATE STUDENT
// =========================================================

const updateStudent = async (
  id,
  data
) => {

  const [result] = await pool.query(
    `
    UPDATE student
    SET

      full_name = COALESCE(?, full_name),
      email = COALESCE(?, email),
      roll_number = COALESCE(?, roll_number),

      class_name = COALESCE(?, class_name),
      section = COALESCE(?, section),

      gender = COALESCE(?, gender),
      dob = COALESCE(?, dob),

      father_name = COALESCE(?, father_name),
      mother_name = COALESCE(?, mother_name),

      guardian_name =
  COALESCE(?, guardian_name),

guardian_relation =
  COALESCE(?, guardian_relation),

guardian_contact =
  COALESCE(?, guardian_contact),

guardian_email =
  COALESCE(?, guardian_email),


      phone = COALESCE(?, phone),
      address = COALESCE(?, address),

      school_class_id =
        COALESCE(?, school_class_id),

      section_id =
        COALESCE(?, section_id),

      branch_id =
        COALESCE(?, branch_id),

      batch_id =
        COALESCE(?, batch_id),

      updated_at = CURRENT_TIMESTAMP

    WHERE id = ?
    `,
    [
      data.full_name ?? null,
      data.email ?? null,
      data.roll_number ?? null,

      data.class_name ?? null,
      data.section ?? null,

      data.gender ?? null,
      data.dob ?? null,

      data.father_name ?? null,
      data.mother_name ?? null,
      data.guardian_name ?? null,
data.guardian_relation ?? null,
data.guardian_contact ?? null,
data.guardian_email ?? null,

      data.phone ?? null,
      data.address ?? null,

      data.school_class_id ?? null,
      data.section_id ?? null,
      data.branch_id ?? null,
      data.batch_id ?? null,

      id
    ]
  );

  return result;
};


// =========================================================
// UPDATE STUDENT STATUS
// =========================================================

const updateStudentStatus = async (
  id,
  status
) => {

  const [result] = await pool.query(
    `
    UPDATE student
    SET
      status = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
    `,
    [
      status,
      id
    ]
  );

  return result;
};


// =========================================================
// DELETE STUDENT
// =========================================================

const deleteStudent = async (
  id
) => {

  const [result] = await pool.query(
    `
    DELETE FROM student
    WHERE id = ?
    `,
    [id]
  );

  return result;
};


// =========================================================
// PAGINATION
// =========================================================

const getStudentsWithPagination = async (
  limit,
  offset
) => {

  const [rows] = await pool.query(
    `
    SELECT

      s.id,
      s.school_id,
      s.branch_id,
      s.school_class_id,
      s.section_id,
      s.batch_id,

      s.full_name,
      s.email,
      s.roll_number,

      s.class_name,
      s.section,

      s.gender,
      s.dob,

      s.father_name,
      s.mother_name,

      s.phone,
      s.address,

      s.status,

      s.created_at,
      s.updated_at,

      c.class_name AS class_master_name,
      sec.section_name,
      sb.branch_name

    FROM student s

    LEFT JOIN school_classes sc
      ON s.school_class_id = sc.id

    LEFT JOIN classes c
      ON sc.class_id = c.id

    LEFT JOIN sections sec
      ON s.section_id = sec.id

    LEFT JOIN school_branches sb
      ON s.branch_id = sb.id

    ORDER BY s.id DESC

    LIMIT ? OFFSET ?
    `,
    [
      Number(limit),
      Number(offset)
    ]
  );

  return rows;
};


// =========================================================
// SEARCH STUDENTS
// =========================================================

const searchStudents = async (
  search
) => {

  const [rows] = await pool.query(
    `
    SELECT

      s.id,
      s.school_id,
      s.branch_id,
      s.school_class_id,
      s.section_id,
      s.batch_id,

      s.full_name,
      s.email,
      s.roll_number,

      s.class_name,
      s.section,

      s.gender,
      s.dob,

      s.father_name,
      s.mother_name,

      s.phone,
      s.address,

      s.status,

      s.created_at,
      s.updated_at,

      c.class_name AS class_master_name,
      sec.section_name,
      sb.branch_name

    FROM student s

    LEFT JOIN school_classes sc
      ON s.school_class_id = sc.id

    LEFT JOIN classes c
      ON sc.class_id = c.id

    LEFT JOIN sections sec
      ON s.section_id = sec.id

    LEFT JOIN school_branches sb
      ON s.branch_id = sb.id

    WHERE
      s.full_name LIKE ?
      OR s.roll_number LIKE ?
      OR s.phone LIKE ?
      OR s.email LIKE ?

    ORDER BY s.id DESC
    `,
    [
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
      `%${search}%`
    ]
  );

  return rows;
};


// =========================================================
// FIND STUDENT BY ROLL NUMBER
// =========================================================

const findStudentByRollNumber = async (
  rollNumber
) => {

  const [rows] = await pool.query(
    `
    SELECT *
    FROM student
    WHERE roll_number = ?
    `,
    [rollNumber]
  );

  return rows[0];
};


// =========================================================
// UPDATE STUDENT PASSWORD
// =========================================================

const updateStudentPassword = async (
  id,
  password
) => {

  const [result] = await pool.query(
    `
    UPDATE student
    SET
      password = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
    `,
    [
      password,
      id
    ]
  );

  return result;
};


// =========================================================
// GET STUDENT PASSWORD
// =========================================================

const getStudentPasswordById = async (
  id
) => {

  const [rows] = await pool.query(
    `
    SELECT
      id,
      password
    FROM student
    WHERE id = ?
    `,
    [id]
  );

  return rows[0];
};


// =========================================================
// UPDATE STUDENT SCHOOL
// =========================================================

const updateStudentSchool = async (
  studentId,
  schoolId
) => {

  const [result] = await pool.query(
    `
    UPDATE student
    SET
      school_id = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
    `,
    [
      schoolId,
      studentId
    ]
  );

  return result;
};


// =========================================================
// UPDATE STUDENT BRANCH
// =========================================================

const updateStudentBranch = async (
  studentId,
  branchId,
  batchId
) => {

  const [result] = await pool.query(
    `
    UPDATE student
    SET
      branch_id = ?,
      batch_id = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
    `,
    [
      branchId,
      batchId,
      studentId
    ]
  );

  return result;
};


// =========================================================
// STUDENT DASHBOARD PROFILE
// =========================================================

const getStudentDashboardProfile =
async (
  studentId
) => {

  const [rows] = await pool.query(
    `
    SELECT

      s.id,
      s.school_id,
      s.branch_id,
      s.school_class_id,
      s.section_id,
      s.batch_id,

      s.full_name,
      s.roll_number,
      s.gender,
      s.dob,
      s.phone,
      s.address,
      s.status,

      c.class_name AS class_master_name,
      sec.section_name,
      sb.branch_name

    FROM student s

    LEFT JOIN school_classes sc
      ON s.school_class_id = sc.id

    LEFT JOIN classes c
      ON sc.class_id = c.id

    LEFT JOIN sections sec
      ON s.section_id = sec.id

    LEFT JOIN school_branches sb
      ON s.branch_id = sb.id

    WHERE s.id = ?
    `,
    [studentId]
  );

  return rows[0];
};


// =========================================================
// STUDENT DASHBOARD SUBJECTS
// =========================================================

const getStudentDashboardSubjects =
async (
  studentId
) => {

  const [rows] = await pool.query(
    `
    SELECT

      cs.id,
      cs.school_class_id,
      cs.subject_id,

      sub.subject_name,
      sub.subject_code,

      cs.status

    FROM student s

    INNER JOIN class_subjects cs
      ON cs.school_class_id =
         s.school_class_id

    INNER JOIN subjects sub
      ON sub.id = cs.subject_id

    WHERE
      s.id = ?
      AND cs.status = 'active'
      AND sub.status = 'active'

    ORDER BY sub.subject_name ASC
    `,
    [studentId]
  );

  return rows;
};


// =========================================================
// STUDENT DASHBOARD ATTENDANCE
// =========================================================

const getStudentDashboardAttendance =
async (
  studentId
) => {

  const [rows] = await pool.query(
    `
    SELECT

      COUNT(*) AS total_days,

      SUM(
        CASE
          WHEN status = 'PRESENT'
          THEN 1
          ELSE 0
        END
      ) AS present_days,

      SUM(
        CASE
          WHEN status = 'ABSENT'
          THEN 1
          ELSE 0
        END
      ) AS absent_days

    FROM attendance

    WHERE student_id = ?
    `,
    [studentId]
  );

  const data = rows[0] || {};

  const totalDays =
    Number(
      data.total_days || 0
    );

  const presentDays =
    Number(
      data.present_days || 0
    );

  const absentDays =
    Number(
      data.absent_days || 0
    );

  const percentage =
    totalDays > 0
      ? Number(
          (
            (presentDays /
              totalDays) *
            100
          ).toFixed(2)
        )
      : 0;

  return {

    total_days:
      totalDays,

    present_days:
      presentDays,

    absent_days:
      absentDays,

    percentage

  };
};


// =========================================================
// STUDENT DASHBOARD MARKS
// =========================================================

const getStudentDashboardMarks =
async (
  studentId
) => {

  const [rows] = await pool.query(
    `
    SELECT

      sm.id,
      sm.exam_id,
      sm.student_id,
      sm.subject_id,

      e.exam_name,

      sub.subject_name,
      sub.subject_code,

      sm.max_marks,
      sm.obtained_marks,
      sm.remarks,

      CASE
        WHEN sm.max_marks > 0
        THEN ROUND(
          (
            sm.obtained_marks /
            sm.max_marks
          ) * 100,
          2
        )
        ELSE 0
      END AS percentage

    FROM student_marks sm

    INNER JOIN exams e
      ON e.id = sm.exam_id

    INNER JOIN subjects sub
      ON sub.id = sm.subject_id

    WHERE sm.student_id = ?

    ORDER BY sm.id DESC
    `,
    [studentId]
  );

  return rows;
};


// =========================================================
// STUDENT DASHBOARD FEES
// =========================================================

const getStudentDashboardFees =
async (
  studentId
) => {

  const [feeRows] =
    await pool.query(
      `
      SELECT

        COALESCE(
          SUM(amount),
          0
        ) AS total_fee,

        COUNT(*) AS fee_records

      FROM fees

      WHERE student_id = ?
      `,
      [studentId]
    );


  const [paymentRows] =
    await pool.query(
      `
      SELECT

        COALESCE(
          SUM(amount_paid),
          0
        ) AS paid_amount

      FROM student_fee_payments

      WHERE student_id = ?
      `,
      [studentId]
    );


  const totalFee =
    Number(
      feeRows[0]?.total_fee || 0
    );


  const paidAmount =
    Number(
      paymentRows[0]?.paid_amount || 0
    );


  const dueAmount =
    Math.max(
      totalFee - paidAmount,
      0
    );


  let status = "PAID";

  if (
    dueAmount > 0
  ) {
    status = "PENDING";
  }


  return {

    total_fee:
      totalFee,

    paid_amount:
      paidAmount,

    due_amount:
      dueAmount,

    status

  };
};


// =========================================================
// EXPORTS
// =========================================================
// =========================================================
// STUDENT SELF - MY CLASS
// =========================================================

const getStudentMyClass = async (studentId) => {

  const [rows] = await pool.query(
    `
    SELECT

      s.id AS student_id,
      s.school_id,
      s.branch_id,
      s.school_class_id,
      s.section_id,
      s.batch_id,

      s.full_name,
      s.roll_number,

      c.id AS class_id,
c.class_name,

sec.id AS section_id_master,
      sec.section_name,

      sb.branch_name

    FROM student s

    LEFT JOIN school_classes sc
      ON sc.id = s.school_class_id

    LEFT JOIN classes c
      ON c.id = sc.class_id

    LEFT JOIN sections sec
      ON sec.id = s.section_id

    LEFT JOIN school_branches sb
      ON sb.id = s.branch_id

    WHERE s.id = ?

    LIMIT 1
    `,
    [studentId]
  );

  return rows[0];
};


// =========================================================
// STUDENT SELF - CLASSMATES
// =========================================================

const getStudentClassmates = async (studentId) => {

  const [studentRows] = await pool.query(
    `
    SELECT
      school_id,
      school_class_id,
      section_id,
      batch_id

    FROM student

    WHERE id = ?

    LIMIT 1
    `,
    [studentId]
  );

  if (studentRows.length === 0) {
    throw new Error("Student Not Found");
  }

  const student = studentRows[0];

  const [rows] = await pool.query(
    `
    SELECT

      s.id,
      s.full_name,
      s.roll_number,
      s.gender,

      s.school_class_id,
      s.section_id,
      s.batch_id,

      c.class_name,
      sec.section_name

    FROM student s

    LEFT JOIN school_classes sc
      ON sc.id = s.school_class_id

    LEFT JOIN classes c
      ON c.id = sc.class_id

    LEFT JOIN sections sec
      ON sec.id = s.section_id

    WHERE
      s.school_id = ?
      AND s.school_class_id = ?
      AND (
        s.section_id = ?
        OR (
          s.section_id IS NULL
          AND ? IS NULL
        )
      )
      AND (
        s.batch_id = ?
        OR (
          s.batch_id IS NULL
          AND ? IS NULL
        )
      )
      AND s.status = 'ACTIVE'

    ORDER BY
      s.roll_number ASC,
      s.full_name ASC
    `,
    [
      student.school_id,
      student.school_class_id,
      student.section_id,
      student.section_id,
      student.batch_id,
      student.batch_id
    ]
  );

  return rows;
};


// =========================================================
// STUDENT SELF - MY SUBJECTS
// =========================================================

const getStudentMySubjects = async (studentId) => {

  const [rows] = await pool.query(
    `
    SELECT

      cs.id,
      cs.school_class_id,
      cs.subject_id,

      sub.subject_name,
      sub.subject_code,

      cs.status

    FROM student s

    INNER JOIN class_subjects cs
      ON cs.school_class_id = s.school_class_id

    INNER JOIN subjects sub
      ON sub.id = cs.subject_id

    WHERE
      s.id = ?
      AND cs.status = 'active'
      AND sub.status = 'active'

    ORDER BY
      sub.subject_name ASC
    `,
    [studentId]
  );

  return rows;
};


// =========================================================
// STUDENT SELF - MY TIMETABLE
// =========================================================

const getStudentMyTimetable = async (studentId) => {

  const [rows] = await pool.query(
    `
    SELECT

      t.id,

      t.school_class_id,
      t.section_id,
      t.subject_id,
      t.staff_id,

      t.day_name,
      t.start_time,
      t.end_time,
      t.status,

      sub.subject_name,
      sub.subject_code,

      st.full_name AS teacher_name,

      c.class_name,

      sec.section_name

    FROM student s

    INNER JOIN timetables t
      ON t.school_class_id = s.school_class_id
      AND (
        t.section_id = s.section_id
        OR t.section_id IS NULL
      )

    LEFT JOIN subjects sub
      ON sub.id = t.subject_id

    LEFT JOIN staff st
      ON st.id = t.staff_id

    LEFT JOIN school_classes sc
      ON sc.id = t.school_class_id

    LEFT JOIN classes c
      ON c.id = sc.class_id

    LEFT JOIN sections sec
      ON sec.id = t.section_id

    WHERE
      s.id = ?
      AND t.status = 'active'

    ORDER BY

      CASE t.day_name
        WHEN 'Monday' THEN 1
        WHEN 'Tuesday' THEN 2
        WHEN 'Wednesday' THEN 3
        WHEN 'Thursday' THEN 4
        WHEN 'Friday' THEN 5
        WHEN 'Saturday' THEN 6
        WHEN 'Sunday' THEN 7
        ELSE 8
      END,

      t.start_time ASC
    `,
    [studentId]
  );

  return rows;
};


// =========================================================
// STUDENT SELF - MY ATTENDANCE
// =========================================================

const getStudentMyAttendance = async (studentId) => {

  const [rows] = await pool.query(
    `
    SELECT

      a.id,
      a.school_id,
      a.student_id,

      a.attendance_date,
      a.status,

      a.created_at

    FROM attendance a

    WHERE a.student_id = ?

    ORDER BY
      a.attendance_date DESC,
      a.id DESC
    `,
    [studentId]
  );

  return rows;
};
module.exports = {

  // Student CRUD
  createStudent,
  getAllStudents,
  getStudentsBySchool,
  getStudentById,
  updateStudent,
  updateStudentStatus,
  deleteStudent,

  // Pagination / Search
  getStudentsWithPagination,
  searchStudents,

  // Login / Password
  findStudentByRollNumber,
  updateStudentPassword,
  getStudentPasswordById,

  // School / Branch
  updateStudentSchool,
  updateStudentBranch,

  // Dashboard
  getStudentDashboardProfile,
  getStudentDashboardSubjects,
  getStudentDashboardAttendance,
  getStudentDashboardMarks,
    getStudentMyClass,
  getStudentClassmates,
  getStudentMySubjects,
  getStudentMyTimetable,
  getStudentMyAttendance,
  getStudentDashboardFees

};