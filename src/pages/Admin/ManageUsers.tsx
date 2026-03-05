import { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, Users, Shield, PenLine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('admin_token') || ''}`
});

interface AdminUser {
    id: string;
    username: string;
    role: 'admin' | 'blogger';
    created_at: string;
}

const ManageUsers = () => {
    const { role, username: currentUsername } = useAuth();
    const navigate = useNavigate();

    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ username: '', password: '', role: 'blogger' as 'admin' | 'blogger' });

    // Redirect bloggers away
    useEffect(() => {
        if (role === 'blogger') navigate('/admin', { replace: true });
    }, [role, navigate]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin/users`, { headers: authHeaders() });
            const data = await res.json();
            setUsers(data);
        } catch {
            setError('فشل تحميل المستخدمين');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            const res = await fetch(`${API_URL}/admin/users`, {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setForm({ username: '', password: '', role: 'blogger' });
            setIsAdding(false);
            fetchUsers();
        } catch (err: any) {
            setError(err.message || 'فشل إضافة المستخدم');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string, username: string) => {
        if (!window.confirm(`هل أنت متأكد من حذف المستخدم "${username}"؟`)) return;
        try {
            await fetch(`${API_URL}/admin/users/${id}`, { method: 'DELETE', headers: authHeaders() });
            fetchUsers();
        } catch {
            alert('فشل الحذف');
        }
    };

    const roleLabel = (r: string) => r === 'admin' ? 'مدير' : 'كاتب';
    const roleBadge = (r: string) =>
        r === 'admin'
            ? 'bg-brand-red/10 text-brand-red border border-brand-red/20'
            : 'bg-blue-50 text-blue-600 border border-blue-200';

    return (
        <div className="space-y-8 text-right font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <button onClick={() => setIsAdding(true)} className="btn-primary flex items-center gap-2">
                    إضافة مستخدم جديد <Plus size={18} />
                </button>
                <div>
                    <h1 className="text-2xl font-black text-brand-navy">إدارة المستخدمين</h1>
                    <p className="text-slate-500 mt-1">إضافة وحذف حسابات المشرفين والكتّاب.</p>
                </div>
            </div>

            {/* Add Form */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white rounded-[32px] p-8 shadow-xl border border-brand-red/10 overflow-hidden"
                    >
                        <div className="flex items-center justify-between mb-6 border-b pb-4">
                            <button onClick={() => { setIsAdding(false); setError(''); }} className="text-slate-400 hover:text-brand-navy font-bold">إلغاء</button>
                            <h3 className="text-xl font-black text-brand-navy">إضافة مستخدم جديد</h3>
                        </div>
                        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="space-y-2">
                                <label className="block font-bold text-slate-700">اسم المستخدم</label>
                                <input
                                    required
                                    type="text"
                                    value={form.username}
                                    onChange={e => setForm({ ...form, username: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-right focus:border-brand-red outline-none"
                                    placeholder="مثلاً: ahmad"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block font-bold text-slate-700">كلمة المرور</label>
                                <input
                                    required
                                    type="password"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-right focus:border-brand-red outline-none"
                                    placeholder="كلمة مرور قوية"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block font-bold text-slate-700">الدور</label>
                                <select
                                    value={form.role}
                                    onChange={e => setForm({ ...form, role: e.target.value as 'admin' | 'blogger' })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-right outline-none"
                                >
                                    <option value="blogger">كاتب (Blogger)</option>
                                    <option value="admin">مدير (Admin)</option>
                                </select>
                            </div>
                            {error && (
                                <div className="md:col-span-3 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm font-medium">
                                    ⚠️ {error}
                                </div>
                            )}
                            <div className="md:col-span-3">
                                <button disabled={submitting} type="submit" className="btn-primary w-full py-3.5 flex items-center justify-center gap-2">
                                    {submitting ? <Loader2 className="animate-spin" size={20} /> : 'إضافة المستخدم'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Users Table */}
            <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100">
                <div className="p-6 border-b flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Users size={16} />
                        <span>{users.length} مستخدم</span>
                    </div>
                    <h3 className="font-black text-brand-navy">قائمة المستخدمين</h3>
                </div>

                {loading ? (
                    <div className="p-20 flex justify-center">
                        <Loader2 className="animate-spin text-brand-red" size={40} />
                    </div>
                ) : (
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b text-slate-500 text-sm">
                                <th className="p-6 font-bold">المستخدم</th>
                                <th className="p-6 font-bold">الدور</th>
                                <th className="p-6 font-bold">تاريخ الإنشاء</th>
                                <th className="p-6 font-bold text-left">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors text-brand-navy font-bold">
                                    <td className="p-6">
                                        <div className="flex items-center justify-end gap-3">
                                            <span>{user.username}</span>
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${user.role === 'admin' ? 'bg-brand-red/10' : 'bg-blue-50'}`}>
                                                {user.role === 'admin' ? <Shield size={16} className="text-brand-red" /> : <PenLine size={16} className="text-blue-500" />}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${roleBadge(user.role)}`}>
                                            {roleLabel(user.role)}
                                        </span>
                                    </td>
                                    <td className="p-6 text-slate-400 font-medium text-sm">
                                        {new Date(user.created_at).toLocaleDateString('ar-SA')}
                                    </td>
                                    <td className="p-6 text-left">
                                        {user.username !== currentUsername && (
                                            <button
                                                onClick={() => handleDelete(user.id, user.username)}
                                                className="p-2 text-slate-400 hover:text-brand-red hover:bg-red-50 rounded-xl transition-all"
                                                title="حذف"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ManageUsers;
