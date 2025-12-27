import Video from "../pages/video.upload";

function UploadSection({ title, subtitle }) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 mb-6">
      <div className="mb-4">
        <h3 className="text-base sm:text-lg font-bold text-gray-800">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {subtitle}
        </p>
      </div>

      <Video/>
    </section>
  );
}
export default UploadSection;