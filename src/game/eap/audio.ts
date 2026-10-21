// Tiny synthesized sound effects (no audio files). Browsers only allow audio after a
// user gesture, so the page calls unlockAudio() from its input handlers.

let ctx: AudioContext | null = null;
let bus: GainNode | null = null; // master volume: everything plays through this so mute works
let muted = false;
try {
  muted = localStorage.getItem("eap-muted") === "1";
} catch {
  // storage unavailable: start unmuted
}

export const unlockAudio = () => {
  if (!ctx) {
    try {
      ctx = new AudioContext();
    } catch {
      return;
    }
    bus = ctx.createGain();
    bus.gain.value = muted ? 0 : 1;
    bus.connect(ctx.destination);
    buildAmbience(ctx, bus);
  }
  if (ctx.state === "suspended") void ctx.resume();
};

export const isMuted = () => muted;

export const setMuted = (value: boolean) => {
  muted = value;
  try {
    localStorage.setItem("eap-muted", value ? "1" : "0");
  } catch {
    // ignore
  }
  if (ctx && bus) bus.gain.setTargetAtTime(value ? 0 : 1, ctx.currentTime, 0.05);
};

const noise = (ac: AudioContext, seconds: number) => {
  const buffer = ac.createBuffer(1, Math.ceil(ac.sampleRate * seconds), ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buffer;
  return src;
};

const envelope = (ac: AudioContext, peak: number, attack: number, decay: number) => {
  const g = ac.createGain();
  const now = ac.currentTime;
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), now + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay);
  g.connect(bus as GainNode);
  return g;
};

// Heavy thud: low sine drop plus a muffled noise hit
export const playFootstep = (volume: number) => {
  if (!ctx || !bus || volume <= 0.01) return;
  const ac = ctx;
  const now = ac.currentTime;
  const osc = ac.createOscillator();
  osc.frequency.setValueAtTime(95, now);
  osc.frequency.exponentialRampToValueAtTime(40, now + 0.18);
  osc.connect(envelope(ac, 0.6 * volume, 0.005, 0.22));
  osc.start(now);
  osc.stop(now + 0.3);

  const n = noise(ac, 0.15);
  const filter = ac.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 500;
  n.connect(filter);
  filter.connect(envelope(ac, 0.35 * volume, 0.003, 0.12));
  n.start(now);
};

// Metallic key-ring jangle
export const playJangle = (volume: number) => {
  if (!ctx || !bus || volume <= 0.01) return;
  const ac = ctx;
  for (let i = 0; i < 4; i++) {
    const t = ac.currentTime + i * 0.035 + Math.random() * 0.02;
    const osc = ac.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = 2400 + Math.random() * 2200;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.08 * volume, t + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    osc.connect(g);
    g.connect(bus as GainNode);
    osc.start(t);
    osc.stop(t + 0.15);
  }
};

// Door lock / latch clunk
export const playClunk = () => {
  if (!ctx || !bus) return;
  const ac = ctx;
  const n = noise(ac, 0.12);
  const filter = ac.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 900;
  n.connect(filter);
  filter.connect(envelope(ac, 0.5, 0.002, 0.1));
  n.start();
};

export const playPickup = () => {
  if (!ctx || !bus) return;
  const ac = ctx;
  [660, 990].forEach((f, i) => {
    const osc = ac.createOscillator();
    osc.type = "square";
    osc.frequency.value = f;
    const t = ac.currentTime + i * 0.09;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.08, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
    osc.connect(g);
    g.connect(bus as GainNode);
    osc.start(t);
    osc.stop(t + 0.2);
  });
};

export const playDeath = () => {
  if (!ctx || !bus) return;
  const ac = ctx;
  const osc = ac.createOscillator();
  osc.type = "sawtooth";
  const now = ac.currentTime;
  osc.frequency.setValueAtTime(300, now);
  osc.frequency.exponentialRampToValueAtTime(50, now + 0.8);
  osc.connect(envelope(ac, 0.2, 0.01, 0.8));
  osc.start(now);
  osc.stop(now + 0.9);
};

// ---------- spooky ambience ----------
// A constant bed (low detuned drone + wind) that changes per place, a "dread" chord that
// swells when the Keys Keeper is close, and random one-off spooky sounds.

export type Mood = "forest" | "resting" | "van" | "silent";

type Ambience = {
  droneGain: GainNode;
  droneFilter: BiquadFilterNode;
  drones: OscillatorNode[];
  windGain: GainNode;
  dreadGain: GainNode;
};

