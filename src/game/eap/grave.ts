import {
  BATTERY_DRAIN,
  BATTERY_MAX,
  BEAM_MAX_DAMAGE,
  BEAM_MIN_DAMAGE,
  BEAM_SPEED,
  COLORS,
  FLOOR_Y,
  GRAVE_MAX_HP,
  GRAVITY,
  JUMP_SPEED,
  MAX_CHARGE,
  MOVE_SPEED,
  TAP_THRESHOLD,
  WORLD_W,
} from "./constants";

export type Input = {
  left: boolean;
  right: boolean;
  jump: boolean;
  action: boolean; // E pressed (used inside the van)
  down: boolean; // S / ↓ pressed (used inside the van)
  firing: boolean; // right mouse button (or touch fire) is held
  aimX: number; // world coordinates of the aim point
  aimY: number;
  aimWithMouse: boolean;
};

export type Hero = {
  name: string;
  x: number;
  y: number; // feet position
  vx: number;
  vy: number;
  w: number;
  h: number;
  facing: 1 | -1;
  onGround: boolean;
  walkTime: number;
  hp: number;
  invuln: number;
  battery: number;
  charging: boolean;
  chargeTime: number; // how long the fire button has been held
  charge: number; // stored charge in seconds, capped at MAX_CHARGE
};

export type Beam = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  size: number;
  life: number;
};

export const createGrave = (): Hero => ({
  name: "GRAVE",
  x: 200,
  y: FLOOR_Y,
  vx: 0,
  vy: 0,
  w: 36,
  h: 84,
  facing: 1,
  onGround: true,
  walkTime: 0,
  hp: GRAVE_MAX_HP,
  invuln: 0,
  battery: BATTERY_MAX,
  charging: false,
  chargeTime: 0,
  charge: 0,
});

// Where the evaporator is held, in world coordinates
const shoulder = (hero: Hero) => ({ x: hero.x + 10 * hero.facing, y: hero.y - 58 });

export const aimAngle = (hero: Hero, input: Input) => {
  if (!input.aimWithMouse) return hero.facing === 1 ? 0 : Math.PI;
  const s = shoulder(hero);
  return Math.atan2(input.aimY - s.y, input.aimX - s.x);
};

export const muzzle = (hero: Hero, input: Input) => {
  const s = shoulder(hero);
  const a = aimAngle(hero, input);
  return { x: s.x + Math.cos(a) * 34, y: s.y + Math.sin(a) * 34 };
};

export const updateHero = (hero: Hero, input: Input, dt: number, beams: Beam[]) => {
  const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  hero.vx = dir * MOVE_SPEED;
  if (input.aimWithMouse) hero.facing = input.aimX >= hero.x ? 1 : -1;
  else if (dir !== 0) hero.facing = dir as 1 | -1;

  if (input.jump && hero.onGround) {
    hero.vy = -JUMP_SPEED;
    hero.onGround = false;
  }
  input.jump = false; // one jump per key press

  hero.vy += GRAVITY * dt;
  hero.x += hero.vx * dt;
  hero.y += hero.vy * dt;

  if (hero.y >= FLOOR_Y) {
    hero.y = FLOOR_Y;
    hero.vy = 0;
    hero.onGround = true;
  }

  hero.x = Math.max(hero.w / 2, Math.min(WORLD_W - hero.w / 2, hero.x));
  hero.walkTime = hero.onGround && dir !== 0 ? hero.walkTime + dt : 0;
  hero.invuln = Math.max(0, hero.invuln - dt);

  // Evaporator: hold to charge (uses battery), release to fire
  if (input.firing) {
    hero.charging = true;
    hero.chargeTime += dt;
    if (hero.chargeTime > TAP_THRESHOLD && hero.battery > 0 && hero.charge < MAX_CHARGE) {
      hero.charge = Math.min(MAX_CHARGE, hero.charge + dt);
      hero.battery = Math.max(0, hero.battery - BATTERY_DRAIN * dt);
    }
  } else if (hero.charging) {
    const power = hero.charge / MAX_CHARGE;
    const a = aimAngle(hero, input);
    const m = muzzle(hero, input);
    beams.push({
      x: m.x,
      y: m.y,
      vx: Math.cos(a) * BEAM_SPEED,
      vy: Math.sin(a) * BEAM_SPEED,
      damage: Math.round(BEAM_MIN_DAMAGE + power * (BEAM_MAX_DAMAGE - BEAM_MIN_DAMAGE)),
      size: 4 + power * 10,
      life: 1.5,
    });
    hero.charging = false;
    hero.chargeTime = 0;
    hero.charge = 0;
  }
};

