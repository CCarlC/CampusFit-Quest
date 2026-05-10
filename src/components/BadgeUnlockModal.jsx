import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'
import { Avatar } from './Avatar.jsx'
import { useI18n } from '../lib/i18n.jsx'

export function BadgeUnlockModal({ badge, onClose }) {
  const { t } = useI18n()
  useEffect(() => {
    if (!badge) return
    const t = setTimeout(() => onClose?.(), 4200)
    return () => clearTimeout(t)
  }, [badge, onClose])

  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-ink/60 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 16, rotate: -3, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, rotate: -1.5, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.94 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-[1] w-full max-w-[340px] overflow-hidden border-2 border-ink bg-cream text-ink"
            style={{ borderRadius: '3px', boxShadow: '6px 6px 0 0 #0E0B08' }}
          >
            <div className="relative h-2 stripe-tape" />
            <div className="relative px-5 pb-5 pt-4">
              <div className="font-mono text-center text-[10px] tracking-[0.2em] text-oxblood">{t('modal.unlocked')}</div>
              <div className="mt-3 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.6, rotate: -8 }}
                  animate={{ scale: 1, rotate: -3 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 14 }}
                  className="relative"
                >
                  <Avatar name={badge.crest} color={badge.type === 'squad' ? 'navy' : 'oxblood'} size={64} />
                  <span aria-hidden className="font-display absolute -right-3 -top-3 grid h-9 w-9 place-items-center bg-jersey text-ink text-[14px] font-black skew-stamp-r" style={{ borderRadius: '50%' }}>
                    {t('modal.new')}
                  </span>
                </motion.div>
              </div>
              <div className="mt-3 text-center">
                <div className="font-display text-[26px] font-black leading-none">{t(`ach.${badge.id}.name`)}</div>
                <div className="font-mono mt-1 text-[10px] tracking-[0.18em] uppercase opacity-70">
                  {badge.type === 'squad' ? t('modal.kind.squad') : t('modal.kind.personal')}
                </div>
                <div className="mt-3 text-[13px] leading-snug text-ink/80">{t(`ach.${badge.id}.desc`)}</div>
              </div>
              <button
                onClick={onClose}
                className="font-display stamp-press mt-5 w-full border-2 border-ink bg-oxblood py-2 text-[13px] font-black uppercase tracking-[0.12em] text-cream"
                style={{ borderRadius: '3px' }}
              >
                {t('modal.cta')}
              </button>
              <div className="font-mono mt-2 text-center text-[9px] tracking-[0.18em] text-ink/40">{t('modal.unlockDate', { date: new Date().toLocaleDateString() })}</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
