const {
  createExamHallService,
  getAllExamHallsService,
  getExamHallByIdService,
  updateExamHallService,
  deleteExamHallService
} = require(
  "../services/examHallService"
);


// =========================================================
// CREATE
// =========================================================

const createExamHall = async (
  req,
  res
) => {

  try {

    const result =
      await createExamHallService({
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

const getAllExamHalls = async (
  req,
  res
) => {

  try {

    const data =
      await getAllExamHallsService();

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

const getExamHallById = async (
  req,
  res
) => {

  try {

    const data =
      await getExamHallByIdService(
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

const updateExamHall = async (
  req,
  res
) => {

  try {

    await updateExamHallService(
      req.params.id,
      {
        ...req.body,
        updated_by: req.user.id
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Exam Hall Updated Successfully"
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

const deleteExamHall = async (
  req,
  res
) => {

  try {

    await deleteExamHallService(
      req.params.id,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Exam Hall Deactivated Successfully"
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

  createExamHall,

  getAllExamHalls,

  getExamHallById,

  updateExamHall,

  deleteExamHall

};