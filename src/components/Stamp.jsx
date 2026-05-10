export function Stamp({ children, color = 'oxblood', skew = -2.5, className = '' }) {
  const colorClass =
    color === 'oxblood' ? 'border-oxblood text-oxblood'
      : color === 'ink' ? 'border-ink text-ink'
      : color === 'jersey' ? 'border-jersey text-jersey'
      : color === 'cream' ? 'border-cream text-cream'
      : 'border-oxblood text-oxblood'
  return (
    <span
      className={[
        'font-display inline-block border-2 px-2 py-0.5 text-[11px] font-black uppercase tracking-[0.18em] leading-none',
        colorClass,
        className,
      ].join(' ')}
      style={{ transform: `rotate(${skew}deg)`, borderRadius: '2px' }}
    >
      {children}
    </span>
  )
}

export function Tape({ children, className = '' }) {
  return (
    <span className={['font-mono inline-block bg-jersey px-2 py-0.5 text-[10px] tracking-[0.18em] text-ink uppercase', className].join(' ')} style={{ transform: 'rotate(-1.5deg)' }}>
      {children}
    </span>
  )
}
