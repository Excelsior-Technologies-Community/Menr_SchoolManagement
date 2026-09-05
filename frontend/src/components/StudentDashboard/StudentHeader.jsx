import { Bell } from "lucide-react";

function StudentHeader({
  title = "Student Dashboard",
  subtitle = "Welcome back! Here's your academic overview."
}) {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-5">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            {title}
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            {subtitle}
          </p>
        </div>

        <button
          type="button"
          className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition"
        >
          <Bell size={20} className="text-slate-600" />
        </button>

      </div>

    </div>
  );
}

export default StudentHeader;