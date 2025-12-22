import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";
import UploadCard from "../components/Uploads/UploadCard";

function Video_Upload() {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState({});
  const [done, setDone] = useState(false);

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1280,
      useWebWorker: true,
    };
    return await imageCompression(file, options);
  };

  const upload = async () => {
    if (files.length === 0) {
      toast.error("Please select files");
      return;
    }

    const toastId = toast.loading("Uploading media…");

    try {
      const urls = [];

      for (const file of files) {
        const isImage = file.type.startsWith("image");
        const type = isImage ? "image" : "video";

        let uploadFile = file;
        if (isImage) uploadFile = await compressImage(file);

        const signRes = await axios.post(
          `${import.meta.env.VITE_API_URL}/user/upload`,
          { type },
          { withCredentials: true }
        );

        const { signature, timestamp, apiKey, cloudName } = signRes.data;

        const formData = new FormData();
        formData.append("file", uploadFile);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);

        const uploadUrl =
          type === "image"
            ? `https://api.cloudinary.com/v1_1/${cloudName}/image/upload?q_auto=eco&f_auto`
            : `https://api.cloudinary.com/v1_1/${cloudName}/video/upload?q_auto=eco&f_auto`;

        const uploadRes = await axios.post(uploadUrl, formData, {
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / e.total);
            setProgress({ [file.name]: percent });
          },
        });

        urls.push(uploadRes.data.secure_url);
      }

      await axios.post(
        `${import.meta.env.VITE_API_URL}/user/save-media`,
        { mediaUrls: urls },
        { withCredentials: true }
      );

      toast.success("Upload completed", { id: toastId });
      setDone(true);
      setFiles([]);
      setProgress({});
    } catch {
      toast.error("Upload failed", { id: toastId });
    }
  };


  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-6">
        <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xl">
          ✓
        </div>
        <p className="text-sm text-gray-700 font-medium">
          Media uploaded successfully
        </p>
        <button
          onClick={() => setDone(false)}
          className="text-sm text-indigo-600 hover:underline"
        >
          Upload more
        </button>
      </div>
    );
  }

  return (
    <UploadCard title="Media Upload" hint="Upload images or videos">
      <div className="flex flex-col gap-4">

    
        <label className="w-full">
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => setFiles(Array.from(e.target.files))}
          />
          <div className="w-full py-3 rounded-lg border border-dashed border-indigo-300 bg-indigo-50 text-center text-sm font-medium text-indigo-700 cursor-pointer hover:bg-indigo-100 transition">
            Select files
          </div>
        </label>

        <button
          onClick={upload}
          className="w-full py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
        >
          Upload
        </button>

   
        {Object.keys(progress).length > 0 && (
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Uploading…</span>
              <span>{Object.values(progress)[0]}%</span>
            </div>
            <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${Object.values(progress)[0]}%` }}
              />
            </div>
          </div>
        )}

      </div>
    </UploadCard>
  );
}

export default Video_Upload;
