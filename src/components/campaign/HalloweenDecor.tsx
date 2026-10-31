import { type CSSProperties } from "react";

// Decorative Halloween layer for /ai-starter (Oct 31 + the 3-hour extension).
// Pure CSS animation, pointer-events none, hidden from assistive tech; motion stops under prefers-reduced-motion.

const BAT_PATH = "M50 38c-3-9-9-14-16-14 2 4 2 8 0 12-6-8-16-12-26-10 7 3 12 8 14 15-4 0-7 2-9 5 7-1 13 1 18 6 1-4 4-7 8-8l3 8 3-8c4 1 7 4 8 8 5-5 11-7 18-6-2-3-5-5-9-5 2-7 7-12 14-15-10-2-20 2-26 10-2-4-2-8 0-12-7 0-13 5-16 14Z";

const BATS = [
  { top: "9%", delay: "0s", dur: "19s", size: 46, flap: "0.55s" },
  { top: "17%", delay: "-7s", dur: "24s", size: 30, flap: "0.42s" },
  { top: "28%", delay: "-13s", dur: "21s", size: 38, flap: "0.5s" },
  { top: "6%", delay: "-4s", dur: "28s", size: 24, flap: "0.38s" },
  { top: "40%", delay: "-17s", dur: "26s", size: 34, flap: "0.47s" },
  { top: "23%", delay: "-21s", dur: "17s", size: 52, flap: "0.6s" },
] as const;

const PUMPKINS = [
  { left: "2%", bottom: "4%", size: 54, delay: "0s" },
  { right: "3%", bottom: "6%", size: 68, delay: "-0.7s" },
  { left: "9%", bottom: "1%", size: 36, delay: "-1.3s" },
  { right: "12%", bottom: "1%", size: 40, delay: "-0.4s" },
] as const;

// Spiders crawling along the viewport edges: path (edge), travel time, size, start offset.
const CRAWLERS = [
  { edge: "bottom", dur: "26s", delay: "-6s", size: 26 },
  { edge: "right", dur: "22s", delay: "-15s", size: 22 },
  { edge: "top", dur: "34s", delay: "-20s", size: 20 },
] as const;

export function HalloweenDecor() {
  return <>
  <div className="starter-halloween starter-halloween--back" aria-hidden="true">
    <span className="starter-halloween__moon" />
    <svg className="starter-halloween__web starter-halloween__web--left" viewBox="0 0 120 120" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.2">
        {[0, 1, 2, 3, 4, 5].map(i => <line key={i} x1="0" y1="0" x2={Math.cos(i * Math.PI / 10) * 120} y2={Math.sin(i * Math.PI / 10) * 120} />)}
        {[26, 48, 70, 92, 114].map(r => <path key={r} d={`M${r} 0 ${[1, 2, 3, 4].map(i => `Q${Math.cos((i - 0.5) * Math.PI / 10) * r * 0.9} ${Math.sin((i - 0.5) * Math.PI / 10) * r * 0.9} ${Math.cos(i * Math.PI / 10) * r} ${Math.sin(i * Math.PI / 10) * r}`).join(" ")} Q${Math.cos(4.5 * Math.PI / 10) * r * 0.9} ${Math.sin(4.5 * Math.PI / 10) * r * 0.9} 0 ${r}`} />)}
      </g>
    </svg>
    <span className="starter-halloween__spider">🕷️</span>
  </div>
  <div className="starter-halloween" aria-hidden="true">
    {BATS.map((bat, i) => <span key={i} className="starter-halloween__bat"
      style={{ top: bat.top, "--bat-delay": bat.delay, "--bat-dur": bat.dur, "--bat-size": `${bat.size}px`, "--bat-flap": bat.flap } as CSSProperties}>
      <svg viewBox="0 0 100 60" focusable="false"><path d={BAT_PATH} fill="currentColor" /></svg>
    </span>)}
    {CRAWLERS.map((c, i) => <span key={i} className={`starter-halloween__crawler starter-halloween__crawler--${c.edge}`}
      style={{ "--crawl-dur": c.dur, "--crawl-delay": c.delay, fontSize: c.size } as CSSProperties}><i>🕷️</i></span>)}
    {PUMPKINS.map((p, i) => {
      const style: Record<string, string | number> = { bottom: p.bottom, fontSize: p.size, "--pumpkin-delay": p.delay };
      if ("left" in p) style.left = p.left; else style.right = p.right;
      return <span key={i} className="starter-halloween__pumpkin" style={style as CSSProperties}>🎃</span>;
    })}
  </div>
  </>;
}
