import { useEffect, useState } from "react";
import { UploadCloud, CheckSquare, Users, CheckCircle } from "lucide-react";

function PipelineChart() {
    const [pipeline, setPipeline] = useState({
        uploaded: 0,
        shortlisted: 0,
        interview: 0,
        selected: 0
    });

    useEffect(() => {
        fetch("https://ai-recruitment-system-sano.onrender.com/pipeline")
            .then(res => res.json())
            .then(data => setPipeline(data))
            .catch(err => console.error("Pipeline error:", err));
    }, []);

    const maxCount = Math.max(pipeline.uploaded || 1, 1);

    const stages = [
        {
            key: "uploaded",
            label: "Total Resumes",
            count: pipeline.uploaded,
            icon: UploadCloud,
            baseColor: "text-blue-600",
            bgLight: "bg-blue-50",
            fillColor: "bg-gradient-to-r from-blue-500 to-blue-400"
        },
        {
            key: "shortlisted",
            label: "AI Shortlisted",
            count: pipeline.shortlisted,
            icon: CheckSquare,
            baseColor: "text-purple-600",
            bgLight: "bg-purple-50",
            fillColor: "bg-gradient-to-r from-purple-500 to-purple-400"
        },
        {
            key: "interview",
            label: "Interviewing",
            count: pipeline.interview,
            icon: Users,
            baseColor: "text-orange-600",
            bgLight: "bg-orange-50",
            fillColor: "bg-gradient-to-r from-orange-500 to-orange-400"
        },
        {
            key: "selected",
            label: "Hired Candidate",
            count: pipeline.selected,
            icon: CheckCircle,
            baseColor: "text-emerald-600",
            bgLight: "bg-emerald-50",
            fillColor: "bg-gradient-to-r from-emerald-500 to-emerald-400"
        }
    ];

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 w-full">
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                    Candidate Hiring Pipeline
                </h2>
                <p className="text-sm text-gray-500 mt-1">Real-time conversion tracking across stages.</p>
            </div>

            <div className="space-y-6">
                {stages.map((stage, i) => {
                    const percentage = (stage.count / maxCount) * 100;
                    const Icon = stage.icon;

                    return (
                        <div key={stage.key} className="relative group">
                            {/* Line connecting steps */}
                            {i < stages.length - 1 && (
                                <div className="absolute left-[1.35rem] top-10 bottom-[-24px] w-[2px] bg-gray-100 rounded z-0"></div>
                            )}

                            <div className="relative z-10 flex items-start gap-4">
                                {/* Icon container */}
                                <div className={`w-11 h-11 shrink-0 rounded-xl flex flex-col items-center justify-center shadow-sm border border-white ${stage.bgLight} ${stage.baseColor} transition-transform group-hover:scale-110 duration-300`}>
                                    <Icon className="w-5 h-5" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 pt-1">
                                    <div className="flex justify-between items-end mb-2">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{stage.label}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-bold text-gray-900">{stage.count}</span>
                                        </div>
                                    </div>

                                    {/* Progress Bar Container */}
                                    <div className="h-3 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100/50 shadow-inner">
                                        <div
                                            className={`h-full rounded-full ${stage.fillColor} transition-all duration-1000 ease-out`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>

                                    {/* Subtext info */}
                                    <div className="mt-1.5 flex text-[11px] font-medium text-gray-400 uppercase tracking-widest gap-2">
                                        {i === 0 ? "Initial Pool" : `Conversion: ${stage.count > 0 ? Math.round((stage.count / stages[i - 1].count) * 100) : 0}%`}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default PipelineChart;