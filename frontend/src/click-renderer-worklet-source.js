// AudioWorklet modules run in a separate global scope. Keep the source inside
// the app bundle so desktop authentication cannot block a second file request.
export const DEFAULT_CLICK_SOUND = 'classic';
export const CLICK_SOUND_IDS = Object.freeze(['classic', 'wood', 'hihat']);
export const normalizeClickSound = value => CLICK_SOUND_IDS.includes(value) ? value : DEFAULT_CLICK_SOUND;
export const DEFAULT_CLICK_PITCH = 'standard';
export const CLICK_PITCH_IDS = Object.freeze(['low', 'standard', 'high']);
export const normalizeClickPitch = value => CLICK_PITCH_IDS.includes(value) ? value : DEFAULT_CLICK_PITCH;
export const CLICK_SOURCE_GAIN = 1.2;

export const clickRendererWorkletSource = `
const CLICK_SOUNDS = new Set(${JSON.stringify(['classic', 'wood', 'hihat'])});
const CLICK_PITCHES = ${JSON.stringify({ low: 1200, standard: 1800, high: 2400 })};
class ClickRendererProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.voiceFrame = -1;
    this.refractoryFrames = Math.round(sampleRate * 0.1);
    this.refractoryRemaining = 0;
    this.clickSound = '${DEFAULT_CLICK_SOUND}';
    this.clickPitch = '${DEFAULT_CLICK_PITCH}';
    this.noiseState = 1;
    this.previousNoise = 0;
    this.port.onmessage = ({ data }) => {
      const rate = Number(data?.playbackRate);
      if (rate > 0) {
        // The embedded marker is 55ms long. Pitch preservation can split that
        // marker while stretching it, so cover its full scaled span plus 20ms.
        this.refractoryFrames = Math.round(sampleRate * 0.075 / rate);
      }
      if (CLICK_SOUNDS.has(data?.clickSound)) this.clickSound = data.clickSound;
      if (Object.hasOwn(CLICK_PITCHES, data?.clickPitch)) this.clickPitch = data.clickPitch;
    };
  }

  process(inputs, outputs) {
    const marker = inputs[0]?.[0];
    const output = outputs[0]?.[0];
    if (!output) return true;
    for (let i = 0; i < output.length; i++) {
      if (this.refractoryRemaining > 0) this.refractoryRemaining--;
      if (this.refractoryRemaining === 0 && Math.abs(marker?.[i] ?? 0) >= 0.02) {
        this.voiceFrame = 0;
        this.refractoryRemaining = this.refractoryFrames;
        this.noiseState = 1;
        this.previousNoise = 0;
      }
      if (this.voiceFrame < 0) continue;
      const t = this.voiceFrame / sampleRate;
      if (t >= 0.045) {
        this.voiceFrame = -1;
        continue;
      }
      const attack = Math.min(1, t / 0.0015);
      let sample;
      if (this.clickSound === 'wood') {
        const decay = Math.exp(-t / 0.012);
        sample = (Math.sin(2 * Math.PI * 950 * t) * 0.72 + Math.sin(2 * Math.PI * 1450 * t) * 0.28) * attack * decay * 0.9;
      } else if (this.clickSound === 'hihat') {
        const decay = Math.exp(-t / 0.006);
        this.noiseState = (Math.imul(1664525, this.noiseState) + 1013904223) >>> 0;
        const noise = this.noiseState / 0x80000000 - 1;
        sample = (noise - this.previousNoise) * attack * decay * 0.55;
        this.previousNoise = noise;
      } else {
        const decay = Math.exp(-t / 0.009);
        sample = Math.sin(2 * Math.PI * CLICK_PITCHES[this.clickPitch] * t) * attack * decay * 0.9;
      }
      // Raise the source level without changing the user's 0–100 volume scale.
      output[i] = Math.max(-1, Math.min(1, sample * ${CLICK_SOURCE_GAIN}));
      this.voiceFrame++;
    }
    return true;
  }
}

registerProcessor('click-renderer', ClickRendererProcessor);
`;
