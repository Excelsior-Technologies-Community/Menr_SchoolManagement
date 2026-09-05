import {
  useEffect,
  useMemo,
  useState,
} from "react";

import AdminLayout from "../../layouts/AdminLayout";

import ExamEligibilityForm from "../../components/ExamEligibility/ExamEligibilityForm";

import {
  getExamEligibilitySettings,
  createExamEligibilitySetting,
  updateExamEligibilitySetting,
  deleteExamEligibilitySetting,
} from "../../services/examEligibilityService";

function ExamEligibilitySettings() {
  // ==========================================
  // STATES
  // ==========================================

  const [settings, setSettings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [formLoading, setFormLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const [editingData, setEditingData] =
    useState(null);

  // ==========================================
  // FETCH
  // ==========================================

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getExamEligibilitySettings();

      setSettings(
        response?.data || []
      );
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
        "Unable to fetch Exam Eligibility Settings."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FILTER
  // ==========================================

  const filteredSettings = useMemo(() => {
    let data = [...settings];

    if (search.trim()) {
      const keyword =
        search.toLowerCase().trim();

      data = data.filter((item) => {
        return (
          item.exam_name
            ?.toLowerCase()
            .includes(keyword) ||

          item.batch_code
            ?.toLowerCase()
            .includes(keyword)
        );
      });
    }

    if (statusFilter) {
      data = data.filter(
        (item) =>
          item.status === statusFilter
      );
    }

    return data;
  }, [
    settings,
    search,
    statusFilter,
  ]);

  // ==========================================
  // ADD
  // ==========================================

  const handleAdd = () => {
    setEditingData(null);
    setIsFormOpen(true);
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (item) => {
    setEditingData(item);
    setIsFormOpen(true);
  };

  // ==========================================
  // FORM SUBMIT
  // ==========================================

  const handleSubmit = async (data) => {
    try {
      setFormLoading(true);

      if (editingData) {
        await updateExamEligibilitySetting(
          editingData.criteria_id,
          data
        );

        alert(
          "Exam Eligibility Setting Updated Successfully."
        );
      } else {
        await createExamEligibilitySetting(
          data
        );

        alert(
          "Exam Eligibility Setting Created Successfully."
        );
      }

      setIsFormOpen(false);
      setEditingData(null);

      await fetchSettings();
    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
        "Unable to save Exam Eligibility Setting."
      );
    } finally {
      setFormLoading(false);
    }
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this Exam Eligibility Setting?\n\nThis action cannot be undone."
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteExamEligibilitySetting(id);

      alert(
        "Exam Eligibility Setting Deleted Successfully."
      );

      await fetchSettings();
    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
        "Unable to delete Exam Eligibility Setting."
      );
    }
  };

  // ==========================================
  // RESET
  // ==========================================

  const handleReset = () => {
    setSearch("");
    setStatusFilter("");
  };

  // ==========================================
  // CLOSE FORM
  // ==========================================

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingData(null);
  };

  // ==========================================
  // RETURN
  // ==========================================

  return (
    <AdminLayout>
      <div className="bg-slate-100 min-h-screen p-6">

        {/* ====================================
            PAGE HEADER
        ==================================== */}

        <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Exam Eligibility Settings
            </h1>

            <p className="text-slate-500 mt-2">
              Manage eligibility criteria for students appearing
              in examinations.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-6
              py-3
              rounded-lg
              transition
            "
          >
            + Add Eligibility Setting
          </button>

        </div>

        {/* ====================================
            FORM
        ==================================== */}

        {isFormOpen && (
          <div className="mb-6">
            <ExamEligibilityForm
              mode={
                editingData
                  ? "edit"
                  : "create"
              }
              initialData={
                editingData || {}
              }
              loading={formLoading}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        )}

        {/* ====================================
            FILTERS
        ==================================== */}

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Search */}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Search
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search Exam or Batch..."
                className="
                  w-full
                  border
                  border-slate-300
                  rounded-lg
                  px-4
                  py-3
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-blue-500
                  outline-none
                "
              />
            </div>

            {/* Status */}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                className="
                  w-full
                  border
                  border-slate-300
                  rounded-lg
                  px-4
                  py-3
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-blue-500
                  outline-none
                "
              >
                <option value="">
                  All Status
                </option>

                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>
              </select>
            </div>

            {/* Reset */}

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleReset}
                className="
                  w-full
                  bg-slate-600
                  hover:bg-slate-700
                  text-white
                  px-6
                  py-3
                  rounded-lg
                  transition
                "
              >
                Reset Filters
              </button>
            </div>

          </div>
        </div>

        {/* ====================================
            ERROR
        ==================================== */}

        {error && (
          <div className="
            bg-red-100
            border
            border-red-300
            text-red-700
            rounded-xl
            px-5
            py-4
            mb-6
          ">
            {error}
          </div>
        )}

        {/* ====================================
            TABLE
        ==================================== */}

        <div className="bg-white rounded-xl shadow-md overflow-hidden">

          {loading ? (
            <div className="p-10 text-center">
              <p className="text-lg font-semibold text-slate-700">
                Loading Exam Eligibility Settings...
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="min-w-full">

                <thead className="bg-slate-100">

                  <tr>

                    <th className="px-4 py-3 text-left">
                      ID
                    </th>

                    <th className="px-4 py-3 text-left">
                      Exam
                    </th>

                    <th className="px-4 py-3 text-left">
                      Batch
                    </th>

                    <th className="px-4 py-3 text-left">
                      Attendance
                    </th>

                    <th className="px-4 py-3 text-center">
                      Fee Clearance
                    </th>

                    <th className="px-4 py-3 text-center">
                      Homework
                    </th>

                    <th className="px-4 py-3 text-center">
                      Status
                    </th>

                    <th className="px-4 py-3 text-center">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredSettings.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center py-10 text-slate-500"
                      >
                        No Exam Eligibility Settings Found
                      </td>
                    </tr>
                  ) : (
                    filteredSettings.map(
                      (item) => (
                        <tr
                          key={
                            item.criteria_id
                          }
                          className="
                            border-t
                            hover:bg-slate-50
                          "
                        >

                          <td className="px-4 py-4">
                            {item.criteria_id}
                          </td>

                          <td className="px-4 py-4 font-medium text-slate-800">
                            {item.exam_name ||
                              "-"}
                          </td>

                          <td className="px-4 py-4">
                            {item.batch_code ||
                              "All Batches"}
                          </td>

                          <td className="px-4 py-4">
                            {item.minimum_attendance_percentage}
                            %
                          </td>

                          <td className="px-4 py-4 text-center">
                            {Boolean(
                              item.fee_clearance_required
                            ) ? (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                Required
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                                Not Required
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-4 text-center">
                            {Boolean(
                              item.homework_completion_required
                            ) ? (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                Required
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                                Not Required
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-4 text-center">

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                item.status ===
                                "active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {item.status}
                            </span>

                          </td>

                          <td className="px-4 py-4">

                            <div className="flex justify-center gap-2">

                              <button
                                type="button"
                                onClick={() =>
                                  handleEdit(
                                    item
                                  )
                                }
                                className="
                                  bg-blue-500
                                  hover:bg-blue-600
                                  text-white
                                  px-3
                                  py-1
                                  rounded
                                "
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    item.criteria_id
                                  )
                                }
                                className="
                                  bg-red-500
                                  hover:bg-red-600
                                  text-white
                                  px-3
                                  py-1
                                  rounded
                                "
                              >
                                Delete
                              </button>

                            </div>

                          </td>

                        </tr>
                      )
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>
    </AdminLayout>
  );
}

export default ExamEligibilitySettings;