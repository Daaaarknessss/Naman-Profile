// Synthesised menu blips via WebAudio. No external assets.
const Audio_ = (() => {
  let ctx = null;
  let enabled = true;

  const ensure = () => {
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { ctx = null; }
    }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  };

  const tone = (freq, dur, type = 'sine', vol = 0.08, slide = null) => {
    if (!enabled) return;
    const c = ensure(); if (!c) return;
    const t0 = c.currentTime;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(c.destination);
    o.start(t0); o.stop(t0 + dur + 0.02);
  };

  return {
    setEnabled(v) { enabled = !!v; },
    isEnabled() { return enabled; },
    hover()  { tone(880, 0.06, 'square', 0.04); },
    select() { tone(520, 0.08, 'square', 0.07); tone(780, 0.10, 'sine', 0.05, 1100); },
    back()   { tone(420, 0.09, 'square', 0.06, 280); },
    flash()  { tone(1200, 0.05, 'sawtooth', 0.05); setTimeout(() => tone(660, 0.08, 'square', 0.05), 60); },
    tick()   { tone(1500, 0.02, 'square', 0.025); },
  };
})();

export default Audio_;
