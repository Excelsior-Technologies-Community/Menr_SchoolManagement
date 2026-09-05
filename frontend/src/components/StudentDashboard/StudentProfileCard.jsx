import {
  User,
  Mail,
  Phone,
  GraduationCap
} from "lucide-react";

function StudentProfileCard({
  profile
}) {
  if (!profile) {
    return null;
  }

  const fullName =
    profile.full_name ||
    [
      profile.first_name,
      profile.middle_name,
      profile.last_name
    ]
      .filter(Boolean)
      .join(" ") ||
    "Student";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">

        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">

          {profile.photo_url ? (
            <img
              src={profile.photo_url}
              alt={fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <User
              size={34}
              className="text-blue-600"
            />
          )}

        </div>

        <div className="flex-1 text-center sm:text-left">

          <h2 className="text-xl font-bold text-slate-800">
            {fullName}
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Roll No: {profile.roll_number || "-"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">

            <div className="flex items-center gap-2 text-sm text-slate-600">
              <GraduationCap size={17} />
              <span>
                {profile.class_name || "Class -"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Mail size={17} />
              <span className="truncate">
                {profile.email || "-"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Phone size={17} />
              <span>
                {profile.phone ||
                  profile.contact_number ||
                  "-"}
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default StudentProfileCard;