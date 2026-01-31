import UploadSection from "../usection";
import { useState } from "react"
import UserInfo from "../user_info";

const fadeIn = {
  animation: "fadeIn 0.4s ease-out forwards",
};

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
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      
      <UserInfo />

      <div className="bg-white sm:border sm:border-gray-100 sm:rounded-3xl sm:shadow-sm">
        <div className="py-2 flex items-center mb-6 border-b border-gray-50 sm:border-none">
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
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none" 
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
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none" 
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
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none" 
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

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <UploadSection
          title="Before Exam"
          subtitle="Gate charts, room charts, seating plan before exam starts."
        />
        <UploadSection
          title="During Exam"
          subtitle="Exam hall photos, invigilators, sealed question packets."
        />
        <UploadSection
          title="After Exam"
          subtitle="Answer sheet sealing, packet submission, hall clearance."
        />
      </div>
    </div>
  );
}

export default General;