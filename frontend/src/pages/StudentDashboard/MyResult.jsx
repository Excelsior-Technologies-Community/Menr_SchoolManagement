import { useEffect, useState } from "react";

import {
  Award,
  BookOpen,
  CheckCircle
} from "lucide-react";

import StudentLayout from "../../layouts/StudentLayout";

import {
  getStudentResult
} from "../../services/studentService";


function MyResult() {

  const [results, setResults] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    fetchResults();

  }, []);


  const fetchResults = async () => {

    try {

      setLoading(true);

      const response =
        await getStudentResult();

      setResults(
        response.data?.marks || []
      );

    } catch (error) {

      console.log(error);

      setError(
        error.response?.data?.message ||
        "Unable to load results"
      );

    } finally {

      setLoading(false);

    }

  };


  const totalMaxMarks =
    results.reduce(
      (sum, item) =>
        sum + Number(item.max_marks || 0),
      0
    );


  const totalObtainedMarks =
    results.reduce(
      (sum, item) =>
        sum + Number(item.obtained_marks || 0),
      0
    );


  const overallPercentage =
    totalMaxMarks > 0
      ? (
          totalObtainedMarks /
          totalMaxMarks *
          100
        ).toFixed(2)
      : 0;


  return (

    <StudentLayout>

      <div className="p-6 bg-slate-100 min-h-screen">


        <div className="mb-6">

          <h1 className="text-3xl font-bold text-slate-800">

            My Result

          </h1>

          <p className="text-slate-500 mt-1">

            View your examination results and marks.

          </p>

        </div>


        {loading && (

          <div className="bg-white rounded-xl p-12 text-center">

            Loading results...

          </div>

        )}


        {error && (

          <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6">

            {error}

          </div>

        )}


        {!loading && !error && (

          <>


            {/* Summary */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">


              <SummaryCard
                icon={<Award />}
                title="Total Marks"
                value={`${totalObtainedMarks} / ${totalMaxMarks}`}
              />


              <SummaryCard
                icon={<CheckCircle />}
                title="Percentage"
                value={`${overallPercentage}%`}
              />


              <SummaryCard
                icon={<BookOpen />}
                title="Subjects"
                value={results.length}
              />


            </div>


            {/* Results Table */}

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-slate-50">

                    <tr>

                      <th className="p-4 text-left">
                        Exam
                      </th>

                      <th className="p-4 text-left">
                        Subject
                      </th>

                      <th className="p-4 text-center">
                        Max Marks
                      </th>

                      <th className="p-4 text-center">
                        Obtained
                      </th>

                      <th className="p-4 text-center">
                        Percentage
                      </th>

                      <th className="p-4 text-left">
                        Remarks
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {results.length === 0 ? (

                      <tr>

                        <td
                          colSpan="6"
                          className="p-12 text-center text-slate-500"
                        >

                          No result available.

                        </td>

                      </tr>

                    ) : (

                      results.map((item) => (

                        <tr
                          key={item.id}
                          className="border-t hover:bg-slate-50"
                        >

                          <td className="p-4 font-medium">

                            {item.exam_name || "-"}

                          </td>


                          <td className="p-4">

                            <div className="font-semibold">

                              {item.subject_name || "-"}

                            </div>

                            <div className="text-sm text-slate-500">

                              {item.subject_code || ""}

                            </div>

                          </td>


                          <td className="p-4 text-center">

                            {item.max_marks ?? "-"}

                          </td>


                          <td className="p-4 text-center font-bold">

                            {item.obtained_marks ?? "-"}

                          </td>


                          <td className="p-4 text-center">

                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">

                              {item.percentage ?? 0}%

                            </span>

                          </td>


                          <td className="p-4">

                            {item.remarks || "-"}

                          </td>

                        </tr>

                      ))

                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </>

        )}

      </div>

    </StudentLayout>

  );

}


function SummaryCard({
  icon,
  title,
  value
}) {

  return (

    <div className="bg-white rounded-xl shadow-sm p-6">

      <div className="flex items-center gap-3 mb-4">

        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">

          {icon}

        </div>

        <p className="text-slate-500">

          {title}

        </p>

      </div>


      <h2 className="text-3xl font-bold text-slate-800">

        {value}

      </h2>

    </div>

  );

}


export default MyResult;