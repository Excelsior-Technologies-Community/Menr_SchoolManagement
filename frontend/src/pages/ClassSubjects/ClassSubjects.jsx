import {
  useEffect,
  useMemo,
  useState
} from "react";

import AdminLayout from "../../layouts/AdminLayout";

import AddClassSubject from "./AddClassSubject";

import {
  getAllClassSubjects,
  createClassSubject,
  deleteClassSubject
} from "../../services/classSubjectService";

import api from "../../services/api";

function ClassSubjects() {

  // =========================================================
  // STATE
  // =========================================================

  const [classSubjects, setClassSubjects] =
    useState([]);

  const [classes, setClasses] =
    useState([]);

  const [subjects, setSubjects] =
    useState([]);

  const [selectedClass, setSelectedClass] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [pageLoading, setPageLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // =========================================================
  // LOAD ALL DATA
  // =========================================================

  useEffect(() => {
    loadInitialData();
  }, []);


  const loadInitialData = async () => {

    try {

      setPageLoading(true);
      setError("");

      const [
        classSubjectResponse,
        classResponse,
        subjectResponse
      ] = await Promise.all([

        getAllClassSubjects(),

        api.get("/classes"),

        api.get("/subjects")

      ]);


      // Class Subject mappings
      setClassSubjects(
        classSubjectResponse?.data ||
          classSubjectResponse ||
          []
      );


      // Classes
      setClasses(
        classResponse?.data?.data ||
          classResponse?.data ||
          []
      );


      // Subjects
      setSubjects(
        subjectResponse?.data?.data ||
          subjectResponse?.data ||
          []
      );

    } catch (error) {

      console.error(
        "Class Subject Load Error:",
        error
      );

      setError(
        error.message ||
          "Failed to load class subject data."
      );

    } finally {

      setPageLoading(false);

    }
  };


  // =========================================================
  // ADD MAPPING
  // =========================================================

  const handleAdd = async (
    formData
  ) => {

    try {

      setLoading(true);
      setError("");
      setSuccess("");

      await createClassSubject(
        formData
      );

      setSuccess(
        "Subject assigned to class successfully."
      );

      await loadInitialData();

    } catch (error) {

      console.error(
        "Create Class Subject Error:",
        error
      );

      setError(
        error.message ||
          "Failed to create mapping."
      );

      throw error;

    } finally {

      setLoading(false);

    }
  };


  // =========================================================
  // DELETE MAPPING
  // =========================================================

  const handleDelete = async (
    id
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to remove this subject from the class?"
      );

    if (!confirmed) {
      return;
    }

    try {

      setError("");
      setSuccess("");

      await deleteClassSubject(id);

      setSuccess(
        "Class subject mapping deleted successfully."
      );

      setClassSubjects(
        (prev) =>
          prev.filter(
            (item) =>
              item.id !== id
          )
      );

    } catch (error) {

      console.error(
        "Delete Class Subject Error:",
        error
      );

      setError(
        error.message ||
          "Failed to delete mapping."
      );

    }
  };


  // =========================================================
  // FILTER
  // =========================================================

  const filteredMappings =
    useMemo(() => {

      let data =
        [...classSubjects];

      // Class filter
      if (selectedClass) {

        data =
          data.filter(
            (item) =>
              String(
                item.school_class_id
              ) ===
              String(selectedClass)
          );

      }

      // Search
      if (search.trim()) {

        const keyword =
          search
            .trim()
            .toLowerCase();

        data =
          data.filter(
            (item) =>

              item.class_name
                ?.toLowerCase()
                .includes(keyword)

              ||

              item.subject_name
                ?.toLowerCase()
                .includes(keyword)

              ||

              item.subject_code
                ?.toLowerCase()
                .includes(keyword)
          );

      }

      return data;

    }, [
      classSubjects,
      selectedClass,
      search
    ]);


  // =========================================================
  // CLEAR MESSAGES
  // =========================================================

  useEffect(() => {

    if (!success && !error) {
      return;
    }

    const timer =
      setTimeout(() => {

        setSuccess("");
        setError("");

      }, 4000);

    return () =>
      clearTimeout(timer);

  }, [success, error]);


  // =========================================================
  // UI
  // =========================================================

  return (
    <AdminLayout>

      <div className="min-h-screen bg-slate-100 p-4 md:p-8">

        {/* PAGE HEADER */}
        <div className="mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <h1 className="text-3xl font-bold text-slate-800">
                Class Subjects
              </h1>

              <p className="text-slate-500 mt-1">
                Manage subjects assigned to each school class.
              </p>

            </div>

            <div className="bg-white px-5 py-3 rounded-xl shadow-sm border border-slate-200">

              <p className="text-xs text-slate-500">
                Total Mappings
              </p>

              <p className="text-2xl font-bold text-blue-600">
                {classSubjects.length}
              </p>

            </div>

          </div>

        </div>


        {/* SUCCESS MESSAGE */}
        {success && (

          <div className="mb-5 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-green-700">

            {success}

          </div>

        )}


        {/* ERROR MESSAGE */}
        {error && (

          <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700">

            {error}

          </div>

        )}


        {/* ADD FORM */}
        <AddClassSubject
          classes={classes}
          subjects={subjects}
          onAdd={handleAdd}
          loading={loading}
        />


        {/* FILTER CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Class Filter */}
            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Filter By Class
              </label>

              <select
                value={selectedClass}
                onChange={(e) =>
                  setSelectedClass(
                    e.target.value
                  )
                }
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option value="">
                  All Classes
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


            {/* Search */}
            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
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
                placeholder="Search class, subject or code..."
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

          </div>

        </div>


        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

          <div className="px-6 py-5 border-b border-slate-200">

            <h2 className="text-lg font-semibold text-slate-800">
              Subject Mappings
            </h2>

          </div>


          {pageLoading ? (

            <div className="p-10 text-center">

              <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />

              <p className="mt-3 text-slate-500">
                Loading class subjects...
              </p>

            </div>

          ) : filteredMappings.length === 0 ? (

            <div className="p-10 text-center">

              <div className="text-4xl mb-3">
                📚
              </div>

              <h3 className="text-lg font-semibold text-slate-700">
                No Subject Mappings Found
              </h3>

              <p className="text-slate-500 mt-1">
                Assign subjects to classes using the form above.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                      #
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                      Class
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                      Subject
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                      Subject Code
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                      Status
                    </th>

                    <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredMappings.map(
                    (item, index) => (

                      <tr
                        key={item.id}
                        className="border-t border-slate-100 hover:bg-slate-50 transition"
                      >

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {index + 1}
                        </td>


                        <td className="px-6 py-4">

                          <div className="font-medium text-slate-800">
                            {item.class_name ||
                              "N/A"}
                          </div>

                        </td>


                        <td className="px-6 py-4">

                          <div className="font-medium text-slate-800">
                            {item.subject_name ||
                              "N/A"}
                          </div>

                        </td>


                        <td className="px-6 py-4">

                          <span className="inline-flex px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-sm">
                            {item.subject_code ||
                              "-"}
                          </span>

                        </td>


                        <td className="px-6 py-4">

                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                              item.status ===
                              "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {item.status ||
                              "active"}
                          </span>

                        </td>


                        <td className="px-6 py-4 text-right">

                          <button
                            onClick={() =>
                              handleDelete(
                                item.id
                              )
                            }
                            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition"
                          >
                            Remove
                          </button>

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

    </AdminLayout>
  );
}

export default ClassSubjects;