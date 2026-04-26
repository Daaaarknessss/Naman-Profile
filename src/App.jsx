import { useState, useEffect, useCallback } from 'react';
import Audio_ from './audio';
import { Background, Corners, Hud, Foot, Flash } from './components/Atoms';
import {
  MainMenu, MENU_ITEMS,
  StatusScreen, SkillsScreen, ExpScreen, QuestScreen, ContactScreen,
} from './components/Screens';
import './App.css';

const SCREENS = {
  status:  StatusScreen,
  skills:  SkillsScreen,
  exp:     ExpScreen,
  quests:  QuestScreen,
  contact: ContactScreen,
};

const TWEAK_DEFAULTS = { sound: true, hue: 220, scanlines: true };

function useTweaks(defaults) {
  const [values, setValues] = useState(defaults);
  const setTweak = useCallback((key, val) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  }, []);
  return [values, setTweak];
}

function TweaksPanel({ t, setTweak }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="tweak-toggle-btn" onClick={() => setOpen((o) => !o)} title="Tweaks">
        ⚙
      </button>
      {open && (
        <div className="tweak-panel">
          <div className="tweak-head">
            <b>TWEAKS</b>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="tweak-body">
            <div className="tweak-section">Aesthetic</div>
            <label className="tweak-row">
              <span>Hue <span className="tweak-val">{t.hue}°</span></span>
              <input type="range" min={180} max={280} value={t.hue}
                onChange={(e) => setTweak('hue', Number(e.target.value))} />
            </label>
            <div className="tweak-row tweak-toggle-row">
              <span>Scanlines / grain</span>
              <button
                className={'tweak-toggle ' + (t.scanlines ? 'on' : '')}
                onClick={() => setTweak('scanlines', !t.scanlines)}
              ><i /></button>
            </div>
            <div className="tweak-section">Audio</div>
            <div className="tweak-row tweak-toggle-row">
              <span>Menu sounds</span>
              <button
                className={'tweak-toggle ' + (t.sound ? 'on' : '')}
                onClick={() => setTweak('sound', !t.sound)}
              ><i /></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = useState('menu');
  const [active, setActive] = useState(0);
  const [flash, setFlash] = useState(0);

  useEffect(() => { Audio_.setEnabled(!!t.sound); }, [t.sound]);

  useEffect(() => {
    const root = document.documentElement;
    const h = t.hue;
    root.style.setProperty('--blue', `oklch(0.62 0.18 ${h})`);
    root.style.setProperty('--blue-bright', `oklch(0.72 0.18 ${h})`);
    root.style.setProperty('--blue-glow', `oklch(0.82 0.14 ${h})`);
    root.style.setProperty('--cyan', `oklch(0.88 0.16 ${(h + 30) % 360})`);
  }, [t.hue]);

  useEffect(() => {
    const stripes = document.querySelector('.bg-stripes');
    if (stripes) stripes.style.opacity = t.scanlines ? '1' : '0';
    const noise = document.querySelector('.bg-noise');
    if (noise) noise.style.opacity = t.scanlines ? '1' : '0';
  }, [t.scanlines]);

  const navigate = useCallback((id) => {
    Audio_.select();
    Audio_.flash();
    setFlash((f) => f + 1);
    setTimeout(() => setRoute(id), 280);
  }, []);

  const goBack = useCallback(() => {
    if (route === 'menu') return;
    Audio_.back();
    setFlash((f) => f + 1);
    setTimeout(() => setRoute('menu'), 220);
  }, [route]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'm' || e.key === 'M') {
        setTweak('sound', !t.sound);
        return;
      }
      if (route === 'menu') {
        if (e.key === 'ArrowDown') {
          setActive((a) => { const n = (a + 1) % MENU_ITEMS.length; Audio_.hover(); return n; });
        } else if (e.key === 'ArrowUp') {
          setActive((a) => { const n = (a - 1 + MENU_ITEMS.length) % MENU_ITEMS.length; Audio_.hover(); return n; });
        } else if (e.key === 'Enter') {
          navigate(MENU_ITEMS[active].id);
        }
      } else {
        if (e.key === 'Escape') goBack();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [route, active, t.sound, navigate, goBack, setTweak]);

  const Screen = route !== 'menu' ? SCREENS[route] : null;

  return (
    <div className="app">
      <Background />
      <Corners />
      <Hud />
      {route === 'menu' ? (
        <MainMenu active={active} setActive={setActive} onSelect={navigate} />
      ) : (
        <Screen />
      )}
      <Foot context={route === 'menu' ? 'menu' : 'screen'} />
      <Flash trigger={flash} />
      <TweaksPanel t={t} setTweak={setTweak} />
    </div>
  );
}
