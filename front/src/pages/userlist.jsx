/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";

function Link_List() {
  const [users, setUsers] = useState(null);
  const username = localStorage.getItem("username");
console.log(username);
  const getTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isValidUrl = (url) =>
    typeof url === "string" && url.startsWith("http");

  const isVideo = (url) =>
    url.includes("/video/") || url.match(/\.(mp4|webm|ogg)$/i);

  const isImage = (url) =>
    url.includes("/image/") || url.match(/\.(jpg|jpeg|png|gif|webp)$/i);

  useEffect(() => {
    if (!username) return;

    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/admin/user/list`,
          {
            params: { name: username },
            withCredentials: true,
          }
        );
        setUsers(res.data.data);
      } catch (err) {
        console.log(err.response?.data?.message || err.message);
      }
    };

    fetchUsers();
  }, [username]);

  return (
    <section className="min-h-screen bg-slate-50">
   
      <header className="sticky top-0 z-20 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-base sm:text-lg font-semibold text-indigo-600">
            Media Dashboard
          </h1>

          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-sm text-slate-500">
              Logged in as
            </span>
            <span className="px-3 py-1 text-sm rounded-full bg-indigo-50 text-indigo-700 font-medium">
              {"Admin"}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
        {!users ? (
          <div className="text-center text-slate-500 py-24">
            Loading media…
          </div>
        ) : (
          users
            .filter((user) =>
              user.urls?.some(
                (url) =>
                  isValidUrl(url) && (isImage(url) || isVideo(url))
              )
            )
            .map((user, idx) => (
              <article
                key={idx}
                className="bg-white rounded-xl border border-slate-200 mb-6 shadow-sm hover:shadow-md transition"
              >
              
                <div className="px-4 py-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <h2 className="font-medium text-slate-800">
                    {user.name}
                  </h2>
                  <span className="text-xs text-slate-500">
                    Uploaded at {getTime(user.createdAt)}
                  </span>
                </div>

                <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {user.urls
                    .filter(
                      (url) =>
                        isValidUrl(url) &&
                        (isImage(url) || isVideo(url))
                    )
                    .map((url, i) => (
                      <div
                        key={i}
                        className="relative w-full aspect-video rounded-lg overflow-hidden bg-black ring-1 ring-slate-200"
                      >
                        {isVideo(url) ? (
                          <video
                            src={url}
                            controls
                            preload="metadata"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <img
                            src={url}
                            alt="media"
                            loading="lazy"
                            className="w-full h-full object-cover hover:scale-105 transition"
                          />
                        )}
                      </div>
                    ))}
                </div>
              </article>
            ))
        )}
      </main>
    </section>
  );
}

export default Link_List;
