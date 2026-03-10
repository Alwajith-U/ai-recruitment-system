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
        <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">AI Match Results</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Ranked candidates based on job description
                    </p>
                </div>
                <button
                    onClick={() => window.open("https://ai-recruitment-system-sano.onrender.com/export-csv")}
                    className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 hover:shadow-sm hover:-translate-y-0.5 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 transition-all duration-200"
                >
                    <Download className="w-4 h-4 mb-[1px]" /> Export CSV
                </button>
            </div>

            <div className="overflow-x-auto w-full max-w-full">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                        <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                            <th className="px-6 py-3 text-xs font-semibold text-[#64748b] uppercase w-16 text-center">Rank</th>
                            <th className="px-6 py-3 text-xs font-semibold text-[#64748b] uppercase">Candidate</th>
                            <th className="px-6 py-3 text-xs font-semibold text-[#64748b] uppercase w-48 sm:w-64">Match Score</th>
                            <th className="hidden md:table-cell px-6 py-3 text-xs font-semibold text-[#64748b] uppercase">Experience</th>
                            <th className="hidden md:table-cell px-6 py-3 text-xs font-semibold text-[#64748b] uppercase">Skills</th>
                            <th className="hidden sm:table-cell px-6 py-3 text-xs font-semibold text-[#64748b] uppercase">
                                Skill Match
                            </th>
                            <th className="px-6 py-3 text-xs font-semibold text-[#64748b] uppercase text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-[#e2e8f0]">
                        {Array.isArray(data) && data.length > 0 ? (
                            data.map((candidate, index) => (
                                <tr key={index} className="hover:bg-blue-50/30 transition-colors duration-200 group">
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm bg-gray-50 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                            #{index + 1}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900">
                                            {candidate.name}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-1 rounded-md text-xs font-bold shadow-sm ${getBadgeColor(candidate.score)}`}>
                                                {candidate.score}%
                                            </span>

                                            <div className="w-full bg-gray-100 rounded-full h-2 max-w-[120px] overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${getScoreColor(candidate.score)} transition-all duration-700 ease-out`}
                                                    style={{ width: `${candidate.score}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-700 font-medium">
                                        {candidate.experience}
                                    </td>

                                    <td className="hidden md:table-cell px-6 py-4 text-sm">
                                        <div className="flex flex-wrap gap-1.5">
                                            {candidate.skills ? candidate.skills.slice(0, 3).map((skill, i) => (
                                                <span key={i} className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-medium border border-blue-100/50">
                                                    {skill}
                                                </span>
                                            )) : <span className="text-gray-400">No skills</span>}
                                            {candidate.skills && candidate.skills.length > 3 && (
                                                <span className="bg-gray-50 text-gray-500 px-2 py-1 rounded-md text-xs font-medium border border-gray-100">
                                                    +{candidate.skills.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    <td className="hidden sm:table-cell px-6 py-4 text-sm font-bold text-blue-600">
                                        {candidate.skill_match}%
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedCandidate(candidate)}
                                                className="text-[#3b82f6] hover:text-[#1d4ed8] p-2 rounded-lg"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                            <button className="text-[#94a3b8] hover:text-[#1e293b] p-2 rounded-lg">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-8 text-gray-500">
                                    No ranking data available. Please upload job description and resumes.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {
                selectedCandidate && (
                    <ResumeModal
                        candidate={selectedCandidate}
                        onClose={() => setSelectedCandidate(null)}
                    />
                )
            }
        </div>
    );
}

export default RankingTable;