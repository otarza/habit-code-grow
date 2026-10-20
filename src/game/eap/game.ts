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
  VAN_W,
  VAN_X,
  VIEW_H,
  VIEW_W,
  WORLD_W,
} from "./constants";
import { drawForest } from "./forest";
import { createGoblin, drawGoblin, drawLava, updateGoblin, type Goblin, type LavaBall } from "./goblin";
import { createGrave, drawBeam, drawHero, updateHero, type Beam, type Hero, type Input } from "./grave";

type Particle = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number; color: string };
type FloatText = { x: number; y: number; text: string; life: number; color: string };

export type GameState = {
  status: "playing" | "won" | "lost";
  grave: Hero;
  goblin: Goblin;
  beams: Beam[];
  lava: LavaBall[];
  particles: Particle[];
  texts: FloatText[];
  camX: number;
  vanHint: number; // seconds to show the "van won't start" hint
  driveOff: number; // van drive-away animation progress
};

export const createGame = (): GameState => ({
  status: "playing",
  grave: createGrave(),
  goblin: createGoblin(),
  beams: [],
  lava: [],
  particles: [],
  texts: [],
  camX: 0,
  vanHint: 0,
  driveOff: 0,
});

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

export const updateGame = (game: GameState, input: Input, dt: number) => {
  const { grave, goblin } = game;

  if (game.status === "won") {
    game.driveOff += dt;
    return;
  }
  if (game.status === "lost") return;

  updateHero(grave, input, dt, game.beams);
  updateGoblin(goblin, grave, dt, game.lava);

  // Yellow beams
  for (const beam of game.beams) {
    beam.x += beam.vx * dt;
    beam.y += beam.vy * dt;
    beam.life -= dt;
    if (goblin.alive && hitsBox(beam.x, beam.y, beam.size / 2, goblin.x, goblin.y, goblin.w + 6, goblin.h + 6)) {
      beam.life = 0;
      goblin.hp = Math.max(0, goblin.hp - beam.damage);
      goblin.hurtFlash = 0.12;
      steam(game, beam.x, beam.y, 4 + Math.round(beam.size));
      game.texts.push({ x: goblin.x, y: goblin.y - goblin.h - 34, text: `-${beam.damage}`, life: 0.8, color: COLORS.beam });
      if (goblin.hp <= 0) {
        goblin.alive = false;
        steam(game, goblin.x, goblin.y - goblin.h / 2, 60);
        burst(game, goblin.x, goblin.y - goblin.h / 2, 30, "#5fae3c", 220, 4);
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
    if (beam.y > FLOOR_Y) {
      beam.life = 0;
      burst(game, beam.x, FLOOR_Y, 5, COLORS.beam, 120, 2);
    }
  }
  game.beams = game.beams.filter((b) => b.life > 0);

  // Lava balls
  for (const ball of game.lava) {
    ball.vy += LAVA_GRAVITY * dt;
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;
    if (Math.random() < 0.5) {
      game.particles.push({ x: ball.x, y: ball.y, vx: 0, vy: -20, life: 0.3, maxLife: 0.3, size: 3, color: COLORS.lava });
    }
    if (grave.invuln <= 0 && hitsBox(ball.x, ball.y, LAVA_RADIUS, grave.x, grave.y, grave.w, grave.h)) {
      grave.hp = Math.max(0, grave.hp - LAVA_DAMAGE);
      grave.invuln = HIT_INVULN;
      burst(game, ball.x, ball.y, 14, COLORS.lava, 200, 3);
      game.texts.push({ x: grave.x, y: grave.y - grave.h - 34, text: `-${LAVA_DAMAGE}`, life: 0.8, color: COLORS.hp });
      ball.y = Infinity;
      if (grave.hp <= 0) game.status = "lost";
    } else if (ball.y >= FLOOR_Y) {
      burst(game, ball.x, FLOOR_Y, 10, COLORS.lava, 160, 3);
      ball.y = Infinity;
    }
  }
  game.lava = game.lava.filter((b) => Number.isFinite(b.y));

  // Reaching the van
  game.vanHint = Math.max(0, game.vanHint - dt);
  if (grave.x > VAN_X) {
    if (goblin.alive) {
      game.vanHint = 0.5;
    } else {
      game.status = "won";
      game.lava = [];
    }
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

  game.camX = Math.max(0, Math.min(WORLD_W - VIEW_W, grave.x - VIEW_W / 2));
};

const drawVan = (ctx: CanvasRenderingContext2D, camX: number, offset: number) => {
  const x = VAN_X - camX + offset;
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

  // Boss bar
  if (goblin.awake && goblin.alive) {
    const w = 420;
    const x = (VIEW_W - w) / 2;
    ctx.fillStyle = "#ff8a5a";
    ctx.font = "bold 14px monospace";
    ctx.textAlign = "center";
    ctx.fillText(goblin.name, VIEW_W / 2, 30);
    bar(ctx, x, 36, w, 16, goblin.hp / GOBLIN_MAX_HP, COLORS.hp, "");
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
  ctx.font = "bold 48px monospace";
  ctx.fillText(title, VIEW_W / 2, VIEW_H / 2 - 10);
  ctx.fillStyle = "#e6e9ef";
  ctx.font = "18px monospace";
  ctx.fillText(sub, VIEW_W / 2, VIEW_H / 2 + 30);
};

export const drawGame = (ctx: CanvasRenderingContext2D, game: GameState, input: Input) => {
  const { camX } = game;
  drawForest(ctx, camX);

  const vanOffset = game.status === "won" ? Math.max(0, game.driveOff - 0.6) ** 2 * 400 : 0;
  drawVan(ctx, camX, vanOffset);
  drawGoblin(ctx, game.goblin, camX);
  if (game.status !== "won") drawHero(ctx, game.grave, input, camX);
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

  if (game.status === "lost") drawOverlay(ctx, "GRAVE WAS MELTED", "Press R or click to try again", COLORS.hp);
  if (game.status === "won" && game.driveOff > 1.5)
    drawOverlay(ctx, "LEVEL COMPLETE", "Grave escaped in the EAP van — press R or click to play again", COLORS.accent);
};
