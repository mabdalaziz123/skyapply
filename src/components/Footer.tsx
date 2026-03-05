import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

const Footer = () => {
    const { t, dir } = useLanguage();

    const quickLinks = [
        { label: t('nav_home'), href: '/' },
        { label: t('nav_services'), href: '/services' },
        { label: t('nav_universities'), href: '/universities' },
        { label: t('nav_blog'), href: '/blog' },
    ];

    return (
        <footer className="bg-slate-50 border-t border-slate-200 pt-20 pb-10" dir={dir}>
            <div className={`container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 text-start`}>
                <div className="md:col-span-1">
                    <div className="text-3xl font-black tracking-tighter mb-6">
                        <span className="text-brand-red">APPLY</span>
                        <span className="text-brand-navy">SKY</span>
                    </div>
                    <p className="text-slate-500 mb-8 leading-relaxed font-medium">
                        {t('footer_desc')}
                    </p>
                    <div className={`flex gap-4 ${dir === 'rtl' ? 'justify-end' : 'justify-start'}`}>
                        {[Facebook, Instagram, Linkedin].map((Icon, idx) => (
                            <a key={idx} href="#" className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-brand-navy hover:bg-brand-red hover:text-white transition-all shadow-sm">
                                <Icon size={20} />
                            </a>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="font-black text-brand-navy mb-6 text-xl text-start">{t('footer_links')}</h4>
                    <ul className="space-y-4 text-slate-500 font-bold">
                        {quickLinks.map((link) => (
                            <li key={link.href}>
                                <Link to={link.href} className="hover:text-brand-red transition-colors">{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="font-black text-brand-navy mb-6 text-xl text-start">{t('services_title')}</h4>
                    <ul className="space-y-4 text-slate-500 font-bold">
                        <li><a href="#" className="hover:text-brand-red transition-colors">
                            {dir === 'rtl' ? 'القبول الجامعي' : dir === 'ltr' && t('nav_programs') === 'Eğitim Programları' ? 'Üniversite Kabulü' : 'University Admission'}
                        </a></li>
                        <li><a href="#" className="hover:text-brand-red transition-colors">
                            {dir === 'rtl' ? 'السكن الطلابي' : t('nav_programs') === 'Eğitim Programları' ? 'Öğrenci Konutu' : 'Student Housing'}
                        </a></li>
                        <li><a href="#" className="hover:text-brand-red transition-colors">
                            {dir === 'rtl' ? 'المنح التركية' : t('nav_programs') === 'Eğitim Programları' ? 'Türk Bursları' : 'Turkish Scholarships'}
                        </a></li>
                        <li><a href="#" className="hover:text-brand-red transition-colors">
                            {dir === 'rtl' ? 'دعم التأشيرة' : t('nav_programs') === 'Eğitim Programları' ? 'Vize Desteği' : 'Visa Support'}
                        </a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-black text-brand-navy mb-6 text-xl text-start">{t('footer_contact')}</h4>
                    <ul className="space-y-4 font-bold">
                        <li className={`flex items-center gap-3 text-slate-500 hover:text-brand-red transition-colors`}>
                            <Mail size={18} className="text-brand-red" /> info@applysky.com
                        </li>
                        <li className={`flex items-center gap-3 text-slate-500 hover:text-brand-red transition-colors`}>
                            <Phone size={18} className="text-brand-red" /> +90 5XX XXX XX XX
                        </li>
                        <li className={`flex items-center gap-3 text-slate-500`}>
                            <MapPin size={18} className="text-brand-red" /> {dir === 'rtl' ? 'إسطنبول، تركيا' : 'Istanbul, Turkey'}
                        </li>
                    </ul>
                </div>
            </div>
            <div className="container mx-auto px-6 pt-10 border-t border-slate-200 text-center text-slate-400 font-bold text-sm">
                {t('footer_rights')} © 2024 ApplySky
            </div>
        </footer>
    );
};

export default Footer;
