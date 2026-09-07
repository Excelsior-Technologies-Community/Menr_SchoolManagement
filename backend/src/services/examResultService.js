const repository = require("../repositories/examResultRepository");

const calculateGrade = (percentage) => {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  if (percentage >= 40) return "D";
  return "F";
};

const calculateGPA = (percentage) => {
  if (percentage >= 90) return 4.0;
  if (percentage >= 80) return 3.5;
  if (percentage >= 70) return 3.0;
  if (percentage >= 60) return 2.5;
  if (percentage >= 50) return 2.0;
  if (percentage >= 40) return 1.0;
  return 0.0;
};

const calculateResultFromMarks = (marks) => {
  if (!marks || marks.length === 0) {
    throw new Error(
      "No active exam marks found for this student and exam"
    );
  }

  let totalMarks = 0;
  let obtainedMarks = 0;

  for (const mark of marks) {
    let markData = mark.marks_obtained;

    if (typeof markData === "string") {
      try {
        markData = JSON.parse(markData);
      } catch (error) {
        throw new Error(
          `Invalid marks data for mark ID ${mark.mark_id}`
        );
      }
    }

    const maxMarks = Number(markData?.max_marks);
    const obtained = Number(markData?.obtained_marks);
    const graceMarks = Number(mark.grace_marks || 0);

    if (!Number.isFinite(maxMarks) || maxMarks < 0) {
      throw new Error(
        `Invalid maximum marks for mark ID ${mark.mark_id}`
      );
    }

    if (!Number.isFinite(obtained) || obtained < 0) {
      throw new Error(
        `Invalid obtained marks for mark ID ${mark.mark_id}`
      );
    }

    totalMarks += maxMarks;

    if (mark.exam_attendance_status === "Absent") {
      obtainedMarks += 0;
    } else {
      obtainedMarks += obtained + graceMarks;
    }
  }

  if (totalMarks <= 0) {
    throw new Error("Total marks must be greater than zero");
  }

  const percentage =
    (obtainedMarks / totalMarks) * 100;

  const roundedPercentage =
    Number(percentage.toFixed(2));

  const grade = calculateGrade(roundedPercentage);
  const gpa = calculateGPA(roundedPercentage);

  const resultStatus =
    roundedPercentage >= 40 ? "Passed" : "Failed";

  return {
    total_marks: Number(obtainedMarks.toFixed(2)),
    percentage: roundedPercentage,
    grade,
    gpa,
    result_status: resultStatus,
  };
};

const createExamResultService = async (data) => {
  const {
    student_id,
    exam_id,
    attempt_type = "Regular",
    remark,
  } = data;

  if (!student_id) {
    throw new Error("student_id is required");
  }

  if (!exam_id) {
    throw new Error("exam_id is required");
  }

  const validAttemptTypes = [
    "Regular",
    "Supplementary",
    "Improvement",
  ];

  if (!validAttemptTypes.includes(attempt_type)) {
    throw new Error(
      "attempt_type must be Regular, Supplementary or Improvement"
    );
  }

  const student = await repository.getStudentById(
    student_id
  );

  if (!student) {
    throw new Error("Student not found");
  }

  if (
    String(student.status || "").toUpperCase() !==
    "ACTIVE"
  ) {
    throw new Error("Student is inactive");
  }

  const exam = await repository.getExamById(exam_id);

  if (!exam) {
    throw new Error("Exam not found");
  }

  if (
    student.school_id &&
    exam.school_id &&
    Number(student.school_id) !== Number(exam.school_id)
  ) {
    throw new Error(
      "Student does not belong to the selected exam school"
    );
  }

  const existing = await repository.getExistingResult(
    student_id,
    exam_id,
    attempt_type
  );

  if (existing) {
    throw new Error(
      `Result already exists for this student, exam and attempt type (${attempt_type})`
    );
  }

  const marks = await repository.getStudentExamMarks(
    student_id,
    exam_id
  );

  const calculated =
    calculateResultFromMarks(marks);

  const resultId =
    await repository.createExamResult({
      student_id,
      exam_id,
      total_marks: calculated.total_marks,
      percentage: calculated.percentage,
      grade: calculated.grade,
      gpa: calculated.gpa,
      remark: remark || null,
      status: "active",
      created_by: data.created_by || null,
      attempt_type,
    });

  const result =
    await repository.getExamResultById(resultId);

  return {
    ...result,
    result_status: calculated.result_status,
  };
};

const getAllExamResultsService = async () => {
  return repository.getAllExamResults();
};

const getExamResultByIdService = async (resultId) => {
  const result =
    await repository.getExamResultById(resultId);

  if (!result) {
    throw new Error("Exam result not found");
  }

  return result;
};

const getResultsByStudentService = async (studentId) => {
  const student =
    await repository.getStudentById(studentId);

  if (!student) {
    throw new Error("Student not found");
  }

  return repository.getResultsByStudent(studentId);
};

const getResultsByExamService = async (examId) => {
  const exam = await repository.getExamById(examId);

  if (!exam) {
    throw new Error("Exam not found");
  }

  return repository.getResultsByExam(examId);
};

const updateExamResultService = async (
  resultId,
  data
) => {
  const existing =
    await repository.getExamResultById(resultId);

  if (!existing) {
    throw new Error("Exam result not found");
  }

  const attemptType =
    data.attempt_type ||
    existing.attempt_type ||
    "Regular";

  const validAttemptTypes = [
    "Regular",
    "Supplementary",
    "Improvement",
  ];

  if (!validAttemptTypes.includes(attemptType)) {
    throw new Error(
      "attempt_type must be Regular, Supplementary or Improvement"
    );
  }

  const duplicate =
    await repository.getExistingResult(
      existing.student_id,
      existing.exam_id,
      attemptType
    );

  if (
    duplicate &&
    Number(duplicate.result_id) !== Number(resultId)
  ) {
    throw new Error(
      `Another result already exists for attempt type (${attemptType})`
    );
  }

  const marks =
    await repository.getStudentExamMarks(
      existing.student_id,
      existing.exam_id
    );

  const calculated =
    calculateResultFromMarks(marks);

  return repository.updateExamResult(
    resultId,
    {
      total_marks: calculated.total_marks,
      percentage: calculated.percentage,
      grade: calculated.grade,
      gpa: calculated.gpa,
      remark:
        data.remark !== undefined
          ? data.remark
          : existing.remark,
      status:
        data.status || existing.status || "active",
      updated_by: data.updated_by || null,
      attempt_type: attemptType,
    }
  );
};

const deleteExamResultService = async (
  resultId,
  updatedBy
) => {
  const existing =
    await repository.getExamResultById(resultId);

  if (!existing) {
    throw new Error("Exam result not found");
  }

  await repository.deleteExamResult(
    resultId,
    updatedBy
  );

  return true;
};

module.exports = {
  createExamResultService,
  getAllExamResultsService,
  getExamResultByIdService,
  getResultsByStudentService,
  getResultsByExamService,
  updateExamResultService,
  deleteExamResultService,
};