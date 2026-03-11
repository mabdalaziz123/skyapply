import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Clock, BookOpen, GraduationCap, Filter, X } from 'lucide-react';
import { db } from '../lib/db';
import { useLanguage } from '../context/LanguageContext';

interface ProgramsPageProps {
    onOpenModal: () => void;
}

const ProgramsPage = ({ onOpenModal }: ProgramsPageProps) => {
    const [branches, setBranches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const { t, getField, dir } = useLanguage();

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

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

    const filterOptions = useMemo(() => {
        const degrees = new Set<string>();
        const languages = new Set<string>();
        const countries = new Set<string>();

        branches.forEach(branch => {
            if (branch.degree) degrees.add(branch.degree);
            if (branch.language) languages.add(branch.language);
            const country = branch.colleges?.universities?.country;
            if (country) countries.add(country);
        });

        return {
            degrees: Array.from(degrees),
            languages: Array.from(languages),
            countries: Array.from(countries)
        };
    }, [branches]);

    const filteredBranches = useMemo(() => {
        return branches.filter(branch => {
            const branchName = getField(branch, 'name').toLowerCase();
            const matchesSearch = branchName.includes(searchTerm.toLowerCase());
            const matchesDegree = selectedDegrees.length === 0 || selectedDegrees.includes(branch.degree);
            const matchesLanguage = selectedLanguages.length === 0 || selectedLanguages.includes(branch.language);
            const matchCountry = selectedCountries.length === 0 || selectedCountries.includes(branch.colleges?.universities?.country);
            return matchesSearch && matchesDegree && matchesLanguage && matchCountry;
        });
    }, [branches, searchTerm, selectedDegrees, selectedLanguages, selectedCountries, getField]);

    const toggleFilter = (value: string, currentSelected: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        if (currentSelected.includes(value)) {
            setter(currentSelected.filter(item => item !== value));
        } else {
            setter([...currentSelected, value]);
        }
    };

    const CheckboxItem = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) => (
        <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    className="w-5 h-5 appearance-none border-2 border-slate-300 rounded checked:bg-brand-red checked:border-brand-red transition-colors"
                />
                <svg className={`absolute w-3 h-3 text-white pointer-events-none transition-opacity ${checked ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <span className="text-slate-600 group-hover:text-brand-navy font-bold transition-colors">{label}</span>
        </label>
    );

    return (
        <div className="pt-28 pb-20 min-h-screen bg-slate-50 font-sans" dir={dir}>
            <div className="container mx-auto px-6">
                {/* Page Header */}
                <div className="mb-8 md:mb-12">
                    <h1 className={`text-3xl md:text-4xl font-black text-brand-navy mb-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('programs_title')}</h1>
                    <p className={`text-slate-500 text-lg ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('programs_subtitle')}</p>
                </div>

                {/* Mobile Filter Toggle */}
                <button
                    onClick={() => setIsMobileFiltersOpen(true)}
                    className="md:hidden w-full mb-6 bg-white border border-slate-200 rounded-xl py-3 px-4 flex items-center justify-center gap-2 font-bold text-brand-navy shadow-sm"
                >
                    <Filter size={20} />
                    {t('programs_show_filters')} ({selectedDegrees.length + selectedLanguages.length + selectedCountries.length})
                </button>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Mobile Overlay */}
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
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 md:hidden"></div>
                        <div className="flex justify-between items-center md:hidden mb-6 pb-4 border-b border-slate-100">
                            <h3 className="font-black text-xl text-brand-navy">{t('programs_filters')}</h3>
                            <button onClick={() => setIsMobileFiltersOpen(false)} className="bg-slate-100 p-2 rounded-lg text-slate-500">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="bg-white md:rounded-[24px] md:shadow-sm md:border md:border-slate-100 md:p-6 space-y-8 md:sticky md:top-32 pb-4">
                            {/* Search */}
                            <div>
                                <h4 className="font-black text-brand-navy mb-3">{t('programs_search_label')}</h4>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder={t('programs_search_placeholder')}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className={`w-full bg-slate-50 border border-slate-200 rounded-xl ${dir === 'rtl' ? 'pl-4 pr-10' : 'pr-4 pl-10'} py-3 text-sm focus:border-brand-red outline-none transition-colors`}
                                    />
                                    <Search className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400`} size={18} />
                                </div>
                            </div>

                            {/* Countries */}
                            {filterOptions.countries.length > 0 && (
                                <div>
                                    <h4 className="font-black text-brand-navy mb-3">{t('programs_country_label')}</h4>
                                    <div className="space-y-2">
                                        {filterOptions.countries.map(country => (
                                            <CheckboxItem key={country} label={country} checked={selectedCountries.includes(country)} onChange={() => toggleFilter(country, selectedCountries, setSelectedCountries)} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Degree */}
                            {filterOptions.degrees.length > 0 && (
                                <div>
                                    <h4 className="font-black text-brand-navy mb-3">{t('programs_degree_label')}</h4>
                                    <div className="space-y-2">
                                        {filterOptions.degrees.map(degree => (
                                            <CheckboxItem key={degree} label={degree} checked={selectedDegrees.includes(degree)} onChange={() => toggleFilter(degree, selectedDegrees, setSelectedDegrees)} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Language */}
                            {filterOptions.languages.length > 0 && (
                                <div>
                                    <h4 className="font-black text-brand-navy mb-3">{t('programs_language_label')}</h4>
                                    <div className="space-y-2">
                                        {filterOptions.languages.map(language => (
                                            <CheckboxItem key={language} label={language} checked={selectedLanguages.includes(language)} onChange={() => toggleFilter(language, selectedLanguages, setSelectedLanguages)} />
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Mobile Apply Button */}
                        <div className="md:hidden mt-6 pt-4 border-t border-slate-100 sticky bottom-0 bg-white/95 backdrop-blur z-10 w-[calc(100%+3rem)] -mx-6 px-6 pb-2">
                            <button
                                onClick={() => setIsMobileFiltersOpen(false)}
                                className="w-full bg-brand-navy text-white font-bold py-4 rounded-xl hover:bg-brand-navy/90 transition-colors shadow-lg flex justify-center items-center gap-2"
                            >
                                {t('programs_show_results')}
                                <span className="bg-white/20 px-3 py-1 rounded-md text-sm">{filteredBranches.length}</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="w-full md:w-3/4 lg:w-4/5">
                        <div className={`flex justify-between items-center mb-6 ${dir === 'rtl' ? 'flex-row' : 'flex-row-reverse'}`}>
                            <h2 className="font-black text-xl text-brand-navy">{t('programs_results')} ({filteredBranches.length})</h2>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-brand-red">
                                <div className="w-12 h-12 border-4 border-brand-red/20 border-t-brand-red rounded-full animate-spin"></div>
                                <p className="mt-4 font-bold text-slate-500">{t('loading')}</p>
                            </div>
                        ) : filteredBranches.length === 0 ? (
                            <div className="bg-white rounded-[24px] p-16 text-center shadow-sm border border-slate-100">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search size={32} className="text-slate-300" />
                                </div>
                                <h3 className="text-xl font-black text-brand-navy mb-2">{t('programs_no_results')}</h3>
                                <p className="text-slate-500">{t('programs_no_results_sub')}</p>
                                <button
                                    onClick={() => { setSearchTerm(''); setSelectedCountries([]); setSelectedDegrees([]); setSelectedLanguages([]); }}
                                    className="mt-6 text-brand-red font-bold hover:underline"
                                >
                                    {t('programs_clear')}
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
                                            <div className="flex-1 space-y-4">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className={`font-black text-xl text-brand-navy group-hover:text-brand-red transition-colors mb-2 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                                                            {getField(branch, 'name')}
                                                        </h3>
                                                        {uni && (
                                                            <div className={`flex items-center gap-2 text-slate-500 text-sm font-bold ${dir === 'rtl' ? 'flex-row' : 'flex-row-reverse justify-end'}`}>
                                                                <GraduationCap size={16} />
                                                                <span>{getField(uni, 'name')}</span>
                                                                <span className="text-slate-300">•</span>
                                                                <MapPin size={14} className="text-slate-400" />
                                                                <span>{uni.country}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2 text-xs font-bold">
                                                    <span className="bg-brand-red/10 text-brand-red px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                                        <BookOpen size={14} /> {branch.degree || t('bachelor')}
                                                    </span>
                                                    <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg">{branch.language}</span>
                                                    <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                                        <Clock size={14} /> {branch.duration}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className={`flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 pt-4 md:pt-0 border-t md:border-t-0 ${dir === 'rtl' ? 'md:border-r md:pr-5' : 'md:border-l md:pl-5'} border-slate-100 shrink-0`}>
                                                <button
                                                    onClick={onOpenModal}
                                                    className="bg-white border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white rounded-xl px-6 py-2.5 font-bold transition-colors"
                                                >
                                                    {t('programs_register')}
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
