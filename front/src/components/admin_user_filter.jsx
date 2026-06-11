import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Download from "./download";
import SearchableDropdown from "./SearchableDropdown";

function User_filter() {
  const [data, setdata] = useState(null);
  const [c_dates, set_c_dates] = useState("");
  const [c_city, set_c_city] = useState("");
  const [c_center, set_c_center] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAuditor, setSelectedAuditor] = useState(null); 
  
  const itemsPerPage = 50;
  const nav = useNavigate();

  function dateformet(val) {
    if (!val) return "";
    return new Date(val).toLocaleDateString("en-IN");
  }

  // API Call & Reverse Mapping Logic (Centers as Base)
  useEffect(() => {
    async function get_data() {
      try {
        const cachedUsers = sessionStorage.getItem("admin_usersList");
        const cachedCenters = sessionStorage.getItem("admin_centersList");

        let usersList = [];
        let centersList = [];

        if (cachedUsers && cachedCenters) {
          usersList = JSON.parse(cachedUsers);
          centersList = JSON.parse(cachedCenters);
        } else {
          const [userRes, centerRes] = await Promise.all([
            axios.get(`${import.meta.env.VITE_API_URL}/admin/user/name-list`, {
              withCredentials: true,
            }),
            axios.get(`${import.meta.env.VITE_API_URL}/admin/get_city_list`, {
              withCredentials: true,
            }),
          ]);

          usersList = userRes.data.list || [];
          centersList = centerRes.data?.List || centerRes.data?.data?.List || centerRes.data || [];

          sessionStorage.setItem("admin_usersList", JSON.stringify(usersList));
          sessionStorage.setItem("admin_centersList", JSON.stringify(centersList));
        }

        // PERFECTED LOGIC: Har center ko map karo, aur check karo wahan kon sa auditor hai
        const allCentersMapped = centersList.map((center) => {
          // Is center code wale saare auditors filter kar lo
          const assignedAuditors = usersList.filter(
            (user) => user.Centercode === center.CenterCode
          );

          return {
            City: center.City || "N/A",
            ExamCenter: center.CentreName || "N/A",
            CenterCode: center.CenterCode || "N/A",
            CenterDetails: center,
            auditors: assignedAuditors, // Array of users, khali bhi ho sakti hai agar koi assigned nahi hai
          };
        });

        // Ab allCentersMapped me tere pure 150+ centers honge
        setdata(allCentersMapped);
      } catch (error) {
        console.error("API Fetch Error:", error);
      }
    }
    get_data();
  }, []);

  // Filter Logic over all 150+ Centers
  const filteredData = useMemo(() => {
    if (!data) return [];

    return data.filter((center) => {
      const matchCity = c_city ? center.City === c_city : true;
      const matchCenter = c_center ? center.ExamCenter === c_center : true;
      
      // Date logic: Agar date select ki hai, toh sirf wahi center dikhao jiske auditor ka exam date match kare
      let matchDate = true;
      if (c_dates) {
        matchDate = center.auditors.some((a) => dateformet(a.ExamDate) === c_dates);
      }

      return matchCity && matchCenter && matchDate;
    });
  }, [data, c_city, c_dates, c_center]);

  // Dropdown Arrays (Dynamic)
  const availableDates = useMemo(
    () => [...new Set(filteredData.flatMap((c) => c.auditors.map((u) => dateformet(u.ExamDate))))].filter(Boolean),
    [filteredData]
  );
  const availableCities = useMemo(
    () => [...new Set(filteredData.map((c) => c.City))].filter(Boolean),
    [filteredData]
  );
  const availableCenters = useMemo(
    () => [...new Set(filteredData.map((c) => c.ExamCenter))].filter(Boolean),
    [filteredData]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [c_city, c_dates, c_center]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRows = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  function handleViewOption(username) {
    localStorage.setItem("username", username);
    nav("/admin/user/option");
  }

  function handleViewGallery(centerCode) {
    if (centerCode && centerCode !== "N/A") {
      nav(`/admin/center/gallery/${centerCode}`);
    } else {
      alert("Center Code not available for this location.");
    }
  }

  return (
    <section className="min-h-screen bg-slate-50 py-10">
      <main className="max-w-6xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Center Allocations ({filteredData?.length || 0} Total)</h1>
            <p className="text-sm text-slate-500 mt-1">
              View all centers, check assigned auditors, and navigate to galleries.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Download city={c_city} date={c_dates} center={c_center} />
          </div>
        </div>

        {/* Filter Inputs Area */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Select Exam Date
              </label>
              <SearchableDropdown
                options={availableDates}
                selectedVal={c_dates}
                onSelect={set_c_dates}
                placeholder="Search Date..."
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Select City
              </label>
              <SearchableDropdown
                options={availableCities}
                selectedVal={c_city}
                onSelect={set_c_city}
                placeholder="Search City..."
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Select Center
              </label>
              <SearchableDropdown
                options={availableCenters}
                selectedVal={c_center}
                onSelect={set_c_center}
                placeholder="Search Center..."
              />
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div>
          {!data && (
            <div className="text-center text-slate-400 py-10">
              Loading centers and mapping auditors...
            </div>
          )}

          {data && filteredData.length > 0 && (
            <>
              <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-1/6">
                        City
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-1/6">
                        Center Code
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-1/4">
                        Exam Center
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Assigned Auditor(s)
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {currentRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-semibold">
                          {row.City}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600 bg-indigo-50/30">
                          {row.CenterCode}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                          {row.ExamCenter}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {row.auditors.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {row.auditors.map((auditor, aIdx) => (
                                <button
                                  key={aIdx}
                                  onClick={() => setSelectedAuditor(auditor)}
                                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition-colors cursor-pointer"
                                >
                                  👤 {auditor.name || "Unknown"}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-500 border border-red-100">
                              ⚠️ Unassigned
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <button
                            onClick={() => handleViewGallery(row.CenterCode)}
                            className="inline-flex items-center px-4 py-1.5 bg-slate-800 text-white hover:bg-slate-900 font-medium rounded-lg transition-colors duration-150 shadow-sm"
                          >
                            View Gallery ➔
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination UI */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === 1
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-indigo-400"
                    }`}
                  >
                    Previous
                  </button>
                  <span className="text-sm text-slate-500 font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === totalPages
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-indigo-400"
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}

          {data && filteredData.length === 0 && (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500">No centers match this selection.</p>
            </div>
          )}
        </div>

        {/* ==========================================
            MODAL: AUDITOR DETAILS POPUP
           ========================================== */}
        {selectedAuditor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden">
              <div className="bg-emerald-600 px-6 py-4 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Auditor Details</h3>
                <button
                  onClick={() => setSelectedAuditor(null)}
                  className="text-emerald-200 hover:text-white transition-colors text-xl font-bold outline-none"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Full Name</label>
                  <p className="text-base font-semibold text-slate-800 mt-0.5">{selectedAuditor.name || "N/A"}</p>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Email Address</label>
                  <p className="text-sm font-medium text-emerald-600 break-all mt-0.5">{selectedAuditor.email || "N/A"}</p>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Contact Number</label>
                  <p className="text-sm font-medium text-slate-700 mt-0.5">{selectedAuditor.Number || "N/A"}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Exam Date</label>
                    <p className="text-xs font-semibold text-slate-600 mt-0.5">{dateformet(selectedAuditor.ExamDate) || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Assigned Center Code</label>
                    <p className="text-xs font-semibold text-slate-600 mt-0.5">{selectedAuditor.Centercode || "N/A"}</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  onClick={() => setSelectedAuditor(null)}
                  className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleViewOption(selectedAuditor.name)}
                  className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 shadow-sm transition-colors"
                >
                  View Options →
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </section>
  );
}

export default User_filter;