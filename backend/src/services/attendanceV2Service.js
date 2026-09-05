const {

  createAttendance,
  getAllAttendance,
  getAttendanceByStudent,
  getAttendanceByDate,

  getClassAttendanceStatus,
  createClassAttendanceStatus,
  updateClassAttendanceStatus,
  getAllClassAttendanceStatus

} = require(
  "../repositories/attendanceV2Repository"
);


// =========================================================
// STUDENT ATTENDANCE
// =========================================================

const createAttendanceService =
async (data) => {

  return await createAttendance(
    data
  );

};


const getAllAttendanceService =
async () => {

  return await getAllAttendance();

};


const getAttendanceByStudentService =
async (studentId) => {

  return await getAttendanceByStudent(
    studentId
  );

};


const getAttendanceByDateService =
async (date) => {

  return await getAttendanceByDate(
    date
  );

};


// =========================================================
// CLASS ATTENDANCE STATUS
// =========================================================

// Get existing attendance status

const getClassAttendanceStatusService =
async (
  schoolId,
  classId,
  sectionId,
  attendanceDate
) => {

  return await getClassAttendanceStatus(
    schoolId,
    classId,
    sectionId,
    attendanceDate
  );

};


// =========================================================
// CREATE CLASS ATTENDANCE STATUS
// =========================================================

const createClassAttendanceStatusService =
async (data) => {

  // -----------------------------------------
  // Required fields
  // -----------------------------------------

  if (
    !data.school_id ||
    !data.class_id ||
    !data.section_id ||
    !data.staff_id ||
    !data.attendance_date
  ) {

    throw new Error(
      "School, Class, Section, Staff and Attendance Date are required"
    );

  }


  // -----------------------------------------
  // Validate counts
  // -----------------------------------------

  const presentCount =
    Number(data.present_count || 0);

  const absentCount =
    Number(data.absent_count || 0);

  const totalStudents =
    Number(data.total_students || 0);


  if (
    presentCount < 0 ||
    absentCount < 0 ||
    totalStudents < 0
  ) {

    throw new Error(
      "Attendance counts cannot be negative"
    );

  }


  // -----------------------------------------
  // IMPORTANT VALIDATION
  // Total = Present + Absent
  // -----------------------------------------

  if (
    totalStudents !==
    presentCount + absentCount
  ) {

    throw new Error(
      "Total Students must equal Present Count + Absent Count"
    );

  }


  // -----------------------------------------
  // Duplicate check
  // -----------------------------------------

  const existing =
    await getClassAttendanceStatus(
      data.school_id,
      data.class_id,
      data.section_id,
      data.attendance_date
    );


  if (existing) {

    throw new Error(
      "Attendance already exists for this class, section and date"
    );

  }


  // -----------------------------------------
  // Default status
  // -----------------------------------------

  data.attendance_status =
    data.attendance_status || "Pending";

  data.status =
    data.status || "Active";


  // -----------------------------------------
  // Submitted At
  // Pending = NULL
  // Completed = current timestamp
  // -----------------------------------------

  if (
    data.attendance_status ===
    "Completed"
  ) {

    data.submitted_at =
      new Date();

  } else {

    data.submitted_at =
      null;

  }


  return await createClassAttendanceStatus(
    data
  );

};


// =========================================================
// UPDATE / SUBMIT CLASS ATTENDANCE
// =========================================================

const updateClassAttendanceStatusService =
async (
  attendanceId,
  data
) => {

  if (
    !attendanceId
  ) {

    throw new Error(
      "Attendance ID is required"
    );

  }


  const presentCount =
    Number(data.present_count || 0);

  const absentCount =
    Number(data.absent_count || 0);

  const totalStudents =
    Number(data.total_students || 0);


  // -----------------------------------------
  // Count validation
  // -----------------------------------------

  if (
    presentCount < 0 ||
    absentCount < 0 ||
    totalStudents < 0
  ) {

    throw new Error(
      "Attendance counts cannot be negative"
    );

  }


  if (
    totalStudents !==
    presentCount + absentCount
  ) {

    throw new Error(
      "Total Students must equal Present Count + Absent Count"
    );

  }


  // -----------------------------------------
  // Attendance status
  // -----------------------------------------

  data.attendance_status =
    data.attendance_status || "Pending";


  // -----------------------------------------
  // Submitted At
  // -----------------------------------------

  if (
    data.attendance_status ===
    "Completed"
  ) {

    data.submitted_at =
      new Date();

  } else {

    data.submitted_at =
      null;

  }


  return await updateClassAttendanceStatus(
    attendanceId,
    data
  );

};


// =========================================================
// GET ALL CLASS ATTENDANCE STATUS
// =========================================================

const getAllClassAttendanceStatusService =
async (schoolId) => {

  return await getAllClassAttendanceStatus(
    schoolId || null
  );

};


module.exports = {

  // Student attendance
  createAttendanceService,
  getAllAttendanceService,
  getAttendanceByStudentService,
  getAttendanceByDateService,

  // Class attendance status
  getClassAttendanceStatusService,
  createClassAttendanceStatusService,
  updateClassAttendanceStatusService,
  getAllClassAttendanceStatusService

};