import { useState } from 'react';

export default function ShareButton() {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const shareData = {
            title: 'NiV-Tracker Alert',
            text: 'Real-time Nipah Virus Surveillance & Safety Status.',
            url: window.location.origin,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback to clipboard
            try {
                await navigator.clipboard.writeText(window.location.origin);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy keys', err);
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className="inline-flex items-center justify-center p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
            title="Share Status"
            aria-label="Share"
        >
            {copied ? (
                <span className="text-emerald-600 font-bold text-xs">Copied!</span>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
            )}
        </button>
    );
}
