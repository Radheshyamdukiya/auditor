import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Download from "./download";

function User_filter() {
  const [dates, setdates] = useState([]);
  const [citys, setcitys] = useState([]);
  const [c_dates, set_c_dates] = useState("");
  const [c_city, set_c_city] = useState("");
  const [filter, setfilter] = useState(null);
  const nav = useNavigate();
  const [data, setdata] = useState(null);

  function dateformet(val) {
    return new Date(val).toLocaleDateString("en-IN");
  }

  useEffect(() => {
    async function get_data() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/admin/user/name-list`,
          { withCredentials: true }
        );
        const list = res.data.list;
        setdata(list);
        setdates([...new Set(list.map((val) => dateformet(val.ExamDate)))]);
        setcitys([...new Set(list.map((val) => val.City))]);
      } catch (error) {
        console.error(error);
      }
    }
    get_data();
  }, []);

  useEffect(() => {
    if (!data) {
      return;
    }
    let filtered_data = data;
    
    if (c_city) {
      filtered_data = filtered_data.filter((val) => val.City === c_city);
    }

    if (c_dates) {
      filtered_data = filtered_data.filter(
        (val) => dateformet(val.ExamDate) === c_dates
      );
    }
    
    if(!c_city && !c_dates){
        setfilter(null);
    } else {
        setfilter(filtered_data);
    }
    
  }, [c_city, c_dates, data]);

  function setlocal(e) {
    localStorage.setItem("username", e.currentTarget.value);
    nav("/admin/user/option");
  }

  return (
    <section className="min-h-screen bg-slate-50 py-10">
      <main className="max-w-6xl mx-auto px-4">
      
      
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Filter Users</h1>
            <p className="text-sm text-slate-500 mt-1">
              Filter candidates by Exam Date or City to view details.
            </p>
          </div>
          
          <div className="flex-shrink-0">
             <Download  city={c_city} date={c_dates}  />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Select Date
              </label>
              <select
                onChange={(e) => set_c_dates(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-3 outline-none transition-all"
                value={c_dates}
              >
                <option value="">-- All Dates --</option>
                {dates.map((val, idx) => (
                  <option key={idx} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Select City
              </label>
              <select
                onChange={(e) => set_c_city(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-3 outline-none transition-all"
                value={c_city}
              >
                <option value="">-- All Cities --</option>
                {citys.map((val, idx) => (
                  <option key={idx} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
            {!data && (
                <div className="text-center text-slate-400 py-10">
                    Loading filters...
                </div>
            )}

            {filter && filter.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filter.map((val, idx) => (
                    <button
                    key={idx}
                    value={val.name}
                    onClick={setlocal}
                    className="group w-full text-left bg-white border border-slate-200 rounded-xl p-4 hover:border-indigo-400 hover:shadow-md transition duration-200 ease-in-out"
                    >
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="block font-medium text-slate-800">
                            {val.name}
                            </span>
                            <span className="text-xs text-slate-400 mt-1 block">
                                {val.City} • {dateformet(val.ExamDate)}
                            </span>
                        </div>
                        <span className="text-indigo-500 text-sm opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                        View →
                        </span>
                    </div>
                    </button>
                ))}
                </div>
            )}

            {filter && filter.length === 0 && (
                 <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                 <p className="text-slate-500">No users found for this selection.</p>
               </div>
            )}

            {!filter && data && (
                <div className="text-center py-20 bg-slate-100 rounded-xl border border-dashed border-slate-300">
                    <p className="text-slate-500 font-medium">Please select a Date or City to view candidates.</p>
                </div>
            )}
        </div>
      </main>
    </section>
  );
}

export default User_filter;