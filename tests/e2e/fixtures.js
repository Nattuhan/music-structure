export const silentWav = (seconds = 1, sampleRate = 8000) => {
  const samples = Math.round(seconds * sampleRate);
  const buffer = Buffer.alloc(44 + samples * 2);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + samples * 2, 4);
  buffer.write("WAVEfmt ", 8);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(samples * 2, 40);
  return buffer;
};

export const baselineStems = Object.fromEntries(
  ["vocals", "drums", "bass", "other"].map(name => [name, `/stems/e2e-baseline/${name}.wav`]),
);
export const baselineSession = {
  id: "e2e-baseline",
  title: "E2E Baseline",
  bpm: 120,
  date: "2026-08-16",
  assets: { stems: baselineStems },
};
export const baselineResult = {
  ...baselineSession,
  total_bars: 1,
  duration: 1,
  sections: [{ label: "verse", start_bar: 1, end_bar: 1, bar_count: 1, start_time: 0, end_time: 1, start_time_str: "00:00" }],
  beats: [0],
  downbeats: [0],
  assets: { stems: baselineStems },
};


// Non-silent reference attacks for PCM measurements, independent of click
// synthesis. A silent fixture cannot expose decoder/time-stretch offsets.
export const pulseWav = (seconds = 8, sampleRate = 44100) => {
  const buffer = silentWav(seconds, sampleRate);
  for (let i = 0; i < seconds * sampleRate; i++) {
    const time = i / sampleRate;
    const phase = (time - 1) % 0.5;
    const value = time >= 1 && phase < 0.06 ? 0.7 * Math.sin(2 * Math.PI * 470 * phase) * Math.exp(-55 * phase) : 0;
    buffer.writeInt16LE(Math.round(value * 32767), 44 + i * 2);
  }
  return buffer;
};
