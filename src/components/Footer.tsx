import { useStore } from '@nanostores/react';
import { languageStore } from '../stores/languageStore';
import { translations } from '../i18n/translations';

export default function Footer() {
    const language = useStore(languageStore);
    const t = translations[language].footer || translations['en'].footer;

    return (
        <footer className="bg-slate-50 border-t border-slate-200 pt-12 pb-24 md:pb-12 mt-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand & Description */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 font-bold text-xl text-slate-900 mb-4">
                            <span className="text-red-600 text-2xl">•</span> NiV-Nipah Virus Tracker
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed mb-6 max-w-sm">
                            {t.desc}
                        </p>

                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="font-bold text-slate-900 mb-4">{t.resources}</h3>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><a href="https://www.who.int/news-room/fact-sheets/detail/nipah-virus" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">WHO Alerts</a></li>
                            <li><a href="https://promedmail.org/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">ProMED Mail</a></li>
                            <li><a href="/about" className="hover:text-red-600 transition-colors">Methodology</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-bold text-slate-900 mb-4">{t.contact}</h3>
                        <a href="mailto:contact@nipahtracker.online" className="text-sm text-slate-600 hover:text-red-600 transition-colors flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            contact@nipahtracker.online
                        </a>
                    </div>
                </div>

                <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>© {new Date().getFullYear()} NiV-Nipah Virus Tracker. {t.rights}</p>
                </div>
            </div>
        </footer>
    );
}
