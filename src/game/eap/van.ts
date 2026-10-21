import { COLORS, FLOOR_Y, MOVE_SPEED, VIEW_H, VIEW_W } from "./constants";
import { playClunk, playFootstep, playJangle, playPickup, playSting } from "./audio";
import { drawHero, type Hero, type Input } from "./grave";

// Level 3: locked inside the EAP van by THE KEYS KEEPER.
// Hide in a drawer while his footsteps pass, open the side doors only when it's quiet,
// take blue/green keys (never red), find the key hidden in a drawer, then unlock the back door.

export type KeyColor = "blue" | "green" | "red";
type KeeperPhase = "quiet" | "approach" | "near" | "leaving";
type Side = "left" | "right";

export const KEY_COLORS: Record<KeyColor, string> = { blue: "#3d8bff", green: "#35e05a", red: "#ff3030" };
const KEEPER_EYES = "#ffc94a";

// Room layout (screen space — the van interior doesn't scroll)
const DOORS: Record<Side, { x: number; w: number }> = { left: { x: 40, w: 110 }, right: { x: 810, w: 110 } };
const BACK_DOOR = { x: 470, w: 120 };
const DRAWERS = [250, 375, 705]; // centre x
const DRAWER_W = 110;
const REACH = 60;

const OUTSIDE_KEYS_NEEDED = 2;
const RED_CHANCE = 0.35;
const PHASE_TIME: Record<Exclude<KeeperPhase, "quiet">, number> = { approach: 3.5, near: 1.6, leaving: 2.2 };
const STEP_INTERVAL = 0.55;

export type VanRoom = {
  hidingIn: number | null;
  doorOpen: Side | null;
  doorKey: KeyColor | null; // key lying outside the open door
  outsideKeys: KeyColor[];
  insideKey: KeyColor | null;
  insideKeyDrawer: number;
  searched: boolean[]; // drawers already hidden in
  keeper: { phase: KeeperPhase; t: number; duration: number; stepTimer: number; side: Side };
  thuds: { side: Side; life: number; volume: number }[];
  message: string;
  messageTime: number;
  unlockTime: number; // >0 while the back door unlock animation plays
};

export const createVanRoom = (): VanRoom => ({
  hidingIn: null,
  doorOpen: null,
  doorKey: null,
  outsideKeys: [],
  insideKey: null,
  insideKeyDrawer: Math.floor(Math.random() * DRAWERS.length),
  searched: DRAWERS.map(() => false),
  keeper: { phase: "quiet", t: 0, duration: 5, stepTimer: 0, side: "left" },
  thuds: [],
  message: "The doors are locked from outside. Listen for footsteps...",
  messageTime: 4,
  unlockTime: 0,
});

const keyCount = (room: VanRoom) => room.outsideKeys.length + (room.insideKey ? 1 : 0);

export const footstepVolume = (room: VanRoom) => {
  const { phase, t, duration } = room.keeper;
  if (phase === "approach") return 0.15 + 0.85 * (t / duration);
  if (phase === "near") return 1;
  if (phase === "leaving") return 1 - t / duration;
  return 0;
};

const say = (room: VanRoom, message: string, time = 2.5) => {
  room.message = message;
  room.messageTime = time;
};

const randomKey = (): KeyColor => (Math.random() < RED_CHANCE ? "red" : Math.random() < 0.5 ? "blue" : "green");

const nearDoor = (hero: Hero): Side | null => {
  if (hero.x < DOORS.left.x + DOORS.left.w + REACH - 30) return "left";
  if (hero.x > DOORS.right.x - REACH + 30) return "right";
  return null;
};
const nearDrawer = (hero: Hero) => {
  const i = DRAWERS.findIndex((x) => Math.abs(hero.x - x) < DRAWER_W / 2);
  return i === -1 ? null : i;
};
const nearBackDoor = (hero: Hero) => Math.abs(hero.x - (BACK_DOOR.x + BACK_DOOR.w / 2)) < BACK_DOOR.w / 2;

export type VanEvent = { type: "caught" | "escaped"; reason?: string } | null;

