import {
  TrendingUp,
  Users,
  BookOpen,
  CalendarCheck,
  Wallet,
  Award
} from "lucide-react";

const icons = {
  students: Users,
  subjects: BookOpen,
  attendance: CalendarCheck,
  fees: Wallet,
  results: Award,
  default: TrendingUp
};

function StatCard({
  title,
  value,
  subtitle = "",
  type = "default"
}) {
  const Icon = icons[type] || icons.default;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition">
      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="text-2xl font-bold text-slate-800 mt-2">
            {value ?? 0}
          </h3>

          {subtitle && (
            <p className="text-xs text-slate-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
          <Icon
            size={24}
            className="text-blue-600"
          />
        </div>

      </div>
    </div>
  );
}

export default StatCard;