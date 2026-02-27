import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
    Star,
    Users,
    BookOpen,
    CheckCircle2,
    Globe,
    GraduationCap,
    ShieldCheck,
    Building2,
    Calendar,
    Loader2,
    ChevronDown,
    Clock,
    DollarSign
} from 'lucide-react';
import CTA from '../components/CTA';
import { db } from '../lib/db';

const UniversityDetail = ({ onOpenModal }: { onOpenModal: () => void }) => {
    const { id } = useParams<{ id: string }>();
    const [university, setUniversity] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [openFaculty, setOpenFaculty] = useState<number | null>(null);

    useEffect(() => {
        const fetchUniversity = async () => {
            if (!id) return;
            try {
                const data = await db.universities.getById(id);
                setUniversity(data);
            } catch (error) {
                console.error('Error fetching university:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUniversity();
    }, [id]);

    if (loading) {
        return (
            <div className="pt-40 pb-20 flex flex-col items-center justify-center text-brand-navy">
                <Loader2 className="animate-spin mb-4" size={48} />
                <p className="text-xl font-black">جاري تحميل تفاصيل الجامعة...</p>
            </div>
        );
    }

    if (!university) {
        return (
            <div className="pt-40 pb-20 text-center text-brand-navy">
                <h2 className="text-3xl font-black">عذراً، لم يتم العثور على الجامعة</h2>
                <p className="mt-4 text-slate-500 font-bold">قد يكون الرابط غير صحيح أو تم مسح الجامعة.</p>
            </div>
        );
    }

    const faculties = university.colleges || [];

    return (
        <div className="pt-24 min-h-screen bg-slate-50 font-sans">
            {/* Hero Header */}
            <section className="relative h-[400px] md:h-[500px] overflow-hidden">
                <img src={university.image} className="absolute inset-0 w-full h-full object-cover" alt={university.name} />
                <div className="absolute inset-0 bg-brand-navy/70 backdrop-blur-[2px]"></div>
                <div className="container mx-auto px-6 relative h-full flex flex-col justify-end pb-16 text-right text-white">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center justify-end gap-2 mb-4">
                            <span className="bg-brand-red px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg shadow-brand-red/20">{university.country}</span>
                            <span className="bg-white/20 backdrop-blur px-4 py-1 rounded-full text-sm font-bold border border-white/10">{university.city}</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">{university.name}</h1>
                        <div className="flex flex-wrap justify-end gap-6 md:gap-12">
                            <div className="flex items-center gap-2">
                                <div className="text-right">
                                    <p className="text-white/60 text-xs font-bold">التصنيف</p>
                                    <p className="font-extrabold text-lg">{university.ranking || 'غير متوفر'}</p>
                                </div>
                                <Star className="text-yellow-400 fill-yellow-400" size={24} />
                            </div>
                            <div className="flex items-center gap-2 border-r border-white/20 pr-6">
                                <div className="text-right">
                                    <p className="text-white/60 text-xs font-bold">عدد الطلاب</p>
                                    <p className="font-extrabold text-lg">{university.students || 'غير متوفر'}</p>
                                </div>
                                <Users className="text-blue-400" size={24} />
                            </div>
                            <div className="flex items-center gap-2 border-r border-white/20 pr-6">
                                <div className="text-right">
                                    <p className="text-white/60 text-xs font-bold">نوع الجامعة</p>
                                    <p className="font-extrabold text-lg">{university.type || 'خاصة'}</p>
                                </div>
                                <Building2 className="text-green-400" size={24} />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 order-2 lg:order-1">
                        <div className="bg-white rounded-[32px] p-8 shadow-2xl shadow-slate-200/50 border border-slate-100 sticky top-32">
                            <h3 className="text-xl font-black text-brand-navy mb-8 text-right border-b pb-4">معلومات سريعة</h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="font-extrabold text-brand-navy">{university.founded || '-'}</span>
                                    <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                                        <span>سنة التأسيس</span>
                                        <Calendar size={20} className="text-brand-red" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-extrabold text-brand-navy">الإنجليزية / التركية</span>
                                    <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                                        <span>لغات الدراسة</span>
                                        <Globe size={20} className="text-brand-red" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-extrabold text-green-600">مجاني عبرنا</span>
                                    <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                                        <span>رسوم التقديم</span>
                                        <ShieldCheck size={20} className="text-brand-red" />
                                    </div>
                                </div>
                                {faculties.length > 0 && (
                                    <div className="flex items-center justify-between">
                                        <span className="font-extrabold text-brand-navy">{faculties.length} كليات</span>
                                        <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                                            <span>عدد الكليات</span>
                                            <GraduationCap size={20} className="text-brand-red" />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="mt-10 p-6 bg-slate-50 rounded-3xl text-right border border-slate-100">
                                <p className="text-sm font-black text-brand-navy mb-4">هل ترغب في الحصول على قبولك؟</p>
                                <button
                                    onClick={onOpenModal}
                                    className="btn-primary w-full py-4 text-lg shadow-xl shadow-brand-red/30 active:scale-95 transition-transform"
                                >
                                    احصل على قبول مجاني
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Details */}
                    <div className="lg:col-span-2 order-1 lg:order-2 text-right space-y-14">
                        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                            <h2 className="text-3xl font-black text-brand-navy mb-6 flex items-center justify-end gap-3">
                                نبذة عن الجامعة <BookOpen className="text-brand-red" />
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed font-medium">{university.description}</p>
                        </motion.div>

                        {university.features && university.features.length > 0 && (
                            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                                <h2 className="text-3xl font-black text-brand-navy mb-8 flex items-center justify-end gap-3">
                                    مميزات الدراسة في الجامعة <CheckCircle2 className="text-brand-red" />
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {university.features.map((feature: string, idx: number) => (
                                        <div key={idx} className="flex items-center justify-end gap-3 p-5 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-brand-red/30 transition-colors">
                                            <span className="font-bold text-slate-700">{feature}</span>
                                            <div className="w-8 h-8 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center shrink-0">
                                                <CheckCircle2 size={18} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* ===== Faculties Accordion ===== */}
                        {faculties.length > 0 && (
                            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                                <h2 className="text-3xl font-black text-brand-navy mb-8 flex items-center justify-end gap-3">
                                    الكليات والتخصصات <GraduationCap className="text-brand-red" />
                                </h2>
                                <div className="space-y-4">
                                    {faculties.map((faculty: any, idx: number) => {
                                        const branches = faculty.branches || [];
                                        const isOpen = openFaculty === idx;
                                        return (
                                            <motion.div
                                                key={faculty.id}
                                                layout
                                                initial={{ opacity: 0, y: 10 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: idx * 0.05 }}
                                                className={`bg-white rounded-[24px] overflow-hidden shadow-sm border transition-all duration-300 ${isOpen ? 'border-brand-red/30 shadow-brand-red/5 shadow-lg' : 'border-slate-100 hover:border-slate-200'}`}
                                            >
                                                <button
                                                    onClick={() => setOpenFaculty(isOpen ? null : idx)}
                                                    className="w-full flex items-center justify-between p-6 text-right group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                                            <ChevronDown size={20} className={`transition-colors ${isOpen ? 'text-brand-red' : 'text-slate-400 group-hover:text-brand-navy'}`} />
                                                        </motion.div>
                                                        <span className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${isOpen ? 'bg-brand-red/10 text-brand-red' : 'bg-slate-100 text-slate-500'}`}>
                                                            {branches.length} تخصص
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <h3 className="font-black text-brand-navy text-lg group-hover:text-brand-red transition-colors">{faculty.name}</h3>
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-brand-red text-white' : 'bg-brand-red/10 text-brand-red'}`}>
                                                            <GraduationCap size={22} />
                                                        </div>
                                                    </div>
                                                </button>

                                                <AnimatePresence>
                                                    {isOpen && (
                                                        <motion.div
                                                            key="content"
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="border-t border-slate-100">
                                                                {branches.length > 0 ? (
                                                                    <div className="overflow-x-auto">
                                                                        <table className="w-full text-right border-collapse">
                                                                            <thead>
                                                                                <tr className="bg-slate-50 text-slate-500 text-sm">
                                                                                    <th className="p-5 font-bold">التخصص</th>
                                                                                    <th className="p-5 font-bold">لغة الدراسة</th>
                                                                                    <th className="p-5 font-bold">
                                                                                        <span className="flex items-center justify-end gap-1"><Clock size={14} />المدة</span>
                                                                                    </th>
                                                                                    <th className="p-5 font-bold">
                                                                                        <span className="flex items-center justify-end gap-1"><DollarSign size={14} />السعر السنوي</span>
                                                                                    </th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="divide-y divide-slate-50">
                                                                                {branches.map((branch: any, bIdx: number) => (
                                                                                    <motion.tr
                                                                                        key={branch.id}
                                                                                        initial={{ opacity: 0, x: 10 }}
                                                                                        animate={{ opacity: 1, x: 0 }}
                                                                                        transition={{ delay: bIdx * 0.05 }}
                                                                                        className="hover:bg-slate-50/60 transition-colors"
                                                                                    >
                                                                                        <td className="p-5 font-black text-brand-navy">{branch.name}</td>
                                                                                        <td className="p-5">
                                                                                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{branch.language}</span>
                                                                                        </td>
                                                                                        <td className="p-5 text-slate-500 font-bold">{branch.duration}</td>
                                                                                        <td className="p-5">
                                                                                            <span className="text-brand-red font-black text-lg">{branch.price}</span>
                                                                                        </td>
                                                                                    </motion.tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                ) : (
                                                                    <div className="py-8 text-center text-slate-400 font-bold">
                                                                        <GraduationCap size={36} className="mx-auto mb-2 text-slate-300" />
                                                                        لا توجد تخصصات مضافة لهذه الكلية بعد
                                                                    </div>
                                                                )}
                                                                <div className="p-5 border-t border-slate-50 text-left">
                                                                    <button
                                                                        onClick={onOpenModal}
                                                                        className="text-brand-red font-bold text-sm hover:text-red-700 transition-colors"
                                                                    >
                                                                        تقدم للقبول في هذه الكلية ←
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            <CTA onOpenModal={onOpenModal} />
        </div>
    );
};

export default UniversityDetail;
