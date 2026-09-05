import { useEffect, useState } from "react";

import StudentLayout from "../../layouts/StudentLayout";

import {
  getStudentMyAttendance
} from "../../services/studentService";

function MyAttendance() {

  const [attendance, setAttendance] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {

    try {

      setLoading(true);

      const response =
        await getStudentMyAttendance();

      setAttendance(
        response.data || []
      );

    } catch (error) {

      console.log(error);

      setError(
        error.response?.data?.message ||
        "Unable to load attendance"
      );

    } finally {

      setLoading(false);

    }

  };

  const total =
    attendance.length;

  const present =
    attendance.filter(
      item =>
        item.status === "PRESENT"
    ).length;

  const absent =
    attendance.filter(
      item =>
        item.status === "ABSENT"
    ).length;

  const percentage =
    total > 0
      ? ((present / total) * 100).toFixed(2)
      : 0;

  return (
    <StudentLayout>

      <div className="p-6 bg-slate-100 min-h-screen">

        <h1 className="text-3xl font-bold">
          My Attendance
        </h1>

        <p className="text-slate-500 mt-1 mb-6">
          View your attendance records.
        </p>

        {!loading && !error && (

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

            <StatCard
              title="Total Days"
              value={total}
            />

            <StatCard
              title="Present"
              value={present}
            />

            <StatCard
              title="Attendance"
              value={`${percentage}%`}
            />

          </div>

        )}

        {loading && (
          <div className="bg-white rounded-xl p-10 text-center">
            Loading attendance...
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
                      Date
                    </th>

                    <th className="p-4 text-left">
                      Status
                    </th>

                    <th className="p-4 text-left">
                      Record ID
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {attendance.length === 0 ? (

                    <tr>

                      <td
                        colSpan="3"
                        className="p-10 text-center text-slate-500"
                      >
                        No attendance records found.
                      </td>

                    </tr>

                  ) : (

                    attendance.map((item) => (

                      <tr
                        key={item.id}
                        className="border-t"
                      >

                        <td className="p-4">
                          {item.attendance_date}
                        </td>

                        <td className="p-4">

                          <span
                            className={
                              item.status === "PRESENT"
                                ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold"
                                : item.status === "ABSENT"
                                ? "bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold"
                                : "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold"
                            }
                          >
                            {item.status}
                          </span>

                        </td>

                        <td className="p-4 text-slate-500">
                          #{item.id}
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


function StatCard({
  title,
  value
}) {

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">

      <p className="text-slate-500">
        {title}
      </p>

      <h2 className="text-3xl font-bold mt-2">
        {value}
      </h2>

    </div>
  );
}

export default MyAttendance;