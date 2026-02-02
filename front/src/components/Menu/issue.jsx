import { useState } from "react";
import Video from "../../pages/video.upload";

function Issue() {
  const [description, setDescription] = useState("");

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white sm:border sm:border-gray-100 sm:rounded-3xl overflow-hidden">
        
        <div className="py-2 flex items-center mb-6 border-b border-gray-50 sm:border-none">
          <div className="w-1.5 h-6 bg-red-600 rounded-full mr-3"></div>
          <h2 className="text-lg font-black text-gray-800 tracking-tight">Report Issue</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">
              Issue Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the incident or issue in detail..."
              rows="5"
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all resize-none shadow-sm"
            ></textarea>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">
              Proof (Photo/Video)
            </label>
            {/* title="Issue" and overrideSub will send description to backend as Sub_title */}
            <Video title="Issue" overrideSub={description} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Issue;