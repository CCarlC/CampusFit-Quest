// A dorm-room number plate — used as a recurring campus motif.
export function DormPlate({ number = '304', label = 'DORM', className = '' }) {
  return (
    <div
      className={['inline-flex items-stretch overflow-hidden border border-ink/80 bg-cream text-ink', className].join(' ')}
      style={{ borderRadius: '3px' }}
    >
      <div className="font-mono flex items-center bg-ink px-1.5 py-0.5 text-[9px] tracking-[0.2em] text-jersey">{label}</div>
      <div className="font-display flex items-center px-2 py-0.5 text-[15px] font-black leading-none">{number}</div>
    </div>
  )
}
