import axios from "axios";
import { useEffect, useState, useContext } from "react";
import UserContex from "../../../context/UserAuth";

function CheckList() {
    const [completedItems, setCompletedItems] = useState([]);
    const [userData, setUserData] = useState(null);
    
    const user = useContext(UserContex);
    const { data: name } = user;

    const expectedTasks = {
        "Before Exam": ["Gate Chart", "Room Chart", "Seating Plan", "Staff Attendance"],
        "During Exam": ["Exam Hall", "Invigilator Photo", "Question Paper", "Attendance Sheet"],
        "After Exam": ["Sheet Seating", "Packet Submission", "Hall Clearance", "Final Report"]
    };

    useEffect(() => {
        const c_data = JSON.parse(localStorage.getItem('data'));
        setUserData(c_data);

        async function fatchData() {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/all-data`, {
                    params: { name },
                    withCredentials: true
                });
                
                if(res.data && res.data.list){
                    setCompletedItems(res.data.list);
                }
            } catch (error) {
                console.error(error);
            }
        }
        fatchData();
    }, [name]);

    const getStatus = (category, subTitle) => {
        const found = completedItems.find(item => 
            item.title === category && item.sub_title === subTitle
        );
        return found ? true : false;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-3 md:p-6 font-sans">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center text-gray-800">
                    Exam Checklist
                </h1>

                {userData && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div className="flex flex-row sm:flex-col justify-between sm:justify-center items-center border-b sm:border-b-0 sm:border-r border-blue-200 pb-2 sm:pb-0 last:border-0">
                            <span className="text-xs md:text-sm text-blue-600 font-semibold uppercase tracking-wide">Exam Date</span>
                            <span className="text-base md:text-lg font-bold text-blue-800">
                                {new Date(userData.ExamDate).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex flex-row sm:flex-col justify-between sm:justify-center items-center border-b sm:border-b-0 sm:border-r border-blue-200 pb-2 sm:pb-0 last:border-0">
                            <span className="text-xs md:text-sm text-blue-600 font-semibold uppercase tracking-wide">Student Entry</span>
                            <span className="text-base md:text-lg font-bold text-blue-800">{userData.Student_Entry_Time}</span>
                        </div>
                        <div className="flex flex-row sm:flex-col justify-between sm:justify-center items-center">
                            <span className="text-xs md:text-sm text-blue-600 font-semibold uppercase tracking-wide">Exam Start</span>
                            <span className="text-base md:text-lg font-bold text-blue-800">{userData.Exam_Starting_Time}</span>
                        </div>
                    </div>
                )}

                <div className="space-y-5 md:space-y-6">
                    {Object.keys(expectedTasks).map((category) => (
                        <div key={category} className="bg-white border rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-gray-100 px-4 py-3 border-b">
                                <h2 className="text-base md:text-lg font-bold text-gray-700">{category}</h2>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {expectedTasks[category].map((task, index) => {
                                    const isDone = getStatus(category, task);
                                    
                                    return (
                                        <div key={index} className={`flex items-center justify-between p-3 md:p-4 transition-colors ${isDone ? 'bg-green-50' : 'bg-red-50'}`}>
                                            <span className={`text-sm md:text-base font-medium ${isDone ? 'text-green-800' : 'text-red-800'}`}>
                                                {task}
                                            </span>
                                            
                                            <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold border whitespace-nowrap ml-2 ${
                                                isDone 
                                                ? 'bg-green-200 text-green-900 border-green-300' 
                                                : 'bg-red-200 text-red-900 border-red-300'
                                            }`}>
                                                {isDone ? "COMPLETED" : "PENDING"}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {completedItems.some(item => item.title === 'Issue') && (
                    <div className="mt-6 md:mt-8 border border-yellow-300 bg-yellow-50 rounded-xl p-4 shadow-sm">
                        <h2 className="text-base md:text-lg font-bold text-yellow-800 mb-2 flex items-center gap-2">
                            <span>⚠️</span> Reported Issues
                        </h2>
                        <ul className="list-disc pl-5 space-y-1">
                            {completedItems.filter(item => item.title === 'Issue').map((issue, idx) => (
                                <li key={idx} className="text-sm md:text-base text-yellow-900 font-medium">
                                    {issue.sub_title}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CheckList;