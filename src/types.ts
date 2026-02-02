export enum OutbreakStatus {
    CONFIRMED = 'CONFIRMED',
    SUSPECTED = 'SUSPECTED',
    DISCARDED = 'DISCARDED'
}

export interface OutbreakEvent {
    id: string;
    source_url: string;
    date: string;
    location: string;
    admin_level: string;
    cases: number;
    deaths: number;
    status: OutbreakStatus;
    confidence_score: number;
    raw_snippet: string;
    lat?: number;
    lng?: number;
}

export interface Stats {
    totalCases: number;
    totalDeaths: number;
    activeClusters: number;
    lastUpdated: string;
}
