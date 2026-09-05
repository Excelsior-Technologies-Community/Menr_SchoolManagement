import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { useContext } from "react";

import {
  AuthContext
} from "../context/AuthContext";


// =========================================================
// PUBLIC PAGES
// =========================================================

import Welcome from "../pages/Welcome/Welcome";
import Login from "../pages/Auth/Login";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";


// =========================================================
// MAIN
// =========================================================

import Dashboard from "../pages/Dashboard/Dashboard";
import Profile from "../pages/Profile/Profile";
import MyProfile from "../pages/StudentDashboard/MyProfile";
import MyResult from "../pages/StudentDashboard/MyResult";
import MyFees from "../pages/StudentDashboard/MyFees";
import MyAttendance from "../pages/StudentDashboard/MyAttendance";
import MyClass from "../pages/StudentDashboard/MyClass";
import MyClassmates from "../pages/StudentDashboard/MyClassmates";
import MySubjects from "../pages/StudentDashboard/MySubjects";
import MyTimetable from "../pages/StudentDashboard/MyTimetable";
import ChangePassword from "../pages/StudentDashboard/ChangePassword";


// =========================================================
// SCHOOL MANAGEMENT
// =========================================================

import Schools from "../pages/Schools/Schools";
import SchoolBranches from "../pages/SchoolBranches/SchoolBranches";
import SchoolClasses from "../pages/SchoolClasses/SchoolClasses";
import MasterMediumPage from "../pages/mediums/MasterMediumPage";
import SchoolMediumPage from "../pages/mediums/SchoolMediumPage";

import Batch from "../pages/Batch/Batch";
import AddBatch from "../pages/Batch/AddBatch";
import EditBatch from "../pages/Batch/EditBatch";
import ViewBatch from "../pages/Batch/ViewBatch";

import SchoolPeriod from "../pages/SchoolPeriod/SchoolPeriod";
import AddSchoolPeriod from "../pages/SchoolPeriod/AddSchoolPeriod";
import EditSchoolPeriod from "../pages/SchoolPeriod/EditSchoolPeriod";
import ViewSchoolPeriod from "../pages/SchoolPeriod/ViewSchoolPeriod";

import AcademicYears from "../pages/academicYears/AcademicYears";
import AcademicYearSessions from "../pages/academicYears/AcademicYearSessions";
import Branches from "../pages/branches/Branches";


// =========================================================
// STAFF / PEOPLE
// =========================================================

import Staff from "../pages/Staff/Staff";
import StaffType from "../pages/StaffType/StaffType";
import StaffDepartment from "../pages/StaffDepartment/StaffDepartment";
import Students from "../pages/Students/Students";


import StaffSchedule from "../pages/StaffSchedule/StaffSchedule";
import StaffAttendance from "../pages/StaffAttendance/StaffAttendance";
import LeaveRequest from "../pages/LeaveRequest/LeaveRequest";


// =========================================================
// ATTENDANCE
// =========================================================

import Attendance from "../pages/Attendance/Attendance";
import AttendanceStatus from "../pages/AttendanceStatus/AttendanceStatus";


// =========================================================
// FINANCE
// =========================================================

import Fees from "../pages/Fees/Fees";
import FeeStructure from "../pages/FeeStructure/FeeStructure";
import StudentFeeCollection from "../pages/StudentFeeCollection/StudentFeeCollection";
import FeeStructureComponents from "../pages/FeeStructureComponents/FeeStructureComponents";
import FeeInstallments from "../pages/FeeInstallments/FeeInstallments";
import FeeDiscounts from "../pages/FeeDiscounts/FeeDiscounts";
import FeeConcessions from "../pages/FeeConcessions/FeeConcessions";
import LibraryFinePayment from "../pages/LibraryFinePayment/LibraryFinePayment";
import AddLibraryFinePayment from "../pages/LibraryFinePayment/AddLibraryFinePayment";
import EditLibraryFinePayment from "../pages/LibraryFinePayment/EditLibraryFinePayment";
import ViewLibraryFinePayment from "../pages/LibraryFinePayment/ViewLibraryFinePayment";


// =========================================================
// ACADEMICS
// =========================================================

