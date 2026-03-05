import { useState, useEffect, useRef } from 'react';
import { Plus, Eye, Edit2, Trash2, Image as ImageIcon, Loader2, Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { db } from '../../lib/db';
import RichTextEditor from '../../components/RichTextEditor';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Language Tab helper
const LangTabs = ({ active, onChange }: { active: string; onChange: (l: string) => void }) => (
    <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-4">
        {['ar', 'en', 'tr'].map(l => (
            <button
                key={l}
                type="button"
                onClick={() => onChange(l)}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${active === l ? 'bg-white shadow text-brand-navy' : 'text-slate-500 hover:text-brand-navy'}`}
            >
                {l === 'ar' ? '🇸🇦 العربية' : l === 'en' ? '🇬🇧 English' : '🇹🇷 Türkçe'}
            </button>
        ))}
    </div>
);

const ManageBlog = () => {
    const [isAddingMode, setIsAddingMode] = useState(false);
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [activeLang, setActiveLang] = useState('ar');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: '', title_en: '', title_tr: '',
        author: '',
        content: '', content_en: '', content_tr: '',
        image: '',
        read_time: '5 دقائق'
    });

    useEffect(() => { fetchPosts(); }, []);

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

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);
        try {
            const res = await fetch(`${API_URL}/upload`, { method: 'POST', body: formDataUpload });
            const data = await res.json();
            if (data.publicUrl) setFormData(prev => ({ ...prev, image: data.publicUrl }));
        } catch (error) {
            alert('فشل رفع الصورة');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.image) { alert('الرجاء رفع صورة للمقال'); return; }
        setIsSubmitting(true);
        try {
            await db.blog.add({ ...formData, date: new Date().toLocaleDateString('ar-SA') });
            setIsAddingMode(false);
            setFormData({ title: '', title_en: '', title_tr: '', author: '', content: '', content_en: '', content_tr: '', image: '', read_time: '5 دقائق' });
            fetchPosts();
        } catch (error: any) {
            alert('فشل الحفظ: ' + (error.message || 'خطأ غير معروف'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا المقال؟')) return;
        try {
            await db.blog.delete(id);
            fetchPosts();
        } catch (error) {
            alert('فشل الحذف');
        }
    };

    const titleField = activeLang === 'ar' ? 'title' : activeLang === 'en' ? 'title_en' : 'title_tr';
    const contentField = activeLang === 'ar' ? 'content' : activeLang === 'en' ? 'content_en' : 'content_tr';

    return (
        <div className="space-y-8 text-right font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <button onClick={() => setIsAddingMode(true)} className="btn-primary flex items-center gap-2">
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
                            <h3 className="text-2xl font-black text-brand-navy">محرر المقالات</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Language tabs */}
                            <LangTabs active={activeLang} onChange={setActiveLang} />

                            {/* Title */}
                            <div className="space-y-3">
                                <label className="block text-lg font-black text-brand-navy">
                                    عنوان المقال {activeLang === 'en' ? '(English)' : activeLang === 'tr' ? '(Türkçe)' : '(العربية)'}
                                </label>
                                <input
                                    type="text"
                                    value={(formData as any)[titleField]}
                                    onChange={(e) => setFormData({ ...formData, [titleField]: e.target.value })}
                                    required={activeLang === 'ar'}
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xl font-bold text-right focus:border-brand-red outline-none transition-all"
                                    placeholder={activeLang === 'ar' ? 'أدخل عنواناً جذاباً...' : activeLang === 'en' ? 'Enter an engaging title...' : 'Başlık girin...'}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3 font-bold">
                                    <label className="block text-brand-navy">الكاتب</label>
                                    <input
                                        required type="text"
                                        value={formData.author}
                                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-right"
                                        placeholder="اسم الكاتب"
                                    />
                                </div>
                                <div className="space-y-3 font-bold">
                                    <label className="block text-brand-navy">صورة المقال</label>
                                    <input type="file" hidden ref={fileInputRef} onChange={handleFileUpload} accept="image/*" />
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-brand-red hover:bg-red-50 transition-all relative overflow-hidden group"
                                    >
                                        {isUploading ? (
                                            <Loader2 className="animate-spin text-brand-red" size={32} />
                                        ) : formData.image ? (
                                            <>
                                                <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Upload className="text-white" size={32} />
                                                </div>
                                                <button type="button" onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, image: '' }); }}
                                                    className="absolute top-2 left-2 bg-white/90 p-1 rounded-lg text-brand-red hover:bg-brand-red hover:text-white transition-colors">
                                                    <X size={16} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="text-slate-300 group-hover:text-brand-red mb-2" size={32} />
                                                <span className="text-slate-400 group-hover:text-brand-red">اضغط لرفع صورة</span>
                                                <span className="text-[10px] text-slate-300 mt-1 italic">JPG, PNG, WebP</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="space-y-3">
                                <label className="block text-lg font-black text-brand-navy">
                                    محتوى المقال {activeLang === 'en' ? '(English)' : activeLang === 'tr' ? '(Türkçe)' : '(العربية)'}
                                </label>
                                <div className="w-full bg-slate-100/50 border-2 border-slate-200 rounded-3xl p-4">
                                    <RichTextEditor
                                        value={(formData as any)[contentField]}
                                        onChange={(val: string) => setFormData({ ...formData, [contentField]: val })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    disabled={isSubmitting || isUploading} type="submit"
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
                        <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-brand-red" size={40} /></div>
                    ) : posts.length === 0 ? (
                        <div className="p-20 text-center text-slate-400 font-bold">لا يوجد مقالات حالياً</div>
                    ) : posts.map((post) => (
                        <div key={post.id} className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-transparent hover:border-slate-200 hover:bg-white transition-all group">
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleDelete(post.id)} className="p-3 text-slate-400 hover:text-brand-red hover:bg-red-50 rounded-xl transition-all">
                                    <Trash2 size={20} />
                                </button>
                                <button className="p-3 text-slate-400 hover:text-brand-navy hover:bg-slate-100 rounded-xl transition-all"><Edit2 size={20} /></button>
                                <Link to={`/blog/${post.id}`} className="p-3 text-slate-400 hover:text-brand-navy hover:bg-slate-100 rounded-xl transition-all">
                                    <Eye size={20} />
                                </Link>
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
                                        {post.title_en && <p className="text-xs text-slate-400 font-bold">{post.title_en}</p>}
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
