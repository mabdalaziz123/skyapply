import { motion } from 'framer-motion';
import { Clock, Globe, Users } from 'lucide-react';
import SectionHeading from './SectionHeading';

const Statistics = () => {
    const stats = [
        { count: "10+", label: "سنوات خبرة", icon: <Clock size={40} /> },
        { count: "1000+", label: "شركاء عالميين", icon: <Globe size={40} /> },
        { count: "5000+", label: "طالب تم قبولهم", icon: <Users size={40} /> },
    ];

    return (
        <section id="why-us" className="py-24 bg-brand-navy text-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-64 h-64 bg-brand-red/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            <div className="container mx-auto px-6 relative z-10">
                <SectionHeading light subtitle="أرقامنا تتحدث عن مدى خبرتنا وموثوقيتنا">لماذا اختيار ApplySky؟</SectionHeading>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
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
            </div>
        </section>
    );
};

export default Statistics;