const advanceKeeper = (room: VanRoom, dt: number) => {
  const k = room.keeper;
  k.t += dt;
  if (k.t >= k.duration) {
    k.t = 0;
    if (k.phase === "quiet") {
      k.phase = "approach";
      k.side = Math.random() < 0.5 ? "left" : "right";
    } else if (k.phase === "approach") {
      k.phase = "near";
      playSting();
    }
    else if (k.phase === "near") k.phase = "leaving";
    else k.phase = "quiet";
    k.duration = k.phase === "quiet" ? 4 + Math.random() * 3.5 : PHASE_TIME[k.phase];
    k.stepTimer = 0;
  }
  if (k.phase !== "quiet") {
    k.stepTimer -= dt;
    if (k.stepTimer <= 0) {
      const v = footstepVolume(room);
      playFootstep(v);
      if (Math.random() < 0.5) playJangle(v * 0.7);
      room.thuds.push({ side: k.side, life: 0.6, volume: v });
      k.stepTimer = STEP_INTERVAL;
    }
  }
  for (const t of room.thuds) t.life -= dt;
  room.thuds = room.thuds.filter((t) => t.life > 0);
};

// Action = E / W / ↑ / Space ; back = S / ↓
export const updateVanRoom = (room: VanRoom, hero: Hero, input: Input, dt: number): VanEvent => {
  room.messageTime = Math.max(0, room.messageTime - dt);
  if (room.unlockTime > 0) {
    room.unlockTime += dt;
    return room.unlockTime > 1.6 ? { type: "escaped" } : null;
  }

  advanceKeeper(room, dt);
  const phase = room.keeper.phase;
  const action = input.jump || input.action;
  input.jump = input.action = false; // one action per press
  const back = input.down;
  input.down = false;

  // Moving (not while hidden)
  if (room.hidingIn === null) {
    const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    hero.x = Math.max(110, Math.min(850, hero.x + dir * MOVE_SPEED * 0.8 * dt));
    if (dir !== 0) hero.facing = dir as 1 | -1;
    hero.walkTime = dir !== 0 ? hero.walkTime + dt : 0;
  }
  hero.y = FLOOR_Y;

  // Walking away from an open door lets it swing shut
  if (room.doorOpen && nearDoor(hero) !== room.doorOpen) {
    room.doorOpen = null;
    room.doorKey = null;
    playClunk();
  }

  if (room.hidingIn !== null) {
    if (back || action) {
      room.hidingIn = null;
      playClunk();
      if (phase === "near") return { type: "caught", reason: "You climbed out while the Keys Keeper was right outside." };
    }
  } else if (room.doorOpen) {
    if (back) {
      room.doorOpen = null;
      room.doorKey = null;
      playClunk();
    } else if (action && room.doorKey) {
      if (room.doorKey === "red") return { type: "caught", reason: "You picked up a RED key. It was the Keys Keeper's trap." };
      if (room.outsideKeys.length < OUTSIDE_KEYS_NEEDED) {
        room.outsideKeys.push(room.doorKey);
        playPickup();
        say(room, `You took the ${room.doorKey.toUpperCase()} key!`);
        room.doorKey = null;
      } else {
        say(room, "You already have both keys from outside.");
      }
    }
  } else if (action) {
    const drawer = nearDrawer(hero);
    const door = nearDoor(hero);
    if (drawer !== null) {
      room.hidingIn = drawer;
      playClunk();
      if (!room.searched[drawer]) {
        room.searched[drawer] = true;
        if (drawer === room.insideKeyDrawer && !room.insideKey) {
          room.insideKey = Math.random() < 0.5 ? "blue" : "green";
          playPickup();
          say(room, `There was a ${room.insideKey.toUpperCase()} key hidden in this drawer!`, 3);
        }
      }
    } else if (door) {
      if (phase !== "quiet") return { type: "caught", reason: "You opened a door while the Keys Keeper could still hear you." };
      room.doorOpen = door;
      room.doorKey = randomKey();
      playClunk();
    } else if (nearBackDoor(hero)) {
      if (keyCount(room) >= OUTSIDE_KEYS_NEEDED + 1) {
        room.unlockTime = 0.0001;
        playClunk();
        say(room, "The back door unlocks!", 3);
      } else {
        say(room, `The back door is locked. You need 3 keys (${keyCount(room)}/3).`);
      }
    }
  }

  if (phase === "near" && room.hidingIn === null) {
    return { type: "caught", reason: "The Keys Keeper found you. Hide in a drawer when you hear footsteps!" };
  }
  return null;
};

