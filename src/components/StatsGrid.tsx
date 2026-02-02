import { useEffect, useState } from 'react';
import type { OutbreakEvent } from '../types';

export default function StatsGrid() {
    const [stats, setStats] = useState({ totalCases: 0, totalDeaths: 0, activeClusters: 0, lastUpdated: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/stats');
                const events: OutbreakEvent[] = await res.json();

                const totalCases = events.reduce((sum, e) => sum + e.cases, 0);
                const totalDeaths = events.reduce((sum, e) => sum + e.deaths, 0);
                const uniqueLocations = new Set(events.map(e => e.location));
                const lastUpdated = events.length > 0 ? events[0].date : new Date().toISOString();

                setStats({
                    totalCases,
                    totalDeaths,
                    activeClusters: uniqueLocations.size,
                    lastUpdated
                });
            } catch (err) {
                console.error("Failed to fetch stats", err);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm animate-pulse">
                        <div className="h-3 w-24 bg-slate-200 rounded mb-2"></div>
                        <div className="h-8 w-16 bg-slate-200 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Confirmed Cases</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalCases}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Clusters</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{stats.activeClusters}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Deaths</p>
                <p className="text-3xl font-bold text-slate-700 mt-1">{stats.totalDeaths}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Last Updated</p>
                <p className="text-lg font-bold text-slate-700 mt-2">
                    {new Date(stats.lastUpdated).toLocaleDateString()}
                </p>
                <p className="text-xs text-slate-400">
                    {new Date(stats.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
        </div>
    );
}
