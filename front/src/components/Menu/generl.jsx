import UploadSection from "../usection";
import {useState} from "react"
import { toast, ToastContainer } from "react-toastify";
function General() {
  const [timing,settiming]=useState({
    Auditor:"",
    Student:"",
    Exam:"",
  })

  const [showbtn,setshowbtn]=useState(true);
 const handleonchage=(e)=>{
  const name=e.target.name;
  settiming((prev)=>({...prev,[name]:e.target.value}));

 }
function handlesubmit(e) {
  e.preventDefault();
  console.log(timing);
  
}
function  showerror(params) {
  toast.error("You are submited alrady timings ");
  
}

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6">

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-5 border-b pb-2 border-gray-100">
            Timings
          </h3>
          
      
        <form onSubmit={handlesubmit} >

  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Auditor Reporting Time</label>
              <input type="time" name={"Auditor"} className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" onChange={handleonchage} required/>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Student Entry Time</label>
              <input type="time"  name={"Student"} className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"  onChange={handleonchage} required />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Exam Starting Time</label>
              <input type="time" name={"Exam"} className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"  onChange={handleonchage} required  />
            </div>
          </div>

          

        {
          ! showbtn ?(
            <>
            <div className="flex flex-row gap-4 " > 
            
              <button onClick={()=>setshowbtn(false)}  type="Submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-md shadow-indigo-100">
            Submit Timings
          </button>
          
              <button onClick={()=>setshowbtn(false)}  type="Submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-xl shadow-red-500/50">
            Reset Timings
          </button>

            </div>
            </>
          ):
          (
            <>
              <button   onClick={()=>showerror}   disabled={!showbtn}className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-md shadow-indigo-100">
             Timings Submited
          </button>
            
            </>
          )
        }
        </form>
        </div>
    
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
      </main>
    </div>
  );
}

export default General;