let amb: Ambience | null = null;
let mood: Mood = "silent";
let eventTimer = 4;
let heartbeatTimer = 0;

const lfo = (ac: AudioContext, rate: number, depth: number, target: AudioParam) => {
  const osc = ac.createOscillator();
  osc.frequency.value = rate;
  const g = ac.createGain();
  g.gain.value = depth;
  osc.connect(g);
  g.connect(target);
  osc.start();
};

const buildAmbience = (ac: AudioContext, out: GainNode) => {
  // Drone: two slightly detuned saws a semitone-ish apart, slowly breathing through a filter
  const droneFilter = ac.createBiquadFilter();
  droneFilter.type = "lowpass";
  droneFilter.frequency.value = 260;
  droneFilter.Q.value = 5;
  lfo(ac, 0.07, 120, droneFilter.frequency);
  const droneGain = ac.createGain();
  droneGain.gain.value = 0;
  droneFilter.connect(droneGain);
  droneGain.connect(out);
  const drones = [55, 55 * 1.008, 58.3].map((f, i) => {
    const o = ac.createOscillator();
    o.type = i === 2 ? "sine" : "sawtooth";
    o.frequency.value = f;
    o.connect(droneFilter);
    o.start();
    return o;
  });

  // Wind: looping noise through a wandering band-pass
  const wind = noise(ac, 3);
  wind.loop = true;
  const windFilter = ac.createBiquadFilter();
  windFilter.type = "bandpass";
  windFilter.frequency.value = 500;
  windFilter.Q.value = 0.9;
  lfo(ac, 0.11, 280, windFilter.frequency);
  const windGain = ac.createGain();
  windGain.gain.value = 0;
  lfo(ac, 0.05, 0.015, windGain.gain); // gusts
  wind.connect(windFilter);
  windFilter.connect(windGain);
  windGain.connect(out);
  wind.start();

  // Dread: dissonant cluster with a nervous tremolo, silent until the Keys Keeper is near
  const dreadGain = ac.createGain();
  dreadGain.gain.value = 0;
  const tremolo = ac.createGain();
  tremolo.gain.value = 0.7;
  lfo(ac, 7, 0.3, tremolo.gain);
  tremolo.connect(dreadGain);
  dreadGain.connect(out);
  [196, 207.65, 277.2, 415.3].forEach((f) => {
    const o = ac.createOscillator();
    o.type = "triangle";
    o.frequency.value = f;
    o.connect(tremolo);
    o.start();
  });

  amb = { droneGain, droneFilter, drones, windGain, dreadGain };
};

const MOODS: Record<Mood, { drone: number; wind: number; pitch: number }> = {
  forest: { drone: 0.035, wind: 0.05, pitch: 1 },
  resting: { drone: 0.07, wind: 0.035, pitch: 0.89 },
  van: { drone: 0.06, wind: 0.012, pitch: 0.8 },
  silent: { drone: 0, wind: 0, pitch: 1 },
};

const owl = (ac: AudioContext, out: GainNode) => {
  [0, 0.45].forEach((delay, i) => {
    const t = ac.currentTime + delay;
    const o = ac.createOscillator();
    o.frequency.setValueAtTime(i ? 360 : 400, t);
    o.frequency.exponentialRampToValueAtTime(i ? 300 : 340, t + 0.35);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.05, t + 0.06);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
    o.connect(g);
    g.connect(out);
    o.start(t);
    o.stop(t + 0.45);
  });
};

// Detuned bell that rings out for a few seconds
const bell = (ac: AudioContext, out: GainNode) => {
  const base = [523, 622, 740, 831][Math.floor(Math.random() * 4)];
  const t = ac.currentTime;
  [1, 1.007, 2.76].forEach((m, i) => {
    const o = ac.createOscillator();
    o.frequency.value = base * m;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(i === 2 ? 0.008 : 0.025, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 3.5);
    o.connect(g);
    g.connect(out);
    o.start(t);
    o.stop(t + 3.6);
  });
};

