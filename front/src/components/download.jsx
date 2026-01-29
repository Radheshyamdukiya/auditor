import axios from "axios";
import toast from "react-hot-toast"
function Download({date,city}) {
  const handleDownload = async () => {
    try {
      if(!city || !date){
         toast.error("please select either city or date")
         return
      }



      const response = await axios({
        url: `${import.meta.env.VITE_API_URL}/admin/download-users`,
        method: 'GET',
        responseType: 'blob',
        withCredentials: true,
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'UsersData.xlsx');
      document.body.appendChild(link);
      link.click();
      
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download fail!", error);
      alert("Download nahi ho paya!");
    }
  };

  return (
    <div className="flex justify-center">
      <button
        onClick={handleDownload}
        className="flex items-center justify-center gap-2 bg-blue-600 text-white font-medium py-2 px-3 sm:py-2.5 sm:px-5 rounded-lg shadow-sm text-xs sm:text-sm hover:bg-blue-700 hover:shadow-md active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 sm:h-5 sm:w-5" 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span>Download Sheet</span>
      </button>
    </div>
  );
}

export default Download;