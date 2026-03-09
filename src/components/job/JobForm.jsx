import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Loader2 } from 'lucide-react';

function JobForm() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loadingAI, setLoadingAI] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !description) return;

        try {
            const response = await fetch("http://127.0.0.1:5000/upload-jd", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    job_description: title + " " + description
                }),
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/upload');
            } else {
                alert("Error: " + data.error);
            }

        } catch (error) {
            console.error(error);
            alert("Backend connection failed");
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 md:p-8 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
            <div className="mb-6">
                <h2 className="text-xl sm:text-2xl mt-1 font-bold text-gray-900">Define Job Requirements</h2>
                <p className="text-gray-500 mt-1 text-sm sm:text-base">Tell the AI what you're looking for in your ideal candidate.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-[#1e293b] mb-2">
                        Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="jobTitle"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Senior Frontend Engineer"
                        className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent text-[#1e293b] placeholder-[#94a3b8] transition-shadow"
                        required
                    />
                </div>

                <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                        <label htmlFor="description" className="block text-sm font-medium text-[#1e293b]">
                            Job Description <span className="text-red-500">*</span>
                        </label>
                        <button
                            type="button"
                            disabled={loadingAI}
                            onClick={async () => {

                                const title = document.getElementById("jobTitle").value;

                                if (!title) {
                                    alert("Please enter job title first");
                                    return;
                                }

                                setLoadingAI(true);

                                try {

                                    const res = await fetch("http://localhost:5000/generate-jd", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({
                                            title: title
                                        })
                                    });

                                    const data = await res.json();

                                    setDescription(data.job_description);

                                } catch (error) {
                                    alert("AI generation failed");
                                }

                                setLoadingAI(false);

                            }}
                            className="text-sm text-[#3b82f6] hover:text-[#1d4ed8] font-medium flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {loadingAI ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Use AI Assistant
                                </>
                            )}
                        </button>
                    </div>
                    <textarea
                        id="jobDescription"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Paste your full job description here, including responsibilities, requirements, and nice-to-haves..."
                        className="w-full h-48 px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent text-[#1e293b] placeholder-[#94a3b8] resize-y transition-shadow"
                        required
                    />
                </div>

                <div className="pt-4 sm:pt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={!title || !description}
                        className={`w-full sm:w-auto min-h-[40px] px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 ${!title || !description
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none hover:shadow-none hover:translate-y-0'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                    >
                        Analyze & Continue
                    </button>
                </div>
            </form>
        </div>
    );
}

export default JobForm;
