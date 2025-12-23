import { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Upload, X, FileVideo, Image as ImageIcon, CheckCircle, Loader2, Plus, AlertCircle, Trash2 } from "lucide-react";


const UploadCard = ({ children, title, hint }) => (
  <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300">
    <div className="p-5 sm:p-6 bg-white">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h2>
      </div>
      {hint && <p className="text-sm text-gray-500 mb-6">{hint}</p>}
      {children}
    </div>
  </div>
);

function Video_Upload() {
  const [fileList, setFileList] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      const uniqueFiles = newFiles.filter(newFile => 
        !fileList.some(existing => 
          existing.file.name === newFile.name && existing.file.size === newFile.size
        )
      );

      if (uniqueFiles.length < newFiles.length) {
        toast("Duplicate files skipped");
      }

      if (uniqueFiles.length > 0) {
        const mappedFiles = uniqueFiles.map(file => ({
          id: Math.random().toString(36).substring(7),
          file: file,
          status: 'pending',
          progress: 0
        }));
        setFileList((prev) => [...prev, ...mappedFiles]);
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (id) => {
    setFileList((prev) => prev.filter((item) => item.id !== id));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const updateFileState = (id, updates) => {
    setFileList(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const upload = async () => {
    const filesToUpload = fileList.filter(f => f.status === 'pending' || f.status === 'error');
    if (filesToUpload.length === 0) return;

    filesToUpload.forEach(item => updateFileState(item.id, { status: 'uploading', progress: 0 }));
    processUploadQueue(filesToUpload);
  };

  const processUploadQueue = async (queue) => {
    for (const item of queue) {
      try {
        console.log(`🚀 Starting upload for: ${item.file.name}`); 

        const file = item.file;
        const isImage = file.type.startsWith("image");
        const type = isImage ? "image" : "video";

        const signRes = await axios.post(
          `${import.meta.env.VITE_API_URL}/user/upload`,
          { type },
          { withCredentials: true }
        );

        const { signature, timestamp, apiKey, cloudName } = signRes.data;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);

        const uploadUrl = type === "image"
            ? `https://api.cloudinary.com/v1_1/${cloudName}/image/upload?q_auto=eco&f_auto`
            : `https://api.cloudinary.com/v1_1/${cloudName}/video/upload?q_auto=eco&f_auto`;

        const uploadRes = await axios.post(uploadUrl, formData, {
          onUploadProgress: (e) => {
            if (e.total) {
              const percent = Math.round((e.loaded * 100) / e.total);
              updateFileState(item.id, { progress: percent });
            }
          },
        });

        const secureUrl = uploadRes.data.secure_url;
        
        if (!secureUrl) throw new Error("Failed to get download link from Cloudinary");

        console.log(`Upload success for ${item.file.name}:`, secureUrl); 

       
        updateFileState(item.id, { status: 'success', progress: 100 });

        try {
          await axios.post(
            `${import.meta.env.VITE_API_URL}/user/save-media`,
            { mediaUrls: [secureUrl] },
            { withCredentials: true }
          );
          console.log(`💾 Saved to backend: ${item.file.name}`); 
        } catch (saveError) {
          console.error(`Backend Sync Error for ${item.file.name}:`, saveError);
          
          toast.error("Saved to cloud, but sync failed.");
        }

      } catch (err) {
        console.error(` Critical Upload Error for ${item.file.name}:`, err);
        updateFileState(item.id, { status: 'error', progress: 0 });
        toast.error(`Upload failed: ${item.file.name}`);
      }
    }
  };

  const pendingCount = fileList.filter(f => f.status === 'pending' || f.status === 'error').length;
  const hasFiles = fileList.length > 0;
  const allSuccess = hasFiles && pendingCount === 0;

  return (
    <UploadCard title="Media Upload" hint="Add images or videos to your gallery">
      <div className="flex flex-col gap-5">
        
        {/* Top Add Box */}
        <div className="relative group">
          <label className={`
            flex flex-col items-center justify-center w-full 
            ${hasFiles ? 'h-24 bg-gray-50 border-gray-200' : 'h-48 bg-indigo-50/50 border-indigo-200'}
            border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300
            active:scale-[0.98] hover:border-indigo-400 hover:bg-indigo-50
          `}>
            <div className="flex flex-col items-center justify-center pt-2 pb-3">
              <div className={`
                p-3 rounded-full mb-2 transition-transform duration-300 
                ${hasFiles ? 'bg-white text-indigo-500 shadow-sm scale-90' : 'bg-indigo-100 text-indigo-600 group-hover:scale-110'}
              `}>
                {hasFiles ? <Plus size={24} /> : <Upload size={32} />}
              </div>
              <p className="text-sm font-semibold text-gray-700">
                {hasFiles ? "Add more files" : "Tap to select files"}
              </p>
              {!hasFiles && <p className="text-xs text-gray-400 mt-1">Images & Videos supported</p>}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>
        </div>

        {/* File List */}
        {hasFiles && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between px-1">
              <span className="text-sm font-semibold text-gray-700">
                Your Files ({fileList.length})
              </span>
              {/* Clear Button shows only if something is uploaded */}
              {fileList.some(f => f.status === 'success') && !allSuccess && (
                <button 
                  onClick={() => setFileList(prev => prev.filter(f => f.status !== 'success'))}
                  className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full active:scale-95 transition-transform"
                >
                  Clear uploaded
                </button>
              )}
              {allSuccess && (
                <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full flex items-center gap-1.5">
                   <CheckCircle size={14} strokeWidth={2.5} /> All Done
                 </span>
              )}
            </div>
            
            <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-1 pb-2">
              {fileList.map((item) => (
                <div 
                  key={item.id} 
                  className={`
                    relative flex items-center justify-between p-3.5 rounded-xl border-2 transition-all duration-300 overflow-hidden
                    ${item.status === 'uploading' 
                      ? 'border-indigo-100 bg-white' 
                      : item.status === 'success' 
                        ? 'border-green-500 bg-green-50 shadow-sm scale-[1.01]' // Full Green Border
                        : item.status === 'error' 
                          ? 'border-red-200 bg-red-50'
                          : 'border-gray-100 bg-white'
                    }
                  `}
                >
                  {/* Progress Bar Background */}
                  {item.status === 'uploading' && (
                    <div 
                      className="absolute bottom-0 left-0 h-1 bg-indigo-500 transition-all duration-300 rounded-r-full"
                      style={{ width: `${item.progress}%` }}
                    />
                  )}

                  <div className="flex items-center gap-3.5 min-w-0 flex-1 z-10">
                    {/* Icon Box */}
                    <div className={`
                      w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300
                      ${item.status === 'success' 
                        ? 'bg-green-500 text-white shadow-md shadow-green-200 rotate-0' // Solid Green Box
                        : item.status === 'error' 
                          ? 'bg-red-100 text-red-500'
                          : 'bg-gray-100 text-gray-500'
                      }
                    `}>
                      {item.status === 'success' ? <CheckCircle size={24} strokeWidth={2.5} /> : 
                       item.status === 'error' ? <AlertCircle size={24} /> :
                       item.file.type.startsWith("image") ? <ImageIcon size={24} /> : <FileVideo size={24} />}
                    </div>

                    {/* Text Info */}
                    <div className="flex flex-col min-w-0 gap-0.5">
                      <p className={`text-sm font-semibold truncate pr-2 ${item.status === 'success' ? 'text-green-900' : 'text-gray-800'}`}>
                        {item.file.name}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${item.status === 'success' ? 'text-green-700' : 'text-gray-400'}`}>
                          {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                        
                        {/* Status Badges */}
                        {item.status === 'uploading' && (
                          <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-md">
                            <Loader2 size={10} className="animate-spin" /> {item.progress}%
                          </span>
                        )}
                        {item.status === 'success' && (
                          <span className="text-xs font-bold text-white bg-green-500 px-2 py-0.5 rounded-md shadow-sm">
                            Uploaded
                          </span>
                        )}
                        {item.status === 'error' && (
                          <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-md">
                            Failed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="pl-2 z-10 flex items-center">
                    {(item.status === 'pending' || item.status === 'error') && (
                      <button
                        onClick={() => removeFile(item.id)}
                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-95"
                      >
                         <Trash2 size={20} />
                      </button>
                    )}
                    {item.status === 'success' && (
                       <button
                        onClick={() => removeFile(item.id)}
                        className="p-2 text-green-600 hover:bg-green-200/50 rounded-xl transition-all"
                        title="Remove from list"
                      >
                         <X size={20} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Button - Shows only when pending files exist */}
        {pendingCount > 0 && (
          <div className="pt-2 animate-in slide-in-from-bottom-2 fade-in">
            <button
              onClick={upload}
              className={`
                w-full py-4 px-4 rounded-xl flex items-center justify-center gap-2.5
                text-base font-bold text-white shadow-lg shadow-indigo-200 
                bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all
              `}
            >
              <Upload size={20} />
              Upload {pendingCount} {pendingCount === 1 ? 'File' : 'Files'}
            </button>
          </div>
        )}
      </div>
    </UploadCard>
  );
}

export default Video_Upload;