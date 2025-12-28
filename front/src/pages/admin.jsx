import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Admin() {
  const nev = useNavigate();

  const [loading, setLoading] = useState(false);
  const [data, setdata] = useState({
    email: "",
    password: "",
  });

  const handlechange = (e) => {
    const name = e.target.name;
    setdata((prev) => ({ ...prev, [name]: e.target.value }));
  };

  const handlesubmit = async (e) => {
    e.preventDefault();

    if (data.email.trim() === "" || data.password.trim() === "") {
      toast.warning("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

       await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/login`,
        data,
        { withCredentials: true }
      );

      toast.success("Admin login successful");
      nev("/admin/home");
    } catch (err) {
      const message =
        err.response?.data?.message || "Invalid admin credentials";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <ToastContainer position="top-center" autoClose={2500} />

      <div className="w-full max-w-sm sm:max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-xl p-6 sm:p-8">
      
        <h1 className="text-xl sm:text-2xl font-bold text-white text-center mb-1">
          Admin Login
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 text-center mb-6">
          Secure access to admin panel
        </p>

      
        <form onSubmit={handlesubmit} className="space-y-4">
    
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="text"
              name="email"
              value={data.email}
              onChange={handlechange}
              placeholder="admin@example.com"
              className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={handlechange}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
            />
          </div>

        
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg font-semibold text-white transition
              ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

       
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="text-xs text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        
        <Link
          to="/"
          className="block w-full text-center py-2.5 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition text-sm font-medium"
        >
          Go to User Login
        </Link>
      </div>
    </div>
  );
}

export default Admin;
