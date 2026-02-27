import { motion } from 'framer-motion';
import { ChevronRight, CheckCircle2 } from 'lucide-react';

interface HeroProps {
    onOpenModal: () => void;
}

const Hero = ({ onOpenModal }: HeroProps) => {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-red/5 -skew-x-12 -z-10 translate-x-1/4"></div>
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 text-right">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block px-4 py-2 bg-brand-red/10 text-brand-red rounded-full font-bold text-sm mb-6">
                            مستقبلك يبدأ هنا
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black text-brand-navy leading-tight mb-6">
                            بوابتك للدراسة في <br />
                            <span className="text-brand-red">الخارج</span> بكل سهولة
                        </h1>
                        <p className="text-lg text-slate-600 mb-10 max-w-xl ml-auto font-medium">
                            نحن في ApplySky نرافقك خطوة بخطوة في رحلتك التعليمية. من اختيار الجامعة حتى وصولك مقعدك الدراسي، نضمن لك أفضل قبول جامعي وخصومات حصرية.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-end">
                            <button onClick={onOpenModal} className="btn-primary flex items-center gap-2 group">
                                استشارة مجانية <ChevronRight size={20} className="rotate-180 transform transition-transform group-hover:-translate-x-1" />
                            </button>
                            <button className="btn-outline">اكتشف الجامعات</button>
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
                            alt="Premium students walking in campus"
                            className="rounded-[40px] shadow-2xl border-8 border-white object-cover h-[500px] w-full transition-transform hover:scale-105 duration-700"
                        />
                        <div className="absolute -bottom-6 -right-6 glass-card p-6 rounded-2xl flex items-center gap-4 animate-bounce-slow">
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg">
                                <CheckCircle2 size={24} />
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-brand-navy">قبول مضمون 100%</p>
                                <p className="text-xs text-slate-500">في أفضل الجامعات عبرنا</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
