import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { languageStore } from '../stores/languageStore';
import { translations } from '../i18n/translations';

interface Article {
    id: number;
    title: string;
    summary: string;
    source_url: string;
    published_at: string;
    source_name: string;
    category: string;
    confidence_score: number;
}

export default function NewsGrid({ initialArticles }: { initialArticles: Article[] }) {
    const language = useStore(languageStore);
    const t = translations[language].news;
    const [filter, setFilter] = useState('All');

    const getLabel = (cat: string) => {
        if (cat === 'All') return t.all;
        if (cat === 'Official') return t.official;
        if (cat === 'News') return 'News'; // Temporary fallback until I add key
        if (cat === 'Social') return t.social;
        return cat;
    };

    const filtered = initialArticles.filter(a => filter === 'All' || a.category === filter);

    return (
        <div>
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {['All', 'Official', 'News', 'Social'].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${filter === cat
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        {getLabel(cat)}
                    </button>
                ))}

                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-colors text-sm font-medium flex items-center ml-auto"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {t.refresh}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(article => (
                    <a
                        key={article.id}
                        href={article.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col h-full"
                    >
                        <div className="p-6 flex flex-col flex-1">
                            <div className="flex justify-between items-start mb-3">
                                <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${article.category === 'Official' ? 'bg-blue-100 text-blue-800' :
                                    article.category === 'Social' ? 'bg-orange-100 text-orange-800' :
                                        'bg-slate-100 text-slate-800'
                                    }`}>
                                    {article.category}
                                </span>
                                <span className="text-xs text-slate-400">
                                    {new Date(article.published_at).toLocaleDateString()}
                                </span>
                            </div>

                            <h3 className="font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                {article.title}
                            </h3>

                            <p className="text-sm text-slate-600 mb-4 flex-1 line-clamp-3">
                                {article.summary}
                            </p>

                            <div className="flex items-center text-xs text-slate-500 font-medium pt-4 border-t border-slate-100 mt-auto">
                                <span className="truncate max-w-[150px]">{article.source_name}</span>
                                <span className="ml-auto flex items-center text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Read Article &rarr;
                                </span>
                            </div>
                        </div>
                    </a>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <p className="text-slate-500 font-medium">No articles found in this category.</p>
                </div>
            )}
        </div>
    );
}
