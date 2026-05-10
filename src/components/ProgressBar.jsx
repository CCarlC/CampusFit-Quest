import { motion } from 'motion/react'

// Striped athletic progress bar. Hard-edged ticks, no rounded smooth gradients.
export function ProgressBar({ current, max, color = 'oxblood', height = 14, ticks = 6, className = '' }) {
  const pct = Math.max(0, Math.min(1, current / max))
  const fillBg =
    color === 'oxblood' ? 'bg-oxblood'
      : color === 'jersey' ? 'bg-jersey'
      : color === 'mint' ? 'bg-mint'
      : color === 'navy' ? 'bg-navy'
      : 'bg-oxblood'
  return (
    <div className={['relative w-full', className].join(' ')}>
      <div className="relative w-full overflow-hidden border border-ink/80 bg-cream-deep" style={{ height }}>
        <motion.div
          className={[fillBg, 'relative h-full'].join(' ')}
          initial={{ width: 0 }}
          animate={{ width: `${pct * 100}%` }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="absolute inset-0 opacity-30 mix-blend-overlay" style={{
            backgroundImage: 'repeating-linear-gradient(135deg, transparent 0 4px, rgba(255,255,255,0.4) 4px 5px)'
          }} />
        </motion.div>
        {/* Ticks */}
        {Array.from({ length: ticks - 1 }).map((_, i) => (
          <span
            key={i}
            className="absolute top-0 h-full w-px bg-ink/30"
            style={{ left: `${((i + 1) / ticks) * 100}%` }}
          />
        ))}
      </div>
    </div>
  )
}
