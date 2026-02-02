import { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus, Loader2, PlayCircle, ChevronDown, CheckCircle2 } from "lucide-react";

const SUB_MAP = {
  "Before Exam": ["Gate Chart", "Room Chart", "Seating Plan", "Staff Attendance"],
  "During Exam": ["Exam Hall", "Invigilator Photo", "Question Paper", "Attendance Sheet"],
  "After Exam": ["Sheet Sealing", "Packet Submission", "Hall Clearance", "Final Report"],
  "Issue": ["Upload Proof"]
};

function Video({ title, overrideSub }) {
  const [open, setOpen] = useState(false);
  const [activeSub, setActiveSub] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState({});
  const fileRef = useRef(null);
  const userData = JSON.parse(localStorage.getItem("data"));

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (title === "Issue" && !overrideSub) {
      toast.error("Please enter description first");
      return;
    }

    setUploading(true);
    const newPreviews = [];
    const mediaUrls = [];
    try {
      await Promise.all(files.map(async (file) => {
        const type = file.type.startsWith("image") ? "image" : "video";
        const { data: sign } = await axios.post(`${import.meta.env.VITE_API_URL}/user/upload`, { type }, { withCredentials: true });
        const fd = new FormData();
        fd.append("file", file);
        fd.append("api_key", sign.apiKey);
        fd.append("timestamp", sign.timestamp);
        fd.append("signature", sign.signature);
        const res = await axios.post(`https://api.cloudinary.com/v1_1/${sign.cloudName}/${type}/upload`, fd);
        mediaUrls.push(res.data.secure_url);
        newPreviews.push({ url: res.data.secure_url, type });
      }));

      // Exact matching with your backend keys in image_02badd.png
      await axios.post(`${import.meta.env.VITE_API_URL}/user/save-media`, { 
        mediaUrls, 
        title, 
        Sub_title: title === "Issue" ? overrideSub : activeSub, 
        City: userData?.City, 
        Date: userData?.ExamDate 
      }, { withCredentials: true });

      setPreviews(prev => ({ ...prev, [activeSub]: [...(prev[activeSub] || []), ...newPreviews] }));
      toast.success("Uploaded");
    } catch (err) {
      toast.error("Failed");
    } finally {
      setUploading(false);
      fileRef.current.value = "";
    }
  };

  const subCategories = SUB_MAP[title] || [];
  const hasAnyPreview = subCategories.some(s => previews[s]?.length > 0);

  return (
    <div className={`w-full border rounded-2xl overflow-hidden bg-white shadow-sm transition-all duration-300 ${hasAnyPreview ? "border-indigo-100" : "border-gray-100"}`}>
      <div 
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-800 text-sm sm:text-base">{title === "Issue" ? "Issue Proof" : title}</span>
          {hasAnyPreview && <CheckCircle2 size={16} className="text-green-500" />}
        </div>
        <ChevronDown size={18} className={`transition-transform duration-300 text-gray-400 ${open ? "rotate-180" : ""}`} />
      </div>

      {open && (
        <div className="px-3 pb-3 bg-gray-50/30 border-t border-gray-50 animate-in fade-in duration-300">
          <input ref={fileRef} type="file" multiple className="hidden" onChange={handleFileChange} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
            {subCategories.map(s => {
              const isDone = previews[s]?.length > 0;
              return (
                <div key={s} className="flex flex-col gap-1.5">
                  <button
                    onClick={() => { setActiveSub(s); fileRef.current.click(); }}
                    disabled={uploading}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-[13px] font-bold transition-all active:scale-[0.98] ${
                      isDone ? "bg-green-50 border-green-200 text-green-700" : "bg-white border-gray-200 text-gray-600 shadow-sm"
                    }`}
                  >
                    <span className="truncate pr-2">{title === "Issue" ? "Tap to Upload Proof" : s}</span>
                    <div className="shrink-0">
                      {uploading && activeSub === s ? <Loader2 className="animate-spin text-indigo-600" size={16} /> : 
                       isDone ? <CheckCircle2 size={16} className="text-green-600" /> : <Plus size={16} className="text-gray-400" />}
                    </div>
                  </button>
                  
                  {isDone && (
                    <div className="flex flex-wrap gap-1.5 px-1 pb-1">
                      {previews[s].map((prev, idx) => (
                        <div key={idx} className="relative h-10 w-10 rounded-lg overflow-hidden border border-gray-100 bg-black flex items-center justify-center shrink-0">
                          {prev.type === "image" ? (
                            <img src={prev.url} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <PlayCircle size={16} className="text-white/80" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Video;