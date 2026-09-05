import {
  useEffect,
  useState
} from "react";
import {
  LayoutDashboard,
  School,
  Users,
  UserCheck,
  CreditCard,
  Bot,
  User,
  LogOut,
  ClipboardCheck,
  Building2,
  Menu,
  X,
  Moon,
  Sun,
  BookOpen,
  CalendarDays,
  FileText,
  Clock3,
  Languages,
  Package,
  ChevronDown,
  GraduationCap,
  Library,
  Wallet,
Award,
LockKeyhole,
Bell,
BadgePercent,
CalendarHeart
} from "lucide-react";

import {
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";


function Sidebar() {

  const navigate = useNavigate();
  const location = useLocation();


  // =========================================================
  // ROLE
  // =========================================================

  const role =
    localStorage.getItem("role");


  const isSuperAdmin =
    role === "SUPER_ADMIN";

  const isSchoolAdmin =
    role === "SCHOOL_ADMIN";

  const isStaff =
    role === "STAFF";

  const isStudent =
    role === "STUDENT";

  const isAdmin =
    isSuperAdmin ||
    isSchoolAdmin;


  const displayRole =
    role
      ? role
          .replace(/_/g, " ")
      : "USER";


  // =========================================================
  // SIDEBAR STATE
  // =========================================================

  const [
    isOpen,
    setIsOpen
  ] = useState(false);


  const [
    darkMode,
    setDarkMode
  ] = useState(
    localStorage.getItem("theme") === "dark"
  );


  const [
    openMenu,
    setOpenMenu
  ] = useState("");


  // =========================================================
  // DARK MODE
  // =========================================================

  useEffect(() => {

    const html =
      document.documentElement;


    if (darkMode) {

      html.classList.add("dark");

    } else {

      html.classList.remove("dark");

    }


    localStorage.setItem(
      "theme",
      darkMode
        ? "dark"
        : "light"
    );

  }, [darkMode]);


  // =========================================================
  // AUTO OPEN ACTIVE MENU
  // =========================================================

  useEffect(() => {

    const path =
      location.pathname;


    // School Management
    if (
      path.startsWith("/schools") ||
      path.startsWith("/school-branches") ||
      path.startsWith("/batches") ||
      path.startsWith("/school-periods") ||
      path.startsWith("/school-classes") ||
      path.startsWith("/master-mediums") ||
      path.startsWith("/school-mediums") ||
      path.startsWith("/academic-years") ||
      path.startsWith("/academic-year-sessions") ||
      path.startsWith("/branches")
    ) {

      setOpenMenu("school");

      return;
    }


    // People
    if (
      path.startsWith("/staff") ||
      path.startsWith("/staff-types") ||
      path.startsWith("/departments") ||
      path.startsWith("/students")
    ) {

      setOpenMenu("people");

      return;
    }


    // Academics
    if (
      path.startsWith("/classes") ||
       path.startsWith("/class-subjects") ||
       path.startsWith("/teacher-subjects") ||
      path.startsWith("/exams") ||
      path.startsWith("/student-marks") ||
      path.startsWith("/exam-timetable") ||
      path.startsWith("/report-card") ||
      path.startsWith("/exam-eligibility-settings") ||
path.startsWith("/exam-halls") ||
path.startsWith("/exam-hall-allocation") ||
      path === "/timetable" ||
      path.startsWith("/timetable/") ||
      path.startsWith("/timetable-substitutions")
    ) {

      setOpenMenu("academics");

      return;
    }


    // Finance
    if (
      path.startsWith("/fees") ||
      path.startsWith("/fee-structure") ||
      path.startsWith("/fee-structure-components") ||
      path.startsWith("/fee-installments") ||
      path.startsWith("/fee-discounts") ||
      path.startsWith("/fee-concessions") ||
      path.startsWith("/student-fees") ||
      path.startsWith("/library-fine-payments")
    ) {

      setOpenMenu("finance");

      return;
    }


    // Events
    if (
      path.startsWith("/events") ||
      path.startsWith("/event-registrations") ||
      path.startsWith("/event-payments")
    ) {

      setOpenMenu("events");

      return;
    }


    // Operations
    if (
      path.startsWith("/attendance") ||
      path.startsWith("/admission-inquiry") ||
      path.startsWith("/achievement") ||
      path.startsWith("/lost-and-found") ||
      path.startsWith("/school-transfers") ||
      path.startsWith("/branch-transfers")
    ) {

      setOpenMenu("operations");

      return;
    }


    // AI
    if (
      path.startsWith("/ai")
    ) {

      setOpenMenu("ai");

      return;
    }


    // Account
    if (
      path.startsWith("/profile")
    ) {

      setOpenMenu("account");

      return;
    }

  }, [
    location.pathname
  ]);


  // =========================================================
  // TOGGLE MENU
  // =========================================================

  const toggleMenu = (
    menu
  ) => {

    setOpenMenu(
      openMenu === menu
        ? ""
        : menu
    );

  };


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "role"
    );

    localStorage.removeItem(
      "schoolId"
    );

    localStorage.removeItem(
      "user"
    );

    navigate(
      "/login",
      {
        replace: true
      }
    );

  };


  // =========================================================
  // ACTIVE LINK
  // =========================================================

  const isActive = (
    path
  ) => {

    return location.pathname === path;

  };


  const linkClass = (
    path
  ) => `
    flex
    items-center
    gap-3
    px-3
    py-2.5
    rounded-xl
    text-sm
    transition-all
    duration-200
    ${
      isActive(path)
        ? "bg-blue-600 text-white shadow-sm"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }
  `;


  // =========================================================
  // MENU BUTTON
  // =========================================================

  const menuButtonClass = (
    menu
  ) => `
    flex
    items-center
    justify-between
    w-full
    px-3
    py-2.5
    rounded-xl
    text-sm
    transition-all
    duration-200
    ${
      openMenu === menu
        ? "bg-slate-800 text-white"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }
  `;


  // =========================================================
  // SUB LINK
  // =========================================================

  const subLinkClass = (
    path
  ) => `
    flex
    items-center
    gap-3
    px-3
    py-2
    ml-3
    rounded-lg
    text-sm
    transition-all
    duration-200
    ${
      isActive(path)
        ? "bg-blue-600 text-white"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }
  `;


  // =========================================================
  // CLOSE MOBILE
  // =========================================================

  const closeMobile = () => {

    setIsOpen(false);

  };


  // =========================================================
  // SECTION TITLE
  // =========================================================

  const SectionTitle = ({
    children
  }) => (

    <div className="
      px-3
      pt-5
      pb-2
    ">

      <p className="
        text-[10px]
        font-semibold
        uppercase
        tracking-wider
        text-slate-500
      ">
        {children}
      </p>

    </div>

  );


  return (

    <>

      {/* =====================================================
          MOBILE HEADER
      ===================================================== */}

      <div className="
        md:hidden
        fixed
        top-0
        left-0
        right-0
        z-40
        flex
        items-center
        justify-between
        px-4
        py-3
        bg-slate-950
        text-white
        shadow-lg
      ">

        <button
          onClick={() =>
            setIsOpen(!isOpen)
          }
          className="
            p-2
            rounded-lg
            hover:bg-slate-800
          "
        >

          {isOpen ? (
            <X size={25} />
          ) : (
            <Menu size={25} />
          )}

        </button>


        <div className="
          flex
          items-center
          gap-2
        ">

          <span className="text-xl">
            🎓
          </span>

          <span className="font-bold">
            SchoolMS
          </span>

        </div>


        <button
          onClick={() =>
            setDarkMode(!darkMode)
          }
          className="
            p-2
            rounded-lg
            hover:bg-slate-800
          "
        >

          {darkMode ? (
            <Sun size={21} />
          ) : (
            <Moon size={21} />
          )}

        </button>

      </div>


      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {isOpen && (

        <div
          className="
            fixed
            inset-0
            bg-black/50
            z-40
            md:hidden
          "
          onClick={closeMobile}
        />

      )}


      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`
          fixed
          top-0
          left-0
          z-50
          h-screen
          w-72
          bg-slate-950
          text-white
          shadow-2xl
          flex
          flex-col
          transition-transform
          duration-300

          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="
          flex-shrink-0
          px-5
          py-5
          border-b
          border-slate-800
        ">

          <div className="
            flex
            items-center
            gap-3
          ">

            <div className="
              w-11
              h-11
              rounded-xl
              bg-blue-600
              flex
              items-center
              justify-center
              text-xl
              shadow-lg
            ">
              🎓
            </div>


            <div>

              <h2 className="
                text-lg
                font-bold
              ">
                SchoolMS
              </h2>

              <p className="
                text-[11px]
                text-slate-400
                mt-0.5
              ">
                School Management System
              </p>

            </div>

          </div>


          {/* ROLE */}

          <div className="
            mt-4
            flex
            items-center
            justify-between
          ">

            <div className="
              px-3
              py-1.5
              rounded-lg
              bg-slate-900
              border
              border-slate-800
            ">

              <p className="
                text-[10px]
                text-slate-500
                uppercase
              ">
                Logged in as
              </p>


              <p className="
                text-xs
                font-semibold
                text-blue-400
                mt-0.5
              ">
                {displayRole}
              </p>

            </div>


            <button
              onClick={() =>
                setDarkMode(!darkMode)
              }
              className="
                p-2
                rounded-lg
                bg-slate-800
                hover:bg-slate-700
                transition
              "
              title="Toggle Theme"
            >

              {darkMode ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}

            </button>

          </div>

        </div>


        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="
          flex-1
          overflow-y-auto
          px-3
          py-3
          scrollbar-thin
          scrollbar-thumb-slate-700
        ">


          {/* =================================================
              MAIN
          ================================================= */}

          <SectionTitle>
            Main
          </SectionTitle>


          <Link
            to="/dashboard"
            className={
              linkClass("/dashboard")
            }
            onClick={closeMobile}
          >

            <LayoutDashboard
              size={19}
            />

            <span>
              Dashboard
            </span>

          </Link>


          {/* =================================================
              COMMUNICATION
          ================================================= */}

          <SectionTitle>
            Communication
          </SectionTitle>


          <Link
            to="/announcements"
            className={
              linkClass(
                "/announcements"
              )
            }
            onClick={closeMobile}
          >

            <Bell size={19} />

            <span>
              Announcements
            </span>

          </Link>


          {/* =================================================
              MANAGEMENT - ADMIN ONLY
          ================================================= */}

          {isAdmin && (

            <>

              <SectionTitle>
                Management
              </SectionTitle>


              {/* SCHOOL MANAGEMENT */}

              <button
                onClick={() =>
                  toggleMenu("school")
                }
                className={
                  menuButtonClass(
                    "school"
                  )
                }
              >

                <div className="
                  flex
                  items-center
                  gap-3
                ">

                  <School size={19} />

                  <span>
                    School Management
                  </span>

                </div>


                <ChevronDown
                  size={17}
                  className={`
                    transition-transform
                    ${
                      openMenu === "school"
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />

              </button>


              {openMenu === "school" && (

                <div className="
                  mt-1
                  space-y-1
                ">


                  {isSuperAdmin && (

                    <Link
                      to="/schools"
                      className={
                        subLinkClass(
                          "/schools"
                        )
                      }
                      onClick={
                        closeMobile
                      }
                    >

                      <School size={16} />

                      Schools

                    </Link>

                  )}


                  <Link
                    to="/school-branches"
                    className={
                      subLinkClass(
                        "/school-branches"
                      )
                    }
                    onClick={
                      closeMobile
                    }
                  >

                    <Building2 size={16} />

                    School Branches

                  </Link>


                  <Link
                    to="/batches"
                    className={
                      subLinkClass(
                        "/batches"
                      )
                    }
                    onClick={
                      closeMobile
                    }
                  >

                    <BookOpen size={16} />

                    Batches

                  </Link>


                  <Link
                    to="/school-classes"
                    className={
                      subLinkClass(
                        "/school-classes"
                      )
                    }
                    onClick={
                      closeMobile
                    }
                  >

                    <GraduationCap
                      size={16}
                    />

                    School Classes

                  </Link>


                  <Link
                    to="/school-periods"
                    className={
                      subLinkClass(
                        "/school-periods"
                      )
                    }
                    onClick={
                      closeMobile
                    }
                  >

                    <Clock3 size={16} />

                    School Periods

                  </Link>


                  {isSuperAdmin && (

                    <Link
                      to="/master-mediums"
                      className={
                        subLinkClass(
                          "/master-mediums"
                        )
                      }
                      onClick={
                        closeMobile
                      }
                    >

                      <Languages
                        size={16}
                      />

                      Master Mediums

                    </Link>

                  )}


                  <Link
                    to="/school-mediums"
                    className={
                      subLinkClass(
                        "/school-mediums"
                      )
                    }
                    onClick={
                      closeMobile
                    }
                  >

                    <Languages
                      size={16}
                    />

                    School Mediums

                  </Link>


                  <Link
                    to="/academic-years"
                    className={
                      subLinkClass(
                        "/academic-years"
                      )
                    }
                    onClick={
                      closeMobile
                    }
                  >

                    <CalendarDays
                      size={16}
                    />

                    Academic Years

                  </Link>


                  <Link
                    to="/academic-year-sessions"
                    className={
                      subLinkClass(
                        "/academic-year-sessions"
                      )
                    }
                    onClick={
                      closeMobile
                    }
                  >

                    <CalendarDays
                      size={16}
                    />

                    Academic Sessions

                  </Link>


                  {isSuperAdmin && (

                    <Link
                      to="/branches"
                      className={
                        subLinkClass(
                          "/branches"
                        )
                      }
                      onClick={
                        closeMobile
                      }
                    >

                      <Building2
                        size={16}
                      />

                      Branch Master

                    </Link>

                  )}

                </div>

              )}


              {/* PEOPLE */}

              <button
                onClick={() =>
                  toggleMenu("people")
                }
                className={`
                  mt-2
                  ${
                    menuButtonClass(
                      "people"
                    )
                  }
                `}
              >

                <div className="
                  flex
                  items-center
                  gap-3
                ">

                  <Users size={19} />

                  <span>
                    People
                  </span>

                </div>


                <ChevronDown
                  size={17}
                  className={
                    openMenu === "people"
                      ? "rotate-180 transition-transform"
                      : "transition-transform"
                  }
                />

              </button>


              {openMenu === "people" && (

                <div className="
                  mt-1
                  space-y-1
                ">


                  <Link
                    to="/staff"
                    className={
                      subLinkClass(
                        "/staff"
                      )
                    }
                    onClick={
                      closeMobile
                    }
                  >

                    <Users size={16} />

                    Staff

                  </Link>


                  {isSuperAdmin && (

                    <>

                      <Link
                        to="/staff-types"
                        className={
                          subLinkClass(
                            "/staff-types"
                          )
                        }
                        onClick={
                          closeMobile
                        }
                      >

                        <Users size={16} />

                        Staff Types

                      </Link>


                      <Link
                        to="/departments"
                        className={
                          subLinkClass(
                            "/departments"
                          )
                        }
                        onClick={
                          closeMobile
                        }
                      >

                        <Building2
                          size={16}
                        />

                        Departments

                      </Link>

                    </>

                  )}


                  <Link
                    to="/students"
                    className={
                      subLinkClass(
                        "/students"
                      )
                    }
                    onClick={
                      closeMobile
                    }
                  >

                    <UserCheck
                      size={16}
                    />

                    Students

                  </Link>

                </div>

              )}


              {/* =================================================
                  ACADEMICS
              ================================================= */}

              <button
                onClick={() =>
                  toggleMenu("academics")
                }
                className={`
                  mt-2
                  ${
                    menuButtonClass(
                      "academics"
                    )
                  }
                `}
              >

                <div className="
                  flex
                  items-center
                  gap-3
                ">

                  <GraduationCap
                    size={19}
                  />

                  <span>
                    Academics
                  </span>

                </div>


                <ChevronDown
                  size={17}
                  className={
                    openMenu === "academics"
                      ? "rotate-180 transition-transform"
                      : "transition-transform"
                  }
                />

              </button>


              {openMenu === "academics" && (

                <div className="
                  mt-1
                  space-y-1
                ">


                  <Link
                    to="/classes"
                    className={
                      subLinkClass(
                        "/classes"
                      )
                    }
                    onClick={
                      closeMobile
                    }
                  >

                    <BookOpen size={16} />

                    Classes

                  </Link>

                  <Link
  to="/class-subjects"
  className={
    subLinkClass(
      "/class-subjects"
    )
  }
  onClick={
    closeMobile
  }
>

  <BookOpen size={16} />

  Class Subjects

</Link>

<Link
  to="/teacher-subjects"
  className={
    subLinkClass(
      "/teacher-subjects"
    )
  }
  onClick={
    closeMobile
  }
>

  <BookOpen size={16} />

  Teacher Subjects

</Link>


                  <Link
                    to="/exams"
                    className={
                      subLinkClass(
                        "/exams"
                      )
                    }
                    onClick={
                      closeMobile
                    }
                  >

                    <FileText size={16} />

                    Exams

                  </Link>


                  <Link
                    to="/student-marks"
                    className={
                      subLinkClass(
                        "/student-marks"
                      )
                    }
                    onClick={
                      closeMobile
                    }
                  >

                    <FileText size={16} />

                    Student Marks

                  </Link>


                  <Link
                    to="/exam-timetable"
                    className={
                      subLinkClass(
                        "/exam-timetable"
                      )
                    }
                    onClick={
                      closeMobile
                    }
                  >

                    <CalendarDays
                      size={16}
                    />

                    Exam Timetable

                  </Link>


                                    <Link
                    to="/exam-eligibility-settings"
                    className={
                      subLinkClass(
                        "/exam-eligibility-settings"
                      )
                    }
                    onClick={
                      closeMobile
                    }
                  >

                    <ClipboardCheck
                      size={16}
                    />

                    Exam Eligibility Settings

                  </Link>


                  <Link
                    to="/exam-halls"
                    className={
                      subLinkClass(
                        "/exam-halls"
                      )
                    }
                    onClick={
                      closeMobile
                    }
                  >

                    <Building2
                      size={16}
                    />

                    Exam Halls

                  </Link>


                  <Link
                    to="/exam-hall-allocation"
                    className={
                      subLinkClass(
                        "/exam-hall-allocation"
                      )
                    }
                    onClick={
                      closeMobile
                    }
                  >

                    <ClipboardCheck
                      size={16}
                    />

                    Exam Hall Allocation

                  </Link>


                  <Link
                    to="/report-card"
                    className={
                      subLinkClass(
                        "/report-card"
                      )
                    }
                    onClick={
                      closeMobile
                    }
                  >

                    <FileText size={16} />

                    Report Card

                  </Link>


                  <Link
                    to="/timetable"
                    className={
                      subLinkClass(
                        "/timetable"
                      )
                    }
                    onClick={
                      closeMobile
                    }
                  >

                    <Clock3 size={16} />

                    Timetable

                  </Link>


                  <Link
                    to="/timetable-substitutions"
                    className={
                      subLinkClass(
                        "/timetable-substitutions"
                      )
                    }
                    onClick={
                      closeMobile
                    }
                  >

                    <Clock3 size={16} />

                    Timetable Substitution

                  </Link>

                </div>

              )}

            </>

          )}


          {/* =================================================
              STAFF - MY WORK
          ================================================= */}

          {isStaff && (

            <>

              <SectionTitle>
                My Work
              </SectionTitle>


              <Link
                to="/staff-schedules"
                className={
                  linkClass(
                    "/staff-schedules"
                  )
                }
                onClick={
                  closeMobile
                }
              >

                <Clock3 size={19} />

                <span>
                  My Schedule
                </span>

              </Link>


              <Link
                to="/staff-attendance"
                className={
                  linkClass(
                    "/staff-attendance"
                  )
                }
                onClick={
                  closeMobile
                }
              >

                <ClipboardCheck
                  size={19}
                />

                <span>
                  My Attendance
                </span>

              </Link>


              <Link
                to="/leave-requests"
                className={
                  linkClass(
                    "/leave-requests"
                  )
                }
                onClick={
                  closeMobile
                }
              >

                <CalendarDays
                  size={19}
                />

                <span>
                  My Leave Requests
                </span>

              </Link>


              <SectionTitle>
                Operations
              </SectionTitle>


              <Link
                to="/attendance"
                className={
                  linkClass(
                    "/attendance"
                  )
                }
                onClick={
                  closeMobile
                }
              >

                <ClipboardCheck
                  size={19}
                />

                <span>
                  Attendance
                </span>

              </Link>

            </>

          )}


          {/* =================================================
              STUDENT - CURRENTLY SAFE ACCESS ONLY
          ================================================= */}

         {/* =================================================
    STUDENT PORTAL
================================================= */}

