import {
  useEffect,
  useState
} from "react";

import AdminLayout
  from "../../layouts/AdminLayout";

import {
  getTeacherSubjects,
  createTeacherSubject,
  deleteTeacherSubject
} from "../../services/teacherSubjectService";

import {
  getStaff
} from "../../services/staffService";

import {
  getSubjects
} from "../../services/subjectService";


function TeacherSubjects() {

  const [
    mappings,
    setMappings
  ] = useState([]);

  const [
    teachers,
    setTeachers
  ] = useState([]);

  const [
    subjects,
    setSubjects
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    formData,
    setFormData
  ] = useState({

    staff_id: "",
    subject_id: ""

  });


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    fetchData();

  }, []);


  const fetchData = async () => {

    try {

      setLoading(true);

      const [
        mappingResponse,
        staffResponse,
        subjectResponse
      ] = await Promise.all([

        getTeacherSubjects(),

        getStaff(),

        getSubjects()

      ]);


      setMappings(
        mappingResponse.data || []
      );

      setTeachers(
        staffResponse.data || []
      );

      setSubjects(
        subjectResponse.data || []
      );

    } catch (error) {

      console.error(
        "Teacher Subject Error:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // CHANGE
  // =====================================================

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value

    });

  };


  // =====================================================
  // CREATE
  // =====================================================

  const handleSubmit =
  async (e) => {

    e.preventDefault();


    if (
      !formData.staff_id ||
      !formData.subject_id
    ) {

      alert(
        "Please select teacher and subject"
      );

      return;

    }


    try {

      await createTeacherSubject(
        formData
      );

      alert(
        "Subject Assigned Successfully"
      );


      setFormData({

        staff_id: "",
        subject_id: ""

      });


      fetchData();

    } catch (error) {

      console.error(error);

      alert(

        error.response?.data?.message ||

        "Failed to assign subject"

      );

    }

  };


  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete =
  async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete this teacher subject mapping?"
      );

    if (!confirmDelete) return;


    try {

      await deleteTeacherSubject(id);

      alert(
        "Mapping Deleted Successfully"
      );

      fetchData();

    } catch (error) {

      console.error(error);

      alert(

        error.response?.data?.message ||

        "Failed to delete mapping"

      );

    }

  };


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
            bg-white
            rounded-xl
            shadow-sm
            p-6
            mb-6
          "
        >

          <h1
            className="
              text-3xl
              font-bold
              text-slate-800
            "
          >

            Teacher Subject Mapping

          </h1>

          <p
            className="
              text-slate-500
              mt-2
            "
          >

            Assign subjects to teachers.

          </p>

        </div>


        {/* ================================================= */}
        {/* ADD MAPPING */}
        {/* ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="
            bg-white
            rounded-xl
            shadow-sm
            p-6
            mb-8
          "
        >

          <h2
            className="
              text-xl
              font-semibold
              mb-5
            "
          >

            Assign Subject

          </h2>


          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-4
            "
          >

            {/* TEACHER */}

            <select

              name="staff_id"

              value={
                formData.staff_id
              }

              onChange={
                handleChange
              }

              required

              className="
                border
                p-3
                rounded-lg
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            >

              <option value="">

                Select Teacher

              </option>


              {teachers.map(
                (teacher) => (

                  <option
                    key={teacher.id}
                    value={teacher.id}
                  >

                    {teacher.full_name}

                    {teacher.designation
                      ? ` - ${teacher.designation}`
                      : ""}

                  </option>

                )
              )}

            </select>


            {/* SUBJECT */}

            <select

              name="subject_id"

              value={
                formData.subject_id
              }

              onChange={
                handleChange
              }

              required

              className="
                border
                p-3
                rounded-lg
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            >

              <option value="">

                Select Subject

              </option>


              {subjects.map(
                (subject) => (

                  <option
                    key={subject.id}
                    value={subject.id}
                  >

                    {subject.subject_name}

                    {subject.subject_code
                      ? ` (${subject.subject_code})`
                      : ""}

                  </option>

                )
              )}

            </select>


            {/* BUTTON */}

            <button

              type="submit"

              className="
                bg-blue-600
                hover:bg-blue-700
                text-white
                font-semibold
                rounded-lg
                px-6
                py-3
              "
            >

              Assign Subject

            </button>

          </div>

        </form>


        {/* ================================================= */}
        {/* TABLE */}
        {/* ================================================= */}

        <div
          className="
            bg-white
            rounded-xl
            shadow-sm
            overflow-hidden
          "
        >

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead
                className="
                  bg-slate-50
                  border-b
                "
              >

                <tr>

                  <th className="p-4 text-left">
                    ID
                  </th>

                  <th className="p-4 text-left">
                    Teacher
                  </th>

                  <th className="p-4 text-left">
                    Designation
                  </th>

                  <th className="p-4 text-left">
                    Subject
                  </th>

                  <th className="p-4 text-left">
                    Subject Code
                  </th>

                  <th className="p-4 text-left">
                    Status
                  </th>

                  <th className="p-4 text-center">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan="7"
                      className="
                        p-10
                        text-center
                        text-slate-500
                      "
                    >

                      Loading...

                    </td>

                  </tr>

                ) : mappings.length === 0 ? (

                  <tr>

                    <td
                      colSpan="7"
                      className="
                        p-10
                        text-center
                        text-slate-500
                      "
                    >

                      No Teacher Subject Mapping Found

                    </td>

                  </tr>

                ) : (

                  mappings.map(
                    (item) => (

                      <tr
                        key={item.id}
                        className="
                          border-t
                          hover:bg-slate-50
                        "
                      >

                        <td className="p-4">

                          {item.id}

                        </td>

                        <td className="p-4 font-medium">

                          {item.teacher_name}

                        </td>

                        <td className="p-4">

                          {item.designation || "-"}

                        </td>

                        <td className="p-4">

                          {item.subject_name}

                        </td>

                        <td className="p-4">

                          {item.subject_code || "-"}

                        </td>

                        <td className="p-4">

                          <span
                            className={`
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

                            {item.status}

                          </span>

                        </td>

                        <td className="p-4 text-center">

                          <button

                            onClick={() =>
                              handleDelete(
                                item.id
                              )
                            }

                            className="
                              bg-red-500
                              hover:bg-red-600
                              text-white
                              px-4
                              py-2
                              rounded-lg
                            "
                          >

                            Delete

                          </button>

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

    </AdminLayout>

  );

}


export default TeacherSubjects;