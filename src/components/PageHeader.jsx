import { DormPlate } from './DormPlate.jsx'
import { useI18n } from '../lib/i18n.jsx'

// Shared masthead — each page chooses its own SECTION label and issue number.
export function PageHeader({ section, issue, kicker, action }) {
  const { t } = useI18n()
  return (
    <header className="relative">
      {/* Top status row */}
      <div className="font-mono flex items-center justify-between border-b border-ink/15 bg-paper px-4 py-2 text-[10px] tracking-[0.18em] uppercase text-ink/60">
        <span>9:41</span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 bg-mint" style={{ borderRadius: '50%' }} />
          {t('chrome.healthkitConnected')}
        </span>
        <span>100%</span>
      </div>
      {/* Masthead */}
      <div className="relative border-b-2 border-ink bg-paper px-4 pb-3 pt-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="font-mono flex items-center gap-2 text-[9.5px] tracking-[0.22em] text-ink/55 uppercase">
              <span>{t('brand.name')}</span>
              <span className="opacity-30">/</span>
              <span>{t('brand.vol')}</span>
              <LangToggle />
            </div>
            <div className="mt-0.5 flex items-center gap-2">
              <h1 className="font-display text-[32px] font-black uppercase leading-[0.9] tracking-[-0.01em] text-oxblood">
                {section}
              </h1>
              {issue && (
                <span className="font-mono mb-1 self-end bg-ink px-1.5 py-0.5 text-[9px] tracking-[0.18em] text-jersey">
                  {t('chrome.issue', { issue })}
                </span>
              )}
            </div>
            {kicker && (
              <div className="mt-1 max-w-[260px] text-[12px] leading-tight text-ink/65">{kicker}</div>
            )}
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <DormPlate number="304" label={t('chrome.dormLabel')} />
            {action}
          </div>
        </div>
      </div>
    </header>
  )
}

function LangToggle() {
  const { locale, toggleLocale } = useI18n()
  return (
    <button
      onClick={toggleLocale}
      className="font-mono ml-1 inline-flex items-center gap-0.5 border border-ink/40 bg-cream px-1 py-0.5 text-[8.5px] tracking-[0.16em] text-ink/70 transition-colors hover:bg-ink hover:text-jersey"
      style={{ borderRadius: '2px' }}
      aria-label="Toggle language"
    >
      <span className={locale === 'en' ? 'text-oxblood font-bold' : 'opacity-50'}>EN</span>
      <span className="opacity-30">/</span>
      <span className={locale === 'zh' ? 'text-oxblood font-bold' : 'opacity-50'}>中</span>
    </button>
  )
}
