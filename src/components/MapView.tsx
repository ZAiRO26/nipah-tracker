import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { type OutbreakEvent } from "../types";
import { useEffect, useState } from 'react';
import L from 'leaflet';

function MapUpdater({ events }: { events: OutbreakEvent[] }) {
    const map = useMap();
    useEffect(() => {
        if (events.length > 0) {
            // Need valid coords for bounds.
            // Since we lack real lat/lng in DB, we use the same fallback logic for bounds calc or skip.
            // For this specific 'Fit Bounds' task, without real Lat/Lng in the data, it is tricky.
            // But I will apply the logic that IF we had markers, we would fit them.
            // I'll re-use the hardcoded fallback for the 'markers' array logic here or just rely on the center and zoom update requested.
            // The user requested: "Change default center... Change default zoom... Bonus: Add code to automatically fit map bounds".

            // Replicating fallback logic for bounds calculation
            const markers = events.map(event => {
                let lat, lng;
                if (event.location.includes("Barasat")) { lat = 22.72; lng = 88.48; }
                else if (event.location.includes("North 24")) { lat = 22.64; lng = 88.45; }
                else if (event.location.includes("Kozhikode")) { lat = 11.25; lng = 75.78; }
                else if (event.location.includes("Dhaka")) { lat = 23.81; lng = 90.41; }
                else if (event.location.includes("Singapore")) { lat = 1.35; lng = 103.81; }
                else if (event.location.includes("Malaysia")) { lat = 4.21; lng = 101.97; }
                else { return null; }
                return L.marker([lat, lng]);
            }).filter(m => m !== null) as L.Marker[];

            if (markers.length > 0) {
                const group = new L.FeatureGroup(markers);
                map.fitBounds(group.getBounds(), { padding: [50, 50], maxZoom: 5 });
            }
        }
    }, [events, map]);
    return null;
}

export default function MapView() {
    const [events, setEvents] = useState<OutbreakEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const position: [number, number] = [20.0, 78.0]; // Zoomed out Asia/Global View

    useEffect(() => {
        async function fetchEvents() {
            try {
                const res = await fetch('/api/stats');
                const data = await res.json();
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
        return <div className="h-[600px] w-full rounded-xl bg-slate-100 animate-pulse flex items-center justify-center text-slate-400">Loading Map Data...</div>;
    }

    return (
        <div className="h-[600px] w-full rounded-xl overflow-hidden border border-slate-200 z-0 shadow-sm relative">
            <MapContainer center={position} zoom={4} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapUpdater events={events} />
                {events.map((event) => {
                    // Fallback for known locations
                    let lat: number | undefined;
                    let lng: number | undefined;

                    if (event.location.includes("Barasat")) { lat = 22.72; lng = 88.48; }
                    else if (event.location.includes("North 24")) { lat = 22.64; lng = 88.45; }
                    else if (event.location.includes("Kozhikode")) { lat = 11.25; lng = 75.78; }
                    else if (event.location.includes("Dhaka")) { lat = 23.81; lng = 90.41; }
                    else if (event.location.includes("Singapore")) { lat = 1.35; lng = 103.81; }
                    else if (event.location.includes("Malaysia")) { lat = 4.21; lng = 101.97; }
                    else { return null; }

                    const color = event.status === 'CONFIRMED' ? 'red' :
                        event.status === 'SUSPECTED' ? 'orange' : 'gray';

                    return (
                        <CircleMarker
                            key={event.id}
                            center={[lat, lng]}
                            pathOptions={{ color: color, fillColor: color, fillOpacity: 0.6 }}
                            radius={Math.max(5, (event.cases || 0) * 2 + 5)}
                        >
                            <Popup>
                                <div className="text-sm">
                                    <strong className="block text-slate-900 mb-1">{event.location}</strong>
                                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded text-white ${event.status === 'CONFIRMED' ? 'bg-red-600' : 'bg-orange-500'
                                        }`}>{event.status}</span>
                                    <div className="mt-2 text-slate-600">
                                        <div>Cases: <strong>{event.cases}</strong></div>
                                        <div>Deaths: <strong>{event.deaths}</strong></div>
                                    </div>
                                    <p className="mt-2 text-xs text-slate-500">{event.raw_snippet?.substring(0, 100)}...</p>
                                </div>
                            </Popup>
                        </CircleMarker>
                    );
                })}
            </MapContainer>
        </div>
    );
}
