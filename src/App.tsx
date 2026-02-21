import { Suspense, lazy, useState, useEffect, useLayoutEffect, Component, ErrorInfo, ReactNode } from 'react'
import { AnimatePresence, motion as m } from 'framer-motion'
import AppShell from './components/Layout/AppShell'
import { usePinpointStore } from './store/usePinpointStore'
import MemoryPanel from './components/PastMode/MemoryPanel'
import TripPlanner from './components/FutureMode/TripPlanner'
import LocationSidebar from './components/Sidebar/LocationSidebar'
import AddPinPanel from './components/AddPin/AddPinPanel'

// Lazy-load the heavy Globe component
const GlobeView = lazy(() => import('./components/Globe/GlobeView'))

function GlobeErrorBoundary({ children }: { children: ReactNode }) {
  const [hasError, setHasError] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string>('')

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50/50 backdrop-blur-sm">
        <div className="text-center space-y-4 max-w-md p-8 bg-white rounded-3xl shadow-xl border border-red-100">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center text-red-500 text-2xl">!</div>
          <div className="space-y-1">
            <p className="font-display text-xl text-gray-900">Globe failed to rendezvous</p>
            <p className="text-sm text-gray-500 leading-relaxed px-4">{errorMsg}</p>
          </div>
          <button
            onClick={() => { setHasError(false); setErrorMsg(''); }}
            className="px-6 py-2.5 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            Reconnect Satellite
          </button>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundaryWrapper onError={(e) => { setHasError(true); setErrorMsg(e); }}>
      {children}
    </ErrorBoundaryWrapper>
  )
}

// Class-based error boundary wrapper
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
  const { mode, selectedPin, isAdding } = usePinpointStore()
  const [mounted, setMounted] = useState(false)

  // Use useLayoutEffect for hydration-friendly state setting
  useLayoutEffect(() => {
    setMounted(true)
  }, [])

  return (
    <AppShell>
      <div className="relative w-full h-full overflow-hidden">
        {/* ── Background: Globe Content (Full Screen, Shifted Left) ────────────── */}
        <div className="absolute inset-0 right-[20%] left-[-10%] z-0">
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
        </div>

        {/* ── Foreground: HUD Elements (Overlays) ────────────────── */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div
            className="absolute bottom-8 left-8 px-5 py-2.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-gray-600 pointer-events-none z-20 shadow-lg border border-white/30"
            style={{
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {mode === 'past' ? 'Discovering Past Memories' : 'Planning Future Escapes'}
          </div>
        </div>

        {/* ── Right Panel Stack: Navigation HUD ─────────────────────── */}
        <div className="absolute top-6 right-6 bottom-6 w-[440px] z-30 pointer-events-auto">
          <AnimatePresence mode="wait">
            {isAdding ? (
              <m.div
                key="add-panel"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full"
              >
                <AddPinPanel />
              </m.div>
            ) : !selectedPin ? (
              <m.div
                key="sidebar-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full"
              >
                <LocationSidebar />
              </m.div>
            ) : (
              <m.div
                key={`detail-${selectedPin.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full"
              >
                {selectedPin.mode === 'past' ? <MemoryPanel /> : <TripPlanner />}
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppShell>
  )
}

export default App

