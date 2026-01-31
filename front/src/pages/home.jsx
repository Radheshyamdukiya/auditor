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
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
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
    <div className="min-h-screen bg-[#f9fafb]">
      <style>{styles}</style>

      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-base sm:text-lg font-bold text-gray-800">
            Hi, <span className="text-indigo-600">{data || "User"}</span>
          </h1>
          <span className="hidden sm:inline-block text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-gray-200 px-2 py-1 rounded-md">
            Exam Dashboard
          </span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-0 sm:px-4 mt-2 sm:mt-8 pb-10">
        
        <div className="sticky top-[64px] z-20 bg-white sm:bg-transparent border-b sm:border-none border-gray-100">
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-3 px-4 sm:px-0 sm:flex-wrap">
            {tabs.map((val, idx) => {
              const isActive = idx === active;
              return (
                <button
                  key={idx}
                  onClick={() => setactive(idx)}
                  className={`
                    px-5 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap
                    transition-all duration-200 select-none
                    ${isActive 
                      ? "text-white bg-indigo-600 shadow-md shadow-indigo-100" 
                      : "text-gray-500 bg-gray-100 sm:bg-white sm:border sm:border-gray-200 hover:bg-gray-200"}
                  `}
                >
                  {val.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 sm:mt-6 px-4 sm:px-0">
          <div 
            key={active} 
            style={fadeInStyle}
            className="sm:bg-white sm:border sm:border-gray-200 sm:rounded-3xl sm:p-8 sm:shadow-sm"
          >
            {tabs[active].comp}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;