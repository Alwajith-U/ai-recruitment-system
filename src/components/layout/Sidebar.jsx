import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, FileUp, Users, Clock } from 'lucide-react';
import { X } from 'lucide-react';

/* eslint-disable react/prop-types */
function Sidebar({ isOpen, setIsOpen }) {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/job', label: 'Job Description', icon: Briefcase },
        { path: '/upload', label: 'Resume Upload', icon: FileUp },
        { path: '/results', label: 'Candidate Rankings', icon: Users },
        { path: '/history', label: 'Recruitment History', icon: Clock }
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar content */}
            <aside className={`fixed inset-y-0 left-0 bg-white border-r border-gray-200 shadow-[2px_0_8px_-3px_rgba(0,0,0,0.05)] w-64 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-[#1e293b]">Recruit<span className="text-[#3b82f6]">AI</span></h1>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="md:hidden p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-3">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        onClick={() => setIsOpen(false)}
                                        className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer group ${isActive
                                            ? 'bg-blue-50 text-blue-600 shadow-sm'
                                            : 'text-gray-500 hover:bg-gray-50/80 hover:text-gray-900'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                                        {item.label}
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-2 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold text-sm shadow-sm">
                            HR
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#1e293b] truncate">HR Manager</p>
                            <p className="text-xs text-[#64748b] truncate">Enterprise Plan</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;