{isStudent && (
  <>
    <SectionTitle>
      Student Portal
    </SectionTitle>

    <Link
      to="/student/dashboard"
      className={linkClass("/student/dashboard")}
      onClick={closeMobile}
    >
      <LayoutDashboard size={19} />
      <span>Dashboard</span>
    </Link>

    <Link
      to="/student/my-class"
      className={linkClass("/student/my-class")}
      onClick={closeMobile}
    >
      <School size={19} />
      <span>My Class</span>
    </Link>

    <Link
      to="/student/classmates"
      className={linkClass("/student/classmates")}
      onClick={closeMobile}
    >
      <Users size={19} />
      <span>My Classmates</span>
    </Link>

    <Link
      to="/student/my-subjects"
      className={linkClass("/student/my-subjects")}
      onClick={closeMobile}
    >
      <BookOpen size={19} />
      <span>My Subjects</span>
    </Link>

    <Link
      to="/student/timetable"
      className={linkClass("/student/timetable")}
      onClick={closeMobile}
    >
      <CalendarDays size={19} />
      <span>My Timetable</span>
    </Link>

    <Link
      to="/student/attendance"
      className={linkClass("/student/attendance")}
      onClick={closeMobile}
    >
      <ClipboardCheck size={19} />
      <span>My Attendance</span>
    </Link>

    <Link
      to="/student/results"
      className={linkClass("/student/results")}
      onClick={closeMobile}
    >
      <Award size={19} />
      <span>My Results</span>
    </Link>

    <Link
      to="/student/fees"
      className={linkClass("/student/fees")}
      onClick={closeMobile}
    >
      <Wallet size={19} />
      <span>My Fees</span>
    </Link>

    <SectionTitle>
      Account
    </SectionTitle>

    <Link
      to="/student/profile"
      className={linkClass("/student/profile")}
      onClick={closeMobile}
    >
      <User size={19} />
      <span>My Profile</span>
    </Link>

    <Link
      to="/student/change-password"
      className={linkClass("/student/change-password")}
      onClick={closeMobile}
    >
      <LockKeyhole size={19} />
      <span>Change Password</span>
    </Link>
  </>
)}

          {/* =================================================
              FINANCE - ADMIN ONLY
          ================================================= */}

          {isAdmin && (

            <>

              <SectionTitle>
                Finance
              </SectionTitle>


              <button
                onClick={() =>
                  toggleMenu("finance")
                }
                className={
                  menuButtonClass(
                    "finance"
                  )
                }
              >

                <div className="
                  flex
                  items-center
                  gap-3
                ">

                  <Wallet size={19} />

                  <span>
                    Finance
                  </span>

                </div>


                <ChevronDown
                  size={17}
                  className={
                    openMenu === "finance"
                      ? "rotate-180 transition-transform"
                      : "transition-transform"
                  }
                />

              </button>


              {openMenu === "finance" && (

                <div className="
                  mt-1
                  space-y-1
                ">

                  <Link
                    to="/fees"
                    className={
                      subLinkClass(
                        "/fees"
                      )
                    }
                    onClick={
                      closeMobile
                    }
                  >

                    <CreditCard
                      size={16}
                    />

                    Fees

                  </Link>


                  <Link
                    to="/fee-structure"
                    className={
                      subLinkClass(
                        "/fee-structure"
                      )
                    }
                    onClick={
                      closeMobile
                    }
                  >

                    <CreditCard
                      size={16}
                    />

                    Fee Structure

                  </Link>


                  <Link
                    to="/fee-structure-components"
                    className={
                      subLinkClass(
                        "/fee-structure-components"
                      )
                    }
                    onClick={
                      closeMobile
                    }
                  >

                    <Wallet size={16} />

                    Fee Components

                  </Link>


                  <Link
                    to="/fee-installments"
                    className={
                      subLinkClass(
                        "/fee-installments"
                      )
                    }
                    onClick={
                      closeMobile
                    }
                  >

                    <Wallet size={16} />

                    Fee Installments

                  </Link>


                  <Link
                    to="/fee-discounts"
                    className={
                      subLinkClass(
                        "/fee-discounts"
                      )
                    }
                    onClick={
                      closeMobile
                    }
                  >

                    <BadgePercent
                      size={16}
                    />

                    Fee Discounts

                  </Link>


                  <Link
                    to="/fee-concessions"
                    className={
                      subLinkClass(
                        "/fee-concessions"
                      )
                    }
                    onClick={
                      closeMobile
                    }
                  >

                    <Wallet size={16} />

                    Fee Concessions

                  </Link>


                  <Link
                    to="/student-fees"
                    className={
                      subLinkClass(
                        "/student-fees"
                      )
                    }
                    onClick={
                      closeMobile
                    }
                  >

                    <CreditCard
                      size={16}
                    />

                    Fee Collection

                  </Link>


                  <Link
                    to="/library-fine-payments"
                    className={
                      subLinkClass(
                        "/library-fine-payments"
                      )
                    }
                    onClick={
                      closeMobile
                    }
                  >

                    <Library size={16} />

                    Library Fine Payments

                  </Link>

                </div>

              )}

            </>

          )}


          {/* =================================================
              EVENTS - ADMIN ONLY
          ================================================= */}

          {isAdmin && (

            <>

              <SectionTitle>
                Events
              </SectionTitle>


              <button
                onClick={() =>
                  toggleMenu("events")
                }
                className={
                  menuButtonClass(
                    "events"
                  )
                }
              >

                <div className="
                  flex
                  items-center
                  gap-3
                ">

                  <CalendarHeart
                    size={19}
                  />

                  <span>
                    Events
                  </span>

                </div>


                <ChevronDown
                  size={17}
                  className={
                    openMenu === "events"
                      ? "rotate-180 transition-transform"
                      : "transition-transform"
                  }
                />

              </button>


              {openMenu === "events" && (

                <div className="
                  mt-1
                  space-y-1
                ">


                  <Link
                    to="/events"
                    className={
                      subLinkClass(
                        "/events"
                      )
                    }
                    onClick={
                      closeMobile
                    }
                  >

                    <CalendarDays
                      size={16}
                    />

                    Event Management

                  </Link>


                  <Link
                    to="/event-registrations"
                    className={
                      subLinkClass(
                        "/event-registrations"
                      )
                    }
                    onClick={
                      closeMobile
                    }
                  >

                    <CalendarHeart
                      size={16}
                    />

                    Event Registrations

                  </Link>


                  <Link
                    to="/event-payments"
                    className={
                      subLinkClass(
                        "/event-payments"
                      )
                    }
                    onClick={
                      closeMobile
                    }
                  >

                    <CreditCard
                      size={16}
                    />

                    Event Payments

                  </Link>

                </div>

              )}

            </>

          )}


          {/* =================================================
              OPERATIONS - ADMIN ONLY
          ================================================= */}

          {isAdmin && (

            <>

              <SectionTitle>
                Operations
              </SectionTitle>


              <button
                onClick={() =>
                  toggleMenu("operations")
                }
                className={
                  menuButtonClass(
                    "operations"
                  )
                }
              >

                <div className="
                  flex
                  items-center
                  gap-3
                ">

                  <ClipboardCheck
                    size={19}
                  />

                  <span>
                    Operations
                  </span>

                </div>


                <ChevronDown
                  size={17}
                  className={
                    openMenu === "operations"
                      ? "rotate-180 transition-transform"
                      : "transition-transform"
                  }
                />

              </button>


              {openMenu === "operations" && (

                <div className="
                  mt-1
                  space-y-1
                ">


                  <Link
                    to="/attendance"
                    className={
                      subLinkClass(
                        "/attendance"
                      )
                    }
                    onClick={
                      closeMobile
                    }
                  >

                    <ClipboardCheck
                      size={16}
                    />

                    Attendance

                  </Link>


                  <Link
  to="/attendance-status"
  className={
    subLinkClass(
      "/attendance-status"
    )
  }
  onClick={
    closeMobile
  }
>

  <ClipboardCheck
    size={16}
  />

  Attendance Status

</Link>


                  <Link
                    to="/admission-inquiry"
                    className={
                      subLinkClass(
                        "/admission-inquiry"
                      )
                    }
                    onClick={
                      closeMobile
                    }
                  >

                    <FileText
                      size={16}
                    />

                    Admission Inquiry

                  </Link>


                  <Link
                    to="/achievement"
                    className={
                      subLinkClass(
                        "/achievement"
                      )
                    }
                    onClick={
                      closeMobile
                    }
                  >

                    <GraduationCap
                      size={16}
                    />

                    Achievement

                  </Link>


                  <Link
                    to="/lost-and-found"
                    className={
                      subLinkClass(
                        "/lost-and-found"
                      )
                    }
                    onClick={
                      closeMobile
                    }
                  >

                    <Package
                      size={16}
                    />

                    Lost & Found

                  </Link>


                  <Link
                    to="/school-transfers"
                    className={
                      subLinkClass(
                        "/school-transfers"
                      )
                    }
                    onClick={
                      closeMobile
                    }
                  >

                    <School
                      size={16}
                    />

                    School Transfers

                  </Link>


                  {isSuperAdmin && (

                    <Link
                      to="/branch-transfers"
                      className={
                        subLinkClass(
                          "/branch-transfers"
                        )
                      }
                      onClick={
                        closeMobile
                      }
                    >

                      <Building2
                        size={16}
                      />

                      Branch Transfers

                    </Link>

                  )}

                </div>

              )}

            </>

          )}


          {/* =================================================
              AI - ADMIN ONLY
          ================================================= */}

          {isAdmin && (

            <>

              <SectionTitle>
                Smart Tools
              </SectionTitle>


              <Link
                to="/ai"
                className={
                  linkClass("/ai")
                }
                onClick={
                  closeMobile
                }
              >

                <Bot size={19} />

                <span>
                  AI Assistant
                </span>

              </Link>

            </>

          )}


          {/* =================================================
              ACCOUNT
          ================================================= */}

          <SectionTitle>
            Account
          </SectionTitle>


          <Link
            to="/profile"
            className={
              linkClass("/profile")
            }
            onClick={
              closeMobile
            }
          >

            <User size={19} />

            <span>
              Profile
            </span>

          </Link>

        </nav>


        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="
          flex-shrink-0
          border-t
          border-slate-800
          p-3
        ">

          <button
            onClick={handleLogout}
            className="
              w-full
              flex
              items-center
              gap-3
              px-3
              py-2.5
              rounded-xl
              text-sm
              text-red-400
              hover:bg-red-500/10
              hover:text-red-300
              transition
            "
          >

            <LogOut size={19} />

            <span>
              Logout
            </span>

          </button>

        </div>


      </aside>

    </>

  );

}


export default Sidebar;