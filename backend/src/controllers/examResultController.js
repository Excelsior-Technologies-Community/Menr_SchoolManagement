const {
  createExamResultService,
  getAllExamResultsService,
  getExamResultByIdService,
  getResultsByStudentService,
  getResultsByExamService,
  updateExamResultService,
  deleteExamResultService,
} = require("../services/examResultService");

const createExamResult = async (req, res) => {
  try {
    const result = await createExamResultService({
      ...req.body,
      created_by: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Exam result created successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllExamResults = async (req, res) => {
  try {
    const results =
      await getAllExamResultsService();

    return res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getExamResultById = async (req, res) => {
  try {
    const result =
      await getExamResultByIdService(req.params.id);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const getResultsByStudent = async (req, res) => {
  try {
    const results =
      await getResultsByStudentService(
        req.params.studentId
      );

    return res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const getResultsByExam = async (req, res) => {
  try {
    const results =
      await getResultsByExamService(
        req.params.examId
      );

    return res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const updateExamResult = async (req, res) => {
  try {
    const result =
      await updateExamResultService(
        req.params.id,
        {
          ...req.body,
          updated_by: req.user.id,
        }
      );

    return res.status(200).json({
      success: true,
      message: "Exam result updated successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteExamResult = async (req, res) => {
  try {
    await deleteExamResultService(
      req.params.id,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Exam result deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createExamResult,
  getAllExamResults,
  getExamResultById,
  getResultsByStudent,
  getResultsByExam,
  updateExamResult,
  deleteExamResult,
};