import Exams from "../pages/Exams/Exams";
import StudentMarks from "../pages/StudentMarks/StudentMarks";
import Timetable from "../pages/Timetable/Timetable";
import AddTimetable from "../pages/Timetable/AddTimetable";
import EditTimetable from "../pages/Timetable/EditTimetable";
import ViewTimetable from "../pages/Timetable/ViewTimetable";
import ReportCard from "../pages/ReportCard/ReportCard";
import Classes from "../pages/Classes/Classes";
import ClassSubjects from "../pages/ClassSubjects/ClassSubjects";
import TeacherSubjects from "../pages/TeacherSubject/TeacherSubjects";

import ExamTimetable from "../pages/ExamTimetable/ExamTimetable";
import AddExamTimetable from "../pages/ExamTimetable/AddExamTimetable";
import EditExamTimetable from "../pages/ExamTimetable/EditExamTimetable";
import ViewExamTimetable from "../pages/ExamTimetable/ViewExamTimetable";

import ExamEligibilitySettings from "../pages/ExamEligibility/ExamEligibilitySettings";
import ExamHalls from "../pages/ExamHalls/ExamHalls";
import ExamHallAllocation from "../pages/ExamHallAllocation/ExamHallAllocation";

import TimeTableSubstitution from "../pages/TimeTableSubstitution/TimeTableSubstitution";
import AddTimeTableSubstitution from "../pages/TimeTableSubstitution/AddTimeTableSubstitution";
import EditTimeTableSubstitution from "../pages/TimeTableSubstitution/EditTimeTableSubstitution";
import ViewTimeTableSubstitution from "../pages/TimeTableSubstitution/ViewTimeTableSubstitution";


// =========================================================
// TRANSFERS / OPERATIONS
// =========================================================

import SchoolTransfer from "../pages/SchoolTransfer/SchoolTransfer";
import BranchTransfer from "../pages/BranchTransfer/BranchTransfer";

import LostAndFound from "../pages/LostAndFound/LostAndFound";
import AddLostAndFound from "../pages/LostAndFound/AddLostAndFound";
import EditLostAndFound from "../pages/LostAndFound/EditLostAndFound";
import ViewLostAndFound from "../pages/LostAndFound/ViewLostAndFound";

import AdmissionInquiry from "../pages/admissionInquiry/AdmissionInquiry";
import AdmissionFollowUp from "../pages/admissionFollowUp/AdmissionFollowUp";
import Achievement from "../pages/achievement/Achievement";


// =========================================================
// EVENTS
// =========================================================

import Events from "../pages/events/Events";
import EventRegistrations from "../pages/EventRegistration/EventRegistrations";
import EventPayments from "../pages/EventPayments/EventPayments";


// =========================================================
// AI
// =========================================================

import AIAssistant from "../pages/AI/AIAssistant";


// =========================================================
// ANNOUNCEMENTS
// =========================================================

import Announcement from "../pages/Announcements/Announcement";


// =========================================================
// ROLE ROUTE
// =========================================================

const RoleRoute = ({
  children,
  allowedRoles
}) => {

  const {
    isAuthenticated,
    authLoading,
    role
  } = useContext(AuthContext);


  // Auth restore hone tak wait
  if (authLoading) {

    return (
      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-slate-100
      ">

        <div className="
          text-center
          text-slate-600
        ">

          <div className="
            w-10
            h-10
            border-4
            border-blue-200
            border-t-blue-600
            rounded-full
            animate-spin
            mx-auto
          " />

          <p className="mt-3 text-sm">
            Loading...
          </p>

        </div>

      </div>
    );

  }


  // Login required
  if (!isAuthenticated) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  // Role required
  if (
    allowedRoles &&
    !allowedRoles.includes(role)
  ) {

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );

  }


  return children;

};


// =========================================================
// APP ROUTES
// =========================================================

function AppRoutes() {

  return (

    <BrowserRouter>

      <Routes>


        {/* =================================================
            PUBLIC ROUTES
        ================================================= */}

        <Route
          path="/"
          element={
            <Welcome />
          }
        />

        <Route
          path="/login"
          element={
            <Login />
          }
        />

        <Route
          path="/forgot-password"
          element={
            <ForgotPassword />
          }
        />

        <Route
          path="/reset-password"
          element={
            <ResetPassword />
          }
        />


        {/* =================================================
            ALL AUTHENTICATED USERS
        ================================================= */}

        <Route
          path="/dashboard"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN",
                "STAFF",
                "STUDENT"
              ]}
            >
              <Dashboard />
            </RoleRoute>
          }
        />


