import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useStore } from '../lib/store.jsx'
import { PageHeader } from '../components/PageHeader.jsx'
import { Avatar } from '../components/Avatar.jsx'
import { DormPlate } from '../components/DormPlate.jsx'

const TABS = [
  { id: 'improved', label: 'MOST IMPROVED', sub: 'PROTECT NEW USERS' },
  { id: 'xp', label: 'XP RANKING', sub: 'COMPETITIVE' },
  { id: 'squad', label: 'SQUAD RANKING', sub: 'COLLECTIVE' },
]

export function Leaderboard() {
  // V3 default = Most Improved (protects new/low-frequency users from negative reinforcement).
  const [tab, setTab] = useState('improved')
  const { state } = useStore()
  const lb = state.leaderboard

  return (
    <main className="flex flex-col">
      <PageHeader
        section="RANKS"
        issue="WK 19"
        kicker="Three boards by design — one for high-activity, one for new users, one for squads."
      />

      {/* Tab strip */}
      <div className="grid grid-cols-3 border-b-2 border-ink bg-paper">
        {TABS.map((t) => {
          const active = tab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={[
                'relative flex flex-col items-start gap-0.5 px-3 py-2.5 text-left',
                active ? 'bg-oxblood text-cream' : 'bg-paper text-ink/65 hover:text-ink',
                'border-r border-ink/15 last:border-r-0',
              ].join(' ')}
            >
              <span className="font-display text-[11.5px] font-black uppercase leading-none tracking-[0.06em]">{t.label}</span>
              <span className={['font-mono text-[8.5px] tracking-[0.2em]', active ? 'text-jersey' : 'text-ink/45'].join(' ')}>{t.sub}</span>
              {active && (
                <span className="absolute -bottom-[2px] left-0 right-0 h-[3px] bg-jersey" />
              )}
            </button>
          )
        })}
      </div>

      {/* Default note */}
      <div className="border-b-2 border-ink bg-cream-deep/40 px-4 py-2.5">
        <div className="font-mono text-[9.5px] tracking-[0.22em] text-ink/65 uppercase">
          // {tab === 'improved' && 'DEFAULT TAB · WHO MOVED THE MOST RELATIVE TO LAST WEEK'}
          {tab === 'xp' && 'CUMULATIVE — FOR THE GRINDERS'}
          {tab === 'squad' && 'BY-CREW · WEEKLY MINUTES'}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.section
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
          className="px-4 pb-32 pt-4"
        >
          {tab === 'improved' && <MostImprovedList rows={lb.mostImproved} />}
          {tab === 'xp' && <XpList rows={lb.xpRanking} />}
          {tab === 'squad' && <SquadList rows={lb.squadRanking} />}

          <div className="mt-5 border border-dashed border-ink/30 bg-paper p-3 text-[11.5px] leading-snug text-ink/65">
            <div className="font-mono mb-1 text-[9.5px] tracking-[0.22em] text-oxblood">// V3 DESIGN NOTE</div>
            Leaderboard splits by user lifecycle. New & low-frequency users default to Most
            Improved so they never see "you're 213th" on day one.
          </div>
        </motion.section>
      </AnimatePresence>
    </main>
  )
}

function RankBadge({ rank, isYou }) {
  const isPodium = rank <= 3
  const bg = isPodium
    ? rank === 1 ? 'bg-jersey text-ink'
      : rank === 2 ? 'bg-cream-deep text-ink'
      : 'bg-bruise text-cream'
    : 'bg-paper text-ink border-2 border-ink/40'
  return (
    <div
      className={['font-display grid h-12 w-10 place-items-center text-[20px] font-black leading-none', bg, isYou ? 'ring-2 ring-oxblood ring-offset-2 ring-offset-paper' : ''].join(' ')}
      style={{ borderRadius: '2px', clipPath: 'polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)' }}
    >
      {rank}
    </div>
  )
}

