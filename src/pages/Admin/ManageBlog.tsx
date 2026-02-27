import { useState, useEffect } from 'react';
import { Plus, Eye, Edit2, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../lib/db';

const ManageBlog = () => {
    const [isAddingMode, setIsAddingMode] = useState(false);
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        content: '',
        image: '',
        read_time: '5 دقائق'
    });

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const data = await db.blog.getAll();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await db.blog.add({
                ...formData,
                date: new Date().toLocaleDateString('ar-SA')
            });
            setIsAddingMode(false);
            setFormData({
                title: '',
                author: '',
                content: '',
                image: '',
                read_time: '5 دقائق'
            });
            fetchPosts();
        } catch (error: any) {
            alert('فشل الحفظ: ' + (error.message || 'خطأ غير معروف'));
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 text-right font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <button
                    onClick={() => setIsAddingMode(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    كتابة مقال جديد <Plus size={18} />
                </button>
                <div>
                    <h1 className="text-2xl font-black text-brand-navy">إدارة المدونة</h1>
                    <p className="text-slate-500 mt-1">اكتب وشارك المعرفة مع الطلاب.</p>
                </div>
            </div>

            <AnimatePresence>
                {isAddingMode && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-[40px] p-10 shadow-2xl border border-brand-red/10"
                    >
                        <div className="flex items-center justify-between mb-10 border-b pb-6">
                            <button onClick={() => setIsAddingMode(false)} className="text-slate-400 hover:text-brand-navy font-bold">إغلاق المحرر</button>
                            <h3 className="text-2xl font-black text-brand-navy">محرر المقالات الجديد</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-3">
                                <label className="block text-lg font-black text-brand-navy">عنوان المقال</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xl font-bold text-right focus:border-brand-red outline-none transition-all"
                                    placeholder="أدخل عنواناً جذاباً..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3 font-bold">
                                    <label className="block text-brand-navy">الكاتب</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.author}
                                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-right"
                                        placeholder="اسم الكاتب"
                                    />
                                </div>
                                <div className="space-y-3 font-bold">
                                    <label className="block text-brand-navy">رابط الصورة</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-right"
                                        placeholder="رابط URL للصورة"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-lg font-black text-brand-navy">محتوى المقال</label>
                                <textarea
                                    required
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    rows={12}
                                    className="w-full bg-slate-100/50 border-2 border-slate-200 rounded-3xl px-6 py-6 text-right leading-relaxed font-medium focus:bg-white outline-none transition-all"
                                    placeholder="ابدأ كتابة محتواك هنا بأسلوب شيق..."
                                ></textarea>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="btn-primary flex-1 py-4 text-lg shadow-xl shadow-brand-red/20 flex items-center justify-center gap-3"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'نشر المقال الآن'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
                <div className="grid grid-cols-1 gap-6">
                    {loading ? (
                        <div className="p-20 flex justify-center">
                            <Loader2 className="animate-spin text-brand-red" size={40} />
                        </div>
                    ) : posts.map((post) => (
                        <div key={post.id} className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-transparent hover:border-slate-200 hover:bg-white transition-all group">
                            <div className="flex items-center gap-2">
                                <button className="p-3 text-slate-400 hover:text-brand-red hover:bg-red-50 rounded-xl transition-all"><Trash2 size={20} /></button>
                                <button className="p-3 text-slate-400 hover:text-brand-navy hover:bg-slate-100 rounded-xl transition-all"><Edit2 size={20} /></button>
                                <button className="p-3 text-slate-400 hover:text-brand-navy hover:bg-slate-100 rounded-xl transition-all"><Eye size={20} /></button>
                            </div>

                            <div className="h-10 w-px bg-slate-200 hidden md:block"></div>

                            <div className="flex flex-col md:flex-row items-center gap-10 text-right">
                                <div>
                                    <p className="text-xs text-slate-400 mb-1 font-bold tracking-wider">التاريخ</p>
                                    <p className="font-bold text-brand-navy">{post.date}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div>
                                        <h4 className="font-black text-brand-navy group-hover:text-brand-red transition-colors">{post.title}</h4>
                                        <p className="text-xs text-slate-500 font-bold">بواسطة: {post.author}</p>
                                    </div>
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm overflow-hidden">
                                        {post.image ? <img src={post.image} className="w-full h-full object-cover" /> : <ImageIcon size={24} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManageBlog;
