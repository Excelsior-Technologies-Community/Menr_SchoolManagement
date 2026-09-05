const express = require("express");

const cors = require("cors");

const path = require("path");

const app = express();

app.use(cors());

app.use(express.json());

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);


// =========================================================
// ROUTES
// =========================================================

const authRoutes = require("./src/routes/authRoutes");

const schoolRoutes = require("./src/routes/schoolRoutes");

const classRoutes = require("./src/routes/classRoutes");

const schoolBranchRoutes = require(
  "./src/routes/schoolBranchRoutes"
);

const schoolClassRoutes = require(
  "./src/routes/schoolClassRoutes"
);

const masterMediumRoutes = require(
  "./src/routes/masterMediumRoutes"
);

const schoolMediumRoutes = require(
  "./src/routes/schoolMediumRoutes"
);

const sectionRoutes = require(
  "./src/routes/sectionRoutes"
);

const subjectRoutes = require(
  "./src/routes/subjectRoutes"
);

const classSubjectRoutes = require(
  "./src/routes/classSubjectRoutes"
);

const teacherSubjectRoutes = require(
  "./src/routes/teacherSubjectRoutes"
);

const staffRoutes = require(
  "./src/routes/staffRoutes"
);

const staffTypeRoutes = require(
  "./src/routes/staffTypeRoutes"
);

const staffDepartmentRoutes = require(
  "./src/routes/staffDepartmentRoutes"
);

const studentRoutes = require(
  "./src/routes/studentRoutes"
);

const timetableRoutes = require(
  "./src/routes/timetableRoutes"
);

const attendanceRoutes = require(
  "./src/routes/attendanceRoutes"
);

const attendanceV2Routes = require(
  "./src/routes/attendanceV2Routes"
);

const feeRoutes = require(
  "./src/routes/feeRoutes"
);

const feeStructureRoutes = require(
  "./src/routes/feeStructureRoutes"
);

const feeStructureComponentRoutes = require(
  "./src/routes/feeStructureComponentRoutes"
);

const feeInstallmentRoutes = require(
  "./src/routes/feeInstallmentRoutes"
);

const feeDiscountRoutes = require(
  "./src/routes/feeDiscountRoutes"
);

const feeConcessionRoutes = require(
  "./src/routes/feeConcessionRoutes"
);

const studentFeeRoutes = require(
  "./src/routes/studentFeeRoutes"
);

const eventRoutes = require(
  "./src/routes/eventRoutes"
);

const eventRegistrationRoutes = require(
  "./src/routes/eventRegistrationRoutes"
);

const libraryFinePaymentRoutes = require(
  "./src/routes/libraryFinePaymentRoutes"
);

const lostAndFoundRoutes = require(
  "./src/routes/lostAndFoundRoutes"
);


// =========================================================
// EXAM ROUTES
// =========================================================

const examRoutes = require(
  "./src/routes/examRoutes"
);

const examTimetableRoutes = require(
  "./src/routes/examTimetableRoutes"
);

const examEligibilityRoutes = require(
  "./src/routes/examEligibilityRoutes"
);

const examHallRoutes = require(
  "./src/routes/examHallRoutes"
);

const examHallAllocationRoutes = require(
  "./src/routes/examHallAllocationRoutes"
);

const examHallSupervisorRoutes = require(
  "./src/routes/examHallSupervisorRoutes"
);

const studentMarkRoutes = require(
  "./src/routes/studentMarkRoutes"
);


const dashboardRoutes = require(
  "./src/routes/dashboardRoutes"
);

const profileRoutes = require(
  "./src/routes/profileRoutes"
);

const aiRoutes = require(
  "./src/routes/aiRoutes"
);

const reportCardRoutes = require(
  "./src/routes/reportCardRoutes"
);


// =========================================================
// MIDDLEWARE
// =========================================================

const errorHandler = require(
  "./src/middlewares/errorHandler"
);


// =========================================================
// ACADEMIC YEAR
// =========================================================

const academicYearRoutes = require(
  "./src/routes/academicYearRoutes"
);


// =========================================================
// BATCH
// =========================================================

