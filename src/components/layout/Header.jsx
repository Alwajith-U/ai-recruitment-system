import { Bell, Search, Menu } from 'lucide-react';

function Header({ toggleSidebar }) {
    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 h-16 flex items-center justify-between px-6 sticky top-0 z-30 transition-all duration-300">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="md:hidden text-[#64748b] hover:text-[#1e293b] cursor-pointer"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div className="relative hidden sm:block group">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                    <input
                        type="text"
                        placeholder="Search candidates, jobs..."
                        className="pl-9 pr-4 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-64 text-gray-900 placeholder-gray-400 transition-all duration-300 focus:bg-white focus:w-72 shadow-sm"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-all duration-200 cursor-pointer">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 shadow-sm text-white flex items-center justify-center font-bold text-sm cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                    HR
                </div>
            </div>
        </header>
    );
}

export default Header;
