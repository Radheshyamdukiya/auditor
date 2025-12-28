import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="rgba(255,255,255,0.8)" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
);
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);
const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
);
const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-2 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      <div className="aspect-square bg-gray-200 rounded-lg"></div>
      <div className="aspect-square bg-gray-200 rounded-lg"></div>
      <div className="aspect-square bg-gray-200 rounded-lg hidden md:block"></div>
    </div>
  </div>
);

function Link_List() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Dedicated Error State
  const [previewMedia, setPreviewMedia] = useState(null);

  const username = localStorage.getItem("username");
  const { title } = useParams();

console.log(title);
  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      }).format(date);
    } catch (e) {
      console.log(e)
      return dateString;
    }
  };

  const isValidUrl = (url) => typeof url === "string" && url.startsWith("http");
  const isVideo = (url) => url.includes("/video/") || url.match(/\.(mp4|webm|ogg)$/i);
  const isImage = (url) => url.includes("/image/") || url.match(/\.(jpg|jpeg|png|gif|webp)$/i);

  const fetchUsers = async () => {
    if (!username) {
        setLoading(false);
        return;
    }

    setLoading(true);
    setError(null); 

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/user/list`,
        {
          params: { name: username, title: title },
          withCredentials: true,
        }
      );
      
   
      if (res.data && Array.isArray(res.data.data)) {
        setUsers(res.data.data);
      } else {
       
        console.warn("Unexpected API response structure:", res.data);
        setUsers([]); 
      }

    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.response?.data?.message || "Failed to load media. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [username, title]);

  // Modal Control
  const openPreview = (url, type) => {
    setPreviewMedia({ url, type });
    document.body.style.overflow = 'hidden';
  };

  const closePreview = () => {
    setPreviewMedia(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <section className="min-h-screen bg-gray-50 font-sans pb-10">
      
      {/* --- Sticky Header --- */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-200">
              MD
            </div>
            <h1 className="text-lg font-bold text-gray-800 tracking-tight">
              Media Dashboard
            </h1>
          </div>
          <span className="px-3 py-1 text-xs sm:text-sm rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold">
            Admin
          </span>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        
        {/* State 1: Loading (Skeleton UI) */}
        {loading && (
          <div className="space-y-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* State 2: Error */}
        {!loading && error && (
          <div className="text-center py-20 bg-white rounded-xl border border-red-100 shadow-sm">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <button 
              onClick={fetchUsers}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
            >
              <RefreshIcon /> Try Again
            </button>
          </div>
        )}

        {/* State 3: Empty Data */}
        {!loading && !error && users.length === 0 && (
          <div className="text-center text-gray-400 py-24 flex flex-col items-center bg-white rounded-xl border border-dashed border-gray-300">
             <div className="text-5xl mb-3 opacity-30">📷</div>
             <p className="text-base font-medium text-gray-500">No media found</p>
             <p className="text-sm">Uploads will appear here</p>
          </div>
        )}

        {/* State 4: Data Loaded */}
        {!loading && !error && users.length > 0 && (
          <div className="space-y-6 sm:space-y-8">
            {users
              .filter((user) =>
                user.urls?.some((url) => isValidUrl(url) && (isImage(url) || isVideo(url)))
              )
              .map((user, idx) => (
                <article
                  key={idx}
                  className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  {/* User Info Header */}
                  <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="font-bold text-gray-800 text-base sm:text-lg leading-tight truncate max-w-[200px] sm:max-w-xs">
                          {user.name}
                        </h2>
                        <span className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Uploader
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center self-start sm:self-auto gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-200 text-xs text-gray-600 shadow-sm">
                      <CalendarIcon />
                      <span className="font-medium">
                        {formatDateTime(user.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Media Grid */}
                  <div className="p-4 sm:p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                    {user.urls
                      .filter(
                        (url) => isValidUrl(url) && (isImage(url) || isVideo(url))
                      )
                      .map((url, i) => {
                         const isVid = isVideo(url);
                         return (
                          <div
                            key={i}
                            className="group relative w-full aspect-square sm:aspect-[4/3] rounded-lg sm:rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm cursor-pointer"
                            onClick={() => openPreview(url, isVid ? 'video' : 'image')}
                          >
                            {isVid ? (
                              <>
                                <video
                                  src={url}
                                  className="w-full h-full object-cover opacity-95"
                                  preload="metadata"
                                  muted
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition">
                                   <div className="transform scale-75 sm:scale-100 transition-transform duration-300 group-hover:scale-110">
                                     <PlayIcon />
                                   </div>
                                </div>
                                <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/60 text-white text-[9px] sm:text-[10px] rounded backdrop-blur-md font-bold tracking-wide">
                                  VIDEO
                                </div>
                              </>
                            ) : (
                              <img
                                src={url}
                                alt="media"
                                loading="lazy"
                                className="w-full h-full object-cover transition duration-500 hover:scale-105"
                              />
                            )}
                          </div>
                        );
                      })}
                  </div>
                </article>
              ))}
          </div>
        )}
      </main>

      {/* --- Full Screen Modal (Lightbox) --- */}
      {previewMedia && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-200"
          onClick={closePreview}
        >
          <button 
            onClick={closePreview} 
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all z-[70] backdrop-blur-md border border-white/10"
          >
            <CloseIcon />
          </button>

          <div 
            className="relative max-w-5xl w-full max-h-[85vh] flex items-center justify-center rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()} 
          >
            {previewMedia.type === 'video' ? (
              <video
                src={previewMedia.url}
                controls
                autoPlay
                className="max-w-full max-h-[80vh] sm:max-h-[85vh] rounded shadow-2xl bg-black"
              />
            ) : (
              <img
                src={previewMedia.url}
                alt="Full Preview"
                className="max-w-full max-h-[80vh] sm:max-h-[85vh] object-contain rounded shadow-2xl"
              />
            )}
          </div>
        </div>
      )}

    </section>
  );
}

export default Link_List;