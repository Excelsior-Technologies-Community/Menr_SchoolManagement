import { useEffect, useState } from "react";

import StudentLayout from "../../layouts/StudentLayout";

import {
  getStudentClassmates
} from "../../services/studentService";

function MyClassmates() {

  const [students, setStudents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    fetchClassmates();
  }, []);

  const fetchClassmates = async () => {

    try {

      setLoading(true);

      const response =
        await getStudentClassmates();

      setStudents(
        response.data || []
      );

    } catch (error) {

      console.log(error);

      setError(
        error.response?.data?.message ||
        "Unable to load classmates"
      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <StudentLayout>

      <div className="p-6 bg-slate-100 min-h-screen">

        <h1 className="text-3xl font-bold text-slate-800">
          My Classmates
        </h1>

        <p className="text-slate-500 mt-1 mb-6">
          Students in your class, section and batch.
        </p>

        {loading && (
          <div className="bg-white rounded-xl p-10 text-center">
            Loading classmates...
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-xl">
            {error}
          </div>
        )}

        {!loading && !error && (

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="p-4 text-left">
                      Roll Number
                    </th>

                    <th className="p-4 text-left">
                      Student Name
                    </th>

                    <th className="p-4 text-left">
                      Gender
                    </th>

                    <th className="p-4 text-left">
                      Class
                    </th>

                    <th className="p-4 text-left">
                      Section
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {students.length === 0 ? (

                    <tr>
                      <td
                        colSpan="5"
                        className="p-10 text-center text-slate-500"
                      >
                        No classmates found.
                      </td>
                    </tr>

                  ) : (

                    students.map((student) => (

                      <tr
                        key={student.id}
                        className="border-t hover:bg-slate-50"
                      >

                        <td className="p-4 font-medium">
                          {student.roll_number || "-"}
                        </td>

                        <td className="p-4">
                          {student.full_name}
                        </td>

                        <td className="p-4">
                          {student.gender || "-"}
                        </td>

                        <td className="p-4">
                          {student.class_name || "-"}
                        </td>

                        <td className="p-4">
                          {student.section_name || "-"}
                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          </div>

        )}

      </div>

    </StudentLayout>
  );
}

export default MyClassmates;