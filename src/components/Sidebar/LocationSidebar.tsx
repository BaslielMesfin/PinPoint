import { motion } from 'framer-motion'
import { MapPin, Calendar, ArrowRight, Star } from 'lucide-react'
import { usePinpointStore } from '../../store/usePinpointStore'
import type { Pin } from '../../types'

export default function LocationSidebar() {
    const { mode, pins, selectedPin, setSelectedPin } = usePinpointStore()

    const filteredPins = pins.filter(p => p.mode === mode)
    const accentColor = mode === 'past' ? '#f59e0b' : '#8b5cf6'

    // Subtle background tint based on mode
    const glassBg = mode === 'past'
        ? 'rgba(255, 248, 230, 0.6)' // Subtle Gold
        : 'rgba(248, 245, 255, 0.6)' // Subtle Purple

    return (
        <div
            className="w-full h-full flex flex-col backdrop-blur-2xl rounded-[2.5rem] border border-white/50 shadow-[0_32px_80px_rgba(0,0,0,0.15)] overflow-hidden transition-all duration-700"
            style={{ backgroundColor: glassBg }}
        >
            {/* Header */}
            <div className="p-10 pb-6">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: accentColor }} />
                    <h2 className="font-display text-5xl text-gray-900 tracking-tight">
                        {mode === 'past' ? 'Memories' : 'Adventures'}
                    </h2>
                </div>
                <p className="text-sm text-gray-400 font-semibold uppercase tracking-widest pl-4">
                    {filteredPins.length} saved locations
                </p>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar">
                {filteredPins.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-400 space-y-2">
                        <MapPin size={32} opacity={0.3} />
                        <p className="text-sm">No pins here yet.</p>
                    </div>
                ) : (
                    filteredPins.map((pin, idx) => (
                        <motion.div
                            key={pin.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => setSelectedPin(pin)}
                            className={`
                                relative p-6 rounded-[2rem] cursor-pointer transition-all duration-500 group
                                border ${selectedPin?.id === pin.id
                                    ? `bg-white shadow-[0_20px_40px_rgba(0,0,0,0.1)] scale-[1.02]`
                                    : 'bg-white/30 border-white/40 hover:bg-white/50 hover:scale-[1.01] hover:shadow-lg'}
                            `}
                            style={{
                                borderColor: selectedPin?.id === pin.id ? accentColor : 'rgba(255,255,255,0.4)',
                                borderWidth: '2px',
                            }}
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                                        {pin.city}
                                    </h3>
                                    <p className="text-gray-500 text-sm font-medium flex items-center gap-1.5">
                                        <MapPin size={14} style={{ color: accentColor }} />
                                        {pin.country}
                                    </p>
                                </div>
                                {selectedPin?.id === pin.id && (
                                    <motion.div
                                        layoutId="active-indicator"
                                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg"
                                        style={{ backgroundColor: accentColor }}
                                    >
                                        <Star size={20} fill="currentColor" />
                                    </motion.div>
                                )}
                            </div>

                            <div className="mt-4 flex items-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={12} />
                                    <span>{mode === 'past' ? pin.visitedDate : pin.tripStartDate}</span>
                                </div>
                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-gray-900">
                                    <span className="text-[10px]">Fly to</span>
                                    <ArrowRight size={12} />
                                </div>
                            </div>

                            {selectedPin?.id === pin.id && (
                                <motion.div
                                    layoutId="activePinIndicator"
                                    className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-full"
                                    style={{ background: accentColor }}
                                />
                            )}
                        </motion.div>
                    ))
                )}
            </div>

            {/* Bottom Gradient Overlay */}
            <div className="h-12 bg-gradient-to-t from-white/40 to-transparent pointer-events-none" />
        </div>
    )
}
