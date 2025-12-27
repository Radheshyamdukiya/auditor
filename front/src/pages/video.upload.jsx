import { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { X, ImageIcon, Plus, CloudUpload } from "lucide-react";

const Card = ({ children, title }) => (
  <div className="w-full mt-2">
    <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
      <CloudUpload className="text-indigo-600" size={20} /> {title}
    </h2>
    {children}
  </div>
);

function Video() {
  const [fileList, setFileList] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'pending'
    }));
    setFileList(prev => [...prev, ...files]);
    fileInputRef.current.value = ""; 
  };

  const startUpload = async () => {
    const pending = fileList.filter(f => f.status === 'pending');
    if (pending.length === 0) return;

    const uploadPromises = pending.map(async (item) => {
      try {
        setFileList(prev => prev.map(f => f.id === item.id ? { ...f, status: 'uploading' } : f));
        const isImg = item.file.type.startsWith("image");
        const mediaType = isImg ? "image" : "video";

        const { data: sign } = await axios.post(`${import.meta.env.VITE_API_URL}/user/upload`, { type: mediaType }, { withCredentials: true });

        const fd = new FormData();
        fd.append("file", item.file);
        fd.append("api_key", sign.apiKey);
        fd.append("timestamp", sign.timestamp);
        fd.append("signature", sign.signature);

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${sign.cloudName}/${mediaType}/upload`, 
          fd, 
          { 
            onUploadProgress: (e) => {
              const p = Math.round((e.loaded * 100) / e.total);
              setFileList(prev => prev.map(f => f.id === item.id ? { ...f, progress: p } : f));
            }
          }
        );

        console.log(`✅ Upload Link (${item.file.name}):`, res.data.secure_url);
        await axios.post(`${import.meta.env.VITE_API_URL}/user/save-media`, { mediaUrls: [res.data.secure_url] }, { withCredentials: true });
        return true;
      } catch (err) {
        console.error("Fail:", item.file.name, err);
        return false;
      }
    });

    await Promise.all(uploadPromises);
    toast.success("Success! List cleared.");
    
    setTimeout(() => {
      setFileList([]);
    }, 800); 
  };

  return (
    <Card title="Media Upload">
      <div className="flex flex-col gap-4">
       
        <div 
          onClick={() => fileInputRef.current.click()} 
          className="w-full border-2 border-dashed border-indigo-200 bg-indigo-50/50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-200 group"
        >
          <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
            <Plus className="text-indigo-600" size={24} />
          </div>
          <span className="text-sm font-semibold text-gray-600 text-center">Tap to add images/videos</span>
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelect} />
        </div>

       
        <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto custom-scrollbar">
          {fileList.map(f => (
            <div key={f.id} className="relative p-3 border border-gray-100 rounded-xl bg-gray-50/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 bg-white rounded-lg border border-gray-100">
                    <ImageIcon size={18} className="text-indigo-500 shrink-0" />
                  </div>
                  <span className="text-sm font-medium truncate text-gray-700">
                    {f.file.name}
                  </span>
                </div>
                <button 
                  onClick={() => setFileList(prev => prev.filter(x => x.id !== f.id))}
                  className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                >
                  <X size={16} className="text-gray-400 hover:text-red-500" />
                </button>
              </div>

           
              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-300 rounded-full" 
                  style={{ width: `${f.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {fileList.length > 0 && (
          <button 
            onClick={startUpload} 
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-95 transition-all"
          >
            Upload Files
          </button>
        )}
      </div>
    </Card>
  );
}

export default Video;