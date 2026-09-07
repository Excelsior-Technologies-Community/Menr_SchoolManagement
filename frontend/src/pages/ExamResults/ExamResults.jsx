import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import AdminLayout from "../../layouts/AdminLayout";

import ExamResultForm from "../../components/ExamResults/ExamResultForm";

import DeleteExamResultModal from "../../components/ExamResults/DeleteExamResultModal";

import {
  getExamResults,
  createExamResult,
  updateExamResult,
  deleteExamResult,
} from "../../services/examResultService";

const ExamResults = () => {
  const [results, setResults] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [formLoading, setFormLoading] =
    useState(false);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [attemptType, setAttemptType] =
    useState("");

  const [formOpen, setFormOpen] =
    useState(false);

  const [editingResult, setEditingResult] =
    useState(null);

  const [
    selectedResultId,
    setSelectedResultId,
  ] = useState(null);

  const [
    deleteModalOpen,
    setDeleteModalOpen,
  ] = useState(false);

  // =========================================================
  // FETCH RESULTS
  // =========================================================

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getExamResults();

      setResults(
        response?.data || []
      );
    } catch (err) {
      console.error(
        "Unable to fetch Exam Results:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Unable to fetch Exam Results."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  // =========================================================
  // FILTER
  // =========================================================

  const filteredResults =
    useMemo(() => {
      let data = [...results];

      if (search.trim()) {
        const keyword =
          search.toLowerCase().trim();

        data = data.filter((item) => {
          return (
            String(
              item.result_id || ""
            ).includes(keyword) ||

            String(
              item.student_id || ""
            ).includes(keyword) ||

            item.student_name
              ?.toLowerCase()
              .includes(keyword) ||

            item.exam_name
              ?.toLowerCase()
              .includes(keyword) ||

            item.grade
              ?.toLowerCase()
              .includes(keyword)
          );
        });
      }

      if (status) {
        data = data.filter(
          (item) =>
            item.status === status
        );
      }

      if (attemptType) {
        data = data.filter(
          (item) =>
            item.attempt_type ===
            attemptType
        );
      }

      return data;
    }, [
      results,
      search,
      status,
      attemptType,
    ]);

  // =========================================================
  // ADD
  // =========================================================

  const handleAdd = () => {
    setEditingResult(null);
    setFormOpen(true);
    setError("");
  };

  // =========================================================
  // EDIT
  // =========================================================

  const handleEdit = (item) => {
    setEditingResult(item);
    setFormOpen(true);
    setError("");
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (data) => {
    try {
      setFormLoading(true);
      setError("");

      if (editingResult) {
        await updateExamResult(
          editingResult.result_id,
          data
        );

        alert(
          "Exam Result Updated Successfully."
        );
      } else {
        await createExamResult(data);

        alert(
          "Exam Result Created Successfully."
        );
      }

      setFormOpen(false);
      setEditingResult(null);

      await fetchResults();
    } catch (err) {
      console.error(
        "Unable to save Exam Result:",
        err
      );

      const message =
        err?.response?.data?.message ||
        "Unable to save Exam Result.";

      setError(message);
      alert(message);
    } finally {
      setFormLoading(false);
    }
  };

  // =========================================================
  // DELETE CLICK
  // =========================================================

  const handleDeleteClick = (id) => {
    setSelectedResultId(id);
    setDeleteModalOpen(true);
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async () => {
    if (!selectedResultId) {
      return;
    }

    try {
      setDeleteLoading(true);
      setError("");

      await deleteExamResult(
        selectedResultId
      );

      alert(
        "Exam Result Deleted Successfully."
      );

      setDeleteModalOpen(false);
      setSelectedResultId(null);

      await fetchResults();
    } catch (err) {
      console.error(
        "Unable to delete Exam Result:",
        err
      );

      const message =
        err?.response?.data?.message ||
        "Unable to delete Exam Result.";

      setError(message);
      alert(message);
    } finally {
      setDeleteLoading(false);
    }
  };

  // =========================================================
  // CLOSE DELETE MODAL
  // =========================================================

  const closeDeleteModal = () => {
    if (deleteLoading) {
      return;
    }

    setDeleteModalOpen(false);
    setSelectedResultId(null);
  };

  // =========================================================
  // CANCEL FORM
  // =========================================================

  const handleCancel = () => {
    if (formLoading) {
      return;
    }

    setFormOpen(false);
    setEditingResult(null);
  };

  // =========================================================
  // RESET FILTERS
  // =========================================================

  const handleReset = () => {
    setSearch("");
    setStatus("");
    setAttemptType("");
  };

  // =========================================================
  // DISPLAY HELPERS
  // =========================================================

  const getStudentDisplay = (item) => {
    if (item.student_name) {
      return item.student_name;
    }

    return `Student #${
      item.student_id || "-"
    }`;
  };

  const getExamDisplay = (item) => {
    return (
      item.exam_name ||
      `Exam #${item.exam_id || "-"}`
    );
  };

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <AdminLayout>
      <div className="
        bg-slate-100
        min-h-screen
        p-6
      ">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="
          bg-white
          rounded-xl
          shadow-md
          p-6
          mb-6
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-4
        ">
          <div>
            <h1 className="
              text-3xl
              font-bold
              text-slate-800
            ">
              Exam Results
            </h1>

            <p className="
              text-slate-500
              mt-2
            ">
              Manage student examination
              results.
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
              font-semibold
              transition
            "
          >
            + Add Result
          </button>
        </div>

        {/* =================================================
            FORM
        ================================================= */}

        {formOpen && (
          <ExamResultForm
            mode={
              editingResult
                ? "edit"
                : "create"
            }
            initialData={
              editingResult || {}
            }
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={formLoading}
          />
        )}

        {/* =================================================
            FILTERS
        ================================================= */}

        <div className="
          bg-white
          rounded-xl
          shadow-md
          p-6
          mb-6
        ">
          <div className="
            grid
            grid-cols-1
            md:grid-cols-4
            gap-4
          ">
            {/* SEARCH */}

            <div>
              <label className="
                block
                text-sm
                font-semibold
                text-slate-700
                mb-2
              ">
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
                placeholder="
                  Search student, exam,
                  grade or result ID...
                "
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
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
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
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
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
              </label>

              <select
                value={attemptType}
                onChange={(e) =>
                  setAttemptType(
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
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              >
                <option value="">
                  All Attempts
                </option>

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
            </div>

            {/* RESET */}

            <div className="
              flex
              items-end
            ">
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
                  font-semibold
                  transition
                "
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

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

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="
          bg-white
          rounded-xl
          shadow-md
          overflow-hidden
        ">
          {loading ? (
            <div className="
              p-10
              text-center
            ">
              <p className="
                text-lg
                font-semibold
                text-slate-700
              ">
                Loading Exam Results...
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="
                min-w-full
              ">
                <thead className="
                  bg-slate-100
                ">
                  <tr>
                    <th className="
                      px-4
                      py-3
                      text-left
                      text-sm
                      font-semibold
                      text-slate-700
                    ">
                      ID
                    </th>

                    <th className="
                      px-4
                      py-3
                      text-left
                      text-sm
                      font-semibold
                      text-slate-700
                    ">
                      Student
                    </th>

                    <th className="
                      px-4
                      py-3
                      text-left
                      text-sm
                      font-semibold
                      text-slate-700
                    ">
                      Exam
                    </th>

                    <th className="
                      px-4
                      py-3
                      text-center
                      text-sm
                      font-semibold
                      text-slate-700
                    ">
                      Total Marks
                    </th>

                    <th className="
                      px-4
                      py-3
                      text-center
                      text-sm
                      font-semibold
                      text-slate-700
                    ">
                      Percentage
                    </th>

                    <th className="
                      px-4
                      py-3
                      text-center
                      text-sm
                      font-semibold
                      text-slate-700
                    ">
                      Grade
                    </th>

                    <th className="
                      px-4
                      py-3
                      text-center
                      text-sm
                      font-semibold
                      text-slate-700
                    ">
                      GPA
                    </th>

                    <th className="
                      px-4
                      py-3
                      text-center
                      text-sm
                      font-semibold
                      text-slate-700
                    ">
                      Attempt
                    </th>

                    <th className="
                      px-4
                      py-3
                      text-center
                      text-sm
                      font-semibold
                      text-slate-700
                    ">
                      Status
                    </th>

                    <th className="
                      px-4
                      py-3
                      text-center
                      text-sm
                      font-semibold
                      text-slate-700
                    ">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredResults.length ===
                  0 ? (
                    <tr>
                      <td
                        colSpan="10"
                        className="
                          text-center
                          py-10
                          text-slate-500
                        "
                      >
                        No Exam Results Found
                      </td>
                    </tr>
                  ) : (
                    filteredResults.map(
                      (item) => (
                        <tr
                          key={
                            item.result_id
                          }
                          className="
                            border-t
                            hover:bg-slate-50
                          "
                        >
                          {/* ID */}

                          <td className="
                            px-4
                            py-4
                            font-medium
                          ">
                            {
                              item.result_id
                            }
                          </td>

                          {/* STUDENT */}

                          <td className="
                            px-4
                            py-4
                          ">
                            <div className="
                              font-medium
                              text-slate-800
                            ">
                              {
                                getStudentDisplay(
                                  item
                                )
                              }
                            </div>

                            <div className="
                              text-xs
                              text-slate-500
                              mt-1
                            ">
                              ID #
                              {
                                item.student_id ||
                                "-"
                              }
                            </div>
                          </td>

                          {/* EXAM */}

                          <td className="
                            px-4
                            py-4
                          ">
                            <div className="
                              font-medium
                              text-slate-800
                            ">
                              {
                                getExamDisplay(
                                  item
                                )
                              }
                            </div>
                          </td>

                          {/* TOTAL */}

                          <td className="
                            px-4
                            py-4
                            text-center
                            font-semibold
                          ">
                            {
                              item.total_marks ??
                              "-"
                            }
                          </td>

                          {/* PERCENTAGE */}

                          <td className="
                            px-4
                            py-4
                            text-center
                            font-semibold
                          ">
                            {item.percentage !==
                            null &&
                            item.percentage !==
                            undefined
                              ? `${item.percentage}%`
                              : "-"}
                          </td>

                          {/* GRADE */}

                          <td className="
                            px-4
                            py-4
                            text-center
                          ">
                            <span className="
                              inline-flex
                              items-center
                              justify-center
                              min-w-10
                              px-3
                              py-1
                              rounded-full
                              bg-blue-100
                              text-blue-700
                              font-bold
                              text-sm
                            ">
                              {
                                item.grade ||
                                "-"
                              }
                            </span>
                          </td>

                          {/* GPA */}

                          <td className="
                            px-4
                            py-4
                            text-center
                            font-semibold
                          ">
                            {
                              item.gpa ??
                              "-"
                            }
                          </td>

                          {/* ATTEMPT */}

                          <td className="
                            px-4
                            py-4
                            text-center
                          ">
                            <span className="
                              inline-flex
                              px-3
                              py-1
                              rounded-full
                              bg-purple-100
                              text-purple-700
                              text-xs
                              font-semibold
                            ">
                              {
                                item.attempt_type ||
                                "Regular"
                              }
                            </span>
                          </td>

                          {/* STATUS */}

                          <td className="
                            px-4
                            py-4
                            text-center
                          ">
                            <span
                              className={`
                                inline-flex
                                px-3
                                py-1
                                rounded-full
                                text-xs
                                font-semibold
                                ${
                                  item.status ===
                                  "active"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }
                              `}
                            >
                              {
                                item.status ||
                                "-"
                              }
                            </span>
                          </td>

                          {/* ACTIONS */}

                          <td className="
                            px-4
                            py-4
                          ">
                            <div className="
                              flex
                              justify-center
                              gap-2
                            ">
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
                                  py-1.5
                                  rounded
                                  text-sm
                                  font-medium
                                "
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteClick(
                                    item.result_id
                                  )
                                }
                                className="
                                  bg-red-500
                                  hover:bg-red-600
                                  text-white
                                  px-3
                                  py-1.5
                                  rounded
                                  text-sm
                                  font-medium
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

        {/* =================================================
            DELETE MODAL
        ================================================= */}

        <DeleteExamResultModal
          open={deleteModalOpen}
          loading={deleteLoading}
          onConfirm={handleDelete}
          onCancel={closeDeleteModal}
        />
      </div>
    </AdminLayout>
  );
};

export default ExamResults;