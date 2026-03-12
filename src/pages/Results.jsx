import { useEffect, useState } from 'react';
import RankingTable from '../components/results/RankingTable';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SkillChart from '../components/results/SkillChart';

function Results() {
    const navigate = useNavigate();
    const [rankingData, setRankingData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const response = await fetch("https://ai-recruitment-system-sano.onrender.com/rank");
                const data = await response.json();
                setRankingData(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching ranking:", error);
                setLoading(false);
            }
        };

        fetchRanking();
    }, []);

    if (loading) {
        return <p className="text-center mt-10 text-gray-500">Loading AI Results...</p>;
    }

    // ⭐ Top Candidate Logic
    const topCandidate = rankingData.length > 0 ? rankingData[0] : null;

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/upload')}
                    className="p-2 border border-[#e2e8f0] rounded-lg text-[#64748b] hover:text-[#1e293b] hover:bg-[#f8fafc] min-h-[40px] flex items-center justify-center shrink-0"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1e293b]">Candidate Rankings</h1>
                    <p className="text-sm sm:text-base text-[#64748b] mt-1">
                        AI analyzed {rankingData.length} resumes
                    </p>
                </div>
            </div>

            {/* ⭐ Top Candidate Card */}
            {topCandidate && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-4 sm:p-6 md:p-8 rounded-xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow duration-300 w-full max-w-full overflow-hidden">

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
                        <div className="p-2.5 bg-green-100/80 rounded-lg text-green-700 shadow-sm border border-green-200/50 self-start sm:self-auto">
                            🏆
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-green-800 tracking-tight">
                                AI Recommended Candidate
                            </h2>
                            <p className="text-sm text-green-600/90 font-medium">Highest matched candidate based on job requirements</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white/60 p-5 rounded-lg border border-green-100 shadow-sm backdrop-blur-sm">
                        <div>
                            <p className="text-xs font-bold text-green-700/70 uppercase tracking-wider mb-1">Name</p>
                            <p className="font-semibold text-gray-900 text-lg">{topCandidate.name}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-green-700/70 uppercase tracking-wider mb-1">Match Score</p>
                            <div className="flex items-center gap-2">
                                <p className="font-bold text-green-700 text-2xl leading-none">{topCandidate.score}%</p>
                                <span className="bg-green-100 text-green-800 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Top Match</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-green-700/70 uppercase tracking-wider mb-1">Experience</p>
                            <p className="font-medium text-gray-900">{topCandidate.experience}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-green-700/70 uppercase tracking-wider mb-1">Top Skills</p>
                            <p className="font-medium text-gray-900 truncate" title={topCandidate.skills.join(", ")}>
                                {topCandidate.skills.join(", ")}
                            </p>
                        </div>
                    </div>

                </div>
            )}

            {/* Skill Chart */}
            <SkillChart data={rankingData} />

            {/* Ranking Table */}
            <RankingTable data={rankingData} />

        </div>
    );
}

export default Results;