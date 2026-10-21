import {
  COLORS,
  FLOOR_Y,
  GOBLIN_KEEP_DISTANCE,
  GOBLIN_MAX_HP,
  GOBLIN_SCALE,
  GOBLIN_SPEED,
  GOBLIN_START_X,
  GOBLIN_WAKE_RANGE,
  GRAVITY,
  LAVA_FLIGHT_TIME,
  LAVA_GRAVITY,
  LAVA_RADIUS,
  WORLD_W,
} from "./constants";
import type { Hero } from "./grave";

export type Goblin = {
  name: string;
  x: number;
  y: number; // feet position
  vy: number;
  w: number;
  h: number;
  facing: 1 | -1;
  hp: number;
  awake: boolean;
  alive: boolean;
  throwCooldown: number;
  throwAnim: number; // >0 while the throwing arm is raised
  hopCooldown: number;
  hurtFlash: number;
  walkTime: number;
};

export type LavaBall = { x: number; y: number; vx: number; vy: number };

export const createGoblin = (): Goblin => ({
  name: "DESTRUCTION MAKER",
  x: GOBLIN_START_X,
  y: FLOOR_Y,
  vy: 0,
  w: 28 * GOBLIN_SCALE,
  h: 40 * GOBLIN_SCALE,
  facing: -1,
  hp: GOBLIN_MAX_HP,
  awake: false,
  alive: true,
  throwCooldown: 1.2,
  throwAnim: 0,
  hopCooldown: 1.5,
  hurtFlash: 0,
  walkTime: 0,
});

const throwLava = (goblin: Goblin, hero: Hero, lava: LavaBall[]) => {
  // Lob an arc that lands roughly where Grave is standing (slightly randomised)
  const hx = goblin.x + 14 * goblin.facing;
  const hy = goblin.y - goblin.h - 6;
  const targetX = hero.x + (Math.random() - 0.5) * 80;
  const t = LAVA_FLIGHT_TIME * (0.85 + Math.random() * 0.3);
  const vx = (targetX - hx) / t;
  const vy = (FLOOR_Y - 30 - hy - 0.5 * LAVA_GRAVITY * t * t) / t;
  lava.push({ x: hx, y: hy, vx, vy });
};

export const updateGoblin = (goblin: Goblin, hero: Hero, dt: number, lava: LavaBall[]) => {
  if (!goblin.alive) return;
  goblin.hurtFlash = Math.max(0, goblin.hurtFlash - dt);
  goblin.throwAnim = Math.max(0, goblin.throwAnim - dt);

  const dx = hero.x - goblin.x;
  if (!goblin.awake) {
    if (Math.abs(dx) < GOBLIN_WAKE_RANGE) goblin.awake = true;
    return;
  }
  goblin.facing = dx >= 0 ? 1 : -1;

  // Keep a throwing distance from Grave
  const side = dx >= 0 ? -1 : 1;
  const targetX = hero.x + side * GOBLIN_KEEP_DISTANCE;
  const move = Math.sign(targetX - goblin.x);
  if (Math.abs(targetX - goblin.x) > 10) {
    goblin.x += move * GOBLIN_SPEED * dt;
    goblin.walkTime += dt;
  }
  goblin.x = Math.max(40, Math.min(WORLD_W - 40, goblin.x));

  // Random hops
  goblin.hopCooldown -= dt;
  if (goblin.hopCooldown <= 0 && goblin.y >= FLOOR_Y) {
    goblin.vy = -520;
    goblin.hopCooldown = 1.2 + Math.random() * 1.8;
  }
  goblin.vy += GRAVITY * dt;
  goblin.y += goblin.vy * dt;
  if (goblin.y >= FLOOR_Y) {
    goblin.y = FLOOR_Y;
    goblin.vy = 0;
  }

  goblin.throwCooldown -= dt;
  if (goblin.throwCooldown <= 0) {
    throwLava(goblin, hero, lava);
    goblin.throwAnim = 0.25;
    goblin.throwCooldown = 1.3 + Math.random() * 0.8;
  }
};

export const drawGoblin = (ctx: CanvasRenderingContext2D, goblin: Goblin, camX: number) => {
  if (!goblin.alive) return;
  const x = Math.round(goblin.x - camX);
  const feet = Math.round(goblin.y);
  const step = Math.sin(goblin.walkTime * 16) * 3;
  const skin = goblin.hurtFlash > 0 ? "#ffffff" : "#d4372b";

  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath();
  ctx.ellipse(x, FLOOR_Y + 2, 16 * GOBLIN_SCALE, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(x, feet);
  ctx.scale(goblin.facing * GOBLIN_SCALE, GOBLIN_SCALE);

  // Legs
  ctx.fillStyle = skin;
  ctx.fillRect(-8, -12, 6, 12 + step);
  ctx.fillRect(2, -12, 6, 12 - step);
  // Ragged tunic
  ctx.fillStyle = goblin.hurtFlash > 0 ? "#ffffff" : "#3a2618";
  ctx.fillRect(-11, -28, 22, 18);
  ctx.fillRect(-11, -10, 5, 3);
  ctx.fillRect(1, -10, 6, 3);
  // Head with big pointy ears
  ctx.fillStyle = skin;
  ctx.fillRect(-10, -42, 20, 15);
  ctx.beginPath();
  ctx.moveTo(-10, -38);
  ctx.lineTo(-20, -44);
  ctx.lineTo(-10, -32);
  ctx.moveTo(10, -38);
  ctx.lineTo(20, -44);
  ctx.lineTo(10, -32);
  ctx.fill();
  // Glowing red eyes and a grin
  ctx.fillStyle = "#ffd23a";
  ctx.fillRect(1, -38, 4, 3);
  ctx.fillRect(-5, -38, 3, 3);
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(-3, -31, 9, 2);
  // Throwing arm holding a lava ball
  ctx.fillStyle = skin;
  if (goblin.throwAnim > 0) {
    ctx.fillRect(8, -48, 5, 22);
  } else {
    ctx.fillRect(9, -26, 5, 12);
    ctx.fillStyle = COLORS.lava;
    ctx.beginPath();
    ctx.arc(12, -14, 7, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Name and small health bar above the goblin
  if (goblin.awake) {
    const w = 46;
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(x - w / 2, feet - goblin.h - 26, w, 5);
    ctx.fillStyle = COLORS.hp;
    ctx.fillRect(x - w / 2, feet - goblin.h - 26, (w * goblin.hp) / GOBLIN_MAX_HP, 5);
  }
};

export const drawLava = (ctx: CanvasRenderingContext2D, ball: LavaBall, camX: number) => {
  const x = ball.x - camX;
  ctx.save();
  ctx.shadowColor = COLORS.lava;
  ctx.shadowBlur = 14;
  const g = ctx.createRadialGradient(x - 2, ball.y - 2, 1, x, ball.y, LAVA_RADIUS);
  g.addColorStop(0, "#fff3a0");
  g.addColorStop(0.5, "#ffa21a");
  g.addColorStop(1, "#c4260a");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, ball.y, LAVA_RADIUS, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};
