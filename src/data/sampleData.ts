import { Pin } from '../types'

// Sample photos as placholder colored data URLs (will be replaced by generated images)
// Using Unsplash for demo purposes
const parisPhotos = [
    { id: 'p1', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80', caption: 'Eiffel at golden hour', dateTaken: '2023-05-14' },
    { id: 'p2', url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80', caption: 'Montmartre streets', dateTaken: '2023-05-15' },
    { id: 'p3', url: 'https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b?w=400&q=80', caption: 'Café au lait mornings', dateTaken: '2023-05-16' },
]
const kyotoPhotos = [
    { id: 'k1', url: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&q=80', caption: 'Golden Pavilion', dateTaken: '2022-11-10' },
    { id: 'k2', url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=80', caption: 'Fushimi Inari gates', dateTaken: '2022-11-11' },
    { id: 'k3', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80', caption: 'Arashiyama bamboo', dateTaken: '2022-11-12' },
]
const santoriniPhotos = [
    { id: 's1', url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80', caption: 'Blue domes of Oia', dateTaken: '2021-07-20' },
    { id: 's2', url: 'https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400&q=80', caption: 'Sunset at Oia', dateTaken: '2021-07-21' },
]

export const samplePins: Pin[] = [
    // ── Past memories ──────────────────────────────────────────────
    {
        id: 'paris-2023',
        lat: 48.8566,
        lng: 2.3522,
        city: 'Paris',
        country: 'France',
        mode: 'past',
        title: 'The Parisian Dream',
        visitedDate: '2023-05-14',
        memoryNote: 'Rainy afternoons in Montmartre. Best coffee of my life. The city has a way of slowing time.',
        photos: parisPhotos,
    },
    {
        id: 'kyoto-2022',
        lat: 35.0116,
        lng: 135.7681,
        city: 'Kyoto',
        country: 'Japan',
        mode: 'past',
        title: 'Ancient Kyoto',
        visitedDate: '2022-11-10',
        memoryNote: 'Golden Pavilion at sunset. Truly magical silence among a thousand tourists.',
        photos: kyotoPhotos,
    },
    {
        id: 'santorini-2021',
        lat: 36.3932,
        lng: 25.4615,
        city: 'Santorini',
        country: 'Greece',
        mode: 'past',
        title: 'Islands in the Aegean',
        visitedDate: '2021-07-20',
        memoryNote: 'Whitewash and blue domes. Every photo looks like a painting.',
        photos: santoriniPhotos,
    },

    // ── Future trips ──────────────────────────────────────────────
    {
        id: 'tokyo-future',
        lat: 35.6762,
        lng: 139.6503,
        city: 'Tokyo',
        country: 'Japan',
        mode: 'future',
        title: 'Cherry Blossom Season',
        tripStartDate: '2026-03-25',
        tripEndDate: '2026-04-05',
        tripNotes: 'Must see sakura at Shinjuku Gyoen. Book tickets early.',
        checklist: [
            { id: 'tc1', text: 'Book flights ✈️', done: true },
            { id: 'tc2', text: 'Reserve ryokan in Asakusa', done: true },
            { id: 'tc3', text: 'Get JR Pass', done: false },
            { id: 'tc4', text: 'Visit Tsukiji for breakfast', done: false },
            { id: 'tc5', text: 'Day trip to Nikko', done: false },
        ],
        waypoints: [
            { id: 'w1', name: 'Shinjuku Gyoen', order: 1 },
            { id: 'w2', name: 'Senso-ji Temple, Asakusa', order: 2 },
            { id: 'w3', name: 'teamLab Planets', order: 3 },
        ],
    },
    {
        id: 'machu-picchu-future',
        lat: -13.1631,
        lng: -72.545,
        city: 'Machu Picchu',
        country: 'Peru',
        mode: 'future',
        title: 'The Inca Trail',
        tripStartDate: '2026-08-10',
        tripEndDate: '2026-08-20',
        tripNotes: 'Altitude sickness medication. Train from Cusco.',
        checklist: [
            { id: 'mc1', text: 'Buy Inca Trail permits', done: false },
            { id: 'mc2', text: 'Book Cusco hotel', done: false },
            { id: 'mc3', text: 'Get altitude sickness meds', done: false },
            { id: 'mc4', text: 'Research guided tours', done: true },
        ],
        waypoints: [
            { id: 'w4', name: 'Cusco city tour', order: 1 },
            { id: 'w5', name: 'Sacred Valley', order: 2 },
            { id: 'w6', name: 'Machu Picchu citadel', order: 3 },
        ],
    },
    {
        id: 'reykjavik-future',
        lat: 64.1466,
        lng: -21.9426,
        city: 'Reykjavik',
        country: 'Iceland',
        mode: 'future',
        title: 'Northern Lights Hunt',
        tripStartDate: '2026-12-01',
        tripEndDate: '2026-12-10',
        tripNotes: 'Winter is the only time for aurora. Go outside the city for dark skies.',
        checklist: [
            { id: 'rc1', text: 'Rent a 4x4 SUV', done: false },
            { id: 'rc2', text: 'Buy thermal gear', done: false },
            { id: 'rc3', text: 'Book Blue Lagoon visit', done: true },
            { id: 'rc4', text: 'Download aurora forecast app', done: false },
        ],
        waypoints: [
            { id: 'w7', name: 'Golden Circle route', order: 1 },
            { id: 'w8', name: 'Jokulsarlon glacier lagoon', order: 2 },
            { id: 'w9', name: 'Blue Lagoon', order: 3 },
        ],
    },
]
