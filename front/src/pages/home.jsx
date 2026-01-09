import UserContex from "../../context/UserAuth";
import { useContext, useState } from "react";
import General from "../components/Menu/generl";
import Issue from "../components/Menu/issue";
import CAfeedback from "../components/Menu/cafeedback";
import CheckList from "../components/Menu/checklist";
import StudentFeedback from "../components/Menu/studentfeedback";
const fadeInStyle = {
  animation: "fadeIn 0.4s ease-out forwards",
};
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

function Home() {
  const { data } = useContext(UserContex);
  const [active, setactive] = useState(0);

  const tabs = [
    { name: "General", comp: <General /> },
    { name: "Issue", comp: <Issue /> },
    { name: "CA Feedback", comp: <CAfeedback /> },
    { name: "Student Feedback", comp: <StudentFeedback/> },
    { name: "Checklist", comp: <CheckList /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <style>{styles}</style>

      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 className="text-lg font-bold text-gray-800 tracking-tight">
            Welcome, <span className="text-indigo-600 font-extrabold">{data}</span>
          </h1>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full w-fit">
            Exam Media Dashboard
          </span>
        </div>
      </header>

    
      <div className="max-w-6xl mx-auto px-4 mt-6 sm:mt-8 pb-10">
     
        <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm sticky top-[73px] z-20 sm:static">

          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 px-1 sm:flex-wrap">
            {tabs.map((val, idx) => {
              const isActive = idx === active;
              return (
                <button
                  key={idx}
                  onClick={() => setactive(idx)}
                  className={`
                    relative px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap
                    transition-all duration-300 ease-out select-none
                    ${
                      isActive
                        ? "text-white bg-indigo-600 shadow-lg shadow-indigo-200 transform scale-[1.02]"
                        : "text-gray-600 bg-transparent hover:bg-gray-100 hover:text-indigo-600"
                    }
                  `}
                >
                  {val.name}
                  
                
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white/60 rounded-full mb-1"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

       
        <div className="mt-6">
         
          <div 
            key={active} 
            style={fadeInStyle}
            className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm"
          >
            {tabs[active].comp} 
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;