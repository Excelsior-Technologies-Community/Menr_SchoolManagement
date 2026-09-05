import { useEffect, useState } from "react";

import {
  getSchools,
} from "../../services/schoolService";

function ExamHallForm({
  initialData = {},
  mode = "create",
  loading = false,
  onSubmit,
  onCancel,
}) {
  // ==========================================
  // DROPDOWN STATE
  // ==========================================

  const [schools, setSchools] = useState([]);

  const [dropdownLoading, setDropdownLoading] =
    useState(true);

  // ==========================================
  // FORM STATE
  // ==========================================

  const [formData, setFormData] = useState({
    school_id: initialData.school_id || "",
    branch_id: initialData.branch_id || "",
    hall_name: initialData.hall_name || "",
    capacity: initialData.capacity ?? "",
    status: initialData.status || "active",
  });

  // ==========================================
  // ERRORS
  // ==========================================

  const [errors, setErrors] = useState({});

  // ==========================================
  // UPDATE FORM WHEN EDIT DATA CHANGES
  // ==========================================

  useEffect(() => {
    setFormData({
      school_id: initialData.school_id || "",
      branch_id: initialData.branch_id || "",
      hall_name: initialData.hall_name || "",
      capacity: initialData.capacity ?? "",
      status: initialData.status || "active",
    });
  }, [initialData]);

  // ==========================================
  // LOAD SCHOOLS
  // ==========================================

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      setDropdownLoading(true);

      const response = await getSchools();

      setSchools(
        response?.data || []
      );
    } catch (error) {
      console.error(
        "Unable to load schools:",
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

    if (!formData.school_id) {
      validationErrors.school_id =
        "Please select School.";
    }

    if (!formData.hall_name.trim()) {
      validationErrors.hall_name =
        "Hall Name is required.";
    }

    if (
      formData.capacity === "" ||
      formData.capacity === null
    ) {
      validationErrors.capacity =
        "Capacity is required.";
    } else {
      const capacity =
        Number(formData.capacity);

      if (
        Number.isNaN(capacity) ||
        capacity <= 0
      ) {
        validationErrors.capacity =
          "Capacity must be greater than 0.";
      } else if (
        !Number.isInteger(capacity)
      ) {
        validationErrors.capacity =
          "Capacity must be a whole number.";
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
      school_id: Number(
        formData.school_id
      ),

      branch_id:
        formData.branch_id === ""
          ? null
          : Number(formData.branch_id),

      hall_name:
        formData.hall_name.trim(),

      capacity:
        Number(formData.capacity),

      status:
        formData.status,
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
            ? "Add Exam Hall"
            : "Update Exam Hall"}
        </h2>

        <p className="text-slate-500 mt-1">
          Manage examination hall details.
        </p>
      </div>

      {/* LOADING */}

      {dropdownLoading && (
        <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg px-4 py-3">
          Loading school information...
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* SCHOOL */}

        <div>
          <label className={labelClass}>
            School{" "}
            <span className="text-red-500">
              *
            </span>
          </label>

          <select
            name="school_id"
            value={formData.school_id}
            onChange={handleChange}
            className={inputClass}
            disabled={dropdownLoading}
          >
            <option value="">
              Select School
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

          {errors.school_id && (
            <p className={errorClass}>
              {errors.school_id}
            </p>
          )}
        </div>

        {/* BRANCH */}

        <div>
          <label className={labelClass}>
            Branch
          </label>

          <input
            type="number"
            name="branch_id"
            value={formData.branch_id}
            onChange={handleChange}
            placeholder="Enter Branch ID (Optional)"
            className={inputClass}
          />

          <p className="text-xs text-slate-500 mt-1">
            Leave blank if the hall belongs to
            the main school.
          </p>
        </div>

        {/* HALL NAME */}

        <div>
          <label className={labelClass}>
            Hall Name{" "}
            <span className="text-red-500">
              *
            </span>
          </label>

          <input
            type="text"
            name="hall_name"
            value={formData.hall_name}
            onChange={handleChange}
            placeholder="Enter Hall Name"
            className={inputClass}
          />

          {errors.hall_name && (
            <p className={errorClass}>
              {errors.hall_name}
            </p>
          )}
        </div>

        {/* CAPACITY */}

        <div>
          <label className={labelClass}>
            Capacity{" "}
            <span className="text-red-500">
              *
            </span>
          </label>

          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            min="1"
            step="1"
            placeholder="Enter Hall Capacity"
            className={inputClass}
          />

          {errors.capacity && (
            <p className={errorClass}>
              {errors.capacity}
            </p>
          )}
        </div>

        {/* STATUS */}

        <div>
          <label className={labelClass}>
            Status{" "}
            <span className="text-red-500">
              *
            </span>
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

      </div>

      {/* BUTTONS */}

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
              ? "Create Exam Hall"
              : "Update Exam Hall"}
        </button>

      </div>
    </form>
  );
}

export default ExamHallForm;