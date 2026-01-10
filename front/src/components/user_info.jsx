import { useEffect, useState } from "react";

function UserInfo() {
  const [data, setData] = useState(() => {
    try {
      const user = localStorage.getItem("data");
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  if (!data) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 animate-pulse border border-gray-100">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="h-16 bg-gray-100 rounded-lg"></div>
            <div className="h-16 bg-gray-100 rounded-lg"></div>
            <div className="h-16 bg-gray-100 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
        
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center">
          <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
          <h2 className="text-xl font-bold text-slate-800 tracking-wide">
            Assigned Audit Details
          </h2>
        </div>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            <div className="group">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                Auditor Name
              </label>
              <div className="w-full bg-slate-100 text-slate-700 border border-transparent rounded-lg px-4 py-3 text-sm font-semibold shadow-sm cursor-not-allowed">
                {data.name || "N/A"}
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                Exam Date
              </label>
              <div className="w-full bg-slate-100 text-slate-700 border border-transparent rounded-lg px-4 py-3 text-sm font-semibold shadow-sm cursor-not-allowed">
                {formatDate(data.ExamDate)}
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                Centre Name
              </label>
              <div className="w-full bg-slate-100 text-slate-700 border border-transparent rounded-lg px-4 py-3 text-sm font-semibold shadow-sm cursor-not-allowed truncate" title={data.ExamCenter}>
                {data.ExamCenter || "N/A"}
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                State
              </label>
              <div className="w-full bg-slate-100 text-slate-700 border border-transparent rounded-lg px-4 py-3 text-sm font-semibold shadow-sm uppercase cursor-not-allowed">
                {data.State || "N/A"}
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                City
              </label>
              <div className="w-full bg-slate-100 text-slate-700 border border-transparent rounded-lg px-4 py-3 text-sm font-semibold shadow-sm uppercase cursor-not-allowed">
                {data.City || "N/A"}
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                CA's Mobile No.
              </label>
              <div className="w-full bg-slate-100 text-slate-700 border border-transparent rounded-lg px-4 py-3 text-sm font-semibold shadow-sm cursor-not-allowed tracking-wide">
                {data.Number || "N/A"}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;