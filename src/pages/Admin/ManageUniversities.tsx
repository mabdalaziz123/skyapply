import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, Eye, Loader2, Upload, ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../lib/db';

const ManageUniversities = () => {
    const [isAddingMode, setIsAddingMode] = useState(false);
    const [universities, setUniversities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        country: 'تركيا',
        city: '',
        image: '',
        description: '',
        ranking: '',
        students: '',
        type: 'جامعة خاصة',
        founded: ''
    });

    useEffect(() => {
        fetchUniversities();
    }, []);

    const fetchUniversities = async () => {
        try {
            const data = await db.universities.getAll();
            setUniversities(data);
        } catch (error) {
            console.error('Error fetching:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const url = await db.storage.uploadImage(file);
            setFormData({ ...formData, image: url });
        } catch (error) {
            alert('فشل رفع الصورة. تأكد من إنشاء Bucket باسم images في Supabase');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.image) {
            alert('يرجى رفع صورة للجامعة أو وضع رابط');
            return;
        }

        setIsSubmitting(true);
        try {
            await db.universities.add({
                ...formData,
                features: []
            });
            setIsAddingMode(false);
            setFormData({
                name: '',
                country: 'تركيا',
                city: '',
                image: '',
                description: '',
                ranking: '',
                students: '',
                type: 'جامعة خاصة',
                founded: ''
            });
            fetchUniversities();
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
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsAddingMode(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        إضافة جامعة جديدة <Plus size={18} />
                    </button>
                </div>
                <div>
                    <h1 className="text-2xl font-black text-brand-navy">إدارة الجامعات</h1>
                    <p className="text-slate-500 mt-1">عرض وتعديل بيانات الجامعات الشريكة.</p>
                </div>
            </div>

            <AnimatePresence>
                {isAddingMode && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white rounded-[32px] p-8 shadow-xl border border-brand-red/10 overflow-hidden"
                    >
                        <div className="flex items-center justify-between mb-8 border-b pb-4">
                            <button onClick={() => setIsAddingMode(false)} className="text-slate-400 hover:text-brand-navy font-bold">إلغاء</button>
                            <h3 className="text-xl font-black text-brand-navy">إضافة بيانات جامعة جديدة</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block font-bold text-slate-700">اسم الجامعة</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-right focus:border-brand-red outline-none shadow-sm"
                                    placeholder="مثلاً: جامعة اسطنبول"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block font-bold text-slate-700">الدولة</label>
                                <select
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-right outline-none"
                                >
                                    <option>تركيا</option>
                                    <option>ماليزيا</option>
                                    <option>ألمانيا</option>
                                </select>
                            </div>

                            {/* Image Upload Part */}
                            <div className="md:col-span-2 space-y-2">
                                <label className="block font-bold text-slate-700">صورة الجامعة</label>
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-right outline-none"
                                            placeholder="رابط الصورة أو ارفع من جهازك..."
                                        />
                                    </div>
                                    <label className="bg-brand-navy text-white px-6 py-3 rounded-xl font-bold cursor-pointer hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shrink-0">
                                        {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                                        <span>{uploading ? 'جاري الرفع...' : 'رفع صورة'}</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                                    </label>
                                </div>
                                {formData.image && (
                                    <div className="mt-4 relative w-48 h-32 rounded-xl overflow-hidden border">
                                        <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, image: '' })}
                                            className="absolute top-1 right-1 bg-brand-red text-white p-1 rounded-full shadow-lg"
                                        >
                                            <Plus className="rotate-45" size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="block font-bold text-slate-700">المدينة</label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-right outline-none"
                                    placeholder="إسطنبول، أنقرة..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block font-bold text-slate-700">التصنيف</label>
                                <input
                                    type="text"
                                    value={formData.ranking}
                                    onChange={(e) => setFormData({ ...formData, ranking: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-right outline-none"
                                    placeholder="#10 محلياً"
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="block font-bold text-slate-700">نبذة عن الجامعة</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-right outline-none"
                                    placeholder="اكتب تفاصيل هنا..."
                                ></textarea>
                            </div>
                            <div className="md:col-span-2">
                                <button
                                    disabled={isSubmitting || uploading}
                                    type="submit"
                                    className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'حفظ الجامعة ونشرها'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100">
                <div className="p-6 border-b flex items-center justify-between bg-slate-50/50">
                    <div className="flex gap-2">
                        <button className="p-2.5 bg-white border rounded-xl text-slate-500 hover:text-brand-navy transition-all">
                            <Filter size={18} />
                        </button>
                        <div className="relative">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input type="text" placeholder="بحث مخصص..." className="bg-white border rounded-xl py-2 px-10 text-sm text-right outline-none" />
                        </div>
                    </div>
                    <h3 className="font-black text-brand-navy">قائمة الجامعات المسجلة</h3>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-20 flex justify-center">
                            <Loader2 className="animate-spin text-brand-red" size={40} />
                        </div>
                    ) : (
                        <table className="w-full text-right border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b text-slate-500 text-sm">
                                    <th className="p-6 font-bold">الجامعة</th>
                                    <th className="p-6 font-bold">الموقع</th>
                                    <th className="p-6 font-bold">التصنيف</th>
                                    <th className="p-6 font-bold text-left">التحكم</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {universities.map((uni) => (
                                    <tr key={uni.id} className="hover:bg-slate-50/50 transition-colors group text-brand-navy font-bold">
                                        <td className="p-6">
                                            <div className="flex items-center justify-end gap-3">
                                                <span>{uni.name}</span>
                                                <div className="w-10 h-10 bg-white rounded-lg overflow-hidden border border-slate-100 shadow-sm">
                                                    {uni.image ? <img src={uni.image} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="m-auto text-slate-300" />}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-slate-500 text-sm">{uni.country} - {uni.city}</td>
                                        <td className="p-6 text-slate-400 font-medium">{uni.ranking || 'N/A'}</td>
                                        <td className="p-6 text-left">
                                            <div className="flex items-center gap-2">
                                                <button className="p-2 text-slate-400 hover:text-brand-red hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                                                <button className="p-2 text-slate-400 hover:text-brand-navy hover:bg-slate-100 rounded-xl transition-all"><Edit2 size={18} /></button>
                                                <button className="p-2 text-slate-400 hover:text-brand-navy hover:bg-slate-100 rounded-xl transition-all"><Eye size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageUniversities;
