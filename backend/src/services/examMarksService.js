const {
  getExamById,
  getStudentById,
  getSubjectById,
  checkExamSubject,
  checkDuplicateExamMark,
  createExamMark,
  getAllExamMarks,
  getExamMarkById,
  getExamMarksByStudent,
  getExamMarksByExam,
  updateExamMark,
  deleteExamMark
} = require(
  "../repositories/examMarksRepository"
);


// =========================================================
// MARKS JSON NORMALIZATION
// =========================================================

const normalizeMarks = (value) => {

  if (
    value === null ||
    value === undefined
  ) {
    throw new Error(
      "marks_obtained is required"
    );
  }

  let marks = value;

  if (typeof marks === "string") {

    try {
      marks = JSON.parse(marks);
    } catch {
      throw new Error(
        "marks_obtained must contain valid JSON"
      );
    }

  }

  if (
    typeof marks !== "object" ||
    Array.isArray(marks)
  ) {

    throw new Error(
      "marks_obtained must be a JSON object"
    );

  }

  const maxMarks =
    Number(marks.max_marks);

  const obtainedMarks =
    Number(marks.obtained_marks);

  if (
    !Number.isFinite(maxMarks) ||
    maxMarks <= 0
  ) {

    throw new Error(
      "marks_obtained.max_marks must be greater than 0"
    );

  }

  if (
    !Number.isFinite(obtainedMarks) ||
    obtainedMarks < 0
  ) {

    throw new Error(
      "marks_obtained.obtained_marks must be a valid number"
    );

  }

  if (
    obtainedMarks > maxMarks
  ) {

    throw new Error(
      "Obtained marks cannot exceed maximum marks"
    );

  }

  return {
    ...marks,
    max_marks: maxMarks,
    obtained_marks: obtainedMarks
  };

};


// =========================================================
// RESULT STATUS
// =========================================================

const calculateResultStatus = (
  marks,
  graceMarks
) => {

  const effectiveMarks =
    Number(marks.obtained_marks) +
    Number(graceMarks || 0);

  const percentage =
    (
      effectiveMarks /
      Number(marks.max_marks)
    ) * 100;

  return percentage >= 40
    ? "passed"
    : "failed";
};


// =========================================================
// VALIDATION
// =========================================================

