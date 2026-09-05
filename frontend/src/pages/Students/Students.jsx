import {
  useEffect,
  useState
} from "react";

import AdminLayout
  from "../../layouts/AdminLayout";

import AddStudent
  from "./AddStudent";

import EditStudentModal
  from "./EditStudentModal";

import {
  getStudents,
  createStudent,
  updateStudentStatus,
  updateStudent,
  deleteStudent
} from "../../services/studentService";

import {
  getSchoolBranches
} from "../../services/schoolBranchService";

import {
  getSchoolClasses
} from "../../services/schoolClassService";

import {
  getSectionsByClass
} from "../../services/sectionService";

import {
  getBatches
} from "../../services/batchService";


function Students() {

  // =========================================================
  // STATE
  // =========================================================

  const [students, setStudents] =
    useState([]);

  const [branches, setBranches] =
    useState([]);

  const [schoolClasses, setSchoolClasses] =
    useState([]);

  const [sections, setSections] =
    useState([]);

  const [batches, setBatches] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [adding, setAdding] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  const [statusUpdatingId, setStatusUpdatingId] =
    useState(null);


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {

    fetchStudents();

  }, []);


  // =========================================================
  // FETCH ALL DATA
  // =========================================================

  const fetchStudents = async () => {

    try {

      setLoading(true);


      // Students
      const studentRes =
        await getStudents();

      setStudents(
        studentRes?.data || []
      );


      // Branches
      const branchRes =
        await getSchoolBranches();

      setBranches(
        branchRes?.data || []
      );


      // Classes
      const classRes =
        await getSchoolClasses();

      setSchoolClasses(
        classRes?.data || []
      );


      // Batches
      const batchRes =
        await getBatches();

      setBatches(
        batchRes?.data || []
      );


    } catch (error) {

      console.error(
        "STUDENT PAGE LOAD ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to load student data"
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // LOAD SECTIONS BY CLASS
  // =========================================================

  const loadSectionsByClass =
    async (schoolClassId) => {

      if (!schoolClassId) {

        setSections([]);

        return;

      }


      try {

        const response =
          await getSectionsByClass(
            schoolClassId
          );

        setSections(
          response?.data || []
        );

      } catch (error) {

        console.error(
          "SECTION LOAD ERROR:",
          error
        );

        setSections([]);

      }

    };


  // =========================================================
  // ADD STUDENT
  // =========================================================

  const handleAddStudent =
    async (studentData) => {

      try {

        setAdding(true);


        console.log(
          "Student Data Sent:",
          studentData
        );


        const response =
          await createStudent(
            studentData
          );


        console.log(
          "Create Response:",
          response
        );


        alert(
          "Student Added Successfully"
        );


        await fetchStudents();


      } catch (error) {

        console.error(
          "CREATE STUDENT ERROR:",
          error
        );


        alert(
          error.response?.data?.message ||
          error.message ||
          "Failed To Create Student"
        );


      } finally {

        setAdding(false);

      }

    };


  // =========================================================
  // STATUS CHANGE
  // =========================================================

  const handleStatusChange =
    async (
      id,
      currentStatus
    ) => {

      try {

        setStatusUpdatingId(id);


        const newStatus =
          currentStatus === "ACTIVE"
            ? "INACTIVE"
            : "ACTIVE";


        await updateStudentStatus(
          id,
          newStatus
        );


        alert(
          "Student Status Updated Successfully"
        );


        await fetchStudents();


      } catch (error) {

        console.error(
          "STATUS UPDATE ERROR:",
          error
        );


        alert(
          error.response?.data?.message ||
          "Failed To Update Status"
        );


      } finally {

        setStatusUpdatingId(null);

      }

    };


  // =========================================================
  // DELETE STUDENT
  // =========================================================

  const handleDeleteStudent =
    async (id) => {

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this student?"
        );


      if (!confirmed) {
        return;
      }


      try {

        setDeletingId(id);


        await deleteStudent(
          id
        );


        alert(
          "Student Deleted Successfully"
        );


        await fetchStudents();


      } catch (error) {

        console.error(
          "DELETE STUDENT ERROR:",
          error
        );


        alert(
          error.response?.data?.message ||
          error.message ||
          "Failed To Delete Student"
        );


      } finally {

        setDeletingId(null);

      }

    };


  // =========================================================
  // SEARCH
  // =========================================================

  const filteredStudents =
    students.filter(
      (student) => {

        const searchValue =
          search
            .trim()
            .toLowerCase();


        if (!searchValue) {
          return true;
        }


        return (

          student.full_name
            ?.toLowerCase()
            .includes(searchValue)

          ||

          student.roll_number
            ?.toLowerCase()
            .includes(searchValue)

          ||

          student.email
            ?.toLowerCase()
            .includes(searchValue)

          ||

          student.phone
            ?.toLowerCase()
            .includes(searchValue)

          ||

          student.class_name
            ?.toLowerCase()
            .includes(searchValue)

          ||

          student.branch_name
            ?.toLowerCase()
            .includes(searchValue)

          ||

          student.section_name
            ?.toLowerCase()
            .includes(searchValue)

        );

      }
    );


  // =========================================================
  // EDIT CLICK
  // =========================================================

  const handleEditClick =
    async (student) => {

      setSelectedStudent(
        student
      );


      setShowEditModal(
        true
      );


      // Load sections for student's class
      if (
        student.school_class_id
      ) {

        await loadSectionsByClass(
          student.school_class_id
        );

      } else {

        setSections([]);

      }

    };


  // =========================================================
  // UPDATE STUDENT
  // =========================================================

  const handleUpdateStudent =
    async (
      id,
      updatedData
    ) => {

      try {

        await updateStudent(
          id,
          updatedData
        );


        alert(
          "Student Updated Successfully"
        );


        setShowEditModal(
          false
        );

        setSelectedStudent(
          null
        );


        await fetchStudents();


      } catch (error) {

        console.error(
          "UPDATE STUDENT ERROR:",
          error
        );


        alert(
          error.response?.data?.message ||
          error.message ||
          "Failed To Update Student"
        );

      }

    };


  // =========================================================
  // CLOSE EDIT MODAL
  // =========================================================

  const handleCloseEdit =
    () => {

      setShowEditModal(
        false
      );

      setSelectedStudent(
        null
      );

    };


  // =========================================================
  // UI
  // =========================================================

  return (

    <AdminLayout>

      <div
        className="
          min-h-screen
          bg-slate-100
          p-8
        "
      >

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div
          className="
            flex
            justify-between
            items-center
            mb-6
          "
        >

          <div>

            <h1
              className="
                text-3xl
                font-bold
                text-slate-800
              "
            >
              Students
            </h1>

            <p
              className="
                text-gray-500
                mt-1
              "
            >
              Manage Students Information
            </p>

          </div>


          <div
            className="
              bg-white
              px-6
              py-3
              rounded-xl
              shadow-sm
            "
          >

            <h3
              className="
                text-sm
                text-gray-500
              "
            >
              Total Students
            </h3>

            <p
              className="
                text-2xl
                font-bold
                text-blue-600
              "
            >
              {students.length}
            </p>

          </div>

        </div>


        {/* ================================================= */}
        {/* SEARCH */}
        {/* ================================================= */}

        <div
          className="
            mb-6
            flex
            flex-col
            md:flex-row
            gap-3
          "
        >

          <input
            type="text"
            placeholder="
              Search by name, roll number,
              email, phone, class...
            "
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="
              w-full
              md:w-96
              border
              p-3
              rounded-lg
              bg-white
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />


          {search && (

            <button
              type="button"
              onClick={() =>
                setSearch("")
              }
              className="
                px-5
                py-3
                bg-gray-200
                hover:bg-gray-300
                rounded-lg
              "
            >
              Clear
            </button>

          )}

        </div>


        {/* ================================================= */}
        {/* ADD STUDENT */}
        {/* ================================================= */}

        <div
          className="mb-8"
        >

          <AddStudent
            onAdd={
              handleAddStudent
            }
            branches={
              branches
            }
            schoolClasses={
              schoolClasses
            }
            sections={
              sections
            }
            batches={
              batches
            }
            onClassChange={
              loadSectionsByClass
            }
          />


          {adding && (

            <p
              className="
                mt-3
                text-blue-600
                font-medium
              "
            >
              Saving Student...
            </p>

          )}

        </div>


        {/* ================================================= */}
        {/* STUDENTS TABLE */}
        {/* ================================================= */}

        <div
          className="
            bg-white
            rounded-xl
            shadow-sm
            overflow-hidden
          "
        >

          <div
            className="
              p-5
              border-b
              flex
              justify-between
              items-center
            "
          >

            <div>

              <h2
                className="
                  text-xl
                  font-semibold
                "
              >
                Students List
              </h2>

              <p
                className="
                  text-sm
                  text-gray-500
                  mt-1
                "
              >
                Showing{" "}
                {filteredStudents.length}
                {" "}of{" "}
                {students.length}
                {" "}students
              </p>

            </div>

          </div>


          <div
            className="
              overflow-x-auto
            "
          >

            <table
              className="
                w-full
              "
            >

              <thead
                className="
                  bg-slate-50
                "
              >

                <tr>

                  <th className="p-4 text-left">
                    ID
                  </th>

                  <th className="p-4 text-left">
                    Name
                  </th>

                  <th className="p-4 text-left">
                    Roll No
                  </th>

                  <th className="p-4 text-left">
                    Class
                  </th>

                  <th className="p-4 text-left">
                    Branch
                  </th>

                  <th className="p-4 text-left">
                    Section
                  </th>

                  <th className="p-4 text-left">
                    Batch
                  </th>

                  <th className="p-4 text-left">
                    Phone
                  </th>

                  <th className="p-4 text-left">
                    Status
                  </th>

                  <th className="p-4 text-left">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan="10"
                      className="
                        p-8
                        text-center
                        text-gray-500
                      "
                    >
                      Loading Students...
                    </td>

                  </tr>

                ) : filteredStudents.length === 0 ? (

                  <tr>

                    <td
                      colSpan="10"
                      className="
                        p-8
                        text-center
                        text-gray-500
                      "
                    >
                      No Students Found
                    </td>

                  </tr>

                ) : (

                  filteredStudents.map(
                    (student) => (

                      <tr
                        key={
                          student.id
                        }
                        className="
                          border-t
                          hover:bg-slate-50
                        "
                      >

                        <td className="p-4">
                          {student.id}
                        </td>


                        <td
                          className="
                            p-4
                            font-medium
                          "
                        >
                          {student.full_name}
                        </td>


                        <td className="p-4">
                          {student.roll_number}
                        </td>


                        <td className="p-4">
                          {student.class_name ||
                            "-"}
                        </td>


                        <td className="p-4">
                          {student.branch_name ||
                            "-"}
                        </td>


                        <td className="p-4">
                          {student.section_name ||
                            student.section ||
                            "-"}
                        </td>


                        <td className="p-4">
                          {student.batch_code ||
                            "-"}
                        </td>


                        <td className="p-4">
                          {student.phone ||
                            "-"}
                        </td>


                        <td className="p-4">

                          <span
                            className={
                              student.status ===
                              "ACTIVE"

                                ? `
                                  bg-green-100
                                  text-green-700
                                  px-3
                                  py-1
                                  rounded-full
                                  text-sm
                                `

                                : `
                                  bg-red-100
                                  text-red-700
                                  px-3
                                  py-1
                                  rounded-full
                                  text-sm
                                `
                            }
                          >
                            {student.status}
                          </span>

                        </td>


                        <td className="p-4">

                          <div
                            className="
                              flex
                              gap-2
                              flex-wrap
                            "
                          >

                            {/* EDIT */}

                            <button
                              type="button"
                              onClick={() =>
                                handleEditClick(
                                  student
                                )
                              }
                              className="
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                px-3
                                py-2
                                rounded-lg
                              "
                            >
                              Edit
                            </button>


                            {/* STATUS */}

                            <button
                              type="button"
                              disabled={
                                statusUpdatingId ===
                                student.id
                              }
                              onClick={() =>
                                handleStatusChange(
                                  student.id,
                                  student.status
                                )
                              }
                              className="
                                bg-yellow-500
                                hover:bg-yellow-600
                                disabled:opacity-50
                                text-white
                                px-3
                                py-2
                                rounded-lg
                              "
                            >
                              {statusUpdatingId ===
                              student.id
                                ? "..."
                                : "Status"}
                            </button>


                            {/* DELETE */}

                            <button
                              type="button"
                              disabled={
                                deletingId ===
                                student.id
                              }
                              onClick={() =>
                                handleDeleteStudent(
                                  student.id
                                )
                              }
                              className="
                                bg-red-600
                                hover:bg-red-700
                                disabled:opacity-50
                                text-white
                                px-3
                                py-2
                                rounded-lg
                              "
                            >
                              {deletingId ===
                              student.id
                                ? "..."
                                : "Delete"}
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

        </div>

      </div>


      {/* ================================================= */}
      {/* EDIT MODAL */}
      {/* ================================================= */}

      {showEditModal && (

        <EditStudentModal
          student={
            selectedStudent
          }

          branches={
            branches
          }

          schoolClasses={
            schoolClasses
          }

          sections={
            sections
          }

          batches={
            batches
          }

          onClose={
            handleCloseEdit
          }

          onUpdate={
            handleUpdateStudent
          }
        />

      )}

    </AdminLayout>

  );

}


export default Students;