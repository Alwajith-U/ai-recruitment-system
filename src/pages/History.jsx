import { useEffect, useState } from "react";
import { Search, Filter, Calendar, Users, Award, Inbox, ChevronDown } from "lucide-react";

function History() {
    const [history, setHistory] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("date-desc"); // date-desc, date-asc, score-desc, score-asc
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        fetch("https://ai-recruitment-system-sano.onrender.com/history")
            .then(res => res.json())
            .then(data => {
                setHistory(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch history:", err);
                setIsLoading(false);
            });
    }, []);

    const getScoreColor = (score) => {
        if (score >= 80) return "bg-green-100 text-green-700 border-green-200";
        if (score >= 50) return "bg-orange-100 text-orange-700 border-orange-200";
        return "bg-red-100 text-red-700 border-red-200";
    };

    // Filter and Sort logic
    const filteredHistory = history
        .filter(item => {
            const candidateName = item.top_candidate || "";
            return candidateName.toLowerCase().includes(searchTerm.toLowerCase());
        })
        .sort((a, b) => {
            if (sortBy === "date-desc") {
                return new Date(b.date) - new Date(a.date);
            } else if (sortBy === "date-asc") {
                return new Date(a.date) - new Date(b.date);
            } else if (sortBy === "score-desc") {
                return (b.top_score || 0) - (a.top_score || 0);
            } else if (sortBy === "score-asc") {
                return (a.top_score || 0) - (b.top_score || 0);
            }
            return 0;
        });

    return (
        <div className="max-w-7xl mx-auto p-6 md:p-8 w-full">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Recruitment History</h1>
                    <p className="text-gray-500 mt-1">Review past evaluations and top candidates.</p>
                </div>
                
                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search candidates..."
                            className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    {/* Filter / Sort Dropdown */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Filter className="h-4 w-4 text-gray-400" />
                        </div>
                        <select
                            className="pl-10 pr-10 py-2 w-full sm:w-auto appearance-none border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none shadow-sm cursor-pointer transition-all"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="date-desc">Newest First</option>
                            <option value="date-asc">Oldest First</option>
                            <option value="score-desc">Highest Score</option>
                            <option value="score-asc">Lowest Score</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-pulse flex space-x-2">
                        <div className="h-3 w-3 bg-indigo-400 rounded-full"></div>
                        <div className="h-3 w-3 bg-indigo-400 rounded-full animation-delay-200"></div>
                        <div className="h-3 w-3 bg-indigo-400 rounded-full animation-delay-400"></div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredHistory.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    <div className="h-12 w-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-gray-400">
                        <Inbox className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No records found</h3>
                    <p className="text-gray-500 text-center max-w-sm">
                        {searchTerm ? "We couldn't find any candidates matching your search." : "Your recruitment history is currently empty."}
                    </p>
                </div>
            )}

            {/* Grid Layout */}
            {!isLoading && filteredHistory.length > 0 && (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                    {filteredHistory.map((item, index) => (
                        <div 
                            key={index} 
                            className="group bg-white rounded-xl p-5 border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.1)] hover:border-gray-200 transition-all duration-300 flex flex-col"
                        >
                            {/* Card Header */}
                            <div className="flex justify-between items-start mb-4 gap-2">
                                <div className="flex items-center text-xs text-gray-500 font-medium">
                                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                    {new Date(item.date).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getScoreColor(item.top_score)}`}>
                                    <Award className="w-3 h-3 mr-1" />
                                    {item.top_score}% Match
                                </span>
                            </div>

                            {/* Card Body */}
                            <div className="flex-1 mb-6">
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Top Candidate</p>
                                <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">
                                    {item.top_candidate || "N/A"}
                                </h3>
                            </div>

                            {/* Card Footer */}
                            <div className="pt-4 mt-auto border-t border-gray-50 flex items-center justify-between">
                                <div className="flex items-center text-sm text-gray-600">
                                    <div className="flex items-center justify-center w-7 h-7 rounded-md bg-indigo-50 text-indigo-600 mr-2.5">
                                        <Users className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium">{item.total_candidates}</span>
                                    <span className="text-gray-400 ml-1">total evaluated</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default History;