// =========================================================
// STUDENT PORTAL
// =========================================================

<Route
  path="/student/profile"
  element={
    <RoleRoute
      allowedRoles={[
        "STUDENT"
      ]}
    >
      <MyProfile />
    </RoleRoute>
  }
/>

<Route
  path="/student/result"
  element={
    <RoleRoute
      allowedRoles={[
        "STUDENT"
      ]}
    >
      <MyResult />
    </RoleRoute>
  }
/>

<Route
  path="/student/fees"
  element={
    <RoleRoute
      allowedRoles={[
        "STUDENT"
      ]}
    >
      <MyFees />
    </RoleRoute>
  }
/>


// =========================================================
// STUDENT PORTAL - ADDITIONAL ROUTES
// =========================================================

<Route
  path="/student/class"
  element={
    <RoleRoute
      allowedRoles={[
        "STUDENT"
      ]}
    >
      <MyClass />
    </RoleRoute>
  }
/>

<Route
  path="/student/classmates"
  element={
    <RoleRoute
      allowedRoles={[
        "STUDENT"
      ]}
    >
      <MyClassmates />
    </RoleRoute>
  }
/>

<Route
  path="/student/subjects"
  element={
    <RoleRoute
      allowedRoles={[
        "STUDENT"
      ]}
    >
      <MySubjects />
    </RoleRoute>
  }
/>

<Route
  path="/student/timetable"
  element={
    <RoleRoute
      allowedRoles={[
        "STUDENT"
      ]}
    >
      <MyTimetable />
    </RoleRoute>
  }
/>

<Route
  path="/student/attendance"
  element={
    <RoleRoute
      allowedRoles={[
        "STUDENT"
      ]}
    >
      <MyAttendance />
    </RoleRoute>
  }
/>

<Route
  path="/student/change-password"
  element={
    <RoleRoute
      allowedRoles={[
        "STUDENT"
      ]}
    >
      <ChangePassword />
    </RoleRoute>
  }
/>


<Route
  path="/profile"
  element={
    <RoleRoute
      allowedRoles={[
        "SUPER_ADMIN",
        "SCHOOL_ADMIN",
        "STAFF",
        "STUDENT"
      ]}
    >
      <Profile />
    </RoleRoute>
  }
/>



        <Route
          path="/profile"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN",
                "STAFF",
                "STUDENT"
              ]}
            >
              <Profile />
            </RoleRoute>
          }
        />

        <Route
          path="/announcements"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN",
                "STAFF",
                "STUDENT"
              ]}
            >
              <Announcement />
            </RoleRoute>
          }
        />


        {/* =================================================
            SUPER ADMIN + SCHOOL ADMIN
        ================================================= */}

        <Route
          path="/schools"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN"
              ]}
            >
              <Schools />
            </RoleRoute>
          }
        />

        <Route
          path="/staff"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <Staff />
            </RoleRoute>
          }
        />

        <Route
          path="/staff-types"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN"
              ]}
            >
              <StaffType />
            </RoleRoute>
          }
        />

        <Route
          path="/departments"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN"
              ]}
            >
              <StaffDepartment />
            </RoleRoute>
          }
        />

        <Route
          path="/students"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <Students />
            </RoleRoute>
          }
        />


        {/* =================================================
            STAFF WORK
        ================================================= */}

        <Route
          path="/staff-schedules"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN",
                "STAFF"
              ]}
            >
              <StaffSchedule />
            </RoleRoute>
          }
        />

        <Route
          path="/staff-attendance"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN",
                "STAFF"
              ]}
            >
              <StaffAttendance />
            </RoleRoute>
          }
        />

        <Route
          path="/leave-requests"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN",
                "STAFF"
              ]}
            >
              <LeaveRequest />
            </RoleRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN",
                "STAFF"
              ]}
            >
              <Attendance />
            </RoleRoute>
          }
        />

        <Route
  path="/attendance-status"
  element={
    <RoleRoute
      allowedRoles={[
        "SUPER_ADMIN",
        "SCHOOL_ADMIN",
        "STAFF"
      ]}
    >
      <AttendanceStatus />
    </RoleRoute>
  }
