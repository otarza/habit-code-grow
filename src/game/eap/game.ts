import {
  BATTERY_MAX,
  COLORS,
  FLOOR_Y,
  GOBLIN_MAX_HP,
  GRAVE_MAX_HP,
  HIT_INVULN,
  LAVA_DAMAGE,
  LAVA_GRAVITY,
  LAVA_RADIUS,
  MAX_CHARGE,
  UNSTABLE_DAMAGE,
  UNSTABLE_MAX_ALIVE,
  UNSTABLE_SPAWN_INTERVAL,
  UNSTABLE_TOTAL,
  VAN_PARK_X,
  VAN_W,
  VAN_X,
  VIEW_H,
  VIEW_W,
  WORLD_W,
} from "./constants";
import { drawForest } from "./forest";
import { createGoblin, drawGoblin, drawLava, updateGoblin, type Goblin, type LavaBall } from "./goblin";
import { createGrave, drawBeam, drawHero, updateHero, type Beam, type Hero, type Input } from "./grave";
import { drawResting } from "./resting";
import { createUnstable, drawUnstable, isHittable, updateUnstable, type Unstable } from "./unstable";

type Particle = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number; color: string };
type FloatText = { x: number; y: number; text: string; life: number; color: string };

export type Level = 1 | 2;

const LEVEL_NAMES: Record<Level, string> = {
  1: "THE FOREST",
  2: "THE RESTING OF THE UNSTABLE",
};

// Story phases:
//   playing  -> driving (got in the van: checkpoint) -> title (place name) -> arriving (van pulls in) -> playing
const DRIVE_TIME = 2;
const TITLE_TIME = 3.2;
const ARRIVE_TIME = 1.5;

export type GameState = {
  level: Level;
  status: "playing" | "driving" | "title" | "arriving" | "won" | "lost";
  phaseTime: number;
  checkpoint: Level; // where Grave restarts after dying
  grave: Hero;
  goblin: Goblin;
  unstable: Unstable[];
  unstableSpawned: number;
  unstableEvaporated: number;
  spawnTimer: number;
  beams: Beam[];
  lava: LavaBall[];
  particles: Particle[];
  texts: FloatText[];
  camX: number;
  vanHint: number; // seconds to show the "van won't start" hint
};

const baseState = (level: Level, checkpoint: Level): GameState => ({
  level,
  status: "playing",
  phaseTime: 0,
  checkpoint,
  grave: createGrave(), // full health and battery
  goblin: createGoblin(),
  unstable: [],
  unstableSpawned: 0,
  unstableEvaporated: 0,
  spawnTimer: 1.5,
  beams: [],
  lava: [],
  particles: [],
  texts: [],
  camX: 0,
  vanHint: 0,
});

export const createGame = (): GameState => baseState(1, 1);

// Start a level straight from the van (used after the title card and when retrying a checkpoint)
export const arriveAt = (level: Level): GameState => {
  const game = baseState(level, level);
  game.status = "arriving";
  game.grave.x = VAN_PARK_X + VAN_W + 40;
  return game;
};

// R / click on the end screens
export const restartGame = (game: GameState): GameState =>
  game.status === "lost" && game.checkpoint !== 1 ? arriveAt(game.checkpoint) : createGame();

export const createInput = (): Input => ({
  left: false,
  right: false,
  jump: false,
  firing: false,
  aimX: 0,
  aimY: 0,
  aimWithMouse: false,
});

const burst = (game: GameState, x: number, y: number, count: number, color: string, speed: number, size: number) => {
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = speed * (0.3 + Math.random() * 0.7);
    const life = 0.4 + Math.random() * 0.5;
    game.particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - speed * 0.3, life, maxLife: life, size, color });
  }
};

// Steam puffs rise — used when the evaporator hits something
const steam = (game: GameState, x: number, y: number, count: number) => {
  for (let i = 0; i < count; i++) {
    const life = 0.6 + Math.random() * 0.8;
    game.particles.push({
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
      vx: (Math.random() - 0.5) * 60,
      vy: -40 - Math.random() * 80,
      life,
      maxLife: life,
      size: 6 + Math.random() * 8,
      color: "#dfe8ec",
    });
  }
};

