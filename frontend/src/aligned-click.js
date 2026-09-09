import { clickRendererWorkletSource, normalizeClickSound } from './click-renderer-worklet-source.js';

// Carry every part and the click as channels of ONE media file. Chromium's pitch
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

export const alignedWav = async (buffer, beats, { tracks = [], signal, yieldTask = () => new Promise(resolve => setTimeout(resolve, 0)) } = {}) => {
  const { sampleRate, length } = buffer;
  const buffers = [buffer, ...tracks];
  if (buffers.some(track => track && track.sampleRate !== sampleRate)) throw new Error('サンプルレートが一致しません');
  const channels = buffers.length * 2 + 1, bytesPerFrame = channels * 4;
  const planes = buffers.flatMap(track => track ? [track.getChannelData(0), track.getChannelData(Math.min(1, track.numberOfChannels - 1))] : [null, null]);
  const header = new Uint8Array(44);
  const view = new DataView(header.buffer);
  const text = (offset, value) => [...value].forEach((char, i) => view.setUint8(offset + i, char.charCodeAt(0)));
  if (length * bytesPerFrame + 36 > 0xffffffff) throw new Error('音源が長すぎます');
  text(0, 'RIFF'); view.setUint32(4, 36 + length * bytesPerFrame, true); text(8, 'WAVE');
  text(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 3, true); // IEEE float, no quantization of music
  view.setUint16(22, channels, true); view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * bytesPerFrame, true); view.setUint16(32, bytesPerFrame, true); view.setUint16(34, 32, true);
  text(36, 'data'); view.setUint32(40, length * bytesPerFrame, true);
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
    for (let channel = 0; channel < planes.length; channel++) {
      const plane = planes[channel];
      if (!plane) continue;
      for (let i = 0; i < count; i++) samples[i * channels + channel] = plane[start + i] ?? 0;
    }
    while (beatIndex < positions.length && positions[beatIndex] + click.length <= start) beatIndex++;
    for (let j = beatIndex; j < positions.length && positions[j] < start + count; j++) {
      const offset = positions[j] - start;
      for (let k = Math.max(0, -offset); k < click.length && offset + k < count; k++) samples[(offset + k) * channels + channels - 1] += click[k];
    }
    chunks.push(samples);
    if (start % (sampleRate * 8) === 0) await yieldTask();
  }
  signal?.throwIfAborted();
  return new Blob(chunks, { type: 'audio/wav' });
};

const workletLoads = new WeakMap();
export const loadClickRenderer = ctx => {
  if (!workletLoads.has(ctx)) {
    const url = URL.createObjectURL(new Blob([clickRendererWorkletSource], { type: 'text/javascript' }));
    workletLoads.set(ctx, ctx.audioWorklet.addModule(url).finally(() => URL.revokeObjectURL(url)));
  }
  return workletLoads.get(ctx);
};

// The stem "players" below are gain controls over the same media, not separate
// decoders. Their time/seek/rate always comes from that one transport.
export const connectAlignedOutput = (ctx, source, media, stems = []) => {
  const splitter = ctx.createChannelSplitter(3 + stems.length * 2);
  const clickRenderer = new AudioWorkletNode(ctx, 'click-renderer', { outputChannelCount: [1] });
  const click = ctx.createGain(); click.gain.value = 0;
  const nodes = [splitter, clickRenderer, click], removals = [], players = {};
  source.connect(splitter);
  const musicGain = track => {
    const stereo = ctx.createChannelMerger(2), gain = ctx.createGain();
    splitter.connect(stereo, track * 2, 0); splitter.connect(stereo, track * 2 + 1, 1);
    stereo.connect(gain); gain.connect(ctx.destination); nodes.push(stereo, gain);
    return gain;
  };
  const original = musicGain(0);
  let volume = media.volume, muted = media.muted;
  media.volume = 1; media.muted = false;
  const update = () => { original.gain.value = muted ? 0 : volume; };
  Object.defineProperty(media, 'volume', { configurable: true, get: () => volume, set: value => { volume = Math.max(0, Math.min(1, Number(value) || 0)); update(); } });
  Object.defineProperty(media, 'muted', { configurable: true, get: () => muted, set: value => { muted = !!value; update(); } });
  update();
  stems.forEach(({ name, url, unavailable }, index) => {
    const player = new Audio(), gain = musicGain(index + 1);
    player.dataset.stem = name;
    let partVolume = 1, partMuted = true, partPaused = true;
    const apply = () => { gain.gain.value = partMuted || partPaused ? 0 : partVolume; };
    Object.defineProperties(player, {
      src: { configurable: true, get: () => url },
      currentTime: { configurable: true, get: () => media.currentTime, set: value => { if (Math.abs(media.currentTime - value) > 0.005) media.currentTime = value; } },
      duration: { configurable: true, get: () => media.duration },
      playbackRate: { configurable: true, get: () => media.playbackRate, set: value => { if (media.playbackRate !== value) media.playbackRate = value; } },
      seeking: { configurable: true, get: () => media.seeking },
      readyState: { configurable: true, get: () => media.readyState },
      error: { configurable: true, get: () => unavailable ? new Error('Stem unavailable') : media.error },
      paused: { configurable: true, get: () => partPaused || media.paused },
      muted: { configurable: true, get: () => partMuted, set: value => { partMuted = !!value; apply(); } },
      volume: { configurable: true, get: () => partVolume, set: value => { partVolume = Math.max(0, Math.min(1, Number(value) || 0)); apply(); } },
    });
    player.play = () => { if (unavailable) return Promise.reject(new Error('Stem unavailable')); partPaused = false; apply(); return Promise.resolve(); };
    player.pause = () => { partPaused = true; apply(); };
    player.load = () => {};
    for (const name of ['seeking', 'seeked', 'canplay']) {
      const forward = () => player.dispatchEvent(new Event(name));
      media.addEventListener(name, forward); removals.push(() => media.removeEventListener(name, forward));
    }
    apply(); players[name] = player;
  });
  splitter.connect(clickRenderer, 2 + stems.length * 2); clickRenderer.connect(click); click.connect(ctx.destination);
  const setPlaybackRate = playbackRate => clickRenderer.port.postMessage({ playbackRate });
  const setClickSound = clickSound => clickRenderer.port.postMessage({ clickSound: normalizeClickSound(clickSound) });
  setPlaybackRate(media.playbackRate || 1);
  return { click, players, setPlaybackRate, setClickSound, destroy() {
    removals.forEach(remove => remove());
    for (const player of Object.values(players)) player.pause();
    for (const node of nodes) node.disconnect();
    clickRenderer.port.close();
    delete media.volume; delete media.muted;
    media.volume = volume; media.muted = muted;
  } };
};
