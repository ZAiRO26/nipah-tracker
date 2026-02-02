import { atom } from 'nanostores';

export type Language = 'en' | 'ml' | 'bn';

// Persist language preference in localStorage if possible, default to English
const savedLang = typeof window !== 'undefined' ? localStorage.getItem('niv_lang') as Language : 'en';

export const languageStore = atom<Language>(savedLang || 'en');

export const setLanguage = (lang: Language) => {
    languageStore.set(lang);
    if (typeof window !== 'undefined') {
        localStorage.setItem('niv_lang', lang);
        // Dispatch a custom event so non-react parts can listen if needed
        window.dispatchEvent(new CustomEvent('language-change', { detail: lang }));
    }
};
