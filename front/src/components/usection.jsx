import Video from "../pages/video.upload";

function UploadSection({ title}) {
  return (
    <section className="mb-6 px-2 sm:px-0">
      <Video title={title} />
    </section>
  );
}

export default UploadSection;