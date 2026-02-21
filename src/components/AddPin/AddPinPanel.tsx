import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Check, Loader2, ChevronLeft } from 'lucide-react'
import { usePinpointStore } from '../../store/usePinpointStore'
import { nanoid } from '../utils/nanoid'

export default function AddPinPanel() {
    const { mode, addPin, setIsAdding, lastClickedCoords, setLastClickedCoords } = usePinpointStore()

    const [city, setCity] = useState('')
    const [country, setCountry] = useState('')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [loading, setLoading] = useState(false)
    const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null)

    // Sync with globe clicks
    useEffect(() => {
        if (lastClickedCoords) {
            setCoords(lastClickedCoords)
            reverseGeocode(lastClickedCoords.lat, lastClickedCoords.lng)
            setLastClickedCoords(null)
        }
    }, [lastClickedCoords])

    const reverseGeocode = async (lat: number, lng: number) => {
        setLoading(true)
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`)
            const data = await res.json()
            if (data.address) {
                setCity(data.address.city || data.address.town || data.address.village || data.address.state || '')
                setCountry(data.address.country || '')
            }
        } catch (error) {
            console.error('Reverse Geocoding failed:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = () => {
        if (!city || !country) return

        addPin({
            id: nanoid(),
            lat: coords?.lat || 0,
            lng: coords?.lng || 0,
            city,
            country,
            mode,
            visitedDate: mode === 'past' ? date : undefined,
            tripStartDate: mode === 'future' ? date : undefined,
            photos: [],
            checklist: [],
            waypoints: []
        })
    }

    const accentColor = mode === 'past' ? '#f59e0b' : '#8b5cf6'

    return (
        <div className="relative w-full h-full flex flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/95 backdrop-blur-3xl shadow-2xl">
            {/* Crystal Edge Shimmer */}
            <motion.div
                animate={{
                    left: ['-50%', '150%'],
                    opacity: [0, 0.5, 0]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 20,
                    ease: "linear"
                }}
                className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] pointer-events-none z-10"
            />

            {/* Header */}
            <div className="p-8 pb-4">
                <button
                    onClick={() => setIsAdding(false)}
                    className="flex items-center gap-1 mb-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <ChevronLeft size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">Cancel</span>
                </button>
                <h2 className="font-display text-2xl text-gray-900 tracking-tight mb-2">
                    {mode === 'past' ? 'Mark a Memory' : 'Pin an Adventure'}
                </h2>
                <p className="text-xs text-gray-500 leading-relaxed">
                    Click anywhere on the globe to auto-locate, or type the details below.
                </p>
            </div>

            <div className="flex-1 overflow-y-auto px-8 space-y-6 custom-scrollbar pb-8">
                {/* Location Input */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 pl-1">City / Place</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="e.g. Paris"
                                className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 transition-all"
                                style={{ '--tw-ring-color': `${accentColor}33` } as any}
                            />
                            {loading && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <Loader2 size={16} className="text-gray-300 animate-spin" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 pl-1">Country</label>
                        <input
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            placeholder="e.g. France"
                            className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 transition-all"
                            style={{ '--tw-ring-color': `${accentColor}33` } as any}
                        />
                    </div>
                </div>

                {/* Date Input */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 pl-1">
                        {mode === 'past' ? 'When were you there?' : 'When are you going?'}
                    </label>
                    <div className="relative">
                        <Calendar size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-5 py-3 text-sm focus:outline-none focus:ring-2 transition-all appearance-none"
                            style={{ '--tw-ring-color': `${accentColor}33` } as any}
                        />
                    </div>
                </div>

                {/* Visual Feedback of Coords */}
                {coords && (
                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                            <Check size={16} strokeWidth={3} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Location Locked</span>
                            <span className="text-[10px] text-emerald-600/60 font-medium">Lat: {coords.lat.toFixed(4)} Lng: {coords.lng.toFixed(4)}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Action */}
            <div className="p-8 pt-4">
                <button
                    onClick={handleSave}
                    disabled={!city || !country || !coords}
                    className="w-full py-4 rounded-2xl font-bold text-white shadow-xl shadow-amber-500/20 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:shadow-none transition-all duration-300"
                    style={{
                        background: accentColor,
                        boxShadow: `0 12px 24px -8px ${accentColor}66`
                    }}
                >
                    Pin to World
                </button>
            </div>
        </div>
    )
}
