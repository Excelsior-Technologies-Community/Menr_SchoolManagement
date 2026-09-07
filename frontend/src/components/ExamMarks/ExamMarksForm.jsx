import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getExams,
} from "../../services/examService";

import {
  getStudents,
} from "../../services/studentService";

import {
  getExamTimetables,
} from "../../services/examTimetableService";


function ExamMarksForm({
  initialData = {},
  mode = "create",
  loading = false,
  onSubmit,
  onCancel,
}) {

  // =========================================================
  // DROPDOWNS
  // =========================================================

  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [examTimetables, setExamTimetables] =
    useState([]);

  const [dropdownLoading, setDropdownLoading] =
    useState(true);

  // =========================================================
  // FORM DATA
  // =========================================================

  const [formData, setFormData] = useState({
    exam_id:
      initialData.exam_id || "",

    student_id:
      initialData.student_id || "",

    exam_subject_id:
      initialData.exam_subject_id || "",

    max_marks:
      initialData.marks_obtained?.max_marks ??
      "",

    obtained_marks:
      initialData.marks_obtained?.obtained_marks ??
      "",

    grade_id:
      initialData.grade_id ?? "",

    remarks:
      initialData.remarks || "",

    status:
      initialData.status || "active",

    attempt_number:
      initialData.attempt_number || 1,

    is_supplementary:
      Boolean(initialData.is_supplementary),

    grace_marks:
      initialData.grace_marks ?? 0,

    exam_attendance_status:
      initialData.exam_attendance_status ||
      "Present",
  });

  const [errors, setErrors] =
    useState({});

  // =========================================================
  // UPDATE FORM WHEN EDIT DATA CHANGES
  // =========================================================

  useEffect(() => {

    setFormData({
      exam_id:
        initialData.exam_id || "",

      student_id:
        initialData.student_id || "",

      exam_subject_id:
        initialData.exam_subject_id || "",

      max_marks:
        initialData.marks_obtained?.max_marks ??
        "",

      obtained_marks:
        initialData.marks_obtained?.obtained_marks ??
        "",

      grade_id:
        initialData.grade_id ?? "",

      remarks:
        initialData.remarks || "",

      status:
        initialData.status || "active",

      attempt_number:
        initialData.attempt_number || 1,

      is_supplementary:
        Boolean(initialData.is_supplementary),

      grace_marks:
        initialData.grace_marks ?? 0,

      exam_attendance_status:
        initialData.exam_attendance_status ||
        "Present",
    });

  }, [initialData]);

  // =========================================================
  // LOAD DROPDOWNS
  // =========================================================

  useEffect(() => {
    loadDropdowns();
  }, []);

  const loadDropdowns = async () => {

    try {

      setDropdownLoading(true);

      const [
        examResponse,
        studentResponse,
        timetableResponse,
      ] = await Promise.all([
        getExams(),
        getStudents(),
        getExamTimetables(),
      ]);

      setExams(
        examResponse?.data || []
      );

      setStudents(
        studentResponse?.data || []
      );

      setExamTimetables(
        timetableResponse?.data || []
      );

    } catch (error) {

      console.error(
        "Failed to load Exam Marks dropdowns:",
        error
      );

    } finally {

      setDropdownLoading(false);

    }
  };

  // =========================================================
  // SUBJECT OPTIONS
  //
  // Backend uses exam_subject_id against subjects.id.
  // Timetable provides the valid exam + subject combination.
  // =========================================================

  const subjectOptions = useMemo(() => {

    if (!formData.exam_id) {
      return [];
    }

    const selectedExamId =
      Number(formData.exam_id);

    const filtered =
      examTimetables.filter(
        (item) =>
          Number(item.exam_id) ===
          selectedExamId &&
          String(item.status || "active")
            .toLowerCase() === "active"
      );

    const map = new Map();

    filtered.forEach((item) => {

      const subjectId =
        item.subject_id ??
        item.exam_subject_id;

      if (!subjectId) {
        return;
      }

      const subjectName =
        item.subject_name ||
        item.subject?.name ||
        `Subject ${subjectId}`;

      if (!map.has(String(subjectId))) {

        map.set(
          String(subjectId),
          {
            id: subjectId,
            name: subjectName,
          }
        );

      }

    });

    return Array.from(map.values());

  }, [
    formData.exam_id,
    examTimetables,
  ]);

  // =========================================================
  // INPUT HANDLER
  // =========================================================

  const handleChange = (event) => {

    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

  };

  // =========================================================
  // EXAM CHANGE
  // =========================================================

  const handleExamChange = (event) => {

    const value =
      event.target.value;

    setFormData((previous) => ({
      ...previous,

      exam_id: value,

      exam_subject_id: "",
    }));

    setErrors((previous) => ({
      ...previous,

      exam_id: "",
      exam_subject_id: "",
    }));

  };

  // =========================================================
  // VALIDATION
  // =========================================================

  const validate = () => {

    const newErrors = {};

    if (!formData.exam_id) {
      newErrors.exam_id =
        "Exam is required.";
    }

    if (!formData.student_id) {
      newErrors.student_id =
        "Student is required.";
    }

    if (!formData.exam_subject_id) {
      newErrors.exam_subject_id =
        "Subject is required.";
    }

    if (
      formData.max_marks === "" ||
      formData.max_marks === null
    ) {
      newErrors.max_marks =
        "Maximum marks are required.";
    } else if (
      Number(formData.max_marks) <= 0
    ) {
      newErrors.max_marks =
        "Maximum marks must be greater than zero.";
    }

    if (
      formData.obtained_marks === "" ||
      formData.obtained_marks === null
    ) {
      newErrors.obtained_marks =
        "Obtained marks are required.";
    } else if (
      Number(formData.obtained_marks) < 0
    ) {
      newErrors.obtained_marks =
        "Obtained marks cannot be negative.";
    } else if (
      Number(formData.obtained_marks) >
      Number(formData.max_marks)
    ) {
      newErrors.obtained_marks =
        "Obtained marks cannot exceed maximum marks.";
    }

    if (
      formData.grace_marks === "" ||
      Number(formData.grace_marks) < 0
    ) {
      newErrors.grace_marks =
        "Grace marks cannot be negative.";
    }

    if (
      !formData.attempt_number ||
      Number(formData.attempt_number) < 1
    ) {
      newErrors.attempt_number =
        "Attempt number must be at least 1.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );

  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = (event) => {

    event.preventDefault();

    if (!validate()) {
      return;
    }

    const payload = {

      exam_id:
        Number(formData.exam_id),

      student_id:
        Number(formData.student_id),

      exam_subject_id:
        Number(formData.exam_subject_id),

      marks_obtained: {
        max_marks:
          Number(formData.max_marks),

        obtained_marks:
          Number(formData.obtained_marks),
      },

      grade_id:
        formData.grade_id
          ? Number(formData.grade_id)
          : null,

      remarks:
        formData.remarks.trim() ||
        null,

      status:
        formData.status || "active",

      attempt_number:
        Number(formData.attempt_number),

      is_supplementary:
        Boolean(formData.is_supplementary),

      grace_marks:
        Number(formData.grace_marks || 0),

      exam_attendance_status:
        formData.exam_attendance_status,
    };

    onSubmit(payload);

  };

  // =========================================================
  // HELPERS
  // =========================================================

  const getStudentName = (student) => {

    if (student.student_name) {
      return student.student_name;
    }

    const firstName =
      student.first_name || "";

    const lastName =
      student.last_name || "";

    const fullName =
      `${firstName} ${lastName}`.trim();

    return (
      fullName ||
      student.name ||
      `Student ${student.id}`
    );

  };

  const getExamName = (exam) => {

    return (
      exam.name ||
      exam.exam_name ||
      exam.title ||
      `Exam ${exam.id}`
    );

  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="
      bg-white
      rounded-xl
      shadow-md
      p-6
    ">

      {/* HEADER */}

      <div className="mb-6">

        <h2 className="
          text-2xl
          font-bold
          text-slate-800
        ">
          {mode === "create"
            ? "Add Exam Marks"
            : "Update Exam Marks"}
        </h2>

        <p className="
          text-slate-500
          mt-1
        ">
          Enter student marks and examination details.
        </p>

      </div>


      {dropdownLoading ? (

        <div className="
          py-10
          text-center
          text-slate-600
        ">
          Loading examination data...
        </div>

      ) : (

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* ROW 1 */}

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-5
          ">

            {/* EXAM */}

            <div>

              <label className="
                block
                text-sm
                font-medium
                text-slate-700
                mb-2
              ">
                Exam *
              </label>

              <select
                name="exam_id"
                value={formData.exam_id}
                onChange={handleExamChange}
                className="
                  w-full
                  border
                  border-slate-300
                  rounded-lg
                  px-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              >

                <option value="">
                  Select Exam
                </option>

                {exams.map((exam) => (

                  <option
                    key={exam.id}
                    value={exam.id}
                  >
                    {getExamName(exam)}
                  </option>

                ))}

              </select>

              {errors.exam_id && (
                <p className="
                  text-red-600
                  text-sm
                  mt-1
                ">
                  {errors.exam_id}
                </p>
              )}

            </div>


            {/* STUDENT */}

            <div>

              <label className="
                block
                text-sm
                font-medium
                text-slate-700
                mb-2
              ">
                Student *
              </label>

              <select
                name="student_id"
                value={formData.student_id}
                onChange={handleChange}
                className="
                  w-full
                  border
                  border-slate-300
                  rounded-lg
                  px-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              >

                <option value="">
                  Select Student
                </option>

                {students.map((student) => (

                  <option
                    key={student.id}
                    value={student.id}
                  >
                    {getStudentName(student)}
                    {" "}
                    (ID: {student.id})
                  </option>

                ))}

              </select>

              {errors.student_id && (
                <p className="
                  text-red-600
                  text-sm
                  mt-1
                ">
                  {errors.student_id}
                </p>
              )}

            </div>

          </div>


          {/* SUBJECT */}

          <div>

            <label className="
              block
              text-sm
              font-medium
              text-slate-700
              mb-2
            ">
              Exam Subject *
            </label>

            <select
              name="exam_subject_id"
              value={formData.exam_subject_id}
              onChange={handleChange}
              disabled={!formData.exam_id}
              className="
                w-full
                border
                border-slate-300
                rounded-lg
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-blue-500
                disabled:bg-slate-100
              "
            >

              <option value="">
                {!formData.exam_id
                  ? "Select Exam First"
                  : subjectOptions.length === 0
                    ? "No subjects found for this exam"
                    : "Select Subject"}
              </option>

              {subjectOptions.map((subject) => (

                <option
                  key={subject.id}
                  value={subject.id}
                >
                  {subject.name}
                  {" "}
                  (ID: {subject.id})
                </option>

              ))}

            </select>

            {errors.exam_subject_id && (
              <p className="
                text-red-600
                text-sm
                mt-1
              ">
                {errors.exam_subject_id}
              </p>
            )}

            <p className="
              text-xs
              text-slate-500
              mt-2
            ">
              Subjects are loaded from the selected exam timetable.
            </p>

          </div>


          {/* MARKS */}

          <div className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-5
          ">

            {/* MAX MARKS */}

            <div>

              <label className="
                block
                text-sm
                font-medium
                text-slate-700
                mb-2
              ">
                Maximum Marks *
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                name="max_marks"
                value={formData.max_marks}
                onChange={handleChange}
                placeholder="100"
                className="
                  w-full
                  border
                  border-slate-300
                  rounded-lg
                  px-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

              {errors.max_marks && (
                <p className="
                  text-red-600
                  text-sm
                  mt-1
                ">
                  {errors.max_marks}
                </p>
              )}

            </div>


            {/* OBTAINED */}

            <div>

              <label className="
                block
                text-sm
                font-medium
                text-slate-700
                mb-2
              ">
                Obtained Marks *
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                name="obtained_marks"
                value={formData.obtained_marks}
                onChange={handleChange}
                placeholder="85"
                className="
                  w-full
                  border
                  border-slate-300
                  rounded-lg
                  px-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

              {errors.obtained_marks && (
                <p className="
                  text-red-600
                  text-sm
                  mt-1
                ">
                  {errors.obtained_marks}
                </p>
              )}

            </div>


            {/* GRACE */}

            <div>

              <label className="
                block
                text-sm
                font-medium
                text-slate-700
                mb-2
              ">
                Grace Marks
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                name="grace_marks"
                value={formData.grace_marks}
                onChange={handleChange}
                placeholder="0"
                className="
                  w-full
                  border
                  border-slate-300
                  rounded-lg
                  px-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

              {errors.grace_marks && (
                <p className="
                  text-red-600
                  text-sm
                  mt-1
                ">
                  {errors.grace_marks}
                </p>
              )}

            </div>

          </div>


          {/* ATTENDANCE + ATTEMPT */}

          <div className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-5
          ">

            {/* ATTENDANCE */}

            <div>

              <label className="
                block
                text-sm
                font-medium
                text-slate-700
                mb-2
              ">
                Exam Attendance
              </label>

              <select
                name="exam_attendance_status"
                value={
                  formData.exam_attendance_status
                }
                onChange={handleChange}
                className="
                  w-full
                  border
                  border-slate-300
                  rounded-lg
                  px-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              >

                <option value="Present">
                  Present
                </option>

                <option value="Absent">
                  Absent
                </option>

                <option value="Medical Leave">
                  Medical Leave
                </option>

                <option value="Exempt">
                  Exempt
                </option>

              </select>

            </div>


            {/* ATTEMPT */}

            <div>

              <label className="
                block
                text-sm
                font-medium
                text-slate-700
                mb-2
              ">
                Attempt Number
              </label>

              <input
                type="number"
                min="1"
                name="attempt_number"
                value={formData.attempt_number}
                onChange={handleChange}
                className="
                  w-full
                  border
                  border-slate-300
                  rounded-lg
                  px-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

              {errors.attempt_number && (
                <p className="
                  text-red-600
                  text-sm
                  mt-1
                ">
                  {errors.attempt_number}
                </p>
              )}

            </div>


            {/* STATUS */}

            <div>

              <label className="
                block
                text-sm
                font-medium
                text-slate-700
                mb-2
              ">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="
                  w-full
                  border
                  border-slate-300
                  rounded-lg
                  px-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              >

                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>

              </select>

            </div>

          </div>


          {/* SUPPLEMENTARY */}

          <div className="
            flex
            items-center
            gap-3
          ">

            <input
              type="checkbox"
              name="is_supplementary"
              checked={
                formData.is_supplementary
              }
              onChange={handleChange}
              className="
                w-4
                h-4
              "
            />

            <label className="
              text-sm
              font-medium
              text-slate-700
            ">
              Supplementary Examination
            </label>

          </div>


          {/* REMARKS */}

          <div>

            <label className="
              block
              text-sm
              font-medium
              text-slate-700
              mb-2
            ">
              Remarks
            </label>

            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows="4"
              placeholder="Enter remarks..."
              className="
                w-full
                border
                border-slate-300
                rounded-lg
                px-4
                py-3
                outline-none
                resize-none
                focus:ring-2
                focus:ring-blue-500
              "
            />

          </div>


          {/* BUTTONS */}

          <div className="
            flex
            justify-end
            gap-4
            pt-4
          ">

            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="
                px-6
                py-3
                rounded-lg
                border
                border-slate-300
                text-slate-700
                hover:bg-slate-100
                transition
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                loading ||
                dropdownLoading
              }
              className="
                px-8
                py-3
                rounded-lg
                bg-blue-600
                hover:bg-blue-700
                text-white
                rounded-lg
                transition
                disabled:opacity-50
              "
            >

              {loading
                ? "Saving..."
                : mode === "create"
                  ? "Create Exam Mark"
                  : "Update Exam Mark"}

            </button>

          </div>

        </form>

      )}

    </div>
  );
}

export default ExamMarksForm;