const {
  createAttendanceService,
  getAllAttendanceService,
  getAttendanceByStudentService,
  getAttendanceByDateService,

  getAllClassAttendanceStatusService,
  getClassAttendanceStatusService,
  createClassAttendanceStatusService,
  updateClassAttendanceStatusService

} = require(
  "../services/attendanceV2Service"
);


// =========================================================
// STUDENT ATTENDANCE
// =========================================================

// Mark Attendance

const createAttendance =
async (req, res) => {

  try {

    const result =
      await createAttendanceService({

        ...req.body,

        school_id:
          req.user.school_id ||
          req.user.schoolId,

        created_by:
          req.user.id

      });


    return res.status(201).json({

      success: true,

      data: result

    });

  } catch (error) {

    return res.status(400).json({

      success: false,

      message: error.message

    });

  }

};


// =========================================================
// GET ALL ATTENDANCE
// =========================================================

const getAllAttendance =
async (req, res) => {

  try {

    const data =
      await getAllAttendanceService();


    return res.status(200).json({

      success: true,

      data

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


// =========================================================
// GET ATTENDANCE BY STUDENT
// =========================================================

const getAttendanceByStudent =
async (req, res) => {

  try {

    const data =
      await getAttendanceByStudentService(
        req.params.studentId
      );


    return res.status(200).json({

      success: true,

      data

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


// =========================================================
// GET ATTENDANCE BY DATE
// =========================================================

const getAttendanceByDate =
async (req, res) => {

  try {

    const data =
      await getAttendanceByDateService(
        req.params.date
      );


    return res.status(200).json({

      success: true,

      data

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


// =========================================================
// CLASS ATTENDANCE STATUS
// =========================================================


// Get All Class Attendance Status

const getAllClassAttendanceStatus =
async (req, res) => {

  try {

    const schoolId =
      req.user.school_id ||
      req.user.schoolId;


    const data =
      await getAllClassAttendanceStatusService(
        schoolId
      );


    return res.status(200).json({

      success: true,

      data

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


// =========================================================
// GET CLASS ATTENDANCE STATUS
// =========================================================

const getClassAttendanceStatus =
async (req, res) => {

  try {

    const schoolId =
      req.user.school_id ||
      req.user.schoolId;


    const data =
      await getClassAttendanceStatusService(

        schoolId,

        req.params.classId,

        req.params.sectionId,

        req.params.date

      );


    return res.status(200).json({

      success: true,

      data

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


// =========================================================
// CREATE CLASS ATTENDANCE STATUS
// =========================================================

const createClassAttendanceStatus =
async (req, res) => {

  try {

    const schoolId =
      req.user.school_id ||
      req.user.schoolId;


    const result =
      await createClassAttendanceStatusService({

        ...req.body,

        school_id:
          schoolId,

        staff_id:
          req.user.id,

        created_by:
          req.user.id

      });


    return res.status(201).json({

      success: true,

      data: result,

      message:
        "Class Attendance Created Successfully"

    });

  } catch (error) {

    return res.status(400).json({

      success: false,

      message: error.message

    });

  }

};


// =========================================================
// UPDATE / SUBMIT CLASS ATTENDANCE
// =========================================================

const updateClassAttendanceStatus =
async (req, res) => {

  try {

    const schoolId =
      req.user.school_id ||
      req.user.schoolId;


    const result =
      await updateClassAttendanceStatusService(

        req.params.id,

        {

          ...req.body,

          school_id:
            schoolId,

          updated_by:
            req.user.id

        }

      );


    return res.status(200).json({

      success: true,

      data: result,

      message:
        req.body.attendance_status ===
        "Completed"

          ? "Attendance Submitted Successfully"

          : "Attendance Updated Successfully"

    });

  } catch (error) {

    return res.status(400).json({

      success: false,

      message: error.message

    });

  }

};


// =========================================================
// EXPORTS
// =========================================================

module.exports = {

  // Student Attendance

  createAttendance,
  getAllAttendance,
  getAttendanceByStudent,
  getAttendanceByDate,


  // Class Attendance Status

  getAllClassAttendanceStatus,
  getClassAttendanceStatus,
  createClassAttendanceStatus,
  updateClassAttendanceStatus

};