import Video from "../pages/video.upload";

function UploadSection({ title }) {
  return (
    <section className="mb-4 sm:mb-6 px-0 sm:px-2">
      <Video title={title} />
    </section>
  );
}

export default UploadSection;