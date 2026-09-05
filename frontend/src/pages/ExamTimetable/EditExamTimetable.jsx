import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdminLayout from "../../layouts/AdminLayout";
import ExamTimetableForm from "../../components/ExamTimetable/ExamTimetableForm";

import {
  getExamTimetableById,
  updateExamTimetable,
} from "../../services/examTimetableService";

function EditExamTimetable() {

  const navigate = useNavigate();

  const { id } = useParams();

  const [loading, setLoading] =
    useState(false);

  const [pageLoading, setPageLoading] =
    useState(true);

  const [examTimetableData, setExamTimetableData] =
    useState(null);

  useEffect(() => {

    fetchExamTimetable();

  }, []);

  const fetchExamTimetable = async () => {

    try {

      setPageLoading(true);

      const response =
        await getExamTimetableById(id);

      setExamTimetableData(
        response.data
      );

    } catch (error) {

  console.error(error);

  alert(
    error?.response?.data?.message ||
    "Unable to load Exam Timetable."
  );

} finally {

      setPageLoading(false);

    }

  };

  const handleSubmit = async (
    formData
  ) => {

    try {

      setLoading(true);

      await updateExamTimetable(
        id,
        formData
      );

      alert(
        "Exam Timetable Updated Successfully."
      );

      navigate("/exam-timetable");

    } catch (error) {

      console.error(error);

      alert(

        error?.response?.data?.message ||

        "Unable to update Exam Timetable."

      );

    } finally {

      setLoading(false);

    }

  };

  const handleCancel = () => {

    navigate("/exam-timetable");

  };

  if (pageLoading) {

    return (

      <AdminLayout>

        <div className="flex justify-center items-center h-[70vh]">

          <div className="text-lg font-semibold">

            Loading Exam Timetable...

          </div>

        </div>

      </AdminLayout>

    );

  }

  return (

    <AdminLayout>

      <div className="bg-slate-100 min-h-screen p-6">

        {/* Header */}

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">

          <h1 className="text-3xl font-bold text-slate-800">

            Edit Exam Timetable

          </h1>

          <p className="text-slate-500 mt-2">

            Update Exam Timetable details.

          </p>

        </div>

        {/* Form */}

        <ExamTimetableForm

          mode="edit"

          initialData={examTimetableData}

          loading={loading}

          onSubmit={handleSubmit}

          onCancel={handleCancel}

        />

      </div>

    </AdminLayout>

  );

}

export default EditExamTimetable;