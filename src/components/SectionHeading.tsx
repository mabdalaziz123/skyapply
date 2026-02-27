import { motion } from 'framer-motion';

interface SectionHeadingProps {
    children: React.ReactNode;
    subtitle?: string;
    light?: boolean;
}

const SectionHeading = ({ children, subtitle, light = false }: SectionHeadingProps) => (
    <div className="text-center mb-16">
        <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-3xl md:text-4xl font-black mb-4 ${light ? 'text-white' : 'text-brand-navy'}`}
        >
            {children}
        </motion.h2>
        {subtitle && (
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className={`text-lg max-w-2xl mx-auto ${light ? 'text-white/80' : 'text-slate-600'}`}
            >
                {subtitle}
            </motion.p>
        )}
    </div>
);

export default SectionHeading;
