import {
  useEffect,
  useMemo,
  useState,
} from "react";

import AdminLayout from "../../layouts/AdminLayout";

import ExamHallForm from "../../components/ExamHalls/ExamHallForm";

import DeleteExamHallModal from "../../components/ExamHalls/DeleteExamHallModal";

import {
  getExamHalls,
  createExamHall,
  updateExamHall,
  deleteExamHall,
} from "../../services/examHallService";

function ExamHalls() {
  // ==========================================
  // STATES
  // ==========================================

  const [examHalls, setExamHalls] =
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

  const [editingHall, setEditingHall] =
    useState(null);

  const [
    selectedHallId,
    setSelectedHallId,
  ] = useState(null);

  const [
    deleteModalOpen,
    setDeleteModalOpen,
  ] = useState(false);

  // ==========================================
  // FETCH
  // ==========================================

  useEffect(() => {
    fetchExamHalls();
  }, []);

  const fetchExamHalls = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getExamHalls();

      setExamHalls(
        response?.data || []
      );
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
        "Unable to fetch Exam Halls."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FILTER
  // ==========================================

  const filteredHalls = useMemo(() => {
    let data = [...examHalls];

    if (search.trim()) {
      const keyword =
        search.toLowerCase().trim();

      data = data.filter((item) => {
        return (
          item.hall_name
            ?.toLowerCase()
            .includes(keyword) ||

          item.school_name
            ?.toLowerCase()
            .includes(keyword) ||

          item.branch_name
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

    return data;
  }, [
    examHalls,
    search,
    status,
  ]);

  // ==========================================
  // ADD
  // ==========================================

  const handleAdd = () => {
    setEditingHall(null);
    setFormOpen(true);
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (hall) => {
    setEditingHall(hall);
    setFormOpen(true);
  };

  // ==========================================
  // FORM SUBMIT
  // ==========================================

  const handleSubmit = async (data) => {
    try {
      setFormLoading(true);

      if (editingHall) {
        await updateExamHall(
          editingHall.hall_id,
          data
        );

        alert(
          "Exam Hall Updated Successfully."
        );
      } else {
        await createExamHall(data);

        alert(
          "Exam Hall Created Successfully."
        );
      }

      setFormOpen(false);
      setEditingHall(null);

      await fetchExamHalls();
    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
        "Unable to save Exam Hall."
      );
    } finally {
      setFormLoading(false);
    }
  };

  // ==========================================
  // DELETE CLICK
  // ==========================================

  const handleDeleteClick = (id) => {
    setSelectedHallId(id);
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
    setSelectedHallId(null);
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async () => {
    if (!selectedHallId) {
      return;
    }

    try {
      setDeleteLoading(true);

      await deleteExamHall(
        selectedHallId
      );

      alert(
        "Exam Hall Deleted Successfully."
      );

      setDeleteModalOpen(false);
      setSelectedHallId(null);

      await fetchExamHalls();
    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
        "Unable to delete Exam Hall."
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
    setEditingHall(null);
  };

  // ==========================================
  // RESET FILTERS
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
              Exam Halls
            </h1>

            <p className="
              text-slate-500
              mt-2
            ">
              Manage examination halls and
              their seating capacity.
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
            + Add Exam Hall
          </button>

        </div>

        {/* ====================================
            FORM
        ==================================== */}

        {formOpen && (
          <div className="mb-6">

            <ExamHallForm
              mode={
                editingHall
                  ? "edit"
                  : "create"
              }
              initialData={
                editingHall || {}
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
                  Search Hall, School, Branch...
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
                Loading Exam Halls...
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
                      Hall Name
                    </th>

                    <th className="
                      px-4
                      py-3
                      text-left
                    ">
                      School
                    </th>

                    <th className="
                      px-4
                      py-3
                      text-left
                    ">
                      Branch
                    </th>

                    <th className="
                      px-4
                      py-3
                      text-center
                    ">
                      Capacity
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

                  {filteredHalls.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="
                          text-center
                          py-10
                          text-slate-500
                        "
                      >
                        No Exam Halls Found
                      </td>
                    </tr>
                  ) : (
                    filteredHalls.map(
                      (item) => (
                        <tr
                          key={
                            item.hall_id
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
                            {item.hall_id}
                          </td>

                          <td className="
                            px-4
                            py-4
                            font-medium
                            text-slate-800
                          ">
                            {item.hall_name ||
                              "-"}
                          </td>

                          <td className="
                            px-4
                            py-4
                          ">
                            {item.school_name ||
                              "-"}
                          </td>

                          <td className="
                            px-4
                            py-4
                          ">
                            {item.branch_name ||
                              "-"}
                          </td>

                          <td className="
                            px-4
                            py-4
                            text-center
                          ">
                            {item.capacity}
                          </td>

                          <td className="
                            px-4
                            py-4
                            text-center
                          ">

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
                                    item.hall_id
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

        <DeleteExamHallModal
          isOpen={deleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
          loading={deleteLoading}
        />

      </div>
    </AdminLayout>
  );
}

export default ExamHalls;