const hitsBox = (px: number, py: number, r: number, cx: number, feet: number, w: number, h: number) =>
  px + r > cx - w / 2 && px - r < cx + w / 2 && py + r > feet - h && py - r < feet;

const hurtGrave = (game: GameState, damage: number, color: string) => {
  const { grave } = game;
  grave.hp = Math.max(0, grave.hp - damage);
  grave.invuln = HIT_INVULN;
  game.texts.push({ x: grave.x, y: grave.y - grave.h - 34, text: `-${damage}`, life: 0.8, color });
  if (grave.hp <= 0) game.status = "lost";
};

const updateForest = (game: GameState, dt: number) => {
  const { grave, goblin } = game;
  updateGoblin(goblin, grave, dt, game.lava);

  for (const beam of game.beams) {
    if (goblin.alive && hitsBox(beam.x, beam.y, beam.size / 2, goblin.x, goblin.y, goblin.w + 6, goblin.h + 6)) {
      beam.life = 0;
      goblin.hp = Math.max(0, goblin.hp - beam.damage);
      goblin.hurtFlash = 0.12;
      steam(game, beam.x, beam.y, 4 + Math.round(beam.size));
      game.texts.push({ x: goblin.x, y: goblin.y - goblin.h - 34, text: `-${beam.damage}`, life: 0.8, color: COLORS.beam });
      if (goblin.hp <= 0) {
        goblin.alive = false;
        steam(game, goblin.x, goblin.y - goblin.h / 2, 60);
        burst(game, goblin.x, goblin.y - goblin.h / 2, 30, "#d4372b", 220, 5);
        game.texts.push({ x: goblin.x, y: goblin.y - 80, text: "EVAPORATED!", life: 2, color: COLORS.accent });
      }
    }
    // Beams can also evaporate lava balls in mid-air
    for (const ball of game.lava) {
      if (Math.hypot(ball.x - beam.x, ball.y - beam.y) < LAVA_RADIUS + beam.size / 2 + 4) {
        ball.y = Infinity;
        steam(game, beam.x, beam.y, 6);
      }
    }
  }

  for (const ball of game.lava) {
    ball.vy += LAVA_GRAVITY * dt;
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;
    if (Math.random() < 0.5) {
      game.particles.push({ x: ball.x, y: ball.y, vx: 0, vy: -20, life: 0.3, maxLife: 0.3, size: 6, color: COLORS.lava });
    }
    if (grave.invuln <= 0 && hitsBox(ball.x, ball.y, LAVA_RADIUS, grave.x, grave.y, grave.w, grave.h)) {
      burst(game, ball.x, ball.y, 14, COLORS.lava, 200, 3);
      ball.y = Infinity;
      hurtGrave(game, LAVA_DAMAGE, COLORS.hp);
    } else if (ball.y >= FLOOR_Y) {
      burst(game, ball.x, FLOOR_Y, 10, COLORS.lava, 160, 3);
      ball.y = Infinity;
    }
  }
  game.lava = game.lava.filter((b) => Number.isFinite(b.y));

  // Getting in the van: checkpoint, refill, and drive to the next place
  game.vanHint = Math.max(0, game.vanHint - dt);
  if (grave.x > VAN_X) {
    if (goblin.alive) {
      game.vanHint = 0.5;
    } else {
      game.status = "driving";
      game.phaseTime = 0;
      game.checkpoint = 2;
      grave.hp = GRAVE_MAX_HP;
      grave.battery = BATTERY_MAX;
      game.lava = [];
      game.beams = [];
    }
  }
};

