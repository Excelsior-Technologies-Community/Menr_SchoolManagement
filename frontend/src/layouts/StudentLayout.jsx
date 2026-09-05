import {
  LayoutDashboard,
  BookOpen,
  Users,
  CalendarDays,
  ClipboardCheck,
  UserCircle,
  LockKeyhole
} from "lucide-react";

import {
  NavLink,
  Outlet
} from "react-router-dom";

function StudentLayout({ children }) {

  const menu = [
    {
      name: "Dashboard",
      path: "/student/dashboard",
      icon: LayoutDashboard
    },
    {
      name: "My Class",
      path: "/student/class",
      icon: BookOpen
    },
    {
      name: "My Classmates",
      path: "/student/classmates",
      icon: Users
    },
    {
      name: "My Subjects",
      path: "/student/subjects",
      icon: BookOpen
    },
    {
      name: "My Timetable",
      path: "/student/timetable",
      icon: CalendarDays
    },
    {
      name: "My Attendance",
      path: "/student/attendance",
      icon: ClipboardCheck
    },
    {
      name: "My Profile",
      path: "/student/profile",
      icon: UserCircle
    },
    {
      name: "Change Password",
      path: "/student/change-password",
      icon: LockKeyhole
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100">

      <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white">

        <div className="p-6 border-b border-slate-700">

          <h1 className="text-xl font-bold">
            Student Portal
          </h1>

          <p className="text-slate-400 text-sm mt-1">
            School Management System
          </p>

        </div>

        <nav className="p-4 space-y-2">

          {menu.map((item) => {

            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800"
                  }`
                }
              >

                <Icon size={19} />

                <span>
                  {item.name}
                </span>

              </NavLink>
            );

          })}

        </nav>

      </aside>

      <main className="ml-64 min-h-screen">

        {children || <Outlet />}

      </main>

    </div>
  );
}

export default StudentLayout;