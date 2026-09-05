import {
  LayoutDashboard,
  User,
  School,
  Users,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  Award,
  Wallet,
  LockKeyhole,
  LogOut
} from "lucide-react";

import {
  NavLink,
  useNavigate
} from "react-router-dom";

function StudentSidebar() {

  const navigate = useNavigate();

  const menuItems = [
    {
      label: "Dashboard",
      path: "/student/dashboard",
      icon: LayoutDashboard
    },
    {
      label: "My Profile",
      path: "/student/profile",
      icon: User
    },
    {
      label: "My Class",
      path: "/student/my-class",
      icon: School
    },
    {
      label: "My Classmates",
      path: "/student/classmates",
      icon: Users
    },
    {
      label: "My Subjects",
      path: "/student/my-subjects",
      icon: BookOpen
    },
    {
      label: "My Timetable",
      path: "/student/timetable",
      icon: CalendarDays
    },
    {
      label: "Attendance",
      path: "/student/attendance",
      icon: ClipboardCheck
    },
    {
      label: "Results",
      path: "/student/results",
      icon: Award
    },
    {
      label: "Fees",
      path: "/student/fees",
      icon: Wallet
    },
    {
      label: "Change Password",
      path: "/student/change-password",
      icon: LockKeyhole
    }
  ];

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/login", {
      replace: true
    });

  };

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">

      {/* Logo */}

      <div className="px-6 py-5 border-b border-slate-700">

        <h2 className="text-xl font-bold">
          Student Portal
        </h2>

        <p className="text-xs text-slate-400 mt-1">
          School Management System
        </p>

      </div>

      {/* Menu */}

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">

        {menuItems.map((item) => {

          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={19} />

              <span>
                {item.label}
              </span>

            </NavLink>
          );

        })}

      </nav>

      {/* Logout */}

      <div className="p-4 border-t border-slate-700">

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-300 hover:bg-red-500/10 hover:text-red-200 transition"
        >
          <LogOut size={19} />

          <span>
            Logout
          </span>

        </button>

      </div>

    </aside>
  );
}

export default StudentSidebar;