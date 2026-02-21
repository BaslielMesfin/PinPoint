import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Globe } from 'lucide-react'
import { usePinpointStore } from '../../store/usePinpointStore'
import { Pin } from '../../types'
import { nanoid } from '../utils/nanoid'

// Famous cities quick-pick
const QUICK_CITIES = [
    { city: 'New York', country: 'USA', lat: 40.7128, lng: -74.006 },
    { city: 'London', country: 'UK', lat: 51.5074, lng: -0.1278 },
    { city: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708 },
    { city: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
    { city: 'Rio de Janeiro', country: 'Brazil', lat: -22.9068, lng: -43.1729 },
    { city: 'Cape Town', country: 'South Africa', lat: -33.9249, lng: 18.4241 },
    { city: 'Bangkok', country: 'Thailand', lat: 13.7563, lng: 100.5018 },
    { city: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964 },
]

export default function AddPinModal() {
    const { showAddModal, setShowAddModal, addPin, mode } = usePinpointStore()
    const [step, setStep] = useState<'pick' | 'details'>('pick')
    const [chosen, setChosen] = useState<{ city: string; country: string; lat: number; lng: number } | null>(null)
    const [title, setTitle] = useState('')
    const [date, setDate] = useState('')
    const [note, setNote] = useState('')

    if (!showAddModal) return null

    const handleClose = () => {
        setShowAddModal(false)
        setStep('pick')
        setChosen(null)
        setTitle('')
        setDate('')
        setNote('')
    }

    const handlePick = (city: typeof QUICK_CITIES[0]) => {
        setChosen(city)
        setStep('details')
    }

    const handleSave = () => {
        if (!chosen) return
        const pin: Pin = {
            id: nanoid(),
            lat: chosen.lat,
            lng: chosen.lng,
            city: chosen.city,
            country: chosen.country,
            mode,
            title: title || chosen.city,
            ...(mode === 'past' ? {
                visitedDate: date,
                memoryNote: note,
                photos: [],
            } : {
                tripStartDate: date,
                tripNotes: note,
                checklist: [],
                waypoints: [],
            })
        }
        addPin(pin)
        handleClose()
    }

    const accentColor = mode === 'past' ? '#f59e0b' : '#8b5cf6'
    const accentBg = mode === 'past' ? '#fffbeb' : '#f5f3ff'
    const accentBorder = mode === 'past' ? '#fde68a' : '#ddd6fe'

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[100] flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
            >
                <motion.div
                    className="bg-white rounded-2xl shadow-2xl overflow-hidden"
                    style={{ width: 480, maxHeight: '80vh', border: `1px solid ${accentBorder}` }}
                    initial={{ scale: 0.88, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.88, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 pb-4" style={{ borderBottom: `1px solid ${accentBorder}` }}>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: accentColor }}>
                                <MapPin size={16} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Add New Pin</h3>
                                <p className="text-xs text-gray-400">{mode === 'past' ? 'Log a past memory' : 'Plan a future trip'}</p>
                            </div>
                        </div>
                        <button onClick={handleClose} className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400">
                            <X size={16} />
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 80px)' }}>
                        <AnimatePresence mode="wait">
                            {step === 'pick' && (
                                <motion.div key="pick" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Globe size={14} style={{ color: accentColor }} />
                                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Choose a Destination</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {QUICK_CITIES.map((c) => (
                                            <button
                                                key={c.city}
                                                onClick={() => handlePick(c)}
                                                className="text-left p-3 rounded-xl border transition-all hover:scale-[1.02]"
                                                style={{ background: accentBg, borderColor: accentBorder }}
                                            >
                                                <p className="font-semibold text-sm text-gray-800">{c.city}</p>
                                                <p className="text-xs text-gray-400">{c.country}</p>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {step === 'details' && chosen && (
                                <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                                    <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: accentBg, border: `1px solid ${accentBorder}` }}>
                                        <div className="w-2 h-2 rounded-full" style={{ background: accentColor }} />
                                        <span className="font-semibold text-gray-800">{chosen.city}, {chosen.country}</span>
                                        <button onClick={() => setStep('pick')} className="ml-auto text-xs text-gray-400 hover:text-gray-600">Change</button>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Title</label>
                                        <input
                                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2"
                                            style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
                                            placeholder={`My trip to ${chosen.city}`}
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                                            {mode === 'past' ? 'Date Visited' : 'Trip Start Date'}
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                                            {mode === 'past' ? 'Memory Note' : 'Trip Notes'}
                                        </label>
                                        <textarea
                                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2"
                                            rows={3}
                                            placeholder={mode === 'past' ? 'What do you remember?' : 'What are you planning?'}
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                        />
                                    </div>

                                    <button
                                        onClick={handleSave}
                                        className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 active:scale-95"
                                        style={{ background: `linear-gradient(135deg, ${accentColor}, ${mode === 'past' ? '#d97706' : '#6d28d9'})` }}
                                    >
                                        Add Pin to Globe
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
