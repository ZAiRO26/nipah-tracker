import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { languageStore } from '../stores/languageStore';
import { translations } from '../i18n/translations';
import type { OutbreakEvent } from '../types';

export default function StatsGrid() {
    const language = useStore(languageStore);
    const t = translations[language].stats || translations['en'].stats; // Fallback

    const [stats, setStats] = useState({
        totalCases: 0,
        suspectedCases: 0,
        totalDeaths: 0,
        activeClusters: 0,
        lastUpdated: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/stats');
                const events: OutbreakEvent[] = await res.json();

                // Calculate stats
                const confirmedEvents = events.filter(e => e.status === 'CONFIRMED');
                const suspectedEvents = events.filter(e => e.status === 'SUSPECTED');

                const totalCases = confirmedEvents.reduce((sum, e) => sum + e.cases, 0);
                const suspectedCases = suspectedEvents.reduce((sum, e) => sum + e.cases, 0); // Suspected cases count
                const totalDeaths = events.reduce((sum, e) => sum + e.deaths, 0);
                const uniqueLocations = new Set(events.map(e => e.location));

                // Robust Date Parsing
                let lastUpdated = new Date().toISOString();
                if (events.length > 0 && events[0].date) {
                    lastUpdated = events[0].date;
                }

                setStats({
                    totalCases,
                    suspectedCases,
                    totalDeaths,
                    activeClusters: uniqueLocations.size,
                    lastUpdated
                });
            } catch (err) {
                console.error("Failed to fetch stats", err);
                setStats(s => ({ ...s, lastUpdated: new Date().toISOString() })); // Fallback
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm animate-pulse">
                        <div className="h-3 w-24 bg-slate-200 rounded mb-2"></div>
                        <div className="h-8 w-16 bg-slate-200 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-red-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider relative z-10">{t.confirmed}</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-1 relative z-10">{stats.totalCases}</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-orange-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider relative z-10">{t.suspected}</p>
                <p className="text-3xl font-extrabold text-orange-600 mt-1 relative z-10">{stats.suspectedCases}</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.active_clusters}</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{stats.activeClusters}</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.deaths}</p>
                <p className="text-3xl font-bold text-slate-700 mt-1">{stats.totalDeaths}</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.last_updated}</p>
                <p className="text-lg font-bold text-slate-700 mt-1">
                    {stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleDateString() : t.recent}
                </p>
                <p className="text-xs text-slate-400">
                    {stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </p>
            </div>
        </div>
    );
}
