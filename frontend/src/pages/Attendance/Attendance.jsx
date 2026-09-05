import {
  useEffect,
  useState
} from "react";

import AdminLayout from "../../layouts/AdminLayout";

import {
  getAttendanceByGroup,
  markAttendance,
  updateAttendance
} from "../../services/attendanceService";

import {
  getClasses
} from "../../services/classService";

import {
  getSectionsByClass
} from "../../services/sectionService";

import {
  getBatches
} from "../../services/batchService";


function Attendance() {

  // =========================================================
  // MASTER DATA
  // =========================================================

  const [classes, setClasses] =
    useState([]);

  const [sections, setSections] =
    useState([]);

  const [batches, setBatches] =
    useState([]);


  // =========================================================
  // STUDENTS
  // =========================================================

  const [students, setStudents] =
    useState([]);


  // =========================================================
  // FILTER
  // =========================================================

  const [filters, setFilters] =
    useState({

      schoolClassId: "",

      sectionId: "",

      batchId: "",

      attendanceDate:
        new Date()
          .toISOString()
          .split("T")[0]

    });


  // =========================================================
  // LOADING
  // =========================================================

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);


  // =========================================================
  // ERROR
  // =========================================================

  const [error, setError] =
    useState("");


  // =========================================================
  // LOAD CLASSES + BATCHES
  // =========================================================

  useEffect(() => {

    loadClasses();

    loadBatches();

  }, []);


  // =========================================================
  // LOAD CLASSES
  // =========================================================

  const loadClasses = async () => {

    try {

      const response =
        await getClasses();

      setClasses(
        response.data || []
      );

    } catch (error) {

      console.error(
        "CLASS LOAD ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to load classes"
      );

    }

  };


  // =========================================================
  // LOAD BATCHES
  // =========================================================

  const loadBatches = async () => {

    try {

      const response =
        await getBatches();

      setBatches(
        response.data || []
      );

    } catch (error) {

      console.error(
        "BATCH LOAD ERROR:",
        error
      );

    }

  };


  // =========================================================
  // CLASS CHANGE
  // =========================================================

  const handleClassChange =
    async (e) => {

      const schoolClassId =
        e.target.value;


      setFilters({

        ...filters,

        schoolClassId,

        sectionId: "",

        batchId: ""

      });


      setStudents([]);


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
          response.data || []
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
  // NORMAL FILTER CHANGE
  // =========================================================

  const handleFilterChange =
    (e) => {

      setFilters({

        ...filters,

        [e.target.name]:
          e.target.value

      });

    };


  // =========================================================
  // LOAD STUDENTS
  // =========================================================

  const loadStudents =
    async () => {

      if (
        !filters.schoolClassId
      ) {

        alert(
          "Please select class"
        );

        return;

      }


      if (
        !filters.attendanceDate
      ) {

        alert(
          "Please select attendance date"
        );

        return;

      }


      try {

        setLoading(true);

        setError("");


        const response =
          await getAttendanceByGroup({

            schoolClassId:
              filters.schoolClassId,

            sectionId:
              filters.sectionId,

            batchId:
              filters.batchId,

            attendanceDate:
              filters.attendanceDate

          });


        const data =
          response.data || [];


        const formatted =
          data.map(
            (student) => ({

              ...student,

              status:
                student.status ||
                "Present",

              remarks:
                student.remarks ||
                ""

            })
          );


        setStudents(
          formatted
        );


      } catch (error) {

        console.error(
          "STUDENT ATTENDANCE LOAD ERROR:",
          error
        );


        setError(
          error.response?.data?.message ||
          "Failed to load students"
        );


      } finally {

        setLoading(false);

      }

    };


  // =========================================================
  // CHANGE STUDENT STATUS
  // =========================================================

  const changeStatus = (
    studentId,
    status
  ) => {

    setStudents(
      students.map(
        (student) =>
          student.student_id ===
          studentId

            ? {
                ...student,
                status
              }

            : student
      )
    );

  };


  // =========================================================
  // CHANGE REMARK
  // =========================================================

  const changeRemark = (
    studentId,
    remarks
  ) => {

    setStudents(
      students.map(
        (student) =>
          student.student_id ===
          studentId

            ? {
                ...student,
                remarks
              }

            : student
      )
    );

  };


  // =========================================================
  // SAVE ALL ATTENDANCE
  // =========================================================

  const saveAttendance =
    async () => {

      if (
        students.length === 0
      ) {

        alert(
          "No students available"
        );

        return;

      }


      try {

        setSaving(true);

        setError("");


        for (
          const student of students
        ) {

          const payload = {

            school_class_id:
              student.school_class_id,

            section_id:
              student.section_id,

            student_id:
              student.student_id,

            attendance_date:
              filters.attendanceDate,

            status:
              student.status,

            remarks:
              student.remarks

          };


          // Existing attendance
          if (
            student.attendance_id
          ) {

            await updateAttendance(
              student.attendance_id,
              {
                status:
                  student.status,

                remarks:
                  student.remarks
              }
            );

          }

          // New attendance
          else {

            await markAttendance(
              payload
            );

          }

        }


        alert(
          "Attendance Saved Successfully"
        );


        await loadStudents();


      } catch (error) {

        console.error(
          "SAVE ATTENDANCE ERROR:",
          error
        );


        setError(
          error.response?.data?.message ||
          "Failed to save attendance"
        );


      } finally {

        setSaving(false);

      }

    };


  // =========================================================
  // MARK ALL PRESENT
  // =========================================================

  const markAllPresent = () => {

    setStudents(
      students.map(
        (student) => ({

          ...student,

          status:
            "Present"

        })
      )
    );

  };


  // =========================================================
  // MARK ALL ABSENT
  // =========================================================

  const markAllAbsent = () => {

    setStudents(
      students.map(
        (student) => ({

          ...student,

          status:
            "Absent"

        })
      )
    );

  };


  // =========================================================
  // MARK ALL LEAVE
  // =========================================================

  const markAllLeave = () => {

    setStudents(
      students.map(
        (student) => ({

          ...student,

          status:
            "Leave"

        })
      )
    );

  };


  // =========================================================
  // UI
  // =========================================================

  return (

    <AdminLayout>

      <div className="
        p-6
        md:p-8
        bg-slate-100
        min-h-screen
      ">

        {/* HEADER */}

        <div className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-4
          mb-6
        ">

          <div>

            <h1 className="
              text-3xl
              font-bold
              text-slate-800
            ">
              Student Attendance
            </h1>

            <p className="
              text-slate-500
              mt-1
            ">
              Mark and manage daily student attendance
            </p>

          </div>

        </div>


        {/* ERROR */}

        {error && (

          <div className="
            mb-5
            bg-red-50
            border
            border-red-200
            text-red-700
            px-4
            py-3
            rounded-lg
          ">

            {error}

          </div>

        )}


        {/* FILTER CARD */}

        <div className="
          bg-white
          rounded-xl
          shadow-sm
          p-6
          mb-6
        ">

          <h2 className="
            text-lg
            font-semibold
            text-slate-800
            mb-5
          ">
            Attendance Filters
          </h2>


          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-4
            gap-4
          ">

            {/* CLASS */}

            <div>

              <label className="
                block
                text-sm
                font-medium
                text-slate-600
                mb-2
              ">
                Class
              </label>

              <select
                value={
                  filters.schoolClassId
                }
                onChange={
                  handleClassChange
                }
                className="
                  w-full
                  border
                  border-slate-300
                  p-3
                  rounded-lg
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              >

                <option value="">
                  Select Class
                </option>

                {classes.map(
                  (item) => (

                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.class_name}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* SECTION */}

            <div>

              <label className="
                block
                text-sm
                font-medium
                text-slate-600
                mb-2
              ">
                Section
              </label>

              <select
                name="sectionId"
                value={
                  filters.sectionId
                }
                onChange={
                  handleFilterChange
                }
                disabled={
                  !filters.schoolClassId
                }
                className="
                  w-full
                  border
                  border-slate-300
                  p-3
                  rounded-lg
                  disabled:bg-slate-100
                "
              >

                <option value="">
                  All Sections
                </option>

                {sections.map(
                  (item) => (

                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.section_name}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* BATCH */}

            <div>

              <label className="
                block
                text-sm
                font-medium
                text-slate-600
                mb-2
              ">
                Batch
              </label>

              <select
                name="batchId"
                value={
                  filters.batchId
                }
                onChange={
                  handleFilterChange
                }
                className="
                  w-full
                  border
                  border-slate-300
                  p-3
                  rounded-lg
                "
              >

                <option value="">
                  All Batches
                </option>

                {batches
                  .filter(
                    (batch) =>
                      !filters.schoolClassId ||
                      String(
                        batch.school_class_id
                      ) ===
                      String(
                        filters.schoolClassId
                      )
                  )
                  .map(
                    (batch) => (

                      <option
                        key={
                          batch.batch_id
                        }
                        value={
                          batch.batch_id
                        }
                      >
                        {batch.batch_code}
                      </option>

                    )
                  )}

              </select>

            </div>


            {/* DATE */}

            <div>

              <label className="
                block
                text-sm
                font-medium
                text-slate-600
                mb-2
              ">
                Attendance Date
              </label>

              <input
                type="date"
                name="attendanceDate"
                value={
                  filters.attendanceDate
                }
                onChange={
                  handleFilterChange
                }
                className="
                  w-full
                  border
                  border-slate-300
                  p-3
                  rounded-lg
                "
              />

            </div>

          </div>


          <button
            type="button"
            onClick={
              loadStudents
            }
            disabled={loading}
            className="
              mt-5
              bg-blue-600
              hover:bg-blue-700
              disabled:bg-blue-300
              text-white
              px-6
              py-3
              rounded-lg
              font-medium
            "
          >

            {loading
              ? "Loading..."
              : "Load Students"}

          </button>

        </div>


        {/* STUDENT ATTENDANCE */}

        {students.length > 0 && (

          <div className="
            bg-white
            rounded-xl
            shadow-sm
            overflow-hidden
          ">

            {/* TOP ACTIONS */}

            <div className="
              p-5
              border-b
              flex
              flex-col
              md:flex-row
              md:items-center
              md:justify-between
              gap-4
            ">

              <div>

                <h2 className="
                  text-xl
                  font-semibold
                  text-slate-800
                ">
                  Student List
                </h2>

                <p className="
                  text-sm
                  text-slate-500
                  mt-1
                ">
                  {students.length} students
                </p>

              </div>


              <div className="
                flex
                flex-wrap
                gap-2
              ">

                <button
                  type="button"
                  onClick={
                    markAllPresent
                  }
                  className="
                    bg-green-600
                    hover:bg-green-700
                    text-white
                    px-4
                    py-2
                    rounded-lg
                    text-sm
                  "
                >
                  All Present
                </button>


                <button
                  type="button"
                  onClick={
                    markAllAbsent
                  }
                  className="
                    bg-red-600
                    hover:bg-red-700
                    text-white
                    px-4
                    py-2
                    rounded-lg
                    text-sm
                  "
                >
                  All Absent
                </button>


                <button
                  type="button"
                  onClick={
                    markAllLeave
                  }
                  className="
                    bg-yellow-500
                    hover:bg-yellow-600
                    text-white
                    px-4
                    py-2
                    rounded-lg
                    text-sm
                  "
                >
                  All Leave
                </button>

              </div>

            </div>


            {/* TABLE */}

            <div className="
              overflow-x-auto
            ">

              <table className="
                w-full
                min-w-[900px]
              ">

                <thead className="
                  bg-slate-50
                  border-b
                ">

                  <tr>

                    <th className="
                      p-4
                      text-left
                      text-sm
                    ">
                      #
                    </th>

                    <th className="
                      p-4
                      text-left
                      text-sm
                    ">
                      Roll Number
                    </th>

                    <th className="
                      p-4
                      text-left
                      text-sm
                    ">
                      Student Name
                    </th>

                    <th className="
                      p-4
                      text-left
                      text-sm
                    ">
                      Status
                    </th>

                    <th className="
                      p-4
                      text-left
                      text-sm
                    ">
                      Remarks
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {students.map(
                    (
                      student,
                      index
                    ) => (

                      <tr
                        key={
                          student.student_id
                        }
                        className="
                          border-b
                          hover:bg-slate-50
                        "
                      >

                        <td className="p-4">
                          {index + 1}
                        </td>


                        <td className="p-4">
                          {student.roll_number}
                        </td>


                        <td className="
                          p-4
                          font-medium
                          text-slate-800
                        ">
                          {student.full_name}
                        </td>


                        {/* STATUS */}

                        <td className="p-4">

                          <div className="
                            flex
                            gap-2
                          ">

                            <button
                              type="button"
                              onClick={() =>
                                changeStatus(
                                  student.student_id,
                                  "Present"
                                )
                              }
                              className={`
                                px-3
                                py-2
                                rounded-lg
                                text-sm
                                font-medium
                                ${
                                  student.status ===
                                  "Present"
                                    ? "bg-green-600 text-white"
                                    : "bg-green-50 text-green-700"
                                }
                              `}
                            >
                              Present
                            </button>


                            <button
                              type="button"
                              onClick={() =>
                                changeStatus(
                                  student.student_id,
                                  "Absent"
                                )
                              }
                              className={`
                                px-3
                                py-2
                                rounded-lg
                                text-sm
                                font-medium
                                ${
                                  student.status ===
                                  "Absent"
                                    ? "bg-red-600 text-white"
                                    : "bg-red-50 text-red-700"
                                }
                              `}
                            >
                              Absent
                            </button>


                            <button
                              type="button"
                              onClick={() =>
                                changeStatus(
                                  student.student_id,
                                  "Leave"
                                )
                              }
                              className={`
                                px-3
                                py-2
                                rounded-lg
                                text-sm
                                font-medium
                                ${
                                  student.status ===
                                  "Leave"
                                    ? "bg-yellow-500 text-white"
                                    : "bg-yellow-50 text-yellow-700"
                                }
                              `}
                            >
                              Leave
                            </button>

                          </div>

                        </td>


                        {/* REMARK */}

                        <td className="p-4">

                          <input
                            type="text"
                            value={
                              student.remarks ||
                              ""
                            }
                            onChange={(e) =>
                              changeRemark(
                                student.student_id,
                                e.target.value
                              )
                            }
                            placeholder="Optional remark"
                            className="
                              w-full
                              border
                              border-slate-300
                              p-2
                              rounded-lg
                            "
                          />

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>


            {/* SAVE */}

            <div className="
              p-5
              border-t
              flex
              justify-end
            ">

              <button
                type="button"
                onClick={
                  saveAttendance
                }
                disabled={saving}
                className="
                  bg-blue-600
                  hover:bg-blue-700
                  disabled:bg-blue-300
                  text-white
                  px-8
                  py-3
                  rounded-lg
                  font-semibold
                "
              >

                {saving
                  ? "Saving..."
                  : "Save Attendance"}

              </button>

            </div>

          </div>

        )}


        {/* EMPTY STATE */}

        {!loading &&
          students.length === 0 && (

          <div className="
            bg-white
            rounded-xl
            shadow-sm
            p-10
            text-center
          ">

            <div className="
              text-5xl
              mb-4
            ">
              📋
            </div>

            <h3 className="
              text-xl
              font-semibold
              text-slate-700
            ">
              No Students Loaded
            </h3>

            <p className="
              text-slate-500
              mt-2
            ">
              Select a class and date,
              then click Load Students.
            </p>

          </div>

        )}

      </div>

    </AdminLayout>

  );

}


export default Attendance;