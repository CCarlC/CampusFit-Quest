import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Avatar } from './Avatar.jsx'

// iOS-style push banner — slides down from top status bar.
// Used to mock the "Lily just verified" push that re-engages the user.
export function PushNotification({ push, onDismiss }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (push) {
      setVisible(true)
      const t = setTimeout(() => setVisible(false), 5800)
      return () => clearTimeout(t)
    }
  }, [push])

  return (
    <AnimatePresence onExitComplete={() => onDismiss?.()}>
      {visible && push && (
        <motion.div
          initial={{ y: -110, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -110, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          className="pointer-events-auto fixed inset-x-0 top-2 z-[55] mx-auto max-w-[420px] px-3"
          onClick={() => setVisible(false)}
        >
          <div
            className="relative grid grid-cols-[auto_1fr_auto] items-center gap-3 overflow-hidden border border-ink/15 bg-ink/85 px-3 py-2 text-cream backdrop-blur-md"
            style={{ borderRadius: '14px' }}
          >
            <Avatar name={push.icon} color={push.color || 'jersey'} size={32} />
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5 text-[12px] font-semibold leading-none">
                <span>CampusFit Quest</span>
                <span className="font-mono text-[9px] tracking-[0.18em] text-cream/50">· now</span>
              </div>
              <div className="mt-1 truncate text-[13px] leading-tight text-cream/90">
                <b className="font-semibold">{push.from}</b> {push.body}
              </div>
            </div>
            <span className="font-mono text-[9px] tracking-[0.2em] text-cream/40">DORM {push.dorm}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
