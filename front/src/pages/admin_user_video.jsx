import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

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

const SkeletonLoader = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm animate-pulse mb-6">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => <div key={i} className="aspect-square bg-gray-200 rounded-xl"></div>)}
    </div>
  </div>
);

function Link_List() {
  const [groupedData, setGroupedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [previewMedia, setPreviewMedia] = useState(null);

  const username = localStorage.getItem("username");
  const title = useLocation().state?.title;

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/user/list`, {
        params: { name: username, title: title },
        withCredentials: true,
      });
      
      const data = res.data.data || [];
      const groups = data.reduce((acc, item) => {
        const sub = item.Sub_title || "General";
        if (!acc[sub]) acc[sub] = [];
        item.urls.forEach(url => {
          acc[sub].push({ url, name: item.name, city: item.City, date: item.createdAt });
        });
        return acc;
      }, {});

      setGroupedData(groups);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [username, title]);

  const isVideo = (url) => url.match(/\.(mp4|webm|ogg)$/i) || url.includes("/video/");

  return (
    <section className="min-h-screen bg-gray-50 pb-12 font-sans">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-indigo-200">
              MD
            </div>
            <h1 className="text-lg font-bold text-gray-800 tracking-tight">Media Dashboard</h1>
          </div>
          <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold border border-indigo-100">
            {username || "Admin"}
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <>
            <SkeletonLoader />
            <SkeletonLoader />
          </>
        ) : Object.keys(groupedData).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-3xl border border-dashed border-gray-300 text-center">
            <h3 className="text-lg font-semibold text-gray-800">No Media Uploaded</h3>
            <p className="text-sm text-gray-500 mt-1">It seems there are no files found.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedData).map(([subTitle, items]) => (
              <div key={subTitle} className="space-y-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">{subTitle}</h2>
                  <div className="h-[1px] flex-1 bg-gray-200"></div>
                  <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{items.length} FILES</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {items.map((item, i) => {
                    const isVid = isVideo(item.url);
                    return (
                      <div 
                        key={i} 
                        onClick={() => setPreviewMedia({ url: item.url, type: isVid ? 'video' : 'image', name: item.name })}
                        className="group relative aspect-square bg-white rounded-2xl overflow-hidden cursor-pointer border border-gray-200 hover:border-indigo-400 transition-all shadow-sm"
                      >
                        {isVid ? (
                          <div className="w-full h-full relative">
                            <video src={item.url} className="w-full h-full object-cover opacity-80" muted />
                            <PlayIcon />
                          </div>
                        ) : (
                          <img src={item.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        )}
                        <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                          <p className="text-[10px] text-white font-bold truncate">{item.name}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {previewMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setPreviewMedia(null)}>
          <button className="absolute top-5 right-5 text-white bg-white/10 p-2 rounded-full border border-white/10 z-50">
            <CloseIcon />
          </button>
          <div className="relative w-full max-w-5xl flex flex-col items-center gap-4" onClick={e => e.stopPropagation()}>
            {previewMedia.type === 'video' ? (
              <video src={previewMedia.url} controls autoPlay className="max-w-full max-h-[80vh] rounded-lg shadow-2xl" />
            ) : (
              <img src={previewMedia.url} className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" />
            )}
            <p className="text-white text-xs font-bold bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">Uploaded by: {previewMedia.name}</p>
          </div>
        </div>
      )}
    </section>
  );
}

export default Link_List;