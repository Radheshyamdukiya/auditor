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
      <div className="w-full animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-40 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-white sm:rounded-2xl overflow-hidden">
        
        <div className="py-2 sm:py-4 flex items-center mb-6 border-b border-gray-50 sm:border-none">
          <div className="w-1.5 h-6 bg-indigo-600 rounded-full mr-3"></div>
          <h2 className="text-lg sm:text-xl font-black text-gray-800 tracking-tight">
            Assigned Audit Details
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-6">

          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1">
              Auditor Name
            </label>
            <div className="w-full bg-gray-50 text-gray-700 border border-gray-100 rounded-xl px-4 py-3.5 text-sm font-bold shadow-sm">
              {data.name || "N/A"}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1">
              Exam Date
            </label>
            <div className="w-full bg-gray-50 text-gray-700 border border-gray-100 rounded-xl px-4 py-3.5 text-sm font-bold shadow-sm">
              {formatDate(data.ExamDate)}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1">
              Centre Name
            </label>
            <div className="w-full bg-gray-50 text-gray-700 border border-gray-100 rounded-xl px-4 py-3.5 text-sm font-bold shadow-sm truncate" title={data.ExamCenter}>
              {data.ExamCenter || "N/A"}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1">
              State
            </label>
            <div className="w-full bg-gray-50 text-gray-700 border border-gray-100 rounded-xl px-4 py-3.5 text-sm font-bold shadow-sm uppercase">
              {data.State || "N/A"}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1">
              City
            </label>
            <div className="w-full bg-gray-50 text-gray-700 border border-gray-100 rounded-xl px-4 py-3.5 text-sm font-bold shadow-sm uppercase">
              {data.City || "N/A"}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1">
              CA's Mobile No.
            </label>
            <div className="w-full bg-gray-50 text-gray-700 border border-gray-100 rounded-xl px-4 py-3.5 text-sm font-bold shadow-sm tracking-widest">
              {data.Number || "N/A"}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default UserInfo;