import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function SkillChart({ data }) {

    const labels = Array.isArray(data) ? data.map(c => c.name) : [];

    const scores = Array.isArray(data) ? data.map(c => c.skill_match || 0) : [];

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Skill Match %',
                data: scores,
                backgroundColor: '#3b82f6'
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow duration-300">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
                AI Skill Match Graph
            </h2>

            <Bar data={chartData} options={options} />
        </div>
    );
}

export default SkillChart;