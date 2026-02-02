import { useStore } from '@nanostores/react';
import { languageStore, setLanguage, type Language } from '../stores/languageStore';

export default function LanguageSelector() {
    const language = useStore(languageStore);

    const languages: { code: Language; label: string; flag: string }[] = [
        { code: 'en', label: 'English', flag: '🇬🇧' },
        { code: 'ml', label: 'മലയാളം', flag: '🇮🇳' }, // Kerala
        { code: 'bn', label: 'বাংলা', flag: '🇧🇩' },  // Bengal/Bangladesh
    ];

    return (
        <div className="relative group">
            <button className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
                <span>{languages.find(l => l.code === language)?.flag}</span>
                <span className="hidden sm:inline">{languages.find(l => l.code === language)?.label}</span>
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden hidden group-hover:block animate-in fade-in slide-in-from-top-2 z-50">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 flex items-center gap-3 transition-colors ${language === lang.code ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600'}`}
                    >
                        <span>{lang.flag}</span>
                        {lang.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
