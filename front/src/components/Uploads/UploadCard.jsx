function UploadCard({ title, hint, children }) {
  return (
    <div className="border border-dashed border-gray-300 rounded-xl p-6 bg-gray-50">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        {title}
      </h3>

      {children}

      <p className="mt-2 text-xs text-gray-400">{hint}</p>
    </div>
  );
}

export default UploadCard;
