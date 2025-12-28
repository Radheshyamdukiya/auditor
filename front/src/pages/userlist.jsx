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

function Link_List() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewMedia, setPreviewMedia] = useState(null);

  const username = localStorage.getItem("username");
  const { title } = useParams();

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const isValidUrl = (url) => typeof url === "string" && url.startsWith("http");
  const isVideo = (url) => url.includes("/video/") || url.match(/\.(mp4|webm|ogg)$/i);
  const isImage = (url) => url.includes("/image/") || url.match(/\.(jpg|jpeg|png|gif|webp)$/i);

  useEffect(() => {
    if (!username) return;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/admin/user/list`,
          {
            params: { name: username, title: title },
            withCredentials: true,
          }
        );
        setUsers(res.data.data || []);
      } catch (err) {
        console.error(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [username, title]);


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
      
    
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-indigo-200 shadow-lg">
              MD
            </div>
            <h1 className="text-lg font-bold text-gray-800 tracking-tight">
              Media Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-2">
         
            <span className="px-3 py-1 text-xs sm:text-sm rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold">
              Admin
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-sm text-gray-500 font-medium animate-pulse">Loading gallery...</p>
          </div>
        ) : !users || users.length === 0 ? (
          <div className="text-center text-gray-400 py-20 flex flex-col items-center">
             <div className="text-5xl mb-3 opacity-30">📷</div>
             <p className="text-base">No media uploads found.</p>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {users
              .filter((user) =>
                user.urls?.some((url) => isValidUrl(url) && (isImage(url) || isVideo(url)))
              )
              .map((user, idx) => (
                <article
                  key={idx}
                  className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
                >
             
                  <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                    
                 
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <h2 className="font-bold text-gray-800 text-base sm:text-lg leading-tight truncate max-w-[200px] sm:max-w-xs">
                          {user.name}
                        </h2>
                        <span className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Uploader
                        </span>
                      </div>
                    </div>

                 
                    <div className="flex items-center self-start sm:self-auto gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-200 text-xs text-gray-600 shadow-sm mt-1 sm:mt-0">
                      <CalendarIcon />
                      <span className="font-medium">
                        {formatDateTime(user.createdAt)}
                      </span>
                    </div>
                  </div>

               
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
                            className="group relative w-full aspect-square sm:aspect-[4/3] rounded-lg sm:rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                            onClick={() => openPreview(url, isVid ? 'video' : 'image')}
                          >
                            {isVid ? (
                              <>
                                <video
                                  src={url}
                                  className="w-full h-full object-cover"
                                  preload="metadata"
                                  muted
                                />
                             
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition">
                                   <div className="transform scale-75 sm:scale-100">
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
                                className="w-full h-full object-cover sm:group-hover:scale-105 transition duration-500"
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


      {previewMedia && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-sm p-2 sm:p-4 transition-opacity duration-300"
          onClick={closePreview}
        >
 
          <button 
            onClick={closePreview} 
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white bg-black/50 hover:bg-black/70 p-2.5 rounded-full transition-all z-[70] backdrop-blur-md border border-white/10"
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
                className="max-w-full max-h-[80vh] sm:max-h-[85vh] rounded shadow-2xl outline-none bg-black"
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