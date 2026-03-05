import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Phone, GraduationCap, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ConsultationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ConsultationModal = ({ isOpen, onClose }: ConsultationModalProps) => {
    const { t, dir } = useLanguage();

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
                        dir={dir}
                    >
                        <div className="bg-brand-red p-8 text-white relative">
                            <button
                                onClick={onClose}
                                className={`absolute top-4 ${dir === 'rtl' ? 'left-4' : 'right-4'} p-2 hover:bg-white/20 rounded-full transition-colors`}
                            >
                                <X size={24} />
                            </button>
                            <h3 className={`text-2xl font-black mb-2 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('modal_title')}</h3>
                            <p className={`text-white/80 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('modal_success').split('!')[0]}!</p>
                        </div>

                        <form className={`p-8 space-y-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`} onSubmit={(e) => e.preventDefault()}>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700 block">{t('modal_name')}</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder={t('modal_name_placeholder')}
                                        className={`w-full ${dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-red outline-none transition-all`}
                                    />
                                    <User className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400`} size={20} />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700 block">{t('modal_phone')}</label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        placeholder={t('modal_phone_placeholder')}
                                        className={`w-full ${dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-red outline-none transition-all`}
                                    />
                                    <Phone className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400`} size={20} />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700 block">Email</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="example@mail.com"
                                        className={`w-full ${dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-red outline-none transition-all`}
                                    />
                                    <Mail className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400`} size={20} />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700 block">{t('modal_major')}</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder={t('modal_major_placeholder')}
                                        className={`w-full ${dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-red outline-none transition-all`}
                                    />
                                    <GraduationCap className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400`} size={20} />
                                </div>
                            </div>

                            <button className="btn-primary w-full mt-6 py-4 flex items-center justify-center gap-2 text-lg">
                                {t('modal_send')} <Send size={20} className={dir === 'rtl' ? 'rotate-180' : ''} />
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConsultationModal;
