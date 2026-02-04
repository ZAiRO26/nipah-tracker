import { useStore } from '@nanostores/react';
import { languageStore } from '../stores/languageStore';
import { translations } from '../i18n/translations';
import InstallButton from './InstallButton';
import LanguageSelector from './LanguageSelector';
import NotificationButton from './NotificationButton';
import ShareButton from './ShareButton';

export default function Navbar() {
    const language = useStore(languageStore);
    const t = translations[language].nav;

    return (
        <nav className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 hover:opacity-80 transition-opacity">
                <span className="text-red-600 text-2xl">•</span> NiV-Nipah Virus Tracker
            </a>

            <div className="flex items-center gap-1 sm:gap-2">
                <InstallButton />
                <div className="hidden sm:flex gap-6 mr-4">
                    <a href="/" className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors">{t.home}</a>
                    <a href="/tracker" className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors">{t.tracker}</a>
                    <a href="/news" className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors">{t.news}</a>
                    <a href="/safety" className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors">{t.safety}</a>
                    <a href="/about" className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors">{t.about}</a>
                </div>
                <div className="mr-2">
                    <LanguageSelector />
                </div>
                <NotificationButton />
                <ShareButton />
            </div>

            {/* Mobile Bottom Nav (Static HTML elsewhere, or could be part of layout, but here we focus on desktop mainly. Mobile nav is usually separate. Let's keep desktop dynamic here.) */}
        </nav>
    );
}
