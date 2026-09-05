const {
  checkSchoolExists,
  checkBranchExists,
  checkDuplicateHall,
  createExamHall,
  getAllExamHalls,
  getExamHallById,
  updateExamHall,
  deleteExamHall
} = require(
  "../repositories/examHallRepository"
);


// =========================================================
// VALIDATION
// =========================================================

const validateExamHallData = async (
  data
) => {

  const requiredFields = [
    "school_id",
    "hall_name",
    "capacity"
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


  const capacity =
    Number(data.capacity);

  if (
    Number.isNaN(capacity) ||
    !Number.isInteger(capacity) ||
    capacity <= 0
  ) {

    throw new Error(
      "Hall capacity must be a positive integer"
    );

  }


  const school =
    await checkSchoolExists(
      data.school_id
    );

  if (!school) {

    throw new Error(
      "School not found"
    );

  }


  if (
    data.branch_id !== undefined &&
    data.branch_id !== null &&
    String(data.branch_id).trim() !== ""
  ) {

    const branch =
      await checkBranchExists(
        data.branch_id,
        data.school_id
      );

    if (!branch) {

      throw new Error(
        "Branch not found for the selected school"
      );

    }

  } else {

    data.branch_id = null;

  }


  data.hall_name =
    String(data.hall_name).trim();

  data.capacity =
    capacity;

};


// =========================================================
// CREATE
// =========================================================

const createExamHallService =
async (data) => {

  await validateExamHallData(
    data
  );

  const duplicate =
    await checkDuplicateHall(
      data
    );

  if (duplicate) {

    throw new Error(
      "An active exam hall with this name already exists for this school and branch."
    );

  }

  data.status = "active";

  return await createExamHall(
    data
  );

};


// =========================================================
// GET ALL
// =========================================================

const getAllExamHallsService =
async () => {

  return await getAllExamHalls();

};


// =========================================================
// GET BY ID
// =========================================================

const getExamHallByIdService =
async (id) => {

  if (!id) {

    throw new Error(
      "Hall ID is required"
    );

  }

  const data =
    await getExamHallById(
      id
    );

  if (!data) {

    throw new Error(
      "Exam hall not found"
    );

  }

  return data;

};


// =========================================================
// UPDATE
// =========================================================

const updateExamHallService =
async (
  id,
  data
) => {

  if (!id) {

    throw new Error(
      "Hall ID is required"
    );

  }

  const existing =
    await getExamHallById(
      id
    );

  if (!existing) {

    throw new Error(
      "Exam hall not found"
    );

  }

  await validateExamHallData(
    data
  );

  const duplicate =
    await checkDuplicateHall(
      data,
      id
    );

  if (duplicate) {

    throw new Error(
      "An active exam hall with this name already exists for this school and branch."
    );

  }

  data.status =
    data.status === "inactive"
      ? "inactive"
      : "active";

  return await updateExamHall(
    id,
    data
  );

};


// =========================================================
// DELETE
// =========================================================

const deleteExamHallService =
async (
  id,
  updatedBy
) => {

  if (!id) {

    throw new Error(
      "Hall ID is required"
    );

  }

  const existing =
    await getExamHallById(
      id
    );

  if (!existing) {

    throw new Error(
      "Exam hall not found"
    );

  }

  return await deleteExamHall(
    id,
    updatedBy
  );

};


// =========================================================
// EXPORTS
// =========================================================

module.exports = {

  createExamHallService,

  getAllExamHallsService,

  getExamHallByIdService,

  updateExamHallService,

  deleteExamHallService

};