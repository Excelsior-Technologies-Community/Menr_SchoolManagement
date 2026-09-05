import { useEffect, useState } from "react";

import {
  getExams,
} from "../../services/examService";

import {
  getBatches,
} from "../../services/batchService";

function ExamEligibilityForm({
  initialData = {},
  mode = "create",
  loading = false,
  onSubmit,
  onCancel,
}) {
  // ==========================================
  // DROPDOWN STATES
  // ==========================================

  const [exams, setExams] = useState([]);
  const [batches, setBatches] = useState([]);

  const [dropdownLoading, setDropdownLoading] =
    useState(true);

  // ==========================================
  // FORM STATE
  // ==========================================

  const [formData, setFormData] = useState({
    exam_id: initialData.exam_id || "",
    batch_id: initialData.batch_id || "",
    minimum_attendance_percentage:
      initialData.minimum_attendance_percentage ??
      "",
    fee_clearance_required:
      initialData.fee_clearance_required ?? true,
    homework_completion_required:
      initialData.homework_completion_required ?? false,
    status: initialData.status || "active",
  });

  // ==========================================
  // ERROR STATE
  // ==========================================

  const [errors, setErrors] = useState({});

  // ==========================================
  // UPDATE FORM WHEN EDIT DATA CHANGES
  // ==========================================

  useEffect(() => {
    setFormData({
      exam_id: initialData.exam_id || "",
      batch_id: initialData.batch_id || "",
      minimum_attendance_percentage:
        initialData.minimum_attendance_percentage ??
        "",
      fee_clearance_required:
        initialData.fee_clearance_required ?? true,
      homework_completion_required:
        initialData.homework_completion_required ??
        false,
      status: initialData.status || "active",
    });
  }, [initialData]);

  // ==========================================
  // LOAD DROPDOWNS
  // ==========================================

  useEffect(() => {
    loadDropdowns();
  }, []);

  const loadDropdowns = async () => {
    try {
      setDropdownLoading(true);

      const [
        examResponse,
        batchResponse,
      ] = await Promise.all([
        getExams(),
        getBatches(),
      ]);

      setExams(
        examResponse?.data || []
      );

      setBatches(
        batchResponse?.data || []
      );
    } catch (error) {
      console.error(
        "Unable to load dropdown data:",
        error
      );
    } finally {
      setDropdownLoading(false);
    }
  };

  // ==========================================
  // HANDLE CHANGE
  // ==========================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // ==========================================
  // VALIDATION
  // ==========================================

  const validate = () => {
    const validationErrors = {};

    if (!formData.exam_id) {
      validationErrors.exam_id =
        "Please select Exam.";
    }

    if (
      formData.minimum_attendance_percentage ===
        "" ||
      formData.minimum_attendance_percentage ===
        null
    ) {
      validationErrors.minimum_attendance_percentage =
        "Minimum Attendance Percentage is required.";
    } else {
      const attendance = Number(
        formData.minimum_attendance_percentage
      );

      if (
        Number.isNaN(attendance) ||
        attendance < 0 ||
        attendance > 100
      ) {
        validationErrors.minimum_attendance_percentage =
          "Attendance percentage must be between 0 and 100.";
      }
    }

    if (!formData.status) {
      validationErrors.status =
        "Please select Status.";
    }

    setErrors(validationErrors);

    return (
      Object.keys(validationErrors).length === 0
    );
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const payload = {
      exam_id: Number(formData.exam_id),

      batch_id:
        formData.batch_id === ""
          ? null
          : Number(formData.batch_id),

      minimum_attendance_percentage:
        Number(
          formData.minimum_attendance_percentage
        ),

      fee_clearance_required:
        Boolean(
          formData.fee_clearance_required
        ),

      homework_completion_required:
        Boolean(
          formData.homework_completion_required
        ),

      status: formData.status,
    };

    onSubmit(payload);
  };

  // ==========================================
  // CLASSES
  // ==========================================

  const inputClass =
    "w-full border border-slate-300 rounded-lg px-4 py-3 " +
    "focus:ring-2 focus:ring-blue-500 " +
    "focus:border-blue-500 outline-none transition " +
    "bg-white";

  const labelClass =
    "block mb-2 font-medium text-slate-700";

  const errorClass =
    "text-red-500 text-sm mt-1";

  // ==========================================
  // RETURN
  // ==========================================

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-md p-8"
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">
          {mode === "create"
            ? "Eligibility Criteria"
            : "Update Eligibility Criteria"}
        </h2>

        <p className="text-slate-500 mt-1">
          Configure eligibility requirements for the exam.
        </p>
      </div>

      {dropdownLoading && (
        <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg px-4 py-3">
          Loading exam and batch information...
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ======================================
            EXAM
        ====================================== */}

        <div>
          <label className={labelClass}>
            Exam <span className="text-red-500">*</span>
          </label>

          <select
            name="exam_id"
            value={formData.exam_id}
            onChange={handleChange}
            className={inputClass}
            disabled={dropdownLoading}
          >
            <option value="">
              Select Exam
            </option>

            {exams.map((item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.exam_name}
              </option>
            ))}
          </select>

          {errors.exam_id && (
            <p className={errorClass}>
              {errors.exam_id}
            </p>
          )}
        </div>

        {/* ======================================
            BATCH
        ====================================== */}

        <div>
          <label className={labelClass}>
            Batch
          </label>

          <select
            name="batch_id"
            value={formData.batch_id}
            onChange={handleChange}
            className={inputClass}
            disabled={dropdownLoading}
          >
            <option value="">
              All Batches
            </option>

            {batches.map((item) => (
              <option
                key={item.batch_id}
                value={item.batch_id}
              >
                {item.batch_code}
              </option>
            ))}
          </select>

          <p className="text-xs text-slate-500 mt-1">
            Leave blank to apply this criteria to all batches.
          </p>
        </div>

        {/* ======================================
            MINIMUM ATTENDANCE
        ====================================== */}

        <div>
          <label className={labelClass}>
            Minimum Attendance Percentage
            <span className="text-red-500"> *</span>
          </label>

          <div className="relative">
            <input
              type="number"
              name="minimum_attendance_percentage"
              value={
                formData.minimum_attendance_percentage
              }
              onChange={handleChange}
              min="0"
              max="100"
              step="0.01"
              placeholder="Enter percentage"
              className={`${inputClass} pr-12`}
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
              %
            </span>
          </div>

          {errors.minimum_attendance_percentage && (
            <p className={errorClass}>
              {
                errors.minimum_attendance_percentage
              }
            </p>
          )}
        </div>

        {/* ======================================
            STATUS
        ====================================== */}

        <div>
          <label className={labelClass}>
            Status
            <span className="text-red-500"> *</span>
          </label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>
          </select>

          {errors.status && (
            <p className={errorClass}>
              {errors.status}
            </p>
          )}
        </div>

        {/* ======================================
            FEE CLEARANCE
        ====================================== */}

        <div className="md:col-span-2">
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50">

            <label className="flex items-center gap-3 cursor-pointer">

              <input
                type="checkbox"
                name="fee_clearance_required"
                checked={
                  Boolean(
                    formData.fee_clearance_required
                  )
                }
                onChange={handleChange}
                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />

              <div>
                <p className="font-medium text-slate-800">
                  Fee Clearance Required
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  Student must have cleared the required fees
                  before appearing in the exam.
                </p>
              </div>

            </label>

          </div>
        </div>

        {/* ======================================
            HOMEWORK COMPLETION
        ====================================== */}

        <div className="md:col-span-2">
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50">

            <label className="flex items-center gap-3 cursor-pointer">

              <input
                type="checkbox"
                name="homework_completion_required"
                checked={
                  Boolean(
                    formData.homework_completion_required
                  )
                }
                onChange={handleChange}
                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />

              <div>
                <p className="font-medium text-slate-800">
                  Homework Completion Required
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  Student must satisfy the homework completion
                  requirement before appearing in the exam.
                </p>
              </div>

            </label>

          </div>
        </div>

      </div>

      {/* ========================================
          BUTTONS
      ======================================== */}

      <div className="flex justify-end gap-4 mt-8">

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
            transition
            disabled:opacity-50
          "
        >
          {loading
            ? "Saving..."
            : mode === "create"
              ? "Create Eligibility Setting"
              : "Update Eligibility Setting"}
        </button>

      </div>
    </form>
  );
}

export default ExamEligibilityForm;