const batchRoutes = require(
  "./src/routes/batchRoutes"
);


// =========================================================
// SCHOOL PERIOD
// =========================================================

const schoolPeriodRoutes = require(
  "./src/routes/schoolPeriodRoutes"
);


// =========================================================
// TIME TABLE V2
// =========================================================

const timeTableV2Routes = require(
  "./src/routes/timeTableV2Routes"
);


// =========================================================
// TIME TABLE SUBSTITUTION
// =========================================================

const timeTableSubstitutionRoutes = require(
  "./src/routes/timeTableSubstitutionRoutes"
);


// =========================================================
// SCHOOL TRANSFER
// =========================================================

const schoolTransferRoutes = require(
  "./src/routes/schoolTransferRoutes"
);

const branchTransferRoutes = require(
  "./src/routes/branchTransferRoutes"
);


const admissionInquiryRoutes = require(
  "./src/routes/admissionInquiryRoutes"
);

const achievementRoutes = require(
  "./src/routes/achievementRoutes"
);

const eventPaymentRoutes = require(
  "./src/routes/eventPaymentRoutes"
);

const admissionFollowUpRoutes = require(
  "./src/routes/admissionFollowUpRoutes"
);

const branchRoutes = require(
  "./src/routes/branchRoutes"
);

const academicYearSessionRoutes = require(
  "./src/routes/academicYearSessionRoutes"
);

const staffScheduleRoutes = require(
  "./src/routes/staffScheduleRoutes"
);

const staffAttendanceRoutes = require(
  "./src/routes/staffAttendanceRoutes"
);

const leaveRequestRoutes = require(
  "./src/routes/leaveRequestRoutes"
);

const announcementRoutes =
  require("./src/routes/announcementRoutes");


// =========================================================
// HEALTH CHECK
// =========================================================

app.get("/", (req, res) => {

  res.status(200).json({

    success: true,

    message: "API Running Successfully",

  });

});


// =========================================================
// AUTHENTICATION
// =========================================================

app.use(
  "/api/auth",
  authRoutes
);


// =========================================================
// SCHOOL MANAGEMENT
// =========================================================

app.use(
  "/api/schools",
  schoolRoutes
);

app.use(
  "/api/school-branches",
  schoolBranchRoutes
);


// =========================================================
// ACADEMIC STRUCTURE
// =========================================================

app.use(
  "/api/classes",
  classRoutes
);

app.use(
  "/api/school-classes",
  schoolClassRoutes
);

app.use(
  "/api/sections",
  sectionRoutes
);

app.use(
  "/api/subjects",
  subjectRoutes
);

app.use(
  "/api/class-subjects",
  classSubjectRoutes
);

app.use(
  "/api/teacher-subjects",
  teacherSubjectRoutes
);


// =========================================================
// STAFF
// =========================================================

app.use(
  "/api/staff",
  staffRoutes
);

app.use(
  "/api/staff-types",
  staffTypeRoutes
);

app.use(
  "/api/staff-departments",
  staffDepartmentRoutes
);

app.use(
  "/api/staff-schedules",
  staffScheduleRoutes
);

app.use(
  "/api/staff-attendance",
  staffAttendanceRoutes
);

app.use(
  "/api/leave-requests",
  leaveRequestRoutes
);


// =========================================================
// STUDENTS
// =========================================================

app.use(
  "/api/students",
  studentRoutes
);


// =========================================================
// SCHOOL TRANSFERS
// =========================================================

app.use(
  "/api/school-transfers",
  schoolTransferRoutes
);

app.use(
  "/api/branch-transfers",
  branchTransferRoutes
);


// =========================================================
// ATTENDANCE
// =========================================================

app.use(
  "/api/attendance",
  attendanceRoutes
);

app.use(
  "/api/attendance-v2",
  attendanceV2Routes
);


// =========================================================
// FEES
// =========================================================

app.use(
  "/api/fees",
  feeRoutes
);

app.use(
  "/api/fee-structures",
  feeStructureRoutes
);

app.use(
  "/api/fee-structure-components",
  feeStructureComponentRoutes
);

