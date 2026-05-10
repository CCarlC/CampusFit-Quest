import { createContext, useCallback, useContext, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const ToastCtx = createContext(null)

let id = 0

export function ToastProvider({ children }) {
  const [stack, setStack] = useState([])

  const push = useCallback((toast) => {
    const tid = ++id
    setStack((s) => [...s, { id: tid, ...toast }])
    setTimeout(() => {
      setStack((s) => s.filter((t) => t.id !== tid))
    }, toast.duration || 3600)
  }, [])

  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-3 z-[60] mx-auto flex max-w-[440px] flex-col items-center gap-2 px-3">
        <AnimatePresence>
          {stack.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto relative w-full overflow-hidden border-2 border-ink bg-cream"
              style={{ borderRadius: '3px', boxShadow: '4px 4px 0 0 #0E0B08' }}
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-oxblood" />
              <div className="flex items-center gap-3 py-2 pl-4 pr-3">
                <div className="font-display grid h-9 w-9 shrink-0 place-items-center bg-jersey text-ink text-[18px] font-black" style={{ borderRadius: '2px' }}>
                  {t.icon || '+'}
                </div>
                <div className="min-w-0 flex-1 leading-tight text-ink">
                  <div className="font-display flex items-center gap-2 text-[14px] font-black uppercase tracking-[0.08em]">
                    {t.title || 'VERIFIED'}
                  </div>
                  {t.body && (
                    <div className="font-mono mt-0.5 text-[11px] tracking-wide opacity-80">{t.body}</div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be inside ToastProvider')
  return ctx
}
