import { ReactNode } from 'react'
import { MapPin, Plus, Globe } from 'lucide-react'
import { usePinpointStore } from '../../store/usePinpointStore'
import ModeToggle from '../ModeToggle/ModeToggle'

interface AppShellProps {
    children: ReactNode
}

export default function AppShell({ children }: AppShellProps) {
    const { mode, setShowAddModal } = usePinpointStore()

    const headerBg = mode === 'past'
        ? 'bg-white/90 border-amber-100'
        : 'bg-white/90 border-violet-100'

    const meshGradient = mode === 'past'
        ? 'radial-gradient(at 0% 0%, #fef3c7 0%, transparent 50%), radial-gradient(at 100% 100%, #fff7ed 0%, transparent 50%), #f8f5f0'
        : 'radial-gradient(at 0% 0%, #ede9fe 0%, transparent 50%), radial-gradient(at 100% 100%, #f5f3ff 0%, transparent 50%), #fafafa'

    return (
        <div
            className="flex flex-col h-screen w-screen transition-all duration-1000 overflow-hidden"
            style={{ background: meshGradient }}
        >
            {/* ── Header ─────────────────────────────────────────────── */}
            <header className={`
        relative z-50 flex items-center justify-between px-10 h-20
        border-b border-white/20 backdrop-blur-md ${headerBg}
        shadow-sm transition-all duration-500
      `}>
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transform rotate-3"
                        style={{
                            background: mode === 'past'
                                ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                                : 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                        }}
                    >
                        <MapPin size={20} className="text-white" />
                    </div>
                    <span className="font-display text-3xl tracking-tighter text-gray-900">
                        Pin<span style={{ color: mode === 'past' ? '#f59e0b' : '#8b5cf6' }}>point</span>
                    </span>
                </div>

                {/* Center — Mode toggle */}
                <div className="absolute left-1/2 -translate-x-1/2">
                    <ModeToggle />
                </div>

                {/* Right — Actions */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105 active:scale-95"
                        style={{
                            background: mode === 'past'
                                ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                                : 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                        }}
                    >
                        <Plus size={16} />
                        Add Pin
                    </button>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs font-bold text-gray-600 cursor-pointer hover:scale-105 transition-transform">
                        <Globe size={14} />
                    </div>
                </div>
            </header>

            {/* ── Main content ───────────────────────────────────────── */}
            <main className="flex-1 relative overflow-hidden">
                {children}
            </main>
        </div>
    )
}
