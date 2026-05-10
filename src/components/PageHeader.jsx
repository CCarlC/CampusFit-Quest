import { DormPlate } from './DormPlate.jsx'

// Shared masthead — each page chooses its own SECTION label and issue number.
export function PageHeader({ section, issue, kicker, action }) {
  return (
    <header className="relative">
      {/* Top status row */}
      <div className="font-mono flex items-center justify-between border-b border-ink/15 bg-paper px-4 py-2 text-[10px] tracking-[0.18em] uppercase text-ink/60">
        <span>9:41</span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 bg-mint" style={{ borderRadius: '50%' }} />
          HEALTHKIT · CONNECTED
        </span>
        <span>100%</span>
      </div>
      {/* Masthead */}
      <div className="relative border-b-2 border-ink bg-paper px-4 pb-3 pt-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="font-mono flex items-center gap-2 text-[9.5px] tracking-[0.22em] text-ink/55 uppercase">
              <span>CampusFit Quest</span>
              <span className="opacity-30">/</span>
              <span>VOL.III</span>
            </div>
            <div className="mt-0.5 flex items-center gap-2">
              <h1 className="font-display text-[32px] font-black uppercase leading-[0.9] tracking-[-0.01em] text-oxblood">
                {section}
              </h1>
              {issue && (
                <span className="font-mono mb-1 self-end bg-ink px-1.5 py-0.5 text-[9px] tracking-[0.18em] text-jersey">
                  ISSUE · {issue}
                </span>
              )}
            </div>
            {kicker && (
              <div className="mt-1 max-w-[260px] text-[12px] leading-tight text-ink/65">{kicker}</div>
            )}
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <DormPlate number="304" label="DORM" />
            {action}
          </div>
        </div>
      </div>
    </header>
  )
}
