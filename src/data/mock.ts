import { OutbreakStatus, type OutbreakEvent, type Stats } from "../types";

export const MOCK_STATS: Stats = {
    totalCases: 12,
    totalDeaths: 4,
    activeClusters: 1,
    lastUpdated: new Date().toISOString()
};

export const MOCK_EVENTS: OutbreakEvent[] = [
    {
        id: "evt-1",
        source_url: "https://example.com/don-1",
        date: "2026-02-01T10:00:00Z",
        location: "Kozhikode, Kerala",
        admin_level: "District",
        cases: 2,
        deaths: 1,
        status: OutbreakStatus.CONFIRMED,
        confidence_score: 0.98,
        raw_snippet: "Two confirmed cases in Kozhikode.",
        lat: 11.2588,
        lng: 75.7804
    },
    {
        id: "evt-2",
        source_url: "https://example.com/don-2",
        date: "2026-01-30T14:30:00Z",
        location: "Malappuram, Kerala",
        admin_level: "District",
        cases: 1,
        deaths: 0,
        status: OutbreakStatus.SUSPECTED,
        confidence_score: 0.85,
        raw_snippet: "One suspected case reported in Malappuram.",
        lat: 11.0510,
        lng: 76.0711
    },
    {
        id: "evt-3",
        source_url: "https://example.com/don-0",
        date: "2026-01-28T09:15:00Z",
        location: "Siliguri, West Bengal",
        admin_level: "District",
        cases: 9,
        deaths: 3,
        status: OutbreakStatus.CONFIRMED,
        confidence_score: 0.99,
        raw_snippet: "Cluster of 9 cases in Siliguri.",
        lat: 26.7271,
        lng: 88.3953
    }
];
