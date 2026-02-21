import { motion } from 'framer-motion'
import { X, MapPin, Calendar, FileText, Trash2 } from 'lucide-react'
import { usePinpointStore } from '../../store/usePinpointStore'
import PolaroidStack from './PolaroidStack'
import { Photo } from '../../types'
import { nanoid } from '../utils/nanoid'

export default function MemoryPanel() {
    const { selectedPin, setSelectedPin, updatePin, deletePin } = usePinpointStore()

    if (!selectedPin || selectedPin.mode !== 'past') return null

    const handleAddPhotos = (files: FileList) => {
        const readers: Promise<Photo>[] = Array.from(files).map(
            (file) =>
                new Promise((resolve) => {
                    const reader = new FileReader()
                    reader.onload = (e) => {
                        resolve({
                            id: nanoid(),
                            url: e.target?.result as string,
                            caption: file.name.replace(/\.[^/.]+$/, ''),
                            dateTaken: new Date().toISOString().split('T')[0],
                        })
                    }
                    reader.readAsDataURL(file)
                })
        )
        Promise.all(readers).then((newPhotos) => {
            updatePin(selectedPin.id, {
                photos: [...(selectedPin.photos ?? []), ...newPhotos],
            })
        })
    }

    return (
        <motion.div
            key={selectedPin.id}
            className="absolute left-6 top-6 bottom-6 z-40 flex flex-col overflow-hidden rounded-[2.5rem] border border-white/50"
            style={{
                width: 420,
                background: 'rgba(255, 248, 230, 0.85)',
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
                        <div className="w-2 h-2 rounded-full bg-amber-400 shadow" style={{ boxShadow: '0 0 6px #f59e0b' }} />
                        <span className="text-xs uppercase tracking-widest text-amber-500 font-semibold">Past Memory</span>
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

            {/* Visit date */}
            {selectedPin.visitedDate && (
                <div className="mx-6 mb-4 flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={14} className="text-amber-400" />
                    {new Date(selectedPin.visitedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            )}

            {/* Polaroid Gallery */}
            <div className="px-6 flex-shrink-0">
                {(selectedPin.photos?.length ?? 0) > 0 ? (
                    <PolaroidStack photos={selectedPin.photos!} onAddPhoto={handleAddPhotos} />
                ) : (
                    <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-amber-200 rounded-xl bg-amber-50 cursor-pointer hover:bg-amber-100 transition-colors">
                        <span className="text-amber-400 text-sm font-medium">+ Add photos</span>
                        <span className="text-xs text-amber-300 mt-1">Click or drag & drop</span>
                        <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => e.target.files && handleAddPhotos(e.target.files)} />
                    </label>
                )}
            </div>

            {/* Memory note */}
            <div className="flex-1 overflow-y-auto p-6 pt-4 space-y-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <FileText size={14} className="text-amber-400" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Memory Note</span>
                    </div>
                    <textarea
                        className="w-full p-3 rounded-xl text-sm text-gray-700 bg-amber-50/60 border border-amber-100 resize-none focus:outline-none focus:ring-2 focus:ring-amber-200 font-handwriting text-base leading-relaxed"
                        rows={4}
                        value={selectedPin.memoryNote ?? ''}
                        placeholder="Write your memory here..."
                        onChange={(e) => updatePin(selectedPin.id, { memoryNote: e.target.value })}
                    />
                </div>
            </div>

            {/* Gradient fade bottom */}
            <div className="h-4 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </motion.div>
    )
}
