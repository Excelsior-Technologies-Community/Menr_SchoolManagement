import {
  useEffect,
  useMemo,
  useState,
} from "react";

import AdminLayout from "../../layouts/AdminLayout";

import ExamMarksForm from "../../components/ExamMarks/ExamMarksForm";

import DeleteExamMarkModal from "../../components/ExamMarks/DeleteExamMarkModal";

import {
  getExamMarks,
  createExamMark,
  updateExamMark,
  deleteExamMark,
} from "../../services/examMarksService";


function ExamMarks() {

  // =========================================================
  // STATES
  // =========================================================

  const [marks, setMarks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [formLoading, setFormLoading] =
    useState(false);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [attendanceStatus, setAttendanceStatus] =
    useState("");

  const [formOpen, setFormOpen] =
    useState(false);

  const [editingMark, setEditingMark] =
    useState(null);

  const [
    selectedMarkId,
    setSelectedMarkId,
  ] = useState(null);

  const [
    deleteModalOpen,
    setDeleteModalOpen,
  ] = useState(false);


  // =========================================================
  // FETCH MARKS
  // =========================================================

  useEffect(() => {
    fetchMarks();
  }, []);


  const fetchMarks = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await getExamMarks();

      setMarks(
        response?.data || []
      );

    } catch (err) {

      console.error(err);

      setError(
        err?.response?.data?.message ||
        "Unable to fetch Exam Marks."
      );

    } finally {

      setLoading(false);

    }
  };


  // =========================================================
  // FILTER
  // =========================================================

  const filteredMarks =
    useMemo(() => {

      let data = [...marks];

      const keyword =
        search.trim().toLowerCase();

      if (keyword) {

        data = data.filter((item) => {

          const studentName =
            item.student_name ||
            "";

          const examName =
            item.exam_name ||
            "";

          const subjectName =
            item.subject_name ||
            "";

          const studentId =
            String(
              item.student_id || ""
            );

          const markId =
            String(
              item.mark_id || ""
            );

          return (
            studentName
              .toLowerCase()
              .includes(keyword) ||

            examName
              .toLowerCase()
              .includes(keyword) ||

            subjectName
              .toLowerCase()
              .includes(keyword) ||

            studentId.includes(keyword) ||

            markId.includes(keyword)
          );

        });

      }


      if (status) {

        data = data.filter(
          (item) =>
            item.status === status
        );

      }


      if (attendanceStatus) {

        data = data.filter(
          (item) =>
            item.exam_attendance_status ===
            attendanceStatus
        );

      }


      return data;

    }, [
      marks,
      search,
      status,
      attendanceStatus,
    ]);


  // =========================================================
  // ADD
  // =========================================================

  const handleAdd = () => {

    setEditingMark(null);

    setError("");
    setSuccess("");

    setFormOpen(true);

  };


  // =========================================================
  // EDIT
  // =========================================================

  const handleEdit = (item) => {

    setEditingMark(item);

    setError("");
    setSuccess("");

    setFormOpen(true);

  };


  // =========================================================
  // FORM SUBMIT
  // =========================================================

  const handleSubmit = async (data) => {

    try {

      setFormLoading(true);

      setError("");
      setSuccess("");

      if (editingMark) {

        await updateExamMark(
          editingMark.mark_id,
          data
        );

        setSuccess(
          "Exam mark updated successfully."
        );

      } else {

        await createExamMark(data);

        setSuccess(
          "Exam mark created successfully."
        );

      }

      setFormOpen(false);

      setEditingMark(null);

      await fetchMarks();

    } catch (err) {

      console.error(err);

      setError(
        err?.response?.data?.message ||
        "Unable to save Exam Mark."
      );

    } finally {

      setFormLoading(false);

    }
  };


  // =========================================================
  // DELETE OPEN
  // =========================================================

  const handleDeleteClick = (id) => {

    setSelectedMarkId(id);

    setDeleteModalOpen(true);

    setError("");
    setSuccess("");

  };


  // =========================================================
  // DELETE
  // =========================================================

  const handleDeleteConfirm = async () => {

    if (!selectedMarkId) {
      return;
    }

    try {

      setDeleteLoading(true);

      setError("");
      setSuccess("");

      await deleteExamMark(
        selectedMarkId
      );

      setSuccess(
        "Exam mark deleted successfully."
      );

      setDeleteModalOpen(false);

      setSelectedMarkId(null);

      await fetchMarks();

    } catch (err) {

      console.error(err);

      setError(
        err?.response?.data?.message ||
        "Unable to delete Exam Mark."
      );

    } finally {

      setDeleteLoading(false);

    }
  };


  // =========================================================
  // CANCEL FORM
  // =========================================================

  const handleCancel = () => {

    if (formLoading) {
      return;
    }

    setFormOpen(false);

    setEditingMark(null);

  };


  // =========================================================
  // RESET FILTERS
  // =========================================================

  const handleReset = () => {

    setSearch("");

    setStatus("");

    setAttendanceStatus("");

  };


  // =========================================================
  // FORMAT MARKS
  // =========================================================

  const getMarks = (item) => {

    let marksData =
      item.marks_obtained;

    if (
      typeof marksData ===
      "string"
    ) {

      try {

        marksData =
          JSON.parse(marksData);

      } catch {
        return "-";
      }
    }

    if (!marksData) {
      return "-";
    }

    return `${marksData.obtained_marks ?? 0} / ${
      marksData.max_marks ?? 0
    }`;
  };


  // =========================================================
  // STATUS BADGE
  // =========================================================

  const getStatusClass = (value) => {

    if (
      String(value).toLowerCase() ===
      "active"
    ) {

      return `
        bg-green-100
        text-green-700
      `;

    }

    return `
      bg-slate-100
      text-slate-600
    `;
  };


  const getAttendanceClass = (value) => {

    if (value === "Present") {

      return `
        bg-green-100
        text-green-700
      `;

    }

    if (value === "Absent") {

      return `
        bg-red-100
        text-red-700
      `;

    }

    return `
      bg-yellow-100
      text-yellow-700
    `;

  };


  // =========================================================
  // UI
  // =========================================================

  return (
    <AdminLayout>

      <div className="
        bg-slate-100
        min-h-screen
        p-6
      ">

        {/* HEADER */}

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
              Exam Marks
            </h1>

            <p className="
              text-slate-500
              mt-2
            ">
              Manage student examination marks.
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
            + Add Exam Mark
          </button>

        </div>


        {/* FORM */}

        {formOpen && (

          <div className="mb-6">

            <ExamMarksForm
              mode={
                editingMark
                  ? "edit"
                  : "create"
              }
              initialData={
                editingMark || {}
              }
              loading={
                formLoading
              }
              onSubmit={
                handleSubmit
              }
              onCancel={
                handleCancel
              }
            />

          </div>

        )}


        {/* SUCCESS */}

        {success && (

          <div className="
            bg-green-100
            border
            border-green-300
            text-green-700
            rounded-xl
            px-5
            py-4
            mb-6
          ">
            {success}
          </div>

        )}


        {/* ERROR */}

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


        {/* FILTERS */}

        <div className="
          bg-white
          rounded-xl
          shadow-md
          p-5
          mb-6
        ">

          <div className="
            grid
            grid-cols-1
            md:grid-cols-4
            gap-4
          ">

            {/* SEARCH */}

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="
                Search student, exam, subject or ID...
              "
              className="
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


            {/* STATUS */}

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value
                )
              }
              className="
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


            {/* ATTENDANCE */}

            <select
              value={
                attendanceStatus
              }
              onChange={(e) =>
                setAttendanceStatus(
                  e.target.value
                )
              }
              className="
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
                All Attendance
              </option>

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


            {/* RESET */}

            <button
              type="button"
              onClick={
                handleReset
              }
              className="
                bg-slate-100
                hover:bg-slate-200
                text-slate-700
                rounded-lg
                px-4
                py-3
                transition
              "
            >
              Reset Filters
            </button>

          </div>

        </div>


        {/* TABLE */}

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
                Loading Exam Marks...
              </p>

            </div>

          ) : filteredMarks.length === 0 ? (

            <div className="
              p-10
              text-center
              text-slate-500
            ">
              No Exam Marks found.
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
                      Student
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
                      Marks
                    </th>

                    <th className="
                      px-4
                      py-3
                      text-left
                    ">
                      Attendance
                    </th>

                    <th className="
                      px-4
                      py-3
                      text-left
                    ">
                      Result
                    </th>

                    <th className="
                      px-4
                      py-3
                      text-left
                    ">
                      Status
                    </th>

                    <th className="
                      px-4
                      py-3
                      text-left
                    ">
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredMarks.map(
                    (item) => (

                      <tr
                        key={
                          item.mark_id
                        }
                        className="
                          border-t
                          border-slate-200
                          hover:bg-slate-50
                        "
                      >

                        <td className="
                          px-4
                          py-4
                        ">
                          {item.mark_id}
                        </td>


                        <td className="
                          px-4
                          py-4
                          font-medium
                        ">
                          {item.exam_name ||
                            `Exam ${item.exam_id}`}
                        </td>


                        <td className="
                          px-4
                          py-4
                        ">

                          <div className="
                            font-medium
                            text-slate-800
                          ">
                            {item.student_name ||
                              `Student ${item.student_id}`}
                          </div>

                          <div className="
                            text-xs
                            text-slate-500
                          ">
                            ID: {item.student_id}
                          </div>

                        </td>


                        <td className="
                          px-4
                          py-4
                        ">
                          {item.subject_name ||
                            `Subject ${item.exam_subject_id}`}
                        </td>


                        <td className="
                          px-4
                          py-4
                          font-semibold
                        ">
                          {getMarks(item)}
                        </td>


                        <td className="
                          px-4
                          py-4
                        ">

                          <span className={`
                            inline-flex
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            font-medium
                            ${getAttendanceClass(
                              item.exam_attendance_status
                            )}
                          `}>
                            {
                              item.exam_attendance_status ||
                              "-"
                            }
                          </span>

                        </td>


                        <td className="
                          px-4
                          py-4
                        ">

                          <span className={`
                            inline-flex
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            font-medium
                            ${
                              item.result_status ===
                              "passed"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }
                          `}>
                            {item.result_status ||
                              "-"}
                          </span>

                        </td>


                        <td className="
                          px-4
                          py-4
                        ">

                          <span className={`
                            inline-flex
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            font-medium
                            ${getStatusClass(
                              item.status
                            )}
                          `}>
                            {
                              item.status ||
                              "-"
                            }
                          </span>

                        </td>


                        <td className="
                          px-4
                          py-4
                        ">

                          <div className="
                            flex
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
                                px-3
                                py-2
                                rounded-lg
                                bg-blue-100
                                text-blue-700
                                hover:bg-blue-200
                                transition
                              "
                            >
                              Edit
                            </button>


                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteClick(
                                  item.mark_id
                                )
                              }
                              className="
                                px-3
                                py-2
                                rounded-lg
                                bg-red-100
                                text-red-700
                                hover:bg-red-200
                                transition
                              "
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>


      {/* DELETE MODAL */}

      <DeleteExamMarkModal
        open={
          deleteModalOpen
        }
        loading={
          deleteLoading
        }
        onConfirm={
          handleDeleteConfirm
        }
        onCancel={() => {

          if (deleteLoading) {
            return;
          }

          setDeleteModalOpen(false);

          setSelectedMarkId(null);

        }}
      />

    </AdminLayout>
  );
}

export default ExamMarks;