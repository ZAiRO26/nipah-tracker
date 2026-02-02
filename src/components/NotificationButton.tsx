import { useState, useEffect } from 'react';
import { requestForToken, onMessageListener } from '../lib/firebase';

export default function NotificationButton() {
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            setPermission(Notification.permission);
        }
    }, []);

    useEffect(() => {
        onMessageListener()
            .then((payload: any) => {
                console.log('Foreground message received: ', payload);
                // You could show a toast here if you want
                // alert(`New Nipah Update: ${payload?.notification?.title}`);
            })
            .catch((err) => console.log('failed: ', err));
    }, []);

    const handleSubscribe = async () => {
        setLoading(true);
        const token = await requestForToken();
        setLoading(false);

        if (token) {
            setPermission('granted');
            console.log('Subscribed with token:', token);
            alert('You are now subscribed to Nipah Virus Alerts. 🔔');
            // TODO: In a real backend, you would send this token to your database here.
            // await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ token }) });
        } else {
            // If permission was denied or error
            if (Notification.permission === 'denied') {
                alert('Notifications are blocked. Please enable them in your browser settings to receive alerts.');
            }
            setPermission(Notification.permission);
        }
    };

    if (permission === 'granted') {
        return (
            <button
                className="inline-flex items-center justify-center p-2 rounded-full text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                title="Notifications Active"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
            </button>
        );
    }

    return (
        <button
            onClick={handleSubscribe}
            disabled={loading}
            className={`inline-flex items-center justify-center p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors ${loading ? 'opacity-50 cursor-wait' : ''}`}
            title="Enable Alerts"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                {permission === 'denied' && (
                    <line x1="4" y1="4" x2="20" y2="20"></line>
                )}
            </svg>
        </button>
    );
}
