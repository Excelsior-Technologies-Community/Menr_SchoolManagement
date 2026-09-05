import { useEffect, useState } from "react";
import {
  BookOpen
} from "lucide-react";

import StudentLayout from "../../layouts/StudentLayout";

import {
  getStudentMySubjects
} from "../../services/studentService";

function MySubjects() {

  const [subjects, setSubjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {

    try {

      setLoading(true);

      const response =
        await getStudentMySubjects();

      setSubjects(
        response.data || []
      );

    } catch (error) {

      console.log(error);

      setError(
        error.response?.data?.message ||
        "Unable to load subjects"
      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <StudentLayout>

      <div className="p-6 bg-slate-100 min-h-screen">

        <h1 className="text-3xl font-bold">
          My Subjects
        </h1>

        <p className="text-slate-500 mt-1 mb-6">
          Subjects assigned to your class.
        </p>

        {loading && (
          <div className="bg-white rounded-xl p-10 text-center">
            Loading subjects...
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-xl">
            {error}
          </div>
        )}

        {!loading && !error && (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {subjects.length === 0 ? (

              <div className="bg-white rounded-xl p-10 text-center text-slate-500 md:col-span-3">
                No subjects assigned.
              </div>

            ) : (

              subjects.map((subject) => (

                <div
                  key={subject.id}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
                >

                  <div className="flex items-center gap-4">

                    <div className="p-4 bg-blue-100 text-blue-600 rounded-xl">
                      <BookOpen size={25} />
                    </div>

                    <div>

                      <h2 className="text-xl font-bold text-slate-800">
                        {subject.subject_name}
                      </h2>

                      <p className="text-slate-500">
                        {subject.subject_code || "No Code"}
                      </p>

                    </div>

                  </div>

                </div>

              ))

            )}

          </div>

        )}

      </div>

    </StudentLayout>
  );
}

export default MySubjects;