import { useEffect, useRef } from "react";

// EAP — Evaporate All Parasites
// 2D side-view canvas game. Hero: GRAVE, an employee of EAP Corporation, in a forest.

const VIEW_W = 960;
const VIEW_H = 540;
const WORLD_W = 2880;
const FLOOR_Y = 450;

const GRAVITY = 2200;
const MOVE_SPEED = 260;
const JUMP_SPEED = 630; // ~90px jump, about one Grave-height

type Keys = { left: boolean; right: boolean; jump: boolean };

type Hero = {
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
};

const createGrave = (): Hero => ({
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
});

const updateHero = (hero: Hero, keys: Keys, dt: number) => {
  const dir = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
  hero.vx = dir * MOVE_SPEED;
  if (dir !== 0) hero.facing = dir as 1 | -1;

  if (keys.jump && hero.onGround) {
    hero.vy = -JUMP_SPEED;
    keys.jump = false; // one jump per key press
    hero.onGround = false;
  }

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
};

// Deterministic pseudo-random so the forest looks the same every frame
const rand = (n: number) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};

const drawPine = (ctx: CanvasRenderingContext2D, x: number, baseY: number, h: number, color: string, trunk: string) => {
  ctx.fillStyle = trunk;
  ctx.fillRect(x - h * 0.04, baseY - h * 0.25, h * 0.08, h * 0.25);
  ctx.fillStyle = color;
  for (let i = 0; i < 3; i++) {
    const tierW = h * (0.42 - i * 0.1);
    const tierBottom = baseY - h * 0.18 - i * h * 0.22;
    ctx.beginPath();
    ctx.moveTo(x - tierW, tierBottom);
    ctx.lineTo(x + tierW, tierBottom);
    ctx.lineTo(x, tierBottom - h * 0.42);
    ctx.closePath();
    ctx.fill();
  }
};

// One parallax layer of trees; `depth` < 1 scrolls slower than the camera
const drawTreeLayer = (
  ctx: CanvasRenderingContext2D,
  camX: number,
  depth: number,
  spacing: number,
  baseY: number,
  minH: number,
  maxH: number,
  color: string,
  trunk: string,
  seed: number,
) => {
  const offset = camX * depth;
  const first = Math.floor(offset / spacing) - 1;
  const last = Math.ceil((offset + VIEW_W) / spacing) + 1;
  for (let i = first; i <= last; i++) {
    const x = i * spacing + rand(i + seed) * spacing * 0.6 - offset;
    const h = minH + rand(i * 3 + seed) * (maxH - minH);
    drawPine(ctx, x, baseY, h, color, trunk);
  }
};

const drawForest = (ctx: CanvasRenderingContext2D, camX: number) => {
  // Night sky
  const sky = ctx.createLinearGradient(0, 0, 0, FLOOR_Y);
  sky.addColorStop(0, "#0b1a2a");
  sky.addColorStop(1, "#1f3a3a");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, VIEW_W, FLOOR_Y);

  // Stars
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  for (let i = 0; i < 60; i++) {
    const sx = (rand(i) * VIEW_W * 2 - camX * 0.05 + VIEW_W * 2) % VIEW_W;
    ctx.fillRect(sx, rand(i + 99) * 200, 2, 2);
  }

  // Moon
  ctx.fillStyle = "#e8f0d8";
  ctx.beginPath();
  ctx.arc(780 - camX * 0.05, 90, 34, 0, Math.PI * 2);
  ctx.fill();

  // Distant hills
  ctx.fillStyle = "#16302e";
  ctx.beginPath();
  ctx.moveTo(0, FLOOR_Y);
  for (let x = 0; x <= VIEW_W; x += 20) {
    const wx = x + camX * 0.2;
    ctx.lineTo(x, 300 + Math.sin(wx * 0.006) * 30 + Math.sin(wx * 0.017) * 12);
  }
  ctx.lineTo(VIEW_W, FLOOR_Y);
  ctx.fill();

  // Tree layers, back to front
  drawTreeLayer(ctx, camX, 0.35, 70, FLOOR_Y - 20, 120, 190, "#173a32", "#173a32", 1);
  drawTreeLayer(ctx, camX, 0.6, 110, FLOOR_Y, 180, 280, "#1d4a38", "#2a2620", 50);

  // Ground: dirt with a grass edge
  ctx.fillStyle = "#3a2c1f";
  ctx.fillRect(0, FLOOR_Y, VIEW_W, VIEW_H - FLOOR_Y);
  ctx.fillStyle = "#2f6b3a";
  ctx.fillRect(0, FLOOR_Y, VIEW_W, 10);
  ctx.fillStyle = "#3f8a47";
  for (let wx = Math.floor(camX / 12) * 12; wx < camX + VIEW_W; wx += 12) {
    const gh = 4 + rand(wx) * 8;
    ctx.fillRect(wx - camX, FLOOR_Y - gh, 3, gh);
  }
  // Stones and mushrooms in the dirt
  for (let i = 0; i < WORLD_W / 90; i++) {
    const wx = i * 90 + rand(i + 7) * 60;
    if (wx < camX - 20 || wx > camX + VIEW_W + 20) continue;
    if (rand(i + 13) > 0.6) {
      ctx.fillStyle = "#c0392b";
      ctx.fillRect(wx - camX - 6, FLOOR_Y - 12, 12, 6);
      ctx.fillStyle = "#e8dcc0";
      ctx.fillRect(wx - camX - 2, FLOOR_Y - 6, 4, 6);
    } else {
      ctx.fillStyle = "#4a3d30";
      ctx.fillRect(wx - camX, FLOOR_Y + 20 + rand(i) * 50, 10, 6);
    }
  }
};

