import { useEffect, useState } from "react";

function AddClassSubject({
  classes,
  subjects,
  onAdd,
  loading
}) {
  const [formData, setFormData] = useState({
    school_class_id: "",
    subject_id: "",
    status: "active"
  });

  const [error, setError] = useState("");

  /**
   * Handle input/select changes
   */
  const handleChange = (e) => {
    const {
      name,
      value
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setError("");
  };

  /**
   * Submit mapping
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.school_class_id) {
      setError(
        "Please select a class."
      );
      return;
    }

    if (!formData.subject_id) {
      setError(
        "Please select a subject."
      );
      return;
    }

    try {
      await onAdd(formData);

      setFormData({
        school_class_id: "",
        subject_id: "",
        status: "active"
      });
    } catch (error) {
      setError(
        error.message ||
          "Failed to save mapping."
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">
          Add Class Subject
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Assign a subject to a school class.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >

        {/* Class */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Class
            <span className="text-red-500">
              {" "}*
            </span>
          </label>

          <select
            name="school_class_id"
            value={
              formData.school_class_id
            }
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            disabled={loading}
          >
            <option value="">
              Select Class
            </option>

            {classes?.map((item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.class_name}
                {item.section
                  ? ` - ${item.section}`
                  : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Subject
            <span className="text-red-500">
              {" "}*
            </span>
          </label>

          <select
            name="subject_id"
            value={
              formData.subject_id
            }
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            disabled={loading}
          >
            <option value="">
              Select Subject
            </option>

            {subjects?.map((subject) => (
              <option
                key={subject.id}
                value={subject.id}
              >
                {subject.subject_name}
                {subject.subject_code
                  ? ` (${subject.subject_code})`
                  : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Status
          </label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            disabled={loading}
          >
            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>
          </select>
        </div>

        {/* Button */}
        <div className="md:col-span-3 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium px-6 py-3 rounded-xl transition"
          >
            {loading
              ? "Saving..."
              : "Save Mapping"}
          </button>
        </div>

      </form>
    </div>
  );
}

export default AddClassSubject;