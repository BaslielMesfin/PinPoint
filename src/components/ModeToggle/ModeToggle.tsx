import { motion } from 'framer-motion'
import { usePinpointStore } from '../../store/usePinpointStore'

export default function ModeToggle() {
    const { mode, setMode } = usePinpointStore()

    return (
        <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-md border border-gray-100">
            {/* Past */}
            <button
                onClick={() => setMode('past')}
                className="relative flex items-center px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-300"
                style={{ color: mode === 'past' ? '#ffffff' : '#78716c' }}
            >
                {mode === 'past' && (
                    <motion.div
                        layoutId="mode-pill"
                        className="absolute inset-0 rounded-full"
                        style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                )}
                <span className="relative z-10">Past</span>
            </button>

            {/* Future */}
            <button
                onClick={() => setMode('future')}
                className="relative flex items-center px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-300"
                style={{ color: mode === 'future' ? '#ffffff' : '#78716c' }}
            >
                {mode === 'future' && (
                    <motion.div
                        layoutId="mode-pill"
                        className="absolute inset-0 rounded-full"
                        style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                )}
                <span className="relative z-10">Future</span>
            </button>
        </div>
    )
}
