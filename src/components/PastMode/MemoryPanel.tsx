import { ChevronLeft, MapPin, Calendar, FileText, Trash2 } from 'lucide-react'
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
        <div className="w-full h-full flex flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/95 backdrop-blur-3xl shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between p-6 pb-4">
                <div className="flex flex-col gap-1">
                    <button
                        onClick={() => setSelectedPin(null)}
                        className="flex items-center gap-1 text-amber-500 hover:text-amber-600 transition-colors mb-2 -ml-1"
                    >
                        <ChevronLeft size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Back to memories</span>
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span className="text-[10px] uppercase tracking-widest text-amber-500 font-bold">Past Memory</span>
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
                    onClick={() => { if (confirm('Erase this memory?')) { deletePin(selectedPin.id); setSelectedPin(null) } }}
                    className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center text-red-300 hover:text-red-500 transition-all"
                >
                    <Trash2 size={15} />
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-6 custom-scrollbar">
                {/* Visit date */}
                {selectedPin.visitedDate && (
                    <div className="flex items-center gap-2 mb-6 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        <Calendar size={12} className="text-amber-400" />
                        Captured on {new Date(selectedPin.visitedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                )}

                {/* Polaroid Gallery */}
                <div className="mb-8">
                    {(selectedPin.photos?.length ?? 0) > 0 ? (
                        <PolaroidStack photos={selectedPin.photos!} onAddPhoto={handleAddPhotos} />
                    ) : (
                        <label className="flex flex-col items-center justify-center h-48 border border-dashed border-amber-200 rounded-3xl bg-amber-50/30 cursor-pointer hover:bg-amber-50/50 transition-colors">
                            <span className="text-amber-500 text-[11px] font-black uppercase tracking-[0.2em]">+ Add Photos</span>
                            <span className="text-[9px] text-amber-300 mt-2 uppercase tracking-widest font-bold">Import your archives</span>
                            <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => e.target.files && handleAddPhotos(e.target.files)} />
                        </label>
                    )}
                </div>

                {/* Memory note */}
                <div className="pb-12 space-y-4">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <FileText size={14} className="text-amber-400" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Captured Thoughts</span>
                        </div>
                        <textarea
                            className="w-full p-6 rounded-3xl text-sm text-gray-700 bg-amber-50/40 border border-amber-100/50 resize-none focus:outline-none focus:ring-2 focus:ring-amber-200/50 font-handwriting text-base leading-[2] shadow-inner shadow-amber-900/5"
                            rows={8}
                            value={selectedPin.memoryNote ?? ''}
                            placeholder="Tell the story of this place..."
                            onChange={(e) => updatePin(selectedPin.id, { memoryNote: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Gradient Overlay */}
            <div className="h-12 bg-gradient-to-t from-white to-transparent pointer-events-none sticky bottom-0" />
        </div>
    )
}
