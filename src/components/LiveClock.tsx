import { useState, useEffect } from 'react';

export default function LiveClock() {
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        setTime(new Date());
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!time) return <div className="h-6 w-24 bg-slate-100 rounded animate-pulse"></div>;

    return (
        <div className="text-sm font-mono font-medium text-slate-600 bg-white/80 backdrop-blur border border-slate-200 px-3 py-1 rounded-full shadow-sm inline-flex items-center gap-2">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
    );
}
