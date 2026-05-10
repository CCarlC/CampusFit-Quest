import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useStore } from '../lib/store.jsx'
import { useToast } from '../components/Toast.jsx'
import { PageHeader } from '../components/PageHeader.jsx'
import { Crest } from '../components/Crest.jsx'
import { Avatar } from '../components/Avatar.jsx'
import { ProgressBar } from '../components/ProgressBar.jsx'
import { Stamp } from '../components/Stamp.jsx'
import { demoSquad } from '../lib/seed.js'

export function Squad() {
  const { state, actions } = useStore()
  const toast = useToast()
  const { squad } = state

  if (!squad) return <SoloFallback onJoin={actions.joinDemoSquad} />

  const totalMinutes = squad.members.reduce((s, m) => s + m.weeklyMinutes, 0)
  const totalGoal = squad.weeklyGoalPerHead * squad.members.length
  const todayCount = squad.members.filter((m) => m.todayVerified).length

  const handleHighFive = (m) => {
    if (!m.todayVerified || m.isYou) return
    actions.highFive(m.id)
    toast.push({
      title: `HIGH-FIVE → ${m.name.toUpperCase()}`,
      body: 'Sent for a verified workout. (Disabled for unfinished members by design.)',
      icon: '✋',
    })
  }

  return (
    <main className="flex flex-col">
      <PageHeader
        section="SQUAD"
        issue={`DAY ${squad.foundedDay}`}
        kicker="Roll-call, weekly goal, and high-fives — only for those who actually moved."
      />

      {/* Crest banner */}
      <section className="relative border-b-2 border-ink bg-cream px-4 pb-5 pt-5">
        <div className="absolute right-0 top-0 h-full w-32 stripe-tape opacity-25" />
        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-mono text-[10px] tracking-[0.22em] text-ink/55">// COAT OF ARMS</div>
            <h2 className="font-display mt-0.5 text-[26px] font-black uppercase leading-[0.95]">
              {squad.name}
            </h2>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <Stamp color="oxblood">DORM 304</Stamp>
              <span className="font-mono text-[10px] tracking-[0.18em] text-ink/55 uppercase">
                {squad.members.length} members · invite {squad.inviteCode}
              </span>
            </div>
          </div>
          <Crest members={squad.members.map((m) => ({ avatar: m.avatar, color: m.color }))} size={92} />
        </div>

        {/* Weekly goal */}
        <div className="mt-5">
          <div className="flex items-end justify-between">
            <div>
              <div className="font-mono text-[10px] tracking-[0.22em] text-ink/55">WEEKLY GOAL</div>
              <div className="font-display text-[22px] font-black leading-none">
                <span className="tabular-nums">{totalMinutes}</span>
                <span className="text-ink/45"> / {totalGoal} MIN</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[10px] tracking-[0.22em] text-ink/55">TODAY VERIFIED</div>
              <div className="font-display text-[18px] font-black text-oxblood">
                {todayCount} / {squad.members.length}
              </div>
            </div>
          </div>
          <div className="mt-2">
            <ProgressBar current={totalMinutes} max={totalGoal} color="navy" />
          </div>
          <p className="font-mono mt-2 text-[9.5px] tracking-[0.18em] text-ink/50 uppercase">
            // SCALES BY HEAD-COUNT · 1 PERSON = 150M · 6 PEOPLE = 900M
          </p>
        </div>
      </section>

      {/* Roster */}
      <section className="border-b-2 border-ink bg-paper px-4 pb-5 pt-4">
        <div className="flex items-center gap-2">
          <span className="h-[2px] flex-1 bg-ink" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-ink/65">ROLL-CALL</span>
          <span className="h-[2px] flex-1 bg-ink" />
        </div>

        <ul className="mt-3 flex flex-col gap-2">
          {squad.members.map((m, i) => (
            <motion.li
              key={m.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={[
                'relative grid grid-cols-[auto_1fr_auto] items-center gap-3 border-2 border-ink px-3 py-2.5',
                m.todayVerified ? 'bg-cream' : 'bg-cream-deep/40',
              ].join(' ')}
              style={{ borderRadius: '3px' }}
            >
              <Avatar name={m.avatar} color={m.color} size={40} dimmed={!m.todayVerified} />
              <div className="min-w-0 leading-tight">
                <div className="flex items-center gap-2">
                  <div className="font-display text-[16px] font-black uppercase truncate">
                    {m.name}{m.isYou && <span className="ml-1 text-jersey-deep">— YOU</span>}
                  </div>
                  {m.todayVerified ? (
                    <span className="font-mono bg-mint px-1.5 py-0.5 text-[9px] tracking-[0.2em] text-ink uppercase">VERIFIED</span>
                  ) : (
                    <span className="font-mono border border-ink/25 px-1.5 py-0.5 text-[9px] tracking-[0.2em] text-ink/55 uppercase">PENDING</span>
                  )}
                </div>
                <div className="font-mono mt-0.5 flex items-center gap-2.5 text-[10px] tracking-wide text-ink/55 uppercase">
                  <span>STREAK · {m.streak}</span>
                  <span className="opacity-30">·</span>
                  <span>{m.weeklyMinutes}M / WK</span>
                  {m.lastSeen && <><span className="opacity-30">·</span><span>{m.lastSeen}</span></>}
                </div>
              </div>

              {/* Right side: action */}
              {m.isYou ? (
                <span className="font-mono text-right text-[9.5px] tracking-[0.2em] text-ink/40 uppercase">
                  YOU
                </span>
              ) : m.todayVerified ? (
                <button
                  onClick={() => handleHighFive(m)}
                  className="font-display stamp-press grid h-10 w-10 place-items-center border-2 border-ink bg-jersey text-ink text-[18px] font-black"
                  style={{ borderRadius: '3px' }}
                  aria-label={`High-five ${m.name}`}
                >
                  ✋
                </button>
              ) : (
                <div className="flex flex-col items-end">
                  <span className="font-mono border border-ink/20 bg-cream-deep/30 px-2 py-1 text-[9px] tracking-[0.2em] text-ink/35 uppercase line-through">
                    NUDGE
                  </span>
                  <span className="font-mono mt-0.5 text-[8.5px] tracking-[0.18em] text-ink/35 uppercase">
                    DISABLED · BY DESIGN
                  </span>
                </div>
              )}

              {m.highFiveCount && m.highFiveCount > 0 && (
                <span className="font-mono absolute -right-1 -top-1 bg-oxblood px-1.5 py-0.5 text-[9px] tracking-wider text-cream">
                  ×{m.highFiveCount}
                </span>
              )}
            </motion.li>
          ))}
        </ul>

        {squad.members.length < 6 && (
          <button className="font-display stamp-press mt-3 flex w-full items-center justify-center gap-2 border-2 border-dashed border-ink/40 bg-paper py-3 text-[14px] font-black uppercase tracking-[0.12em] text-ink/65">
            <span className="text-[18px]">＋</span> INVITE — UP TO 6
          </button>
        )}
      </section>

      {/* Design note */}
      <section className="border-b-2 border-ink bg-cream-deep/30 px-4 py-4">
        <div className="font-mono text-[9.5px] tracking-[0.22em] text-oxblood">// V3 DESIGN NOTE · SOCIAL PRESSURE</div>
        <p className="mt-1 text-[12px] leading-snug text-ink/75">
          High-fives only fire on <b>verified</b> members. We removed "Nudge" on unfinished
          squadmates — passive-aggressive notifications were the #1 reason V1 testers said the squad
          felt &ldquo;guilty.&rdquo;
        </p>
      </section>

      {/* Solo eject */}
      <section className="px-4 pb-32 pt-4">
        <button
          onClick={actions.leaveSquad}
          className="font-mono text-[10px] tracking-[0.22em] text-ink/40 underline-offset-4 hover:text-oxblood hover:underline uppercase"
        >
          // demo · drop to solo mode
        </button>
      </section>
    </main>
  )
}

function SoloFallback({ onJoin }) {
  const [code, setCode] = useState('')
  return (
    <main className="flex flex-col">
      <PageHeader
        section="SOLO"
        issue="MODE"
        kicker="Squads are an upgrade, not a gate. Walk in alone if you want."
      />
      <section className="px-4 pb-8 pt-6">
        <div
          className="border-2 border-ink bg-cream p-5"
          style={{ borderRadius: '3px', boxShadow: '5px 5px 0 0 #0E0B08' }}
        >
          <div className="font-mono text-[10px] tracking-[0.22em] text-ink/55">// SOLO MEMBERSHIP</div>
          <h2 className="font-display mt-1 text-[28px] font-black uppercase leading-[0.95]">Train alone, fully.</h2>
          <p className="mt-2 text-[13px] leading-snug text-ink/70">
            Every quest, badge, and verification works without a squad. Joining adds high-fives,
            shared goals, and a dorm crest — but never adds friction.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <FeatureRow on label="Daily quests" />
            <FeatureRow on label="HealthKit verify" />
            <FeatureRow on label="Personal badges" />
            <FeatureRow on label="Most Improved board" />
            <FeatureRow off label="Squad badges" />
            <FeatureRow off label="High-fives" />
          </div>
        </div>

        <div
          className="mt-5 border-2 border-ink bg-paper p-5"
          style={{ borderRadius: '3px' }}
        >
          <div className="font-mono text-[10px] tracking-[0.22em] text-ink/55">// JOIN A SQUAD</div>
          <div className="font-display mt-1 text-[18px] font-black uppercase">Got an invite code?</div>
          <div className="mt-2 flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="D304-FIT"
              className="font-mono w-full border-2 border-ink bg-cream px-3 py-2 text-[14px] tracking-[0.18em] text-ink placeholder-ink/30 outline-none focus:bg-cream-deep"
              style={{ borderRadius: '3px' }}
            />
            <button
              onClick={() => onJoin(demoSquad())}
              className="font-display stamp-press border-2 border-ink bg-jersey px-3 py-2 text-[13px] font-black uppercase tracking-[0.1em] text-ink"
              style={{ borderRadius: '3px' }}
            >
              JOIN
            </button>
          </div>
          <p className="font-mono mt-2 text-[9.5px] tracking-[0.18em] text-ink/40 uppercase">
            // any code joins the demo squad — Dorm 304 Crew
          </p>
        </div>
      </section>
    </main>
  )
}

function FeatureRow({ label, on, off }) {
  return (
    <div className="flex items-center gap-2 border border-ink/20 bg-paper px-2 py-1.5">
      <span
        className={[
          'font-display grid h-5 w-5 place-items-center text-[12px] font-black',
          on ? 'bg-mint text-ink' : 'bg-cream-deep text-ink/40 line-through',
        ].join(' ')}
        style={{ borderRadius: '2px' }}
      >
        {on ? '✓' : '–'}
      </span>
      <span className={['font-display text-[12px] font-bold uppercase tracking-wide', off ? 'text-ink/40' : 'text-ink'].join(' ')}>
        {label}
      </span>
    </div>
  )
}