/>


        {/* =================================================
            SCHOOL MANAGEMENT
        ================================================= */}

        <Route
          path="/school-branches"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <SchoolBranches />
            </RoleRoute>
          }
        />

        <Route
          path="/school-classes"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <SchoolClasses />
            </RoleRoute>
          }
        />

        <Route
          path="/school-periods"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <SchoolPeriod />
            </RoleRoute>
          }
        />

        <Route
          path="/school-periods/add"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <AddSchoolPeriod />
            </RoleRoute>
          }
        />

        <Route
          path="/school-periods/edit/:id"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <EditSchoolPeriod />
            </RoleRoute>
          }
        />

        <Route
          path="/school-periods/view/:id"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <ViewSchoolPeriod />
            </RoleRoute>
          }
        />

        <Route
          path="/master-mediums"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN"
              ]}
            >
              <MasterMediumPage />
            </RoleRoute>
          }
        />

        <Route
          path="/school-mediums"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <SchoolMediumPage />
            </RoleRoute>
          }
        />

        <Route
          path="/batches"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <Batch />
            </RoleRoute>
          }
        />

        <Route
          path="/batches/add"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <AddBatch />
            </RoleRoute>
          }
        />

        <Route
          path="/batches/edit/:id"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <EditBatch />
            </RoleRoute>
          }
        />

        <Route
          path="/batches/view/:id"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <ViewBatch />
            </RoleRoute>
          }
        />

        <Route
          path="/academic-years"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <AcademicYears />
            </RoleRoute>
          }
        />

        <Route
          path="/academic-year-sessions"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <AcademicYearSessions />
            </RoleRoute>
          }
        />

        <Route
          path="/branches"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN"
              ]}
            >
              <Branches />
            </RoleRoute>
          }
        />


        {/* =================================================
            ACADEMICS - ADMIN
        ================================================= */}

        <Route
          path="/classes"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <Classes />
            </RoleRoute>
          }
        />

        <Route
  path="/class-subjects"
  element={
    <RoleRoute
      allowedRoles={[
        "SUPER_ADMIN",
        "SCHOOL_ADMIN"
      ]}
    >
      <ClassSubjects />
    </RoleRoute>
  }
/>

<Route
  path="/teacher-subjects"
  element={
    <RoleRoute
      allowedRoles={[
        "SUPER_ADMIN",
        "SCHOOL_ADMIN"
      ]}
    >
      <TeacherSubjects />
    </RoleRoute>
  }
/>

        <Route
          path="/exams"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <Exams />
            </RoleRoute>
          }
        />

        <Route
          path="/student-marks"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <StudentMarks />
            </RoleRoute>
          }
        />

        <Route
          path="/report-card"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <ReportCard />
            </RoleRoute>
          }
        />

        <Route
          path="/timetable"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <Timetable />
            </RoleRoute>
          }
        />

        <Route
          path="/timetable/add"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <AddTimetable />
            </RoleRoute>
          }
        />

        <Route
          path="/timetable/edit/:id"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <EditTimetable />
            </RoleRoute>
          }
        />

        <Route
          path="/timetable/view/:id"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <ViewTimetable />
            </RoleRoute>
          }
        />


        {/* =================================================
            EXAM TIMETABLE
        ================================================= */}

        <Route
          path="/exam-timetable"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <ExamTimetable />
            </RoleRoute>
          }
        />

        <Route
          path="/exam-timetable/add"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <AddExamTimetable />
            </RoleRoute>
          }
        />

        <Route
          path="/exam-timetable/edit/:id"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <EditExamTimetable />
            </RoleRoute>
          }
        />

        <Route
          path="/exam-timetable/view/:id"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <ViewExamTimetable />
            </RoleRoute>
          }
        />


        {/* =================================================
            TIMETABLE SUBSTITUTION
        ================================================= */}

        <Route
          path="/timetable-substitutions"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <TimeTableSubstitution />
            </RoleRoute>
          }
        />

        <Route
          path="/timetable-substitutions/add"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <AddTimeTableSubstitution />
            </RoleRoute>
          }
        />

        <Route
          path="/timetable-substitutions/edit/:id"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <EditTimeTableSubstitution />
            </RoleRoute>
          }
        />

        <Route
          path="/timetable-substitutions/view/:id"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <ViewTimeTableSubstitution />
            </RoleRoute>
          }
        />

        <Route
  path="/exam-eligibility-settings"
  element={
    <RoleRoute
      allowedRoles={[
        "SUPER_ADMIN",
        "SCHOOL_ADMIN"
      ]}
    >
      <ExamEligibilitySettings />
    </RoleRoute>
  }
