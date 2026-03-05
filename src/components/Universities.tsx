import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from './SectionHeading';
import { db } from '../lib/db';
import { useLanguage } from '../context/LanguageContext';

const Universities = () => {
    const [universities, setUniversities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { t, getField, dir } = useLanguage();

    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const data = await db.universities.getAll();
                setUniversities(data);
            } catch (error) {
                console.error('Error fetching universities:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUniversities();
    }, []);

    if (loading) {
        return (
            <div className="py-24 flex flex-col items-center justify-center text-brand-navy">
                <Loader2 className="animate-spin mb-4" size={40} />
                <p className="font-bold">{t('loading')}</p>
            </div>
        );
    }

    return (
        <section id="universities" className="py-24 bg-slate-50" dir={dir}>
            <div className="container mx-auto px-6">
                <SectionHeading subtitle={t('partnerships_subtitle')}>
                    {t('nav_universities')}
                </SectionHeading>

                {universities.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-slate-500 font-bold">{t('programs_no_results')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {universities.map((uni, idx) => (
                            <motion.div
                                key={uni.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="relative overflow-hidden rounded-[30px] group h-[400px]"
                            >
                                <img src={uni.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={getField(uni, 'name')} />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent opacity-90"></div>
                                <div className={`absolute bottom-0 p-8 w-full ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                                    <span className="bg-brand-red text-white px-3 py-1 rounded-full text-xs font-bold mb-3 inline-block">
                                        {uni.country}
                                    </span>
                                    <h3 className="text-2xl font-black text-white mb-4">{getField(uni, 'name')}</h3>
                                    <Link
                                        to={`/university/${uni.id}`}
                                        className={`text-white flex items-center gap-2 hover:gap-4 transition-all ${dir === 'rtl' ? 'mr-auto ml-0 flex-row-reverse' : 'ml-auto mr-0'} font-bold w-fit`}
                                    >
                                        <ChevronRight size={18} className={dir === 'rtl' ? 'rotate-0' : 'rotate-180'} />
                                        <span>{t('view_details')}</span>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                <div className="mt-16 text-center">
                    <Link to="/universities" className="btn-outline inline-block">
                        {t('all_unis')}
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Universities;
