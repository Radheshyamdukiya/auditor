import { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus, Loader2, PlayCircle, ChevronDown, CheckCircle2 } from "lucide-react";

const SUB_MAP = {
  "Before Exam": ["Gate Chart", "Room Chart", "Seating Plan", "Staff Attendance"],
  "During Exam": ["Exam Hall", "Invigilator Photo", "Question Paper", "Attendance Sheet"],
  "After Exam": ["Sheet Sealing", "Packet Submission", "Hall Clearance", "Final Report"]
};

function Video({ title }) {
  const [open, setOpen] = useState(false);
  const [activeSub, setActiveSub] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState({});
  const fileRef = useRef(null);
  const userData = JSON.parse(localStorage.getItem("data"));

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

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

      await axios.post(`${import.meta.env.VITE_API_URL}/user/save-media`, { 
        mediaUrls,title, Sub_title: activeSub, City: userData?.City, Date: userData?.ExamDate 
      }, { withCredentials: true });

      setPreviews(prev => ({
        ...prev,
        [activeSub]: [...(prev[activeSub] || []), ...newPreviews]
      }));
      toast.success("Uploaded successfully");

    } catch (err) {
      toast.error("Upload failed");
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
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-800">{title}</span>
          {hasAnyPreview && <CheckCircle2 size={18} className="text-green-500 animate-in fade-in" />}
        </div>
        <ChevronDown className={`transition-transform duration-300 text-gray-400 ${open ? "rotate-180" : ""}`} />
      </div>

      {open && (
        <div className="p-4 bg-gray-50/50 border-t border-gray-100 animate-in slide-in-from-top-2 duration-300">
          <input ref={fileRef} type="file" multiple className="hidden" onChange={handleFileChange} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {subCategories.map(s => {
              const isDone = previews[s]?.length > 0;
              return (
                <div key={s} className="space-y-2 group">
                  <button
                    onClick={() => { setActiveSub(s); fileRef.current.click(); }}
                    disabled={uploading}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm font-semibold transition-all duration-200 active:scale-95 ${
                      isDone ? "bg-green-50 border-green-200 text-green-700" : "bg-white border-gray-200 text-gray-600 hover:border-indigo-400 hover:shadow-sm"
                    }`}
                  >
                    {s}
                    {uploading && activeSub === s ? <Loader2 className="animate-spin text-indigo-600" size={18} /> : 
                     isDone ? <CheckCircle2 size={18} className="text-green-600" /> : <Plus size={18} className="text-gray-400 group-hover:text-indigo-500" />}
                  </button>
                  
                  {isDone && (
                    <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-1">
                      {previews[s].map((prev, idx) => (
                        <div key={idx} className="relative h-12 w-12 rounded-lg overflow-hidden border border-gray-200 bg-black flex items-center justify-center shrink-0 hover:scale-110 transition-transform">
                          {prev.type === "image" ? (
                            <img src={prev.url} className="w-full h-full object-cover" alt="preview" />
                          ) : (
                            <PlayCircle size={20} className="text-white/80" />
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