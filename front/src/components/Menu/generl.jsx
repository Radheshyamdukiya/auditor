import UploadSection from "../uploadsection";
function General(){
    return(
        <>
        <div>

            
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
        </>
    )
}
export default General;