app.use(
  "/api/fee-installments",
  feeInstallmentRoutes
);

app.use(
  "/api/student-fees",
  studentFeeRoutes
);

app.use(
  "/api/fee-discounts",
  feeDiscountRoutes
);

app.use(
  "/api/fee-concessions",
  feeConcessionRoutes
);

app.use(
  "/api/library-fine-payments",
  libraryFinePaymentRoutes
);

app.use(
  "/api/lost-and-found",
  lostAndFoundRoutes
);


// =========================================================
// EXAMS
// =========================================================

// Exam Master
app.use(
  "/api/exams",
  examRoutes
);


// Student Marks
app.use(
  "/api/student-marks",
  studentMarkRoutes
);


// Exam Timetable
app.use(
  "/api/exam-timetable",
  examTimetableRoutes
);


// Exam Eligibility Settings
app.use(
  "/api/exam-eligibility",
  examEligibilityRoutes
);


// Exam Halls
app.use(
  "/api/exam-halls",
  examHallRoutes
);


// Exam Hall Allocation
app.use(
  "/api/exam-hall-allocations",
  examHallAllocationRoutes
);


// Exam Hall Supervisors
app.use(
  "/api/exam-hall-supervisors",
  examHallSupervisorRoutes
);


// =========================================================
// EVENTS
// =========================================================

app.use(
  "/api/events",
  eventRoutes
);

app.use(
  "/api/event-registrations",
  eventRegistrationRoutes
);

app.use(
  "/api/event-payments",
  eventPaymentRoutes
);


// =========================================================
// ACADEMIC YEAR SESSIONS
// =========================================================

app.use(
  "/api/academic-year-sessions",
  academicYearSessionRoutes
);


// =========================================================
// REPORT CARDS
// =========================================================

app.use(
  "/api/report-cards",
  reportCardRoutes
);


// =========================================================
// TIMETABLE
// =========================================================

app.use(
  "/api/timetables",
  timetableRoutes
);

app.use(
  "/api/master-mediums",
  masterMediumRoutes
);

app.use(
  "/api/school-mediums",
  schoolMediumRoutes
);


// =========================================================
// ACADEMIC YEARS
// =========================================================

app.use(
  "/api/academic-years",
  academicYearRoutes
);


// =========================================================
// BATCHES
// =========================================================

app.use(
  "/api/batches",
  batchRoutes
);


// =========================================================
// SCHOOL PERIODS
// =========================================================

app.use(
  "/api/school-periods",
  schoolPeriodRoutes
);


// =========================================================
// TIMETABLE V2
// =========================================================

app.use(
  "/api/timetable-v2",
  timeTableV2Routes
);


// =========================================================
// TIMETABLE SUBSTITUTIONS
// =========================================================

app.use(
  "/api/timetable-substitutions",
  timeTableSubstitutionRoutes
);


// =========================================================
// DASHBOARD
// =========================================================

app.use(
  "/api/dashboard",
  dashboardRoutes
);


// =========================================================
// BRANCHES
// =========================================================

app.use(
  "/api/branches",
  branchRoutes
);


// =========================================================
// PROFILE
// =========================================================

app.use(
  "/api/profile",
  profileRoutes
);


// =========================================================
// ADMISSION INQUIRIES
// =========================================================

app.use(
  "/api/admission-inquiries",
  admissionInquiryRoutes
);


// =========================================================
// ACHIEVEMENTS
// =========================================================

app.use(
  "/api/achievements",
  achievementRoutes
);


// =========================================================
// ANNOUNCEMENTS
// =========================================================

app.use(
  "/api/announcements",
  announcementRoutes
);


// =========================================================
// ADMISSION FOLLOW UPS
// =========================================================

app.use(
  "/api/admission-follow-ups",
  admissionFollowUpRoutes
);


// =========================================================
// AI
// =========================================================

app.use(
  "/api/ai",
  aiRoutes
);


// =========================================================
// ERROR HANDLER
// ALWAYS LAST
// =========================================================

app.use(errorHandler);


// =========================================================
// EXPORT
// =========================================================

module.exports = app;