function Row({ children, isYou }) {
  return (
    <li
      className={[
        'relative grid grid-cols-[auto_1fr_auto] items-center gap-3 border-2 px-3 py-2.5',
        isYou ? 'border-oxblood bg-cream' : 'border-ink/85 bg-paper',
      ].join(' ')}
      style={{ borderRadius: '3px', boxShadow: isYou ? '4px 4px 0 0 #7B1E1E' : 'none' }}
    >
      {children}
      {isYou && (
        <span className="font-mono absolute -right-1 -top-2 bg-oxblood px-1.5 py-0.5 text-[9px] tracking-[0.2em] text-cream uppercase">
          YOU
        </span>
      )}
    </li>
  )
}

function XpList({ rows }) {
  return (
    <ul className="flex flex-col gap-2">
      {rows.map((r) => (
        <Row key={r.rank + r.name} isYou={r.isYou}>
          <RankBadge rank={r.rank} isYou={r.isYou} />
          <div className="min-w-0 leading-tight">
            <div className="flex items-center gap-2">
              <span className="font-display text-[15px] font-black uppercase truncate">{r.name}</span>
              {r.squad && <span className="font-mono bg-ink px-1.5 py-0.5 text-[9px] tracking-[0.18em] text-jersey">{r.squad}</span>}
            </div>
            <div className="font-mono mt-0.5 text-[10px] tracking-wide text-ink/55 uppercase">
              DORM {r.dorm} · WK Δ {r.delta}
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[9px] tracking-[0.2em] text-ink/55">XP</div>
            <div className="font-display text-[20px] font-black tabular-nums leading-none text-ink">{r.xp.toLocaleString()}</div>
          </div>
        </Row>
      ))}
    </ul>
  )
}

function MostImprovedList({ rows }) {
  return (
    <ul className="flex flex-col gap-2">
      {rows.map((r) => (
        <Row key={r.rank + r.name} isYou={r.isYou}>
          <RankBadge rank={r.rank} isYou={r.isYou} />
          <div className="min-w-0 leading-tight">
            <div className="flex items-center gap-2">
              <span className="font-display text-[15px] font-black uppercase truncate">{r.name}</span>
              {r.squad && <span className="font-mono bg-ink px-1.5 py-0.5 text-[9px] tracking-[0.18em] text-jersey">{r.squad}</span>}
            </div>
            <div className="font-mono mt-0.5 text-[10px] tracking-wide text-ink/55 uppercase">
              DORM {r.dorm} · vs LAST WK
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="relative h-1.5 w-32 overflow-hidden bg-cream-deep">
                <div
                  className="h-full bg-oxblood"
                  style={{ width: `${Math.min(100, r.percent * 4)}%` }}
                />
              </div>
              <span className="font-mono text-[9.5px] tracking-wider text-oxblood">+{r.percent}%</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[9px] tracking-[0.2em] text-ink/55">DELTA</div>
            <div className="font-display text-[16px] font-black tabular-nums leading-none text-oxblood">
              {r.delta}
            </div>
          </div>
        </Row>
      ))}
    </ul>
  )
}

function SquadList({ rows }) {
  return (
    <ul className="flex flex-col gap-2">
      {rows.map((r) => (
        <Row key={r.rank + r.name} isYou={r.isYou}>
          <RankBadge rank={r.rank} isYou={r.isYou} />
          <div className="min-w-0 leading-tight">
            <div className="flex items-center gap-2">
              <span className="font-display text-[15px] font-black uppercase truncate">{r.name}</span>
              <DormPlate number={r.dorm} label="FLR" />
            </div>
            <div className="font-mono mt-0.5 text-[10px] tracking-wide text-ink/55 uppercase">
              {r.members} MEMBERS · GOAL {r.members * 150}M
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[9px] tracking-[0.2em] text-ink/55">MIN / WK</div>
            <div className="font-display text-[20px] font-black tabular-nums leading-none text-ink">
              {r.minutes}
            </div>
          </div>
        </Row>
      ))}
    </ul>
  )
}
