import { FLOOR_Y, VIEW_H, VIEW_W, WORLD_W } from "./constants";

// Deterministic pseudo-random so the forest looks the same every frame
export const rand = (n: number) => {
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

export const drawForest = (ctx: CanvasRenderingContext2D, camX: number) => {
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