const updateResting = (game: GameState, dt: number) => {
  const { grave } = game;

  // THE UNSTABLE burst out of the ground near Grave
  game.spawnTimer -= dt;
  if (game.spawnTimer <= 0 && game.unstableSpawned < UNSTABLE_TOTAL && game.unstable.length < UNSTABLE_MAX_ALIVE) {
    const side = Math.random() < 0.5 ? -1 : 1;
    let x = grave.x + side * (150 + Math.random() * 300);
    if (x < VAN_PARK_X + VAN_W + 20 || x > WORLD_W - 40) x = grave.x - side * (150 + Math.random() * 300);
    x = Math.max(VAN_PARK_X + VAN_W + 20, Math.min(WORLD_W - 40, x));
    game.unstable.push(createUnstable(x));
    burst(game, x, FLOOR_Y, 12, "#5a4a6a", 160, 4);
    game.unstableSpawned++;
    game.spawnTimer = UNSTABLE_SPAWN_INTERVAL * (0.6 + Math.random() * 0.8);
  }

  for (const u of game.unstable) {
    if (updateUnstable(u, grave, dt)) hurtGrave(game, UNSTABLE_DAMAGE, COLORS.unstable);
    for (const beam of game.beams) {
      if (beam.life > 0 && isHittable(u) && hitsBox(beam.x, beam.y, beam.size / 2, u.x, u.y, u.w + 6, u.h + 6)) {
        beam.life = 0;
        u.hp = Math.max(0, u.hp - beam.damage);
        u.hurtFlash = 0.1;
        steam(game, beam.x, beam.y, 3 + Math.round(beam.size / 2));
        game.texts.push({ x: u.x, y: u.y - u.h - 24, text: `-${beam.damage}`, life: 0.7, color: COLORS.beam });
      }
    }
    if (u.hp <= 0) {
      steam(game, u.x, u.y - u.h / 2, 24);
      burst(game, u.x, u.y - u.h / 2, 16, COLORS.unstable, 200, 4);
      game.unstableEvaporated++;
    }
  }
  game.unstable = game.unstable.filter((u) => u.hp > 0);

  if (game.unstableEvaporated >= UNSTABLE_TOTAL) {
    game.status = "won";
    game.phaseTime = 0;
  }
};

export const updateGame = (game: GameState, input: Input, dt: number) => {
  game.phaseTime += dt;

  if (game.status === "driving" && game.phaseTime > DRIVE_TIME) {
    game.status = "title";
    game.phaseTime = 0;
  }
  if (game.status === "title" && game.phaseTime > TITLE_TIME) {
    // Swap in the next level's state in place so the caller's reference stays valid
    Object.assign(game, arriveAt(2));
    return;
  }
  if (game.status === "arriving" && game.phaseTime > ARRIVE_TIME) {
    game.status = "playing";
    game.phaseTime = 0;
  }

  if (game.status === "playing") {
    updateHero(game.grave, input, dt, game.beams);
    for (const beam of game.beams) {
      beam.x += beam.vx * dt;
      beam.y += beam.vy * dt;
      beam.life -= dt;
    }
    if (game.level === 1) updateForest(game, dt);
    else updateResting(game, dt);
    for (const beam of game.beams) {
      if (beam.life > 0 && beam.y > FLOOR_Y) {
        beam.life = 0;
        burst(game, beam.x, FLOOR_Y, 5, COLORS.beam, 120, 2);
      }
    }
    game.beams = game.beams.filter((b) => b.life > 0);
  }

  for (const p of game.particles) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;
  }
  game.particles = game.particles.filter((p) => p.life > 0);
  for (const t of game.texts) {
    t.y -= 40 * dt;
    t.life -= dt;
  }
  game.texts = game.texts.filter((t) => t.life > 0);

  game.camX = Math.max(0, Math.min(WORLD_W - VIEW_W, game.grave.x - VIEW_W / 2));
};