// ---------- drawing ----------

const drawKey = (ctx: CanvasRenderingContext2D, x: number, y: number, color: KeyColor, scale = 1) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.shadowColor = KEY_COLORS[color];
  ctx.shadowBlur = 12;
  ctx.strokeStyle = KEY_COLORS[color];
  ctx.fillStyle = KEY_COLORS[color];
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(-10, 0, 7, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillRect(-3, -2, 20, 4);
  ctx.fillRect(10, 2, 3, 5);
  ctx.fillRect(15, 2, 3, 4);
  ctx.restore();
};

export const drawKeysKeeper = (
  ctx: CanvasRenderingContext2D,
  x: number,
  feet: number,
  scale: number,
  alpha = 1,
  body = "#0b0810",
) => {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, feet);
  ctx.scale(scale, scale);
  ctx.fillStyle = body;
  // Long legs and gaunt body
  ctx.fillRect(-12, -70, 8, 70);
  ctx.fillRect(4, -70, 8, 70);
  ctx.beginPath();
  ctx.moveTo(-22, -70);
  ctx.lineTo(22, -70);
  ctx.lineTo(16, -150);
  ctx.lineTo(-16, -150);
  ctx.fill();
  // Long arms
  ctx.fillRect(-30, -148, 8, 90);
  ctx.fillRect(22, -148, 8, 90);
  // Head
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(0, -168, 20, 0, Math.PI * 2);
  ctx.fill();
  // Keyhole eyes
  ctx.fillStyle = KEEPER_EYES;
  ctx.shadowColor = KEEPER_EYES;
  ctx.shadowBlur = 14;
  for (const ex of [-8, 8]) {
    ctx.beginPath();
    ctx.arc(ex, -172, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(ex - 1.5, -172, 3, 9);
  }
  ctx.shadowBlur = 0;
  // Key ring around the waist with hanging keys
  ctx.strokeStyle = "#8a8f99";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, -82, 26, 8, 0, 0, Math.PI * 2);
  ctx.stroke();
  const ringKeys: KeyColor[] = ["red", "blue", "red", "green", "red"];
  ringKeys.forEach((c, i) => {
    ctx.fillStyle = KEY_COLORS[c];
    ctx.fillRect(-22 + i * 10, -78, 3, 16);
    ctx.fillRect(-23 + i * 10, -64, 5, 3);
  });
  ctx.restore();
};

const drawOutsideView = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, "#2d1846");
  g.addColorStop(1, "#4a2a55");
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
};

