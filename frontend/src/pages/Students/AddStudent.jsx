import {
  useEffect,
  useState
} from "react";

function AddStudent({
  onAdd,
  branches = [],
  schoolClasses = [],
  sections = [],
  batches = [],
  onClassChange
}) {

  const [formData, setFormData] =
    useState({
      school_class_id: "",
      section_id: "",
      branch_id: "",
      batch_id: "",

      full_name: "",
      email: "",
      roll_number: "",

      gender: "MALE",
      dob: "",

      father_name: "",
      mother_name: "",

      phone: "",
      address: ""
    });


  const [submitting, setSubmitting] =
    useState(false);


  // =========================================================
  // HANDLE INPUT
  // =========================================================

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


    // When class changes,
    // load related sections
    if (
      name === "school_class_id"
    ) {

      setFormData(
        (previous) => ({
          ...previous,

          school_class_id:
            value,

          section_id: "",

          batch_id: ""
        })
      );


      if (
        typeof onClassChange ===
        "function"
      ) {

        onClassChange(
          value
        );

      }

    }


    // When section changes,
    // reset batch selection
    if (
      name === "section_id"
    ) {

      setFormData(
        (previous) => ({
          ...previous,

          section_id:
            value,

          batch_id: ""
        })
      );

    }

  };


  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {

    setFormData({

      school_class_id: "",
      section_id: "",
      branch_id: "",
      batch_id: "",

      full_name: "",
      email: "",
      roll_number: "",

      gender: "MALE",
      dob: "",

      father_name: "",
      mother_name: "",

      phone: "",
      address: ""

    });

  };


  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit =
    async (e) => {

      e.preventDefault();


      if (
        !formData.full_name.trim()
      ) {

        alert(
          "Student Name is required"
        );

        return;

      }


      if (
        !formData.roll_number.trim()
      ) {

        alert(
          "Roll Number is required"
        );

        return;

      }


      if (
        !formData.phone.trim()
      ) {

        alert(
          "Phone Number is required"
        );

        return;

      }


      if (
        !formData.school_class_id
      ) {

        alert(
          "Please select Class"
        );

        return;

      }


      try {

        setSubmitting(true);


        await onAdd(
          formData
        );


        resetForm();


      } catch (error) {

        console.error(
          "ADD STUDENT FORM ERROR:",
          error
        );

      } finally {

        setSubmitting(false);

      }

    };


  // =========================================================
  // HELPERS
  // =========================================================

  const getSectionId =
    (section) =>
      section.id ??
      section.section_id;


  const getSectionName =
    (section) =>
      section.section_name ??
      section.name ??
      section.section ??
      `Section ${getSectionId(section)}`;


  const getBatchId =
    (batch) =>
      batch.batch_id ??
      batch.id;


  const getBatchName =
    (batch) =>
      batch.batch_code ??
      batch.batch_name ??
      `Batch ${getBatchId(batch)}`;


  // =========================================================
  // UI
  // =========================================================

  return (

    <form
      onSubmit={
        handleSubmit
      }
      className="
        bg-white
        p-6
        rounded-xl
        shadow-sm
      "
    >

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="mb-6">

        <h2
          className="
            text-xl
            font-semibold
            text-slate-800
          "
        >
          Add New Student
        </h2>

        <p
          className="
            text-sm
            text-gray-500
            mt-1
          "
        >
          Enter student admission and academic information
        </p>

      </div>


      {/* ================================================= */}
      {/* FORM GRID */}
      {/* ================================================= */}

      <div
        className="
          grid
          md:grid-cols-2
          gap-4
        "
      >

        {/* FULL NAME */}

        <div>

          <label
            className="
              block
              text-sm
              font-medium
              mb-2
            "
          >
            Full Name
          </label>

          <input
            type="text"
            name="full_name"
            placeholder="Student Name"
            value={
              formData.full_name
            }
            onChange={
              handleChange
            }
            className="
              w-full
              border
              p-3
              rounded-lg
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
            required
          />

        </div>


        {/* EMAIL */}

        <div>

          <label
            className="
              block
              text-sm
              font-medium
              mb-2
            "
          >
            Email
          </label>

          <input
            type="email"
            name="email"
            placeholder="student@example.com"
            value={
              formData.email
            }
            onChange={
              handleChange
            }
            className="
              w-full
              border
              p-3
              rounded-lg
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />

        </div>


        {/* ROLL NUMBER */}

        <div>

          <label
            className="
              block
              text-sm
              font-medium
              mb-2
            "
          >
            Roll Number
          </label>

          <input
            type="text"
            name="roll_number"
            placeholder="Roll Number"
            value={
              formData.roll_number
            }
            onChange={
              handleChange
            }
            className="
              w-full
              border
              p-3
              rounded-lg
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
            required
          />

        </div>


        {/* BRANCH */}

        <div>

          <label
            className="
              block
              text-sm
              font-medium
              mb-2
            "
          >
            Branch
          </label>

          <select
            name="branch_id"
            value={
              formData.branch_id
            }
            onChange={
              handleChange
            }
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
                  key={
                    branch.id ??
                    branch.branch_id
                  }
                  value={
                    branch.id ??
                    branch.branch_id
                  }
                >
                  {
                    branch.branch_name ??
                    branch.name
                  }
                </option>

              )
            )}

          </select>

        </div>


        {/* CLASS */}

        <div>

          <label
            className="
              block
              text-sm
              font-medium
              mb-2
            "
          >
            Class
          </label>

          <select
            name="school_class_id"
            value={
              formData.school_class_id
            }
            onChange={
              handleChange
            }
            className="
              w-full
              border
              p-3
              rounded-lg
              outline-none
            "
            required
          >

            <option value="">
              Select Class
            </option>

            {schoolClasses.map(
              (item) => (

                <option
                  key={
                    item.id ??
                    item.school_class_id
                  }
                  value={
                    item.id ??
                    item.school_class_id
                  }
                >
                  {
                    item.class_name ??
                    item.name
                  }
                </option>

              )
            )}

          </select>

        </div>


        {/* SECTION */}

        <div>

          <label
            className="
              block
              text-sm
              font-medium
              mb-2
            "
          >
            Section
          </label>

          <select
            name="section_id"
            value={
              formData.section_id
            }
            onChange={
              handleChange
            }
            disabled={
              !formData.school_class_id
            }
            className="
              w-full
              border
              p-3
              rounded-lg
              outline-none
              disabled:bg-gray-100
              disabled:text-gray-400
            "
          >

            <option value="">
              {
                formData.school_class_id
                  ? "Select Section"
                  : "Select Class First"
              }
            </option>

            {sections.map(
              (section) => (

                <option
                  key={
                    getSectionId(
                      section
                    )
                  }
                  value={
                    getSectionId(
                      section
                    )
                  }
                >
                  {
                    getSectionName(
                      section
                    )
                  }
                </option>

              )
            )}

          </select>

        </div>


        {/* BATCH */}

        <div>

          <label
            className="
              block
              text-sm
              font-medium
              mb-2
            "
          >
            Batch
          </label>

          <select
            name="batch_id"
            value={
              formData.batch_id
            }
            onChange={
              handleChange
            }
            disabled={
              !formData.school_class_id
            }
            className="
              w-full
              border
              p-3
              rounded-lg
              outline-none
              disabled:bg-gray-100
              disabled:text-gray-400
            "
          >

            <option value="">
              Select Batch
            </option>

            {batches
              .filter(
                (batch) => {

                  // If batch has class mapping,
                  // show only matching class.
                  if (
                    batch.school_class_id
                  ) {

                    return (
                      String(
                        batch.school_class_id
                      ) ===
                      String(
                        formData.school_class_id
                      )
                    );

                  }

                  return true;

                }
              )
              .filter(
                (batch) => {

                  // If batch has section mapping,
                  // match selected section.
                  if (
                    formData.section_id &&
                    batch.section_id
                  ) {

                    return (
                      String(
                        batch.section_id
                      ) ===
                      String(
                        formData.section_id
                      )
                    );

                  }

                  return true;

                }
              )
              .map(
                (batch) => (

                  <option
                    key={
                      getBatchId(
                        batch
                      )
                    }
                    value={
                      getBatchId(
                        batch
                      )
                    }
                  >
                    {
                      getBatchName(
                        batch
                      )
                    }
                  </option>

                )
              )}

          </select>

        </div>


        {/* GENDER */}

        <div>

          <label
            className="
              block
              text-sm
              font-medium
              mb-2
            "
          >
            Gender
          </label>

          <select
            name="gender"
            value={
              formData.gender
            }
            onChange={
              handleChange
            }
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

          <label
            className="
              block
              text-sm
              font-medium
              mb-2
            "
          >
            Date of Birth
          </label>

          <input
            type="date"
            name="dob"
            value={
              formData.dob
            }
            onChange={
              handleChange
            }
            className="
              w-full
              border
              p-3
              rounded-lg
              outline-none
            "
          />

        </div>


        {/* FATHER NAME */}

        <div>

          <label
            className="
              block
              text-sm
              font-medium
              mb-2
            "
          >
            Father Name
          </label>

          <input
            type="text"
            name="father_name"
            placeholder="Father Name"
            value={
              formData.father_name
            }
            onChange={
              handleChange
            }
            className="
              w-full
              border
              p-3
              rounded-lg
              outline-none
            "
          />

        </div>


        {/* MOTHER NAME */}

        <div>

          <label
            className="
              block
              text-sm
              font-medium
              mb-2
            "
          >
            Mother Name
          </label>

          <input
            type="text"
            name="mother_name"
            placeholder="Mother Name"
            value={
              formData.mother_name
            }
            onChange={
              handleChange
            }
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

          <label
            className="
              block
              text-sm
              font-medium
              mb-2
            "
          >
            Phone Number
          </label>

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={
              formData.phone
            }
            onChange={
              handleChange
            }
            className="
              w-full
              border
              p-3
              rounded-lg
              outline-none
            "
            required
          />

        </div>


        {/* ADDRESS */}

        <div>

          <label
            className="
              block
              text-sm
              font-medium
              mb-2
            "
          >
            Address
          </label>

          <input
            type="text"
            name="address"
            placeholder="Residential Address"
            value={
              formData.address
            }
            onChange={
              handleChange
            }
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


      {/* ================================================= */}
      {/* ACTIONS */}
      {/* ================================================= */}

      <div
        className="
          flex
          justify-end
          gap-3
          mt-6
          pt-5
          border-t
        "
      >

        <button
          type="button"
          onClick={
            resetForm
          }
          disabled={
            submitting
          }
          className="
            px-6
            py-3
            rounded-lg
            border
            border-gray-300
            text-gray-700
            hover:bg-gray-50
            disabled:opacity-50
          "
        >
          Clear
        </button>


        <button
          type="submit"
          disabled={
            submitting
          }
          className="
            px-6
            py-3
            rounded-lg
            bg-blue-600
            hover:bg-blue-700
            disabled:bg-blue-400
            text-white
            font-medium
          "
        >
          {submitting
            ? "Saving..."
            : "Save Student"}
        </button>

      </div>

    </form>

  );

}

export default AddStudent;