import { useStore } from '@nanostores/react';
import { languageStore } from '../stores/languageStore';
import { translations } from '../i18n/translations';
import LiveClock from './LiveClock';

export default function StatusBanner() {
    const language = useStore(languageStore);
    const t = translations[language].banner;

    return (
        <div className="mb-8 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 text-center relative overflow-hidden">
            <div className="absolute top-4 right-4 hidden sm:block">
                <LiveClock />
            </div>
            <div className="sm:hidden mb-4 flex justify-center">
                <LiveClock />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 flex flex-wrap items-center justify-center gap-2">
                <span>{t.status}</span>
                <span className="text-red-600 inline-flex items-center">
                    <span className="w-3 h-3 bg-red-600 rounded-full mr-2 animate-pulse"></span>
                    {t.active_outbreak}
                </span>
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mb-6">
                {t.subtitle}
            </p>

            <a href="/tracker" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-full transition-all shadow-lg shadow-red-200 hover:shadow-red-300 transform hover:-translate-y-0.5">
                <span>🗺️</span> {t.view_map}
            </a>
        </div>
    );
}
