import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GraduationCap, FileText, PlusCircle, BookOpen, Loader2, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DashboardHome = () => {
    const { username, role } = useAuth();
    const [counts, setCounts] = useState({ universities: 0, blogs: 0, adminUsers: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [uniRes, blogRes] = await Promise.all([
                    fetch(`${API_URL}/universities`),
                    fetch(`${API_URL}/blog`)
                ]);
                const [unis, blogs] = await Promise.all([uniRes.json(), blogRes.json()]);

                let adminCount = 0;
                if (role === 'admin') {
                    const token = localStorage.getItem('admin_token');
                    const usersRes = await fetch(`${API_URL}/admin/users`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const users = await usersRes.json();
                    adminCount = Array.isArray(users) ? users.length : 0;
                }

                setCounts({
                    universities: Array.isArray(unis) ? unis.length : 0,
                    blogs: Array.isArray(blogs) ? blogs.length : 0,
                    adminUsers: adminCount
                });
            } catch (err) {
                console.error('Failed to fetch dashboard counts:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCounts();
    }, [role]);

    const stats = [
        { label: 'الجامعات المتاحة', value: counts.universities, icon: GraduationCap, color: 'bg-brand-red' },
        { label: 'المقالات المنشورة', value: counts.blogs, icon: FileText, color: 'bg-green-500' },
        ...(role === 'admin'
            ? [{ label: 'المستخدمون', value: counts.adminUsers, icon: Users, color: 'bg-blue-500' }]
            : [])
    ];

    return (
        <div className="space-y-8 text-right">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-brand-navy">
                        مرحباً، {username} 👋
                    </h1>
                    <p className="text-slate-500 mt-1">إليك ملخص بيانات ApplySky.</p>
                </div>
                <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                    <span className="text-brand-navy font-bold">{new Date().toLocaleDateString('ar-SA')}</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
            </div>

            {/* Stats */}
            {loading ? (
                <div className="flex justify-center py-16">
                    <Loader2 className="animate-spin text-brand-red" size={40} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 hover:border-brand-red/30 transition-all"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${stat.color} p-3 rounded-2xl text-white shadow-lg shadow-current/20`}>
                                    <stat.icon size={24} />
                                </div>
                            </div>
                            <p className="text-slate-500 font-bold mb-1">{stat.label}</p>
                            <h3 className="text-4xl font-black text-brand-navy">{stat.value}</h3>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
                <h3 className="text-xl font-black text-brand-navy mb-6">إجراءات سريعة</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Link to="/admin/universities" className="p-6 bg-brand-navy text-white rounded-3xl flex flex-col items-center gap-3 hover:scale-105 transition-transform group text-center">
                        <GraduationCap className="text-brand-red group-hover:scale-110 transition-transform" size={32} />
                        <span className="font-bold">إضافة جامعة</span>
                    </Link>
                    <Link to="/admin/faculties" className="p-6 bg-slate-700 text-white rounded-3xl flex flex-col items-center gap-3 hover:scale-105 transition-transform group text-center">
                        <BookOpen className="text-slate-300 group-hover:scale-110 transition-transform" size={32} />
                        <span className="font-bold">إدارة الكليات</span>
                    </Link>
                    <Link to="/admin/blog" className="p-6 bg-brand-red text-white rounded-3xl flex flex-col items-center gap-3 hover:scale-105 transition-transform group text-center">
                        <PlusCircle className="text-white group-hover:scale-110 transition-transform" size={32} />
                        <span className="font-bold">مقال جديد</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
