const {
  createExamEligibilityService,
  getAllExamEligibilityService,
  getExamEligibilityByIdService,
  updateExamEligibilityService,
  deleteExamEligibilityService
} = require(
  "../services/examEligibilityService"
);


// =========================================================
// CREATE
// =========================================================

const createExamEligibility = async (
  req,
  res
) => {

  try {

    const result =
      await createExamEligibilityService({
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

const getAllExamEligibility = async (
  req,
  res
) => {

  try {

    const data =
      await getAllExamEligibilityService();

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

const getExamEligibilityById = async (
  req,
  res
) => {

  try {

    const data =
      await getExamEligibilityByIdService(
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

const updateExamEligibility = async (
  req,
  res
) => {

  try {

    await updateExamEligibilityService(
      req.params.id,
      {
        ...req.body,
        updated_by: req.user.id
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Exam Eligibility Settings Updated Successfully"
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

const deleteExamEligibility = async (
  req,
  res
) => {

  try {

    await deleteExamEligibilityService(
      req.params.id,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Exam Eligibility Settings Deactivated Successfully"
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

  createExamEligibility,

  getAllExamEligibility,

  getExamEligibilityById,

  updateExamEligibility,

  deleteExamEligibility

};