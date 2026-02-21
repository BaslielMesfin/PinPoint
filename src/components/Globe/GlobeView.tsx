import Globe from 'react-globe.gl'
import { useRef, useEffect, useCallback, useState } from 'react'
import { usePinpointStore } from '../../store/usePinpointStore'
import type { Pin } from '../../types'

const PAST_PIN_COLOR = '#f59e0b'
const FUTURE_PIN_COLOR = '#8b5cf6'

function getPinColor(pin: Pin) {
    return pin.mode === 'past' ? PAST_PIN_COLOR : FUTURE_PIN_COLOR
}

export default function GlobeView() {
    const globeEl = useRef<any>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const { mode, pins, setSelectedPin, selectedPin } = usePinpointStore()
    const selectedPinRef = useRef(selectedPin)   // always up-to-date in closures

    const [dimensions, setDimensions] = useState({
        width: 800,
        height: 600,
    })

    // Keep ref in sync
    useEffect(() => { selectedPinRef.current = selectedPin }, [selectedPin])

    const visiblePins = pins.filter((p) => p.mode === mode)
    const atmosphereColor = mode === 'past' ? '#f59e0b' : '#8b5cf6'

    // Handle container-based resizing
    useEffect(() => {
        if (!containerRef.current) return

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect
                setDimensions({ width, height })
            }
        })

        resizeObserver.observe(containerRef.current)
        return () => resizeObserver.disconnect()
    }, [])

    // Globe controls after ready
    const handleGlobeReady = useCallback(() => {
        setTimeout(() => {
            if (!globeEl.current) return
            const controls = globeEl.current.controls()
            if (controls) {
                controls.autoRotate = true
                controls.autoRotateSpeed = 0.5
                controls.enableZoom = true
                controls.minDistance = 180
                controls.maxDistance = 500
            }
            globeEl.current.pointOfView({ lat: 20, lng: 10, altitude: 2.2 }, 1200)
        }, 400)
    }, [])

    // Pause/resume auto-rotate based on selection + Camera Centering
    useEffect(() => {
        if (!globeEl.current) return
        const controls = globeEl.current.controls()
        if (controls) {
            controls.autoRotate = !selectedPin
        }

        if (selectedPin) {
            // Smoothly fly to the selected location
            globeEl.current.pointOfView({
                lat: selectedPin.lat,
                lng: selectedPin.lng,
                altitude: 1.8
            }, 1000)
        }
    }, [selectedPin])

    const handlePinClick = useCallback(
        (point: object) => setSelectedPin(point as Pin),
        [setSelectedPin]
    )

    // Build DOM-element pin labels
    const createPinElement = useCallback(
        (d: object): HTMLElement => {
            const pin = d as Pin
            const color = getPinColor(pin)

            const container = document.createElement('div')
            container.style.cssText = `
                pointer-events: auto;
                user-select: none;
                z-index: 10;
            `

            const content = document.createElement('div')
            content.style.cssText = `
                display: flex;
                align-items: center;
                gap: 6px;
                background: white;
                border: 2px solid ${color};
                border-radius: 999px;
                padding: 4px 12px 4px 6px;
                box-shadow: 0 4px 12px ${color}33;
                white-space: nowrap;
                cursor: pointer;
                transform: translate(-50%, -100%) translateY(-10px);
                transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.2s ease;
                font-family: Brolimo, Inter, sans-serif;
            `

            const stopAll = (e: Event) => e.stopPropagation()
            container.addEventListener('mousedown', stopAll)
            container.addEventListener('pointerdown', stopAll)
            container.addEventListener('touchstart', stopAll)

            container.addEventListener('mouseenter', () => {
                const controls = globeEl.current?.controls()
                if (controls) controls.autoRotate = false
                content.style.transform = 'translate(-50%, -100%) translateY(-14px) scale(1.08)'
                content.style.boxShadow = `0 8px 24px ${color}66`
                content.style.zIndex = '20'
            })

            container.addEventListener('mouseleave', () => {
                const controls = globeEl.current?.controls()
                if (controls && !selectedPinRef.current) controls.autoRotate = true
                content.style.transform = 'translate(-50%, -100%) translateY(-10px) scale(1)'
                content.style.boxShadow = `0 4px 12px ${color}33`
                content.style.zIndex = '10'
            })

            container.addEventListener('click', (e) => {
                e.stopPropagation()
                setSelectedPin(pin)
            })

            const dotWrap = document.createElement('div')
            dotWrap.style.cssText = 'position:relative;width:10px;height:10px;flex-shrink:0;'

            const pulse = document.createElement('div')
            pulse.style.cssText = `
                position:absolute;inset:-3px;border-radius:50%;background:${color};
                opacity:0.35;animation:pp-pulse 2s ease-out infinite;
                pointer-events: none;
            `
            const dot = document.createElement('div')
            dot.style.cssText = `
                position:absolute;inset:0;border-radius:50%;background:${color};
            `
            dotWrap.appendChild(pulse)
            dotWrap.appendChild(dot)

            const city = document.createElement('span')
            city.style.cssText = 'font-size:13px;font-weight:700;color:#1c1917;'
            city.textContent = pin.city

            const country = document.createElement('span')
            country.style.cssText = 'font-size:11px;color:#78716c;font-weight:500;'
            country.textContent = pin.country

            content.appendChild(dotWrap)
            content.appendChild(city)
            content.appendChild(country)
            container.appendChild(content)

            return container
        },
        [setSelectedPin]
    )

    const ringsData = selectedPin ? [selectedPin] : []

    return (
        <div ref={containerRef} className="globe-container w-full h-full relative">
            {/* Pulse keyframe, injected once */}
            <style>{`
                @keyframes pp-pulse {
                  0%   { transform:scale(1); opacity:0.45; }
                  70%  { transform:scale(2.8); opacity:0; }
                  100% { transform:scale(2.8); opacity:0; }
                }
            `}</style>

            <Globe
                ref={globeEl}
                width={dimensions.width}
                height={dimensions.height}
                backgroundColor="rgba(0,0,0,0)"
                waitForGlobeReady
                animateIn
                onGlobeReady={handleGlobeReady}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
                showAtmosphere
                atmosphereColor={atmosphereColor}
                atmosphereAltitude={0.18}
                pointsData={visiblePins}
                pointLat={(d) => (d as Pin).lat}
                pointLng={(d) => (d as Pin).lng}
                pointColor={(d) => getPinColor(d as Pin)}
                pointAltitude={0.02}
                pointRadius={0.7}
                pointsMerge={false}
                onPointClick={handlePinClick}
                htmlElementsData={visiblePins}
                htmlLat={(d) => (d as Pin).lat}
                htmlLng={(d) => (d as Pin).lng}
                htmlAltitude={0.04}
                htmlElement={createPinElement}
                ringsData={ringsData}
                ringLat={(d) => (d as Pin).lat}
                ringLng={(d) => (d as Pin).lng}
                ringColor={() => (mode === 'past' ? '#f59e0bbb' : '#8b5cf6bb')}
                ringMaxRadius={5}
                ringPropagationSpeed={2.5}
                ringRepeatPeriod={700}
            />
        </div>
    )
}