const drawSideDoor = (ctx: CanvasRenderingContext2D, room: VanRoom, side: Side, time: number) => {
  const { x, w } = DOORS[side];
  const top = FLOOR_Y - 230;
  const h = 230;
  const open = room.doorOpen === side;

  // Frame
  ctx.fillStyle = "#15181e";
  ctx.fillRect(x - 6, top - 6, w + 12, h + 6);

  if (open) {
    // Doorway looking out at THE RESTING OF THE UNSTABLE
    drawOutsideView(ctx, x, top, w, h);
    ctx.fillStyle = "#1d1726";
    ctx.fillRect(x, FLOOR_Y - 20, w, 20);
    // Lying just outside, past where Grave can stand
    const keyX = side === "left" ? x + 30 : x + w - 30;
    if (room.doorKey) drawKey(ctx, keyX, FLOOR_Y - 26 + Math.sin(time * 3) * 3, room.doorKey, 1.3);
    // Swung-open door panel
    ctx.fillStyle = "#4a505c";
    const px = side === "left" ? x + w - 16 : x;
    ctx.fillRect(px, top, 16, h);
    return;
  }

  ctx.fillStyle = "#4a505c";
  ctx.fillRect(x, top, w, h);
  ctx.strokeStyle = "#3a3f4a";
  ctx.lineWidth = 3;
  ctx.strokeRect(x + 8, top + 8, w - 16, h - 16);
  // Small window — the Keys Keeper's silhouette passes by during footsteps
  const wx = x + 20;
  const wy = top + 24;
  const ww = w - 40;
  const wh = 60;
  drawOutsideView(ctx, wx, wy, ww, wh);
  const k = room.keeper;
  if (k.side === side && k.phase !== "quiet") {
    const vol = footstepVolume(room);
    ctx.save();
    ctx.beginPath();
    ctx.rect(wx, wy, ww, wh);
    ctx.clip();
    drawKeysKeeper(ctx, wx + ww / 2, wy + wh + 120, 0.75, Math.min(1, vol * 1.2));
    ctx.restore();
  }
  ctx.strokeStyle = "#20242c";
  ctx.lineWidth = 4;
  ctx.strokeRect(wx, wy, ww, wh);
  // Handle
  ctx.fillStyle = "#9aa3b5";
  ctx.fillRect(side === "left" ? x + w - 24 : x + 12, top + 120, 12, 5);
};

const drawBackDoor = (ctx: CanvasRenderingContext2D, room: VanRoom) => {
  const { x, w } = BACK_DOOR;
  const top = FLOOR_Y - 250;
  const h = 250;
  ctx.fillStyle = "#15181e";
  ctx.fillRect(x - 6, top - 6, w + 12, h + 6);
  const unlocking = room.unlockTime > 0;
  const gap = unlocking ? Math.min(w / 2, Math.max(0, room.unlockTime - 0.6) * 90) : 0;
  if (gap > 0) {
    drawOutsideView(ctx, x, top, w, h);
    ctx.fillStyle = "#e9f7ff";
    ctx.globalAlpha = Math.min(0.6, gap / 60);
    ctx.fillRect(x, top, w, h);
    ctx.globalAlpha = 1;
  }
  ctx.fillStyle = "#565d6b";
  ctx.fillRect(x, top, w / 2 - 2 - gap, h);
  ctx.fillRect(x + w / 2 + 2 + gap, top, w / 2 - 2 - gap, h);
  if (gap > 0) return;

  // Rear windows
  drawOutsideView(ctx, x + 10, top + 20, w / 2 - 22, 50);
  drawOutsideView(ctx, x + w / 2 + 12, top + 20, w / 2 - 22, 50);
  // Big padlock with three keyholes
  const lx = x + w / 2;
  const ly = top + 140;
  ctx.strokeStyle = "#b9bec9";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(lx, ly - 14, 16, Math.PI, 0);
  ctx.stroke();
  ctx.fillStyle = "#c9a227";
  ctx.fillRect(lx - 30, ly - 14, 60, 48);
  const slots: (KeyColor | null)[] = [room.outsideKeys[0] ?? null, room.insideKey, room.outsideKeys[1] ?? null];
  slots.forEach((c, i) => {
    const sx = lx - 18 + i * 18;
    ctx.fillStyle = c ? KEY_COLORS[c] : "#3a2c08";
    ctx.beginPath();
    ctx.arc(sx, ly + 4, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(sx - 1.5, ly + 4, 3, 10);
  });
  ctx.fillStyle = "#e6e9ef";
  ctx.font = "bold 11px monospace";
  ctx.textAlign = "center";
  ctx.fillText(unlocking ? "UNLOCKED" : "LOCKED", lx, top + 210);
};

const drawDrawer = (ctx: CanvasRenderingContext2D, room: VanRoom, i: number, time: number) => {
  const cx = DRAWERS[i];
  const x = cx - DRAWER_W / 2;
  const top = FLOOR_Y - 96;
  ctx.fillStyle = "#3d4350";
  ctx.fillRect(x, top, DRAWER_W, 96);
  ctx.fillStyle = "#2b303a";
  ctx.fillRect(x - 6, top - 8, DRAWER_W + 12, 8); // counter top
  const hidden = room.hidingIn === i;
  for (let d = 0; d < 2; d++) {
    const dy = top + 8 + d * 44;
    const ajar = hidden && d === 1 ? 6 : 0;
    ctx.fillStyle = "#565d6b";
    ctx.fillRect(x + 6 - ajar, dy, DRAWER_W - 12, 38);
    ctx.fillStyle = "#9aa3b5";
    ctx.fillRect(cx - 14 - ajar, dy + 16, 28, 5);
    if (ajar) {
      // Grave peeking out through the gap
      ctx.fillStyle = "#07080b";
      ctx.fillRect(x + 6 - ajar, dy - 3, DRAWER_W - 12, 4);
      const blink = Math.sin(time * 2.3) > 0.97;
      if (!blink) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(cx - 9, dy - 3, 4, 3);
        ctx.fillRect(cx + 5, dy - 3, 4, 3);
      }
    }
  }
  if (room.searched[i]) {
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    ctx.fillText("searched", cx, FLOOR_Y + 16);
  }
};

