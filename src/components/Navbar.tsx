import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Menu, X, Globe } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Lang } from '../i18n/translations';

interface NavbarProps {
    onOpenModal: () => void;
}

const LANGS: { code: Lang; label: string }[] = [
    { code: 'ar', label: 'AR' },
    { code: 'en', label: 'EN' },
    { code: 'tr', label: 'TR' },
];

const Navbar = ({ onOpenModal }: NavbarProps) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showLangMenu, setShowLangMenu] = useState(false);
    const location = useLocation();
    const { lang, setLang, t, dir } = useLanguage();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        const close = () => setShowLangMenu(false);
        document.addEventListener('click', close);
        return () => document.removeEventListener('click', close);
    }, []);

    const navLinks = [
        { name: t('nav_home'), href: '/' },
        { name: t('nav_programs'), href: '/programs' },
        { name: t('nav_services'), href: '/services' },
        { name: t('nav_universities'), href: '/universities' },
        { name: t('nav_blog'), href: '/blog' },
    ];

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-lg shadow-md py-3' : 'bg-transparent py-5'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="text-2xl font-black tracking-tighter flex items-center">
                        <span className="text-brand-red">APPLY</span>
                        <span className="text-brand-navy">SKY</span>
                        <div className="w-5 h-5 bg-brand-navy rounded-full flex items-center justify-center mr-1 mt-1">
                            <CheckCircle2 size={12} className="text-white" />
                        </div>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className={`hidden md:flex items-center gap-8 ${dir === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            to={link.href}
                            className={`font-bold transition-colors ${location.pathname === link.href ? 'text-brand-red' : 'text-brand-navy hover:text-brand-red'}`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* Language Switcher */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setShowLangMenu(!showLangMenu)}
                            className="flex items-center gap-1.5 border border-slate-200 bg-white/80 backdrop-blur rounded-xl px-3 py-1.5 font-bold text-brand-navy hover:border-brand-red transition-colors text-sm"
                        >
                            <Globe size={15} />
                            {lang.toUpperCase()}
                        </button>
                        <AnimatePresence>
                            {showLangMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    className="absolute top-full mt-2 left-0 bg-white rounded-2xl shadow-xl border border-slate-100 py-1 min-w-[80px] overflow-hidden"
                                >
                                    {LANGS.map((l) => (
                                        <button
                                            key={l.code}
                                            onClick={() => { setLang(l.code); setShowLangMenu(false); }}
                                            className={`w-full px-4 py-2 text-sm font-bold text-left hover:bg-slate-50 transition-colors ${lang === l.code ? 'text-brand-red' : 'text-brand-navy'}`}
                                        >
                                            {l.label}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button onClick={onOpenModal} className="btn-primary py-2 px-6">{t('nav_register')}</button>
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden flex items-center gap-3">
                    {/* Mobile Language Switcher */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setShowLangMenu(!showLangMenu)}
                            className="flex items-center gap-1 border border-slate-200 bg-white/80 rounded-lg px-2 py-1 font-bold text-brand-navy text-xs"
                        >
                            <Globe size={13} />
                            {lang.toUpperCase()}
                        </button>
                        <AnimatePresence>
                            {showLangMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    className="absolute top-full mt-1 right-0 bg-white rounded-xl shadow-xl border border-slate-100 py-1 min-w-[70px] overflow-hidden"
                                >
                                    {LANGS.map((l) => (
                                        <button
                                            key={l.code}
                                            onClick={() => { setLang(l.code); setShowLangMenu(false); }}
                                            className={`w-full px-3 py-2 text-xs font-bold text-left hover:bg-slate-50 transition-colors ${lang === l.code ? 'text-brand-red' : 'text-brand-navy'}`}
                                        >
                                            {l.label}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <button className="text-brand-navy" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b absolute top-full w-full overflow-hidden"
                    >
                        <div className={`flex flex-col p-6 gap-4 ${dir === 'rtl' ? 'text-right' : 'text-left'} font-black`}>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    className={`font-bold p-2 hover:bg-slate-50 rounded-lg ${location.pathname === link.href ? 'text-brand-red' : 'text-brand-navy'}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <button
                                onClick={() => { onOpenModal(); setIsMobileMenuOpen(false); }}
                                className="btn-primary w-full"
                            >
                                {t('nav_register')}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
