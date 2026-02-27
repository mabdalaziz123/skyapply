import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Mail, Phone, GraduationCap } from 'lucide-react';

interface ConsultationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ConsultationModal = ({ isOpen, onClose }: ConsultationModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white rounded-[32px] w-full max-w-lg relative z-10 overflow-hidden shadow-2xl"
                    >
                        <div className="bg-brand-red p-8 text-white relative">
                            <button
                                onClick={onClose}
                                className="absolute top-4 left-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                            <h3 className="text-2xl font-black mb-2 text-right">طلب استشارة مجانية</h3>
                            <p className="text-white/80 text-right">اترك معلوماتك وسنتواصل معك خلال 24 ساعة</p>
                        </div>

                        <form className="p-8 space-y-4 text-right" onSubmit={(e) => e.preventDefault()}>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700 block">الاسم الكامل</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="أدخل اسمك"
                                        className="w-full pr-12 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-red outline-none transition-all"
                                    />
                                    <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700 block">رقم الهاتف</label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        placeholder="+90 5XX XXX XX XX"
                                        className="w-full pr-12 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-red outline-none transition-all"
                                    />
                                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700 block">البريد الإلكتروني</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="example@mail.com"
                                        className="w-full pr-12 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-red outline-none transition-all"
                                    />
                                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700 block">التخصص المطلوب</label>
                                <div className="relative">
                                    <select className="w-full pr-12 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-red outline-none transition-all appearance-none">
                                        <option>الطب البشري</option>
                                        <option>الهندسة</option>
                                        <option>إدارة الأعمال</option>
                                        <option>الذكاء الاصطناعي</option>
                                    </select>
                                    <GraduationCap className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                </div>
                            </div>

                            <button className="btn-primary w-full mt-6 py-4 flex items-center justify-center gap-2 text-lg">
                                إرسال الطلب <Send size={20} className="rotate-180" />
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConsultationModal;
