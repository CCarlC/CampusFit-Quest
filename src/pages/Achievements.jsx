import { motion } from 'motion/react'
import { useStore } from '../lib/store.jsx'
import { PageHeader } from '../components/PageHeader.jsx'
import { Avatar } from '../components/Avatar.jsx'

export function Achievements() {
  const { state } = useStore()
  const { achievements, user } = state
  const personal = achievements.filter((a) => a.type === 'personal')
  const squad = achievements.filter((a) => a.type === 'squad')
  const unlockedPersonal = personal.filter((a) => a.unlocked).length
  const unlockedSquad = squad.filter((a) => a.unlocked).length

  return (
    <main className="flex flex-col">
      <PageHeader
        section="BADGES"
        issue={`${unlockedPersonal + unlockedSquad}/${achievements.length}`}
        kicker="Long-term sediment. Personal trophy case + Dorm 304 squad heraldry."
      />

      {/* Trophy case header */}
      <section className="border-b-2 border-ink bg-cream px-4 pb-5 pt-4">
        <div className="grid grid-cols-3 gap-2">
          <Stat label="UNLOCKED" value={`${unlockedPersonal + unlockedSquad}`} sub={`OF ${achievements.length}`} />
          <Stat label="LV" value={user.level} sub={`${user.xp} XP`} />
          <Stat label="STREAK" value={user.streak} sub={`PEAK ${user.longestStreak}`} />
        </div>
      </section>

      {/* Personal */}
      <Section title="PERSONAL" sub={`${unlockedPersonal} of ${personal.length} unlocked`}>
        <div className="grid grid-cols-2 gap-3">
          {personal.map((a, i) => (
            <BadgeTile key={a.id} a={a} index={i} />
          ))}
        </div>
      </Section>

      {/* Squad */}
      <Section title="SQUAD" sub={`${unlockedSquad} of ${squad.length} unlocked`} note="Heraldry — earned by the whole crew.">
        <div className="grid grid-cols-2 gap-3">
          {squad.map((a, i) => (
            <BadgeTile key={a.id} a={a} index={i} variant="squad" />
          ))}
        </div>
      </Section>

      {/* Note */}
      <section className="border-t-2 border-ink bg-cream-deep/40 px-4 py-4 pb-32">
        <div className="font-mono text-[9.5px] tracking-[0.22em] text-oxblood">// V3 DESIGN NOTE · NO COMEBACK BADGE</div>
        <p className="mt-1 text-[12px] leading-snug text-ink/75">
          Returning from a paused streak gives standard XP — <b className="text-ink">no
          dedicated badge</b>. V1's "Comeback Badge" let rational users farm badges by
          intentionally pausing. We removed the loop; we still pay for the workout.
        </p>
      </section>
    </main>
  )
}

function Stat({ label, value, sub }) {
  return (
    <div
      className="flex flex-col items-center justify-center border-2 border-ink bg-paper py-2"
      style={{ borderRadius: '3px' }}
    >
      <div className="font-mono text-[9px] tracking-[0.22em] text-ink/55">{label}</div>
      <div className="font-display text-[28px] font-black leading-none tabular-nums">{value}</div>
      <div className="font-mono text-[9px] tracking-[0.18em] text-ink/45">{sub}</div>
    </div>
  )
}

function Section({ title, sub, note, children }) {
  return (
    <section className="border-b-2 border-ink bg-paper px-4 pb-5 pt-4">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-[20px] font-black uppercase leading-none">
          {title}
        </h2>
        <span className="font-mono text-[10px] tracking-[0.22em] text-ink/55 uppercase">{sub}</span>
      </div>
      {note && (
        <p className="font-mono mt-1 text-[10px] tracking-[0.18em] text-ink/45 uppercase">{note}</p>
      )}
      <div className="mt-3">{children}</div>
    </section>
  )
}

function BadgeTile({ a, index, variant = 'personal' }) {
  const unlocked = a.unlocked
  const color = variant === 'squad' ? 'navy' : 'oxblood'

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={[
        'relative overflow-hidden border-2 px-3 pb-3 pt-3',
        unlocked ? 'border-ink bg-cream' : 'border-ink/25 bg-cream-deep/40',
      ].join(' ')}
      style={{ borderRadius: '4px', boxShadow: unlocked ? '4px 4px 0 0 #0E0B08' : 'none' }}
    >
      <div className="flex items-start justify-between">
        <Avatar name={a.crest} color={color} size={48} dimmed={!unlocked} />
        {unlocked ? (
          <span className="font-mono bg-jersey px-1.5 py-0.5 text-[9px] tracking-[0.22em] text-ink uppercase skew-stamp-r">
            STAMPED
          </span>
        ) : (
          <span className="font-mono border border-dashed border-ink/40 px-1.5 py-0.5 text-[9px] tracking-[0.22em] text-ink/40 uppercase">
            LOCKED
          </span>
        )}
      </div>
      <div className="mt-2.5">
        <div className={['font-display text-[16px] font-black uppercase leading-tight', unlocked ? '' : 'text-ink/55'].join(' ')}>
          {a.name}
        </div>
        <p className={['mt-0.5 text-[11px] leading-snug', unlocked ? 'text-ink/70' : 'text-ink/40'].join(' ')}>
          {a.description}
        </p>
      </div>
      {unlocked && a.unlockedAt && (
        <div className="font-mono mt-2 text-[9px] tracking-[0.18em] text-ink/45 uppercase">
          UNLOCK · {new Date(a.unlockedAt).toLocaleDateString()}
        </div>
      )}
      {!unlocked && (
        <div className="font-mono mt-2 text-[9px] tracking-[0.18em] text-ink/40 uppercase">
          PENDING · COMPLETE TO STAMP
        </div>
      )}
      {/* Texture for locked tiles */}
      {!unlocked && (
        <span className="halftone-tight pointer-events-none absolute inset-0 text-ink opacity-[0.04]" />
      )}
    </motion.div>
  )
}
