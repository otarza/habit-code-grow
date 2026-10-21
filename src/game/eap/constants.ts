export const VIEW_W = 960;
export const VIEW_H = 540;
export const WORLD_W = 2880;
export const FLOOR_Y = 450;

export const GRAVITY = 2200;

// Grave
export const MOVE_SPEED = 260;
export const JUMP_SPEED = 630; // ~90px jump, about one Grave-height
export const GRAVE_MAX_HP = 100;
export const HIT_INVULN = 0.8; // seconds of safety after being hit

// Evaporator
export const BEAM_SPEED = 950;
export const TAP_THRESHOLD = 0.15; // holding shorter than this is a quick shot
export const MAX_CHARGE = 1.2; // seconds to full charge
export const BATTERY_MAX = 100;
export const BATTERY_DRAIN = 35; // per second while charging
export const BEAM_MIN_DAMAGE = 8;
export const BEAM_MAX_DAMAGE = 40;

// Destruction Maker
export const GOBLIN_MAX_HP = 150;
export const GOBLIN_SCALE = 1.8; // drawing is authored at 1x and scaled up
export const GOBLIN_START_X = 1500;
export const GOBLIN_WAKE_RANGE = 750;
export const GOBLIN_SPEED = 120;
export const GOBLIN_KEEP_DISTANCE = 320;
export const LAVA_GRAVITY = 900;
export const LAVA_FLIGHT_TIME = 1.0;
export const LAVA_DAMAGE = 20;
export const LAVA_RADIUS = 18;

// Van
export const VAN_X = 2640;
export const VAN_W = 200;

export const COLORS = {
  accent: "#35e0a1",
  beam: "#ffe24a",
  lava: "#ff6a1a",
  hp: "#e74c3c",
  battery: "#4ab8ff",
};
