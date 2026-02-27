import { motion } from 'framer-motion';

interface CTAProps {
    onOpenModal: () => void;
}

const CTA = ({ onOpenModal }: CTAProps) => {
    return (
        <section className="py-20 px-6">
            <div className="container mx-auto max-w-5xl">
                <div className="bg-gradient-to-l from-brand-red to-brand-navy rounded-[50px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-black/10 opacity-50 patterned-bg"></div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative z-10"
                    >
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-8 leading-tight">
                            هل أنت مستعد لبدء حلمك؟ <br /> نحن بانتظارك
                        </h2>
                        <p className="text-white/80 text-lg mb-12 max-w-2xl mx-auto font-medium">
                            احجز استشارتك المجانية اليوم واحصل على تقييم لملفك الجامعي مع خصومات تصل إلى 50% على الأقساط.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button onClick={onOpenModal} className="px-10 py-4 bg-white text-brand-navy rounded-full font-black text-lg hover:bg-slate-100 transition-all shadow-xl hover:scale-105 transform active:scale-95">
                                احجز استشارة مجانية الآن
                            </button>
                            <button className="px-10 py-4 border-2 border-white/50 text-white rounded-full font-black text-lg hover:bg-white/10 transition-all hover:scale-105 transform active:scale-95">
                                تواصل عبر واتساب
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
