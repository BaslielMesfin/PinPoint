import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Upload } from 'lucide-react'
import { Photo } from '../../types'

interface PolaroidCardProps {
    photo: Photo
    index: number
    total: number
    stackOffset: number
    isActive: boolean
    onClick: () => void
}

function PolaroidCard({ photo, index, total, stackOffset, isActive, onClick }: PolaroidCardProps) {
    const rotation = (index - Math.floor(total / 2)) * 5.5
    const xOffset = (index - Math.floor(total / 2)) * stackOffset
    const yOffset = Math.abs(index - Math.floor(total / 2)) * 3

    return (
        <motion.div
            className="polaroid absolute cursor-pointer select-none"
            style={{ width: 240, originX: 0.5, originY: 1 }}
            initial={{ rotate: rotation, x: 0, y: 0, scale: 0.9, opacity: 0 }}
            animate={{
                rotate: isActive ? 0 : rotation,
                x: isActive ? 0 : xOffset,
                y: isActive ? -20 : yOffset,
                scale: isActive ? 1.05 : 1,
                opacity: 1,
                zIndex: isActive ? 10 : index,
            }}
            whileHover={!isActive ? { scale: 1.06, y: yOffset - 8, zIndex: 15 } : {}}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            onClick={onClick}
        >
            <div className="w-full aspect-[4/3] rounded-sm overflow-hidden mb-1 bg-gray-100">
                <img
                    src={photo.url}
                    alt={photo.caption || 'Memory'}
                    className="w-full h-full object-cover"
                    draggable={false}
                />
            </div>
            {photo.caption && (
                <p className="font-handwriting text-lg text-gray-700 text-center mt-2 leading-tight">
                    {photo.caption}
                </p>
            )}
            {photo.dateTaken && (
                <p className="text-[10px] text-gray-400 text-center mt-0.5 uppercase tracking-widest">
                    {new Date(photo.dateTaken).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
            )}
        </motion.div>
    )
}

// ── Full-screen expanded Polaroid ─────────────────────────────────────────────
interface ExpandedPhotoProps {
    photo: Photo
    onClose: () => void
    onPrev: () => void
    onNext: () => void
    hasPrev: boolean
    hasNext: boolean
}

function ExpandedPhoto({ photo, onClose, onPrev, onNext, hasPrev, hasNext }: ExpandedPhotoProps) {
    const x = useMotionValue(0)
    const rotateVal = useTransform(x, [-300, 0, 300], [-8, 0, 8])

    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.x > 80 && hasPrev) onPrev()
        else if (info.offset.x < -80 && hasNext) onNext()
    }

    return (
        <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <button
                onClick={onClose}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-gray-600 hover:bg-white shadow-lg transition-all hover:scale-110"
            >
                <X size={18} />
            </button>

            {hasPrev && (
                <button onClick={onPrev} className="absolute left-6 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-gray-600 hover:bg-white shadow-lg transition-all hover:scale-110">
                    <ChevronLeft size={18} />
                </button>
            )}
            {hasNext && (
                <button onClick={onNext} className="absolute right-6 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-gray-600 hover:bg-white shadow-lg transition-all hover:scale-110">
                    <ChevronRight size={18} />
                </button>
            )}

            <motion.div
                className="polaroid"
                style={{ width: 380, x, rotate: rotateVal }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            >
                <div className="w-full aspect-[4/3] rounded-sm overflow-hidden bg-gray-100">
                    <img src={photo.url} alt={photo.caption || 'Memory'} className="w-full h-full object-cover" />
                </div>
                {photo.caption && (
                    <p className="font-handwriting text-2xl text-gray-700 text-center mt-3">{photo.caption}</p>
                )}
                {photo.dateTaken && (
                    <p className="text-xs text-gray-400 text-center mt-1 uppercase tracking-widest">
                        {new Date(photo.dateTaken).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                )}
            </motion.div>
        </motion.div>
    )
}

// ── Main Polaroid Stack ────────────────────────────────────────────────────────
interface PolaroidStackProps {
    photos: Photo[]
    onAddPhoto?: (files: FileList) => void
}

export default function PolaroidStack({ photos, onAddPhoto }: PolaroidStackProps) {
    const [activeIdx, setActiveIdx] = useState<number | null>(null)
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null)
    const STACK_OFFSET = 36

    const handleCardClick = (idx: number) => {
        if (activeIdx === idx) {
            setExpandedIdx(idx)
        } else {
            setActiveIdx(idx)
        }
    }

    return (
        <div className="relative flex items-center justify-center" style={{ height: 340 }}>
            {photos.map((photo, i) => (
                <PolaroidCard
                    key={photo.id}
                    photo={photo}
                    index={i}
                    total={photos.length}
                    stackOffset={STACK_OFFSET}
                    isActive={activeIdx === i}
                    onClick={() => handleCardClick(i)}
                />
            ))}

            {/* Upload button */}
            {onAddPhoto && (
                <label className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-white cursor-pointer shadow-lg hover:bg-amber-600 transition-all hover:scale-110">
                    <Upload size={15} />
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={(e) => e.target.files && onAddPhoto(e.target.files)}
                    />
                </label>
            )}

            {/* Un-select on background click */}
            {activeIdx !== null && (
                <div className="absolute inset-0 cursor-pointer" style={{ zIndex: -1 }} onClick={() => setActiveIdx(null)} />
            )}

            {/* Expanded view */}
            <AnimatePresence>
                {expandedIdx !== null && (
                    <ExpandedPhoto
                        photo={photos[expandedIdx]}
                        onClose={() => setExpandedIdx(null)}
                        onPrev={() => setExpandedIdx((i) => Math.max(0, (i ?? 0) - 1))}
                        onNext={() => setExpandedIdx((i) => Math.min(photos.length - 1, (i ?? 0) + 1))}
                        hasPrev={expandedIdx > 0}
                        hasNext={expandedIdx < photos.length - 1}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}
