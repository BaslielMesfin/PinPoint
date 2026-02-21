import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Calendar, FileText, CheckSquare, Route, Trash2, Plus } from 'lucide-react'
import { usePinpointStore } from '../../store/usePinpointStore'
import { ChecklistItem } from '../../types'
import { nanoid } from '../utils/nanoid'

export default function TripPlanner() {
    const { selectedPin, setSelectedPin, updatePin, deletePin } = usePinpointStore()

    if (!selectedPin || selectedPin.mode !== 'future') return null

    const checklist = selectedPin.checklist ?? []
    const waypoints = selectedPin.waypoints ?? []

    const toggleCheckItem = (id: string) => {
        updatePin(selectedPin.id, {
            checklist: checklist.map((item) =>
                item.id === id ? { ...item, done: !item.done } : item
            ),
        })
    }

    const addCheckItem = () => {
        const item: ChecklistItem = { id: nanoid(), text: '', done: false }
        updatePin(selectedPin.id, { checklist: [...checklist, item] })
    }

    const updateCheckItem = (id: string, text: string) => {
        updatePin(selectedPin.id, {
            checklist: checklist.map((item) => (item.id === id ? { ...item, text } : item)),
        })
    }

    const removeCheckItem = (id: string) => {
        updatePin(selectedPin.id, { checklist: checklist.filter((i) => i.id !== id) })
    }

    const doneCount = checklist.filter((i) => i.done).length
    const progress = checklist.length > 0 ? (doneCount / checklist.length) * 100 : 0

    return (
        <motion.div
            key={selectedPin.id}
            className="absolute left-6 top-6 bottom-6 z-40 flex flex-col overflow-hidden rounded-[2.5rem] border border-white/50"
            style={{
                width: 420,
                background: 'rgba(248, 245, 255, 0.85)',
                backdropFilter: 'blur(24px)',
                boxShadow: '0_40px_100px_rgba(0,0,0,0.2)',
            }}
            initial={{ x: -460, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -460, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 28 }}
        >
            {/* Header */}
            <div className="flex items-start justify-between p-6 pb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-violet-500" style={{ boxShadow: '0 0 6px #8b5cf6' }} />
                        <span className="text-xs uppercase tracking-widest text-violet-500 font-semibold">Future Trip</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 leading-tight">
                        {selectedPin.title || selectedPin.city}
                    </h2>
                    <div className="flex items-center gap-1.5 mt-1 text-gray-400 text-sm">
                        <MapPin size={12} />
                        <span>{selectedPin.city}, {selectedPin.country}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => { deletePin(selectedPin.id); setSelectedPin(null) }}
                        className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center text-red-400 hover:text-red-500 transition-all"
                    >
                        <Trash2 size={15} />
                    </button>
                    <button
                        onClick={() => setSelectedPin(null)}
                        className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-all"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* Dates */}
            {(selectedPin.tripStartDate || selectedPin.tripEndDate) && (
                <div className="mx-6 mb-4 flex items-center gap-2 text-sm bg-violet-50 rounded-xl p-3 border border-violet-100">
                    <Calendar size={14} className="text-violet-400 shrink-0" />
                    <div className="text-violet-700 font-medium">
                        {selectedPin.tripStartDate && new Date(selectedPin.tripStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        {selectedPin.tripEndDate && ` → ${new Date(selectedPin.tripEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                    </div>
                </div>
            )}

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 space-y-5 pb-6">

                {/* Progress bar */}
                {checklist.length > 0 && (
                    <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Trip prep</span>
                            <span>{doneCount}/{checklist.length} done</span>
                        </div>
                        <div className="h-2 bg-violet-100 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full rounded-full"
                                style={{ background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)' }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>
                )}

                {/* Checklist */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <CheckSquare size={14} className="text-violet-400" />
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Checklist</span>
                        </div>
                        <button
                            onClick={addCheckItem}
                            className="flex items-center gap-1 text-xs text-violet-500 hover:text-violet-600 font-medium transition-colors"
                        >
                            <Plus size={12} /> Add
                        </button>
                    </div>
                    <div className="space-y-1.5">
                        <AnimatePresence>
                            {checklist.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    className="flex items-center gap-2 group"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <button
                                        onClick={() => toggleCheckItem(item.id)}
                                        className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-all duration-200 ${item.done
                                            ? 'bg-violet-500 border-violet-500'
                                            : 'border-gray-300 hover:border-violet-400'
                                            }`}
                                    >
                                        {item.done && (
                                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </button>
                                    <input
                                        className={`flex-1 text-sm bg-transparent border-none outline-none transition-all ${item.done ? 'line-through text-gray-400' : 'text-gray-700'}`}
                                        value={item.text}
                                        onChange={(e) => updateCheckItem(item.id, e.target.value)}
                                        placeholder="Add task..."
                                    />
                                    <button
                                        onClick={() => removeCheckItem(item.id)}
                                        className="opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-400 transition-all"
                                    >
                                        <X size={13} />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Waypoints */}
                {waypoints.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Route size={14} className="text-violet-400" />
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Route</span>
                        </div>
                        <div className="space-y-2">
                            {waypoints.sort((a, b) => a.order - b.order).map((wp, idx) => (
                                <div key={wp.id} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 text-xs font-bold flex-shrink-0">
                                        {idx + 1}
                                    </div>
                                    <span className="text-sm text-gray-600">{wp.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Notes */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <FileText size={14} className="text-violet-400" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Notes</span>
                    </div>
                    <textarea
                        className="w-full p-3 rounded-xl text-sm text-gray-700 bg-violet-50/60 border border-violet-100 resize-none focus:outline-none focus:ring-2 focus:ring-violet-200 leading-relaxed"
                        rows={3}
                        value={selectedPin.tripNotes ?? ''}
                        placeholder="Trip notes, ideas, reminders..."
                        onChange={(e) => updatePin(selectedPin.id, { tripNotes: e.target.value })}
                    />
                </div>
            </div>
        </motion.div>
    )
}
