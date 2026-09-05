import {
  useEffect,
  useState
} from "react";

function EditStudentModal({
  student,
  onClose,
  onUpdate,
  branches = [],
  schoolClasses = [],
  sections = [],
  batches = []
}) {

  const [formData, setFormData] =
    useState({
      full_name: "",
      email: "",
      roll_number: "",

      school_class_id: "",
      section_id: "",
      branch_id: "",
      batch_id: "",

      class_name: "",
      section: "",

      gender: "MALE",
      dob: "",

      father_name: "",
      mother_name: "",

      phone: "",
      address: ""
    });


  useEffect(() => {

    if (!student) return;

    setFormData({

      full_name:
        student.full_name || "",

      email:
        student.email || "",

      roll_number:
        student.roll_number || "",


      school_class_id:
        student.school_class_id || "",

      section_id:
        student.section_id || "",

      branch_id:
        student.branch_id || "",

      batch_id:
        student.batch_id || "",


      class_name:
        student.class_name || "",

      section:
        student.section || "",


      gender:
        student.gender || "MALE",

      dob:
        student.dob
          ? String(student.dob).substring(0, 10)
          : "",


      father_name:
        student.father_name || "",

      mother_name:
        student.mother_name || "",

      phone:
        student.phone || "",

      address:
        student.address || ""

    });

  }, [student]);


  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value
      })
    );

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!student?.id) {
      return;
    }

    await onUpdate(
      student.id,
      formData
    );

  };


  if (!student) {
    return null;
  }


  return (

    <div
      className="
        fixed
        inset-0
        z-50
        bg-black/50
        flex
        items-center
        justify-center
        p-4
      "
    >

      <div
        className="
          bg-white
          w-full
          max-w-4xl
          max-h-[90vh]
          overflow-y-auto
          rounded-2xl
          shadow-2xl
        "
      >

        {/* HEADER */}

        <div
          className="
            flex
            justify-between
            items-center
            p-6
            border-b
          "
        >

          <div>

            <h2
              className="
                text-2xl
                font-bold
                text-slate-800
              "
            >
              Edit Student
            </h2>

            <p
              className="
                text-sm
                text-gray-500
                mt-1
              "
            >
              Update student information
            </p>

          </div>


          <button
            type="button"
            onClick={onClose}
            className="
              w-9
              h-9
              rounded-full
              bg-red-50
              text-red-600
              hover:bg-red-100
              font-bold
              text-lg
            "
          >
            ×
          </button>

        </div>


        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="p-6"
        >

          <div
            className="
              grid
              md:grid-cols-2
              gap-5
            "
          >

            {/* FULL NAME */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="
                  w-full
                  border
                  p-3
                  rounded-lg
                  focus:ring-2
                  focus:ring-blue-500
                  outline-none
                "
                required
              />

            </div>


            {/* EMAIL */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="
                  w-full
                  border
                  p-3
                  rounded-lg
                  focus:ring-2
                  focus:ring-blue-500
                  outline-none
                "
              />

            </div>


            {/* ROLL NUMBER */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Roll Number
              </label>

              <input
                type="text"
                name="roll_number"
                value={formData.roll_number}
                onChange={handleChange}
                className="
                  w-full
                  border
                  p-3
                  rounded-lg
                  focus:ring-2
                  focus:ring-blue-500
                  outline-none
                "
                required
              />

            </div>


            {/* GENDER */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Gender
              </label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="
                  w-full
                  border
                  p-3
                  rounded-lg
                  outline-none
                "
              >

                <option value="MALE">
                  Male
                </option>

                <option value="FEMALE">
                  Female
                </option>

                <option value="OTHER">
                  Other
                </option>

              </select>

            </div>


            {/* DOB */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Date of Birth
              </label>

              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="
                  w-full
                  border
                  p-3
                  rounded-lg
                  outline-none
                "
              />

            </div>


            {/* BRANCH */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Branch
              </label>

              <select
                name="branch_id"
                value={formData.branch_id}
                onChange={handleChange}
                className="
                  w-full
                  border
                  p-3
                  rounded-lg
                  outline-none
                "
              >

                <option value="">
                  Select Branch
                </option>

                {branches.map(
                  (branch) => (

                    <option
                      key={branch.id}
                      value={branch.id}
                    >
                      {branch.branch_name}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* CLASS */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Class
              </label>

              <select
                name="school_class_id"
                value={formData.school_class_id}
                onChange={handleChange}
                className="
                  w-full
                  border
                  p-3
                  rounded-lg
                  outline-none
                "
              >

                <option value="">
                  Select Class
                </option>

                {schoolClasses.map(
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

              <label className="block text-sm font-medium mb-2">
                Section
              </label>

              <select
                name="section_id"
                value={formData.section_id}
                onChange={handleChange}
                className="
                  w-full
                  border
                  p-3
                  rounded-lg
                  outline-none
                "
              >

                <option value="">
                  Select Section
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

              <label className="block text-sm font-medium mb-2">
                Batch
              </label>

              <select
                name="batch_id"
                value={formData.batch_id}
                onChange={handleChange}
                className="
                  w-full
                  border
                  p-3
                  rounded-lg
                  outline-none
                "
              >

                <option value="">
                  Select Batch
                </option>

                {batches.map(
                  (item) => (

                    <option
                      key={item.batch_id || item.id}
                      value={
                        item.batch_id ||
                        item.id
                      }
                    >
                      {item.batch_code}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* FATHER */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Father Name
              </label>

              <input
                type="text"
                name="father_name"
                value={formData.father_name}
                onChange={handleChange}
                className="
                  w-full
                  border
                  p-3
                  rounded-lg
                  outline-none
                "
              />

            </div>


            {/* MOTHER */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Mother Name
              </label>

              <input
                type="text"
                name="mother_name"
                value={formData.mother_name}
                onChange={handleChange}
                className="
                  w-full
                  border
                  p-3
                  rounded-lg
                  outline-none
                "
              />

            </div>


            {/* PHONE */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="
                  w-full
                  border
                  p-3
                  rounded-lg
                  outline-none
                "
              />

            </div>


            {/* ADDRESS */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Address
              </label>

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="
                  w-full
                  border
                  p-3
                  rounded-lg
                  outline-none
                "
              />

            </div>

          </div>


          {/* ACTIONS */}

          <div
            className="
              flex
              justify-end
              gap-3
              mt-7
              pt-5
              border-t
            "
          >

            <button
              type="button"
              onClick={onClose}
              className="
                px-6
                py-3
                rounded-lg
                border
                border-gray-300
                text-gray-700
                hover:bg-gray-50
              "
            >
              Cancel
            </button>


            <button
              type="submit"
              className="
                px-6
                py-3
                rounded-lg
                bg-blue-600
                hover:bg-blue-700
                text-white
                font-medium
              "
            >
              Save Changes
            </button>

          </div>

        </form>

      </div>

    </div>

  );
}

export default EditStudentModal;