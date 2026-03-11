import { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, GraduationCap, ChevronDown, ChevronUp, BookOpen, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../lib/db';

interface Branch {
    id?: string;
    name: string;
    name_en: string;
    name_tr: string;
    language: string;
    language_en: string;
    language_tr: string;
    duration: string;
    duration_en: string;
    duration_tr: string;
    degree: string;
    degree_en: string;
    degree_tr: string;
}

interface Faculty {
    id: string;
    university_id: string;
    name: string;
    name_en: string;
    name_tr: string;
    branches?: Branch[];
}

interface University {
    id: string;
    name: string;
    country: string;
}

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

// Translation Maps
const DEGREE_MAP: Record<string, { en: string, tr: string }> = {
    'بكالوريوس': { en: 'Bachelor', tr: 'Lisans' },
    'ماجستير مع أطروحة': { en: 'Master with Thesis', tr: 'Tezli Yüksek Lisans' },
    'مدرسة مهنية': { en: 'Vocational School', tr: 'Meslek Yüksekokulu' },
    'دكتوراه': { en: 'PhD', tr: 'Doktora' },
    'ماجستير بدون أطروحة': { en: 'Master without Thesis', tr: 'Tezsiz Yüksek Lisans' },
    'دكتوراه متكاملة': { en: 'Integrated PhD', tr: 'Bütünleşik Doktora' }
};

const LANGUAGE_MAP: Record<string, { en: string, tr: string }> = {
    'الإنجليزية': { en: 'English', tr: 'İngilizce' },
    'التركية': { en: 'Turkish', tr: 'Türkçe' },
    'عربي + إنجليزي': { en: 'Arabic + English', tr: 'Arapça + İngilizce' },
    'الفرنسية': { en: 'French', tr: 'Fransızca' }
};

const DURATION_MAP: Record<string, { en: string, tr: string }> = {
    '4 سنوات': { en: '4 Years', tr: '4 Yıl' },
    '5 سنوات': { en: '5 Years', tr: '5 Yıl' },
    '6 سنوات': { en: '6 Years', tr: '6 Yıl' },
    '2 سنة': { en: '2 Years', tr: '2 Yıl' }
};

const ManageFaculties = () => {
    const [universities, setUniversities] = useState<University[]>([]);
    const [selectedUni, setSelectedUni] = useState<string>('');
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [loading, setLoading] = useState(false);
    const [expandedFaculty, setExpandedFaculty] = useState<string | null>(null);
    const [activeLangFaculty, setActiveLangFaculty] = useState('ar');
    const [activeLangBranch, setActiveLangBranch] = useState('ar');

    // Add Faculty Form
    const [showFacultyForm, setShowFacultyForm] = useState(false);
    const [facultyData, setFacultyData] = useState({ name: '', name_en: '', name_tr: '' });
    const [isSubmittingFaculty, setIsSubmittingFaculty] = useState(false);

    // Add Branch Form
    const [showBranchForm, setShowBranchForm] = useState<string | null>(null);
    const [branchData, setBranchData] = useState<Branch>({
        name: '', name_en: '', name_tr: '',
        language: 'الإنجليزية', language_en: 'English', language_tr: 'İngilizce',
        duration: '4 سنوات', duration_en: '4 Years', duration_tr: '4 Yıl',
        degree: 'بكالوريوس', degree_en: 'Bachelor', degree_tr: 'Lisans'
    });
    const [isSubmittingBranch, setIsSubmittingBranch] = useState(false);

    useEffect(() => {
        db.universities.getAll().then(setUniversities).catch(console.error);
    }, []);

    useEffect(() => {
        if (!selectedUni) return;
        setLoading(true);
        db.faculties.getByUniversity(selectedUni)
            .then(setFaculties)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [selectedUni]);

    const handleAddFaculty = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUni || !facultyData.name.trim()) return;
        setIsSubmittingFaculty(true);
        try {
            const newFaculty = await db.faculties.add({ university_id: selectedUni, ...facultyData });
            setFaculties(prev => [...prev, { ...newFaculty, branches: [] }]);
            setFacultyData({ name: '', name_en: '', name_tr: '' });
            setShowFacultyForm(false);
        } catch (err: any) {
            alert('فشل الحفظ: ' + err.message);
        } finally {
            setIsSubmittingFaculty(false);
        }
    };

    const handleDeleteFaculty = async (facultyId: string) => {
        if (!confirm('هل أنت متأكد من حذف هذه الكلية وجميع أفرعها؟')) return;
        try {
            await db.faculties.delete(facultyId);
            setFaculties(prev => prev.filter(f => f.id !== facultyId));
        } catch (err: any) {
            alert('فشل الحذف: ' + err.message);
        }
    };

    const handleAddBranch = async (e: React.FormEvent, facultyId: string) => {
        e.preventDefault();
        if (!branchData.name.trim()) return;
        setIsSubmittingBranch(true);
        try {
            const newBranch = await db.branches.add({ ...branchData, faculty_id: facultyId });
            setFaculties(prev => prev.map(f =>
                f.id === facultyId
                    ? { ...f, branches: [...(f.branches || []), newBranch] }
                    : f
            ));
            setBranchData({
                name: '', name_en: '', name_tr: '',
                language: 'الإنجليزية', language_en: 'English', language_tr: 'İngilizce',
                duration: '4 سنوات', duration_en: '4 Years', duration_tr: '4 Yıl',
                degree: 'بكالوريوس', degree_en: 'Bachelor', degree_tr: 'Lisans'
            });
            setShowBranchForm(null);
        } catch (err: any) {
            alert('فشل الحفظ: ' + err.message);
        } finally {
            setIsSubmittingBranch(false);
        }
    };

    const handleDeleteBranch = async (branchId: string, facultyId: string) => {
        try {
            await db.branches.delete(branchId);
            setFaculties(prev => prev.map(f =>
                f.id === facultyId
                    ? { ...f, branches: f.branches?.filter(b => b.id !== branchId) }
                    : f
            ));
        } catch (err: any) {
            alert('فشل الحذف: ' + err.message);
        }
    };

    const facultyNameField = activeLangFaculty === 'ar' ? 'name' : activeLangFaculty === 'en' ? 'name_en' : 'name_tr';
    const branchNameField = activeLangBranch === 'ar' ? 'name' : activeLangBranch === 'en' ? 'name_en' : 'name_tr';
    const branchDegreeField = activeLangBranch === 'ar' ? 'degree' : activeLangBranch === 'en' ? 'degree_en' : 'degree_tr';
    const branchLanguageField = activeLangBranch === 'ar' ? 'language' : activeLangBranch === 'en' ? 'language_en' : 'language_tr';
    const branchDurationField = activeLangBranch === 'ar' ? 'duration' : activeLangBranch === 'en' ? 'duration_en' : 'duration_tr';

    return (
        <div className="space-y-8 text-right font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-brand-navy">إدارة الكليات والأفرع</h1>
                    <p className="text-slate-500 mt-1">أضف الكليات والتخصصات لكل جامعة.</p>
                </div>
            </div>

            {/* University Selector */}
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100">
                <label className="block font-black text-brand-navy mb-3">اختر الجامعة</label>
                <select
                    value={selectedUni}
                    onChange={e => { setSelectedUni(e.target.value); setExpandedFaculty(null); }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-right font-bold text-brand-navy outline-none focus:border-brand-red transition-colors"
                >
                    <option value="">-- اختر جامعة --</option>
                    {universities.map(u => (
                        <option key={u.id} value={u.id}>{u.name} ({u.country})</option>
                    ))}
                </select>
            </div>

            {/* Faculties Section */}
            <AnimatePresence>
                {selectedUni && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                    >
                        {/* Add Faculty Button */}
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => setShowFacultyForm(true)}
                                className="btn-primary flex items-center gap-2 text-sm"
                            >
                                إضافة كلية جديدة <Plus size={16} />
                            </button>
                            <h2 className="text-xl font-black text-brand-navy flex items-center gap-2">
                                الكليات المتاحة <GraduationCap size={22} className="text-brand-red" />
                            </h2>
                        </div>

                        {/* Add Faculty Form */}
                        <AnimatePresence>
                            {showFacultyForm && (
                                <motion.form
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    onSubmit={handleAddFaculty}
                                    className="bg-gradient-to-br from-brand-navy to-slate-800 text-white rounded-[24px] p-6 overflow-hidden border border-white/10"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <button type="button" onClick={() => setShowFacultyForm(false)} className="text-white/50 hover:text-white transition-colors">
                                            <X size={20} />
                                        </button>
                                        <h3 className="font-black text-lg">إضافة كلية جديدة</h3>
                                    </div>

                                    <LangTabs active={activeLangFaculty} onChange={setActiveLangFaculty} />

                                    <div className="flex gap-3">
                                        <button
                                            type="submit"
                                            disabled={isSubmittingFaculty}
                                            className="bg-brand-red text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-red-600 transition-colors shrink-0"
                                        >
                                            {isSubmittingFaculty ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                                            حفظ
                                        </button>
                                        <input
                                            required={activeLangFaculty === 'ar'}
                                            type="text"
                                            value={(facultyData as any)[facultyNameField]}
                                            onChange={e => setFacultyData({ ...facultyData, [facultyNameField]: e.target.value })}
                                            placeholder={activeLangFaculty === 'en' ? 'Faculty Name' : activeLangFaculty === 'tr' ? 'Fakülte Adı' : 'اسم الكلية'}
                                            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-right font-bold placeholder:text-white/40 outline-none focus:border-brand-red transition-colors"
                                        />
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>

                        {/* Loading */}
                        {loading ? (
                            <div className="flex justify-center py-16">
                                <Loader2 className="animate-spin text-brand-red" size={40} />
                            </div>
                        ) : faculties.length === 0 ? (
                            <div className="bg-white rounded-[24px] p-12 text-center border border-dashed border-slate-200">
                                <GraduationCap size={48} className="mx-auto text-slate-300 mb-4" />
                                <p className="font-bold text-slate-400">لا توجد كليات مضافة بعد لهذه الجامعة</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {faculties.map(faculty => (
                                    <motion.div
                                        key={faculty.id}
                                        layout
                                        className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden"
                                    >
                                        {/* Faculty Header */}
                                        <div
                                            className="flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50/70 transition-colors group"
                                            onClick={() => setExpandedFaculty(expandedFaculty === faculty.id ? null : faculty.id)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={e => { e.stopPropagation(); handleDeleteFaculty(faculty.id); }}
                                                    className="p-2 text-slate-300 hover:text-brand-red hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                {expandedFaculty === faculty.id
                                                    ? <ChevronUp size={20} className="text-brand-red" />
                                                    : <ChevronDown size={20} className="text-slate-400 group-hover:text-brand-navy transition-colors" />
                                                }
                                                <span className="text-sm text-slate-400 font-bold bg-slate-100 px-3 py-1 rounded-full">
                                                    {faculty.branches?.length || 0} فرع
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <h3 className="font-black text-brand-navy text-lg">{faculty.name}</h3>
                                                    {faculty.name_en && <p className="text-xs text-slate-400 font-bold">{faculty.name_en}</p>}
                                                </div>
                                                <div className="w-10 h-10 bg-brand-red/10 text-brand-red rounded-2xl flex items-center justify-center">
                                                    <BookOpen size={20} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Branches Section */}
                                        <AnimatePresence>
                                            {expandedFaculty === faculty.id && (
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: 'auto' }}
                                                    exit={{ height: 0 }}
                                                    className="overflow-hidden border-t border-slate-100"
                                                >
                                                    <div className="p-6 space-y-4">
                                                        {/* Branches Table */}
                                                        {faculty.branches && faculty.branches.length > 0 ? (
                                                            <div className="overflow-x-auto rounded-2xl border border-slate-100">
                                                                <table className="w-full text-right border-collapse">
                                                                    <thead>
                                                                        <tr className="bg-slate-50 text-slate-500 text-sm">
                                                                            <th className="p-4 font-bold">حذف</th>
                                                                            <th className="p-4 font-bold">اسم الفرع / التخصص</th>
                                                                            <th className="p-4 font-bold">لغة الدراسة</th>
                                                                            <th className="p-4 font-bold">مدة الدراسة</th>
                                                                            <th className="p-4 font-bold">المرحلة</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-slate-50 font-bold">
                                                                        {faculty.branches.map(branch => (
                                                                            <tr key={branch.id} className="hover:bg-slate-50/50 transition-colors text-brand-navy">
                                                                                <td className="p-4">
                                                                                    <button
                                                                                        onClick={() => handleDeleteBranch(branch.id!, faculty.id)}
                                                                                        className="p-1.5 text-slate-300 hover:text-brand-red hover:bg-red-50 rounded-lg transition-all"
                                                                                    >
                                                                                        <Trash2 size={15} />
                                                                                    </button>
                                                                                </td>
                                                                                <td className="p-4">
                                                                                    <p>{branch.name}</p>
                                                                                    {branch.name_en && <p className="text-[10px] text-slate-400">{branch.name_en}</p>}
                                                                                </td>
                                                                                <td className="p-4 text-slate-500">
                                                                                    <p>{branch.language}</p>
                                                                                    {branch.language_en && <p className="text-[10px] text-slate-400">{branch.language_en}</p>}
                                                                                </td>
                                                                                <td className="p-4 text-slate-500">
                                                                                    <p>{branch.duration}</p>
                                                                                    {branch.duration_en && <p className="text-[10px] text-slate-400">{branch.duration_en}</p>}
                                                                                </td>
                                                                                <td className="p-4">
                                                                                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs">
                                                                                        {branch.degree || 'بكالوريوس'}
                                                                                        {branch.degree_en && <span className="block text-[10px] opacity-70">{branch.degree_en}</span>}
                                                                                    </span>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        ) : (
                                                            <p className="text-center text-slate-400 font-bold py-4">لا توجد أفرع مضافة بعد</p>
                                                        )}

                                                        {/* Add Branch Form Toggle */}
                                                        {showBranchForm === faculty.id ? (
                                                            <motion.form
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                onSubmit={e => handleAddBranch(e, faculty.id)}
                                                                className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4"
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <button type="button" onClick={() => setShowBranchForm(null)} className="text-slate-400 hover:text-brand-navy">
                                                                        <X size={18} />
                                                                    </button>
                                                                    <h4 className="font-black text-brand-navy">إضافة فرع / تخصص</h4>
                                                                </div>

                                                                <LangTabs active={activeLangBranch} onChange={setActiveLangBranch} />

                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div className="space-y-1">
                                                                        <label className="text-sm font-bold text-slate-600">
                                                                            اسم الفرع {activeLangBranch === 'en' ? '(EN)' : activeLangBranch === 'tr' ? '(TR)' : '(AR)'}
                                                                        </label>
                                                                        <input
                                                                            required={activeLangBranch === 'ar'}
                                                                            type="text"
                                                                            value={(branchData as any)[branchNameField]}
                                                                            onChange={e => setBranchData({ ...branchData, [branchNameField]: e.target.value })}
                                                                            placeholder={activeLangBranch === 'en' ? 'Computer Eng.' : activeLangBranch === 'tr' ? 'Bilgisayar Müh.' : 'هندسة الحاسوب'}
                                                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-right font-bold outline-none focus:border-brand-red transition-colors"
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <label className="text-sm font-bold text-slate-600">
                                                                            المرحلة الدراسية {activeLangBranch === 'en' ? '(EN)' : activeLangBranch === 'tr' ? '(TR)' : '(AR)'}
                                                                        </label>
                                                                        {activeLangBranch === 'ar' ? (
                                                                            <select
                                                                                value={(branchData as any)[branchDegreeField]}
                                                                                onChange={e => {
                                                                                    const val = e.target.value;
                                                                                    const mapping = DEGREE_MAP[val];
                                                                                    setBranchData({
                                                                                        ...branchData,
                                                                                        degree: val,
                                                                                        degree_en: mapping?.en || branchData.degree_en,
                                                                                        degree_tr: mapping?.tr || branchData.degree_tr
                                                                                    });
                                                                                }}
                                                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-right font-bold outline-none"
                                                                            >
                                                                                <option>بكالوريوس</option>
                                                                                <option>ماجستير مع أطروحة</option>
                                                                                <option>مدرسة مهنية</option>
                                                                                <option>دكتوراه</option>
                                                                                <option>ماجستير بدون أطروحة</option>
                                                                                <option>دكتوراه متكاملة</option>
                                                                            </select>
                                                                        ) : (
                                                                            <input
                                                                                type="text"
                                                                                value={(branchData as any)[branchDegreeField]}
                                                                                onChange={e => setBranchData({ ...branchData, [branchDegreeField]: e.target.value })}
                                                                                placeholder={activeLangBranch === 'en' ? 'Bachelor' : 'Lisans'}
                                                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-right font-bold outline-none focus:border-brand-red transition-colors"
                                                                            />
                                                                        )}
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <label className="text-sm font-bold text-slate-600">
                                                                            لغة الدراسة {activeLangBranch === 'en' ? '(EN)' : activeLangBranch === 'tr' ? '(TR)' : '(AR)'}
                                                                        </label>
                                                                        {activeLangBranch === 'ar' ? (
                                                                            <select
                                                                                value={(branchData as any)[branchLanguageField]}
                                                                                onChange={e => {
                                                                                    const val = e.target.value;
                                                                                    const mapping = LANGUAGE_MAP[val];
                                                                                    setBranchData({
                                                                                        ...branchData,
                                                                                        language: val,
                                                                                        language_en: mapping?.en || branchData.language_en,
                                                                                        language_tr: mapping?.tr || branchData.language_tr
                                                                                    });
                                                                                }}
                                                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-right font-bold outline-none"
                                                                            >
                                                                                <option>الإنجليزية</option>
                                                                                <option>التركية</option>
                                                                                <option>عربي + إنجليزي</option>
                                                                                <option>الفرنسية</option>
                                                                            </select>
                                                                        ) : (
                                                                            <input
                                                                                type="text"
                                                                                value={(branchData as any)[branchLanguageField]}
                                                                                onChange={e => setBranchData({ ...branchData, [branchLanguageField]: e.target.value })}
                                                                                placeholder={activeLangBranch === 'en' ? 'English' : 'Türkçe'}
                                                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-right font-bold outline-none focus:border-brand-red transition-colors"
                                                                            />
                                                                        )}
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <label className="text-sm font-bold text-slate-600">
                                                                            مدة الدراسة {activeLangBranch === 'en' ? '(EN)' : activeLangBranch === 'tr' ? '(TR)' : '(AR)'}
                                                                        </label>
                                                                        {activeLangBranch === 'ar' ? (
                                                                            <select
                                                                                value={(branchData as any)[branchDurationField]}
                                                                                onChange={e => {
                                                                                    const val = e.target.value;
                                                                                    const mapping = DURATION_MAP[val];
                                                                                    setBranchData({
                                                                                        ...branchData,
                                                                                        duration: val,
                                                                                        duration_en: mapping?.en || branchData.duration_en,
                                                                                        duration_tr: mapping?.tr || branchData.duration_tr
                                                                                    });
                                                                                }}
                                                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-right font-bold outline-none"
                                                                            >
                                                                                <option>4 سنوات</option>
                                                                                <option>5 سنوات</option>
                                                                                <option>6 سنوات</option>
                                                                                <option>2 سنة</option>
                                                                            </select>
                                                                        ) : (
                                                                            <input
                                                                                type="text"
                                                                                value={(branchData as any)[branchDurationField]}
                                                                                onChange={e => setBranchData({ ...branchData, [branchDurationField]: e.target.value })}
                                                                                placeholder={activeLangBranch === 'en' ? '4 Years' : '4 Yıl'}
                                                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-right font-bold outline-none focus:border-brand-red transition-colors"
                                                                            />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-3 justify-start">
                                                                    <button
                                                                        type="submit"
                                                                        disabled={isSubmittingBranch}
                                                                        className="btn-primary flex items-center gap-2"
                                                                    >
                                                                        {isSubmittingBranch ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                                                                        حفظ الفرع
                                                                    </button>
                                                                </div>
                                                            </motion.form>
                                                        ) : (
                                                            <button
                                                                onClick={() => {
                                                                    setShowBranchForm(faculty.id); setBranchData({
                                                                        name: '', name_en: '', name_tr: '',
                                                                        language: 'الإنجليزية', language_en: 'English', language_tr: 'İngilizce',
                                                                        duration: '4 سنوات', duration_en: '4 Years', duration_tr: '4 Yıl',
                                                                        degree: 'بكالوريوس', degree_en: 'Bachelor', degree_tr: 'Lisans'
                                                                    });
                                                                }}
                                                                className="flex items-center gap-2 text-brand-red font-bold text-sm hover:text-red-700 transition-colors mr-auto"
                                                            >
                                                                <Plus size={16} /> إضافة فرع / تخصص
                                                            </button>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageFaculties;
