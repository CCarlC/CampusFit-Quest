import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useStore } from '../lib/store.jsx'
import { useI18n } from '../lib/i18n.jsx'

// Tiny floating debug console — lets the reviewer reset state, switch language,
// and trigger demo events without fighting localStorage.
export function DemoConsole({ onTriggerPush, onJumpToOnboarding }) {
  const [open, setOpen] = useState(false)
  const { actions } = useStore()
  const { t, locale, setLocale } = useI18n()

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[78px] z-40 mx-auto flex max-w-[440px] justify-end px-3 md:bottom-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-auto mr-2 flex flex-col gap-1 self-end border-2 border-ink bg-paper p-2 text-ink"
            style={{ borderRadius: '3px', boxShadow: '4px 4px 0 0 #0E0B08' }}
          >
            <div className="font-mono mb-0.5 px-1 py-0.5 text-[8.5px] tracking-[0.22em] text-ink/45 uppercase">
              {t('demo.lang')}
            </div>
            <div className="grid grid-cols-2 gap-1 px-0.5">
              <LangBtn active={locale === 'en'} onClick={() => setLocale('en')} label={t('demo.lang.en')} />
              <LangBtn active={locale === 'zh'} onClick={() => setLocale('zh')} label={t('demo.lang.zh')} />
            </div>
            <div className="my-1 h-px bg-ink/15" />
            <ConsoleBtn
              onClick={() => {
                onJumpToOnboarding?.()
                actions.resetFresh()
                setOpen(false)
              }}
              tag="01"
              label={t('demo.action.onboarding')}
            />
            <ConsoleBtn
              onClick={() => {
                actions.resetDemo()
                setOpen(false)
              }}
              tag="02"
              label={t('demo.action.reset')}
            />
            <ConsoleBtn
              onClick={() => {
                onTriggerPush?.()
                setOpen(false)
              }}
              tag="03"
              label={t('demo.action.push')}
            />
            <div className="font-mono mt-1 px-1 py-0.5 text-[8.5px] tracking-[0.18em] text-ink/40 uppercase">
              {t('demo.storage')}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((v) => !v)}
        className="font-mono pointer-events-auto self-end border-2 border-ink bg-ink px-2 py-1 text-[10px] tracking-[0.22em] text-jersey uppercase"
        style={{ borderRadius: '3px', boxShadow: '3px 3px 0 0 #7B1E1E' }}
      >
        {open ? t('common.close') : t('demo.cta')}
      </button>
    </div>
  )
}

function ConsoleBtn({ onClick, tag, label }) {
  return (
    <button
      onClick={onClick}
      className="font-mono flex items-center gap-2 border border-ink/15 bg-cream px-2 py-1.5 text-left text-[11px] tracking-wide text-ink hover:bg-cream-deep"
    >
      <span className="bg-oxblood px-1 text-[9px] text-cream">{tag}</span>
      <span>{label}</span>
    </button>
  )
}

function LangBtn({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={[
        'font-display border px-2 py-1 text-[12px] font-black tracking-wide uppercase',
        active ? 'border-ink bg-oxblood text-cream' : 'border-ink/30 bg-cream text-ink/65 hover:bg-cream-deep',
      ].join(' ')}
      style={{ borderRadius: '2px' }}
    >
      {label}
    </button>
  )
}
