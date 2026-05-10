const COLOR_MAP = {
  oxblood: 'bg-oxblood text-cream',
  jersey: 'bg-jersey text-ink',
  navy: 'bg-navy text-cream',
  mint: 'bg-mint text-ink',
  cream: 'bg-cream text-oxblood',
  bruise: 'bg-bruise text-cream',
  ink: 'bg-ink text-jersey',
}

export function Avatar({ name, color = 'oxblood', size = 40, ring = false, dimmed = false, className = '' }) {
  const sizeClass = size === 28
    ? 'h-7 w-7 text-[10px]'
    : size === 32
    ? 'h-8 w-8 text-[11px]'
    : size === 40
    ? 'h-10 w-10 text-[13px]'
    : size === 48
    ? 'h-12 w-12 text-[14px]'
    : 'h-16 w-16 text-[18px]'
  return (
    <div
      className={[
        'relative grid place-items-center font-display font-black uppercase tracking-tight select-none',
        sizeClass,
        COLOR_MAP[color] || COLOR_MAP.oxblood,
        ring ? 'ring-2 ring-jersey ring-offset-2 ring-offset-cream' : '',
        dimmed ? 'opacity-50 grayscale' : '',
        className,
      ].join(' ')}
      style={{ borderRadius: '6px' }}
    >
      <span className="relative z-[1]">{name}</span>
      <span className="halftone-tight pointer-events-none absolute inset-0 opacity-20" />
    </div>
  )
}
