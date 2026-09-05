const {
  createExamHallAllocationService,
  getAllExamHallAllocationsService,
  getExamHallAllocationByIdService,
  updateExamHallAllocationService,
  cancelExamHallAllocationService
} = require(
  "../services/examHallAllocationService"
);


// =========================================================
// CREATE
// =========================================================

const createExamHallAllocation = async (
  req,
  res
) => {

  try {

    const result =
      await createExamHallAllocationService({
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

const getAllExamHallAllocations = async (
  req,
  res
) => {

  try {

    const data =
      await getAllExamHallAllocationsService();

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

const getExamHallAllocationById = async (
  req,
  res
) => {

  try {

    const data =
      await getExamHallAllocationByIdService(
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

const updateExamHallAllocation = async (
  req,
  res
) => {

  try {

    await updateExamHallAllocationService(
      req.params.id,
      {
        ...req.body,
        updated_by: req.user.id
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Exam Hall Allocation Updated Successfully"
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }

};


// =========================================================
// CANCEL
// =========================================================

const cancelExamHallAllocation = async (
  req,
  res
) => {

  try {

    await cancelExamHallAllocationService(
      req.params.id,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Exam Hall Allocation Cancelled Successfully"
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

  createExamHallAllocation,

  getAllExamHallAllocations,

  getExamHallAllocationById,

  updateExamHallAllocation,

  cancelExamHallAllocation

};