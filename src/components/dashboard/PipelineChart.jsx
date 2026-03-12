import { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function PipelineChart() {

    const [pipeline, setPipeline] = useState({});

    useEffect(() => {

        fetch("https://ai-recruitment-system-sano.onrender.com/pipeline")
            .then(res => res.json())
            .then(data => setPipeline(data));

    }, []);

    const data = {
        labels: ["Uploaded", "Shortlisted", "Interview", "Selected"],
        datasets: [
            {
                label: "Hiring Pipeline",
                data: [
                    pipeline.uploaded || 0,
                    pipeline.shortlisted || 0,
                    pipeline.interview || 0,
                    pipeline.selected || 0
                ],
                backgroundColor: [
                    "#3b82f6",
                    "#8b5cf6",
                    "#f59e0b",
                    "#22c55e"
                ]
            }
        ]
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow duration-300 w-full max-w-full overflow-hidden">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
                Candidate Hiring Pipeline Visualization
            </h2>

            <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px]">
                <Bar data={data} options={{ maintainAspectRatio: false }} />
            </div>
        </div>
    );
}

export default PipelineChart;