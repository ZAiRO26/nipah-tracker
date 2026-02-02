import { useStore } from '@nanostores/react';
import { languageStore } from '../stores/languageStore';
import { translations } from '../i18n/translations';

export default function NewsHeader() {
    const language = useStore(languageStore);
    const t = translations[language].news;

    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>
            <p className="text-slate-600 mt-2">{t.subtitle}</p>
        </div>
    );
}
