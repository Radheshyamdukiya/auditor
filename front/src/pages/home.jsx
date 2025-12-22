import UserContex from "../../context/UserAuth";
import { useContext } from "react";
import Video_Upload from "./video.upload";

function UploadSection({ title, subtitle }) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
      <div className="mb-4">
        <h3 className="text-sm sm:text-base font-semibold text-gray-800">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {subtitle}
        </p>
      </div>

      <Video_Upload />
    </section>
  );
}

function Home() {
  const { data } = useContext(UserContex);

  return (
    <div className="min-h-screen bg-gray-100">

    
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-base sm:text-lg font-semibold text-gray-800">
            Welcome, <span className="text-indigo-600">{data}</span>
          </h1>

          <span className="text-xs sm:text-sm text-gray-500">
            Exam Media Upload Dashboard
          </span>
        </div>
      </header>

      
      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">

        <UploadSection
          title="Before Exam – Center Preparation"
          subtitle="Gate charts, room charts, seating plan before exam starts."
        />

        <UploadSection
          title="During Exam – Monitoring Proof"
          subtitle="Exam hall photos, invigilators, sealed question packets."
        />

   
        <UploadSection
          title="After Exam – Closing Evidence"
          subtitle="Answer sheet sealing, packet submission, hall clearance."
        />

        <UploadSection
          title="Incident / Special Case (If Any)"
          subtitle="Any issue, incident, or exceptional situation during exam."
        />

      </main>
    </div>
  );
}

export default Home;
