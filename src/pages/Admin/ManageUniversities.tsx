import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, Eye, Loader2, Upload, ImageIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../lib/db';
import RichTextEditor from '../../components/RichTextEditor';

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

const ManageUniversities = () => {
    const [isAddingMode, setIsAddingMode] = useState(false);
    const [universities, setUniversities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [activeLang, setActiveLang] = useState('ar');

    // Form State with multilingual fields
    const [formData, setFormData] = useState({
        name: '', name_en: '', name_tr: '',
        country: 'تركيا', country_en: 'Turkey', country_tr: 'Türkiye',
        city: '', city_en: '', city_tr: '',
        image: '',
        description: '', description_en: '', description_tr: '',
        ranking: '',
        students: '',
        type: 'جامعة خاصة', type_en: 'Private University', type_tr: 'Özel Üniversite',
        founded: '',
        website_url: ''
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
            alert('فشل رفع الصورة.');
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
            if (editingId) {
                await db.universities.update(editingId, formData);
            } else {
                await db.universities.add({
                    ...formData,
                    features: []
                });
            }

            setIsAddingMode(false);
            setEditingId(null);
            setFormData({
                name: '', name_en: '', name_tr: '',
                country: 'تركيا', country_en: 'Turkey', country_tr: 'Türkiye',
                city: '', city_en: '', city_tr: '',
                image: '',
                description: '', description_en: '', description_tr: '',
                ranking: '',
                students: '',
                type: 'جامعة خاصة', type_en: 'Private University', type_tr: 'Özel Üniversite',
                founded: '',
                website_url: ''
            });
            fetchUniversities();
        } catch (error: any) {
            alert('فشل الحفظ: ' + (error.message || 'خطأ غير معروف'));
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`هل أنت متأكد من حذف جامعة "${name}"؟`)) return;

        try {
            await db.universities.delete(id);
            fetchUniversities();
        } catch (error) {
            alert('فشل الحذف');
            console.error(error);
        }
    };

    const handleEdit = (uni: any) => {
        setEditingId(uni.id);
        setFormData({
            name: uni.name || '',
            name_en: uni.name_en || '',
            name_tr: uni.name_tr || '',
            country: uni.country || 'تركيا',
            country_en: uni.country_en || 'Turkey',
            country_tr: uni.country_tr || 'Türkiye',
            city: uni.city || '',
            city_en: uni.city_en || '',
            city_tr: uni.city_tr || '',
            image: uni.image || '',
            description: uni.description || '',
            description_en: uni.description_en || '',
            description_tr: uni.description_tr || '',
            ranking: uni.ranking || '',
            students: uni.students || '',
            type: uni.type || 'جامعة خاصة',
            type_en: uni.type_en || 'Private University',
            type_tr: uni.type_tr || 'Özel Üniversite',
            founded: uni.founded || '',
            website_url: uni.website_url || ''
        });
        setIsAddingMode(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const nameField = activeLang === 'ar' ? 'name' : activeLang === 'en' ? 'name_en' : 'name_tr';
    const cityField = activeLang === 'ar' ? 'city' : activeLang === 'en' ? 'city_en' : 'city_tr';
    const countryField = activeLang === 'ar' ? 'country' : activeLang === 'en' ? 'country_en' : 'country_tr';
    const typeField = activeLang === 'ar' ? 'type' : activeLang === 'en' ? 'type_en' : 'type_tr';
    const descField = activeLang === 'ar' ? 'description' : activeLang === 'en' ? 'description_en' : 'description_tr';

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
                            <button
                                onClick={() => {
                                    setIsAddingMode(false);
                                    setEditingId(null);
                                }}
                                className="text-slate-400 hover:text-brand-navy font-bold"
                            >
                                إلغاء
                            </button>
                            <h3 className="text-xl font-black text-brand-navy">
                                {editingId ? 'تعديل بيانات الجامعة' : 'إضافة بيانات جامعة جديدة'}
                            </h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <LangTabs active={activeLang} onChange={setActiveLang} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block font-bold text-slate-700">
                                        اسم الجامعة {activeLang === 'en' ? '(English)' : activeLang === 'tr' ? '(Türkçe)' : '(العربية)'}
                                    </label>
                                    <input
                                        required={activeLang === 'ar'}
                                        type="text"
                                        value={(formData as any)[nameField]}
                                        onChange={(e) => setFormData({ ...formData, [nameField]: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-right focus:border-brand-red outline-none shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block font-bold text-slate-700">
                                        الدولة {activeLang === 'en' ? '(Country)' : activeLang === 'tr' ? '(Ülke)' : ''}
                                    </label>
                                    <input
                                        type="text"
                                        value={(formData as any)[countryField]}
                                        onChange={(e) => setFormData({ ...formData, [countryField]: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-right outline-none"
                                        placeholder={activeLang === 'ar' ? 'مثال: تركيا' : activeLang === 'en' ? 'e.g. Turkey' : 'örn. Türkiye'}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block font-bold text-slate-700">
                                        المدينة {activeLang === 'en' ? '(English)' : activeLang === 'tr' ? '(Türkçe)' : '(العربية)'}
                                    </label>
                                    <input
                                        type="text"
                                        value={(formData as any)[cityField]}
                                        onChange={(e) => setFormData({ ...formData, [cityField]: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-right outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block font-bold text-slate-700">التصنيف</label>
                                    <input
                                        type="text"
                                        value={formData.ranking}
                                        onChange={(e) => setFormData({ ...formData, ranking: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-right outline-none"
                                        placeholder="مثال: #120"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block font-bold text-slate-700">سنة التأسيس</label>
                                    <input
                                        type="text"
                                        value={formData.founded}
                                        onChange={(e) => setFormData({ ...formData, founded: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-right outline-none"
                                        placeholder="مثال: 1996"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block font-bold text-slate-700">عدد الطلاب</label>
                                    <input
                                        type="text"
                                        value={formData.students}
                                        onChange={(e) => setFormData({ ...formData, students: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-right outline-none"
                                        placeholder="مثال: 20,000+"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block font-bold text-slate-700">
                                        نوع الجامعة {activeLang === 'en' ? '(Type)' : activeLang === 'tr' ? '(Tür)' : ''}
                                    </label>
                                    <input
                                        type="text"
                                        value={(formData as any)[typeField]}
                                        onChange={(e) => setFormData({ ...formData, [typeField]: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-right outline-none"
                                        placeholder={activeLang === 'ar' ? 'مثال: جامعة خاصة' : activeLang === 'en' ? 'e.g. Private' : 'örn. Vakıf'}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block font-bold text-slate-700">رابط الموقع</label>
                                    <input
                                        type="url"
                                        value={formData.website_url}
                                        onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-right outline-none"
                                        placeholder="https://..."
                                    />
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
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="block font-bold text-slate-700">
                                        نبذة عن الجامعة {activeLang === 'en' ? '(English)' : activeLang === 'tr' ? '(Türkçe)' : '(العربية)'}
                                    </label>
                                    <div className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2">
                                        <RichTextEditor
                                            value={(formData as any)[descField]}
                                            onChange={(val: string) => setFormData({ ...formData, [descField]: val })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                disabled={isSubmitting || uploading}
                                type="submit"
                                className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" /> : 'حفظ الجامعة ونشرها'}
                            </button>
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
                                                <div>
                                                    <p>{uni.name}</p>
                                                    {uni.name_en && <p className="text-xs text-slate-400">{uni.name_en}</p>}
                                                </div>
                                                <div className="w-10 h-10 bg-white rounded-lg overflow-hidden border border-slate-100 shadow-sm">
                                                    {uni.image ? <img src={uni.image} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="m-auto text-slate-300" />}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-slate-500 text-sm">{uni.country} - {uni.city}</td>
                                        <td className="p-6 text-slate-400 font-medium">{uni.ranking || 'N/A'}</td>
                                        <td className="p-6 text-left">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleDelete(uni.id, uni.name)}
                                                    className="p-2 text-slate-400 hover:text-brand-red hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(uni)}
                                                    className="p-2 text-slate-400 hover:text-brand-navy hover:bg-slate-100 rounded-xl transition-all"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => window.open(`/university/${uni.id}`, '_blank')}
                                                    className="p-2 text-slate-400 hover:text-brand-navy hover:bg-slate-100 rounded-xl transition-all"
                                                >
                                                    <Eye size={18} />
                                                </button>
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
