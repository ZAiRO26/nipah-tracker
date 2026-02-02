import { useEffect, useState } from 'react';
import type { OutbreakEvent } from '../types';

export default function LiveFeed() {
    const [events, setEvents] = useState<OutbreakEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEvents() {
            try {
                const res = await fetch('/api/stats');
                const data: OutbreakEvent[] = await res.json();
                setEvents(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchEvents();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                    Live Updates
                </h2>
                <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="h-4 bg-slate-200 rounded w-1/4 mb-2"></div>
                            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h2 className="text-lg font-bold text-slate-900 flex items-center">
                    <span className="relative flex h-3 w-3 mr-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    Live Updates
                </h2>
            </div>

            <div className="overflow-y-auto p-4 space-y-4 max-h-[500px]">
                {events.length === 0 ? (
                    <div className="text-center text-slate-500 py-8">No recent updates reported.</div>
                ) : (
                    events.map((event, index) => (
                        <div key={index} className="relative pl-6 pb-6 border-l border-slate-200 last:pb-0">
                            <div className={`absolute -left-1.5 top-0 h-3 w-3 rounded-full border-2 border-white ${event.status === 'CONFIRMED' ? 'bg-red-500' :
                                event.status === 'SUSPECTED' ? 'bg-orange-500' : 'bg-slate-400'
                                }`}></div>

                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${event.status === 'CONFIRMED' ? 'bg-red-100 text-red-800' :
                                    event.status === 'SUSPECTED' ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-800'
                                    }`}>
                                    {event.status}
                                </span>
                            </div>

                            <h3 className="text-sm font-bold text-slate-900 mb-1">{event.location}</h3>

                            <p className="text-sm text-slate-600 mb-2 line-clamp-3">
                                {event.raw_snippet || `Reported ${event.cases} cases and ${event.deaths} deaths in ${event.admin_level}.`}
                            </p>

                            <div className="flex items-center justify-between mt-2">
                                <div className="text-xs text-slate-500 font-medium">
                                    {event.cases > 0 && <span className="mr-3">🦠 {event.cases} Cases</span>}
                                    {event.deaths > 0 && <span>💀 {event.deaths} Deaths</span>}
                                </div>
                                {event.source_url && (
                                    <a href={event.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:text-blue-800 hover:underline p-2 -mr-2">
                                        Source &rarr;
                                    </a>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