// Breathy whisper from a random side
const whisper = (ac: AudioContext, out: GainNode) => {
  const n = noise(ac, 1);
  const f = ac.createBiquadFilter();
  f.type = "bandpass";
  f.Q.value = 4;
  const t = ac.currentTime;
  f.frequency.setValueAtTime(1800 + Math.random() * 1500, t);
  f.frequency.linearRampToValueAtTime(1200 + Math.random() * 1000, t + 0.9);
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.06, t + 0.25);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.95);
  const pan = ac.createStereoPanner();
  pan.pan.value = Math.random() * 2 - 1;
  n.connect(f);
  f.connect(g);
  g.connect(pan);
  pan.connect(out);
  n.start(t);
};

// Metal creak of the van body
const creak = (ac: AudioContext, out: GainNode) => {
  const t = ac.currentTime;
  const o = ac.createOscillator();
  o.type = "sawtooth";
  o.frequency.setValueAtTime(130 + Math.random() * 60, t);
  o.frequency.linearRampToValueAtTime(85 + Math.random() * 30, t + 0.7);
  lfo(ac, 23, 12, o.frequency);
  const f = ac.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.value = 900;
  f.Q.value = 6;
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.05, t + 0.1);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.75);
  o.connect(f);
  f.connect(g);
  g.connect(out);
  o.start(t);
  o.stop(t + 0.8);
};

const SPOOKY_EVENTS: Record<Mood, ((ac: AudioContext, out: GainNode) => void)[]> = {
  forest: [owl, owl, whisper],
  resting: [bell, whisper, whisper, bell],
  van: [creak, creak, whisper],
  silent: [],
};

// Low double thump, like a heartbeat
export const playHeartbeat = (volume: number) => {
  if (!ctx || !bus || volume <= 0.01) return;
  const ac = ctx;
  [0, 0.16].forEach((delay, i) => {
    const t = ac.currentTime + delay;
    const o = ac.createOscillator();
    o.frequency.setValueAtTime(62, t);
    o.frequency.exponentialRampToValueAtTime(38, t + 0.12);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime((i ? 0.35 : 0.5) * volume, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    o.connect(g);
    g.connect(bus as GainNode);
    o.start(t);
    o.stop(t + 0.2);
  });
};

// Scare stab when the Keys Keeper arrives right outside
export const playSting = () => {
  if (!ctx || !bus) return;
  const ac = ctx;
  const t = ac.currentTime;
  [311, 329.6, 466.2, 622.3].forEach((f) => {
    const o = ac.createOscillator();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(f, t);
    o.frequency.linearRampToValueAtTime(f * 0.97, t + 1.2);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.045, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.3);
    o.connect(g);
    g.connect(bus as GainNode);
    o.start(t);
    o.stop(t + 1.4);
  });
};

// Called every frame. `dread` (0..1) is how close the Keys Keeper is.
export const updateAmbience = (next: Mood, dread: number, dt: number) => {
  if (!ctx || !bus || !amb) return;
  const ac = ctx;
  const now = ac.currentTime;
  if (next !== mood) {
    mood = next;
    const m = MOODS[mood];
    amb.droneGain.gain.setTargetAtTime(m.drone, now, 1.2);
    amb.windGain.gain.setTargetAtTime(m.wind, now, 1.2);
    amb.drones.forEach((o, i) => o.frequency.setTargetAtTime([55, 55 * 1.008, 58.3][i] * m.pitch, now, 2));
  }

  // Dread chord swells and the drone opens up as he gets closer
  amb.dreadGain.gain.setTargetAtTime(dread * dread * 0.05, now, 0.3);
  amb.droneFilter.frequency.setTargetAtTime(260 + dread * 500, now, 0.3);

  // Heartbeat speeds up with dread
  if (dread > 0.15) {
    heartbeatTimer -= dt;
    if (heartbeatTimer <= 0) {
      playHeartbeat(0.4 + dread * 0.6);
      heartbeatTimer = 1.0 - dread * 0.55;
    }
  } else {
    heartbeatTimer = 0;
  }

  // Random spooky one-offs (not while he's close — that's the dread layer's job)
  const events = SPOOKY_EVENTS[mood];
  if (events.length && dread === 0) {
    eventTimer -= dt;
    if (eventTimer <= 0) {
      events[Math.floor(Math.random() * events.length)](ac, bus);
      eventTimer = 5 + Math.random() * 9;
    }
  }
};

// ---------- shooting and monster sound effects ----------

// A pitched tone that slides from f0 to f1, with a quick attack and an exponential fade
const tone = (type: OscillatorType, f0: number, f1: number, duration: number, peak: number, delay = 0, vibrato = 0) => {
  if (!ctx || !bus) return;
  const ac = ctx;
  const t = ac.currentTime + delay;
  const o = ac.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(f0, t);
  o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + duration);
  if (vibrato) lfo(ac, 28, vibrato, o.frequency);
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  o.connect(g);
  g.connect(bus);
  o.start(t);
  o.stop(t + duration + 0.05);
};

