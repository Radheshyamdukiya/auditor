import { useNavigate } from "react-router-dom";

function Admin_User_Option() {
  const nav = useNavigate();

function handel_btn(e) {
  let text = e.currentTarget.textContent;

  text = text
    .replace(/→/g, "")   
    .replace(/\s+/g, " ") 
    .trim();

  nav(`/admin/user/${text}`);
}



  const btnClass = "group w-full md:w-96 flex items-center justify-between px-6 py-4 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-700 font-semibold text-lg hover:border-indigo-500 hover:shadow-md hover:bg-indigo-50 transition-all duration-200";

  return (
    <div className="min-h-screen bg-gray-50">
      
      
      <header className="sticky top-0 z-20 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-indigo-600 tracking-tight">
            Media Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-slate-500 font-medium">
              Logged in as
            </span>
            <span className="px-4 py-1.5 text-xs sm:text-sm rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
              Admin
            </span>
          </div>
        </div>
      </header>

      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Exam Management</h2>
          <p className="text-slate-500 mt-1">Select an exam phase to manage users.</p>
        </div>

        <div className="flex flex-col gap-4">
          
          <button onClick={handel_btn} className={btnClass}>
            <span>Before Exam</span>
            <span className="text-gray-400 group-hover:text-indigo-600 transition-colors">→</span>
          </button>

          <button onClick={handel_btn} className={btnClass}>
            <span>During Exam</span>
            <span className="text-gray-400 group-hover:text-indigo-600 transition-colors">→</span>
          </button>

          <button onClick={handel_btn} className={btnClass}>
            <span>After Exam</span>
            <span className="text-gray-400 group-hover:text-indigo-600 transition-colors">→</span>
          </button>

        </div>

      </main>
    </div>
  );
}

export default Admin_User_Option;