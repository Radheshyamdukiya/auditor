import { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Upload, Loader2, FileSpreadsheet, CheckCircle } from "lucide-react";

function User_Data_Upload() {
    const [file, setfile] = useState(null);
    const [loading, setloading] = useState(false);
    const fileinput = useRef(null);

    async function submitFile() {
        if (file === null) {
            toast.error("Please select a file");
            return;
        }

        setloading(true);
        const user_file = new FormData();
        user_file.append("file", file);

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/admin/upload-file`, user_file);
            if (res.data.ok) {
                toast.success("File Uploaded successfully");
                setfile(null);
                if(fileinput.current) fileinput.current.value = "";
            }
        } catch (err) {
            toast.error("Something went wrong, file not uploaded");
            console.log(err);
        } finally {
            setloading(false);
        }
    }

    return (
        <div className="max-w-3xl mx-auto my-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                
                <div className="flex items-center gap-3 w-full sm:w-auto border-b sm:border-b-0 pb-3 sm:pb-0 border-gray-100">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <FileSpreadsheet size={24} />
                    </div>
                    <div>
                        <p className="text-gray-800 font-bold text-base">Select Auditor Data</p>
                        <p className="text-xs text-gray-500">Upload Data To Database</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    
                    <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-100 flex-1 sm:flex-none">
                        <Upload 
                            size={32} 
                            className="cursor-pointer text-blue-600 bg-white p-1.5 rounded-md shadow-sm hover:bg-blue-50 transition-colors" 
                            onClick={() => fileinput.current.click()} 
                        />
                        
                        <input 
                            ref={fileinput} 
                            accept=".xlsx,.xls,.csv" 
                            className="hidden" 
                            type="file" 
                            name="exam-data" 
                            onChange={(e) => setfile(e.target.files[0])} 
                        />

                        <div className="flex items-center gap-1 overflow-hidden max-w-[120px]">
                            {file ? (
                                <>
                                    <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                                    <span className="text-xs font-medium text-gray-700 truncate">{file.name}</span>
                                </>
                            ) : (
                                <span className="text-xs text-gray-400">No file chosen</span>
                            )}
                        </div>
                    </div>

                    {!loading ? (
                        <button 
                            onClick={submitFile} 
                            disabled={!file}
                            className={`
                                py-2 px-4 text-sm font-semibold text-white rounded-lg transition-all shadow-sm flex-shrink-0
                                ${file ? "bg-blue-600 hover:bg-blue-700 active:scale-95" : "bg-gray-300 cursor-not-allowed"}
                            `}
                        >
                            Upload
                        </button>
                    ) : (
                        <button disabled className="py-2 px-4 bg-blue-400 text-white text-sm font-semibold rounded-lg flex items-center gap-2 cursor-wait flex-shrink-0">
                            <Loader2 size={16} className="animate-spin" />
                            Wait...
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default User_Data_Upload;