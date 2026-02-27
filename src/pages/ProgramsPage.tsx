import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, DollarSign, Clock, BookOpen, GraduationCap, Filter, X } from 'lucide-react';
import { db } from '../lib/db';

interface ProgramsPageProps {
    onOpenModal: () => void;
}

const ProgramsPage = ({ onOpenModal }: ProgramsPageProps) => {
    const [branches, setBranches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<number>(20000); // Max price default

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const data = await db.branches.getAllWithDetails();
                setBranches(data || []);
            } catch (error) {
                console.error("Error fetching branches:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPrograms();
    }, []);

    // Extract unique filter options
    const filterOptions = useMemo(() => {
        const degrees = new Set<string>();
        const languages = new Set<string>();
        const countries = new Set<string>();
        let maxPrice = 5000;

        branches.forEach(branch => {
            if (branch.degree) degrees.add(branch.degree);
            if (branch.language) languages.add(branch.language);

            const country = branch.colleges?.universities?.country;
            if (country) countries.add(country);

            // Extract numeric price
            const numericPrice = parseInt(branch.price?.replace(/\D/g, '') || '0');
            if (numericPrice > maxPrice) maxPrice = numericPrice;
        });

        return {
            degrees: Array.from(degrees),
            languages: Array.from(languages),
            countries: Array.from(countries),
            maxAvailablePrice: maxPrice || 20000
        };
    }, [branches]);

    // Apply Filters
    const filteredBranches = useMemo(() => {
        return branches.filter(branch => {
            // Search filter
            const matchesSearch = branch.name?.toLowerCase().includes(searchTerm.toLowerCase());

            // Degree filter
            const matchesDegree = selectedDegrees.length === 0 || selectedDegrees.includes(branch.degree);

            // Language filter
            const matchesLanguage = selectedLanguages.length === 0 || selectedLanguages.includes(branch.language);

            // Country filter
            const matchCountry = selectedCountries.length === 0 || selectedCountries.includes(branch.colleges?.universities?.country);

            // Price filter
            const numericPrice = parseInt(branch.price?.replace(/\D/g, '') || '0');
            const matchesPrice = numericPrice <= priceRange;

            return matchesSearch && matchesDegree && matchesLanguage && matchCountry && matchesPrice;
        });
    }, [branches, searchTerm, selectedDegrees, selectedLanguages, selectedCountries, priceRange]);

    const toggleFilter = (value: string, currentSelected: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        if (currentSelected.includes(value)) {
            setter(currentSelected.filter(item => item !== value));
        } else {
            setter([...currentSelected, value]);
        }
    };

    return (
        <div className="pt-28 pb-20 min-h-screen bg-slate-50 font-sans" dir="rtl">
            <div className="container mx-auto px-6">

                {/* Page Header */}
                <div className="mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-4xl font-black text-brand-navy mb-4">البرامج الدراسية</h1>
                    <p className="text-slate-500 text-lg">تصفح وقارن بين كافة التخصصات والأفرع المتاحة في أفضل الجامعات.</p>
                </div>

                {/* Mobile Filter Toggle */}
                <button
                    onClick={() => setIsMobileFiltersOpen(true)}
                    className="md:hidden w-full mb-6 bg-white border border-slate-200 rounded-xl py-3 px-4 flex items-center justify-center gap-2 font-bold text-brand-navy shadow-sm"
                >
                    <Filter size={20} />
                    عرض الفلاتر ({selectedDegrees.length + selectedLanguages.length + selectedCountries.length})
                </button>

                <div className="flex flex-col md:flex-row gap-8 items-start">

                    {/* Mobile Background Overlay */}
                    <div
                        className={`fixed inset-0 bg-brand-navy/40 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isMobileFiltersOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                        onClick={() => setIsMobileFiltersOpen(false)}
                    />

                    {/* Sidebar / Filters */}
                    <div className={`
                        fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-[32px] p-6 pb-6 overflow-y-auto max-h-[85vh] w-full 
                        md:w-1/4 lg:w-1/5 md:relative md:inset-auto md:z-auto md:bg-transparent md:p-0 md:overflow-visible md:max-h-none md:rounded-none
                        transition-transform duration-300 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-none
                        ${isMobileFiltersOpen ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}
                    `}>
                        {/* Drag Indicator for Mobile */}
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 md:hidden"></div>

                        <div className="flex justify-between items-center md:hidden mb-6 pb-4 border-b border-slate-100">
                            <h3 className="font-black text-xl text-brand-navy">فلاتر البحث</h3>
                            <button onClick={() => setIsMobileFiltersOpen(false)} className="bg-slate-100 p-2 rounded-lg text-slate-500 hover:bg-slate-200 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="bg-white md:rounded-[24px] md:shadow-sm md:border md:border-slate-100 md:p-6 space-y-8 md:sticky md:top-32 pb-4">

                            {/* Search */}
                            <div>
                                <h4 className="font-black text-brand-navy mb-3">ابحث عن تخصص</h4>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="مثال: هندسة البرمجيات"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-sm focus:border-brand-red outline-none transition-colors"
                                    />
                                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                </div>
                            </div>

                            {/* Countries */}
                            {filterOptions.countries.length > 0 && (
                                <div>
                                    <h4 className="font-black text-brand-navy mb-3">الدولة</h4>
                                    <div className="space-y-2">
                                        {filterOptions.countries.map(country => (
                                            <label key={country} className="flex items-center gap-3 cursor-pointer group">
                                                <div className="relative flex items-center justify-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCountries.includes(country)}
                                                        onChange={() => toggleFilter(country, selectedCountries, setSelectedCountries)}
                                                        className="w-5 h-5 appearance-none border-2 border-slate-300 rounded checked:bg-brand-red checked:border-brand-red transition-colors"
                                                    />
                                                    <svg className={`absolute w-3 h-3 text-white pointer-events-none transition-opacity ${selectedCountries.includes(country) ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                </div>
                                                <span className="text-slate-600 group-hover:text-brand-navy font-bold transition-colors">{country}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Degree / Phase */}
                            {filterOptions.degrees.length > 0 && (
                                <div>
                                    <h4 className="font-black text-brand-navy mb-3">المرحلة الدراسية</h4>
                                    <div className="space-y-2">
                                        {filterOptions.degrees.map(degree => (
                                            <label key={degree} className="flex items-center gap-3 cursor-pointer group">
                                                <div className="relative flex items-center justify-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedDegrees.includes(degree)}
                                                        onChange={() => toggleFilter(degree, selectedDegrees, setSelectedDegrees)}
                                                        className="w-5 h-5 appearance-none border-2 border-slate-300 rounded checked:bg-brand-red checked:border-brand-red transition-colors"
                                                    />
                                                    <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 checked:opacity-100" />
                                                    <svg className={`absolute w-3 h-3 text-white pointer-events-none transition-opacity ${selectedDegrees.includes(degree) ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                </div>
                                                <span className="text-slate-600 group-hover:text-brand-navy font-bold transition-colors">{degree}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Language */}
                            {filterOptions.languages.length > 0 && (
                                <div>
                                    <h4 className="font-black text-brand-navy mb-3">لغة الدراسة</h4>
                                    <div className="space-y-2">
                                        {filterOptions.languages.map(language => (
                                            <label key={language} className="flex items-center gap-3 cursor-pointer group">
                                                <div className="relative flex items-center justify-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedLanguages.includes(language)}
                                                        onChange={() => toggleFilter(language, selectedLanguages, setSelectedLanguages)}
                                                        className="w-5 h-5 appearance-none border-2 border-slate-300 rounded checked:bg-brand-red checked:border-brand-red transition-colors"
                                                    />
                                                    <svg className={`absolute w-3 h-3 text-white pointer-events-none transition-opacity ${selectedLanguages.includes(language) ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                </div>
                                                <span className="text-slate-600 group-hover:text-brand-navy font-bold transition-colors">{language}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Price */}
                            <div className="pb-2">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-black text-brand-navy">أقصى سعر سنوي</h4>
                                    <span className="text-brand-red font-bold">${priceRange}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max={filterOptions.maxAvailablePrice}
                                    step="100"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-red"
                                />
                            </div>

                        </div>

                        {/* Mobile Apply Button */}
                        <div className="md:hidden mt-6 pt-4 border-t border-slate-100 sticky bottom-0 bg-white/95 backdrop-blur z-10 w-[calc(100%+3rem)] -mx-6 px-6 pb-2">
                            <button
                                onClick={() => setIsMobileFiltersOpen(false)}
                                className="w-full bg-brand-navy text-white font-bold py-4 rounded-xl hover:bg-brand-navy/90 transition-colors shadow-lg flex justify-center items-center gap-2"
                            >
                                عرض النتائج
                                <span className="bg-white/20 px-3 py-1 rounded-md text-sm">{filteredBranches.length}</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Content / Cards */}
                    <div className="w-full md:w-3/4 lg:w-4/5">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-black text-xl text-brand-navy">النتائج ({filteredBranches.length})</h2>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-brand-red">
                                <div className="w-12 h-12 border-4 border-brand-red/20 border-t-brand-red rounded-full animate-spin"></div>
                                <p className="mt-4 font-bold text-slate-500">جاري تحميل البرامج...</p>
                            </div>
                        ) : filteredBranches.length === 0 ? (
                            <div className="bg-white rounded-[24px] p-16 text-center shadow-sm border border-slate-100">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search size={32} className="text-slate-300" />
                                </div>
                                <h3 className="text-xl font-black text-brand-navy mb-2">لم نجد أي برامج تطابق بحثك</h3>
                                <p className="text-slate-500">حاول تغيير أو تقليل خيارات الفلترة للحصول على نتائج أكثر.</p>
                                <button
                                    onClick={() => {
                                        setSearchTerm(''); setSelectedCountries([]); setSelectedDegrees([]); setSelectedLanguages([]); setPriceRange(filterOptions.maxAvailablePrice);
                                    }}
                                    className="mt-6 text-brand-red font-bold hover:underline"
                                >
                                    مسح جميع الفلاتر
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                {filteredBranches.map((branch, idx) => {
                                    const uni = branch.colleges?.universities;

                                    return (
                                        <motion.div
                                            key={branch.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="bg-white rounded-[20px] p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all group flex flex-col md:flex-row gap-5"
                                        >
                                            {/* Right details */}
                                            <div className="flex-1 space-y-4">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="font-black text-xl text-brand-navy group-hover:text-brand-red transition-colors mb-2">
                                                            {branch.name}
                                                        </h3>
                                                        {uni && (
                                                            <div className="flex items-center gap-2 text-slate-500 text-sm font-bold">
                                                                <GraduationCap size={16} />
                                                                <span>{uni.name}</span>
                                                                <span className="text-slate-300">•</span>
                                                                <MapPin size={14} className="text-slate-400" />
                                                                <span>{uni.country}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-2 text-xs font-bold">
                                                    <span className="bg-brand-red/10 text-brand-red px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                                        <BookOpen size={14} /> {branch.degree || 'بكالوريوس'}
                                                    </span>
                                                    <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg">
                                                        {branch.language}
                                                    </span>
                                                    <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                                        <Clock size={14} /> {branch.duration}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Left Price / CTA */}
                                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 pt-4 md:pt-0 border-t md:border-t-0 md:border-r border-slate-100 md:pr-5 shrink-0">
                                                <div className="text-right">
                                                    <p className="text-slate-400 text-xs font-bold mb-1">السعر السنوي</p>
                                                    <p className="font-black text-2xl text-brand-navy flex items-center justify-end gap-1">
                                                        {branch.price}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={onOpenModal}
                                                    className="bg-white border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white rounded-xl px-6 py-2.5 font-bold transition-colors"
                                                >
                                                    سجل الآن
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProgramsPage;
