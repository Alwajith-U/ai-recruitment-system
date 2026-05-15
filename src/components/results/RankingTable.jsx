import { useState } from "react";
import { Download, ExternalLink, MoreVertical } from 'lucide-react';
import ResumeModal from "./ResumeModal";

function RankingTable({ data = [] }) {

    const [selectedCandidate, setSelectedCandidate] = useState(null);

    const getScoreColor = (score) => {
        if (score >= 90) return 'bg-green-500';
        if (score >= 80) return 'bg-blue-500';
        if (score >= 70) return 'bg-yellow-500';
        return 'bg-orange-500';
    };

    const getBadgeColor = (score) => {
        if (score >= 90) return 'bg-green-100 text-green-800';
        if (score >= 80) return 'bg-blue-100 text-blue-800';
        if (score >= 70) return 'bg-yellow-100 text-yellow-800';
        return 'bg-orange-100 text-orange-800';
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] overflow-hidden">
            {/* Header */}
            <div className="px-5 sm:px-7 py-4 sm:py-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white relative overflow-hidden">
                <div className="relative z-10 w-full sm:w-auto">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">AI Match Results</h2>
                    <p className="text-xs sm:text-sm font-medium text-gray-500 mt-1">
                        Ranked candidate profiles based on job requirements
                    </p>
                </div>
                <button
                    onClick={() => window.open("http://localhost:10000/export-csv")}
                    className="relative z-10 w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                    <Download className="w-4 h-4 text-gray-300" /> Export CSV
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead className="bg-[#f8fafc]/80 backdrop-blur-sm border-b border-gray-100">
                        <tr>
                            <th className="px-7 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center w-20">Rank</th>
                            <th className="px-7 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Candidate</th>
                            <th className="px-7 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-56">Overall Match</th>
                            <th className="hidden md:table-cell px-7 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Experience</th>
                            <th className="hidden md:table-cell px-7 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Top Skills</th>
                            <th className="px-7 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-50">
                        {Array.isArray(data) && data.length > 0 ? (
                            data.map((candidate, index) => (
                                <tr key={index} className="hover:bg-indigo-50/40 transition-colors duration-300 group">
                                    <td className="px-7 py-5 text-center">
                                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${index === 0 ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'} transition-colors`}>
                                            {index + 1}
                                        </span>
                                    </td>

                                    <td className="px-7 py-5">
                                        <div className="font-bold text-gray-900 group-hover:text-indigo-900 transition-colors">
                                            {candidate.name}
                                        </div>
                                    </td>

                                    <td className="px-7 py-5">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-extrabold ${getBadgeColor(candidate.score)} border border-transparent`}>
                                                {candidate.score}%
                                            </span>

                                            <div className="w-full bg-gray-100 rounded-full h-2.5 max-w-[130px] overflow-hidden shadow-inner">
                                                <div
                                                    className={`h-full rounded-full ${getScoreColor(candidate.score)} transition-all duration-1000 ease-out`}
                                                    style={{ width: `${candidate.score}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="hidden md:table-cell px-7 py-5 text-sm text-gray-600 font-medium">
                                        {candidate.experience}
                                    </td>

                                    <td className="hidden md:table-cell px-7 py-5">
                                        <div className="flex flex-wrap gap-2">
                                            {candidate.skills && candidate.skills.length > 0 ? (
                                                candidate.skills.slice(0, 3).map((skill, i) => (
                                                    <span key={i} className="bg-white text-gray-600 px-2.5 py-1 rounded-md text-xs font-semibold border border-gray-200 shadow-sm group-hover:border-indigo-100 transition-colors">
                                                        {skill}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-400 text-sm font-medium italic">No skills listed</span>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-7 py-5 text-right">
                                        <div className="flex justify-end gap-1">
                                            <button
                                                onClick={() => setSelectedCandidate(candidate)}
                                                className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700 px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                View
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-16">
                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                        <p className="font-medium text-gray-500">No candidates available</p>
                                        <p className="text-sm mt-1">Upload resumes to see AI rankings here.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Resume Modal */}
            {selectedCandidate && (
                <ResumeModal
                    candidate={selectedCandidate}
                    onClose={() => setSelectedCandidate(null)}
                />
            )}
        </div>
    );
}

export default RankingTable;