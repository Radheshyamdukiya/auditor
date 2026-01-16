/* eslint-disable no-unused-vars */
import { useState } from "react";
import Rating_Component from "../star";
import axios from "axios";
import toast from "react-hot-toast"; // Fixed: Using react-hot-toast

function StudentFeedback() {
  const [data, setdata] = useState({
    Student_Name: "",
    Reg_No: "",
    Mobile_No: "",
    Time: "",
    Suggestion: ""
  })
   const [feedback, setfeedback] = useState([]);
  const requiredRatings = [
    "Signboard", "Lighting", "Ventilation", "Power Backup", 
    "Atmos Phare", "Infrastructure", "Cleanliness", "Washroom", 
    "Location", "likely to recomend"
  ];

  function handlefeedback(title, rating) {
    setfeedback((prev) => {
      const isallrady = prev.find((item) => title === item.title)
      if (isallrady) {
        return prev.map((item) =>
          title === item.title ? { ...item, rating } : item
        )
      }
      else {
        return [...prev, { title, rating }]
      }
    })
  }

  async function submitdata() {
    if(!data.Student_Name || !data.Reg_No || !data.Mobile_No){
        toast.error("Please fill Student Name, Reg No and Mobile No");
        return;
    }

    const pendingRatings = requiredRatings.filter(cat => 
        !feedback.find(item => item.title === cat && item.rating > 0)
    );

    if(pendingRatings.length > 0){
        toast.error("Please give rating for all categories!");
        return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/student_feedback`, { data, feedback }, { withCredentials: true });
      toast.success("Feedback submitted successfully!");
    }
    catch (err) {
      console.log(err);
      toast.error("Something went wrong!");
    }
  }

  function HandleData(e) {
    const name = e.target.name;
    const value = e.target.value;
    setdata((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Student Name</p>
          <input 
            type="text" 
            placeholder="Enter Student Name" 
            name="Student_Name" 
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            onChange={HandleData} 
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Reg No</p>
          <input 
            type="text" 
            placeholder="Enter Reg No" 
            name="Reg_No" 
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            onChange={HandleData} 
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Mobile No</p>
          <input 
            type="text" 
            placeholder="Enter Mobile Num" 
            name="Mobile_No" 
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            onChange={HandleData} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Rating_Component title="Signboard" handlesubmit={handlefeedback} />
        <Rating_Component title="Lighting" handlesubmit={handlefeedback} />
        <Rating_Component title="Ventilation" handlesubmit={handlefeedback} />
        <Rating_Component title="Power Backup" handlesubmit={handlefeedback} />
        <Rating_Component title="Atmos Phare" handlesubmit={handlefeedback} />
        <Rating_Component title="Infrastructure" handlesubmit={handlefeedback} />
        <Rating_Component title="Cleanliness" handlesubmit={handlefeedback} />
        <Rating_Component title="Washroom" handlesubmit={handlefeedback} />
        <Rating_Component title="Location" handlesubmit={handlefeedback} />
        <Rating_Component title="likely to recomend" handlesubmit={handlefeedback} />
        
        <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold text-gray-700 mb-2">Time</p>
            <input 
                type="time" 
                name="Time" 
                className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                onChange={HandleData} 
            />
        </div>
      </div>

     
      <div className="mb-8">
        <p className="text-sm font-semibold text-gray-700 mb-2">Suggestion</p>
        <input 
            type="text" 
            placeholder="Give your Suggestion" 
            name="Suggestion" 
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            onChange={HandleData} 
        />
      </div>

      <div className="flex justify-end">
        <button 
            onClick={submitdata} 
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-md"
        >
            Submit Feedback
        </button>
      </div>

    </div>
  )
}

export default StudentFeedback;