const prompt = (room: VanRoom, hero: Hero) => {
  if (room.unlockTime > 0) return "";
  if (room.hidingIn !== null) return "[S / ↓] Climb out of the drawer";
  if (room.doorOpen) {
    if (!room.doorKey) return "[S / ↓] Close the door";
    return `[E / ↑] Pick up the ${room.doorKey.toUpperCase()} key    [S / ↓] Close the door`;
  }
  const drawer = nearDrawer(hero);
  if (drawer !== null) return "[E / ↑] Hide in the drawer";
  const door = nearDoor(hero);
  if (door) return `[E / ↑] Open the ${door} door`;
  if (nearBackDoor(hero)) return "[E / ↑] Try the back door";
  return "";
};

export const drawVanRoom = (ctx: CanvasRenderingContext2D, room: VanRoom, hero: Hero, input: Input) => {
  const time = performance.now() / 1000;
  const vol = footstepVolume(room);

  // Tiny shake on each step
  const shake = room.thuds.reduce((s, t) => s + (t.life > 0.45 ? t.volume * 3 : 0), 0);
  ctx.save();
  ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);

  // Walls with panels and rivets
  ctx.fillStyle = "#2a2f38";
  ctx.fillRect(-10, -10, VIEW_W + 20, VIEW_H + 20);
  for (let x = 0; x < VIEW_W; x += 120) {
    ctx.fillStyle = (x / 120) % 2 === 0 ? "#2e343e" : "#2a2f38";
    ctx.fillRect(x, 70, 120, FLOOR_Y - 70);
    ctx.fillStyle = "#3d4450";
    for (let y = 90; y < FLOOR_Y; y += 60) {
      ctx.fillRect(x + 6, y, 4, 4);
      ctx.fillRect(x + 110, y, 4, 4);
    }
  }
  // Ceiling with a flickering light that flickers harder when he's close
  ctx.fillStyle = "#1c2028";
  ctx.fillRect(0, 0, VIEW_W, 70);
  const flicker = Math.random() < 0.04 + vol * 0.25 ? 0.25 : 1;
  ctx.fillStyle = `rgba(255,244,214,${0.9 * flicker})`;
  ctx.fillRect(VIEW_W / 2 - 90, 62, 180, 8);
  const glow = ctx.createRadialGradient(VIEW_W / 2, 70, 10, VIEW_W / 2, 70, 420);
  glow.addColorStop(0, `rgba(255,244,214,${0.18 * flicker})`);
  glow.addColorStop(1, "rgba(255,244,214,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, VIEW_W, FLOOR_Y);

  drawSideDoor(ctx, room, "left", time);
  drawSideDoor(ctx, room, "right", time);
  drawBackDoor(ctx, room);
  DRAWERS.forEach((_, i) => drawDrawer(ctx, room, i, time));

  // Floor
  ctx.fillStyle = "#1b1e24";
  ctx.fillRect(0, FLOOR_Y, VIEW_W, VIEW_H - FLOOR_Y);
  ctx.fillStyle = "#262a32";
  for (let x = 0; x < VIEW_W; x += 24) ctx.fillRect(x, FLOOR_Y + 6, 12, 3);

  if (room.hidingIn === null && room.unlockTime <= 0) drawHero(ctx, hero, input, 0);
  ctx.restore();

  // Darken the room when he's near
  if (vol > 0) {
    ctx.fillStyle = `rgba(5,3,10,${vol * 0.35})`;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  }

  // THUD marks on the side the footsteps come from (visual cue for the sound)
  for (const t of room.thuds) {
    ctx.globalAlpha = Math.min(1, t.life * 2);
    ctx.fillStyle = "#ffcf5a";
    ctx.font = `bold ${Math.round(14 + t.volume * 22)}px monospace`;
    ctx.textAlign = "center";
    ctx.fillText("THUD", t.side === "left" ? 95 : 865, FLOOR_Y + 50 - (0.6 - t.life) * 30);
  }
  ctx.globalAlpha = 1;
};

