/* eslint-disable no-unused-vars */
import { useState, useContext } from "react";
import axios from "axios";
import UserContex from "../../context/UserAuth";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const nav = useNavigate();
  const user = useContext(UserContex);
  const { setdata } = user;

  const [loading, setLoading] = useState(false);

  const [info, setinfo] = useState({
    email: "",
    password: "",
  });

  function handleOnchage(e) {
    const change = e.target.name;
    setinfo((prev) => ({ ...prev, [change]: e.target.value }));
  }

  const handlesubmit = async (e) => {
    e.preventDefault();

    if (!info.email || !info.password) {
      toast.warning("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
         `${import.meta.env.VITE_API_URL}/user/login`,
        info,
        { withCredentials: true }
      );
    
       setdata(res.data.name.name);
      
      toast.success("Login successful");
      nav("/home");
    } catch (err) {
      console.log(err);
      const message =
        err.response?.data?.message || "Invalid email or password";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50 px-4">
    
      <ToastContainer position="top-center" autoClose={2500} />

      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">
     
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-1">
          Welcome Back 👋
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 text-center mb-6">
          Login to continue
        </p>

        <form onSubmit={handlesubmit} className="space-y-4">
        
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={info.email}
              onChange={handleOnchage}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
            />
          </div>

         
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={info.password}
              onChange={handleOnchage}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
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

      
        <div className="mt-6 flex items-center justify-between text-xs sm:text-sm">
          <span className="text-gray-500">Admin panel?</span>
          <Link
            to="/admin"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Go to Admin →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
