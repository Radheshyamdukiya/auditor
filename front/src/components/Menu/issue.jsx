import { useState } from "react";
import { ChevronDown, AlertCircle, CheckCircle2, MessageSquareWarning } from "lucide-react";
import Video from "../pages/video.upload"; // Path check kar lena apne hisab se

function Issue() {
  // State maintain karne ke liye (Optional, agar backend connect karega tab kaam aayega)
  const [description, setDescription] = useState("");
  const [isEscalation, setIsEscalation] = useState(false);
  const [isSolved, setIsSolved] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6">
      
      {/* Main Card Container */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        
        {/* 1. Header Section (Blue Bar like screenshot) */}
        <div className="bg-indigo-600 p-4 sm:p-5 flex justify-between items-center cursor-pointer hover:bg-indigo-700 transition-colors">
          <div className="flex items-center gap-2 text-white">
            <MessageSquareWarning size={20} className="text-indigo-200" />
            <h2 className="text-lg font-bold tracking-wide">Escalation / Issues</h2>
          </div>
          <ChevronDown className="text-indigo-100" size={20} />
        </div>

        {/* 2. Form Content */}
        <div className="p-5 sm:p-8 space-y-6">
          
          {/* Description Textarea */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 block ml-1">
              Description of Issue
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the incident or issue in detail..."
              rows="4"
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-4 text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-y"
            ></textarea>
          </div>

          {/* Checkboxes Row */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 border-b border-gray-100 pb-6">
            
            {/* Checkbox 1: Escalation */}
            <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${isEscalation ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  checked={isEscalation}
                  onChange={(e) => setIsEscalation(e.target.checked)}
                  className="w-5 h-5 text-red-600 rounded focus:ring-red-500 border-gray-300 cursor-pointer accent-red-600"
                />
              </div>
              <span className={`text-sm font-semibold ${isEscalation ? 'text-red-700' : 'text-gray-600'}`}>
                Escalation Required
              </span>
              {isEscalation && <AlertCircle size={16} className="text-red-500" />}
            </label>

            {/* Checkbox 2: Solved */}
            <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${isSolved ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  checked={isSolved}
                  onChange={(e) => setIsSolved(e.target.checked)}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500 border-gray-300 cursor-pointer accent-green-600"
                />
              </div>
              <span className={`text-sm font-semibold ${isSolved ? 'text-green-700' : 'text-gray-600'}`}>
                Issue Solved
              </span>
              {isSolved && <CheckCircle2 size={16} className="text-green-500" />}
            </label>

          </div>

          {/* 3. Proof Section (Using your Video Component) */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 block ml-1">
              Proof (Photo/Video)
            </label>
            <div className="bg-gray-50 rounded-xl p-2 sm:p-4 border border-gray-200 border-dashed">
              {/* Humara banaya hua Video Component yahan aayega */}
              <Video />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Issue;