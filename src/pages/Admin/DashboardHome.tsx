import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, GraduationCap, FileText, TrendingUp, ArrowUpRight, PlusCircle } from 'lucide-react';

const AdminDashboard = () => {
    const stats = [
        { label: 'إجمالي الحسابات', value: '1,240', icon: Users, color: 'bg-blue-500', trend: '+12%' },
        { label: 'الجامعات المتاحة', value: '85', icon: GraduationCap, color: 'bg-brand-red', trend: '+5%' },
        { label: 'المقالات المنشورة', value: '42', icon: FileText, color: 'bg-green-500', trend: '+18%' },
        { label: 'طلبات التقديم', value: '156', icon: TrendingUp, color: 'bg-purple-500', trend: '+24%' },
    ];

    return (
        <div className="space-y-8 text-right">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-brand-navy">مرحباً بك مجدداً، مُدير النظام 👋</h1>
                    <p className="text-slate-500 mt-1">إليك ما يحدث في ApplySky اليوم.</p>
                </div>
                <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                    <span className="text-brand-navy font-bold">{new Date().toLocaleDateString('ar-SA')}</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 group hover:border-brand-red/30 transition-all cursor-pointer"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${stat.color} p-3 rounded-2xl text-white shadow-lg shadow-current/20`}>
                                <stat.icon size={24} />
                            </div>
                            <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-lg text-xs font-bold">
                                {stat.trend}
                                <ArrowUpRight size={14} />
                            </div>
                        </div>
                        <p className="text-slate-500 font-bold mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-black text-brand-navy">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Applications Card */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                        <button className="text-brand-red font-bold text-sm hover:underline">عرض الكل</button>
                        <h3 className="text-xl font-black text-brand-navy">أحدث طلبات التقديم</h3>
                    </div>
                    <div className="space-y-6">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-brand-red/20 transition-all group">
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">مقبول</span>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="font-bold text-brand-navy">محمد العلي</p>
                                        <p className="text-xs text-slate-500">هندسة الحاسوب - جامعة استينيا</p>
                                    </div>
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-bold text-slate-400 group-hover:text-brand-red shadow-sm">
                                        {i + 1}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions Card */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
                    <h3 className="text-xl font-black text-brand-navy mb-8">إجراءات سريعة</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Link to="/admin/universities" className="p-6 bg-brand-navy text-white rounded-3xl flex flex-col items-center gap-3 hover:scale-105 transition-transform group text-center">
                            <GraduationCap className="text-brand-red group-hover:scale-110 transition-transform" size={32} />
                            <span className="font-bold">إضافة جامعة</span>
                        </Link>
                        <Link to="/admin/blog" className="p-6 bg-brand-red text-white rounded-3xl flex flex-col items-center gap-3 hover:scale-105 transition-transform group text-center">
                            <PlusCircle className="text-white group-hover:scale-110 transition-transform" size={32} />
                            <span className="font-bold">مقال جديد</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
