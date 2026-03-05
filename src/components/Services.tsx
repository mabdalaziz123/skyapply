import { motion } from 'framer-motion';
import { Briefcase, Award, CheckCircle2, Clock, PlaneTakeoff, Globe } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { useLanguage } from '../context/LanguageContext';

const Services = () => {
    const { t, dir } = useLanguage();

    const services = [
        { icon: <Briefcase />, title: t('service_1_title'), desc: t('service_1_desc') },
        { icon: <Award />, title: t('service_2_title'), desc: t('service_2_desc') },
        { icon: <CheckCircle2 />, title: t('service_3_title'), desc: t('service_3_desc') },
        { icon: <Clock />, title: t('service_4_title'), desc: t('service_4_desc') },
        { icon: <PlaneTakeoff />, title: t('service_5_title'), desc: t('service_5_desc') },
        { icon: <Globe />, title: t('service_6_title'), desc: t('service_6_desc') },
    ];

    return (
        <section id="services" className="py-24 bg-white" dir={dir}>
            <div className="container mx-auto px-6">
                <SectionHeading subtitle={t('services_subtitle')}>
                    {t('services_title')}
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
                            className={`p-8 rounded-[30px] border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-2xl transition-all group ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                        >
                            <div className={`w-14 h-14 rounded-2xl bg-brand-navy text-white flex items-center justify-center mb-6 group-hover:bg-brand-red transition-colors shadow-lg shadow-brand-navy/20 ${dir === 'rtl' ? 'mr-0' : 'ml-0'}`}>
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-black mb-4 text-brand-navy">{service.title}</h3>
                            <p className="text-slate-500 leading-relaxed font-medium">{service.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
