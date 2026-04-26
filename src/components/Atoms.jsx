import { useEffect, useState } from 'react';

export function Clock() {
  const [t, setT] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n) => String(n).padStart(2, '0');
  const d = t;
  const dateStr = `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
  const timeStr = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  return (
    <div className="clock">
      <span style={{ color: 'var(--ink-dim)' }}>SYS // </span>{dateStr} &nbsp; {timeStr}
    </div>
  );
}

export function Hud() {
  return (
    <div className="hud">
      <div className="left">
        <div className="hud-tag"><span className="dot" />OPERATIVE PROFILE LOADED</div>
      </div>
      <div className="right">
        <Clock />
      </div>
    </div>
  );
}

export function Foot({ context }) {
  return (
    <div className="foot">
      <div className="hints">
        {context === 'menu' ? (
          <>
            <span><span className="key">↑↓</span>NAVIGATE</span>
            <span><span className="key">↵</span>SELECT</span>
            <span><span className="key">M</span>MUTE</span>
          </>
        ) : (
          <>
            <span><span className="key">ESC</span>BACK</span>
            <span><span className="key">M</span>MUTE</span>
          </>
        )}
      </div>
      <div className="brand">v1.0 // BUILD 2026.04</div>
    </div>
  );
}

export function Corners() {
  return (
    <>
      <div className="corner tl" />
      <div className="corner tr" />
      <div className="corner bl" />
      <div className="corner br" />
    </>
  );
}

export function Background() {
  return (
    <div className="bg">
      <div className="bg-orb a" />
      <div className="bg-orb b" />
      <div className="bg-grid" />
      <div className="bg-stripes" />
      <div className="bg-noise" />
    </div>
  );
}

export function Flash({ trigger }) {
  if (!trigger) return null;
  return (
    <div className="flash" key={trigger}>
      <div className="pane" />
      <div className="pane" />
      <div className="pane" />
      <div className="pane" />
    </div>
  );
}

export function StatBar({ name, lvl, delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => setW(lvl), 50 + delay);
    return () => clearTimeout(id);
  }, [lvl, delay]);
  return (
    <div className="stat">
      <div className="name">{name}</div>
      <div className="lvl">LV.<b>{lvl}</b></div>
      <div className="bar"><div className="fill" style={{ width: w + '%' }} /></div>
    </div>
  );
}

export function Ring({ lbl, val, suffix }) {
  const [shown, setShown] = useState(0);
  const target = typeof val === 'number' ? val : parseFloat(val) || 0;
  useEffect(() => {
    let raf, start;
    const dur = 900;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / dur);
      setShown(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  const r = 32, c = 2 * Math.PI * r;
  const max = typeof val === 'string' ? 10 : Math.max(target, 12);
  const dash = (Math.min(target, max) / max) * c;

  const display = typeof val === 'string'
    ? target.toFixed(1)
    : (suffix ? Math.round(shown) : Math.round(shown));

  return (
    <div className="ring">
      <svg viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(80,130,220,0.15)" strokeWidth="3" />
        <circle cx="40" cy="40" r={r} fill="none"
          stroke="url(#ringG)" strokeWidth="3" strokeLinecap="square"
          strokeDasharray={`${(dash * shown / target) || 0} ${c}`}
          transform="rotate(-90 40 40)" />
        <defs>
          <linearGradient id="ringG" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#2c7bff" />
            <stop offset="1" stopColor="#62e6ff" />
          </linearGradient>
        </defs>
      </svg>
      <div className="ring-val">{display}{suffix || ''}</div>
      <div className="ring-lbl">{lbl}</div>
    </div>
  );
}

export function Silhouette() {
  return (
    <svg viewBox="0 0 200 280" preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id="sg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#4a9bff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#2c7bff" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="sg2" x1="0" x2="1">
          <stop offset="0" stopColor="#62e6ff" />
          <stop offset="1" stopColor="#2c7bff" />
        </linearGradient>
      </defs>
      <path d="M 100 90 L 160 130 L 180 280 L 20 280 L 40 130 Z" fill="url(#sg)" stroke="#4a9bff" strokeWidth="1.2" />
      <path d="M 100 90 L 130 110 L 100 140 L 70 110 Z" fill="#02040a" stroke="#62e6ff" strokeWidth="1.2" />
      <circle cx="100" cy="60" r="34" fill="#02040a" stroke="#4a9bff" strokeWidth="1.2" />
      <path d="M 66 60 Q 70 24 100 22 Q 134 26 138 64 L 132 50 L 122 58 L 116 44 L 104 56 L 92 42 L 84 58 L 72 48 Z"
        fill="#0a1730" stroke="#4a9bff" strokeWidth="1" />
      <rect x="74" y="60" width="52" height="6" fill="url(#sg2)" opacity="0.85" />
      <path d="M 100 170 L 112 188 L 100 206 L 88 188 Z" fill="none" stroke="#62e6ff" strokeWidth="1.2" />
      <circle cx="100" cy="188" r="3" fill="#62e6ff" />
      <path d="M 60 200 L 70 220 M 70 220 L 70 260" stroke="#4a9bff" strokeWidth="0.8" fill="none" opacity="0.7" />
      <path d="M 140 200 L 130 220 M 130 220 L 130 260" stroke="#4a9bff" strokeWidth="0.8" fill="none" opacity="0.7" />
    </svg>
  );
}
