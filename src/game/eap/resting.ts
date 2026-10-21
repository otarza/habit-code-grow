import { FLOOR_Y, VIEW_H, VIEW_W, WORLD_W } from "./constants";
import { rand } from "./forest";

// THE RESTING OF THE UNSTABLE: a misty violet wasteland of rune-carved resting stones
// and glowing cracks the parasites crawl out of.

const drawSpire = (ctx: CanvasRenderingContext2D, x: number, baseY: number, h: number, w: number, color: string) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - w / 2, baseY);
  ctx.lineTo(x - w * 0.15, baseY - h);
  ctx.lineTo(x + w * 0.1, baseY - h * 0.9);
  ctx.lineTo(x + w / 2, baseY);
  ctx.fill();
};

const drawRestingStone = (ctx: CanvasRenderingContext2D, x: number, h: number, tilt: number, seed: number, time: number) => {
  ctx.save();
  ctx.translate(x, FLOOR_Y + 4);
  ctx.rotate(tilt);
  ctx.fillStyle = "#2b2438";
  ctx.beginPath();
  ctx.moveTo(-18, 0);
  ctx.lineTo(-16, -h + 10);
  ctx.lineTo(-6, -h);
  ctx.lineTo(10, -h + 4);
  ctx.lineTo(18, -h + 16);
  ctx.lineTo(18, 0);
  ctx.fill();
  ctx.fillStyle = "#3a3150";
  ctx.fillRect(-16, -h + 14, 6, h - 16);

  // Pulsing runes
  ctx.globalAlpha = 0.5 + Math.sin(time * 2 + seed) * 0.3;
  ctx.fillStyle = "#5ff2d6";
  ctx.shadowColor = "#5ff2d6";
  ctx.shadowBlur = 8;
  const runes = 3 + Math.floor(rand(seed) * 3);
  for (let i = 0; i < runes; i++) {
    const ry = -h + 24 + i * 16;
    if (ry > -10) break;
    const kind = Math.floor(rand(seed + i) * 3);
    if (kind === 0) ctx.fillRect(-4, ry, 8, 3);
    else if (kind === 1) ctx.fillRect(-1, ry - 3, 3, 10);
    else {
      ctx.fillRect(-5, ry, 3, 3);
      ctx.fillRect(3, ry + 4, 3, 3);
    }
  }
  ctx.restore();
};

export const drawResting = (ctx: CanvasRenderingContext2D, camX: number) => {
  const time = performance.now() / 1000;

  // Violet sky
  const sky = ctx.createLinearGradient(0, 0, 0, FLOOR_Y);
  sky.addColorStop(0, "#120a24");
  sky.addColorStop(0.6, "#2d1846");
  sky.addColorStop(1, "#4a2a55");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, VIEW_W, FLOOR_Y);

  // Dim stars
  ctx.fillStyle = "rgba(220,200,255,0.5)";
  for (let i = 0; i < 40; i++) {
    const sx = (rand(i + 500) * VIEW_W * 2 - camX * 0.04 + VIEW_W * 2) % VIEW_W;
    ctx.fillRect(sx, rand(i + 900) * 180, 2, 2);
  }

  // Eclipsed moon with a glowing ring
  const mx = 560 - camX * 0.04;
  ctx.save();
  ctx.shadowColor = "#5ff2d6";
  ctx.shadowBlur = 40;
  ctx.strokeStyle = "#8ffbe6";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(mx, 120, 46, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
  ctx.fillStyle = "#0d0718";
  ctx.beginPath();
  ctx.arc(mx, 120, 44, 0, Math.PI * 2);
  ctx.fill();

  // Far crystal spires (parallax)
  const farOff = camX * 0.25;
  const farFirst = Math.floor(farOff / 90) - 1;
  for (let i = farFirst; i <= farFirst + VIEW_W / 90 + 2; i++) {
    drawSpire(ctx, i * 90 + rand(i + 40) * 50 - farOff, FLOOR_Y - 30, 80 + rand(i + 41) * 120, 40 + rand(i + 42) * 30, "#1e1233");
  }
  // Near spires
  const off = camX * 0.55;
  const first = Math.floor(off / 160) - 1;
  for (let i = first; i <= first + VIEW_W / 160 + 2; i++) {
    drawSpire(ctx, i * 160 + rand(i + 70) * 80 - off, FLOOR_Y, 120 + rand(i + 71) * 150, 60 + rand(i + 72) * 40, "#2a1840");
  }

  // Resting stones in the play area
  ctx.save();
  ctx.translate(-camX, 0);
  for (let i = 0; i < WORLD_W / 230; i++) {
    const wx = 380 + i * 230 + rand(i + 300) * 90;
    if (wx < camX - 60 || wx > camX + VIEW_W + 60) continue;
    drawRestingStone(ctx, wx, 50 + rand(i + 301) * 60, (rand(i + 302) - 0.5) * 0.25, i + 303, time);
  }
  ctx.restore();

  // Ashen ground with glowing cracks
  ctx.fillStyle = "#1d1726";
  ctx.fillRect(0, FLOOR_Y, VIEW_W, VIEW_H - FLOOR_Y);
  ctx.fillStyle = "#2f2640";
  ctx.fillRect(0, FLOOR_Y, VIEW_W, 6);
  ctx.save();
  ctx.strokeStyle = "#b45cff";
  ctx.shadowColor = "#b45cff";
  ctx.shadowBlur = 10;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.55 + Math.sin(time * 1.5) * 0.2;
  for (let i = 0; i < WORLD_W / 140; i++) {
    const wx = i * 140 + rand(i + 600) * 100;
    if (wx < camX - 80 || wx > camX + VIEW_W + 80) continue;
    const x = wx - camX;
    const y = FLOOR_Y + 14 + rand(i + 601) * 60;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 14, y + 6);
    ctx.lineTo(x + 26, y + 2);
    ctx.lineTo(x + 44, y + 10);
    ctx.stroke();
  }
  ctx.restore();

  // Low drifting mist
  ctx.save();
  for (let i = 0; i < 6; i++) {
    const mxx = ((i * 260 + time * (12 + i * 4) - camX * 0.8) % (VIEW_W + 400)) - 200;
    const g = ctx.createRadialGradient(mxx, FLOOR_Y - 10, 10, mxx, FLOOR_Y - 10, 180);
    g.addColorStop(0, "rgba(200,170,255,0.16)");
    g.addColorStop(1, "rgba(200,170,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(mxx - 180, FLOOR_Y - 90, 360, 140);
  }
  ctx.restore();
};
