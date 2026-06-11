import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

// Helper function media check karne ke liye (Video vs Image)
const checkIsVideo = (url) => {
  if (!url) return false;
  return url.match(/\.(mp4|webm|ogg|mov)$/i) || url.includes('/video/upload/');
};

function CenterGallery() {
  const { centerCode } = useParams(); // URL se center code nikalna
  const nav = useNavigate();
  
  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Filters State
  const [filterUser, setFilterUser] = useState("");
  const [filterDate, setFilterDate] = useState("");

  function formatDate(val) {
    if (!val) return "";
    return new Date(val).toLocaleDateString("en-IN");
  }

  // API se gallery data fetch karna
  useEffect(() => {
    async function fetchGalleryData() {
      try {
        setLoading(true);
        // API URL apne hisaab se adjust kar lena
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/center/gallery/${centerCode}`, {
          withCredentials: true,
        });
        console.log(res)
        
        // Agar response me data array hai
        const dataList = res.data.data || [];
        setRawData(dataList);
      } catch (error) {
        console.error("Error fetching gallery data:", error);
        setRawData([]);
      } finally {
        setLoading(false);
      }
    }
    
    if (centerCode) {
      fetchGalleryData();
    }
  }, [centerCode]);

  // Filtering Logic (User wise aur Date wise)
  const filteredData = useMemo(() => {
    if (!rawData) return [];

    return rawData.filter((item) => {
      const matchUser = filterUser ? item.name === filterUser : true;
      const matchDate = filterDate ? formatDate(item.Date) === filterDate : true;
      return matchUser && matchDate;
    });
  }, [rawData, filterUser, filterDate]);

  // Gallery ke liye Data ko flatten karna (Kyunki ek document me multiple URLs ho sakte hain)
  const galleryItems = useMemo(() => {
    const items = [];
    filteredData.forEach((doc) => {
      if (doc.urls && Array.isArray(doc.urls)) {
        doc.urls.forEach((url) => {
          items.push({
            ...doc, // pura data keep kiya
            mediaUrl: url, // single url extract kar liya grid me show karne ke liye
            isVideo: checkIsVideo(url)
          });
        });
      }
    });
    return items;
  }, [filteredData]);

  // Dropdown options nikalna raw data se
  const availableUsers = useMemo(() => {
    if (!rawData) return [];
    return [...new Set(rawData.map(item => item.name))].filter(Boolean);
  }, [rawData]);

  const availableDates = useMemo(() => {
    if (!rawData) return [];
    return [...new Set(rawData.map(item => formatDate(item.Date)))].filter(Boolean);
  }, [rawData]);

  // Dashboard Metrics
  const uniqueUsersCount = availableUsers.length;
  const totalFilesCount = galleryItems.length;

  return (
    <section className="min-h-screen bg-slate-50 py-10">
      <main className="max-w-7xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <button 
              onClick={() => nav(-1)} 
              className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold mb-2 flex items-center gap-1 transition-colors"
            >
              ← Back to Locations
            </button>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-lg">
                #{centerCode}
              </span>
              Center Media Gallery
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              View all uploaded images and videos for this center.
            </p>
          </div>
        </div>

        {/* Dashboard Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xl">
              📂
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Total Media Files</p>
              <h3 className="text-2xl font-bold text-slate-800">{totalFilesCount}</h3>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center text-xl">
              👤
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Active Auditors</p>
              <h3 className="text-2xl font-bold text-slate-800">{uniqueUsersCount}</h3>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center text-xl">
              📍
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Location City</p>
              <h3 className="text-xl font-bold text-slate-800 truncate">
                {rawData && rawData.length > 0 ? rawData[0].City : "N/A"}
              </h3>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
              Filter by Auditor
            </label>
            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none transition-all"
            >
              <option value="">-- All Auditors --</option>
              {availableUsers.map((user, idx) => (
                <option key={idx} value={user}>{user}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
              Filter by Date
            </label>
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none transition-all"
            >
              <option value="">-- All Dates --</option>
              {availableDates.map((date, idx) => (
                <option key={idx} value={date}>{date}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button 
              onClick={() => { setFilterUser(""); setFilterDate(""); }}
              className="px-4 py-2.5 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors w-full sm:w-auto"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Gallery Grid Section */}
        {loading ? (
          <div className="text-center py-20 text-slate-500 font-medium text-lg flex flex-col items-center justify-center">
             <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
             Loading Media...
          </div>
        ) : galleryItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {galleryItems.map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group flex flex-col">
                
                {/* Media Container */}
                <div className="aspect-video w-full bg-slate-900 relative overflow-hidden">
                  {item.isVideo ? (
                    <video 
                      src={item.mediaUrl} 
                      controls 
                      controlsList="nodownload"
                      className="w-full h-full object-cover"
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img 
                      src={item.mediaUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  )}
                  {/* Badge for Title */}
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md text-white text-[10px] uppercase font-bold px-2 py-1 rounded">
                    {item.title || "Media"}
                  </div>
                </div>

                {/* Info Container */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{item.Sub_title || "No Subtitle"}</h3>
                  
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500">
                    <div>
                      <span className="block font-semibold text-slate-400 uppercase text-[9px]">Uploaded By</span>
                      <span className="font-medium text-slate-700">{item.name || "Unknown"}</span>
                    </div>
                    <div>
                      <span className="block font-semibold text-slate-400 uppercase text-[9px]">Date</span>
                      <span className="font-medium text-slate-700">{formatDate(item.Date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
            <span className="text-4xl block mb-3 opacity-50">📭</span>
            <p className="text-slate-500 text-lg font-medium">No media files found for this criteria.</p>
            <p className="text-slate-400 text-sm mt-1">Try clearing filters or check another center.</p>
          </div>
        )}

      </main>
    </section>
  );
}

export default CenterGallery;