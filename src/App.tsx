import { Suspense, lazy, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AppShell from './components/Layout/AppShell'
import { usePinpointStore } from './store/usePinpointStore'
import MemoryPanel from './components/PastMode/MemoryPanel'
import TripPlanner from './components/FutureMode/TripPlanner'
import AddPinModal from './components/AddPin/AddPinModal'
import LocationSidebar from './components/Sidebar/LocationSidebar'

// Lazy-load the heavy Globe component
const GlobeView = lazy(() => import('./components/Globe/GlobeView'))

function GlobeErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<string>('')

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50/50 backdrop-blur-sm">
        <div className="text-center space-y-4 max-w-md p-8 bg-white rounded-3xl shadow-xl border border-red-100">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center text-red-500 text-2xl">!</div>
          <div className="space-y-1">
            <p className="font-display text-xl text-gray-900">Globe failed to rendezvous</p>
            <p className="text-sm text-gray-500 leading-relaxed px-4">{error}</p>
          </div>
          <button
            onClick={() => { setHasError(false); setError(''); }}
            className="px-6 py-2.5 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            Reconnect Satellite
          </button>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundaryWrapper onError={(e) => { setHasError(true); setError(e); }}>
      {children}
    </ErrorBoundaryWrapper>
  )
}

// Class-based error boundary wrapper
import { Component, ErrorInfo, ReactNode } from 'react'

interface EBProps {
  onError: (msg: string) => void
  children: ReactNode
}

class ErrorBoundaryWrapper extends Component<EBProps, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, _info: ErrorInfo) {
    this.props.onError(error.message)
  }

  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

function App() {
  const { mode, selectedPin } = usePinpointStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <AppShell>
      <div className="flex w-full h-full p-6 gap-6 overflow-hidden">
        {/* ── Left: Globe Content (Floating Card) ────────────────── */}
        <div className="flex-1 relative overflow-hidden rounded-[2.5rem] bg-white/20 border border-white/40 shadow-xl">
          {mounted && (
            <GlobeErrorBoundary>
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center bg-white/10 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                    <p className="text-amber-600 font-display text-lg animate-pulse">Launching Globe...</p>
                  </div>
                </div>
              }>
                <GlobeView />
              </Suspense>
            </GlobeErrorBoundary>
          )}

          {/* Mode hint toast */}
          <AnimatePresence>
            {!selectedPin && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/80 backdrop-blur-md rounded-full border border-white/40 shadow-lg z-20"
              >
                <p className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  Select a destination to explore
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Overlay Panels (Slides over globe area) ───────────── */}
          <AnimatePresence mode="wait">
            {selectedPin?.mode === 'past' && <MemoryPanel key={`memory-${selectedPin.id}`} />}
            {selectedPin?.mode === 'future' && <TripPlanner key={`trip-${selectedPin.id}`} />}
          </AnimatePresence>
          {/* ── Mode hint toast ─────────────────────────────────────── */}
          <div
            className="absolute bottom-8 left-8 px-5 py-2.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-gray-600 pointer-events-none z-20 shadow-lg border border-white/30"
            style={{
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {mode === 'past' ? '🟠 Discovering Past Memories' : '🟣 Planning Future Escapes'}
          </div>
        </div>

        {/* ── Right: List Sidebar ─────────────────────────────────── */}
        <div className="w-[45%] h-full shrink-0 z-30 p-6 pl-0">
          <LocationSidebar />
        </div>
      </div>

      {/* ── Modals ────────────────────────────────────────── */}
      <AddPinModal />
    </AppShell>
  )
}

export default App