const drawEvaporator = (ctx: CanvasRenderingContext2D, hero: Hero) => {
  // Drawn along +x; caller rotates to the aim angle
  ctx.fillStyle = "#e6e9ef";
  ctx.fillRect(0, -4, 14, 8); // arm sleeve
  ctx.fillStyle = "#e0b48a";
  ctx.fillRect(12, -3, 6, 6); // hand
  ctx.fillStyle = "#5b6275";
  ctx.fillRect(14, -6, 22, 12); // body
  ctx.fillStyle = "#3a4050";
  ctx.fillRect(16, 6, 6, 6); // grip
  ctx.fillStyle = COLORS.beam;
  ctx.fillRect(34, -3, 5, 6); // emitter

  if (hero.charging && hero.charge > 0) {
    const power = hero.charge / MAX_CHARGE;
    const r = 4 + power * 10 + Math.sin(performance.now() / 40) * 1.5;
    ctx.save();
    ctx.globalAlpha = 0.35 + power * 0.5;
    ctx.fillStyle = COLORS.beam;
    ctx.shadowColor = COLORS.beam;
    ctx.shadowBlur = 20 * power + 6;
    ctx.beginPath();
    ctx.arc(40, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
};

export const drawHero = (ctx: CanvasRenderingContext2D, hero: Hero, input: Input, camX: number) => {
  const x = Math.round(hero.x - camX);
  const feet = Math.round(hero.y);
  const swing = Math.sin(hero.walkTime * 14) * 8;
  const step = hero.onGround ? swing / 2 : 0;

  // Blink while invulnerable after a hit
  if (hero.invuln > 0 && Math.floor(hero.invuln * 12) % 2 === 0) return;

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath();
  ctx.ellipse(x, FLOOR_Y + 2, 22, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(x, feet);
  ctx.scale(hero.facing, 1);

  // Legs (dark work trousers) and boots
  ctx.fillStyle = "#2b2f3a";
  ctx.fillRect(-12, -34, 10, 32 + step);
  ctx.fillRect(2, -34, 10, 32 - step);
  ctx.fillStyle = "#111";
  ctx.fillRect(-14 + step, -4, 14, 5);
  ctx.fillRect(0 - step, -4, 14, 5);

  // Back arm
  ctx.fillStyle = "#c9cdd6";
  ctx.fillRect(-20, -64, 7, 26 - swing / 3);

  // Body — EAP Corporation work jacket
  ctx.fillStyle = "#e6e9ef";
  ctx.fillRect(-16, -66, 32, 34);
  ctx.fillStyle = COLORS.accent;
  ctx.fillRect(-16, -50, 32, 4); // company stripe
  ctx.fillStyle = "#fff";
  ctx.fillRect(4, -62, 9, 11); // ID badge
  ctx.fillStyle = COLORS.accent;
  ctx.fillRect(5, -61, 7, 3);

  // Head, hair, eye
  ctx.fillStyle = "#e0b48a";
  ctx.fillRect(-11, -86, 22, 20);
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(-12, -90, 24, 7);
  ctx.fillRect(-12, -86, 6, 8);
  ctx.fillStyle = "#111";
  ctx.fillRect(4, -79, 3, 3);
  ctx.fillRect(2, -82, 7, 2);
  ctx.restore();

  // Front arm holding the evaporator, rotated toward the aim point
  const a = aimAngle(hero, input);
  ctx.save();
  ctx.translate(x + 10 * hero.facing, feet - 58);
  ctx.rotate(a);
  if (Math.cos(a) < 0) ctx.scale(1, -1); // keep the gadget upright when aiming left
  drawEvaporator(ctx, hero);
  ctx.restore();

  // Name tag
  ctx.fillStyle = COLORS.accent;
  ctx.font = "bold 14px monospace";
  ctx.textAlign = "center";
  ctx.fillText(hero.name, x, feet - hero.h - 16);
};

export const drawBeam = (ctx: CanvasRenderingContext2D, beam: Beam, camX: number) => {
  const len = 18 + beam.size * 2;
  const speed = Math.hypot(beam.vx, beam.vy);
  const tx = (beam.vx / speed) * len;
  const ty = (beam.vy / speed) * len;
  ctx.save();
  ctx.lineCap = "round";
  ctx.shadowColor = COLORS.beam;
  ctx.shadowBlur = 12 + beam.size;
  ctx.strokeStyle = COLORS.beam;
  ctx.lineWidth = beam.size;
  ctx.beginPath();
  ctx.moveTo(beam.x - camX - tx, beam.y - ty);
  ctx.lineTo(beam.x - camX, beam.y);
  ctx.stroke();
  ctx.strokeStyle = "#fffbe0";
  ctx.lineWidth = Math.max(1.5, beam.size / 3);
  ctx.stroke();
  ctx.restore();
};
