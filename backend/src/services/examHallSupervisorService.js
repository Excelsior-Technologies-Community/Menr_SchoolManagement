const {
  checkExamExists,
  getTimetableById,
  getHallById,
  getSupervisorById,
  generateUniqueTimetableId,
  checkDuplicateSupervisorAssignment,
  checkSupervisorTimeConflict,
  checkHallTimeConflict,
  createExamHallSupervisor,
  getAllExamHallSupervisors,
  getExamHallSupervisorById,
  updateExamHallSupervisor,
  deleteExamHallSupervisor
} = require(
  "../repositories/examHallSupervisorRepository"
);


// =========================================================
// VALIDATION
// =========================================================

const validateExamHallSupervisorData = async (
  data
) => {

  const requiredFields = [
    "exam_id",
    "hall_id",
    "exam_date",
    "supervisor_id",
    "start_time",
    "end_time"
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


  // =======================================================
  // VALIDATE EXAM
  // =======================================================

  const exam =
    await checkExamExists(
      data.exam_id
    );

  if (!exam) {

    throw new Error(
      "Exam not found"
    );

  }


  // =======================================================
  // VALIDATE TIMETABLE
  // =======================================================

  let timetable = null;

  if (
    data.exam_timetable_id !== undefined &&
    data.exam_timetable_id !== null &&
    String(data.exam_timetable_id).trim() !== ""
  ) {

    timetable =
      await getTimetableById(
        data.exam_timetable_id
      );

    if (!timetable) {

      throw new Error(
        "Exam timetable not found"
      );

    }


    // Timetable must belong to selected exam

    if (
      Number(timetable.exam_id) !==
      Number(data.exam_id)
    ) {

      throw new Error(
        "Selected timetable does not belong to the selected exam"
      );

    }


    // If timetable has a school, it must match exam school

    if (
      exam.school_id !== null &&
      exam.school_id !== undefined &&
      timetable.school_id !== null &&
      timetable.school_id !== undefined &&
      Number(timetable.school_id) !==
      Number(exam.school_id)
    ) {

      throw new Error(
        "Selected timetable does not belong to the selected exam school"
      );

    }

    data.exam_timetable_id =
      data.exam_timetable_id;

  } else {

    data.exam_timetable_id = null;

  }


  // =======================================================
  // VALIDATE HALL
  // =======================================================

  const hall =
    await getHallById(
      data.hall_id
    );

  if (!hall) {

    throw new Error(
      "Exam hall not found"
    );

  }


  if (
    hall.status !== "active"
  ) {

    throw new Error(
      "Selected exam hall is inactive"
    );

  }


  // Hall must belong to exam school

  if (
    exam.school_id !== null &&
    exam.school_id !== undefined &&
    Number(hall.school_id) !==
    Number(exam.school_id)
  ) {

    throw new Error(
      "Selected exam hall does not belong to the selected exam school"
    );

  }


  // =======================================================
  // VALIDATE SUPERVISOR
  // =======================================================

  const supervisor =
    await getSupervisorById(
      data.supervisor_id
    );

  if (!supervisor) {

    throw new Error(
      "Supervisor not found"
    );

  }


  if (
    supervisor.status !== "active"
  ) {

    throw new Error(
      "Selected supervisor is inactive"
    );

  }


  // Supervisor must belong to exam school

  if (
    exam.school_id !== null &&
    exam.school_id !== undefined &&
    supervisor.school_id !== null &&
    supervisor.school_id !== undefined &&
    Number(supervisor.school_id) !==
    Number(exam.school_id)
  ) {

    throw new Error(
      "Selected supervisor does not belong to the selected exam school"
    );

  }


  // =======================================================
  // VALIDATE DATE
  // =======================================================

  const examDate =
    new Date(data.exam_date);

  if (
    Number.isNaN(
      examDate.getTime()
    )
  ) {

    throw new Error(
      "Invalid exam date"
    );

  }


  // =======================================================
  // VALIDATE EXAM DATE RANGE
  // =======================================================

  if (
    exam.start_date &&
    data.exam_date < exam.start_date
  ) {

    throw new Error(
      "Exam date cannot be before the exam start date"
    );

  }


  if (
    exam.end_date &&
    data.exam_date > exam.end_date
  ) {

    throw new Error(
      "Exam date cannot be after the exam end date"
    );

  }


  // =======================================================
  // TIMETABLE DATE VALIDATION
  // =======================================================

  if (
    timetable &&
    timetable.exam_date
  ) {

    const timetableDate =
      String(
        timetable.exam_date
      ).slice(0, 10);

    const selectedDate =
      String(
        data.exam_date
      ).slice(0, 10);

    if (
      timetableDate !==
      selectedDate
    ) {

      throw new Error(
        "Exam date must match the selected exam timetable date"
      );

    }

  }


  // =======================================================
  // VALIDATE TIME
  // =======================================================

  if (
    data.start_time >=
    data.end_time
  ) {

    throw new Error(
      "Start time must be earlier than end time"
    );

  }


  // =======================================================
  // TIMETABLE TIME VALIDATION
  // =======================================================

  if (
    timetable &&
    timetable.start_time &&
    timetable.end_time
  ) {

    if (
      data.start_time <
      timetable.start_time ||
      data.end_time >
      timetable.end_time
    ) {

      throw new Error(
        "Supervisor assignment time must be within the exam timetable time"
      );

    }

  }


  // =======================================================
  // GENERATE UNIQUE TIMETABLE ID
  // =======================================================

  data.unique_timetable_id =
    generateUniqueTimetableId(
      data
    );


  // =======================================================
  // NORMALIZE STATUS
  // =======================================================

  data.status =
    data.status === "inactive"
      ? "inactive"
      : "active";

};


// =========================================================
// CREATE
// =========================================================

const createExamHallSupervisorService =
async (data) => {

  await validateExamHallSupervisorData(
    data
  );


  // =======================================================
  // DUPLICATE ASSIGNMENT
  // =======================================================

  const duplicate =
    await checkDuplicateSupervisorAssignment(
      data
    );

  if (duplicate) {

    throw new Error(
      "This supervisor is already assigned to this hall for the selected timetable."
    );

  }


  // =======================================================
  // SUPERVISOR TIME CONFLICT
  // =======================================================

  const supervisorConflict =
    await checkSupervisorTimeConflict(
      data
    );

  if (supervisorConflict) {

    throw new Error(
      "Supervisor already has another active assignment during this time."
    );

  }


  // =======================================================
  // HALL TIME CONFLICT
  // =======================================================

  const hallConflict =
    await checkHallTimeConflict(
      data
    );

  if (hallConflict) {

    throw new Error(
      "This exam hall already has another active supervisor assignment during this time."
    );

  }


  return await createExamHallSupervisor(
    data
  );

};


// =========================================================
// GET ALL
// =========================================================

const getAllExamHallSupervisorsService =
async () => {

  return await getAllExamHallSupervisors();

};


// =========================================================
// GET BY ID
// =========================================================

const getExamHallSupervisorByIdService =
async (id) => {

  if (!id) {

    throw new Error(
      "Supervisor assignment ID is required"
    );

  }


  const data =
    await getExamHallSupervisorById(
      id
    );

  if (!data) {

    throw new Error(
      "Exam hall supervisor assignment not found"
    );

  }


  return data;

};


// =========================================================
// UPDATE
// =========================================================

const updateExamHallSupervisorService =
async (
  id,
  data
) => {

  if (!id) {

    throw new Error(
      "Supervisor assignment ID is required"
    );

  }


  // =======================================================
  // CHECK EXISTING
  // =======================================================

  const existing =
    await getExamHallSupervisorById(
      id
    );

  if (!existing) {

    throw new Error(
      "Exam hall supervisor assignment not found"
    );

  }


  // =======================================================
  // VALIDATE NEW DATA
  // =======================================================

  await validateExamHallSupervisorData(
    data
  );


  // =======================================================
  // DUPLICATE ASSIGNMENT
  // =======================================================

  const duplicate =
    await checkDuplicateSupervisorAssignment(
      data,
      id
    );

  if (duplicate) {

    throw new Error(
      "This supervisor is already assigned to this hall for the selected timetable."
    );

  }


  // =======================================================
  // SUPERVISOR TIME CONFLICT
  // =======================================================

  const supervisorConflict =
    await checkSupervisorTimeConflict(
      data,
      id
    );

  if (supervisorConflict) {

    throw new Error(
      "Supervisor already has another active assignment during this time."
    );

  }


  // =======================================================
  // HALL TIME CONFLICT
  // =======================================================

  const hallConflict =
    await checkHallTimeConflict(
      data,
      id
    );

  if (hallConflict) {

    throw new Error(
      "This exam hall already has another active supervisor assignment during this time."
    );

  }


  return await updateExamHallSupervisor(
    id,
    data
  );

};


// =========================================================
// DELETE
// =========================================================

const deleteExamHallSupervisorService =
async (
  id,
  updatedBy
) => {

  if (!id) {

    throw new Error(
      "Supervisor assignment ID is required"
    );

  }


  const existing =
    await getExamHallSupervisorById(
      id
    );

  if (!existing) {

    throw new Error(
      "Exam hall supervisor assignment not found"
    );

  }


  return await deleteExamHallSupervisor(
    id,
    updatedBy
  );

};


// =========================================================
// EXPORTS
// =========================================================

module.exports = {

  createExamHallSupervisorService,

  getAllExamHallSupervisorsService,

  getExamHallSupervisorByIdService,

  updateExamHallSupervisorService,

  deleteExamHallSupervisorService

};