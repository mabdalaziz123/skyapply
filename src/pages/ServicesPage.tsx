import { motion } from 'framer-motion';
import Services from '../components/Services';
import CTA from '../components/CTA';
import SectionHeading from '../components/SectionHeading';

const ServicesPage = ({ onOpenModal }: { onOpenModal: () => void }) => {
    return (
        <div className="pt-32">
            <section className="bg-brand-navy py-20 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="container mx-auto px-6 relative z-10 text-right">
                    <motion.h1
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl md:text-5xl font-black mb-6"
                    >
                        خدماتنا الاستشارية
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-white/80 max-w-2xl ml-auto"
                    >
                        نقدم لك الدعم الكامل في كل خطوة من خطوات رحلتك الدراسية، من اختيار التخصص وحتى الاستقرار في بلدك الجديد.
                    </motion.p>
                </div>
            </section>

            <Services />

            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <SectionHeading subtitle="تفاصيل إضافية عن رحلتك معنا">كيف نبدأ العمل؟</SectionHeading>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { step: "01", title: "تواصل معنا", desc: "احجز جلستك الاستشارية المجانية الأولى." },
                            { step: "02", title: "اختيار التخصص", desc: "نحدد التخصص والجامعة الأنسب لك." },
                            { step: "03", title: "تجهيز الأوراق", desc: "نساعدك في جمع وترجمة كافة ملفاتك." },
                            { step: "04", title: "القبول النهائي", desc: "نبارك لك الحصول على مقعدك الدراسي." },
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-right">
                                <div className="text-4xl font-black text-brand-red/10 mb-4">{item.step}</div>
                                <h3 className="text-xl font-bold text-brand-navy mb-2">{item.title}</h3>
                                <p className="text-slate-500 font-medium">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <CTA onOpenModal={onOpenModal} />
        </div>
    );
};

export default ServicesPage;
