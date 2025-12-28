import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Download from "../components/download";

function All_User() {
  const navigate = useNavigate();
  const [auditor, setAuditor] = useState(null);

  useEffect(() => {
    async function get_data() {
      try {
        const res = await axios.get(
          `/api/admin/user/name-list`,
          { withCredentials: true }
        );
        setAuditor(res.data.list);
      } catch (err) {
      
        console.log(err);
        console.log(err.response?.data);
      }
    }
    get_data();
  }, []);

  function handlebtn(e) {
    const name = e.currentTarget.value;
    localStorage.setItem("username", name);
    navigate("/admin/user/option");
  }

  return (
    <section className="min-h-screen bg-slate-50">

      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-lg font-bold text-indigo-600">
            Admin Portal
          </h1>
          
         
          <div className="flex-shrink-0">
            <Download />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <p className="text-sm text-slate-500 mb-5">
          Choose a user to view uploaded media
        </p>

        {!auditor ? (
          <div className="text-center text-slate-500 py-20">
            Loading users…
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {auditor.map((val, idx) => (
              <button
                key={idx}
                value={val.name}
                onClick={handlebtn}
                className="group w-full text-left bg-white border border-slate-200 rounded-xl p-4 hover:border-indigo-400 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">
                    {val.name}
                  </span>
                  <span className="text-indigo-500 text-sm opacity-0 group-hover:opacity-100 transition">
                    View →
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </section>
  );
}

export default All_User;