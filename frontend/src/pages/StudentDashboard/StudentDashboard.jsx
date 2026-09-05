import { useEffect, useState } from "react";

import AdminLayout from "../../layouts/AdminLayout";
import { getStudentDashboard } from "../../services/studentDashboardService";

import {
  GraduationCap,
  ClipboardCheck,
  CalendarDays,
  BookOpen,
  CreditCard,
  RefreshCw,
  UserCheck,
  UserX,
  Clock3,
  Award,
  TrendingUp,
  User,
  MapPin,
  Hash,
  School
} from "lucide-react";


function StudentDashboard() {

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =========================================================
  // LOAD STUDENT DASHBOARD
  // =========================================================

  useEffect(() => {
    loadDashboard();
  }, []);


  const loadDashboard = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await getStudentDashboard();

      const data =
        response?.data || response;

      setDashboard(data);

    } catch (err) {

      console.error(
        "STUDENT DASHBOARD ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to load student dashboard"
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <AdminLayout>

        <div className="min-h-screen bg-slate-100 flex items-center justify-center">

          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">

            <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 animate-pulse">

              <GraduationCap size={24} />

            </div>

            <p className="text-slate-600 font-medium">
              Loading Student Dashboard...
            </p>

          </div>

        </div>

      </AdminLayout>

    );

  }


  // =========================================================
  // ERROR
  // =========================================================

  if (error) {

    return (

      <AdminLayout>

        <div className="min-h-screen bg-slate-100 p-6 md:p-8">

          <div className="max-w-3xl mx-auto bg-red-50 border border-red-200 rounded-2xl p-6">

            <h2 className="text-lg font-bold text-red-700">
              Dashboard Error
            </h2>

            <p className="text-red-600 mt-2">
              {error}
            </p>

            <button
              onClick={loadDashboard}
              className="mt-5 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl"
            >

              <RefreshCw size={17} />

              Retry

            </button>

          </div>

        </div>

      </AdminLayout>

    );

  }


  // =========================================================
  // REAL API DATA
  // =========================================================

  const profile =
    dashboard?.profile || {};

  const subjects =
    dashboard?.subjects || [];

  const attendance =
    dashboard?.attendance || {};

  const marks =
    dashboard?.marks || [];

  const fees =
    dashboard?.fees || {};


  // =========================================================
  // DERIVED VALUES
  // =========================================================

  const totalDays =
    Number(
      attendance.total_days || 0
    );

  const presentDays =
    Number(
      attendance.present_days || 0
    );

  const absentDays =
    Number(
      attendance.absent_days || 0
    );

  const attendancePercentage =
    Number(
      attendance.percentage || 0
    );


  const totalFee =
    Number(
      fees.total_fee || 0
    );

  const paidAmount =
    Number(
      fees.paid_amount || 0
    );

  const dueAmount =
    Number(
      fees.due_amount || 0
    );


  // Overall marks
  const totalMaxMarks =
    marks.reduce(
      (sum, item) =>
        sum +
        Number(
          item.max_marks || 0
        ),
      0
    );

  const totalObtainedMarks =
    marks.reduce(
      (sum, item) =>
        sum +
        Number(
          item.obtained_marks || 0
        ),
      0
    );

  const overallPercentage =
    totalMaxMarks > 0
      ? (
          (totalObtainedMarks /
            totalMaxMarks) *
          100
        ).toFixed(2)
      : "0.00";


  return (

    <AdminLayout>

      <div className="min-h-screen bg-slate-100">


        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="bg-white border-b border-slate-200 px-6 md:px-8 py-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <div className="flex items-center gap-2 text-sm text-blue-600 font-medium mb-2">

                <span className="w-2 h-2 rounded-full bg-blue-600" />

                Student Portal

              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                Student Dashboard
              </h1>

              <p className="text-slate-500 mt-1">

                Welcome back,{" "}

                <span className="font-medium text-slate-700">

                  {profile.full_name ||
                    "Student"}

                </span>

              </p>

            </div>


            <button
              onClick={loadDashboard}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium"
            >

              <RefreshCw size={17} />

              Refresh

            </button>

          </div>

        </div>


        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}

        <div className="p-6 md:p-8">


          {/* ===================================================
              PROFILE
          =================================================== */}

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 md:p-7 text-white shadow-lg">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">


              <div className="flex items-center gap-4">

                <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20">

                  <GraduationCap size={31} />

                </div>


                <div>

                  <p className="text-blue-100 text-sm">
                    Student
                  </p>

                  <h2 className="text-2xl font-bold">
                    {profile.full_name ||
                      "Student"}
                  </h2>

                  <p className="text-blue-100 mt-1">

                    Roll No:{" "}

                    {profile.roll_number ||
                      "-"}

                  </p>

                </div>

              </div>


              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">


                <ProfileItem
  icon={<BookOpen size={16} />}
  label="Class"
  value={
    profile.class_master_name ||
    "-"
  }
