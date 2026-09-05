const {
  markAttendanceService,
  getAllAttendanceService,
  getAttendanceByGroupService,
  updateAttendanceService
} = require("../services/attendanceService");


// =========================================================
// MARK ATTENDANCE
// =========================================================

const markAttendance = async (req, res) => {

  try {

    console.log(
      "Attendance Data:",
      req.body
    );

    const result =
      await markAttendanceService({

        ...req.body,

        schoolId:
          req.user.schoolId,

        role:
          req.user.role

      });

    return res.status(201).json({

      success: true,

      data: result

    });

  } catch (error) {

    console.log(
      "Attendance Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};


// =========================================================
// GET ALL ATTENDANCE
// =========================================================

const getAllAttendance = async (
  req,
  res
) => {

  try {

    const attendance =
      await getAllAttendanceService(
        req.user
      );

    return res.status(200).json({

      success: true,

      data: attendance

    });

  } catch (error) {

    console.log(
      "Attendance Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};


// =========================================================
// GET ATTENDANCE BY GROUP
// =========================================================

const getAttendanceByGroup = async (
  req,
  res
) => {

  try {

    const {

      schoolClassId,
      sectionId,
      batchId,
      attendanceDate

    } = req.query;


    const attendance =
      await getAttendanceByGroupService({

        schoolClassId,
        sectionId,
        batchId,
        attendanceDate,

        schoolId:
          req.user.schoolId,

        role:
          req.user.role

      });


    return res.status(200).json({

      success: true,

      data: attendance

    });

  } catch (error) {

    console.log(
      "GROUP ATTENDANCE ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};


// =========================================================
// UPDATE ATTENDANCE
// =========================================================

const updateAttendance = async (
  req,
  res
) => {

  try {

    const result =
      await updateAttendanceService(

        req.params.id,

        {
          ...req.body,

          updated_by:
            req.user.id
        }

      );


    return res.status(200).json({

      success: true,

      data: result

    });

  } catch (error) {

    console.log(
      "UPDATE ATTENDANCE ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};


module.exports = {

  markAttendance,

  getAllAttendance,

  getAttendanceByGroup,

  updateAttendance

};