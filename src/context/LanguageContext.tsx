import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Lang, TranslationKey } from '../i18n/translations';

interface LanguageContextType {
    lang: Lang;
    setLang: (lang: Lang) => void;
    t: (key: TranslationKey) => string;
    getField: (obj: any, field: string) => string;
    dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [lang, setLangState] = useState<Lang>(() => {
        return (localStorage.getItem('sky_lang') as Lang) || 'ar';
    });

    const setLang = (newLang: Lang) => {
        localStorage.setItem('sky_lang', newLang);
        setLangState(newLang);
    };

    const dir = lang === 'ar' ? 'rtl' : 'ltr';

    useEffect(() => {
        document.documentElement.dir = dir;
        document.documentElement.lang = lang;
    }, [lang, dir]);

    // Translate a static UI key
    const t = (key: TranslationKey): string => {
        return (translations[lang] as any)[key] || (translations.ar as any)[key] || key;
    };

    // Get the right field from a DB object based on current language
    // e.g. getField(university, 'name') -> university.name_en OR university.name_tr OR university.name
    const getField = (obj: any, field: string): string => {
        if (!obj) return '';
        if (lang === 'ar') return obj[field] || '';
        const langField = obj[`${field}_${lang}`];
        return langField && langField.trim() !== '' ? langField : (obj[field] || '');
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, t, getField, dir }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
    return ctx;
};
