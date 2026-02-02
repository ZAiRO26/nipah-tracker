import { useState, useRef, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { languageStore, setLanguage, type Language } from '../stores/languageStore';

export default function LanguageSelector() {
    const language = useStore(languageStore);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages: { code: Language; label: string; flag: string }[] = [
        { code: 'en', label: 'English', flag: '🇬🇧' },
        { code: 'ml', label: 'മലയാളം', flag: '🇮🇳' },
        { code: 'bn', label: 'বাংলা', flag: '🇧🇩' },
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (code: Language) => {
        setLanguage(code);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
                <span>{languages.find(l => l.code === language)?.flag}</span>
                <span className="hidden sm:inline">{languages.find(l => l.code === language)?.label}</span>
                <svg className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleSelect(lang.code)}
                            className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 flex items-center gap-3 transition-colors ${language === lang.code ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600'}`}
                        >
                            <span className="text-xl">{lang.flag}</span>
                            {lang.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
