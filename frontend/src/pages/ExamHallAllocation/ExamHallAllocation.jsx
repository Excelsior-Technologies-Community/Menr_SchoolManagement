import {
  useEffect,
  useMemo,
  useState,
} from "react";

import AdminLayout from "../../layouts/AdminLayout";

import ExamHallAllocationForm from "../../components/ExamHallAllocation/ExamHallAllocationForm";

import DeleteExamHallAllocationModal from "../../components/ExamHallAllocation/DeleteExamHallAllocationModal";

import {
  getExamHallAllocations,
  createExamHallAllocation,
  updateExamHallAllocation,
  deleteExamHallAllocation,
} from "../../services/examHallAllocationService";

function ExamHallAllocation() {
  // ==========================================
  // STATES
  // ==========================================

  const [allocations, setAllocations] =
    useState([]);

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

  const [formOpen, setFormOpen] =
    useState(false);

  const [editingAllocation, setEditingAllocation] =
    useState(null);

  const [
    selectedAllocationId,
    setSelectedAllocationId,
  ] = useState(null);

  const [
    deleteModalOpen,
    setDeleteModalOpen,
  ] = useState(false);

  // ==========================================
  // FETCH
  // ==========================================

  useEffect(() => {
    fetchAllocations();
  }, []);

  const fetchAllocations = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getExamHallAllocations();

      setAllocations(
        response?.data || []
      );
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
        "Unable to fetch Exam Hall Allocations."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FILTER
  // ==========================================

  const filteredAllocations =
    useMemo(() => {
      let data = [...allocations];

      if (search.trim()) {
        const keyword =
          search.toLowerCase().trim();

        data = data.filter((item) => {
          return (
            item.exam_name
              ?.toLowerCase()
              .includes(keyword) ||

            item.subject_name
              ?.toLowerCase()
              .includes(keyword) ||

            item.batch_code
              ?.toLowerCase()
              .includes(keyword) ||

            item.hall_name
              ?.toLowerCase()
              .includes(keyword) ||

            String(
              item.student_id || ""
            ).includes(keyword) ||

            item.seat_number
              ?.toLowerCase()
              .includes(keyword) ||

            item.student_name
              ?.toLowerCase()
              .includes(keyword)
          );
        });
      }

      if (status) {
        data = data.filter(
          (item) =>
            item.allocation_status ===
            status
        );
      }

      return data;
    }, [
      allocations,
      search,
      status,
    ]);

  // ==========================================
  // ADD
  // ==========================================

  const handleAdd = () => {
    setEditingAllocation(null);
    setFormOpen(true);
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (item) => {
    setEditingAllocation(item);
    setFormOpen(true);
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (data) => {
    try {
      setFormLoading(true);

      if (editingAllocation) {
        await updateExamHallAllocation(
          editingAllocation.allocation_id,
          data
        );

        alert(
          "Exam Hall Allocation Updated Successfully."
        );
      } else {
        await createExamHallAllocation(
          data
        );

        alert(
          "Exam Hall Allocation Created Successfully."
        );
      }

      setFormOpen(false);
      setEditingAllocation(null);

      await fetchAllocations();
    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
        "Unable to save Exam Hall Allocation."
      );
    } finally {
      setFormLoading(false);
    }
  };

  // ==========================================
  // DELETE CLICK
  // ==========================================

  const handleDeleteClick = (id) => {
    setSelectedAllocationId(id);
    setDeleteModalOpen(true);
  };

  // ==========================================
  // CLOSE DELETE MODAL
  // ==========================================

  const closeDeleteModal = () => {
    if (deleteLoading) {
      return;
    }

    setDeleteModalOpen(false);
    setSelectedAllocationId(null);
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async () => {
    if (!selectedAllocationId) {
      return;
    }

    try {
      setDeleteLoading(true);

      await deleteExamHallAllocation(
        selectedAllocationId
      );

      alert(
        "Exam Hall Allocation Deleted Successfully."
      );

      setDeleteModalOpen(false);
      setSelectedAllocationId(null);

      await fetchAllocations();
    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
        "Unable to delete Exam Hall Allocation."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // ==========================================
  // CANCEL FORM
  // ==========================================

  const handleCancel = () => {
    if (formLoading) {
      return;
    }

    setFormOpen(false);
    setEditingAllocation(null);
  };

  // ==========================================
  // RESET
  // ==========================================

  const handleReset = () => {
    setSearch("");
    setStatus("");
  };

  // ==========================================
  // RETURN
  // ==========================================

  return (
    <AdminLayout>
      <div className="
        bg-slate-100
        min-h-screen
        p-6
      ">

        {/* ====================================
            HEADER
        ==================================== */}

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
              Exam Hall Allocation
            </h1>

            <p className="
              text-slate-500
              mt-2
            ">
              Manage student exam hall and
              seat allocations.
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
            + Add Allocation
          </button>

        </div>

        {/* ====================================
            FORM
        ==================================== */}

        {formOpen && (
          <div className="mb-6">
            <ExamHallAllocationForm
              mode={
                editingAllocation
                  ? "edit"
                  : "create"
              }
              initialData={
                editingAllocation || {}
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
            md:grid-cols-3
            gap-4
          ">

            {/* SEARCH */}

            <div>
              <label className="
                block
                text-sm
                font-medium
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
                  Search Exam, Student, Hall, Seat...
                "
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

            {/* STATUS */}

            <div>
              <label className="
                block
                text-sm
                font-medium
                text-slate-700
                mb-2
              ">
                Allocation Status
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

                <option value="cancelled">
                  Cancelled
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
                Loading Exam Hall Allocations...
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="min-w-full">

                <thead className="bg-slate-100">

                  <tr>

                    <th className="
                      px-4
                      py-3
                      text-left
                    ">
                      ID
                    </th>

                    <th className="
                      px-4
                      py-3
                      text-left
                    ">
                      Exam
                    </th>

                    <th className="
                      px-4
                      py-3
                      text-left
                    ">
                      Subject
                    </th>

                    <th className="
                      px-4
                      py-3
                      text-left
                    ">
                      Student
                    </th>

                    <th className="
                      px-4
                      py-3
                      text-left
                    ">
                      Batch
                    </th>

                    <th className="
                      px-4
                      py-3
                      text-left
                    ">
                      Hall
                    </th>

                    <th className="
                      px-4
                      py-3
                      text-center
                    ">
                      Seat
                    </th>

                    <th className="
                      px-4
                      py-3
                      text-left
                    ">
                      Exam Date
                    </th>

                    <th className="
                      px-4
                      py-3
                      text-center
                    ">
                      Status
                    </th>

                    <th className="
                      px-4
                      py-3
                      text-center
                    ">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredAllocations.length === 0 ? (
                    <tr>
                      <td
                        colSpan="10"
                        className="
                          text-center
                          py-10
                          text-slate-500
                        "
                      >
                        No Exam Hall Allocations
                        Found
                      </td>
                    </tr>
                  ) : (
                    filteredAllocations.map(
                      (item) => (
                        <tr
                          key={
                            item.allocation_id
                          }
                          className="
                            border-t
                            hover:bg-slate-50
                          "
                        >

                          <td className="
                            px-4
                            py-4
                          ">
                            {
                              item.allocation_id
                            }
                          </td>

                          <td className="
                            px-4
                            py-4
                            font-medium
                          ">
                            {
                              item.exam_name ||
                              "-"
                            }
                          </td>

                          <td className="
                            px-4
                            py-4
                          ">
                            {
                              item.subject_name ||
                              "-"
                            }
                          </td>

                          <td className="
                            px-4
                            py-4
                          ">
                            {item.student_name
                              ? item.student_name
                              : `Student #${
                                  item.student_id ||
                                  "-"
                                }`}
                          </td>

                          <td className="
                            px-4
                            py-4
                          ">
                            {
                              item.batch_code ||
                              "-"
                            }
                          </td>

                          <td className="
                            px-4
                            py-4
                          ">
                            {
                              item.hall_name ||
                              "-"
                            }
                          </td>

                          <td className="
                            px-4
                            py-4
                            text-center
                            font-semibold
                          ">
                            {
                              item.seat_number ||
                              "-"
                            }
                          </td>

                          <td className="
                            px-4
                            py-4
                          ">
                            {
                              item.exam_date ||
                              "-"
                            }
                          </td>

                          <td className="
                            px-4
                            py-4
                            text-center
                          ">

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                item.allocation_status ===
                                "active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {
                                item.allocation_status
                              }
                            </span>

                          </td>

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
                                  py-1
                                  rounded
                                "
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteClick(
                                    item.allocation_id
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

        {/* ====================================
            DELETE MODAL
        ==================================== */}

        <DeleteExamHallAllocationModal
          isOpen={
            deleteModalOpen
          }
          onClose={
            closeDeleteModal
          }
          onConfirm={
            handleDelete
          }
          loading={
            deleteLoading
          }
        />

      </div>
    </AdminLayout>
  );
}

export default ExamHallAllocation;