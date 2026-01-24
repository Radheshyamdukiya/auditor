import { useEffect, useState } from "react";
import axios from "axios";
import Admin_Nev from "../components/admin_nev";
import { Star, User, Phone, Hash, MessageSquare, ClipboardX } from "lucide-react";

function Show_Feedback() {
  const [feedbackData, setFeedbackData] = useState(null);
  const name = localStorage.getItem("username");

  useEffect(() => {
    async function get_data() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/get/student-feedback`,
          {
            params: { name },
            withCredentials: true,
          }
        );
        
        if (res.data && res.data.student_feedback) {
          setFeedbackData(res.data.student_feedback);
        } else {
          setFeedbackData([]); 
        }
      } catch (err) {
        console.log(err);
        setFeedbackData([]);
      }
    }
    get_data();
  }, [name]);

  const renderStars = (rating) => {
    const numRating = parseInt(rating) || 0;
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={13}
            className={`${
              i < numRating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-100 text-gray-100"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Admin_Nev />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Student Feedback</h1>
          <p className="text-gray-500 text-sm mt-1">Recent reviews and ratings</p>
        </div>
        {!feedbackData ? (
       
          <div className="flex justify-center items-center h-64 text-gray-400 text-sm animate-pulse">
            Loading feedbacks...
          </div>

        ) : feedbackData.length === 0 ? (
   
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4 border border-gray-100">
              <ClipboardX size={40} className="text-gray-300" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-gray-700">No Reviews Found</h3>
            <p className="text-gray-400 text-sm mt-1 max-w-xs">
              No reviews submitted by students or invigilators yet.
            </p>
          </div>

        ) : (
        
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedbackData.map((student, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <User size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-base">
                        {student.Student_Name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>{student.Time || "Just now"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6 text-xs text-gray-500 font-medium">
                  <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
                    <Hash size={12} className="text-gray-400" />
                    {student.Reg_No}
                  </div>
                  {student.Mobile_No && (
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
                      <Phone size={12} className="text-gray-400" />
                      {student.Mobile_No}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-4">
                  {student.feedback && student.feedback.map((fb, idx) => (
                    <div key={idx} className="flex flex-col">
                      <span className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold mb-1 truncate">
                        {fb.title}
                      </span>
                      {renderStars(fb.rating)}
                    </div>
                  ))}
                </div>

                {student.Suggestion && (
                  <div className="mt-4 pt-4 border-t border-gray-50">
                    <div className="flex gap-2">
                      <MessageSquare size={14} className="text-gray-300 mt-0.5 shrink-0" />
                      <p className="text-sm text-gray-600 italic">
                        "{student.Suggestion}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Show_Feedback;