// Filtered noise whose filter sweeps from f0 to f1: hisses, whooshes, sizzles and rumbles
const hiss = (filter: BiquadFilterType, f0: number, f1: number, duration: number, peak: number, delay = 0) => {
  if (!ctx || !bus) return;
  const ac = ctx;
  const t = ac.currentTime + delay;
  const n = noise(ac, duration + 0.05);
  const f = ac.createBiquadFilter();
  f.type = filter;
  f.Q.value = filter === "bandpass" ? 1.5 : 0.7;
  f.frequency.setValueAtTime(f0, t);
  f.frequency.exponentialRampToValueAtTime(f1, t + duration);
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + Math.min(0.05, duration / 4));
  g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  n.connect(f);
  f.connect(g);
  g.connect(bus);
  n.start(t);
};

// Evaporator shot: a bright zap; charged shots (power up to 1) are deeper, longer and louder
export const playShoot = (power: number) => {
  tone("square", 1400 - power * 700, 260 - power * 140, 0.14 + power * 0.25, 0.12 + power * 0.06);
  tone("sawtooth", 900 - power * 400, 120, 0.12 + power * 0.3, 0.07 + power * 0.05);
  if (power > 0.2) hiss("highpass", 3000, 800, 0.2 + power * 0.3, 0.12 * power);
};

// Rising whine while the evaporator charges (call every frame; power 0 = silent)
let chargeOsc: OscillatorNode | null = null;
let chargeGain: GainNode | null = null;
export const updateChargeHum = (power: number) => {
  if (!ctx || !bus) return;
  if (!chargeOsc || !chargeGain) {
    chargeOsc = ctx.createOscillator();
    chargeOsc.type = "triangle";
    chargeGain = ctx.createGain();
    chargeGain.gain.value = 0;
    lfo(ctx, 18, 6, chargeOsc.frequency);
    chargeOsc.connect(chargeGain);
    chargeGain.connect(bus);
    chargeOsc.start();
  }
  const now = ctx.currentTime;
  chargeOsc.frequency.setTargetAtTime(220 + power * 660, now, 0.05);
  chargeGain.gain.setTargetAtTime(power > 0 ? 0.03 + power * 0.04 : 0, now, 0.04);
};

// Grave gets hurt: short low grunt
export const playGraveHurt = () => {
  tone("sawtooth", 190, 110, 0.18, 0.12);
  hiss("lowpass", 900, 300, 0.12, 0.15);
};

// Destruction Maker
export const playLavaThrow = () => hiss("bandpass", 300, 1400, 0.35, 0.18);
export const playLavaSplat = (volume: number) => {
  tone("sine", 120, 50, 0.18, 0.25 * volume);
  hiss("highpass", 4000, 1500, 0.5, 0.18 * volume, 0.02); // sizzle
};
export const playGoblinHurt = () => {
  const p = 0.9 + Math.random() * 0.25;
  tone("sawtooth", 620 * p, 300 * p, 0.16, 0.09, 0, 40); // squeal
};
export const playGoblinDeath = () => {
  tone("sawtooth", 700, 70, 1.1, 0.12, 0, 60); // long falling screech
  tone("square", 350, 40, 1.0, 0.05, 0.05);
  hiss("highpass", 2500, 600, 1.6, 0.22, 0.1); // evaporating steam
};

// THE UNSTABLE
export const playUnstableEmerge = () => {
  hiss("lowpass", 180, 60, 0.6, 0.35); // rumble
  hiss("bandpass", 1800, 600, 0.12, 0.2, 0.25); // ground cracks open
};
export const playUnstableHurt = () => {
  // Glitchy blip: three random pitch jumps
  for (let i = 0; i < 3; i++) {
    const f = 300 + Math.random() * 900;
    tone("square", f, f * 0.9, 0.04, 0.05, i * 0.035);
  }
};
export const playUnstableDeath = () => {
  tone("sine", 520, 90, 0.7, 0.14, 0, 90); // warbling dissolve
  tone("square", 1200, 300, 0.25, 0.03, 0.05);
  hiss("highpass", 3500, 900, 0.8, 0.16, 0.05); // fizz
};
