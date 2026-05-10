// Squad crest — four avatars arranged like a varsity coat of arms.
// Falls back gracefully for 1-3 members.
const TILE_COLORS = {
  oxblood: '#7B1E1E',
  jersey: '#F5C518',
  navy: '#1B2A4E',
  mint: '#5BA88A',
  cream: '#F5EDE0',
  bruise: '#6B4A6E',
}

export function Crest({ members = [], size = 88, label, className = '' }) {
  const slots = members.slice(0, 4)
  while (slots.length < 4) slots.push({ avatar: '·', color: 'cream', filler: true })
  const tile = size / 2

  return (
    <div className={['relative inline-block', className].join(' ')} style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="block" width={size} height={size}>
        <defs>
          <clipPath id={`crest-clip-${size}`}>
            <path d={`M0 0 H${size} V${size * 0.6} Q${size / 2} ${size * 1.05} 0 ${size * 0.6} Z`} />
          </clipPath>
        </defs>
        <g clipPath={`url(#crest-clip-${size})`}>
          {slots.map((m, i) => {
            const x = (i % 2) * tile
            const y = Math.floor(i / 2) * tile
            return (
              <g key={i}>
                <rect x={x} y={y} width={tile} height={tile} fill={TILE_COLORS[m.color] || TILE_COLORS.oxblood} />
                {!m.filler && (
                  <text
                    x={x + tile / 2}
                    y={y + tile / 2 + 4}
                    textAnchor="middle"
                    fontFamily="Big Shoulders Display, sans-serif"
                    fontWeight="900"
                    fontSize={tile * 0.42}
                    fill={m.color === 'jersey' || m.color === 'mint' || m.color === 'cream' ? '#0E0B08' : '#F5EDE0'}
                  >
                    {m.avatar}
                  </text>
                )}
                {m.filler && (
                  <text
                    x={x + tile / 2}
                    y={y + tile / 2 + 4}
                    textAnchor="middle"
                    fontFamily="JetBrains Mono, monospace"
                    fontSize={tile * 0.35}
                    fill="#0E0B08"
                    opacity="0.35"
                  >
                    {m.avatar}
                  </text>
                )}
              </g>
            )
          })}
        </g>
        {/* Crest border */}
        <path
          d={`M0 0 H${size} V${size * 0.6} Q${size / 2} ${size * 1.05} 0 ${size * 0.6} Z`}
          fill="none"
          stroke="#0E0B08"
          strokeWidth="2"
        />
        {/* Center divider lines */}
        <line x1={tile} y1="0" x2={tile} y2={tile} stroke="#0E0B08" strokeWidth="1.2" />
        <line x1="0" y1={tile} x2={size} y2={tile} stroke="#0E0B08" strokeWidth="1.2" opacity="0.6" />
      </svg>
      {label && (
        <span className="font-mono absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full text-[9px] tracking-[0.18em] text-ink uppercase">
          {label}
        </span>
      )}
    </div>
  )
}
