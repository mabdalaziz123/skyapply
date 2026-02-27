import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
    onOpenModal: () => void;
}

const Navbar = ({ onOpenModal }: NavbarProps) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        // Scroll to top on route change
        window.scrollTo(0, 0);
    }, [location.pathname]);

    const navLinks = [
        { name: 'الرئيسية', href: '/' },
        { name: 'خدماتنا', href: '/services' },
        { name: 'الجامعات', href: '/universities' },
        { name: 'المدونة', href: '/blog' },
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
                <div className="hidden md:flex items-center gap-8 text-right">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.href}
                            className={`font-bold transition-colors ${location.pathname === link.href ? 'text-brand-red' : 'text-brand-navy hover:text-brand-red'}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <button onClick={onOpenModal} className="btn-primary py-2 px-6">سجل الآن</button>
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-brand-navy" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
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
                        <div className="flex flex-col p-6 gap-4 text-right font-black">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
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
                                سجل الآن
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
