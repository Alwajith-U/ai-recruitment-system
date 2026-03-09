import { useEffect, useState } from "react";
import StatsCard from "../components/dashboard/StatsCard";
import ActivityList from "../components/dashboard/ActivityList";
import PipelineChart from "../components/dashboard/PipelineChart";

import { Users, Briefcase, FileText, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    const [statsData, setStatsData] = useState({
        candidates: 0,
        jobs: 0,
        resumes: 0,
        avg_match: 0
    });

    useEffect(() => {

        fetch("http://localhost:5000/dashboard")
            .then(res => res.json())
            .then(data => setStatsData(data))
            .catch(err => console.error("Dashboard error:", err));

    }, []);

    const stats = [
        {
            title: "Total Candidates",
            value: statsData.candidates,
            trend: "up",
            trendValue: "12.5",
            icon: Users,
            colorClass: "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600"
        },
        {
            title: "Open Jobs",
            value: statsData.jobs,
            trend: "up",
            trendValue: "4.2",
            icon: Briefcase,
            colorClass: "bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600"
        },
        {
            title: "Resumes Processed",
            value: statsData.resumes,
            trend: "up",
            trendValue: "28.4",
            icon: FileText,
            colorClass: "bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600"
        },
        {
            title: "Avg. Match Rate",
            value: statsData.avg_match + "%",
            trend: "up",
            trendValue: "2.1",
            icon: CheckCircle,
            colorClass: "bg-gradient-to-br from-green-50 to-green-100 text-green-600"
        }
    ];

    return (
        <div className="space-y-6">

            {/* Header */}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                        Dashboard Overview
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Welcome back! Here's what's happening today.
                    </p>
                </div>

                <button
                    onClick={() => navigate('/job')}
                    className="w-full sm:w-auto min-h-[40px] bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
                >
                    <span>+</span> Create New Job
                </button>

            </div>


            {/* Stats Cards */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {stats.map((stat, i) => (
                    <StatsCard key={i} {...stat} />
                ))}

            </div>


            {/* Pipeline Chart + Activity */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2">

                    <PipelineChart />

                </div>

                <div className="lg:col-span-1">

                    <ActivityList />

                </div>

            </div>

        </div>
    );
}

export default Dashboard;