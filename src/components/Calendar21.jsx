// 21-day streak grid — 3 rows of 7 days. Verified days = oxblood blocks.
// Today is highlighted with jersey corner.
export function Calendar21({ history = [], todayIndex = 20 }) {
  // Pad to 21
  const days = [...history]
  while (days.length < 21) days.unshift(0)
  const trimmed = days.slice(-21)

  return (
    <div className="grid grid-cols-7 gap-[3px]">
      {trimmed.map((d, i) => {
        const isToday = i === todayIndex
        return (
          <div
            key={i}
            className={[
              'relative aspect-square',
              d ? 'bg-oxblood' : 'bg-cream-deep border border-ink/15',
              isToday ? 'outline-2 outline-jersey outline-offset-1' : '',
            ].join(' ')}
            style={{ borderRadius: '1px' }}
          >
            {d ? (
              <span className="halftone-tight absolute inset-0 text-cream opacity-30" />
            ) : null}
            {isToday && (
              <span className="font-mono absolute -top-2.5 right-0 text-[7.5px] tracking-[0.15em] text-jersey-deep">
                NOW
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
