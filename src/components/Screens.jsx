import { useState } from 'react';
import { StatBar, Ring, Silhouette } from './Atoms';
import Audio_ from '../audio';
import RESUME from '../data';

const MENU_ITEMS = [
  { id: 'status',  num: '01', label: 'STATUS',     sub: 'Operative bio & summary' },
  { id: 'skills',  num: '02', label: 'SKILLS',     sub: 'Stat sheet & affinities' },
  { id: 'exp',     num: '03', label: 'EXPERIENCE', sub: 'Mission record' },
  { id: 'quests',  num: '04', label: 'QUEST LOG',  sub: 'Achievements unlocked' },
  { id: 'contact', num: '05', label: 'CONTACT',    sub: 'Open a comm channel' },
];

export { MENU_ITEMS };

export function MainMenu({ active, setActive, onSelect }) {
  const R = RESUME;
  return (
    <div className="menu-stage">
      <div className="menu-portrait">
        <div className="portrait-frame">
          <div className="portrait-bg" />
          <div className="portrait-figure">
            <div className="silhouette"><Silhouette /></div>
          </div>
          <div className="portrait-callout">
            <div className="role">{R.identity.role}</div>
            <div className="name">{R.identity.name}</div>
            <div className="surname">{R.identity.surname}</div>
          </div>
          <div className="portrait-stats">
            <div className="ps-row"><b>LV</b> {R.identity.level}</div>
            <div className="ps-row"><b>HP</b> <span className="bar"><i style={{ width: '92%' }} /></span></div>
            <div className="ps-row"><b>SP</b> <span className="bar"><i style={{ width: '78%' }} /></span></div>
            <div className="ps-row"><b>EXP</b> <span className="bar"><i style={{ width: '65%' }} /></span></div>
          </div>
        </div>
      </div>

      <div className="menu-list">
        <div className="menu-eyebrow">// MAIN MENU // SELECT A SECTION</div>
        {MENU_ITEMS.map((it, i) => (
          <button
            key={it.id}
            className={'menu-item ' + (active === i ? 'active' : '')}
            onMouseEnter={() => { setActive(i); Audio_.hover(); }}
            onClick={() => onSelect(it.id)}
          >
            <span className="slab" />
            <span className="num">{it.num}</span>
            <span className="label">
              {it.label}
              <span className="sub">{it.sub}</span>
            </span>
            <span className="arrow" />
            <span className="underline" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function StatusScreen() {
  const R = RESUME;
  return (
    <div className="screen screen-enter">
      <div className="screen-head">
        <div>
          <div className="num">// 01 // STATUS</div>
          <div className="title">OPERATIVE <span className="accent">PROFILE</span></div>
        </div>
        <div className="meta">
          ARCANA · <b>{R.identity.arcana}</b><br />
          AFFINITY · <b>{R.identity.affinity}</b>
        </div>
      </div>
      <div className="screen-body">
        <div className="status-grid">
          <div>
            <div className="status-card">
              <div className="lbl">VITALS</div>
              {R.bio.map((b, i) => (
                <div className="bio-line" key={i}>
                  <span className="k">{b.k}</span>
                  <span className="v">{b.v}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="status-card" style={{ marginBottom: 24 }}>
              <div className="lbl">CHARACTER LOG</div>
              {R.summary.map((s, i) => <p className="summary-text" key={i}>{s}</p>)}
            </div>
            <div className="status-card">
              <div className="lbl">PARAMETERS</div>
              <div className="persona-rings">
                {R.rings.map((r, i) => <Ring key={i} {...r} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkillsScreen() {
  const cats = RESUME.skillCats;
  const [cat, setCat] = useState(0);
  const active = cats[cat];

  return (
    <div className="screen screen-enter">
      <div className="screen-head">
        <div>
          <div className="num">// 02 // SKILLS</div>
          <div className="title">SKILL <span className="accent">TREE</span></div>
        </div>
        <div className="meta">
          CATEGORY · <b>{active.name}</b><br />
          ENTRIES · <b>{String(active.skills.length).padStart(2, '0')}</b>
        </div>
      </div>
      <div className="screen-body">
        <div className="skill-cats">
          <div className="cat-list">
            {cats.map((c, i) => (
              <button
                key={c.key}
                className={'cat-btn ' + (cat === i ? 'active' : '')}
                onClick={() => { setCat(i); Audio_.tick(); }}
                onMouseEnter={() => Audio_.hover()}
              >
                <span className="cat-num">0{i + 1}</span>
                {c.name}
              </button>
            ))}
          </div>
          <div className="skill-grid" key={active.key}>
            {active.skills.map((s, i) => (
              <StatBar key={s.n} name={s.n} lvl={s.lvl} delay={i * 60} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ExpScreen() {
  const exp = RESUME.experience;
  return (
    <div className="screen screen-enter">
      <div className="screen-head">
        <div>
          <div className="num">// 03 // EXPERIENCE</div>
          <div className="title">MISSION <span className="accent">RECORD</span></div>
        </div>
        <div className="meta">
          ENTRIES · <b>{String(exp.length).padStart(2, '0')}</b><br />
          STATUS · <b>ACTIVE</b>
        </div>
      </div>
      <div className="screen-body">
        <div className="exp-list">
          {exp.map((e, i) => (
            <div className="exp-item" key={i} onMouseEnter={() => Audio_.hover()}>
              <div className="exp-period">
                {e.period}{e.now && <span className="now">NOW</span>}
                <span className="tech">
                  {e.tech.map((t, j) => <div key={j}>// {t}</div>)}
                </span>
              </div>
              <div className="exp-content">
                <div className="role">{e.role}</div>
                <div className="org">{e.org}</div>
                <ul>
                  {e.bullets.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const QUEST_ICONS = {
  shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 2 L20 5 V12 C20 17 16 21 12 22 C8 21 4 17 4 12 V5 Z" /></svg>,
  spark:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 2 V8 M12 16 V22 M2 12 H8 M16 12 H22 M5 5 L9 9 M15 15 L19 19 M5 19 L9 15 M15 9 L19 5" /></svg>,
  barcode:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 4 V20 M6 4 V20 M9 4 V20 M12 4 V20 M15 4 V20 M18 4 V20 M21 4 V20" /></svg>,
  grid:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>,
  heart:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 21 C 6 16 3 13 3 9 A 4 4 0 0 1 12 7 A 4 4 0 0 1 21 9 C 21 13 18 16 12 21 Z" /></svg>,
  code:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M8 6 L3 12 L8 18 M16 6 L21 12 L16 18 M14 4 L10 20" /></svg>,
};

export function QuestScreen() {
  const quests = RESUME.quests;
  return (
    <div className="screen screen-enter">
      <div className="screen-head">
        <div>
          <div className="num">// 04 // QUEST LOG</div>
          <div className="title">ACHIEVEMENTS <span className="accent">UNLOCKED</span></div>
        </div>
        <div className="meta">
          COMPLETED · <b>{String(quests.length).padStart(2, '0')}</b> / {String(quests.length).padStart(2, '0')}<br />
          RATE · <b>100%</b>
        </div>
      </div>
      <div className="screen-body">
        <div className="quest-list">
          {quests.map((q, i) => (
            <div className="quest" key={i} onMouseEnter={() => Audio_.hover()}>
              <div className="badge">{QUEST_ICONS[q.icon] || QUEST_ICONS.shield}</div>
              <div className="q-rank">{q.rank}</div>
              <div className="q-title">{q.title}</div>
              <div className="q-desc">{q.desc}</div>
              <div className="q-rew">{q.reward}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ContactScreen() {
  const R = RESUME;
  const channels = [
    { k: 'EMAIL',  v: R.identity.email,    href: `mailto:${R.identity.email}` },
    { k: 'PHONE',  v: R.identity.phone,    href: `tel:${R.identity.phone.replace(/\s/g, '')}` },
    { k: 'GITHUB', v: R.identity.github,   href: `https://${R.identity.github}` },
    { k: 'BASE',   v: R.identity.location, href: null },
  ];
  return (
    <div className="screen screen-enter">
      <div className="screen-head">
        <div>
          <div className="num">// 05 // CONTACT</div>
          <div className="title">OPEN <span className="accent">CHANNEL</span></div>
        </div>
        <div className="meta">
          STATUS · <b>ONLINE</b><br />
          RESPONSE · <b>&lt; 24H</b>
        </div>
      </div>
      <div className="screen-body">
        <div style={{ display: 'grid', gap: 14, maxWidth: 720 }}>
          {channels.map((c, i) => (
            <a
              key={i}
              href={c.href || '#'}
              target={c.href && c.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener"
              className="exp-item"
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr auto',
                textDecoration: 'none',
                color: 'inherit',
                alignItems: 'center',
                padding: '20px 24px',
              }}
              onMouseEnter={() => Audio_.hover()}
              onClick={() => Audio_.select()}
            >
              <div className="exp-period">{c.k}</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 16, color: 'var(--blue-glow)', letterSpacing: '0.06em' }}>{c.v}</div>
              {c.href && <div style={{ color: 'var(--cyan)', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.2em' }}>OPEN ▸</div>}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
