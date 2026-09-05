const {
  createTimeTableSubstitution,
  getAllTimeTableSubstitutions,
  getTimeTableSubstitutionById,
  updateTimeTableSubstitution,
  deleteTimeTableSubstitution
} = require(
  "../repositories/timeTableSubstitutionRepository"
);


// =========================================================
// CREATE
// =========================================================

const createTimeTableSubstitutionService =
async (data) => {

  data.status = "active";

  return await createTimeTableSubstitution(
    data
  );

};


// =========================================================
// GET ALL
// =========================================================

const getAllTimeTableSubstitutionsService =
async () => {

  return await getAllTimeTableSubstitutions();

};


// =========================================================
// GET BY ID
// =========================================================

const getTimeTableSubstitutionByIdService =
async (id) => {

  const result =
    await getTimeTableSubstitutionById(
      id
    );

  if (!result) {
    throw new Error(
      "Substitution not found"
    );
  }

  return result;

};


// =========================================================
// UPDATE
// =========================================================

const updateTimeTableSubstitutionService =
async (
  id,
  data
) => {

  return await updateTimeTableSubstitution(
    id,
    data
  );

};


// =========================================================
// DELETE
// =========================================================

const deleteTimeTableSubstitutionService =
async (id) => {

  return await deleteTimeTableSubstitution(
    id
  );

};


module.exports = {

  createTimeTableSubstitutionService,

  getAllTimeTableSubstitutionsService,

  getTimeTableSubstitutionByIdService,

  updateTimeTableSubstitutionService,

  deleteTimeTableSubstitutionService

};