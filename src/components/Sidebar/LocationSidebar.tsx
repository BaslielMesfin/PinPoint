import { motion } from 'framer-motion'
import { MapPin, Calendar, ArrowRight, Star, Globe, TrendingUp } from 'lucide-react'
import { usePinpointStore } from '../../store/usePinpointStore'

export default function LocationSidebar() {
    const { mode, pins, selectedPin, setSelectedPin } = usePinpointStore()

    const filteredPins = pins.filter(p => p.mode === mode)
    const accentColor = mode === 'past' ? '#f59e0b' : '#8b5cf6'

    // "Whitened" milky HUD background tints
    const glassBg = mode === 'past'
        ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(255, 250, 240, 0.9), rgba(255, 245, 220, 0.8))' // Milky Cream Gold
        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(250, 245, 255, 0.9), rgba(240, 230, 255, 0.8))' // Milky Lavender Purple

    // Statistics logic
    const uniqueCountries = new Set(filteredPins.map(p => p.country)).size
    const totalDestinations = filteredPins.length

    return (
        <motion.div
            animate={{
                background: glassBg,
            }}
            transition={{
                duration: 1.5,
                ease: "easeInOut"
            }}
            className="relative w-full h-full flex flex-col backdrop-blur-xl rounded-3xl border border-white/60 overflow-hidden shadow-2xl"
            style={{
                boxShadow: `inset 0 0 20px rgba(255,255,255,0.3), 0 25px 50px -12px rgba(0,0,0,0.15)`
            }}
        >
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
                <div className="flex items-center gap-3 mb-1.5">
                    <div className="w-1 h-7 rounded-full" style={{ backgroundColor: accentColor }} />
                    <h2 className="font-display text-2xl text-gray-900 tracking-tight">
                        {mode === 'past' ? 'Memories' : 'Adventures'}
                    </h2>
                </div>

                {/* Stats HUD section */}
                <div className="flex items-center gap-4 mt-4 px-1">
                    <div className="flex flex-col">
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Places</span>
                        <div className="flex items-center gap-2">
                            <Globe size={12} style={{ color: accentColor }} />
                            <span className="text-sm font-black text-gray-800">{totalDestinations}</span>
                        </div>
                    </div>
                    <div className="w-px h-8 bg-gray-200" />
                    <div className="flex flex-col">
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Countries</span>
                        <div className="flex items-center gap-2">
                            <TrendingUp size={12} style={{ color: accentColor }} />
                            <span className="text-sm font-black text-gray-800">{uniqueCountries}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-5 py-2 space-y-4 custom-scrollbar">
                {filteredPins.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-900/20 space-y-2">
                        <MapPin size={24} opacity={0.3} />
                        <p className="text-xs font-medium">No destinations found.</p>
                    </div>
                ) : (
                    filteredPins.map((pin) => (
                        <motion.div
                            key={pin.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            whileHover={{
                                scale: 1.01,
                                transition: { duration: 0.2 }
                            }}
                            onClick={() => setSelectedPin(pin)}
                            className={`
                                relative p-5 rounded-2xl cursor-pointer transition-all duration-300 group
                                border ${selectedPin?.id === pin.id
                                    ? `bg-white shadow-xl scale-[1.01]`
                                    : 'bg-white/40 border-white/20 hover:bg-white/60 hover:shadow-lg'}
                            `}
                            style={{
                                borderColor: selectedPin?.id === pin.id ? accentColor : 'rgba(255,255,255,0.2)',
                            }}
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-1.5">
                                    <h3 className="text-lg font-bold text-gray-900 leading-tight">
                                        {pin.city}
                                    </h3>
                                    <p className="text-gray-900/50 text-[11px] font-medium flex items-center gap-1.5">
                                        <MapPin size={10} style={{ color: accentColor }} />
                                        {pin.country}
                                    </p>
                                </div>
                                {selectedPin?.id === pin.id && (
                                    <motion.div
                                        layoutId="active-indicator"
                                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
                                        style={{ backgroundColor: accentColor }}
                                    >
                                        <Star size={14} fill="currentColor" />
                                    </motion.div>
                                )}
                            </div>

                            <div className="mt-4 flex items-center gap-4 text-[9px] text-gray-900/40 font-bold uppercase tracking-wider">
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={10} />
                                    <span>{mode === 'past' ? pin.visitedDate : pin.tripStartDate}</span>
                                </div>
                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-gray-900">
                                    <span className="font-bold">Explore</span>
                                    <ArrowRight size={10} />
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Bottom Gradient Overlay */}
            <div className="h-16 bg-gradient-to-t from-white/60 to-transparent pointer-events-none" />
        </motion.div>
    )
}