/>

<Route
  path="/exam-halls"
  element={
    <RoleRoute
      allowedRoles={[
        "SUPER_ADMIN",
        "SCHOOL_ADMIN"
      ]}
    >
      <ExamHalls />
    </RoleRoute>
  }
/>

<Route
  path="/exam-hall-allocation"
  element={
    <RoleRoute
      allowedRoles={[
        "SUPER_ADMIN",
        "SCHOOL_ADMIN"
      ]}
    >
      <ExamHallAllocation />
    </RoleRoute>
  }
/>


        {/* =================================================
            FINANCE - ADMIN
        ================================================= */}

        <Route
          path="/fees"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <Fees />
            </RoleRoute>
          }
        />

        <Route
          path="/fee-structure"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <FeeStructure />
            </RoleRoute>
          }
        />

        <Route
          path="/fee-structure-components"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <FeeStructureComponents />
            </RoleRoute>
          }
        />

        <Route
          path="/fee-installments"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <FeeInstallments />
            </RoleRoute>
          }
        />

        <Route
          path="/fee-discounts"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <FeeDiscounts />
            </RoleRoute>
          }
        />

        <Route
          path="/fee-concessions"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <FeeConcessions />
            </RoleRoute>
          }
        />

        <Route
          path="/student-fees"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <StudentFeeCollection />
            </RoleRoute>
          }
        />

        <Route
          path="/library-fine-payments"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <LibraryFinePayment />
            </RoleRoute>
          }
        />

        <Route
          path="/library-fine-payments/add"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <AddLibraryFinePayment />
            </RoleRoute>
          }
        />

        <Route
          path="/library-fine-payments/edit/:id"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <EditLibraryFinePayment />
            </RoleRoute>
          }
        />

        <Route
          path="/library-fine-payments/view/:id"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <ViewLibraryFinePayment />
            </RoleRoute>
          }
        />


        {/* =================================================
            OPERATIONS - ADMIN
        ================================================= */}

        <Route
          path="/admission-inquiry"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <AdmissionInquiry />
            </RoleRoute>
          }
        />

        <Route
          path="/admission-follow-up"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <AdmissionFollowUp />
            </RoleRoute>
          }
        />

        <Route
          path="/achievement"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <Achievement />
            </RoleRoute>
          }
        />

        <Route
          path="/lost-and-found"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <LostAndFound />
            </RoleRoute>
          }
        />

        <Route
          path="/lost-and-found/add"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <AddLostAndFound />
            </RoleRoute>
          }
        />

        <Route
          path="/lost-and-found/edit/:id"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <EditLostAndFound />
            </RoleRoute>
          }
        />

        <Route
          path="/lost-and-found/view/:id"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <ViewLostAndFound />
            </RoleRoute>
          }
        />

        <Route
          path="/school-transfers"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <SchoolTransfer />
            </RoleRoute>
          }
        />

        <Route
          path="/branch-transfers"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN"
              ]}
            >
              <BranchTransfer />
            </RoleRoute>
          }
        />


        {/* =================================================
            EVENTS - ADMIN
        ================================================= */}

        <Route
          path="/events"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <Events />
            </RoleRoute>
          }
        />

        <Route
          path="/event-registrations"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <EventRegistrations />
            </RoleRoute>
          }
        />

        <Route
          path="/event-payments"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <EventPayments />
            </RoleRoute>
          }
        />


        {/* =================================================
            AI - ADMIN ONLY
        ================================================= */}

        <Route
          path="/ai"
          element={
            <RoleRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "SCHOOL_ADMIN"
              ]}
            >
              <AIAssistant />
            </RoleRoute>
          }
        />


        {/* =================================================
            FALLBACK
        ================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>

  );

}


export default AppRoutes;