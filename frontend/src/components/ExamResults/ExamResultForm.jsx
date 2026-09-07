import React, {
  useEffect,
  useState,
} from "react";

import { getExams } from "../../services/examService";
import { getStudents } from "../../services/studentService";

const ExamResultForm = ({
  mode = "create",
  initialData = {},
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);

  const [dropdownLoading, setDropdownLoading] =
    useState(false);

  const [formData, setFormData] = useState({
    student_id:
      initialData.student_id || "",
    exam_id:
      initialData.exam_id || "",
    total_marks:
      initialData.total_marks ?? "",
    percentage:
      initialData.percentage ?? "",
    grade:
      initialData.grade || "",
    gpa:
      initialData.gpa ?? "",
    remark:
      initialData.remark || "",
    status:
      initialData.status || "active",
    attempt_type:
      initialData.attempt_type || "Regular",
  });

  const [errors, setErrors] = useState({});

  // =========================================================
  // EDIT DATA
  // =========================================================

  useEffect(() => {
    setFormData({
      student_id:
        initialData.student_id || "",
      exam_id:
        initialData.exam_id || "",
      total_marks:
        initialData.total_marks ?? "",
      percentage:
        initialData.percentage ?? "",
      grade:
        initialData.grade || "",
      gpa:
        initialData.gpa ?? "",
      remark:
        initialData.remark || "",
      status:
        initialData.status || "active",
      attempt_type:
        initialData.attempt_type ||
        "Regular",
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
      ] = await Promise.all([
        getExams(),
        getStudents(),
      ]);

      setExams(
        examResponse?.data || []
      );

      setStudents(
        studentResponse?.data || []
      );
    } catch (error) {
      console.error(
        "Unable to load Exam Result dropdowns:",
        error
      );
    } finally {
      setDropdownLoading(false);
    }
  };

  // =========================================================
  // HANDLE CHANGE
  // =========================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // =========================================================
  // VALIDATION
  // =========================================================

  const validate = () => {
    const validationErrors = {};

    if (!formData.student_id) {
      validationErrors.student_id =
        "Please select Student.";
    }

    if (!formData.exam_id) {
      validationErrors.exam_id =
        "Please select Exam.";
    }

    if (
      formData.total_marks === "" ||
      Number(formData.total_marks) < 0
    ) {
      validationErrors.total_marks =
        "Total Marks is required.";
    }

    if (
      formData.percentage === "" ||
      Number(formData.percentage) < 0 ||
      Number(formData.percentage) > 100
    ) {
      validationErrors.percentage =
        "Percentage must be between 0 and 100.";
    }

    if (
      formData.gpa !== "" &&
      (Number(formData.gpa) < 0 ||
        Number(formData.gpa) > 10)
    ) {
      validationErrors.gpa =
        "GPA must be between 0 and 10.";
    }

    if (!formData.status) {
      validationErrors.status =
        "Please select Status.";
    }

    if (!formData.attempt_type) {
      validationErrors.attempt_type =
        "Please select Attempt Type.";
    }

    setErrors(validationErrors);

    return (
      Object.keys(validationErrors).length === 0
    );
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const payload = {
      student_id: Number(
        formData.student_id
      ),

      exam_id: Number(
        formData.exam_id
      ),

      total_marks: Number(
        formData.total_marks
      ),

      percentage: Number(
        formData.percentage
      ),

      grade:
        formData.grade.trim() ||
        null,

      gpa:
        formData.gpa === ""
          ? 0
          : Number(formData.gpa),

      remark:
        formData.remark.trim() ||
        null,

      status:
        formData.status,

      attempt_type:
        formData.attempt_type,
    };

    await onSubmit(payload);
  };

  // =========================================================
  // HELPERS
  // =========================================================

  const getStudentName = (student) => {
    if (student.student_name) {
      return student.student_name;
    }

    if (student.name) {
      return student.name;
    }

    if (
      student.first_name ||
      student.last_name
    ) {
      return `${student.first_name || ""} ${
        student.last_name || ""
      }`.trim();
    }

    return `Student #${student.id}`;
  };

  const getExamName = (exam) => {
    return (
      exam.exam_name ||
      exam.name ||
      exam.title ||
      `Exam #${exam.id}`
    );
  };

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <div className="
      bg-white
      rounded-xl
      shadow-md
      p-6
      mb-6
    ">
      <div className="mb-6">
        <h2 className="
          text-2xl
          font-bold
          text-slate-800
        ">
          {mode === "edit"
            ? "Edit Exam Result"
            : "Add Exam Result"}
        </h2>

        <p className="
          text-slate-500
          mt-1
        ">
          Enter student examination result
          details.
        </p>
      </div>

      {dropdownLoading ? (
        <div className="
          py-10
          text-center
          text-slate-500
        ">
          Loading students and exams...
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* =================================================
              STUDENT + EXAM
          ================================================= */}

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-5
          ">
            {/* STUDENT */}

            <div>
              <label className="
                block
                text-sm
                font-semibold
                text-slate-700
                mb-2
              ">
                Student
                <span className="text-red-500">
                  {" "}*
                </span>
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
                    {" "}— ID #{student.id}
                  </option>
                ))}
              </select>

              {errors.student_id && (
                <p className="
                  text-red-500
                  text-sm
                  mt-1
                ">
                  {errors.student_id}
                </p>
              )}
            </div>

            {/* EXAM */}

            <div>
              <label className="
                block
                text-sm
                font-semibold
                text-slate-700
                mb-2
              ">
                Exam
                <span className="text-red-500">
                  {" "}*
                </span>
              </label>

              <select
                name="exam_id"
                value={formData.exam_id}
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
                  Select Exam
                </option>

                {exams.map((exam) => (
                  <option
                    key={exam.id}
                    value={exam.id}
                  >
                    {getExamName(exam)}
                    {" "}— ID #{exam.id}
                  </option>
                ))}
              </select>

              {errors.exam_id && (
                <p className="
                  text-red-500
                  text-sm
                  mt-1
                ">
                  {errors.exam_id}
                </p>
              )}
            </div>
          </div>

          {/* =================================================
              MARKS
          ================================================= */}

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-5
          ">
            {/* TOTAL MARKS */}

            <div>
              <label className="
                block
                text-sm
                font-semibold
                text-slate-700
                mb-2
              ">
                Total Marks
                <span className="text-red-500">
                  {" "}*
                </span>
              </label>

              <input
                type="number"
                name="total_marks"
                min="0"
                step="0.01"
                value={formData.total_marks}
                onChange={handleChange}
                placeholder="e.g. 500"
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

              {errors.total_marks && (
                <p className="
                  text-red-500
                  text-sm
                  mt-1
                ">
                  {errors.total_marks}
                </p>
              )}
            </div>

            {/* PERCENTAGE */}

            <div>
              <label className="
                block
                text-sm
                font-semibold
                text-slate-700
                mb-2
              ">
                Percentage
                <span className="text-red-500">
                  {" "}*
                </span>
              </label>

              <input
                type="number"
                name="percentage"
                min="0"
                max="100"
                step="0.01"
                value={formData.percentage}
                onChange={handleChange}
                placeholder="e.g. 85"
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

              {errors.percentage && (
                <p className="
                  text-red-500
                  text-sm
                  mt-1
                ">
                  {errors.percentage}
                </p>
              )}
            </div>
          </div>

          {/* =================================================
              GRADE + GPA
          ================================================= */}

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-5
          ">
            {/* GRADE */}

            <div>
              <label className="
                block
                text-sm
                font-semibold
                text-slate-700
                mb-2
              ">
                Grade
              </label>

              <input
                type="text"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                placeholder="e.g. A+"
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
            </div>

            {/* GPA */}

            <div>
              <label className="
                block
                text-sm
                font-semibold
                text-slate-700
                mb-2
              ">
                GPA
              </label>

              <input
                type="number"
                name="gpa"
                min="0"
                max="10"
                step="0.01"
                value={formData.gpa}
                onChange={handleChange}
                placeholder="e.g. 8.5"
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

              {errors.gpa && (
                <p className="
                  text-red-500
                  text-sm
                  mt-1
                ">
                  {errors.gpa}
                </p>
              )}
            </div>
          </div>

          {/* =================================================
              ATTEMPT + STATUS
          ================================================= */}

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-5
          ">
            {/* ATTEMPT TYPE */}

            <div>
              <label className="
                block
                text-sm
                font-semibold
                text-slate-700
                mb-2
              ">
                Attempt Type
                <span className="text-red-500">
                  {" "}*
                </span>
              </label>

              <select
                name="attempt_type"
                value={formData.attempt_type}
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
                <option value="Regular">
                  Regular
                </option>

                <option value="Supplementary">
                  Supplementary
                </option>

                <option value="Improvement">
                  Improvement
                </option>
              </select>

              {errors.attempt_type && (
                <p className="
                  text-red-500
                  text-sm
                  mt-1
                ">
                  {errors.attempt_type}
                </p>
              )}
            </div>

            {/* STATUS */}

            <div>
              <label className="
                block
                text-sm
                font-semibold
                text-slate-700
                mb-2
              ">
                Status
                <span className="text-red-500">
                  {" "}*
                </span>
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

              {errors.status && (
                <p className="
                  text-red-500
                  text-sm
                  mt-1
                ">
                  {errors.status}
                </p>
              )}
            </div>
          </div>

          {/* =================================================
              REMARK
          ================================================= */}

          <div>
            <label className="
              block
              text-sm
              font-semibold
              text-slate-700
              mb-2
            ">
              Remark
            </label>

            <textarea
              name="remark"
              rows="4"
              value={formData.remark}
              onChange={handleChange}
              placeholder="Enter result remark..."
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

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="
            flex
            justify-end
            gap-3
            pt-4
            border-t
            border-slate-200
          ">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="
                px-6
                py-3
                rounded-lg
                bg-slate-200
                hover:bg-slate-300
                text-slate-700
                font-semibold
                transition
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                px-6
                py-3
                rounded-lg
                bg-blue-600
                hover:bg-blue-700
                text-white
                font-semibold
                transition
                disabled:opacity-50
              "
            >
              {loading
                ? "Saving..."
                : mode === "edit"
                ? "Update Result"
                : "Save Result"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ExamResultForm;