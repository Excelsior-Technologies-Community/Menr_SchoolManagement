const {
  createExamMarkService,
  getAllExamMarksService,
  getExamMarkByIdService,
  getExamMarksByStudentService,
  getExamMarksByExamService,
  updateExamMarkService,
  deleteExamMarkService
} = require(
  "../services/examMarksService"
);


// =========================================================
// CREATE
// =========================================================

const createExamMark = async (
  req,
  res
) => {

  try {

    const result =
      await createExamMarkService({
        ...req.body,
        created_by: req.user.id
      });

    return res.status(201).json({
      success: true,
      message: "Exam marks created successfully.",
      data: result
    });

  } catch (error) {

    console.error(
      "Create Exam Mark Error =>",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }

};


// =========================================================
// GET ALL
// =========================================================

const getAllExamMarks = async (
  req,
  res
) => {

  try {

    const data =
      await getAllExamMarksService();

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
// GET BY ID
// =========================================================

const getExamMarkById = async (
  req,
  res
) => {

  try {

    const data =
      await getExamMarkByIdService(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      data
    });

  } catch (error) {

    return res.status(404).json({
      success: false,
      message: error.message
    });

  }

};


// =========================================================
// GET BY STUDENT
// =========================================================

const getExamMarksByStudent = async (
  req,
  res
) => {

  try {

    const data =
      await getExamMarksByStudentService(
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
// GET BY EXAM
// =========================================================

const getExamMarksByExam = async (
  req,
  res
) => {

  try {

    const data =
      await getExamMarksByExamService(
        req.params.examId
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
// UPDATE
// =========================================================

const updateExamMark = async (
  req,
  res
) => {

  try {

    const result =
      await updateExamMarkService(
        req.params.id,
        {
          ...req.body,
          updated_by: req.user.id
        }
      );

    return res.status(200).json({
      success: true,
      message: "Exam marks updated successfully.",
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
// DELETE
// =========================================================

const deleteExamMark = async (
  req,
  res
) => {

  try {

    await deleteExamMarkService(
      req.params.id,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Exam marks deleted successfully."
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }

};


module.exports = {

  createExamMark,
  getAllExamMarks,
  getExamMarkById,
  getExamMarksByStudent,
  getExamMarksByExam,
  updateExamMark,
  deleteExamMark
};