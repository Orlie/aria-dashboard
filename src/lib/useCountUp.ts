import { useState, useEffect, useRef } from 'react'

export function useCountUp(target: number, duration = 600): number {
  const [current, setCurrent] = useState(target)
  const prevTarget = useRef(target)
  const frameRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const start = prevTarget.current
    const end = target
    prevTarget.current = target

    if (start === end) {
      setCurrent(end)
      return
    }

    const startTime = performance.now()

    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const value = start + (end - start) * eased

      setCurrent(value)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [target, duration])

  return current
}
