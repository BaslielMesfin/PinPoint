import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Mode, Pin } from '../types'
import { samplePins } from '../data/sampleData'

interface PinpointState {
    mode: Mode
    pins: Pin[]
    selectedPin: Pin | null
    isAdding: boolean
    lastClickedCoords: { lat: number; lng: number } | null

    // Actions
    setMode: (mode: Mode) => void
    setSelectedPin: (pin: Pin | null) => void
    setIsAdding: (adding: boolean) => void
    setLastClickedCoords: (coords: { lat: number; lng: number } | null) => void
    addPin: (pin: Pin) => void
    updatePin: (id: string, updates: Partial<Pin>) => void
    deletePin: (id: string) => void
}

export const usePinpointStore = create<PinpointState>()(
    persist(
        (set) => ({
            mode: 'past',
            pins: samplePins,
            selectedPin: null,
            isAdding: false,
            lastClickedCoords: null,

            setMode: (mode) => set({ mode, selectedPin: null, isAdding: false }),
            setSelectedPin: (pin) => set({ selectedPin: pin, isAdding: false }),
            setIsAdding: (adding) => set((s) => ({ isAdding: adding, selectedPin: adding ? null : s.selectedPin })),
            setLastClickedCoords: (coords) => set({ lastClickedCoords: coords }),
            addPin: (pin) => set((s) => ({ pins: [...s.pins, pin], isAdding: false })),
            updatePin: (id, updates) =>
                set((s) => ({
                    pins: s.pins.map((p) => (p.id === id ? { ...p, ...updates } : p)),
                    selectedPin: s.selectedPin?.id === id ? { ...s.selectedPin, ...updates } : s.selectedPin,
                })),
            deletePin: (id) =>
                set((s) => ({
                    pins: s.pins.filter((p) => p.id !== id),
                    selectedPin: s.selectedPin?.id === id ? null : s.selectedPin,
                })),
        }),
        {
            name: 'pinpoint-storage',
            partialize: (state) => ({ pins: state.pins, mode: state.mode }),
        }
    )
)
