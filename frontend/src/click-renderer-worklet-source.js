// AudioWorklet modules run in a separate global scope. Keep the source inside
// the app bundle so desktop authentication cannot block a second file request.
export const clickRendererWorkletSource = `
class ClickRendererProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.voiceFrame = -1;
    this.refractoryFrames = Math.round(sampleRate * 0.1);
    this.refractoryRemaining = 0;
    this.port.onmessage = ({ data }) => {
      const rate = Number(data?.playbackRate);
      if (rate > 0) {
        // The embedded marker is 55ms long. Pitch preservation can split that
        // marker while stretching it, so cover its full scaled span plus 20ms.
        this.refractoryFrames = Math.round(sampleRate * 0.075 / rate);
      }
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
      }
      if (this.voiceFrame < 0) continue;
      const t = this.voiceFrame / sampleRate;
      if (t >= 0.045) {
        this.voiceFrame = -1;
        continue;
      }
      const attack = Math.min(1, t / 0.0015);
      const decay = Math.exp(-t / 0.009);
      output[i] = Math.sin(2 * Math.PI * 1800 * t) * attack * decay * 0.9;
      this.voiceFrame++;
    }
    return true;
  }
}

registerProcessor('click-renderer', ClickRendererProcessor);
`;
