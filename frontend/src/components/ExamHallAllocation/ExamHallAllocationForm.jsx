import { useEffect, useState } from "react";

import {
  getExams,
} from "../../services/examService";

import {
  getExamTimetables,
} from "../../services/examTimetableService";

import {
  getBatches,
} from "../../services/batchService";

import {
  getSchools,
} from "../../services/schoolService";

import {
  getExamHalls,
} from "../../services/examHallService";

function ExamHallAllocationForm({
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
  const [examTimetables, setExamTimetables] =
    useState([]);
  const [batches, setBatches] = useState([]);
  const [schools, setSchools] = useState([]);
  const [examHalls, setExamHalls] = useState([]);

  const [dropdownLoading, setDropdownLoading] =
    useState(true);

  // ==========================================
  // FORM STATE
  // ==========================================

  const [formData, setFormData] = useState({
    exam_id: initialData.exam_id || "",
    exam_timetable_id:
      initialData.exam_timetable_id || "",
    student_id:
      initialData.student_id || "",
    batch_id:
      initialData.batch_id || "",
    hall_id:
      initialData.hall_id || "",
    seat_number:
      initialData.seat_number || "",
    exam_date:
      initialData.exam_date || "",
    allocation_status:
      initialData.allocation_status ||
      "active",
    remarks:
      initialData.remarks || "",
  });

  // ==========================================
  // ERRORS
  // ==========================================

  const [errors, setErrors] = useState({});

  // ==========================================
  // EDIT DATA
  // ==========================================

  useEffect(() => {
    setFormData({
      exam_id: initialData.exam_id || "",
      exam_timetable_id:
        initialData.exam_timetable_id || "",
      student_id:
        initialData.student_id || "",
      batch_id:
        initialData.batch_id || "",
      hall_id:
        initialData.hall_id || "",
      seat_number:
        initialData.seat_number || "",
      exam_date:
        initialData.exam_date || "",
      allocation_status:
        initialData.allocation_status ||
        "active",
      remarks:
        initialData.remarks || "",
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
        timetableResponse,
        batchResponse,
        schoolResponse,
        hallResponse,
      ] = await Promise.all([
        getExams(),
        getExamTimetables(),
        getBatches(),
        getSchools(),
        getExamHalls(),
      ]);

      setExams(
        examResponse?.data || []
      );

      setExamTimetables(
        timetableResponse?.data || []
      );

      setBatches(
        batchResponse?.data || []
      );

      setSchools(
        schoolResponse?.data || []
      );

      setExamHalls(
        hallResponse?.data || []
      );
    } catch (error) {
      console.error(
        "Unable to load allocation dropdowns:",
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

  // ==========================================
  // VALIDATION
  // ==========================================

  const validate = () => {
    const validationErrors = {};

    if (!formData.exam_id) {
      validationErrors.exam_id =
        "Please select Exam.";
    }

    if (!formData.student_id) {
      validationErrors.student_id =
        "Student ID is required.";
    }

    if (!formData.batch_id) {
      validationErrors.batch_id =
        "Please select Batch.";
    }

    if (!formData.hall_id) {
      validationErrors.hall_id =
        "Please select Hall.";
    }

    if (!formData.seat_number.trim()) {
      validationErrors.seat_number =
        "Seat Number is required.";
    }

    if (!formData.exam_date) {
      validationErrors.exam_date =
        "Exam Date is required.";
    }

    if (!formData.allocation_status) {
      validationErrors.allocation_status =
        "Please select Allocation Status.";
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
      exam_id: Number(
        formData.exam_id
      ),

      exam_timetable_id:
        formData.exam_timetable_id === ""
          ? null
          : Number(
              formData.exam_timetable_id
            ),

      student_id: Number(
        formData.student_id
      ),

      batch_id: Number(
        formData.batch_id
      ),

      hall_id: Number(
        formData.hall_id
      ),

      seat_number:
        formData.seat_number.trim(),

      exam_date:
        formData.exam_date,

      allocation_status:
        formData.allocation_status,

      remarks:
        formData.remarks.trim() || null,
    };

    onSubmit(payload);
  };

  // ==========================================
  // CLASSES
  // ==========================================

  const inputClass =
    "w-full border border-slate-300 rounded-lg px-4 py-3 " +
    "focus:ring-2 focus:ring-blue-500 " +
    "focus:border-blue-500 outline-none transition bg-white";

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
      {/* HEADER */}

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">
          {mode === "create"
            ? "Create Exam Hall Allocation"
            : "Update Exam Hall Allocation"}
        </h2>

        <p className="text-slate-500 mt-1">
          Assign a student to an examination hall
          and seat.
        </p>
      </div>

      {dropdownLoading && (
        <div className="
          mb-6
          bg-blue-50
          border
          border-blue-200
          text-blue-700
          rounded-lg
          px-4
          py-3
        ">
          Loading exam, timetable, batch and hall
          information...
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ======================================
            EXAM
        ====================================== */}

        <div>
          <label className={labelClass}>
            Exam{" "}
            <span className="text-red-500">
              *
            </span>
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
            EXAM TIMETABLE
        ====================================== */}

        <div>
          <label className={labelClass}>
            Exam Timetable
          </label>

          <select
            name="exam_timetable_id"
            value={
              formData.exam_timetable_id
            }
            onChange={handleChange}
            className={inputClass}
            disabled={dropdownLoading}
          >
            <option value="">
              Select Exam Timetable
            </option>

            {examTimetables.map((item) => (
              <option
                key={
                  item.exam_timetable_id
                }
                value={
                  item.exam_timetable_id
                }
              >
                {item.exam_name
                  ? `${item.exam_name} - ${
                      item.subject_name || ""
                    } - ${
                      item.exam_date || ""
                    }`
                  : `Timetable #${item.exam_timetable_id}`}
              </option>
            ))}
          </select>

          <p className="text-xs text-slate-500 mt-1">
            Optional. Leave blank if allocation
            is not tied to a specific timetable.
          </p>
        </div>

        {/* ======================================
            STUDENT ID
        ====================================== */}

        <div>
          <label className={labelClass}>
            Student ID{" "}
            <span className="text-red-500">
              *
            </span>
          </label>

          <input
            type="number"
            name="student_id"
            value={formData.student_id}
            onChange={handleChange}
            min="1"
            placeholder="Enter Student ID"
            className={inputClass}
          />

          <p className="text-xs text-slate-500 mt-1">
            Enter the student ID from the student
            master record.
          </p>

          {errors.student_id && (
            <p className={errorClass}>
              {errors.student_id}
            </p>
          )}
        </div>

        {/* ======================================
            BATCH
        ====================================== */}

        <div>
          <label className={labelClass}>
            Batch{" "}
            <span className="text-red-500">
              *
            </span>
          </label>

          <select
            name="batch_id"
            value={formData.batch_id}
            onChange={handleChange}
            className={inputClass}
            disabled={dropdownLoading}
          >
            <option value="">
              Select Batch
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

          {errors.batch_id && (
            <p className={errorClass}>
              {errors.batch_id}
            </p>
          )}
        </div>

        {/* ======================================
            HALL
        ====================================== */}

        <div>
          <label className={labelClass}>
            Exam Hall{" "}
            <span className="text-red-500">
              *
            </span>
          </label>

          <select
            name="hall_id"
            value={formData.hall_id}
            onChange={handleChange}
            className={inputClass}
            disabled={dropdownLoading}
          >
            <option value="">
              Select Exam Hall
            </option>

            {examHalls.map((item) => (
              <option
                key={item.hall_id}
                value={item.hall_id}
              >
                {item.hall_name}
                {item.capacity
                  ? ` - Capacity ${item.capacity}`
                  : ""}
              </option>
            ))}
          </select>

          {errors.hall_id && (
            <p className={errorClass}>
              {errors.hall_id}
            </p>
          )}
        </div>

        {/* ======================================
            SEAT NUMBER
        ====================================== */}

        <div>
          <label className={labelClass}>
            Seat Number{" "}
            <span className="text-red-500">
              *
            </span>
          </label>

          <input
            type="text"
            name="seat_number"
            value={formData.seat_number}
            onChange={handleChange}
            placeholder="Example: A-01"
            className={inputClass}
          />

          {errors.seat_number && (
            <p className={errorClass}>
              {errors.seat_number}
            </p>
          )}
        </div>

        {/* ======================================
            EXAM DATE
        ====================================== */}

        <div>
          <label className={labelClass}>
            Exam Date{" "}
            <span className="text-red-500">
              *
            </span>
          </label>

          <input
            type="date"
            name="exam_date"
            value={formData.exam_date}
            onChange={handleChange}
            className={inputClass}
          />

          {errors.exam_date && (
            <p className={errorClass}>
              {errors.exam_date}
            </p>
          )}
        </div>

        {/* ======================================
            STATUS
        ====================================== */}

        <div>
          <label className={labelClass}>
            Allocation Status{" "}
            <span className="text-red-500">
              *
            </span>
          </label>

          <select
            name="allocation_status"
            value={
              formData.allocation_status
            }
            onChange={handleChange}
            className={inputClass}
          >
            <option value="active">
              Active
            </option>

            <option value="cancelled">
              Cancelled
            </option>
          </select>

          {errors.allocation_status && (
            <p className={errorClass}>
              {errors.allocation_status}
            </p>
          )}
        </div>

        {/* ======================================
            SCHOOL INFORMATION
        ====================================== */}

        {schools.length > 0 && (
          <div>
            <label className={labelClass}>
              School
            </label>

            <select
              disabled
              className={`${inputClass} bg-slate-100`}
            >
              <option>
                School information
                available from system
              </option>

              {schools.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.school_name}
                </option>
              ))}
            </select>

            <p className="text-xs text-slate-500 mt-1">
              School is used for reference while
              selecting the allocation hall.
            </p>
          </div>
        )}

        {/* ======================================
            REMARKS
        ====================================== */}

        <div className="md:col-span-2">

          <label className={labelClass}>
            Remarks
          </label>

          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            rows="4"
            placeholder="Enter remarks (optional)"
            className={inputClass}
          />

        </div>

      </div>

      {/* ========================================
          BUTTONS
      ======================================== */}

      <div className="
        flex
        justify-end
        gap-4
        mt-8
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
            transition
            disabled:opacity-50
          "
        >
          {loading
            ? "Saving..."
            : mode === "create"
              ? "Create Allocation"
              : "Update Allocation"}
        </button>

      </div>
    </form>
  );
}

export default ExamHallAllocationForm;