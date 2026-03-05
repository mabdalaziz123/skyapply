import { motion } from 'framer-motion';
import Services from '../components/Services';
import CTA from '../components/CTA';
import SectionHeading from '../components/SectionHeading';
import { useLanguage } from '../context/LanguageContext';

const ServicesPage = ({ onOpenModal }: { onOpenModal: () => void }) => {
    const { t, dir } = useLanguage();

    const steps = [
        { step: "01", title: t('contact_us'), desc: t('step_1_desc') },
        { step: "02", title: t('select_major'), desc: t('step_2_desc') },
        { step: "03", title: t('prepare_docs'), desc: t('step_3_desc') },
        { step: "04", title: t('final_admission'), desc: t('step_4_desc') },
    ];

    return (
        <div className="pt-32" dir={dir}>
            <section className="bg-brand-navy py-20 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className={`container mx-auto px-6 relative z-10 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                    <motion.h1
                        initial={{ opacity: 0, x: dir === 'rtl' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl md:text-5xl font-black mb-6"
                    >
                        {t('services_consulting')}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: dir === 'rtl' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className={`text-lg text-white/80 max-w-2xl ${dir === 'rtl' ? 'ml-auto' : 'mr-auto'}`}
                    >
                        {t('services_desc')}
                    </motion.p>
                </div>
            </section>

            <Services />

            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <SectionHeading subtitle={t('how_we_work_subtitle')}>
                        {t('how_we_work')}
                    </SectionHeading>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {steps.map((item, idx) => (
                            <div key={idx} className={`bg-white p-8 rounded-3xl shadow-sm border border-slate-100 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
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
