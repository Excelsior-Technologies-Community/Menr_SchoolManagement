const {
  createExamHallSupervisorService,
  getAllExamHallSupervisorsService,
  getExamHallSupervisorByIdService,
  updateExamHallSupervisorService,
  deleteExamHallSupervisorService
} = require(
  "../services/examHallSupervisorService"
);


// =========================================================
// CREATE
// =========================================================

const createExamHallSupervisor = async (
  req,
  res
) => {

  try {

    const result =
      await createExamHallSupervisorService({
        ...req.body,
        created_by: req.user.id
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
// GET ALL
// =========================================================

const getAllExamHallSupervisors = async (
  req,
  res
) => {

  try {

    const data =
      await getAllExamHallSupervisorsService();

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

const getExamHallSupervisorById = async (
  req,
  res
) => {

  try {

    const data =
      await getExamHallSupervisorByIdService(
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
// UPDATE
// =========================================================

const updateExamHallSupervisor = async (
  req,
  res
) => {

  try {

    await updateExamHallSupervisorService(
      req.params.id,
      {
        ...req.body,
        updated_by: req.user.id
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Exam Hall Supervisor Assignment Updated Successfully"
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

const deleteExamHallSupervisor = async (
  req,
  res
) => {

  try {

    await deleteExamHallSupervisorService(
      req.params.id,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Exam Hall Supervisor Assignment Deactivated Successfully"
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

  createExamHallSupervisor,

  getAllExamHallSupervisors,

  getExamHallSupervisorById,

  updateExamHallSupervisor,

  deleteExamHallSupervisor

};