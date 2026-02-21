import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, MapPin, Calendar, FileText, CheckSquare, Route, Trash2, Plus, X } from 'lucide-react'
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
        <div className="w-full h-full flex flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/95 backdrop-blur-3xl shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between p-6 pb-4">
                <div className="flex flex-col gap-1">
                    <button
                        onClick={() => setSelectedPin(null)}
                        className="flex items-center gap-1 text-violet-500 hover:text-violet-600 transition-colors mb-2 -ml-1"
                    >
                        <ChevronLeft size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Back to adventures</span>
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                            <span className="text-[10px] uppercase tracking-widest text-violet-500 font-bold">Future Trip</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">
                            {selectedPin.title || selectedPin.city}
                        </h2>
                        <div className="flex items-center gap-1.5 mt-1 text-gray-400 text-xs font-medium">
                            <MapPin size={10} />
                            <span>{selectedPin.city}, {selectedPin.country}</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => { if (confirm('Cancel this plan?')) { deletePin(selectedPin.id); setSelectedPin(null) } }}
                    className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center text-red-300 hover:text-red-500 transition-all"
                >
                    <Trash2 size={15} />
                </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 space-y-6 pb-8 custom-scrollbar">

                {/* Dates */}
                {(selectedPin.tripStartDate || selectedPin.tripEndDate) && (
                    <div className="flex items-center gap-3 bg-violet-50/50 rounded-2xl p-4 border border-violet-100/50">
                        <Calendar size={14} className="text-violet-400 shrink-0" />
                        <div className="text-xs text-violet-700 font-bold tracking-tight">
                            {selectedPin.tripStartDate && new Date(selectedPin.tripStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            {selectedPin.tripEndDate && ` → ${new Date(selectedPin.tripEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                        </div>
                    </div>
                )}

                {/* Progress bar */}
                {checklist.length > 0 && (
                    <div>
                        <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2 pr-1">
                            <span>Ready for takeoff?</span>
                            <span>{doneCount}/{checklist.length}</span>
                        </div>
                        <div className="h-1.5 bg-violet-100 rounded-full overflow-hidden">
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
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <CheckSquare size={14} className="text-violet-400" />
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Preparation</span>
                        </div>
                        <button
                            onClick={addCheckItem}
                            className="flex items-center gap-1 text-[10px] bg-violet-100 text-violet-600 px-2 py-1 rounded-lg font-bold uppercase tracking-wider transition-colors hover:bg-violet-200"
                        >
                            <Plus size={10} /> Add
                        </button>
                    </div>
                    <div className="space-y-2">
                        <AnimatePresence initial={false}>
                            {checklist.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    className="flex items-center gap-3 group"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <button
                                        onClick={() => toggleCheckItem(item.id)}
                                        className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 border-2 transition-all duration-200 ${item.done
                                            ? 'bg-violet-500 border-violet-500 shadow-sm'
                                            : 'border-violet-100 bg-white/50 hover:border-violet-300'
                                            }`}
                                    >
                                        {item.done && (
                                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </button>
                                    <input
                                        className={`flex-1 text-sm bg-transparent border-none outline-none transition-all ${item.done ? 'line-through text-gray-300' : 'text-gray-700 font-medium'}`}
                                        value={item.text}
                                        onChange={(e) => updateCheckItem(item.id, e.target.value)}
                                        placeholder="Add task..."
                                    />
                                    <button
                                        onClick={() => removeCheckItem(item.id)}
                                        className="opacity-0 group-hover:opacity-100 text-red-200 hover:text-red-400 transition-all p-1"
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
                        <div className="flex items-center gap-2 mb-3">
                            <Route size={14} className="text-violet-400" />
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Route Plan</span>
                        </div>
                        <div className="space-y-2.5">
                            {waypoints.sort((a, b) => a.order - b.order).map((wp, idx) => (
                                <div key={wp.id} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-lg bg-violet-100/50 flex items-center justify-center text-violet-600 text-[10px] font-black flex-shrink-0 border border-violet-100">
                                        {idx + 1}
                                    </div>
                                    <span className="text-sm text-gray-700 font-medium">{wp.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Notes */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <FileText size={14} className="text-violet-400" />
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Deep Dives</span>
                    </div>
                    <textarea
                        className="w-full p-4 rounded-2xl text-sm text-gray-700 bg-violet-50/40 border border-violet-100/50 resize-none focus:outline-none focus:ring-2 focus:ring-violet-200/50 leading-relaxed font-medium"
                        rows={4}
                        value={selectedPin.tripNotes ?? ''}
                        placeholder="Itineraries, booking codes, curiosities..."
                        onChange={(e) => updatePin(selectedPin.id, { tripNotes: e.target.value })}
                    />
                </div>
            </div>

            {/* Bottom Gradient Overlay */}
            <div className="h-12 bg-gradient-to-t from-white to-transparent pointer-events-none sticky bottom-0" />
        </div>
    )
}
