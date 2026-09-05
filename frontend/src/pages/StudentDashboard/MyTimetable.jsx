import { useEffect, useState } from "react";
import {
  Clock,
  User
} from "lucide-react";

import StudentLayout from "../../layouts/StudentLayout";

import {
  getStudentMyTimetable
} from "../../services/studentService";

function MyTimetable() {

  const [timetable, setTimetable] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {

    try {

      setLoading(true);

      const response =
        await getStudentMyTimetable();

      setTimetable(
        response.data || []
      );

    } catch (error) {

      console.log(error);

      setError(
        error.response?.data?.message ||
        "Unable to load timetable"
      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <StudentLayout>

      <div className="p-6 bg-slate-100 min-h-screen">

        <h1 className="text-3xl font-bold">
          My Timetable
        </h1>

        <p className="text-slate-500 mt-1 mb-6">
          Your class timetable and scheduled periods.
        </p>

        {loading && (
          <div className="bg-white rounded-xl p-10 text-center">
            Loading timetable...
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
                      Day
                    </th>

                    <th className="p-4 text-left">
                      Time
                    </th>

                    <th className="p-4 text-left">
                      Subject
                    </th>

                    <th className="p-4 text-left">
                      Teacher
                    </th>

                    <th className="p-4 text-left">
                      Section
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {timetable.length === 0 ? (

                    <tr>
                      <td
                        colSpan="5"
                        className="p-10 text-center text-slate-500"
                      >
                        No timetable available.
                      </td>
                    </tr>

                  ) : (

                    timetable.map((item) => (

                      <tr
                        key={item.id}
                        className="border-t hover:bg-slate-50"
                      >

                        <td className="p-4 font-semibold">
                          {item.day_name}
                        </td>

                        <td className="p-4">

                          <div className="flex items-center gap-2">

                            <Clock
                              size={16}
                              className="text-blue-600"
                            />

                            {item.start_time}
                            {" - "}
                            {item.end_time}

                          </div>

                        </td>

                        <td className="p-4">

                          <div className="font-semibold">
                            {item.subject_name || "-"}
                          </div>

                          <div className="text-sm text-slate-500">
                            {item.subject_code || ""}
                          </div>

                        </td>

                        <td className="p-4">

                          <div className="flex items-center gap-2">

                            <User size={16} />

                            {item.teacher_name || "-"}

                          </div>

                        </td>

                        <td className="p-4">
                          {item.section_name || "-"}
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

export default MyTimetable;