/>


                <ProfileItem
                  icon={<User size={16} />}
                  label="Section"
                  value={
                    profile.section_name ||
                    "-"
                  }
                />


                <ProfileItem
                  icon={<School size={16} />}
                  label="Branch"
                  value={
                    profile.branch_name ||
                    "-"
                  }
                />


                <ProfileItem
                  icon={<MapPin size={16} />}
                  label="Status"
                  value={
                    profile.status ||
                    "-"
                  }
                />

              </div>

            </div>

          </div>


          {/* ===================================================
              MAIN STAT CARDS
          =================================================== */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">


            <StatCard
              title="Attendance"
              value={`${attendancePercentage}%`}
              icon={<ClipboardCheck size={22} />}
              iconClass="bg-green-100 text-green-600"
              bgClass="bg-green-50"
            />


            <StatCard
              title="Subjects"
              value={subjects.length}
              icon={<BookOpen size={22} />}
              iconClass="bg-blue-100 text-blue-600"
              bgClass="bg-blue-50"
            />


            <StatCard
              title="Overall Result"
              value={`${overallPercentage}%`}
              icon={<Award size={22} />}
              iconClass="bg-purple-100 text-purple-600"
              bgClass="bg-purple-50"
            />


            <StatCard
              title="Fee Status"
              value={
                fees.status || "PENDING"
              }
              icon={<CreditCard size={22} />}
              iconClass="bg-orange-100 text-orange-600"
              bgClass="bg-orange-50"
            />

          </div>


          {/* ===================================================
              ATTENDANCE + FEE
          =================================================== */}

          <div className="grid lg:grid-cols-2 gap-6 mt-8">


            {/* ATTENDANCE */}

            <SectionCard
              title="My Attendance"
              description="Complete attendance summary"
              icon={<ClipboardCheck size={21} />}
            >

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">


                <Metric
                  title="Total Days"
                  value={totalDays}
                  className="text-slate-700"
                  icon={<CalendarDays size={17} />}
                />


                <Metric
                  title="Present"
                  value={presentDays}
                  className="text-green-600"
                  icon={<UserCheck size={17} />}
                />


                <Metric
                  title="Absent"
                  value={absentDays}
                  className="text-red-600"
                  icon={<UserX size={17} />}
                />


                <Metric
                  title="Rate"
                  value={`${attendancePercentage}%`}
                  className="text-blue-600"
                  icon={<TrendingUp size={17} />}
                />

              </div>

            </SectionCard>


            {/* FEES */}

            <SectionCard
              title="Fee Status"
              description="Current fee summary"
              icon={<CreditCard size={21} />}
            >

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">


                <Metric
                  title="Total Fee"
                  value={`₹${totalFee}`}
                  className="text-slate-700"
                  icon={<CreditCard size={17} />}
                />


                <Metric
                  title="Paid"
                  value={`₹${paidAmount}`}
                  className="text-green-600"
                  icon={<CreditCard size={17} />}
                />


                <Metric
                  title="Due"
                  value={`₹${dueAmount}`}
                  className="text-red-600"
                  icon={<CreditCard size={17} />}
                />

              </div>


              <div className="mt-5">

                <div className="flex justify-between text-sm mb-2">

                  <span className="text-slate-500">
                    Payment Progress
                  </span>

                  <span className="font-semibold">

                    {totalFee > 0
                      ? Math.min(
                          (
                            paidAmount /
                            totalFee
                          ) * 100,
                          100
                        ).toFixed(0)
                      : 0}
                    %

                  </span>

                </div>


                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{
                      width: `${
                        totalFee > 0
                          ? Math.min(
                              (
                                paidAmount /
                                totalFee
                              ) * 100,
                              100
                            )
                          : 0
                      }%`
                    }}
                  />

                </div>

              </div>

            </SectionCard>

          </div>


          {/* ===================================================
              SUBJECTS
          =================================================== */}

          <SectionCard
            title="My Subjects"
            description="Subjects assigned to your class"
            icon={<BookOpen size={21} />}
            className="mt-8"
          >

            {subjects.length > 0 ? (

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

                {subjects.map(
                  (subject, index) => (

                    <div
                      key={
                        subject.id ||
                        subject.subject_id ||
                        index
                      }
                      className="border border-slate-100 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition bg-white"
                    >

                      <div className="flex items-center justify-between">

                        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">

                          <BookOpen size={20} />

                        </div>


                        <span className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700">

                          Active

                        </span>

                      </div>


                      <h3 className="font-semibold mt-4 text-slate-800">

                        {subject.subject_name ||
                          "Subject"}

                      </h3>


                      <p className="text-sm text-slate-500 mt-1">

                        Code:{" "}

                        {subject.subject_code ||
                          "-"}

                      </p>

                    </div>

                  )
                )}

              </div>

            ) : (

              <EmptyState
                icon={<BookOpen size={22} />}
                text="No subjects found for your class"
              />

            )}

          </SectionCard>


          {/* ===================================================
              RESULTS
          =================================================== */}

          <SectionCard
            title="Results & Marks"
            description="Your examination performance"
            icon={<Award size={21} />}
            className="mt-8"
          >

            {marks.length > 0 ? (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[800px]">

                  <thead>

                    <tr className="border-b border-slate-200">

                      <th className="text-left py-3 text-sm text-slate-600">
                        Exam
                      </th>

                      <th className="text-left py-3 text-sm text-slate-600">
                        Subject
                      </th>

                      <th className="text-left py-3 text-sm text-slate-600">
                        Obtained
                      </th>

                      <th className="text-left py-3 text-sm text-slate-600">
                        Maximum
                      </th>

                      <th className="text-left py-3 text-sm text-slate-600">
                        Percentage
                      </th>

                      <th className="text-left py-3 text-sm text-slate-600">
                        Grade
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {marks.map(
                      (mark, index) => {

                        const maxMarks =
                          Number(
                            mark.max_marks || 0
                          );

                        const obtainedMarks =
                          Number(
                            mark.obtained_marks || 0
                          );

                        const percentage =
                          Number(
                            mark.percentage ??
                            (
                              maxMarks > 0
                                ? (
                                    (
                                      obtainedMarks /
                                      maxMarks
                                    ) *
                                    100
                                  )
                                : 0
                            )
                          );


                        return (

                          <tr
                            key={
                              mark.id ||
                              index
                            }
                            className="border-b border-slate-100 hover:bg-slate-50"
                          >

                            <td className="py-4 font-medium">

                              {mark.exam_name ||
                                "-"}

                            </td>


                            <td className="py-4">

                              {mark.subject_name ||
                                "-"}

                            </td>


                            <td className="py-4 font-semibold">

                              {obtainedMarks}

                            </td>


                            <td className="py-4">

                              {maxMarks}

                            </td>


                            <td className="py-4">

                              {percentage.toFixed(2)}%

                            </td>


                            <td className="py-4">

                              <span
                                className={
                                  percentage >= 75
                                    ? "px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium"
                                    : percentage >= 50
                                    ? "px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium"
                                    : "px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium"
                                }
                              >

                                {getGrade(
                                  percentage
                                )}

                              </span>

                            </td>

                          </tr>

                        );

                      }
                    )}

                  </tbody>

                </table>

              </div>

            ) : (

              <EmptyState
                icon={<Award size={22} />}
                text="No marks or results available yet"
              />

            )}

          </SectionCard>


          {/* ===================================================
              RESULT SUMMARY
          =================================================== */}

          <SectionCard
            title="Academic Summary"
            description="Overall performance"
            icon={<TrendingUp size={21} />}
            className="mt-8"
          >

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">


              <SummaryCard
                title="Subjects"
                value={subjects.length}
                subtitle="Assigned subjects"
                icon={<BookOpen size={22} />}
                className="bg-blue-50 text-blue-600"
              />


              <SummaryCard
                title="Examinations"
                value={
                  new Set(
                    marks.map(
                      item => item.exam_id
                    )
                  ).size
                }
                subtitle="Exams with marks"
                icon={<Award size={22} />}
                className="bg-purple-50 text-purple-600"
              />


              <SummaryCard
                title="Overall Score"
                value={`${overallPercentage}%`}
                subtitle="Based on available marks"
                icon={<TrendingUp size={22} />}
                className="bg-green-50 text-green-600"
              />

            </div>

          </SectionCard>


          {/* ===================================================
              TIMETABLE PLACEHOLDER
          =================================================== */}

          <SectionCard
            title="My Timetable"
            description="Weekly class schedule"
            icon={<Clock3 size={21} />}
            className="mt-8"
          >

            <EmptyState
              icon={<Clock3 size={22} />}
              text="Timetable will appear here once student timetable API is connected"
            />

          </SectionCard>


          {/* ===================================================
              UPCOMING EVENTS PLACEHOLDER
          =================================================== */}

          <SectionCard
            title="Upcoming Events"
            description="School events and activities"
            icon={<CalendarDays size={21} />}
            className="mt-8"
          >

            <EmptyState
              icon={<CalendarDays size={22} />}
              text="Upcoming events will appear here when the student event API is connected"
            />

          </SectionCard>


          {/* ===================================================
              QUICK ACCESS
          =================================================== */}

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">


            <QuickAction
              title="Attendance"
              description="View your complete attendance"
              icon={<ClipboardCheck size={21} />}
            />


            <QuickAction
              title="Subjects"
              description="View your class subjects"
              icon={<BookOpen size={21} />}
            />


            <QuickAction
              title="Results"
              description="View marks and grades"
              icon={<Award size={21} />}
            />


            <QuickAction
              title="Fees"
              description="View fee and payment status"
              icon={<CreditCard size={21} />}
            />

          </div>

        </div>

      </div>

    </AdminLayout>

  );

}


