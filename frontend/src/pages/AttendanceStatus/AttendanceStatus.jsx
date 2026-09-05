import { useEffect, useState } from "react";

import AdminLayout from "../../layouts/AdminLayout";

import {
  getClassAttendanceStatuses,
  getClassAttendanceStatus,
  createClassAttendanceStatus,
  updateClassAttendanceStatus
} from "../../services/attendanceStatusService";

import { getSchoolClasses } from "../../services/schoolClassService";

import { getSectionsByClass } from "../../services/sectionService";


/*
|--------------------------------------------------------------------------
| API RESPONSE HELPERS
|--------------------------------------------------------------------------
*/

const unwrapResponse = (response) => {
  let result = response;

  // Axios response: { data: ... }
  if (
    result &&
    typeof result === "object" &&
    !Array.isArray(result) &&
    result.data !== undefined &&
    (result.config || result.status || result.headers || result.request)
  ) {
    result = result.data;
  }

  // Backend wrapper: { success: true, data: ... }
  if (
    result &&
    typeof result === "object" &&
    !Array.isArray(result) &&
    result.data !== undefined
  ) {
    result = result.data;
  }

  return result;
};

const extractArray = (response) => {
  let result = unwrapResponse(response);

  if (Array.isArray(result)) {
    return result;
  }

  if (result && typeof result === "object") {
    const possibleKeys = [
      "data",
      "sections",
      "classes",
      "records",
      "results",
      "items",
      "rows",
      "list"
    ];

    for (const key of possibleKeys) {
      if (Array.isArray(result[key])) {
        return result[key];
      }
    }
  }

  return [];
};

const extractObject = (response) => {
  let result = unwrapResponse(response);

  if (!result) {
    return null;
  }

  if (Array.isArray(result)) {
    return result.length > 0 ? result[0] : null;
  }

  if (typeof result !== "object") {
    return null;
  }

  // Some APIs return { data: {...} }
  if (
    result.data &&
    typeof result.data === "object" &&
    !Array.isArray(result.data)
  ) {
    return result.data;
  }

  return result;
};


/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*//*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

