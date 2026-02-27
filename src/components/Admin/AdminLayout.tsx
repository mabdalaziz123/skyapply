import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
    LayoutDashboard,
    GraduationCap,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
    BookOpen
} from 'lucide-react';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    const menuItems = [
        { name: 'لوحة التحكم', icon: LayoutDashboard, path: '/admin' },
        { name: 'إدارة الجامعات', icon: GraduationCap, path: '/admin/universities' },
        { name: 'الكليات والأفرع', icon: BookOpen, path: '/admin/faculties' },
        { name: 'إدارة المدونة', icon: FileText, path: '/admin/blog' },
        { name: 'الإعدادات', icon: Settings, path: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans" dir="rtl">
            {/* Sidebar */}
            <aside
                className={`bg-brand-navy text-white transition-all duration-300 fixed md:relative z-50 h-screen ${isSidebarOpen ? 'w-72' : 'w-0 md:w-20 overflow-hidden'
                    }`}
            >
                <div className="p-6 flex items-center justify-between border-b border-white/10">
                    <Link to="/" className={`flex items-center gap-2 ${!isSidebarOpen && 'md:hidden'}`}>
                        <span className="text-xl font-black tracking-tighter">
                            <span className="text-brand-red">APPLY</span>
                            <span className="text-white">SKY</span>
                        </span>
                    </Link>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white/70 hover:text-white">
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20'
                                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <item.icon size={22} className={isActive ? 'text-white' : ''} />
                                <span className={`font-bold whitespace-nowrap ${!isSidebarOpen && 'md:hidden'}`}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
                    <button className="flex items-center gap-4 px-4 py-3 w-full text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                        <LogOut size={22} />
                        <span className={`font-bold ${!isSidebarOpen && 'md:hidden'}`}>تسجيل الخروج</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="bg-white border-b h-20 flex items-center justify-between px-8 shrink-0">
                    <div className="flex items-center gap-4 md:hidden">
                        <button onClick={() => setIsSidebarOpen(true)} className="text-brand-navy p-2 hover:bg-slate-100 rounded-lg">
                            <Menu size={24} />
                        </button>
                    </div>

                    <div className="relative hidden md:block w-96">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="ابحث عن أي شيء..."
                            className="w-full bg-slate-100 border-none rounded-xl py-2.5 pr-12 pl-4 focus:ring-2 focus:ring-brand-red/20 transition-all text-right"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative text-slate-500 hover:text-brand-navy p-2 hover:bg-slate-100 rounded-xl transition-all">
                            <Bell size={22} />
                            <span className="absolute top-2 left-2 w-2 h-2 bg-brand-red rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-10 w-px bg-slate-200"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black text-brand-navy leading-none">مُدير النظام</p>
                                <p className="text-xs text-slate-400 mt-1">administrator</p>
                            </div>
                            <div className="w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center text-brand-red font-black border border-brand-red/20">
                                AD
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