// =========================================================
// STAT CARD
// =========================================================

function StatCard({
  title,
  value,
  icon,
  iconClass,
  bgClass
}) {

  return (

    <div
      className={`${bgClass} rounded-2xl border border-slate-100 p-5 hover:shadow-md transition`}
    >

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-slate-600">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-slate-900 mt-2">
            {value}
          </h2>

        </div>


        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconClass}`}
        >

          {icon}

        </div>

      </div>

    </div>

  );

}


// =========================================================
// SECTION CARD
// =========================================================

function SectionCard({
  title,
  description,
  icon,
  children,
  className = ""
}) {

  return (

    <div
      className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-6 ${className}`}
    >

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-xl font-bold text-slate-800">
            {title}
          </h2>


          {description && (

            <p className="text-sm text-slate-500 mt-1">
              {description}
            </p>

          )}

        </div>


        <div className="w-10 h-10 rounded-xl bg-slate-50 text-blue-600 flex items-center justify-center">

          {icon}

        </div>

      </div>


      {children}

    </div>

  );

}


// =========================================================
// METRIC
// =========================================================

function Metric({
  title,
  value,
  className,
  icon
}) {

  return (

    <div className="bg-slate-50 rounded-xl p-4">

      <div className="flex items-center justify-between">

        <p className="text-sm text-slate-500">
          {title}
        </p>


        <span className={className}>
          {icon}
        </span>

      </div>


      <p
        className={`text-2xl font-bold mt-2 ${className}`}
      >
        {value}
      </p>

    </div>

  );

}


