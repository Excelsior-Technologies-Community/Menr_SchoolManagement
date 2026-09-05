import { useEffect, useState } from "react";
import {
  BookOpen,
  Users,
  Building2
} from "lucide-react";

import StudentLayout from "../../layouts/StudentLayout";

import {
  getStudentMyClass
} from "../../services/studentService";

function MyClass() {

  const [classData, setClassData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    fetchClass();
  }, []);

  const fetchClass = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await getStudentMyClass();

      setClassData(
        response.data
      );

    } catch (error) {

      console.log(
        "MY CLASS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Unable to load class details"
      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <StudentLayout>

      <div className="p-6 bg-slate-100 min-h-screen">

        <h1 className="text-3xl font-bold text-slate-800">
          My Class
        </h1>

        <p className="text-slate-500 mt-1 mb-6">
          View your current class and batch details.
        </p>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl p-10 text-center">
            Loading class details...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-200 text-red-700 p-4 rounded-xl">
            {error}
          </div>
        )}

        {/* Class Data */}
        {!loading && !error && classData && (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {/* Class */}
            <InfoCard
              icon={<BookOpen />}
              title="Class"
              value={
                classData.class_name ||
                classData.class_master_name ||
                "-"
              }
            />

            {/* Section */}
            <InfoCard
              icon={<Users />}
              title="Section"
              value={
                classData.section_name || "-"
              }
            />

            {/* Branch */}
            <InfoCard
              icon={<Building2 />}
              title="Branch"
              value={
                classData.branch_name || "-"
              }
            />

          </div>

        )}

        {/* No Data */}
        {!loading && !error && !classData && (
          <div className="bg-white rounded-xl p-10 text-center text-slate-500">
            Class information not available.
          </div>
        )}

      </div>

    </StudentLayout>
  );
}


function InfoCard({
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

        <h3 className="font-semibold text-slate-600">
          {title}
        </h3>

      </div>

      <p className="text-2xl font-bold text-slate-800">
        {value}
      </p>

    </div>
  );
}

export default MyClass;