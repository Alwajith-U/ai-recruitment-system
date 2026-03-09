import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, File, X, AlertCircle } from 'lucide-react';

function ResumeUploader() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const newFiles = Array.from(e.dataTransfer.files);
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const removeFile = (indexToRemove) => {
        setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleProcess = async () => {
        if (files.length === 0) return;

        try {
            const formData = new FormData();

            files.forEach((file) => {
                formData.append("resumes", file);
            });

            const response = await fetch("http://localhost:5000/upload-resumes", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/results');
            } else {
                alert("Upload failed");
            }

        } catch (error) {
            console.error(error);
            alert("Backend connection failed");
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Upload Candidate Resumes</h2>
                <p className="text-gray-500 mt-1 text-sm">Upload PDF or Word documents to match against your job description.</p>
            </div>

            <div
                className={`border-2 border-dashed rounded-xl p-8 mb-6 text-center transition-all duration-300 ${isDragging
                    ? 'border-blue-400 bg-blue-50/50 scale-[1.02]'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50/50'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="w-16 h-16 bg-[#f1f5f9] rounded-full flex items-center justify-center mx-auto mb-4 text-[#3b82f6]">
                    <UploadCloud className="w-8 h-8" />
                </div>
                <h3 className="text-[#1e293b] font-medium mb-1">Drag & drop files here</h3>
                <p className="text-[#64748b] text-sm mb-4">Supported formats: PDF, DOCX, TXT (Max: 5MB)</p>

                <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white border border-[#e2e8f0] text-[#1e293b] hover:bg-[#f8fafc] px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer shadow-sm"
                >
                    Browse Files
                </button>
            </div>

            {files.length > 0 && (
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-medium text-[#1e293b]">
                            Selected Files ({files.length})
                        </h4>
                        <span className="text-xs text-[#64748b]">Total size: {(files.reduce((acc, file) => acc + file.size, 0) / (1024 * 1024)).toFixed(2)} MB</span>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {files.map((file, idx) => (
                            <div key={`${file.name}-${idx}`} className="flex items-center justify-between p-3 border border-[#e2e8f0] rounded-lg bg-[#f8fafc]">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <File className="w-5 h-5 text-[#3b82f6] shrink-0" />
                                    <div className="truncate">
                                        <p className="text-sm font-medium text-[#1e293b] truncate">{file.name}</p>
                                        <p className="text-xs text-[#64748b]">{(file.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFile(idx)}
                                    className="text-[#94a3b8] hover:text-[#ef4444] p-1 rounded-md transition-colors cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {files.length === 0 && (
                <div className="flex items-start gap-3 p-4 bg-yellow-50 text-yellow-800 rounded-lg mb-6 border border-yellow-200">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">Please select at least one resume to proceed with AI analysis.</p>
                </div>
            )}

            <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 border-t border-gray-100 mt-4">
                <button
                    onClick={() => navigate('/job')}
                    className="w-full sm:w-auto min-h-[40px] px-6 py-2.5 rounded-lg font-medium text-gray-500 hover:text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm cursor-pointer"
                >
                    Back
                </button>
                <button
                    onClick={handleProcess}
                    disabled={files.length === 0}
                    className={`w-full sm:w-auto min-h-[40px] px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:-translate-y-0.5 hover:shadow-md cursor-pointer flex justify-center items-center gap-2 ${files.length === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none hover:shadow-none hover:translate-y-0'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                >
                    Process Resumes With AI
                </button>
            </div>
        </div>
    );
}

export default ResumeUploader;
