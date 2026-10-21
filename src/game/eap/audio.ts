// Tiny synthesized sound effects (no audio files). Browsers only allow audio after a
// user gesture, so the page calls unlockAudio() from its input handlers.

let ctx: AudioContext | null = null;

export const unlockAudio = () => {
  if (!ctx) {
    try {
      ctx = new AudioContext();
    } catch {
      return;
    }
  }
  if (ctx.state === "suspended") void ctx.resume();
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
  g.connect(ac.destination);
  return g;
};

// Heavy thud: low sine drop plus a muffled noise hit
export const playFootstep = (volume: number) => {
  if (!ctx || volume <= 0.01) return;
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
  if (!ctx || volume <= 0.01) return;
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
    g.connect(ac.destination);
    osc.start(t);
    osc.stop(t + 0.15);
  }
};

// Door lock / latch clunk
export const playClunk = () => {
  if (!ctx) return;
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
  if (!ctx) return;
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
    g.connect(ac.destination);
    osc.start(t);
    osc.stop(t + 0.2);
  });
};

export const playDeath = () => {
  if (!ctx) return;
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
