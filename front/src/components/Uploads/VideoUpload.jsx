function UploadCard({ title, hint }) {
  return (
    <div className="border border-dashed border-gray-300 rounded-xl p-5 bg-gray-50">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        {title}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {/* File input */}
        <input
          type="file"
          multiple
          className="md:col-span-1 block w-full text-sm text-gray-600
          file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0
          file:text-sm file:font-medium
          file:bg-indigo-600 file:text-white
          hover:file:bg-indigo-700 cursor-pointer"
        />

        {/* Remarks */}
        <textarea
          placeholder="Remarks"
          className="md:col-span-1 w-full h-10 md:h-full resize-none rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        {/* Upload button */}
        <div className="md:col-span-1 flex flex-col gap-2">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-full shadow"
          >
            Upload (0)
          </button>
          <span className="text-xs text-gray-400">
            {hint}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Video_Upload() {
  return (
    <div className="space-y-6">

      <UploadCard
        title="Gate Charts Displayed"
        hint="No file saved yet"
      />

      <UploadCard
        title="Room Charts Displayed"
        hint="No file saved yet"
      />

      <UploadCard
        title="Exam Hall Photo (5–7)"
        hint="Upload multiple photos"
      />

      <UploadCard
        title="Sealed Question Packets"
        hint="No file saved yet"
      />

    </div>
  );
}
