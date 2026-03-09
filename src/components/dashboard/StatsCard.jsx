/* eslint-disable no-unused-vars */
function StatsCard({ title, value, trend, trendValue, icon: Icon, colorClass }) {
    const isPositive = trend === 'up';

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${colorClass} shadow-sm border border-white/40 ring-1 ring-black/5`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold rounded-full px-2 py-0.5 ${isPositive ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                    {isPositive ? '+' : '-'}{trendValue}%
                </div>
            </div>
            <div>
                <h3 className="text-[#64748b] text-sm font-medium mb-1">{title}</h3>
                <p className="text-2xl font-bold text-[#1e293b]">{value}</p>
            </div>
        </div>
    );
}

export default StatsCard;
