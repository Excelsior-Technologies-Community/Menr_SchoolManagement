const {
  checkExamExists,
  checkStudentExists,
  checkBatchExists,
  getHallById,
  getTimetableById,
  generateUniqueTimetableId,
  checkDuplicateStudentAllocation,
  checkDuplicateSeat,
  getActiveHallAllocationCount,
  createExamHallAllocation,
  getAllExamHallAllocations,
  getExamHallAllocationById,
  updateExamHallAllocation,
  cancelExamHallAllocation
} = require(
  "../repositories/examHallAllocationRepository"
);


// =========================================================
// VALIDATION
// =========================================================

const validateExamHallAllocationData =
async (
  data,
  excludeId = null
) => {

  const requiredFields = [
    "exam_id",
    "student_id",
    "batch_id",
    "hall_id",
    "seat_number",
    "exam_date"
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
  // EXAM
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
  // STUDENT
  // =======================================================

  const student =
    await checkStudentExists(
      data.student_id
    );

  if (!student) {

    throw new Error(
      "Student not found"
    );

  }


  // =======================================================
  // STUDENT STATUS
  // =======================================================

  const studentStatus =
    String(student.status || "")
      .trim()
      .toUpperCase();

  if (
    studentStatus !== "ACTIVE"
  ) {

    throw new Error(
      "Only active students can be allocated to an exam hall"
    );

  }


  // =======================================================
  // BATCH
  // =======================================================

  const batch =
    await checkBatchExists(
      data.batch_id
    );

  if (!batch) {

    throw new Error(
      "Batch not found"
    );

  }


  // =======================================================
  // STUDENT-BATCH CONSISTENCY
  // =======================================================

  if (
    student.batch_id !== null &&
    student.batch_id !== undefined &&
    String(student.batch_id) !==
      String(data.batch_id)
  ) {

    throw new Error(
      "Selected student does not belong to the selected batch"
    );

  }


  // =======================================================
  // HALL
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


  // =======================================================
  // HALL STATUS
  // =======================================================

  const hallStatus =
    String(hall.status || "")
      .trim()
      .toLowerCase();

  if (
    hallStatus !== "active"
  ) {

    throw new Error(
      "Selected exam hall is inactive"
    );

  }


  // =======================================================
  // SCHOOL CONSISTENCY
  // =======================================================

  if (
    String(student.school_id) !==
    String(exam.school_id)
  ) {

    throw new Error(
      "Student does not belong to the exam school"
    );

  }


  if (
    String(hall.school_id) !==
    String(exam.school_id)
  ) {

    throw new Error(
      "Exam hall does not belong to the exam school"
    );

  }


  // =======================================================
  // TIMETABLE
  // =======================================================

  if (
    data.exam_timetable_id !== undefined &&
    data.exam_timetable_id !== null &&
    String(data.exam_timetable_id).trim() !== ""
  ) {

    const timetable =
      await getTimetableById(
        data.exam_timetable_id
      );

    if (!timetable) {

      throw new Error(
        "Exam timetable not found"
      );

    }


    // -----------------------------------------------------
    // TIMETABLE EXAM
    // -----------------------------------------------------

    if (
      String(timetable.exam_id) !==
      String(data.exam_id)
    ) {

      throw new Error(
        "Selected timetable does not belong to the selected exam"
      );

    }


    // -----------------------------------------------------
    // TIMETABLE BATCH
    // -----------------------------------------------------

    if (
      String(timetable.batch_id) !==
      String(data.batch_id)
    ) {

      throw new Error(
        "Selected timetable does not belong to the selected batch"
      );

    }


    // -----------------------------------------------------
    // TIMETABLE SCHOOL
    // -----------------------------------------------------

    if (
      String(timetable.school_id) !==
      String(exam.school_id)
    ) {

      throw new Error(
        "Selected timetable does not belong to the exam school"
      );

    }


    // -----------------------------------------------------
    // TIMETABLE DATE
    // -----------------------------------------------------

    const timetableDate =
      String(timetable.exam_date)
        .substring(0, 10);

    const allocationDate =
      String(data.exam_date)
        .substring(0, 10);

    if (
      timetableDate !==
      allocationDate
    ) {

      throw new Error(
        "Exam date must match the selected timetable date"
      );

    }


    // -----------------------------------------------------
    // TIMETABLE STATUS
    // -----------------------------------------------------

    const timetableStatus =
      String(timetable.status || "")
        .trim()
        .toLowerCase();

    if (
      timetableStatus !== "active"
    ) {

      throw new Error(
        "Selected exam timetable is inactive"
      );

    }

  } else {

    data.exam_timetable_id = null;

  }


  // =======================================================
  // UNIQUE TIMETABLE ID
  // =======================================================

  data.unique_timetable_id =
    generateUniqueTimetableId(
      data
    );


  // =======================================================
  // SEAT
  // =======================================================

  data.seat_number =
    String(data.seat_number).trim();

  if (!data.seat_number) {

    throw new Error(
      "Seat number is required"
    );

  }


  // =======================================================
  // DUPLICATE STUDENT
  // =======================================================

  const duplicateStudent =
    await checkDuplicateStudentAllocation(
      data,
      excludeId
    );

  if (duplicateStudent) {

    throw new Error(
      "This student is already allocated for this exam timetable."
    );

  }


  // =======================================================
  // DUPLICATE SEAT
  // =======================================================

  const duplicateSeat =
    await checkDuplicateSeat(
      data,
      excludeId
    );

  if (duplicateSeat) {

    throw new Error(
      "This seat number is already allocated in the selected hall."
    );

  }


  // =======================================================
  // HALL CAPACITY
  // =======================================================

  const currentCount =
    await getActiveHallAllocationCount(
      data,
      excludeId
    );

  if (
    currentCount >= hall.capacity
  ) {

    throw new Error(
      `Hall capacity exceeded. Maximum capacity is ${hall.capacity}.`
    );

  }

};


// =========================================================
// CREATE
// =========================================================

const createExamHallAllocationService =
async (data) => {

  await validateExamHallAllocationData(
    data
  );

  data.allocation_status =
    "active";

  return await createExamHallAllocation(
    data
  );

};


// =========================================================
// GET ALL
// =========================================================

const getAllExamHallAllocationsService =
async () => {

  return await getAllExamHallAllocations();

};


// =========================================================
// GET BY ID
// =========================================================

const getExamHallAllocationByIdService =
async (id) => {

  if (!id) {

    throw new Error(
      "Allocation ID is required"
    );

  }

  const data =
    await getExamHallAllocationById(
      id
    );

  if (!data) {

    throw new Error(
      "Exam hall allocation not found"
    );

  }

  return data;

};


// =========================================================
// UPDATE
// =========================================================

const updateExamHallAllocationService =
async (
  id,
  data
) => {

  if (!id) {

    throw new Error(
      "Allocation ID is required"
    );

  }

  const existing =
    await getExamHallAllocationById(
      id
    );

  if (!existing) {

    throw new Error(
      "Exam hall allocation not found"
    );

  }


  await validateExamHallAllocationData(
    data,
    id
  );


  data.allocation_status =
    data.allocation_status === "cancelled"
      ? "cancelled"
      : "active";


  return await updateExamHallAllocation(
    id,
    data
  );

};


// =========================================================
// CANCEL
// =========================================================

const cancelExamHallAllocationService =
async (
  id,
  updatedBy
) => {

  if (!id) {

    throw new Error(
      "Allocation ID is required"
    );

  }

  const existing =
    await getExamHallAllocationById(
      id
    );

  if (!existing) {

    throw new Error(
      "Exam hall allocation not found"
    );

  }

  return await cancelExamHallAllocation(
    id,
    updatedBy
  );

};


// =========================================================
// EXPORTS
// =========================================================

module.exports = {

  createExamHallAllocationService,

  getAllExamHallAllocationsService,

  getExamHallAllocationByIdService,

  updateExamHallAllocationService,

  cancelExamHallAllocationService

};