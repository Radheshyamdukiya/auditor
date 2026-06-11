import { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2, MapPin, CloudDownload } from "lucide-react";

function Admin_Nev() {
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const fileInputRef = useRef(null);

    async function handleFileUpload(selectedFile) {
        if (!selectedFile) return;
        
        setLoading(true);
        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/admin/upload-city-list`, formData);
            if (res.data.ok) {
                toast.success("City List Uploaded successfully!");
                if (fileInputRef.current) fileInputRef.current.value = "";
            }
        } catch (err) {
            toast.error("Upload failed. Please try again.");
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleDownloadAll() {
        setDownloading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/download-city-list`, {
                responseType: 'blob', 
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'All_City_Centres.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            toast.success("Download completed!");
        } catch (error) {
            toast.error("Download failed.");
        } finally {
            setDownloading(false);
        }
    }

    return (
        <header className="bg-white border-b sticky top-0 z-10">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                
                {/* Tera original single line header */}
                <h1 className="text-lg font-bold text-indigo-600">
                    Admin Portal
                </h1>
                
                <div className="flex items-center gap-4">
                    
                    <input 
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx, .xls, .csv"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e.target.files[0])}
                    />

                    {/* Upload Button with strict loading state */}
                    <button 
                        onClick={() => fileInputRef.current.click()}
                        disabled={loading}
                        className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 disabled:opacity-70 disabled:cursor-wait"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin text-indigo-600" />
                                <span>Uploading...</span>
                            </>
                        ) : (
                            <>
                                <MapPin size={18} className="text-indigo-600" />
                                <span>Upload City List</span>
                            </>
                        )}
                    </button>
                    
                    {/* Attractive Download Button */}
                    <button 
                        onClick={handleDownloadAll}
                        disabled={downloading}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-70 disabled:cursor-wait"
                    >
                        {downloading ? (
                            <>
                                <Loader2 size={18} className="animate-spin text-white" />
                                <span>Downloading...</span>
                            </>
                        ) : (
                            <>
                                <CloudDownload size={18} className="text-white" />
                                <span>Download Data</span>
                            </>
                        )}
                    </button>

                </div>
            </div>
        </header>
    );
}

export default Admin_Nev;