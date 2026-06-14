'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { prefersReducedMotion } from '@/lib/utils'

interface CountUpProps {
  end: number
  duration?: number
  suffix?: string
  isDecimal?: boolean
  decimals?: number
}

export function CountUp({
  end,
  duration = 1800,
  suffix = '',
  isDecimal = false,
  decimals = 1,
}: CountUpProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isInView || hasAnimated.current) return
    if (prefersReducedMotion()) {
      setCount(end)
      return
    }

    hasAnimated.current = true
    const startTime = performance.now()

    function easeOut(t: number): number {
      return 1 - Math.pow(1 - t, 3)
    }

    function update(currentTime: number) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOut(progress)
      setCount(easedProgress * end)
      if (progress < 1) requestAnimationFrame(update)
    }

    requestAnimationFrame(update)
  }, [isInView, end, duration])

  const display = isDecimal
    ? count.toFixed(decimals)
    : Math.round(count).toLocaleString('id-ID')

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  )
}
