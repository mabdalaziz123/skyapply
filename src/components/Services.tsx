import { motion } from 'framer-motion';
import { Briefcase, Award, CheckCircle2, Clock, PlaneTakeoff, Globe } from 'lucide-react';
import SectionHeading from './SectionHeading';

const Services = () => {
    const services = [
        { icon: <Briefcase />, title: "استشارة مجانية", desc: "نساعدك في اختيار التخصص والجامعة الأنسب لمعدلك وطموحك." },
        { icon: <Award />, title: "تأمين القبولات", desc: "نضمن لك الحصول على قبولك الجامعي في أسرع وقت ممكن." },
        { icon: <CheckCircle2 />, title: "خصومات حصرية", desc: "نقدم لك أفضل الخصومات على الأقساط السنوية للجامعات الخاصة." },
        { icon: <Clock />, title: "السكن الطلابي", desc: "مساعدة كاملة في إيجاد السكن المناسب والقريب من جامعتك." },
        { icon: <PlaneTakeoff />, title: "الاستقبال والمطار", desc: "رحلتك معنا تبدأ من المطار، نكون بانتظارك لضمان راحتك." },
        { icon: <Globe />, title: "الملف القانوني", desc: "دعم كامل في استخراج الإقامة الطلابية والتأمين الصحي." },
    ];

    return (
        <section id="services" className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <SectionHeading subtitle="نقدم لك حزمة متكاملة من الخدمات لتسهيل رحلتك التعليمية">
                    خدماتنا التعليمية
                </SectionHeading>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="p-8 rounded-[30px] border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-2xl transition-all group"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-brand-navy text-white flex items-center justify-center mb-6 group-hover:bg-brand-red transition-colors shadow-lg shadow-brand-navy/20">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-black mb-4 text-brand-navy">{service.title}</h3>
                            <p className="text-slate-500 text-right leading-relaxed font-medium">{service.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
