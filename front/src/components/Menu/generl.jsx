import UploadSection from "../usection";
import { useState } from "react"
import UserInfo from "../user_info";

function General() {
  const [timing, settiming] = useState({
    Auditor: "",
    Student: "",
    Exam: "",
  })

  const [showbtn, setshowbtn] = useState(true);

  const handleonchage = (e) => {
    const name = e.target.name;
    settiming((prev) => ({ ...prev, [name]: e.target.value }));
  }

  function handlesubmit(e) {
    e.preventDefault();
    setshowbtn(false);
    console.log(timing);
  }

  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in duration-500">
      
      <UserInfo />

      <div className="bg-white sm:border sm:border-gray-100 sm:rounded-3xl">
        <div className="flex items-center mb-6">
          <div className="w-1.5 h-6 bg-indigo-600 rounded-full mr-3"></div>
          <h3 className="text-lg font-black text-gray-800 tracking-tight">
            Exam Timings
          </h3>
        </div>

        <form onSubmit={handlesubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">
                Auditor Reporting Time
              </label>
              <input 
                type="time" 
                name="Auditor" 
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-sm font-bold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none" 
                onChange={handleonchage} 
                required 
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">
                Student Entry Time
              </label>
              <input 
                type="time" 
                name="Student" 
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-sm font-bold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none" 
                onChange={handleonchage} 
                required 
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">
                Exam Starting Time
              </label>
              <input 
                type="time" 
                name="Exam" 
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-sm font-bold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none" 
                onChange={handleonchage} 
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={!showbtn}
            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg ${
              showbtn 
                ? "bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700" 
                : "bg-green-500 text-white shadow-green-100"
            }`}
          >
            {showbtn ? "Submit Timings" : "✓ Timings Submitted"}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-8 pt-4">
        <UploadSection title="Before Exam" />
        <UploadSection title="During Exam" />
        <UploadSection title="After Exam" />
      </div>
    </div>
  );
}

export default General;