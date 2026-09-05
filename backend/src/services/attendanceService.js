const {
  markAttendance,
  findAttendance,
  updateAttendance,
  getAllAttendance,
  getAttendanceByGroup
} = require(
  "../repositories/attendanceRepository"
);


// =========================================================
// VALID STATUS
// =========================================================

const normalizeStatus = (
  status
) => {

  const value =
    String(
      status || ""
    )
      .trim()
      .toUpperCase();


  if (
    value === "PRESENT"
  ) {

    return "Present";

  }


  if (
    value === "ABSENT"
  ) {

    return "Absent";

  }


  if (
    value === "LEAVE"
  ) {

    return "Leave";

  }


  throw new Error(
    "Invalid attendance status"
  );

};


// =========================================================
// MARK ATTENDANCE
// =========================================================

const markAttendanceService =
async (
  attendanceData
) => {

  const status =
    normalizeStatus(
      attendanceData.status
    );


  if (
    !attendanceData.school_id
  ) {

    throw new Error(
      "School ID is required"
    );

  }


  if (
    !attendanceData.student_id
  ) {

    throw new Error(
      "Student ID is required"
    );

  }


  if (
    !attendanceData.school_class_id
  ) {

    throw new Error(
      "Class is required"
    );

  }


  if (
    !attendanceData.attendance_date
  ) {

    throw new Error(
      "Attendance date is required"
    );

  }


  // Check duplicate

  const existing =
    await findAttendance(
      attendanceData.school_id,
      attendanceData.student_id,
      attendanceData.attendance_date
    );


  if (existing) {

    throw new Error(
      "Attendance already marked for this student on this date"
    );

  }


  await markAttendance({

    ...attendanceData,

    status,

    created_by:
      attendanceData.created_by,

    updated_by:
      attendanceData.created_by

  });


  return {

    message:
      "Attendance Marked Successfully"

  };

};


// =========================================================
// UPDATE ATTENDANCE
// =========================================================

const updateAttendanceService =
async (
  id,
  data,
  user
) => {

  const status =
    normalizeStatus(
      data.status
    );


  await updateAttendance(
    id,
    {

      status,

      remarks:
        data.remarks,

      updated_by:
        user.id

    }
  );


  return {

    message:
      "Attendance Updated Successfully"

  };

};


// =========================================================
// GET ALL
// =========================================================

const getAllAttendanceService =
async (
  user
) => {

  return await getAllAttendance(
    user
  );

};


// =========================================================
// GET BY GROUP
// =========================================================

const getAttendanceByGroupService =
async (
  user,
  schoolClassId,
  sectionId,
  batchId,
  attendanceDate
) => {

  if (
    !schoolClassId
  ) {

    throw new Error(
      "Class is required"
    );

  }


  if (
    !attendanceDate
  ) {

    throw new Error(
      "Attendance date is required"
    );

  }


  return await getAttendanceByGroup(
    user,
    schoolClassId,
    sectionId,
    batchId,
    attendanceDate
  );

};


// =========================================================
// EXPORT
// =========================================================

module.exports = {

  markAttendanceService,

  updateAttendanceService,

  getAllAttendanceService,

  getAttendanceByGroupService

};