import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-50 border-t border-slate-200 pt-20 pb-10">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 text-right">
                <div className="md:col-span-1">
                    <div className="text-3xl font-black tracking-tighter mb-6">
                        <span className="text-brand-red">APPLY</span>
                        <span className="text-brand-navy">SKY</span>
                    </div>
                    <p className="text-slate-500 mb-8 leading-relaxed font-medium">
                        الشركة الرائدة في خدمات الاستشارات التعليمية والقبولات الجامعية في أفضل الجامعات العالمية.
                    </p>
                    <div className="flex gap-4 justify-end">
                        {[Facebook, Instagram, Linkedin].map((Icon, idx) => (
                            <a key={idx} href="#" className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-brand-navy hover:bg-brand-red hover:text-white transition-all shadow-sm">
                                <Icon size={20} />
                            </a>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="font-black text-brand-navy mb-6 text-xl">روابط سريعة</h4>
                    <ul className="space-y-4 text-slate-500 font-bold">
                        <li><a href="#" className="hover:text-brand-red">من نحن</a></li>
                        <li><a href="#" className="hover:text-brand-red">خدماتنا</a></li>
                        <li><a href="#" className="hover:text-brand-red">جامعاتنا</a></li>
                        <li><a href="#" className="hover:text-brand-red">المدونة</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-black text-brand-navy mb-6 text-xl">الخدمات</h4>
                    <ul className="space-y-4 text-slate-500 font-bold">
                        <li><a href="#" className="hover:text-brand-red">القبول الجامعي</a></li>
                        <li><a href="#" className="hover:text-brand-red">السكن الطلابي</a></li>
                        <li><a href="#" className="hover:text-brand-red">المنح التركية</a></li>
                        <li><a href="#" className="hover:text-brand-red">دعم التأشيرة</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-black text-brand-navy mb-6 text-xl">اتصل بنا</h4>
                    <ul className="space-y-4 font-bold">
                        <li className="flex items-center justify-end gap-3 text-slate-500 hover:text-brand-red transition-colors">
                            info@applysky.com <Mail size={18} className="text-brand-red" />
                        </li>
                        <li className="flex items-center justify-end gap-3 text-slate-500 hover:text-brand-red transition-colors">
                            +90 5XX XXX XX XX <Phone size={18} className="text-brand-red" />
                        </li>
                        <li className="flex items-center justify-end gap-3 text-slate-500">
                            إسطنبول، تركيا <MapPin size={18} className="text-brand-red" />
                        </li>
                    </ul>
                </div>
            </div>
            <div className="container mx-auto px-6 pt-10 border-t border-slate-200 text-center text-slate-400 font-bold text-sm">
                جميع الحقوق محفوظة © 2024 شركة ApplySky التعليمية
            </div>
        </footer>
    );
};

export default Footer;
