import {
  useEffect,
  useState
} from "react";

import {
  getTimeTables
} from "../../services/timetableService";

import {
  getStaff
} from "../../services/staffService";


function TimeTableSubstitutionForm({

  initialData = null,

  onSubmit,

  loading = false

}) {

  const [
    timetables,
    setTimetables
  ] = useState([]);

  const [
    teachers,
    setTeachers
  ] = useState([]);

  const [
    formData,
    setFormData
  ] = useState({

    time_table_id: "",

    substitute_teacher_id: "",

    substitution_date: "",

    reason: "",

    remark: "",

    status: "active"

  });


  // =====================================================
  // LOAD DROPDOWNS
  // =====================================================

  useEffect(() => {

    fetchDropdowns();

  }, []);


  const fetchDropdowns = async () => {

    try {

      const [
        timetableRes,
        teacherRes
      ] = await Promise.all([

        getTimeTables(),

        getStaff()

      ]);


      setTimetables(
        timetableRes.data || []
      );

      setTeachers(
        teacherRes.data || []
      );

    } catch (error) {

      console.error(
        "Dropdown Error:",
        error
      );

    }

  };


  // =====================================================
  // EDIT MODE
  // =====================================================

  useEffect(() => {

    if (!initialData) return;

    setFormData({

      time_table_id:
        initialData.time_table_id || "",

      substitute_teacher_id:
        initialData.substitute_teacher_id || "",

      substitution_date:
        initialData.substitution_date
        ? String(
            initialData.substitution_date
          ).substring(0, 10)
        : "",

      reason:
        initialData.reason || "",

      remark:
        initialData.remark || "",

      status:
        initialData.status || "active"

    });

  }, [
    initialData
  ]);


  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

  };


  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = (e) => {

    e.preventDefault();

    if (
      !formData.time_table_id
    ) {

      alert(
        "Please select timetable"
      );

      return;

    }


    if (
      !formData.substitute_teacher_id
    ) {

      alert(
        "Please select substitute teacher"
      );

      return;

    }


    onSubmit(formData);

  };


  // =====================================================
  // GET SELECTED TIMETABLE
  // =====================================================

  const selectedTimetable =
    timetables.find(
      (item) =>
        Number(item.time_table_id) ===
        Number(formData.time_table_id)
    );


  // =====================================================
  // ORIGINAL TEACHER
  // =====================================================

  const originalTeacher =
    selectedTimetable?.teacher_id;


  return (

    <form
      onSubmit={handleSubmit}
      className="
        bg-white
        rounded-xl
        shadow-md
        p-8
      "
    >

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-6
        "
      >

        {/* ================================================= */}
        {/* TIMETABLE */}
        {/* ================================================= */}

        <div>

          <label className="block mb-2 font-medium">

            Timetable

          </label>

          <select

            name="time_table_id"

            value={
              formData.time_table_id
            }

            onChange={handleChange}

            required

            className="
              w-full
              border
              rounded-lg
              px-4
              py-3
            "
          >

            <option value="">

              Select Timetable

            </option>


            {timetables.map(
              (item) => (

                <option
                  key={
                    item.time_table_id
                  }
                  value={
                    item.time_table_id
                  }
                >

                  {item.batch_code ||
                    `Batch ${item.batch_id}`}

                  {" | "}

                  {item.subject_name ||
                    `Subject ${item.school_subject_id}`}

                  {" | "}

                  {item.day_of_week}

                </option>

              )
            )}

          </select>

        </div>


        {/* ================================================= */}
        {/* ORIGINAL TEACHER - AUTO */}
        {/* ================================================= */}

        <div>

          <label className="block mb-2 font-medium">

            Original Teacher

          </label>

          <input

            type="text"

            value={

              selectedTimetable?.teacher_name ||

              teachers.find(
                (teacher) =>
                  Number(teacher.id) ===
                  Number(originalTeacher)
              )?.full_name ||

              initialData?.original_teacher ||

              "Select timetable first"

            }

            readOnly

            className="
              w-full
              border
              bg-slate-100
              rounded-lg
              px-4
              py-3
              text-slate-600
            "

          />

        </div>


        {/* ================================================= */}
        {/* SUBSTITUTE TEACHER */}
        {/* ================================================= */}

        <div>

          <label className="block mb-2 font-medium">

            Substitute Teacher

          </label>

          <select

            name="substitute_teacher_id"

            value={
              formData.substitute_teacher_id
            }

            onChange={handleChange}

            required

            className="
              w-full
              border
              rounded-lg
              px-4
              py-3
            "
          >

            <option value="">

              Select Substitute Teacher

            </option>


            {teachers
              .filter(
                (teacher) =>
                  Number(teacher.id) !==
                  Number(originalTeacher)
              )
              .map(
                (teacher) => (

                  <option
                    key={teacher.id}
                    value={teacher.id}
                  >

                    {teacher.full_name}

                  </option>

                )
              )}

          </select>

        </div>


        {/* ================================================= */}
        {/* DATE */}
        {/* ================================================= */}

        <div>

          <label className="block mb-2 font-medium">

            Substitution Date

          </label>

          <input

            type="date"

            name="substitution_date"

            value={
              formData.substitution_date
            }

            onChange={handleChange}

            required

            className="
              w-full
              border
              rounded-lg
              px-4
              py-3
            "

          />

        </div>


        {/* ================================================= */}
        {/* REASON */}
        {/* ================================================= */}

        <div className="md:col-span-2">

          <label className="block mb-2 font-medium">

            Reason

          </label>

          <input

            type="text"

            name="reason"

            value={
              formData.reason
            }

            onChange={handleChange}

            placeholder="Enter substitution reason"

            className="
              w-full
              border
              rounded-lg
              px-4
              py-3
            "

          />

        </div>


        {/* ================================================= */}
        {/* REMARK */}
        {/* ================================================= */}

        <div className="md:col-span-2">

          <label className="block mb-2 font-medium">

            Remark

          </label>

          <textarea

            rows="4"

            name="remark"

            value={
              formData.remark
            }

            onChange={handleChange}

            placeholder="Additional remark"

            className="
              w-full
              border
              rounded-lg
              px-4
              py-3
            "

          />

        </div>


        {/* ================================================= */}
        {/* STATUS */}
        {/* ================================================= */}

        <div>

          <label className="block mb-2 font-medium">

            Status

          </label>

          <select

            name="status"

            value={
              formData.status
            }

            onChange={handleChange}

            className="
              w-full
              border
              rounded-lg
              px-4
              py-3
            "
          >

            <option value="active">

              Active

            </option>

            <option value="inactive">

              Inactive

            </option>

          </select>

        </div>


        {/* ================================================= */}
        {/* BUTTONS */}
        {/* ================================================= */}

        <div
          className="
            md:col-span-2
            flex
            justify-end
            gap-4
            mt-8
          "
        >

          <button

            type="button"

            onClick={() =>
              window.history.back()
            }

            className="
              px-6
              py-3
              rounded-lg
              border
              border-slate-300
              hover:bg-slate-100
            "
          >

            Cancel

          </button>


          <button

            type="submit"

            disabled={loading}

            className="
              px-8
              py-3
              rounded-lg
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-semibold
              disabled:opacity-50
            "
          >

            {loading

              ? "Saving..."

              : initialData

              ? "Update Substitution"

              : "Create Substitution"

            }

          </button>

        </div>

      </div>

    </form>

  );

}


export default TimeTableSubstitutionForm;