import {
  COLORS,
  FLOOR_Y,
  GRAVITY,
  UNSTABLE_EMERGE_TIME,
  UNSTABLE_MAX_HP,
  UNSTABLE_SPEED,
  WORLD_W,
} from "./constants";
import type { Hero } from "./grave";

// THE UNSTABLE: glowing, flickering blob parasites that burst out of the ground.
export type Unstable = {
  x: number;
  y: number; // feet position
  vy: number;
  w: number;
  h: number;
  hp: number;
  state: "emerging" | "active";
  t: number; // time in the current state
  hopCooldown: number;
  hurtFlash: number;
  seed: number;
};

export const createUnstable = (x: number): Unstable => ({
  x,
  y: FLOOR_Y,
  vy: 0,
  w: 40,
  h: 40,
  hp: UNSTABLE_MAX_HP,
  state: "emerging",
  t: 0,
  hopCooldown: 0.6 + Math.random(),
  hurtFlash: 0,
  seed: Math.random() * 1000,
});

// Only hittable once mostly out of the ground
export const isHittable = (u: Unstable) => u.state === "active" || u.t > UNSTABLE_EMERGE_TIME * 0.5;

// Returns true if it touched Grave this frame (caller applies damage)
export const updateUnstable = (u: Unstable, hero: Hero, dt: number) => {
  u.t += dt;
  u.hurtFlash = Math.max(0, u.hurtFlash - dt);

  if (u.state === "emerging") {
    if (u.t >= UNSTABLE_EMERGE_TIME) {
      u.state = "active";
      u.t = 0;
    }
    return false;
  }

  // Jittery crawl toward Grave — they can't move in a straight line
  const dir = Math.sign(hero.x - u.x);
  const jitter = Math.sin(u.t * 9 + u.seed) * 0.6;
  u.x += (dir + jitter) * UNSTABLE_SPEED * dt;
  u.x = Math.max(20, Math.min(WORLD_W - 20, u.x));

  u.hopCooldown -= dt;
  if (u.hopCooldown <= 0 && u.y >= FLOOR_Y) {
    u.vy = -380 - Math.random() * 200;
    u.hopCooldown = 0.8 + Math.random() * 1.4;
  }
  u.vy += GRAVITY * dt;
  u.y += u.vy * dt;
  if (u.y >= FLOOR_Y) {
    u.y = FLOOR_Y;
    u.vy = 0;
  }

  const touching =
    hero.invuln <= 0 &&
    Math.abs(hero.x - u.x) < (hero.w + u.w) / 2 - 4 &&
    u.y > hero.y - hero.h &&
    u.y - u.h < hero.y;
  if (touching) {
    // Bounce back after biting so it can't stay stuck on Grave
    u.x -= dir * 70;
    u.vy = -360;
    u.hopCooldown = 1.2;
  }
  return touching;
};

const blobPath = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, time: number, seed: number) => {
  ctx.beginPath();
  const points = 18;
  for (let i = 0; i <= points; i++) {
    const a = (i / points) * Math.PI * 2;
    const wobble = Math.sin(a * 3 + time * 6 + seed) * 0.12 + Math.sin(a * 5 - time * 9 + seed) * 0.07;
    const rr = r * (1 + wobble);
    const px = cx + Math.cos(a) * rr;
    const py = cy + Math.sin(a) * rr * 0.85;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
};

export const drawUnstable = (ctx: CanvasRenderingContext2D, u: Unstable, hero: Hero, camX: number) => {
  const x = u.x - camX;
  const time = performance.now() / 1000;

  // Glowing crack in the ground where it came out
  if (u.state === "emerging") {
    ctx.save();
    ctx.strokeStyle = COLORS.unstable;
    ctx.shadowColor = COLORS.unstable;
    ctx.shadowBlur = 12;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 30, FLOOR_Y + 2);
    ctx.lineTo(x - 12, FLOOR_Y - 2);
    ctx.lineTo(x, FLOOR_Y + 4);
    ctx.lineTo(x + 14, FLOOR_Y - 1);
    ctx.lineTo(x + 30, FLOOR_Y + 3);
    ctx.stroke();
    ctx.restore();
  }

  // While emerging, rise out of the ground (clip everything below the surface)
  const rise = u.state === "emerging" ? Math.min(1, u.t / UNSTABLE_EMERGE_TIME) : 1;
  const feet = u.y + (1 - rise) * (u.h + 10);
  const r = u.w / 2;
  const cy = feet - r * 0.9;

  ctx.save();
  ctx.beginPath();
  ctx.rect(x - 60, 0, 120, FLOOR_Y + 1);
  ctx.clip();

  // Flicker: occasionally skip to a ghosted, offset frame (they're unstable)
  const glitch = Math.sin(time * 23 + u.seed) > 0.93;
  const gx = glitch ? (Math.random() - 0.5) * 8 : 0;

  // Chromatic split copies
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = "#3ff2ff";
  blobPath(ctx, x + gx - 3, cy, r, time, u.seed);
  ctx.fill();
  ctx.fillStyle = "#ff3fd2";
  blobPath(ctx, x + gx + 3, cy, r, time, u.seed);
  ctx.fill();

  // Body
  ctx.globalAlpha = glitch ? 0.6 : 1;
  const g = ctx.createRadialGradient(x, cy - 4, 2, x, cy, r * 1.2);
  g.addColorStop(0, u.hurtFlash > 0 ? "#ffffff" : "#f6d7ff");
  g.addColorStop(0.45, u.hurtFlash > 0 ? "#ffffff" : COLORS.unstable);
  g.addColorStop(1, "#3a0c5a");
  ctx.fillStyle = g;
  ctx.shadowColor = COLORS.unstable;
  ctx.shadowBlur = 18;
  blobPath(ctx, x + gx, cy, r, time, u.seed);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Little feeler strands along the bottom
  ctx.strokeStyle = COLORS.unstable;
  ctx.lineWidth = 2;
  for (let i = -2; i <= 2; i++) {
    const sx = x + gx + i * 7;
    ctx.beginPath();
    ctx.moveTo(sx, cy + r * 0.6);
    ctx.quadraticCurveTo(sx + Math.sin(time * 8 + i + u.seed) * 5, cy + r * 0.9, sx + Math.sin(time * 5 + i) * 3, feet);
    ctx.stroke();
  }

  // One big eye that tracks Grave
  const look = Math.max(-1, Math.min(1, (hero.x - u.x) / 200));
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.ellipse(x + gx + look * 4, cy - 3, 8, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#14051f";
  ctx.beginPath();
  ctx.ellipse(x + gx + look * 7, cy - 2, 3, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Small health bar once it's out and hurt
  if (u.state === "active" && u.hp < UNSTABLE_MAX_HP) {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(x - 16, feet - u.h - 14, 32, 4);
    ctx.fillStyle = COLORS.hp;
    ctx.fillRect(x - 16, feet - u.h - 14, (32 * u.hp) / UNSTABLE_MAX_HP, 4);
  }
};