function AttendanceStatus() {

  // =========================================================
  // MASTER DATA
  // =========================================================

  const [classes, setClasses] =
    useState([]);

  const [sections, setSections] =
    useState([]);


  // =========================================================
  // ATTENDANCE DATA
  // =========================================================

  const [attendanceStatus, setAttendanceStatus] =
    useState(null);

  const [attendanceList, setAttendanceList] =
    useState([]);


  // =========================================================
  // FILTERS
  // =========================================================

  const [filters, setFilters] =
    useState({
      classId: "",
      sectionId: "",
      date: new Date()
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

  const [classesLoading, setClassesLoading] =
    useState(false);

  const [sectionsLoading, setSectionsLoading] =
    useState(false);


  // =========================================================
  // ERROR / SUCCESS
  // =========================================================

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // =========================================================
  // FORM DATA
  // =========================================================

  const [formData, setFormData] =
    useState({
      attendance_status: "Pending",
      total_students: 0,
      present_count: 0,
      absent_count: 0
    });


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {

    loadClasses();

    loadAllStatuses();

  }, []);


  // =========================================================
  // MESSAGE HELPERS
  // =========================================================

  const clearMessages = () => {

    setError("");

    setSuccess("");

  };


  const getErrorMessage = (
    error,
    fallback
  ) => {

    return (
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.response?.data?.errors?.[0]?.message ||
      error?.message ||
      fallback
    );

  };


  // =========================================================
  // LOAD CLASSES
  // =========================================================

  const loadClasses = async () => {
    try {
      setClassesLoading(true);
      setError("");

      const response = await getSchoolClasses();

      console.log("SCHOOL CLASSES RESPONSE:", response);

      const classData = extractArray(response);

      console.log("EXTRACTED CLASS DATA:", classData);

      setClasses(Array.isArray(classData) ? classData : []);
    } catch (error) {
      console.error("CLASS LOAD ERROR:", error);
      console.error("CLASS API RESPONSE:", error?.response?.data);

      setClasses([]);
      setError(
        getErrorMessage(error, "Failed to load classes")
      );
    } finally {
      setClassesLoading(false);
    }
  };


  // =========================================================
  // LOAD ALL ATTENDANCE STATUS
  // =========================================================

  const loadAllStatuses = async () => {
    try {
      setLoading(true);

      const response = await getClassAttendanceStatuses();

      console.log("ALL ATTENDANCE STATUS RESPONSE:", response);

      const statusData = extractArray(response);

      console.log("EXTRACTED ATTENDANCE STATUS DATA:", statusData);

      setAttendanceList(Array.isArray(statusData) ? statusData : []);
    } catch (error) {
      console.error("ATTENDANCE STATUS LOAD ERROR:", error);
      console.error(
        "ATTENDANCE STATUS API RESPONSE:",
        error?.response?.data
      );

      setAttendanceList([]);

      // Do not block the complete page if records list fails.
      console.warn(
        getErrorMessage(
          error,
          "Failed to load attendance status records"
        )
      );
    } finally {
      setLoading(false);
    }
  };


  // =========================================================
  // CLASS CHANGE
  // =========================================================

  const handleClassChange = async (e) => {
    const classId = e.target.value;

    clearMessages();

    setFilters((previous) => ({
      ...previous,
      classId,
      sectionId: ""
    }));

    setAttendanceStatus(null);

    setFormData({
      attendance_status: "Pending",
      total_students: 0,
      present_count: 0,
      absent_count: 0
    });

    setSections([]);

    if (!classId) {
      return;
    }

    try {
      setSectionsLoading(true);

      console.log("SELECTED SCHOOL CLASS ID:", classId);

      const response = await getSectionsByClass(Number(classId));

      console.log("SECTIONS RESPONSE:", response);

      const sectionData = extractArray(response);

      console.log("EXTRACTED SECTION DATA:", sectionData);

      if (!Array.isArray(sectionData)) {
        setSections([]);
        setError("Invalid section data received from server");
        return;
      }

      setSections(sectionData);

      if (sectionData.length === 0) {
        setError("No sections found for the selected class");
      }
    } catch (error) {
      console.error("SECTION LOAD ERROR:", error);
      console.error(
        "SECTION API RESPONSE:",
        error?.response?.data
      );

      setSections([]);
      setError(
        getErrorMessage(error, "Failed to load sections")
      );
    } finally {
      setSectionsLoading(false);
    }
  };


  // =========================================================
  // FILTER CHANGE
  // =========================================================

  const handleFilterChange =
    (e) => {

      const {
        name,
        value
      } = e.target;


      clearMessages();


      setFilters(
        (previous) => ({
          ...previous,
          [name]: value
        })
      );


      setAttendanceStatus(null);

    };


  // =========================================================
  // RESET FORM
  // =========================================================

  const resetAttendanceForm =
    () => {

      setAttendanceStatus(null);


      setFormData({
        attendance_status: "Pending",
        total_students: 0,
        present_count: 0,
        absent_count: 0
      });

    };


  // =========================================================
  // LOAD ATTENDANCE STATUS
  // =========================================================

  const handleSearch = async () => {
    clearMessages();

    if (!filters.classId) {
      setError("Please select class");
      return;
    }

    if (!filters.sectionId) {
      setError("Please select section");
      return;
    }

    if (!filters.date) {
      setError("Please select attendance date");
      return;
    }

    try {
      setLoading(true);

      const response = await getClassAttendanceStatus({
        classId: Number(filters.classId),
        sectionId: Number(filters.sectionId),
        date: filters.date
      });

      console.log("ATTENDANCE STATUS RESPONSE:", response);

      const data = extractObject(response);

      console.log("EXTRACTED ATTENDANCE DATA:", data);

      if (data) {
        setAttendanceStatus(data);

        setFormData({
          attendance_status:
            data.attendance_status || "Pending",
          total_students: Number(data.total_students ?? 0),
          present_count: Number(data.present_count ?? 0),
          absent_count: Number(data.absent_count ?? 0)
        });

        setSuccess("Attendance status loaded successfully");
      } else {
        resetAttendanceForm();
        setSuccess(
          "No attendance status found. You can create a new record."
        );
      }
    } catch (error) {
      console.error("STATUS SEARCH ERROR:", error);
      console.error("STATUS API RESPONSE:", error?.response?.data);

      setAttendanceStatus(null);

      if (error?.response?.status === 404) {
        resetAttendanceForm();
        setSuccess(
          "No attendance status found. You can create a new record."
        );
      } else {
        setError(
          getErrorMessage(
            error,
            "Failed to load attendance status"
          )
        );
      }
    } finally {
      setLoading(false);
    }
  };


  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleFormChange =
    (e) => {

      const {
        name,
        value
      } = e.target;


      clearMessages();


      if (
        [
          "total_students",
          "present_count",
          "absent_count"
        ].includes(name)
      ) {

        if (value === "") {

          setFormData(
            (previous) => ({
              ...previous,
              [name]: ""
            })
          );

          return;

        }


        const numberValue =
          Number(value);


        if (
          !Number.isFinite(
            numberValue
          ) ||
          numberValue < 0
        ) {

          return;

        }


        setFormData(
          (previous) => ({
            ...previous,
            [name]: numberValue
          })
        );


        return;

      }


      setFormData(
        (previous) => ({
          ...previous,
          [name]: value
        })
      );

    };


  // =========================================================
  // SAVE / SUBMIT
  // =========================================================

  const handleSave = async (submitCompleted = false) => {
    clearMessages();

    // -------------------------------------------------------
    // FILTER VALIDATION
    // -------------------------------------------------------
    if (!filters.classId) {
      setError("Please select class");
      return;
    }

    if (!filters.sectionId) {
      setError("Please select section");
      return;
    }

    if (!filters.date) {
      setError("Please select attendance date");
      return;
    }

    // -------------------------------------------------------
    // NUMBER NORMALIZATION
    // -------------------------------------------------------
    const total = Number(formData.total_students);
    const present = Number(formData.present_count);
    const absent = Number(formData.absent_count);

    // -------------------------------------------------------
    // INTEGER VALIDATION
    // -------------------------------------------------------
    if (
      !Number.isInteger(total) ||
      !Number.isInteger(present) ||
      !Number.isInteger(absent)
    ) {
      setError("Attendance counts must be valid whole numbers");
      return;
    }

    // -------------------------------------------------------
    // NEGATIVE VALIDATION
    // -------------------------------------------------------
    if (total < 0) {
      setError("Total students cannot be negative");
      return;
    }

    if (present < 0) {
      setError("Present count cannot be negative");
      return;
    }

    if (absent < 0) {
      setError("Absent count cannot be negative");
      return;
    }

    // -------------------------------------------------------
    // COUNT VALIDATION
    // -------------------------------------------------------
    if (present > total) {
      setError("Present count cannot be greater than total students");
      return;
    }

    if (absent > total) {
      setError("Absent count cannot be greater than total students");
      return;
    }

    if (present + absent !== total) {
      setError(
        "Present Count + Absent Count must equal Total Students"
      );
      return;
    }

    // -------------------------------------------------------
    // STATUS
    // -------------------------------------------------------
    const attendance_status = submitCompleted
      ? "Completed"
      : "Pending";

    // -------------------------------------------------------
    // PAYLOAD
    // -------------------------------------------------------
    const payload = {
      class_id: Number(filters.classId),
      section_id: Number(filters.sectionId),
      attendance_date: filters.date,
      attendance_status,
      total_students: total,
      present_count: present,
      absent_count: absent
    };

    console.log("ATTENDANCE SAVE PAYLOAD:", payload);

    try {
      setSaving(true);

      const attendanceId =
        attendanceStatus?.attendance_id ??
        attendanceStatus?.id ??
        null;

      let response;

      // -----------------------------------------------------
      // UPDATE EXISTING RECORD
      // -----------------------------------------------------
      if (attendanceId) {
        response = await updateClassAttendanceStatus(
          attendanceId,
          payload
        );

        console.log(
          "ATTENDANCE UPDATE RESPONSE:",
          response
        );
      }
      // -----------------------------------------------------
      // CREATE NEW RECORD
      // -----------------------------------------------------
      else {
        response = await createClassAttendanceStatus(payload);

        console.log(
          "ATTENDANCE CREATE RESPONSE:",
          response
        );
      }

      // -----------------------------------------------------
      // SUCCESS
      // -----------------------------------------------------
      setSuccess(
        submitCompleted
          ? "Attendance submitted successfully"
          : "Attendance saved as pending successfully"
      );

      // -----------------------------------------------------
      // REFRESH RECORD LIST
      // -----------------------------------------------------
      await loadAllStatuses();

      // -----------------------------------------------------
      // RELOAD SELECTED RECORD
      // -----------------------------------------------------
      try {
        const refreshResponse =
          await getClassAttendanceStatus({
            classId: Number(filters.classId),
            sectionId: Number(filters.sectionId),
            date: filters.date
          });

        const refreshData = extractObject(refreshResponse);

        console.log(
          "REFRESHED ATTENDANCE DATA:",
          refreshData
        );

        if (refreshData) {
          setAttendanceStatus(refreshData);

          setFormData({
            attendance_status:
              refreshData.attendance_status || attendance_status,
            total_students: Number(
              refreshData.total_students ?? total
            ),
            present_count: Number(
              refreshData.present_count ?? present
            ),
            absent_count: Number(
              refreshData.absent_count ?? absent
            )
          });
        }
      } catch (refreshError) {
        console.warn(
          "ATTENDANCE REFRESH ERROR:",
          refreshError
        );
      }
    } catch (error) {
      console.error(
        "SAVE ATTENDANCE STATUS ERROR:",
        error
      );

      console.error(
        "SAVE API RESPONSE:",
        error?.response?.data
      );

      setError(
        getErrorMessage(
          error,
          "Failed to save attendance status"
        )
      );
    } finally {
      setSaving(false);
    }
  };


  // =========================================================
  // STATUS BADGE
  // =========================================================

  const getStatusClass =
    (status) => {

      if (
        status === "Completed"
      ) {

        return (
          "bg-green-100 text-green-700"
        );

      }


      return (
        "bg-yellow-100 text-yellow-700"
      );

    };


  // =========================================================
  // COUNTS
  // =========================================================

  const currentTotal =
    Number(
      formData.total_students || 0
    );


  const currentPresent =
    Number(
      formData.present_count || 0
    );


  const currentAbsent =
    Number(
      formData.absent_count || 0
    );


  const calculatedTotal =
    currentPresent +
    currentAbsent;


  const countsValid =
    calculatedTotal ===
    currentTotal;


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <AdminLayout>

      <div className="p-6 md:p-8 bg-slate-100 min-h-screen">


        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="mb-6">

          <h1 className="text-3xl font-bold text-slate-800">

            Class Attendance Status

          </h1>


          <p className="text-slate-500 mt-1">

            Manage class-wise attendance submission status.

          </p>

        </div>


        {/* ===================================================
            ERROR
        ==================================================== */}

        {error && (

          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">

            {error}

          </div>

        )}


        {/* ===================================================
            SUCCESS
        ==================================================== */}

        {success && !error && (

          <div className="mb-5 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">

            {success}

          </div>

        )}


        {/* ===================================================
            FILTER CARD
        ==================================================== */}

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">


          <h2 className="text-lg font-semibold text-slate-800 mb-5">

            Attendance Filters

          </h2>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


            {/* CLASS */}

            <div>

              <label className="block text-sm font-medium text-slate-600 mb-2">

                Class

              </label>


              <select

                value={
                  filters.classId
                }

                onChange={
                  handleClassChange
                }

                disabled={
                  classesLoading
                }

                className="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"

              >

                <option value="">

                  {classesLoading
                    ? "Loading Classes..."
                    : "Select Class"}

                </option>


                {Array.isArray(classes) &&
                  classes.map(
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

                        {item.class_name ??
                          item.name ??
                          "Unnamed Class"}

                      </option>

                    )
                  )}

              </select>

            </div>


            {/* SECTION */}

            <div>

              <label className="block text-sm font-medium text-slate-600 mb-2">

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
                  !filters.classId ||
                  sectionsLoading
                }

                className="w-full border border-slate-300 p-3 rounded-lg disabled:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"

              >

                <option value="">

                  {sectionsLoading
                    ? "Loading Sections..."
                    : "Select Section"}

                </option>


                {Array.isArray(sections) &&
                  sections.map(
                    (item) => (

                      <option

                        key={
                          item.id ??
                          item.section_id
                        }

                        value={
                          item.id ??
                          item.section_id
                        }

                      >

                        {item.section_name ??
                          item.name ??
                          item.section ??
                          "Unnamed Section"}

                      </option>

                    )
                  )}

              </select>

            </div>


            {/* DATE */}

            <div>

              <label className="block text-sm font-medium text-slate-600 mb-2">

                Attendance Date

              </label>


              <input

                type="date"

                name="date"

                value={
                  filters.date
                }

                onChange={
                  handleFilterChange
                }

                className="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

              />

            </div>

          </div>


          {/* LOAD */}

          <button

            type="button"

            onClick={
              handleSearch
            }

            disabled={
              loading ||
              !filters.classId ||
              !filters.sectionId ||
              !filters.date
            }

            className="mt-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-medium"

          >

            {loading
              ? "Loading..."
              : "Load Attendance Status"}

          </button>

        </div>


        {/* ===================================================
            ATTENDANCE FORM
        ==================================================== */}

        {filters.classId &&
          filters.sectionId && (

            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">


              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">


                <div>

                  <h2 className="text-xl font-semibold text-slate-800">

                    Attendance Summary

                  </h2>


                  <p className="text-sm text-slate-500 mt-1">

                    Date: {filters.date}

                  </p>


                  <p className="text-sm text-slate-500 mt-1">

                    {attendanceStatus
                      ? "Existing attendance status"
                      : "New attendance status"}

                  </p>

                </div>


                <span

                  className={`
                    px-4
                    py-2
                    rounded-full
                    text-sm
                    font-semibold
                    ${getStatusClass(
                      formData.attendance_status
                    )}
                  `}

                >

                  {formData.attendance_status}

                </span>

              </div>


              {/* COUNTS */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


                {/* TOTAL */}

                <div>

                  <label className="block text-sm font-medium text-slate-600 mb-2">

                    Total Students

                  </label>


                  <input

                    type="number"

                    min="0"

                    step="1"

                    name="total_students"

                    value={
                      formData.total_students
                    }

                    onChange={
                      handleFormChange
                    }

                    className="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                  />

                </div>


                {/* PRESENT */}

                <div>

                  <label className="block text-sm font-medium text-slate-600 mb-2">

                    Present Count

                  </label>


                  <input

                    type="number"

                    min="0"

                    step="1"

                    name="present_count"

                    value={
                      formData.present_count
                    }

                    onChange={
                      handleFormChange
                    }

                    className="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                  />

                </div>


                {/* ABSENT */}

                <div>

                  <label className="block text-sm font-medium text-slate-600 mb-2">

                    Absent Count

                  </label>


                  <input

                    type="number"

                    min="0"

                    step="1"

                    name="absent_count"

                    value={
                      formData.absent_count
                    }

                    onChange={
                      handleFormChange
                    }

                    className="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                  />

                </div>

              </div>


              {/* VALIDATION */}

              <div

                className={`
                  mt-5
                  rounded-lg
                  p-4
                  border
                  ${
                    countsValid
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }
                `}

              >

                <div className="flex justify-between text-sm">

                  <span>
                    Present + Absent
                  </span>


                  <strong>
                    {calculatedTotal}
                  </strong>

                </div>


                <div className="flex justify-between text-sm mt-2">

                  <span>
                    Total Students
                  </span>


                  <strong>
                    {currentTotal}
                  </strong>

                </div>


                <div className="flex justify-between text-sm mt-2">

                  <span>
                    Validation
                  </span>


                  <strong

                    className={
                      countsValid
                        ? "text-green-700"
                        : "text-red-700"
                    }

                  >

                    {countsValid
                      ? "Valid"
                      : "Invalid"}

                  </strong>

                </div>

              </div>


              {/* ACTIONS */}

              <div className="flex flex-wrap justify-end gap-3 mt-6">


                <button

                  type="button"

                  disabled={
                    saving ||
                    !countsValid
                  }

                  onClick={() =>
                    handleSave(false)
                  }

                  className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-white px-6 py-3 rounded-lg font-semibold"

                >

                  {saving
                    ? "Saving..."
                    : "Save as Pending"}

                </button>


                <button

                  type="button"

                  disabled={
                    saving ||
                    !countsValid
                  }

                  onClick={() =>
                    handleSave(true)
                  }

                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-6 py-3 rounded-lg font-semibold"

                >

                  {saving
                    ? "Submitting..."
                    : "Submit Attendance"}

                </button>

              </div>

            </div>

          )}


        {/* ===================================================
            RECORDS
        ==================================================== */}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">


          <div className="p-5 border-b">

            <div className="flex items-center justify-between">

              <h2 className="text-xl font-semibold text-slate-800">

                Attendance Status Records

              </h2>


              {loading && (

                <span className="text-sm text-slate-500">

                  Loading...

                </span>

              )}

            </div>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">


              <thead className="bg-slate-50 border-b">

                <tr>

                  <th className="p-4 text-left">
                    ID
                  </th>

                  <th className="p-4 text-left">
                    Class
                  </th>

                  <th className="p-4 text-left">
                    Section
                  </th>

                  <th className="p-4 text-left">
                    Date
                  </th>

                  <th className="p-4 text-left">
                    Total
                  </th>

                  <th className="p-4 text-left">
                    Present
                  </th>

                  <th className="p-4 text-left">
                    Absent
                  </th>

                  <th className="p-4 text-left">
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>


                {attendanceList.length === 0 ? (

                  <tr>

                    <td

                      colSpan="8"

                      className="p-10 text-center text-slate-500"

                    >

                      {loading
                        ? "Loading attendance status records..."
                        : "No attendance status records found."}

                    </td>

                  </tr>

                ) : (

                  attendanceList.map(
                    (item) => (

                      <tr

                        key={
                          item.attendance_id ??
                          item.id
                        }

                        className="border-b hover:bg-slate-50"

                      >

                        <td className="p-4">

                          {item.attendance_id ??
                            item.id ??
                            "-"}

                        </td>


                        <td className="p-4">

                          {item.class_name ??
                            "-"}

                        </td>


                        <td className="p-4">

                          {item.section_name ??
                            "-"}

                        </td>


                        <td className="p-4">

                          {item.attendance_date ??
                            "-"}

                        </td>


                        <td className="p-4">

                          {item.total_students ??
                            0}

                        </td>


                        <td className="p-4 text-green-700 font-semibold">

                          {item.present_count ??
                            0}

                        </td>


                        <td className="p-4 text-red-700 font-semibold">

                          {item.absent_count ??
                            0}

                        </td>


                        <td className="p-4">

                          <span

                            className={`
                              px-3
                              py-1
                              rounded-full
                              text-sm
                              font-semibold
                              ${getStatusClass(
                                item.attendance_status
                              )}
                            `}

                          >

                            {item.attendance_status ||
                              "Pending"}

                          </span>

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


export default AttendanceStatus;