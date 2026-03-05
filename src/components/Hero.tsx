import { motion } from 'framer-motion';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
    onOpenModal: () => void;
}

const Hero = ({ onOpenModal }: HeroProps) => {
    const { t, dir } = useLanguage();

    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden" dir={dir}>
            <div className={`absolute top-0 ${dir === 'rtl' ? 'right-0 -skew-x-12 translate-x-1/4' : 'left-0 skew-x-12 -translate-x-1/4'} w-1/2 h-full bg-brand-red/5 -z-10`}></div>
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
                <div className={`flex-1 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                    <motion.div
                        initial={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block px-4 py-2 bg-brand-red/10 text-brand-red rounded-full font-bold text-sm mb-6">
                            {dir === 'rtl' ? 'مستقبلك يبدأ هنا' : dir === 'ltr' && t('nav_home') === 'Ana Sayfa' ? 'Geleceğin Burada Başlıyor' : 'Your Future Starts Here'}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black text-brand-navy leading-tight mb-6">
                            {dir === 'rtl' ? (
                                <>
                                    بوابتك للدراسة في <br />
                                    <span className="text-brand-red">الخارج</span> بكل سهولة
                                </>
                            ) : (
                                t('hero_title')
                            )}
                        </h1>
                        <p className={`text-lg text-slate-600 mb-10 max-w-xl font-medium ${dir === 'rtl' ? 'ml-auto' : 'mr-auto'}`}>
                            {t('hero_subtitle')}
                        </p>
                        <div className={`flex flex-wrap gap-4 ${dir === 'rtl' ? 'justify-end' : 'justify-start'}`}>
                            <button onClick={onOpenModal} className="btn-primary flex items-center gap-2 group">
                                {t('hero_cta2')} <ChevronRight size={20} className={`${dir === 'rtl' ? 'rotate-180' : ''} transform transition-transform group-hover:translate-x-1`} />
                            </button>
                            <button className="btn-outline">{t('hero_cta')}</button>
                        </div>
                    </motion.div>
                </div>
                <div className="flex-1 relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10"
                    >
                        <img
                            src="/hero-students.png"
                            alt="Students on campus"
                            className="rounded-[40px] shadow-2xl border-8 border-white object-cover h-[500px] w-full transition-transform hover:scale-105 duration-700"
                        />
                        <div className={`absolute -bottom-6 ${dir === 'rtl' ? '-left-6' : '-right-6'} glass-card p-6 rounded-2xl flex items-center gap-4 animate-bounce-slow`}>
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg">
                                <CheckCircle2 size={24} />
                            </div>
                            <div className={dir === 'rtl' ? 'text-right' : 'text-left'}>
                                <p className="text-sm font-bold text-brand-navy">
                                    {dir === 'rtl' ? 'قبول مضمون 100%' : dir === 'ltr' && t('nav_home') === 'Ana Sayfa' ? '%100 Garantili Kabul' : '100% Guaranteed Admission'}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {dir === 'rtl' ? 'في أفضل الجامعات عبرنا' : dir === 'ltr' && t('nav_home') === 'Ana Sayfa' ? 'En iyi üniversitelerde' : 'At top universities via us'}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