// =========================================================
// PROFILE ITEM
// =========================================================

function ProfileItem({
  icon,
  label,
  value
}) {

  return (

    <div className="bg-white/10 border border-white/10 rounded-xl px-4 py-3">

      <div className="flex items-center gap-2 text-blue-100 text-xs">

        {icon}

        <span>
          {label}
        </span>

      </div>


      <p className="font-semibold mt-1">
        {value}
      </p>

    </div>

  );

}


// =========================================================
// SUMMARY CARD
// =========================================================

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  className
}) {

  return (

    <div
      className={`rounded-2xl p-5 ${className}`}
    >

      <div className="w-11 h-11 rounded-xl bg-white/80 flex items-center justify-center">

        {icon}

      </div>


      <p className="text-sm text-slate-600 mt-4">
        {title}
      </p>


      <p className="text-3xl font-bold text-slate-900 mt-1">
        {value}
      </p>


      <p className="text-xs text-slate-500 mt-1">
        {subtitle}
      </p>

    </div>

  );

}


// =========================================================
// EMPTY STATE
// =========================================================

function EmptyState({
  icon,
  text
}) {

  return (

    <div className="text-center py-10">

      <div className="w-12 h-12 mx-auto rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center mb-3">

        {icon}

      </div>


      <p className="text-sm text-slate-500">
        {text}
      </p>

    </div>

  );

}


// =========================================================
// QUICK ACTION
// =========================================================

function QuickAction({
  title,
  description,
  icon
}) {

  return (

    <div className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition">

      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">

        {icon}

      </div>


      <h3 className="font-semibold mt-4">
        {title}
      </h3>


      <p className="text-sm text-slate-500 mt-1">
        {description}
      </p>

    </div>

  );

}


// =========================================================
// GRADE
// =========================================================

function getGrade(percentage) {

  if (percentage >= 90) {
    return "A+";
  }

  if (percentage >= 80) {
    return "A";
  }

  if (percentage >= 70) {
    return "B+";
  }

  if (percentage >= 60) {
    return "B";
  }

  if (percentage >= 50) {
    return "C";
  }

  if (percentage >= 33) {
    return "D";
  }

  return "F";

}


export default StudentDashboard;