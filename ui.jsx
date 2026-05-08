/* Small helper UI primitives + icons used by the calculator. */

const { useState, useEffect, useRef, useMemo, useCallback } = React;

/* ---------- Icons (line glyphs, gold-tinted) ---------- */
function Glyph({ name, size = 36, stroke = 1.6 }) {
  const s = { width: size, height: size, fill: 'none', stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'bow':
      return (
        <svg viewBox="0 0 48 48" {...s}>
          <path d="M10 6 C 28 16, 28 32, 10 42" />
          <path d="M10 6 L 38 24 L 10 42" />
          <path d="M14 24 L 38 24" />
        </svg>
      );
    case 'sword':
      return (
        <svg viewBox="0 0 48 48" {...s}>
          <path d="M10 38 L 32 16" />
          <path d="M30 14 L 38 6 L 42 10 L 34 18 Z" />
          <path d="M14 34 L 8 40 L 4 36 L 10 30" />
          <path d="M28 18 L 30 20" />
        </svg>
      );
    case 'staff':
      return (
        <svg viewBox="0 0 48 48" {...s}>
          <path d="M16 42 L 30 8" />
          <path d="M30 8 m -7 0 a 7 8 0 1 0 14 0 a 7 8 0 1 0 -14 0" />
          <path d="M30 12 L 30 4 M 26 8 L 34 8" />
        </svg>
      );
    case 'helm':
      return (
        <svg viewBox="0 0 48 48" {...s}>
          <path d="M8 28 C 8 16, 16 8, 24 8 C 32 8, 40 16, 40 28 L 40 36 L 8 36 Z" />
          <path d="M24 14 L 24 36" />
          <path d="M16 22 L 32 22" />
        </svg>
      );
    case 'plate':
      return (
        <svg viewBox="0 0 48 48" {...s}>
          <path d="M14 10 L 24 6 L 34 10 L 34 36 C 34 40, 30 42, 24 42 C 18 42, 14 40, 14 36 Z" />
          <path d="M24 10 L 24 42" />
          <path d="M14 22 L 34 22" />
        </svg>
      );
    case 'boots':
      return (
        <svg viewBox="0 0 48 48" {...s}>
          <path d="M14 8 L 22 8 L 22 28 L 38 36 L 38 42 L 8 42 L 8 14 Z" />
          <path d="M22 28 L 22 42" />
        </svg>
      );
    case 'jacket':
      return (
        <svg viewBox="0 0 48 48" {...s}>
          <path d="M16 8 L 24 14 L 32 8 L 40 12 L 38 22 L 34 20 L 34 42 L 14 42 L 14 20 L 10 22 L 8 12 Z" />
          <path d="M24 14 L 24 42" />
        </svg>
      );
    case 'hood':
      return (
        <svg viewBox="0 0 48 48" {...s}>
          <path d="M10 30 C 10 16, 16 8, 24 8 C 32 8, 38 16, 38 30 L 36 38 L 12 38 Z" />
          <path d="M16 30 C 18 22, 22 18, 24 18 C 26 18, 30 22, 32 30" />
        </svg>
      );
    case 'robe':
      return (
        <svg viewBox="0 0 48 48" {...s}>
          <path d="M16 8 L 24 12 L 32 8 L 40 14 L 36 22 L 34 22 L 38 42 L 10 42 L 14 22 L 12 22 L 8 14 Z" />
          <path d="M24 12 L 24 42" />
          <circle cx="24" cy="20" r="2" />
        </svg>
      );
    case 'shield':
      return (
        <svg viewBox="0 0 48 48" {...s}>
          <path d="M24 6 L 38 12 L 38 26 C 38 34, 32 40, 24 42 C 16 40, 10 34, 10 26 L 10 12 Z" />
          <path d="M18 22 L 24 28 L 32 18" />
        </svg>
      );
    case 'cape':
      return (
        <svg viewBox="0 0 48 48" {...s}>
          <path d="M14 8 L 34 8 L 38 14 L 36 42 L 12 42 L 10 14 Z" />
          <path d="M22 8 C 22 12, 26 12, 26 8" />
        </svg>
      );
    case 'planks':
      return (
        <svg viewBox="0 0 48 48" {...s}>
          <rect x="8" y="14" width="32" height="6" rx="1" />
          <rect x="8" y="22" width="32" height="6" rx="1" />
          <rect x="8" y="30" width="32" height="6" rx="1" />
          <path d="M14 17 L 14 17.5 M 22 17 L 22 17.5 M 30 17 L 30 17.5" />
        </svg>
      );
    case 'metal':
      return (
        <svg viewBox="0 0 48 48" {...s}>
          <path d="M10 30 L 14 22 L 34 22 L 38 30 Z" />
          <path d="M14 22 L 18 16 L 30 16 L 34 22" />
          <path d="M14 30 L 14 36 L 34 36 L 34 30" />
        </svg>
      );
    case 'leather':
      return (
        <svg viewBox="0 0 48 48" {...s}>
          <path d="M14 10 C 26 6, 36 12, 38 22 C 40 32, 34 40, 24 40 C 14 40, 8 32, 10 22 Z" />
          <path d="M16 18 L 18 18 M 28 16 L 30 16" />
        </svg>
      );
    case 'cloth':
      return (
        <svg viewBox="0 0 48 48" {...s}>
          <path d="M8 14 C 14 18, 22 18, 24 14 C 26 10, 34 10, 40 14 L 40 38 C 34 34, 26 34, 24 38 C 22 34, 14 34, 8 38 Z" />
          <path d="M24 14 L 24 38" />
        </svg>
      );
    case 'fleur':
      return (
        <svg viewBox="0 0 48 48" {...s}>
          <path d="M24 8 L 28 18 L 24 22 L 20 18 Z" />
          <path d="M24 22 C 18 22, 14 26, 14 32 C 14 36, 16 38, 18 38" />
          <path d="M24 22 C 30 22, 34 26, 34 32 C 34 36, 32 38, 30 38" />
          <path d="M24 22 L 24 40" />
          <path d="M16 32 L 32 32" />
        </svg>
      );
    case 'desert':
      return <svg viewBox="0 0 24 24" {...s}><path d="M3 18 L 7 12 L 10 16 L 14 8 L 21 18 Z" /><circle cx="17" cy="6" r="2" /></svg>;
    case 'forest':
      return <svg viewBox="0 0 24 24" {...s}><path d="M12 3 L 6 11 L 9 11 L 5 17 L 9 17 L 4 22 L 20 22 L 15 17 L 19 17 L 15 11 L 18 11 Z" /></svg>;
    case 'highlands':
      return <svg viewBox="0 0 24 24" {...s}><path d="M3 20 L 9 10 L 13 16 L 17 8 L 21 20 Z" /></svg>;
    case 'steppe':
      return <svg viewBox="0 0 24 24" {...s}><path d="M3 18 L 21 18 M 5 14 L 9 14 M 11 14 L 15 14 M 17 14 L 21 14 M 5 10 L 8 10 M 13 10 L 17 10" /></svg>;
    case 'swamp':
      return <svg viewBox="0 0 24 24" {...s}><path d="M3 18 C 7 14, 11 22, 15 16 C 17 14, 21 18, 21 18" /><path d="M8 12 L 8 8 M 14 14 L 14 6" /></svg>;
    case 'royal':
      return <svg viewBox="0 0 24 24" {...s}><path d="M4 18 L 6 8 L 10 14 L 12 6 L 14 14 L 18 8 L 20 18 Z" /><circle cx="6" cy="8" r="1" /><circle cx="12" cy="6" r="1" /><circle cx="18" cy="8" r="1" /></svg>;
    case 'mist':
      return <svg viewBox="0 0 24 24" {...s}><path d="M3 8 C 6 6, 10 10, 14 8 C 18 6, 21 10, 21 10" /><path d="M3 14 C 7 12, 12 16, 17 14 C 19 13, 21 14, 21 14" /><path d="M5 19 C 8 17, 13 21, 17 19" /></svg>;
    case 'info':
      return <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="9" /><path d="M12 11 L 12 17 M 12 7 L 12 7.5" /></svg>;
    case 'check':
      return <svg viewBox="0 0 24 24" {...s}><path d="M5 12 L 10 17 L 19 7" /></svg>;
    case 'warn':
      return <svg viewBox="0 0 24 24" {...s}><path d="M12 4 L 21 20 L 3 20 Z" /><path d="M12 11 L 12 15 M 12 17.5 L 12 17.6" /></svg>;
    case 'cross':
      return <svg viewBox="0 0 24 24" {...s}><path d="M6 6 L 18 18 M 18 6 L 6 18" /></svg>;
    case 'star':
      return <svg viewBox="0 0 24 24" {...s}><path d="M12 3 L 14.5 9 L 21 9.5 L 16 14 L 17.5 21 L 12 17.5 L 6.5 21 L 8 14 L 3 9.5 L 9.5 9 Z" /></svg>;
    case 'fleur-corner':
      return (
        <svg viewBox="0 0 80 80" {...s}>
          <path d="M40 12 C 40 28, 28 40, 12 40 M 40 12 C 40 28, 52 40, 68 40 M 40 12 L 40 32 M 28 28 L 52 28 M 32 22 C 32 28, 36 32, 40 32 C 44 32, 48 28, 48 22" />
          <circle cx="40" cy="40" r="3" />
        </svg>
      );
    default:
      return null;
  }
}

