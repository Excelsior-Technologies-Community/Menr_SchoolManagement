import { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { changeStudentPassword } from "../../services/studentService";

function ChangePassword() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!formData.oldPassword || !formData.newPassword) {
      setError("Please fill all required fields.");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      setLoading(true);

      await changeStudentPassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      });

      setMessage("Password changed successfully.");

      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to change password."
      );
    } finally {
      setLoading(false);
    }
  };

  const PasswordInput = ({
    name,
    value,
    placeholder,
    show,
    setShow
  }) => (
    <div className="relative">
      <Lock
        size={18}
        className="absolute left-3 top-3.5 text-slate-400"
      />

      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full border border-slate-300 rounded-lg pl-10 pr-12 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-3 text-slate-500"
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      <div className="max-w-2xl mx-auto">

        <div className="bg-white rounded-xl shadow-md p-8">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">
              Change Password
            </h1>

            <p className="text-slate-500 mt-2">
              Update your student portal password.
            </p>
          </div>

          {error && (
            <div className="mb-5 bg-red-100 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-5 bg-green-100 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <CheckCircle size={20} />
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="space-y-5">

              <div>
                <label className="block mb-2 font-medium text-slate-700">
                  Current Password
                </label>

                <PasswordInput
                  name="oldPassword"
                  value={formData.oldPassword}
                  placeholder="Enter current password"
                  show={showOld}
                  setShow={setShowOld}
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-slate-700">
                  New Password
                </label>

                <PasswordInput
                  name="newPassword"
                  value={formData.newPassword}
                  placeholder="Enter new password"
                  show={showNew}
                  setShow={setShowNew}
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-slate-700">
                  Confirm New Password
                </label>

                <PasswordInput
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  placeholder="Confirm new password"
                  show={showConfirm}
                  setShow={setShowConfirm}
                />
              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Changing Password..." : "Change Password"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default ChangePassword;