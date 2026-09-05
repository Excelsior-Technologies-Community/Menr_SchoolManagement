import { useEffect, useState } from "react";

import {
  User,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  GraduationCap,
  Users,
  ShieldUser,
  Pencil,
  X,
  Save
} from "lucide-react";

import StudentLayout from "../../layouts/StudentLayout";

import {
  getStudentProfile,
  updateStudentProfile
} from "../../services/studentService";


function MyProfile() {

  const [profile, setProfile] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [isEditing, setIsEditing] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [formData, setFormData] =
    useState({
      phone: "",
      address: "",
      father_name: "",
      mother_name: "",
      guardian_name: "",
      guardian_relation: "",
      guardian_contact: "",
      guardian_email: ""
    });


  useEffect(() => {
    fetchProfile();
  }, []);


  // =========================================================
  // GET PROFILE
  // =========================================================

  const fetchProfile = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await getStudentProfile();

      const data =
        response.data;

      setProfile(data);

      setFormData({
        phone:
          data.phone ||
          data.contact_number ||
          "",

        address:
          data.address ||
          "",

        father_name:
          data.father_name ||
          "",

        mother_name:
          data.mother_name ||
          "",

        guardian_name:
          data.guardian_name ||
          "",

        guardian_relation:
          data.guardian_relation ||
          "",

        guardian_contact:
          data.guardian_contact ||
          "",

        guardian_email:
          data.guardian_email ||
          ""
      });

    } catch (error) {

      console.log(error);

      setError(
        error.response?.data?.message ||
        "Unable to load profile"
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

  };


  // =========================================================
  // UPDATE PROFILE
  // =========================================================

  const handleSave = async () => {

    try {

      setSaving(true);
      setError("");
      setSuccess("");

      const response =
        await updateStudentProfile(
          formData
        );

      setSuccess(
        response.message ||
        "Profile Updated Successfully"
      );

      setIsEditing(false);

      await fetchProfile();

    } catch (error) {

      console.log(error);

      setError(
        error.response?.data?.message ||
        "Unable to update profile"
      );

    } finally {

      setSaving(false);

    }

  };


  // =========================================================
  // CANCEL EDIT
  // =========================================================

  const handleCancel = () => {

    if (!profile) return;

    setFormData({
      phone:
        profile.phone ||
        profile.contact_number ||
        "",

      address:
        profile.address ||
        "",

      father_name:
        profile.father_name ||
        "",

      mother_name:
        profile.mother_name ||
        "",

      guardian_name:
        profile.guardian_name ||
        "",

      guardian_relation:
        profile.guardian_relation ||
        "",

      guardian_contact:
        profile.guardian_contact ||
        "",

      guardian_email:
        profile.guardian_email ||
        ""
    });

    setIsEditing(false);
    setError("");
    setSuccess("");

  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (
      <StudentLayout>

        <div className="p-6 bg-slate-100 min-h-screen">

          <div className="bg-white rounded-xl p-12 text-center">

            Loading profile...

          </div>

        </div>

      </StudentLayout>
    );

  }


  // =========================================================
  // ERROR
  // =========================================================

  if (error && !profile) {

    return (
      <StudentLayout>

        <div className="p-6 bg-slate-100 min-h-screen">

          <div className="bg-red-100 text-red-700 p-4 rounded-xl">

            {error}

          </div>

        </div>

      </StudentLayout>
    );

  }


  return (

    <StudentLayout>

      <div className="p-6 bg-slate-100 min-h-screen">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <h1 className="text-3xl font-bold text-slate-800">
              My Profile
            </h1>

            <p className="text-slate-500 mt-1">
              View and manage your personal and guardian information.
            </p>

          </div>


          {!isEditing ? (

            <button
              onClick={() => {
                setIsEditing(true);
                setSuccess("");
                setError("");
              }}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition"
            >

              <Pencil size={18} />

              Edit Profile

            </button>

          ) : (

            <div className="flex gap-3">

              <button
                onClick={handleCancel}
                disabled={saving}
                className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-5 py-3 rounded-xl font-medium transition"
              >

                <X size={18} />

                Cancel

              </button>


              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-5 py-3 rounded-xl font-medium transition"
              >

                <Save size={18} />

                {saving
                  ? "Saving..."
                  : "Save Changes"}

              </button>

            </div>

          )}

        </div>


        {/* =====================================================
            SUCCESS
        ===================================================== */}

        {success && (

          <div className="mb-6 bg-green-100 border border-green-200 text-green-700 p-4 rounded-xl">

            {success}

          </div>

        )}


        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (

          <div className="mb-6 bg-red-100 border border-red-200 text-red-700 p-4 rounded-xl">

            {error}

          </div>

        )}


        {profile && (

          <div className="space-y-6">


            {/* =================================================
                PROFILE HEADER
            ================================================= */}

            <div className="bg-white rounded-xl shadow-sm p-6">

              <div className="flex flex-col md:flex-row items-center gap-6">

                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">

                  <User
                    size={45}
                    className="text-blue-600"
                  />

                </div>


                <div className="text-center md:text-left">

                  <h2 className="text-2xl font-bold text-slate-800">

                    {profile.full_name || "-"}

                  </h2>

                  <p className="text-slate-500">

                    Roll Number:{" "}

                    {profile.roll_number || "-"}

                  </p>

                  <p className="text-sm text-slate-400 mt-1">

                    Student Portal

                  </p>

                </div>

              </div>

            </div>


            {/* =================================================
                PERSONAL INFORMATION
            ================================================= */}

            <div className="bg-white rounded-xl shadow-sm p-6">

              <h2 className="text-xl font-bold text-slate-800 mb-6">

                Personal Information

              </h2>


              {!isEditing ? (

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                  <Info
                    icon={<User size={18} />}
                    label="Full Name"
                    value={profile.full_name}
                  />

                  <Info
                    icon={<Mail size={18} />}
                    label="Email"
                    value={profile.email}
                  />

                  <Info
                    icon={<Phone size={18} />}
                    label="Phone"
                    value={profile.phone}
                  />

                  <Info
                    icon={<CalendarDays size={18} />}
                    label="Date of Birth"
                    value={profile.dob}
                  />

                  <Info
                    icon={<User size={18} />}
                    label="Gender"
                    value={profile.gender}
                  />

                  <Info
                    icon={<MapPin size={18} />}
                    label="Address"
                    value={profile.address}
                  />

                </div>

              ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <Input
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    icon={<Phone size={17} />}
                  />

                  <Input
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    icon={<MapPin size={17} />}
                  />

                </div>

              )}

            </div>


            {/* =================================================
                PARENT & GUARDIAN INFORMATION
            ================================================= */}

            <div className="bg-white rounded-xl shadow-sm p-6">

              <div className="flex items-center gap-3 mb-6">

                <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">

                  <Users size={22} />

                </div>

                <div>

                  <h2 className="text-xl font-bold text-slate-800">

                    Parent & Guardian Information

                  </h2>

                  <p className="text-sm text-slate-500">

                    Parent and guardian contact details

                  </p>

                </div>

              </div>


              {!isEditing ? (

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                  <Info
                    icon={<User size={18} />}
                    label="Father Name"
                    value={profile.father_name}
                  />

                  <Info
                    icon={<User size={18} />}
                    label="Mother Name"
                    value={profile.mother_name}
                  />

                  <Info
                    icon={<ShieldUser size={18} />}
                    label="Guardian Name"
                    value={profile.guardian_name}
                  />

                  <Info
                    icon={<Users size={18} />}
                    label="Guardian Relation"
                    value={profile.guardian_relation}
                  />

                  <Info
                    icon={<Phone size={18} />}
                    label="Guardian Contact"
                    value={profile.guardian_contact}
                  />

                  <Info
                    icon={<Mail size={18} />}
                    label="Guardian Email"
                    value={profile.guardian_email}
                  />

                </div>

              ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <Input
                    label="Father Name"
                    name="father_name"
                    value={formData.father_name}
                    onChange={handleChange}
                    icon={<User size={17} />}
                  />

                  <Input
                    label="Mother Name"
                    name="mother_name"
                    value={formData.mother_name}
                    onChange={handleChange}
                    icon={<User size={17} />}
                  />

                  <Input
                    label="Guardian Name"
                    name="guardian_name"
                    value={formData.guardian_name}
                    onChange={handleChange}
                    icon={<ShieldUser size={17} />}
                  />

                  <Input
                    label="Guardian Relation"
                    name="guardian_relation"
                    value={formData.guardian_relation}
                    onChange={handleChange}
                    icon={<Users size={17} />}
                  />

                  <Input
                    label="Guardian Contact"
                    name="guardian_contact"
                    value={formData.guardian_contact}
                    onChange={handleChange}
                    icon={<Phone size={17} />}
                  />

                  <Input
                    label="Guardian Email"
                    name="guardian_email"
                    type="email"
                    value={formData.guardian_email}
                    onChange={handleChange}
                    icon={<Mail size={17} />}
                  />

                </div>

              )}

            </div>


            {/* =================================================
                ACADEMIC INFORMATION
            ================================================= */}

            <div className="bg-white rounded-xl shadow-sm p-6">

              <h2 className="text-xl font-bold text-slate-800 mb-6">

                Academic Information

              </h2>


              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                <Info
                  icon={<GraduationCap size={18} />}
                  label="Class"
                  value={
                    profile.class_master_name ||
                    profile.class_name
                  }
                />

                <Info
                  icon={<GraduationCap size={18} />}
                  label="Section"
                  value={
                    profile.section_name ||
                    profile.section
                  }
                />

                <Info
                  icon={<GraduationCap size={18} />}
                  label="Branch"
                  value={profile.branch_name}
                />

                <Info
                  icon={<User size={18} />}
                  label="Status"
                  value={profile.status}
                />

              </div>

            </div>


          </div>

        )}

      </div>

    </StudentLayout>

  );

}


// =========================================================
// INFO COMPONENT
// =========================================================

function Info({
  icon,
  label,
  value
}) {

  return (

    <div>

      <div className="flex items-center gap-2 text-slate-500 mb-2">

        {icon}

        <span className="text-sm">
          {label}
        </span>

      </div>

      <p className="font-semibold text-slate-800 break-words">

        {value || "-"}

      </p>

    </div>

  );

}


// =========================================================
// INPUT COMPONENT
// =========================================================

function Input({
  label,
  name,
  value,
  onChange,
  icon,
  type = "text"
}) {

  return (

    <div>

      <label className="block text-sm font-medium text-slate-700 mb-2">

        {label}

      </label>

      <div className="relative">

        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">

          {icon}

        </div>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

      </div>

    </div>

  );

}


export default MyProfile;