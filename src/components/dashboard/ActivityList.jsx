import { useEffect, useState } from "react";
import { FileText, CheckCircle, UserPlus, Clock } from "lucide-react";

function ActivityList() {

    const [activities, setActivities] = useState([]);

    useEffect(() => {

        fetch("https://ai-recruitment-system-sano.onrender.com/activity")
            .then(res => res.json())
            .then(data => setActivities(data))
            .catch(err => console.error("Activity error:", err));

    }, []);

    const getIcon = (type) => {

        if (type === "upload") return FileText;
        if (type === "match") return CheckCircle;
        if (type === "job") return UserPlus;

        return Clock;
    };

    const getStyle = (type) => {

        if (type === "upload") return { color: "text-blue-500", bg: "bg-blue-50" };
        if (type === "match") return { color: "text-green-500", bg: "bg-green-50" };
        if (type === "job") return { color: "text-purple-500", bg: "bg-purple-50" };

        return { color: "text-orange-500", bg: "bg-orange-50" };
    };

    return (

        <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] overflow-hidden">

            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-800">
                    Recent Activity
                </h2>
            </div>

            <div className="divide-y divide-gray-100">

                {activities.map((activity, index) => {

                    const Icon = getIcon(activity.type);
                    const style = getStyle(activity.type);

                    return (

                        <div key={index} className="p-6 flex items-start gap-4 hover:bg-gray-50/80 transition-all duration-200 group cursor-pointer">

                            <div className={`p-2.5 rounded-xl ${style.bg} ${style.color} shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-sm ring-1 ring-black/5`}>
                                <Icon className="w-5 h-5" />
                            </div>

                            <div className="flex-1 min-w-0">

                                <p className="text-sm text-[#1e293b] font-medium">
                                    {activity.text}
                                </p>

                                <p className="text-xs text-[#64748b] mt-1">
                                    {activity.time}
                                </p>

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>

    );
}

export default ActivityList;