const validateExamMarkData =
async (
  data,
  excludeId = null
) => {

  const requiredFields = [
    "exam_id",
    "student_id",
    "exam_subject_id"
  ];

  for (
    const field of requiredFields
  ) {

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


  // -------------------------------------------------------
  // EXAM
  // -------------------------------------------------------

  const exam =
    await getExamById(
      data.exam_id
    );

  if (!exam) {

    throw new Error(
      "Exam not found"
    );

  }


  // -------------------------------------------------------
  // STUDENT
  // -------------------------------------------------------

  const student =
    await getStudentById(
      data.student_id
    );

  if (!student) {

    throw new Error(
      "Student not found"
    );

  }


  if (
    String(student.status || "")
      .trim()
      .toUpperCase() !== "ACTIVE"
  ) {

    throw new Error(
      "Only active students can have exam marks"
    );

  }


  // -------------------------------------------------------
  // SCHOOL
  // -------------------------------------------------------

  if (
    String(student.school_id) !==
    String(exam.school_id)
  ) {

    throw new Error(
      "Student does not belong to the exam school"
    );

  }


  // -------------------------------------------------------
  // SUBJECT
  // -------------------------------------------------------

  const subject =
    await getSubjectById(
      data.exam_subject_id
    );

  if (!subject) {

    throw new Error(
      "Exam subject not found"
    );

  }


  if (
    String(subject.status || "")
      .trim()
      .toLowerCase() !== "active"
  ) {

    throw new Error(
      "Selected subject is inactive"
    );

  }


  // -------------------------------------------------------
  // EXAM SUBJECT VALIDATION
  // -------------------------------------------------------

  const examSubject =
    await checkExamSubject(
      data.exam_id,
      data.exam_subject_id
    );

  if (!examSubject) {

    throw new Error(
      "Selected subject is not assigned to the selected exam"
    );

  }


  // -------------------------------------------------------
  // ATTEMPT
  // -------------------------------------------------------

  const attemptNumber =
    Number(data.attempt_number || 1);

  if (
    !Number.isInteger(attemptNumber) ||
    attemptNumber < 1
  ) {

    throw new Error(
      "Attempt number must be a positive integer"
    );

  }

  data.attempt_number =
    attemptNumber;


  // -------------------------------------------------------
  // SUPPLEMENTARY
  // -------------------------------------------------------

  data.is_supplementary =
    Boolean(
      data.is_supplementary
    );


  // -------------------------------------------------------
  // GRACE MARKS
  // -------------------------------------------------------

  const graceMarks =
    Number(data.grace_marks || 0);

  if (
    !Number.isFinite(graceMarks) ||
    graceMarks < 0
  ) {

    throw new Error(
      "Grace marks must be a valid positive number"
    );

  }

  data.grace_marks =
    graceMarks;


  // -------------------------------------------------------
  // ATTENDANCE
  // -------------------------------------------------------

  const attendanceStatus =
    data.exam_attendance_status ||
    "Present";

  const allowedAttendance = [
    "Present",
    "Absent",
    "Medical Leave",
    "Exempt"
  ];

  if (
    !allowedAttendance.includes(
      attendanceStatus
    )
  ) {

    throw new Error(
      "Invalid exam attendance status"
    );

  }

  data.exam_attendance_status =
    attendanceStatus;


  // -------------------------------------------------------
  // MARKS
  // -------------------------------------------------------

  const marks =
    normalizeMarks(
      data.marks_obtained
    );

  data.marks_obtained =
    marks;


  // -------------------------------------------------------
  // RESULT STATUS
  // -------------------------------------------------------

  if (
    attendanceStatus !== "Present"
  ) {

    data.result_status =
      "failed";

  } else {

    data.result_status =
      calculateResultStatus(
        marks,
        graceMarks
      );

  }


  // -------------------------------------------------------
  // STATUS
  // -------------------------------------------------------

  data.status =
    data.status === "inactive"
      ? "inactive"
      : "active";


  // -------------------------------------------------------
  // DUPLICATE
  // -------------------------------------------------------

  const duplicate =
    await checkDuplicateExamMark(
      data,
      excludeId
    );

  if (duplicate) {

    throw new Error(
      "Exam marks already exist for this student, subject and attempt."
    );

  }

};


// =========================================================
// CREATE
// =========================================================

const createExamMarkService =
async (data) => {

  await validateExamMarkData(
    data
  );

  return await createExamMark(
    data
  );

};


// =========================================================
// GET ALL
// =========================================================

const getAllExamMarksService =
async () => {

  return await getAllExamMarks();

};


// =========================================================
// GET BY ID
// =========================================================

const getExamMarkByIdService =
async (id) => {

  const data =
    await getExamMarkById(id);

  if (!data) {

    throw new Error(
      "Exam marks record not found"
    );

  }

  return data;

};


// =========================================================
// GET BY STUDENT
// =========================================================

const getExamMarksByStudentService =
async (studentId) => {

  return await getExamMarksByStudent(
    studentId
  );

};


// =========================================================
// GET BY EXAM
// =========================================================

const getExamMarksByExamService =
async (examId) => {

  return await getExamMarksByExam(
    examId
  );

};


// =========================================================
// UPDATE
// =========================================================

const updateExamMarkService =
async (
  id,
  data
) => {

  const existing =
    await getExamMarkById(id);

  if (!existing) {

    throw new Error(
      "Exam marks record not found"
    );

  }

  await validateExamMarkData(
    data,
    id
  );

  return await updateExamMark(
    id,
    data
  );

};


// =========================================================
// DELETE
// =========================================================

const deleteExamMarkService =
async (
  id,
  updatedBy
) => {

  const existing =
    await getExamMarkById(id);

  if (!existing) {

    throw new Error(
      "Exam marks record not found"
    );

  }

  return await deleteExamMark(
    id,
    updatedBy
  );

};


module.exports = {

  createExamMarkService,

  getAllExamMarksService,

  getExamMarkByIdService,

  getExamMarksByStudentService,

  getExamMarksByExamService,

  updateExamMarkService,

  deleteExamMarkService
};