export const drawVanHud = (ctx: CanvasRenderingContext2D, room: VanRoom, hero: Hero) => {
  // Keys panel
  ctx.fillStyle = "rgba(10,14,22,0.75)";
  ctx.fillRect(VIEW_W - 262, 12, 250, 92);
  ctx.textAlign = "left";
  ctx.fillStyle = "#e6e9ef";
  ctx.font = "bold 13px monospace";
  ctx.fillText(`KEYS ${keyCount(room)}/3`, VIEW_W - 250, 32);
  ctx.font = "11px monospace";
  ctx.fillStyle = "#9aa3b5";
  ctx.fillText(`outside ${room.outsideKeys.length}/2   inside ${room.insideKey ? 1 : 0}/1`, VIEW_W - 250, 50);
  const slots = [room.outsideKeys[0], room.outsideKeys[1], room.insideKey];
  slots.forEach((c, i) => {
    if (c) drawKey(ctx, VIEW_W - 220 + i * 70, 78, c);
    else {
      ctx.strokeStyle = "#444b58";
      ctx.lineWidth = 2;
      ctx.strokeRect(VIEW_W - 240 + i * 70, 66, 46, 24);
    }
  });

  // Footsteps meter
  const vol = footstepVolume(room);
  ctx.fillStyle = "rgba(10,14,22,0.75)";
  ctx.fillRect(VIEW_W / 2 - 160, 82, 320, 34);
  ctx.fillStyle = "#3a2f1a";
  ctx.fillRect(VIEW_W / 2 - 150, 98, 300, 10);
  ctx.fillStyle = vol > 0.75 ? COLORS.hp : "#ffcf5a";
  ctx.fillRect(VIEW_W / 2 - 150, 98, 300 * vol, 10);
  ctx.fillStyle = vol > 0 ? "#ffcf5a" : "#6f7686";
  ctx.font = "bold 11px monospace";
  ctx.textAlign = "center";
  ctx.fillText(vol > 0 ? "FOOTSTEPS — HIDE!" : "QUIET — safe to open a door", VIEW_W / 2, 94);

  // Messages and prompts
  if (room.messageTime > 0) {
    ctx.globalAlpha = Math.min(1, room.messageTime);
    ctx.fillStyle = "#e6e9ef";
    ctx.font = "bold 16px monospace";
    ctx.fillText(room.message, VIEW_W / 2, 150);
    ctx.globalAlpha = 1;
  }
  const p = prompt(room, hero);
  if (p) {
    ctx.fillStyle = "rgba(10,14,22,0.75)";
    ctx.fillRect(VIEW_W / 2 - 250, VIEW_H - 40, 500, 26);
    ctx.fillStyle = COLORS.accent;
    ctx.font = "bold 13px monospace";
    ctx.fillText(p, VIEW_W / 2, VIEW_H - 22);
  }
};
