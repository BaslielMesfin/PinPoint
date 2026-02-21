import { motion, AnimatePresence } from 'framer-motion'
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
            <div className="flex items-start justify-between p-8 pb-4">
                <div className="flex flex-col gap-1">
                    <button
                        onClick={() => setSelectedPin(null)}
                        className="text-[10px] font-bold uppercase tracking-widest text-violet-500 hover:text-violet-600 transition-colors mb-4"
                    >
                        ← Back to Adventures
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <div className="w-2 h-0.5 rounded-full bg-violet-500" />
                            <span className="text-[10px] uppercase tracking-widest text-violet-500 font-black">Future Trip</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                            {selectedPin.title || selectedPin.city}
                        </h2>
                        <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mt-1">
                            {selectedPin.city}, {selectedPin.country}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => { if (confirm('Cancel this plan?')) { deletePin(selectedPin.id); setSelectedPin(null) } }}
                    className="text-[10px] font-bold uppercase tracking-widest text-red-300 hover:text-red-500 transition-all mt-3"
                >
                    Cancel
                </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-8 space-y-8 pb-12 custom-scrollbar">

                {/* Dates */}
                {(selectedPin.tripStartDate || selectedPin.tripEndDate) && (
                    <div className="bg-violet-50/50 rounded-2xl p-5 border border-violet-100/50">
                        <div className="text-[10px] text-violet-400 font-bold uppercase tracking-widest mb-1.5">Trip Schedule</div>
                        <div className="text-sm text-violet-900 font-black tracking-tight">
                            {selectedPin.tripStartDate && new Date(selectedPin.tripStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            {selectedPin.tripEndDate && ` — ${new Date(selectedPin.tripEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                        </div>
                    </div>
                )}

                {/* Progress bar */}
                {checklist.length > 0 && (
                    <div>
                        <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3 pr-1">
                            <span>Readiness Checklist</span>
                            <span>{doneCount}/{checklist.length} Complete</span>
                        </div>
                        <div className="h-2 bg-violet-100 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full rounded-full"
                                style={{ background: '#8b5cf6' }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>
                )}

                {/* Checklist */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Preparation Tasks</span>
                        <button
                            onClick={addCheckItem}
                            className="text-[10px] text-violet-600 font-black uppercase tracking-widest hover:text-violet-800"
                        >
                            + Add Task
                        </button>
                    </div>
                    <div className="space-y-3">
                        <AnimatePresence initial={false}>
                            {checklist.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    className="flex items-center gap-4 group"
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <button
                                        onClick={() => toggleCheckItem(item.id)}
                                        className={`w-6 h-6 rounded-xl flex items-center justify-center flex-shrink-0 border-2 transition-all duration-200 ${item.done
                                            ? 'bg-violet-500 border-violet-500 shadow-sm'
                                            : 'border-violet-100 bg-white/50 hover:border-violet-300'
                                            }`}
                                    >
                                        {item.done && (
                                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </button>
                                    <input
                                        className={`flex-1 text-sm bg-transparent border-none outline-none transition-all ${item.done ? 'line-through text-gray-300' : 'text-gray-700 font-bold font-display'}`}
                                        value={item.text}
                                        onChange={(e) => updateCheckItem(item.id, e.target.value)}
                                        placeholder="Add mission..."
                                    />
                                    <button
                                        onClick={() => removeCheckItem(item.id)}
                                        className="opacity-0 group-hover:opacity-100 text-red-200 hover:text-red-400 transition-all p-1 text-[10px] font-black uppercase"
                                    >
                                        Remove
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Waypoints */}
                {waypoints.length > 0 && (
                    <div>
                        <div className="mb-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Planned Trajectory</span>
                        </div>
                        <div className="space-y-3">
                            {waypoints.sort((a, b) => a.order - b.order).map((wp, idx) => (
                                <div key={wp.id} className="flex items-center gap-4">
                                    <div className="text-[10px] font-black text-violet-500 w-4">
                                        {String(idx + 1).padStart(2, '0')}
                                    </div>
                                    <span className="text-sm text-gray-700 font-bold font-display">{wp.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Notes */}
                <div>
                    <div className="mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Tactical Notes</span>
                    </div>
                    <textarea
                        className="w-full p-5 rounded-3xl text-sm text-gray-700 bg-violet-50/40 border border-violet-100/50 resize-none focus:outline-none focus:ring-2 focus:ring-violet-200/50 leading-relaxed font-bold font-display"
                        rows={4}
                        value={selectedPin.tripNotes ?? ''}
                        placeholder="Itineraries, booking codes, curiosities..."
                        onChange={(e) => updatePin(selectedPin.id, { tripNotes: e.target.value })}
                    />
                </div>

                {/* Complete Adventure Action */}
                <div className="pt-4">
                    <button
                        onClick={() => usePinpointStore.getState().completeTrip(selectedPin.id)}
                        className="w-full py-4 bg-violet-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-[11px] shadow-lg shadow-violet-500/20 hover:bg-violet-700 hover:scale-[0.98] transition-all"
                    >
                        Complete Adventure
                    </button>
                    <p className="text-center text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-4">
                        Transform this plan into a permanent memory
                    </p>
                </div>
            </div>

            {/* Bottom Gradient Overlay */}
            <div className="h-12 bg-gradient-to-t from-white to-transparent pointer-events-none sticky bottom-0" />
        </div>
    )
}
