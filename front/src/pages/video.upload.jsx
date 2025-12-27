import { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { X, ImageIcon, Plus, CloudUpload } from "lucide-react";

const Card = ({ children, title }) => (
  <div className="w-[95%] sm:w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-5 sm:p-6 mt-6 mb-6">
    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
      <CloudUpload className="text-indigo-600" /> {title}
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
          className="border-2 border-dashed border-indigo-100 rounded-2xl p-6 flex flex-col items-center cursor-pointer hover:bg-indigo-50 active:scale-95 transition-all"
        >
          <Plus className="text-indigo-500 mb-1" size={32} />
          <span className="text-sm font-bold text-gray-500 text-center">Tap to add images/videos</span>
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelect} />
        </div>

       
        <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto custom-scrollbar">
          {fileList.map(f => (
            <div key={f.id} className="relative p-3 border border-gray-100 rounded-xl bg-white shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 overflow-hidden">
                  <ImageIcon size={16} className="text-indigo-400 shrink-0" />
                  <span className="text-xs font-semibold truncate max-w-[150px] sm:max-w-[200px] text-gray-700">
                    {f.file.name}
                  </span>
                </div>
                <button 
                  onClick={() => setFileList(prev => prev.filter(x => x.id !== f.id))}
                  className="p-1 hover:bg-red-50 rounded-lg"
                >
                  <X size={16} className="text-gray-400 hover:text-red-500" />
                </button>
              </div>

           
              <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-300" 
                  style={{ width: `${f.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {fileList.length > 0 && (
          <button 
            onClick={startUpload} 
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg active:scale-95 transition-all"
          >
            Upload
          </button>
        )}
      </div>
    </Card>
  );
}

export default Video;