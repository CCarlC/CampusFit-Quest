import { motion } from 'motion/react'
import { useStore } from '../lib/store.jsx'
import { useToast } from '../components/Toast.jsx'
import { PageHeader } from '../components/PageHeader.jsx'
import { VerifyButton } from '../components/VerifyButton.jsx'
import { Stamp } from '../components/Stamp.jsx'

const TYPE_META = {
  daily: { label: 'DAILY', color: 'oxblood', accent: '#7B1E1E', dotLabel: 'CORE' },
  bonus: { label: 'BONUS', color: 'jersey', accent: '#F5C518', dotLabel: 'EXTRA' },
  social: { label: 'SOCIAL', color: 'navy', accent: '#1B2A4E', dotLabel: 'WITH SQUAD' },
  challenge: { label: 'CHALLENGE', color: 'bruise', accent: '#6B4A6E', dotLabel: 'HARD' },
  comeback: { label: 'COMEBACK', color: 'mint', accent: '#5BA88A', dotLabel: 'RETURN' },
}

export function Quests() {
  const { state, actions } = useStore()
  const toast = useToast()
  const { quests, user } = state
  const visible = quests.filter((q) => !(q.locked && !user.streakPaused))

  const handleVerified = (q) => ({ steps, minutes }) => {
    actions.verifyTask(q.id, { mockSteps: steps, mockMinutes: minutes })
    const noBadgeNote = q.type === 'comeback' ? ' · NO EXTRA BADGE — BY DESIGN' : ''
    toast.push({
      title: `+${q.xp} XP VERIFIED${noBadgeNote}`,
      body: `${steps.toLocaleString()} steps · ${minutes} min · ${q.title.toLowerCase()}`,
    })
  }

  const totalAvailableXp = visible.filter((q) => !q.verified).reduce((sum, q) => sum + q.xp, 0)

  return (
    <main className="flex flex-col">
      <PageHeader
        section="QUESTS"
        issue="WK 19"
        kicker="Five categories, all verified by HealthKit. Pick what fits today."
      />

      {/* Type filter strip */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto border-b-2 border-ink bg-cream px-4 py-2.5">
        <Chip active>ALL · {visible.length}</Chip>
        {Object.entries(TYPE_META).map(([k, v]) => {
          const count = visible.filter((q) => q.type === k).length
          if (count === 0) return null
          return (
            <Chip key={k} dotColor={v.accent}>
              {v.label} · {count}
            </Chip>
          )
        })}
      </div>

      {/* Available banner */}
      <div className="flex items-center justify-between border-b-2 border-ink bg-paper px-4 py-2.5">
        <div className="font-mono text-[10px] tracking-[0.22em] text-ink/60">// AVAILABLE TODAY</div>
        <div className="font-display flex items-baseline gap-1 text-[14px] font-black">
          <span className="text-oxblood">+{totalAvailableXp}</span>
          <span className="font-mono text-[10px] tracking-wider text-ink/55">XP UP FOR GRABS</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-32 pt-4">
        {visible.map((q, idx) => (
          <QuestCard key={q.id} q={q} index={idx} onVerified={handleVerified(q)} />
        ))}

        {visible.length === 0 && (
          <div className="border-2 border-dashed border-ink/30 px-4 py-8 text-center">
            <div className="font-display text-[18px] font-black">No quests pending.</div>
            <p className="mt-1 text-[12px] text-ink/60">Comeback quests unlock if you pause for 3+ days.</p>
          </div>
        )}

        <Footnote />
      </div>
    </main>
  )
}

function Chip({ children, active = false, dotColor }) {
  return (
    <button
      type="button"
      className={[
        'font-mono inline-flex shrink-0 items-center gap-1.5 border px-2.5 py-1 text-[10px] tracking-[0.18em] uppercase',
        active ? 'border-ink bg-ink text-jersey' : 'border-ink/35 bg-paper text-ink/70',
      ].join(' ')}
      style={{ borderRadius: '2px' }}
    >
      {dotColor && <span className="inline-block h-1.5 w-1.5" style={{ background: dotColor, borderRadius: '50%' }} />}
      {children}
    </button>
  )
}

function QuestCard({ q, index, onVerified }) {
  const meta = TYPE_META[q.type] || TYPE_META.daily
  const verified = q.verified

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={[
        'relative overflow-hidden border-2 border-ink',
        verified ? 'bg-cream-deep/60 text-ink/55' : 'bg-cream text-ink',
      ].join(' ')}
      style={{ borderRadius: '4px', boxShadow: verified ? 'none' : '4px 4px 0 0 #0E0B08' }}
    >
      {/* Side stripe */}
      <div className="absolute inset-y-0 left-0 w-2" style={{ background: meta.accent }} />

      <div className="grid grid-cols-[auto_1fr_auto] items-start gap-3 px-3 py-3 pl-5">
        {/* Code stamp */}
        <div className="flex flex-col items-center gap-1">
          <div
            className="font-display grid h-12 w-12 place-items-center border border-ink/70 bg-paper text-[18px] font-black leading-none"
            style={{ borderRadius: '3px' }}
          >
            {q.code.replace('#', '')}
          </div>
          <span className="font-mono text-[8.5px] tracking-[0.2em] text-ink/50 uppercase">{q.difficulty}</span>
        </div>

        {/* Content */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="font-mono px-1.5 py-0.5 text-[9px] tracking-[0.22em] uppercase"
              style={{ background: meta.accent, color: q.type === 'bonus' || q.type === 'comeback' ? '#0E0B08' : '#F5EDE0' }}
            >
              {meta.label}
            </span>
            <span className="font-mono text-[9px] tracking-[0.18em] text-ink/55 uppercase truncate">{meta.dotLabel}</span>
          </div>
          <h3 className={['font-display mt-1.5 text-[18px] font-black uppercase leading-tight', verified ? 'line-through decoration-2' : ''].join(' ')}>
            {q.title}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-ink/60">{q.blurb}</p>
        </div>

        {/* Reward */}
        <div className="text-right">
          <div className="font-mono text-[9px] tracking-[0.2em] text-ink/55">REWARD</div>
          <div className="font-display text-[24px] font-black leading-none text-oxblood">
            +{q.xp}
          </div>
          <div className="font-mono text-[9px] tracking-[0.18em] text-ink/55">XP · {q.minutes}m</div>
        </div>
      </div>

      {/* Action row */}
      <div className="border-t border-ink/15 bg-paper px-3 py-2.5">
        {verified ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="font-display grid h-7 w-7 place-items-center bg-mint text-ink text-[14px] font-black"
                style={{ borderRadius: '2px' }}
              >
                ✓
              </div>
              <div>
                <div className="font-display text-[13px] font-black uppercase tracking-wide leading-none">VERIFIED</div>
                <div className="font-mono text-[9.5px] tracking-[0.18em] text-ink/55 uppercase">
                  {q.verifiedSteps?.toLocaleString()} steps · {q.verifiedMinutes} min
                </div>
              </div>
            </div>
            <Stamp color="oxblood" skew={-3}>{new Date(q.verifiedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Stamp>
          </div>
        ) : (
          <VerifyButton taskMinutes={q.minutes} variant="compact" onVerified={onVerified} />
        )}
      </div>
    </motion.article>
  )
}

function Footnote() {
  return (
    <div className="mt-2 border border-dashed border-ink/30 bg-paper p-3 text-[11.5px] leading-snug text-ink/60">
      <div className="font-mono mb-1 text-[9.5px] tracking-[0.22em] text-oxblood">// V3 DESIGN NOTE</div>
      <span>
        <b>Comeback Quest</b> awards normal XP — <b className="text-ink">no extra badge</b>. We reward
        the <i>workout</i>, not the act of returning. (Removes the "fake-pause to farm" loop in V1.)
      </span>
    </div>
  )
}
