import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Globe, Users, Loader2 } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { useLanguage } from '../context/LanguageContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Statistics = () => {
    const { t, dir } = useLanguage();
    const [uniCount, setUniCount] = useState("0");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const res = await fetch(`${API_URL}/universities`);
                const unis = await res.json();
                const count = Array.isArray(unis) ? unis.length : 0;
                setUniCount(`${count}`);
            } catch (err) {
                console.error('Failed to fetch stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCounts();
    }, []);

    const stats = [
        { count: "5+", label: t('stats_years'), icon: <Clock size={40} /> },
        { count: uniCount, label: t('stats_unis'), icon: <Globe size={40} /> },
        { count: "100+", label: t('stats_students'), icon: <Users size={40} /> },
    ];

    return (
        <section id="why-us" className="py-24 bg-brand-navy text-white overflow-hidden relative" dir={dir}>
            <div className="absolute top-0 left-0 w-64 h-64 bg-brand-red/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            <div className="container mx-auto px-6 relative z-10">
                <SectionHeading light subtitle={t('why_us_subtitle')}>
                    {t('why_us_title')}
                </SectionHeading>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="animate-spin text-brand-red" size={40} />
                    </div>
                ) : (
                    <div className={`grid grid-cols-1 md:grid-cols-3 gap-12 text-center`}>
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 100 }}
                            >
                                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-red backdrop-blur-md">
                                    {stat.icon}
                                </div>
                                <div className="text-5xl font-black mb-2 tracking-tight">{stat.count}</div>
                                <div className="text-white/70 text-lg font-bold">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Statistics;
