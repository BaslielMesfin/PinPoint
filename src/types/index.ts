// Core types for PinPoint

export type Mode = 'past' | 'future'

export interface Photo {
    id: string
    url: string        // base64 or asset path
    caption?: string
    dateTaken?: string
}

export interface ChecklistItem {
    id: string
    text: string
    done: boolean
}

export interface RouteWaypoint {
    id: string
    name: string
    order: number
}

export interface Pin {
    id: string
    lat: number
    lng: number
    city: string
    country: string
    mode: Mode

    // Past memory fields
    photos?: Photo[]
    memoryNote?: string
    visitedDate?: string
    title?: string

    // Future trip fields
    tripStartDate?: string
    tripEndDate?: string
    checklist?: ChecklistItem[]
    tripNotes?: string
    waypoints?: RouteWaypoint[]
}
