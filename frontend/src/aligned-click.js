// Carry the click as a third channel of the same media file. Chromium's pitch
// preservation moves audio transients relative to currentTime; an oscillator
// scheduled from that clock cannot follow those moves. Channels in one decoder
// share both the time stretch and every seek, without a device-specific offset.
export const clickWave = sampleRate => {
  const wave = new Float32Array(Math.ceil(sampleRate * 0.055));
  let previous = 0, filtered = 0;
  const alpha = Math.exp(-2 * Math.PI * 700 / sampleRate);
  for (let i = 0; i < wave.length; i++) {
    const t = i / sampleRate;
    const square = Math.sin(2 * Math.PI * 1800 * t) >= 0 ? 1 : -1;
    filtered = alpha * (filtered + square - previous);
    previous = square;
    const envelope = t < 0.003 ? 0.0001 * (0.9 / 0.0001) ** (t / 0.003)
      : 0.9 * (0.0001 / 0.9) ** ((t - 0.003) / 0.042);
    wave[i] = filtered * envelope;
  }
  return wave;
};

export const alignedWav = async (buffer, beats, { signal, yieldTask = () => new Promise(resolve => setTimeout(resolve, 0)) } = {}) => {
  const { sampleRate, length } = buffer;
  const channels = 3, bytesPerFrame = channels * 4;
  const header = new Uint8Array(44);
  const view = new DataView(header.buffer);
  const text = (offset, value) => [...value].forEach((char, i) => view.setUint8(offset + i, char.charCodeAt(0)));
  if (length * bytesPerFrame + 36 > 0xffffffff) throw new Error('音源が長すぎます');
  text(0, 'RIFF'); view.setUint32(4, 36 + length * bytesPerFrame, true); text(8, 'WAVE');
  text(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 3, true); // IEEE float, no quantization of music
  view.setUint16(22, channels, true); view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * bytesPerFrame, true); view.setUint16(32, bytesPerFrame, true); view.setUint16(34, 32, true);
  text(36, 'data'); view.setUint32(40, length * bytesPerFrame, true);
  const left = buffer.getChannelData(0), right = buffer.getChannelData(Math.min(1, buffer.numberOfChannels - 1));
  const click = clickWave(sampleRate);
  const positions = [...new Set(beats.filter(Number.isFinite).filter(t => t >= 0).map(t => Math.round(t * sampleRate)))].sort((a, b) => a - b);
  const chunks = [header];
  let beatIndex = 0;
  // Small chunks yield to controls while preparing a long track. Blob copies
  // these chunks; do not retain full decoded tracks after preparation.
  for (let start = 0; start < length; start += sampleRate) {
    signal?.throwIfAborted();
    const count = Math.min(sampleRate, length - start);
    const samples = new Float32Array(count * channels);
    for (let i = 0; i < count; i++) { samples[i * 3] = left[start + i]; samples[i * 3 + 1] = right[start + i]; }
    while (beatIndex < positions.length && positions[beatIndex] + click.length <= start) beatIndex++;
    for (let j = beatIndex; j < positions.length && positions[j] < start + count; j++) {
      const offset = positions[j] - start;
      for (let k = Math.max(0, -offset); k < click.length && offset + k < count; k++) samples[(offset + k) * 3 + 2] += click[k];
    }
    chunks.push(samples);
    if (start % (sampleRate * 8) === 0) await yieldTask();
  }
  signal?.throwIfAborted();
  return new Blob(chunks, { type: 'audio/wav' });
};

export const connectAlignedOutput = (ctx, source, media) => {
  const splitter = ctx.createChannelSplitter(3);
  const stereo = ctx.createChannelMerger(2);
  const music = ctx.createGain(), click = ctx.createGain();
  source.connect(splitter);
  splitter.connect(stereo, 0, 0); splitter.connect(stereo, 1, 1);
  stereo.connect(music); music.connect(ctx.destination);
  splitter.connect(click, 2); click.gain.value = 0; click.connect(ctx.destination);
  let volume = media.volume, muted = media.muted;
  // Native volume/mute would also attenuate the clock channel. Keep music
  // controls after the splitter so click volume is independent, including
  // when every music part is muted.
  media.volume = 1; media.muted = false;
  const update = () => { music.gain.value = muted ? 0 : volume; };
  Object.defineProperty(media, 'volume', { configurable: true, get: () => volume, set: value => { volume = Math.max(0, Math.min(1, Number(value) || 0)); update(); } });
  Object.defineProperty(media, 'muted', { configurable: true, get: () => muted, set: value => { muted = !!value; update(); } });
  update();
  return { click, destroy() {
    for (const node of [splitter, stereo, music, click]) node.disconnect();
    delete media.volume; delete media.muted;
    media.volume = volume; media.muted = muted;
  } };
};
