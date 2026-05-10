import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const STAGES = ['idle', 'reading', 'verified']

const READING_LINES = [
  'Connecting to HealthKit…',
  'Reading step count…',
  'Reading active minutes…',
  'Cross-checking heart rate…',
  'Stamping signature…',
]

// VerifyButton: the differentiating UX moment.
// Click → 1.5s mock HealthKit read → reveals steps & minutes → onVerified callback.
export function VerifyButton({
  taskMinutes = 20,
  variant = 'primary', // primary | compact
  onVerified,
  onReadStart,
  disabled = false,
  label = 'VERIFY WORKOUT',
}) {
  const [stage, setStage] = useState('idle')
  const [lineIdx, setLineIdx] = useState(0)
  const [steps, setSteps] = useState(0)
  const [minutes, setMinutes] = useState(0)

  const handleClick = () => {
    if (stage !== 'idle' || disabled) return
    setStage('reading')
    onReadStart?.()
    // Cycle reading lines while we wait.
    let i = 0
    const tick = setInterval(() => {
      i += 1
      setLineIdx(i % READING_LINES.length)
    }, 320)
    setTimeout(() => {
      clearInterval(tick)
      const generatedSteps = 1400 + Math.floor(Math.random() * 600)
      const generatedMinutes = taskMinutes + Math.floor(Math.random() * 4)
      setSteps(generatedSteps)
      setMinutes(generatedMinutes)
      setStage('verified')
      // Bubble up after a beat so the user reads the result.
      setTimeout(() => {
        onVerified?.({ steps: generatedSteps, minutes: generatedMinutes })
      }, 700)
    }, 1500)
  }

  const isCompact = variant === 'compact'

  return (
    <div className={isCompact ? 'w-full' : 'w-full'}>
      <AnimatePresence mode="wait">
        {stage === 'idle' && (
          <motion.button
            key="idle"
            type="button"
            onClick={handleClick}
            disabled={disabled}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={[
              'relative w-full overflow-hidden border-2 border-ink bg-jersey text-ink',
              'font-display font-black uppercase tracking-[0.08em]',
              isCompact ? 'px-3 py-2 text-[13px]' : 'px-4 py-3.5 text-[18px]',
              'stamp-press disabled:opacity-50',
            ].join(' ')}
            style={{ borderRadius: '3px', boxShadow: '4px 4px 0 0 #0E0B08' }}
          >
            <span className="relative z-[1] flex items-center justify-center gap-2">
              <span aria-hidden className="font-mono text-[11px]">▶</span>
              {label}
            </span>
            <span className="halftone pointer-events-none absolute inset-0 text-jersey-deep opacity-30" />
          </motion.button>
        )}

        {stage === 'reading' && (
          <motion.div
            key="reading"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={[
              'relative flex w-full items-center gap-3 overflow-hidden border-2 border-ink bg-ink text-cream',
              isCompact ? 'px-3 py-2.5' : 'px-4 py-3.5',
            ].join(' ')}
            style={{ borderRadius: '3px' }}
          >
            <Spinner />
            <div className="min-w-0 flex-1 leading-tight">
              <div className="font-display flex items-center gap-2 text-[14px] font-black uppercase tracking-[0.1em]">
                <span className="text-jersey">HEALTHKIT</span>
                <span className="font-mono text-[10px] opacity-60">READ</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={lineIdx}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  className="font-mono truncate text-[11px] tracking-wide opacity-80"
                  transition={{ duration: 0.18 }}
                >
                  {READING_LINES[lineIdx]}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {stage === 'verified' && (
          <motion.div
            key="verified"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={[
              'relative flex w-full items-center gap-3 overflow-hidden border-2 border-ink bg-mint text-ink',
              isCompact ? 'px-3 py-2.5' : 'px-4 py-3.5',
            ].join(' ')}
            style={{ borderRadius: '3px' }}
          >
            <div
              className="font-display grid h-9 w-9 shrink-0 place-items-center bg-ink text-mint text-[18px] font-black"
              style={{ borderRadius: '3px' }}
            >
              ✓
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="font-display flex items-center gap-2 text-[14px] font-black uppercase tracking-[0.1em]">
                <span>VERIFIED</span>
                <span className="font-mono text-[10px] opacity-70">HEALTHKIT</span>
              </div>
              <div className="font-mono mt-0.5 flex items-center gap-3 text-[11px] tracking-wide">
                <span><b className="font-bold tabular-nums">{steps.toLocaleString()}</b> steps</span>
                <span className="opacity-60">·</span>
                <span><b className="font-bold tabular-nums">{minutes}</b> min</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Spinner() {
  return (
    <div className="relative h-9 w-9 shrink-0">
      <span className="animate-ring absolute inset-0 border-2 border-jersey border-t-transparent" style={{ borderRadius: '50%' }} />
      <span className="absolute inset-1.5 bg-jersey/20" style={{ borderRadius: '50%' }} />
    </div>
  )
}
