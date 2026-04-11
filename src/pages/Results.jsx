import { useEffect, useState } from 'react';
import RankingTable from '../components/results/RankingTable';
import { ArrowLeft, Sparkles, CheckCircle2, Star, Briefcase, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-t-2 border-indigo-600 animate-spin"></div>
                    <div className="absolute inset-2 rounded-full border-r-2 border-fuchsia-500 animate-spin opacity-70" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                </div>
                <p className="text-gray-500 font-medium tracking-wide animate-pulse">Running AI Candidate Analysis...</p>
            </div>
        );
    }

    const topCandidate = rankingData.length > 0 ? rankingData[0] : null;

    return (
        <div className="space-y-8 pb-12 w-full">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 pb-4 sm:pb-2 border-b border-gray-100">
                <button
                    onClick={() => navigate('/upload')}
                    className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-gray-900 hover:border-gray-300 hover:shadow-sm transition-all duration-200 group self-start sm:self-auto"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                </button>

                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">AI Evaluation Results</h1>
                    <p className="text-xs sm:text-sm font-medium text-gray-500 mt-1 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
                        Analyzed {rankingData.length} resumes against job profile
                    </p>
                </div>
            </div>

            {/* ⭐ Top Candidate Card - Enhanced UI */}
            {topCandidate && (
                <div className="relative group">
                    {/* Glow backdrop */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 rounded-[1.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                    
                    <div className="relative bg-white border border-gray-100 p-5 sm:p-6 md:p-8 rounded-[1.4rem] shadow-xl shadow-indigo-100/20 overflow-hidden">
                        
                        {/* Decorative Background shapes */}
                        <div className="absolute right-0 top-0 -mt-20 -mr-20 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 z-0 hidden sm:block"></div>
                        <div className="absolute left-1/4 bottom-0 -mb-10 w-40 h-40 bg-fuchsia-50 rounded-full blur-2xl opacity-60 z-0 hidden sm:block"></div>

                        <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-6 md:gap-8">
                            {/* Left header area */}
                            <div className="flex-1">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/50 mb-4 sm:mb-5">
                                    <Star className="w-4 h-4 text-indigo-500 fill-indigo-500" />
                                    <span className="text-[10px] sm:text-xs font-bold text-indigo-700 uppercase tracking-widest">Top Recommendation</span>
                                </div>
                                
                                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-none mb-2 break-words">
                                    {topCandidate.name}
                                </h2>
                                <p className="text-sm sm:text-base text-gray-500 font-medium flex items-center gap-1.5">
                                    <Briefcase className="w-4 h-4 shrink-0" /> 
                                    {topCandidate.experience} Professional
                                </p>
                            </div>

                            {/* Score Display */}
                            <div className="flex-shrink-0 flex items-center justify-center p-5 sm:p-6 bg-gradient-to-b from-indigo-50 to-white rounded-2xl border border-indigo-100/60 shadow-inner w-full md:w-auto">
                                <div className="text-center">
                                    <div className="text-4xl sm:text-5xl font-black text-indigo-600 mb-1 leading-none tracking-tighter">
                                        {topCandidate.score}%
                                    </div>
                                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-indigo-400">Match Score</span>
                                </div>
                            </div>
                        </div>

                        {/* Skills Grid */}
                        <div className="relative z-10 mt-8 pt-6 border-t border-gray-100/80">
                            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-gray-400" /> 
                                Matching Skills Profile
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {topCandidate.skills.map((skill, idx) => (
                                    <span 
                                        key={idx} 
                                        className="px-3.5 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-sm font-semibold border border-gray-200/60 shadow-sm hover:border-gray-300 transition-colors"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Ranking Table */}
            <div className="pt-4">
                <RankingTable data={rankingData} />
            </div>

        </div>
    );
}

export default Results;