const drawVan = (ctx: CanvasRenderingContext2D, x: number) => {
  const y = FLOOR_Y;
  // Body
  ctx.fillStyle = "#e9ecef";
  ctx.fillRect(x, y - 92, VAN_W - 40, 74);
  ctx.beginPath();
  ctx.moveTo(x + VAN_W - 40, y - 92);
  ctx.lineTo(x + VAN_W - 10, y - 56);
  ctx.lineTo(x + VAN_W, y - 50);
  ctx.lineTo(x + VAN_W, y - 18);
  ctx.lineTo(x + VAN_W - 40, y - 18);
  ctx.fill();
  // Windshield
  ctx.fillStyle = "#7fb3c9";
  ctx.beginPath();
  ctx.moveTo(x + VAN_W - 38, y - 86);
  ctx.lineTo(x + VAN_W - 14, y - 58);
  ctx.lineTo(x + VAN_W - 38, y - 58);
  ctx.fill();
  // Company stripe and logo
  ctx.fillStyle = COLORS.accent;
  ctx.fillRect(x, y - 46, VAN_W, 6);
  ctx.font = "bold 22px monospace";
  ctx.textAlign = "center";
  ctx.fillText("EAP", x + 70, y - 58);
  // Wheels
  ctx.fillStyle = "#151515";
  for (const wx of [x + 38, x + VAN_W - 36]) {
    ctx.beginPath();
    ctx.arc(wx, y - 14, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#888";
    ctx.beginPath();
    ctx.arc(wx, y - 14, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#151515";
  }
  // Headlight
  ctx.fillStyle = "#ffe9a0";
  ctx.fillRect(x + VAN_W - 6, y - 46, 6, 8);
};

// World x of the van for the current level and phase
const vanWorldX = (game: GameState) => {
  if (game.level === 1) {
    const t = game.status === "driving" ? Math.max(0, game.phaseTime - 0.4) : 0;
    return VAN_X + t * t * 400;
  }
  if (game.status === "arriving") {
    const k = Math.min(1, game.phaseTime / ARRIVE_TIME);
    const ease = 1 - (1 - k) ** 3;
    return VAN_PARK_X - 700 * (1 - ease);
  }
  return VAN_PARK_X;
};

const bar = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, frac: number, color: string, label: string) => {
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = color;
  ctx.fillRect(x + 2, y + 2, Math.max(0, (w - 4) * frac), h - 4);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 11px monospace";
  ctx.textAlign = "left";
  ctx.fillText(label, x + 6, y + h - 5);
};

const drawHud = (ctx: CanvasRenderingContext2D, game: GameState) => {
  const { grave, goblin } = game;
  ctx.fillStyle = "rgba(10,14,22,0.7)";
  ctx.fillRect(12, 12, 250, 98);
  ctx.fillStyle = COLORS.accent;
  ctx.font = "bold 16px monospace";
  ctx.textAlign = "left";
  ctx.fillText("GRAVE", 22, 32);
  bar(ctx, 22, 40, 230, 18, grave.hp / GRAVE_MAX_HP, COLORS.hp, `HEALTH ${Math.ceil(grave.hp)}`);
  bar(
    ctx,
    22,
    62,
    230,
    18,
    grave.battery / BATTERY_MAX,
    grave.battery > 0 ? COLORS.battery : "#555",
    grave.battery > 0 ? `BATTERY ${Math.ceil(grave.battery)}%` : "BATTERY EMPTY — NO CHARGING",
  );
  bar(ctx, 22, 84, 230, 18, grave.charge / MAX_CHARGE, COLORS.beam, "CHARGE");

  if (game.level === 1 && goblin.awake && goblin.alive) {
    const w = 420;
    const x = (VIEW_W - w) / 2;
    ctx.fillStyle = "#ff8a5a";
    ctx.font = "bold 14px monospace";
    ctx.textAlign = "center";
    ctx.fillText(goblin.name, VIEW_W / 2, 30);
    bar(ctx, x, 36, w, 16, goblin.hp / GOBLIN_MAX_HP, COLORS.hp, "");
  }

  if (game.level === 2) {
    ctx.fillStyle = "rgba(10,14,22,0.7)";
    ctx.fillRect(VIEW_W - 262, 12, 250, 54);
    ctx.textAlign = "right";
    ctx.fillStyle = "#cfa8ff";
    ctx.font = "bold 12px monospace";
    ctx.fillText(LEVEL_NAMES[2], VIEW_W - 22, 32);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 16px monospace";
    ctx.fillText(`UNSTABLE EVAPORATED ${game.unstableEvaporated}/${UNSTABLE_TOTAL}`, VIEW_W - 22, 56);
  }

  ctx.fillStyle = "#9aa3b5";
  ctx.font = "12px monospace";
  ctx.textAlign = "right";
  ctx.fillText("Move A/D  Jump W/Space  Right-click: shoot (hold to charge)", VIEW_W - 14, VIEW_H - 12);

  if (game.vanHint > 0) {
    ctx.fillStyle = "#ffcf5a";
    ctx.font = "bold 18px monospace";
    ctx.textAlign = "center";
    ctx.fillText("The van won't start while Destruction Maker is around!", VIEW_W / 2, 150);
  }
};

const drawOverlay = (ctx: CanvasRenderingContext2D, title: string, sub: string, color: string) => {
  ctx.fillStyle = "rgba(5,8,14,0.65)";
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.textAlign = "center";
  ctx.fillStyle = color;
  ctx.font = "bold 44px monospace";
  ctx.fillText(title, VIEW_W / 2, VIEW_H / 2 - 10);
  ctx.fillStyle = "#e6e9ef";
  ctx.font = "18px monospace";
  ctx.fillText(sub, VIEW_W / 2, VIEW_H / 2 + 30);
};

const drawTitleCard = (ctx: CanvasRenderingContext2D, t: number) => {
  ctx.fillStyle = "#07040d";
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  const alpha = Math.min(1, t / 0.6, (TITLE_TIME - t) / 0.6);
  ctx.globalAlpha = Math.max(0, alpha);
  ctx.textAlign = "center";
  ctx.fillStyle = "#9aa3b5";
  ctx.font = "16px monospace";
  ctx.fillText("Checkpoint — health and battery refilled", VIEW_W / 2, VIEW_H / 2 - 70);
  ctx.fillStyle = "#cfa8ff";
  ctx.shadowColor = COLORS.unstable;
  ctx.shadowBlur = 24;
  ctx.font = "bold 40px monospace";
  ctx.fillText(LEVEL_NAMES[2], VIEW_W / 2, VIEW_H / 2);
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#e6e9ef";
  ctx.font = "18px monospace";
  ctx.fillText("Something is moving under the ground...", VIEW_W / 2, VIEW_H / 2 + 44);
  ctx.globalAlpha = 1;
};

export const drawGame = (ctx: CanvasRenderingContext2D, game: GameState, input: Input) => {
  if (game.status === "title") {
    drawTitleCard(ctx, game.phaseTime);
    return;
  }

  const { camX } = game;
  if (game.level === 1) drawForest(ctx, camX);
  else drawResting(ctx, camX);

  drawVan(ctx, vanWorldX(game) - camX);
  if (game.level === 1) drawGoblin(ctx, game.goblin, camX);
  for (const u of game.unstable) drawUnstable(ctx, u, game.grave, camX);
  if (game.status !== "driving" && game.status !== "arriving") drawHero(ctx, game.grave, input, camX);
  for (const ball of game.lava) drawLava(ctx, ball, camX);
  for (const beam of game.beams) drawBeam(ctx, beam, camX);

  for (const p of game.particles) {
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - camX - p.size / 2, p.y - p.size / 2, p.size, p.size);
  }
  ctx.globalAlpha = 1;
  for (const t of game.texts) {
    ctx.globalAlpha = Math.min(1, t.life * 2);
    ctx.fillStyle = t.color;
    ctx.font = "bold 16px monospace";
    ctx.textAlign = "center";
    ctx.fillText(t.text, t.x - camX, t.y);
  }
  ctx.globalAlpha = 1;

  drawHud(ctx, game);

  // Fade to black as the van drives off
  if (game.status === "driving") {
    ctx.fillStyle = `rgba(7,4,13,${Math.min(1, Math.max(0, (game.phaseTime - 1) / (DRIVE_TIME - 1)))})`;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  }

  if (game.status === "lost") {
    const where = game.checkpoint === 1 ? "Press R or click to try again" : "Press R or click to restart from the van";
    drawOverlay(ctx, "GRAVE WAS MELTED", where, COLORS.hp);
  }
  if (game.status === "won" && game.phaseTime > 1.2) {
    drawOverlay(ctx, "THE UNSTABLE ARE EVAPORATED", "To be continued... — press R or click to play again", COLORS.accent);
  }
};