const drawHero = (ctx: CanvasRenderingContext2D, hero: Hero, camX: number) => {
  const x = Math.round(hero.x - camX);
  const feet = Math.round(hero.y);
  const swing = Math.sin(hero.walkTime * 14) * 8;

  ctx.save();
  ctx.translate(x, feet);
  ctx.scale(hero.facing, 1);

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath();
  ctx.ellipse(0, FLOOR_Y - feet + 2, 22, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Legs (dark work trousers)
  ctx.fillStyle = "#2b2f3a";
  ctx.fillRect(-12, -34, 10, 32 + (hero.onGround ? swing / 2 : 0));
  ctx.fillRect(2, -34, 10, 32 - (hero.onGround ? swing / 2 : 0));
  // Boots
  ctx.fillStyle = "#111";
  ctx.fillRect(-14 + (hero.onGround ? swing / 2 : 0), -4, 14, 5);
  ctx.fillRect(0 - (hero.onGround ? swing / 2 : 0), -4, 14, 5);

  // Body — EAP Corporation work jacket
  ctx.fillStyle = "#e6e9ef";
  ctx.fillRect(-16, -66, 32, 34);
  ctx.fillStyle = "#35e0a1";
  ctx.fillRect(-16, -50, 32, 4); // company stripe
  // ID badge
  ctx.fillStyle = "#fff";
  ctx.fillRect(4, -62, 9, 11);
  ctx.fillStyle = "#35e0a1";
  ctx.fillRect(5, -61, 7, 3);

  // Back arm
  ctx.fillStyle = "#c9cdd6";
  ctx.fillRect(-20, -64, 7, 26 - swing / 3);
  // Front arm
  ctx.fillStyle = "#e6e9ef";
  ctx.fillRect(13, -64, 7, 26 + swing / 3);
  ctx.fillStyle = "#e0b48a";
  ctx.fillRect(13, -40 + swing / 3, 7, 6);

  // Head
  ctx.fillStyle = "#e0b48a";
  ctx.fillRect(-11, -86, 22, 20);
  // Hair
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(-12, -90, 24, 7);
  ctx.fillRect(-12, -86, 6, 8);
  // Eye + brow
  ctx.fillStyle = "#111";
  ctx.fillRect(4, -79, 3, 3);
  ctx.fillRect(2, -82, 7, 2);

  ctx.restore();

  // Name tag above hero
  ctx.fillStyle = "#35e0a1";
  ctx.font = "bold 14px monospace";
  ctx.textAlign = "center";
  ctx.fillText(hero.name, x, feet - hero.h - 16);
};

const drawHud = (ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = "rgba(10,14,22,0.7)";
  ctx.fillRect(12, 12, 300, 54);
  ctx.fillStyle = "#35e0a1";
  ctx.font = "bold 18px monospace";
  ctx.textAlign = "left";
  ctx.fillText("EAP — Evaporate All Parasites", 22, 34);
  ctx.fillStyle = "#9aa3b5";
  ctx.font = "12px monospace";
  ctx.fillText("Move: ← → / A D   Jump: ↑ / W / Space", 22, 54);
};

const EAP = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useRef<Keys>({ left: false, right: false, jump: false });

  useEffect(() => {
    document.title = "EAP — Evaporate All Parasites";
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const keys = keysRef.current;
    const grave = createGrave();

    const setKey = (code: string, down: boolean) => {
      if (code === "ArrowLeft" || code === "KeyA") keys.left = down;
      else if (code === "ArrowRight" || code === "KeyD") keys.right = down;
      else if (code === "ArrowUp" || code === "KeyW" || code === "Space") keys.jump = down;
      else return false;
      return true;
    };
    const onKeyDown = (e: KeyboardEvent) => {
      // Ignore OS key auto-repeat so holding jump doesn't re-trigger it
      if (e.repeat) {
        if (e.code === "Space" || e.code.startsWith("Arrow")) e.preventDefault();
        return;
      }
      if (setKey(e.code, true)) e.preventDefault();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (setKey(e.code, false)) e.preventDefault();
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    let last = performance.now();
    let frame = 0;
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;

      updateHero(grave, keys, dt);
      const camX = Math.max(0, Math.min(WORLD_W - VIEW_W, grave.x - VIEW_W / 2));

      drawForest(ctx, camX);
      drawHero(ctx, grave, camX);
      drawHud(ctx);

      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  const touch = (key: keyof Keys) => ({
    onPointerDown: () => (keysRef.current[key] = true),
    onPointerUp: () => (keysRef.current[key] = false),
    onPointerLeave: () => (keysRef.current[key] = false),
  });

  return (
    <div className="min-h-screen bg-[#0a0e16] flex flex-col items-center justify-center gap-4 p-4">
      <canvas
        ref={canvasRef}
        width={VIEW_W}
        height={VIEW_H}
        className="w-full max-w-[960px] rounded-lg border border-[#35e0a1]/40 [image-rendering:pixelated]"
      />
      <div className="flex gap-3 md:hidden select-none touch-none">
        <button className="h-14 w-14 rounded-full bg-[#1c2433] text-[#35e0a1] text-2xl" {...touch("left")}>←</button>
        <button className="h-14 w-14 rounded-full bg-[#1c2433] text-[#35e0a1] text-2xl" {...touch("jump")}>↑</button>
        <button className="h-14 w-14 rounded-full bg-[#1c2433] text-[#35e0a1] text-2xl" {...touch("right")}>→</button>
      </div>
    </div>
  );
};

export default EAP;
