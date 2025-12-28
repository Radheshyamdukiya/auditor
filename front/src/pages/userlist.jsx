import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

// --- Icons Components for better look ---
const PlayIcon = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 shadow-lg">
      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
    </div>
  </div>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

// --- Skeleton Loader for Premium Feel ---
const SkeletonLoader = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm animate-pulse mb-6">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="aspect-square bg-gray-200 rounded-xl"></div>
      <div className="aspect-square bg-gray-200 rounded-xl"></div>
      <div className="aspect-square bg-gray-200 rounded-xl hidden md:block"></div>
      <div className="aspect-square bg-gray-200 rounded-xl hidden md:block"></div>
    </div>
  </div>
);

function Link_List() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewMedia, setPreviewMedia] = useState(null);

  const username = localStorage.getItem("username");
  const { title } = useParams();

  // Date formatter for consistent look
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/user/list`, {
        params: { name: username, title: title },
        withCredentials: true,
      });
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [username, title]);

  // Helper functions
  const isVideo = (url) => url.match(/\.(mp4|webm|ogg)$/i) || url.includes("/video/");
  const isValidUrl = (url) => typeof url === "string" && url.startsWith("http");

  return (
    <section className="min-h-screen bg-gray-50 pb-12 font-sans">
      
      {/* --- Header (Clean & Sticky) --- */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-indigo-200">
              MD
            </div>
            <h1 className="text-lg font-bold text-gray-800 tracking-tight">Media Dashboard</h1>
          </div>
          {/* Admin Tag */}
          <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold border border-indigo-100">
            {username || "Admin"}
          </span>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {loading ? (
          <>
            <SkeletonLoader />
            <SkeletonLoader />
          </>
        ) : users.length === 0 ? (
          // --- No Data Found (Beautiful UI) ---
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-3xl border border-dashed border-gray-300 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">No Media Uploaded</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-xs">It seems there are no images or videos uploaded for this user yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {users.map((user, idx) => (
              <article 
                key={idx} 
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                {/* User Info Header */}
                <div className="px-5 py-4 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-800 text-base">{user.name}</h2>
                      <p className="text-xs text-gray-500 font-medium">{formatDate(user.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Media Grid */}
                <div className="p-5">
                  {(!user.urls || user.urls.length === 0) ? (
                    <div className="text-center py-10 text-gray-400 text-sm italic">
                      No specific media files found in this entry.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                      {user.urls.map((url, i) => {
                        if (!isValidUrl(url)) return null;
                        const isVid = isVideo(url);
                        
                        return (
                          <div 
                            key={i} 
                            onClick={() => setPreviewMedia({ url, type: isVid ? 'video' : 'image' })}
                            className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer border border-gray-200 hover:border-indigo-300 transition-all duration-300"
                          >
                            {isVid ? (
                              <>
                                <video src={url} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" muted />
                                <PlayIcon />
                                <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-bold backdrop-blur-sm">VIDEO</span>
                              </>
                            ) : (
                              <img 
                                src={url} 
                                alt="upload" 
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                              />
                            )}
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* --- Full Screen Preview Modal --- */}
      {previewMedia && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewMedia(null)}
        >
          {/* Close Button */}
          <button 
            onClick={() => setPreviewMedia(null)}
            className="absolute top-5 right-5 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all z-50 border border-white/10"
          >
            <CloseIcon />
          </button>

          <div 
            className="relative w-full max-w-5xl max-h-[90vh] flex items-center justify-center"
            onClick={e => e.stopPropagation()}
          >
            {previewMedia.type === 'video' ? (
              <video 
                src={previewMedia.url} 
                controls 
                autoPlay 
                className="max-w-full max-h-[85vh] rounded-lg shadow-2xl bg-black outline-none"
              />
            ) : (
              <img 
                src={previewMedia.url} 
                alt="preview" 
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
            )}
          </div>
        </div>
      )}

    </section>
  );
}

export default Link_List;