/* ---------- Tooltip ---------- */
function HelpTooltip({ text }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="tooltip" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onClick={() => setOpen(o => !o)}>
      <span className="help-trigger" role="button" tabIndex={0} aria-label="More info">i</span>
      {open && <span className="tooltip-bubble">{text}</span>}
    </span>
  );
}

/* ---------- Field label with optional help ---------- */
function FieldLabel({ children, help }) {
  return (
    <span className="field-label">
      {children}
      {help && <HelpTooltip text={help} />}
    </span>
  );
}

/* ---------- Silver formatter ---------- */
function fmtSilver(n) {
  if (n == null || isNaN(n)) return '—';
  const sign = n < 0 ? '-' : '';
  const a = Math.abs(Math.round(n));
  if (a >= 1_000_000) return sign + (a / 1_000_000).toFixed(2).replace(/\.?0+$/, '') + 'M';
  if (a >= 10_000) return sign + (a / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return sign + a.toLocaleString('fr-FR').replace(/\u202f/g, ' ');
}
function fmtSilverFull(n) {
  if (n == null || isNaN(n)) return '—';
  return Math.round(n).toLocaleString('fr-FR').replace(/\u202f/g, ' ');
}
function fmtPct(n, digits = 1) {
  if (n == null || isNaN(n)) return '—';
  return (n >= 0 ? '+' : '') + n.toFixed(digits) + '%';
}

/* ---------- Coin ---------- */
function Coin({ after }) {
  return <span className={'silver-coin' + (after ? ' coin-after' : '')}>S</span>;
}

window.AlbionUI = {
  Glyph, HelpTooltip, FieldLabel,
  fmtSilver, fmtSilverFull, fmtPct, Coin,
};
