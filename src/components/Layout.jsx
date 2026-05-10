import { useI18n } from '../lib/i18n.jsx'

// Phone-frame wrapper: gives the demo a clear mobile silhouette on desktop while
// staying full-bleed on actual mobile.
export function PhoneFrame({ children }) {
  const { t } = useI18n()
  return (
    <div className="relative min-h-svh w-full bg-ink">
      {/* Decorative wallpaper for desktop preview only */}
      <div aria-hidden className="pointer-events-none fixed inset-0 hidden md:block">
        <div className="absolute inset-0 bg-oxblood-deep" />
        <div className="halftone absolute inset-0 text-cream/20" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, transparent 0 22px, rgba(245,197,24,0.08) 22px 23px)',
          }}
        />
        {/* Edge ticker */}
        <div className="absolute bottom-3 left-0 right-0 flex overflow-hidden text-cream/40">
          <div className="font-mono animate-ticker flex gap-10 whitespace-nowrap px-4 text-[10px] tracking-[0.3em]">
            {Array.from({ length: 2 }).map((_, k) => (
              <div key={k} className="flex items-center gap-10">
                <span>{t('brand.tickerLine')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex min-h-svh w-full max-w-[440px] flex-col bg-paper text-ink shadow-[0_0_0_2px_#0E0B08] md:my-6 md:min-h-[calc(100svh-3rem)] md:rounded-[28px] md:overflow-hidden">
        <div className="grain relative flex flex-1 flex-col">
          {children}
        </div>
      </div>
    </div>
  )
}
