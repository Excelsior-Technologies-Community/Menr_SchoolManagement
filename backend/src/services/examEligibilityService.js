const {
  checkExamExists,
  checkBatchExists,
  checkDuplicateEligibility,
  createExamEligibility,
  getAllExamEligibility,
  getExamEligibilityById,
  updateExamEligibility,
  deleteExamEligibility
} = require(
  "../repositories/examEligibilityRepository"
);


// =========================================================
// NORMALIZE BOOLEAN
// =========================================================

const normalizeBoolean = (
  value,
  fieldName
) => {

  if (
    value === true ||
    value === 1 ||
    value === "1" ||
    value === "true"
  ) {
    return 1;
  }

  if (
    value === false ||
    value === 0 ||
    value === "0" ||
    value === "false"
  ) {
    return 0;
  }

  throw new Error(
    `${fieldName} must be true or false`
  );
};


// =========================================================
// VALIDATION
// =========================================================

const validateEligibilityData = async (
  data
) => {

  const requiredFields = [
    "exam_id",
    "minimum_attendance_percentage"
  ];

  for (const field of requiredFields) {

    if (
      data[field] === undefined ||
      data[field] === null ||
      String(data[field]).trim() === ""
    ) {

      throw new Error(
        `${field} is required`
      );

    }

  }


  const attendance = Number(
    data.minimum_attendance_percentage
  );

  if (
    Number.isNaN(attendance) ||
    attendance < 0 ||
    attendance > 100
  ) {

    throw new Error(
      "Minimum attendance percentage must be between 0 and 100"
    );

  }


  const exam =
    await checkExamExists(
      data.exam_id
    );

  if (!exam) {

    throw new Error(
      "Exam not found"
    );

  }


  if (
    data.batch_id !== undefined &&
    data.batch_id !== null &&
    String(data.batch_id).trim() !== ""
  ) {

    const batch =
      await checkBatchExists(
        data.batch_id
      );

    if (!batch) {

      throw new Error(
        "Batch not found"
      );

    }

  }


  data.minimum_attendance_percentage =
    attendance;

  data.batch_id =
    data.batch_id === undefined ||
    data.batch_id === null ||
    String(data.batch_id).trim() === ""
      ? null
      : data.batch_id;

  data.fee_clearance_required =
    normalizeBoolean(
      data.fee_clearance_required ?? false,
      "fee_clearance_required"
    );

  data.homework_completion_required =
    normalizeBoolean(
      data.homework_completion_required ?? false,
      "homework_completion_required"
    );

};


// =========================================================
// CREATE
// =========================================================

const createExamEligibilityService =
async (data) => {

  await validateEligibilityData(
    data
  );

  const duplicate =
    await checkDuplicateEligibility(
      data
    );

  if (duplicate) {

    throw new Error(
      "Eligibility settings already exist for this exam and batch."
    );

  }

  data.status = "active";

  return await createExamEligibility(
    data
  );

};


// =========================================================
// GET ALL
// =========================================================

const getAllExamEligibilityService =
async () => {

  return await getAllExamEligibility();

};


// =========================================================
// GET BY ID
// =========================================================

const getExamEligibilityByIdService =
async (id) => {

  if (!id) {

    throw new Error(
      "Criteria ID is required"
    );

  }

  const data =
    await getExamEligibilityById(
      id
    );

  if (!data) {

    throw new Error(
      "Exam eligibility settings not found"
    );

  }

  return data;

};


// =========================================================
// UPDATE
// =========================================================

const updateExamEligibilityService =
async (
  id,
  data
) => {

  if (!id) {

    throw new Error(
      "Criteria ID is required"
    );

  }

  const existing =
    await getExamEligibilityById(
      id
    );

  if (!existing) {

    throw new Error(
      "Exam eligibility settings not found"
    );

  }

  await validateEligibilityData(
    data
  );

  const duplicate =
    await checkDuplicateEligibility(
      data,
      id
    );

  if (duplicate) {

    throw new Error(
      "Eligibility settings already exist for this exam and batch."
    );

  }

  data.status =
    data.status === "inactive"
      ? "inactive"
      : "active";

  return await updateExamEligibility(
    id,
    data
  );

};


// =========================================================
// DELETE
// =========================================================

const deleteExamEligibilityService =
async (
  id,
  updatedBy
) => {

  if (!id) {

    throw new Error(
      "Criteria ID is required"
    );

  }

  const existing =
    await getExamEligibilityById(
      id
    );

  if (!existing) {

    throw new Error(
      "Exam eligibility settings not found"
    );

  }

  return await deleteExamEligibility(
    id,
    updatedBy
  );

};


// =========================================================
// EXPORTS
// =========================================================

module.exports = {

  createExamEligibilityService,

  getAllExamEligibilityService,

  getExamEligibilityByIdService,

  updateExamEligibilityService,

  deleteExamEligibilityService

};