const {
  createExamTimetable,
  getAllExamTimetables,
  getExamTimetableById,
  updateExamTimetable,
  deleteExamTimetable,
  checkDuplicateExamTimetable,
  checkBatchTimeConflict,
  checkSupervisorTimeConflict
} = require("../repositories/examTimetableRepository");


// =========================================================
// VALIDATION
// =========================================================

const validateExamTimetableData = (data) => {

  const requiredFields = [
    "exam_id",
    "subject_id",
    "batch_id",
    "school_id",
    "exam_date",
    "start_time",
    "end_time",
    "room_number",
    "supervisor_id"
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

  if (
    data.start_time >=
    data.end_time
  ) {
    throw new Error(
      "End Time must be greater than Start Time"
    );
  }

  const examDate =
    new Date(data.exam_date);

  if (
    Number.isNaN(
      examDate.getTime()
    )
  ) {
    throw new Error(
      "Invalid Exam Date"
    );
  }

  if (
    !String(data.room_number).trim()
  ) {
    throw new Error(
      "Room Number is required"
    );
  }

};


// =========================================================
// CHECK CONFLICTS
// =========================================================

const validateConflicts = async (
  data,
  excludeId = null
) => {

  const duplicate =
    await checkDuplicateExamTimetable(
      data,
      excludeId
    );

  if (duplicate) {
    throw new Error(
      "This exam, subject and batch timetable already exists."
    );
  }


  const batchConflict =
    await checkBatchTimeConflict(
      data,
      excludeId
    );

  if (batchConflict) {
    throw new Error(
      "This batch already has another exam scheduled at this date and time."
    );
  }


  const supervisorConflict =
    await checkSupervisorTimeConflict(
      data,
      excludeId
    );

  if (supervisorConflict) {
    throw new Error(
      "This supervisor is already assigned to another exam at this date and time."
    );
  }

};


// =========================================================
// CREATE
// =========================================================

const createExamTimetableService =
async (data) => {

  validateExamTimetableData(data);

  await validateConflicts(data);

  data.status = "active";

  return await createExamTimetable(data);

};


// =========================================================
// GET ALL
// =========================================================

const getAllExamTimetablesService =
async () => {

  return await getAllExamTimetables();

};


// =========================================================
// GET BY ID
// =========================================================

const getExamTimetableByIdService =
async (id) => {

  if (!id) {
    throw new Error(
      "Exam Timetable ID is required"
    );
  }

  const data =
    await getExamTimetableById(id);

  if (!data) {
    throw new Error(
      "Exam Timetable not found"
    );
  }

  return data;

};


// =========================================================
// UPDATE
// =========================================================

const updateExamTimetableService =
async (
  id,
  data
) => {

  if (!id) {
    throw new Error(
      "Exam Timetable ID is required"
    );
  }

  validateExamTimetableData(data);

  const existing =
    await getExamTimetableById(id);

  if (!existing) {
    throw new Error(
      "Exam Timetable not found"
    );
  }

  await validateConflicts(
    data,
    id
  );

  return await updateExamTimetable(
    id,
    data
  );

};


// =========================================================
// DELETE
// =========================================================

const deleteExamTimetableService =
async (id) => {

  if (!id) {
    throw new Error(
      "Exam Timetable ID is required"
    );
  }

  const existing =
    await getExamTimetableById(id);

  if (!existing) {
    throw new Error(
      "Exam Timetable not found"
    );
  }

  return await deleteExamTimetable(id);

};


// =========================================================
// EXPORTS
// =========================================================

module.exports = {

  createExamTimetableService,

  getAllExamTimetablesService,

  getExamTimetableByIdService,

  updateExamTimetableService,

  deleteExamTimetableService

};