class Measure extends AudioWorkletProcessor {
  constructor() {
    super();
    this.last = Array(6).fill(-1);
  }

  process(inputs) {
    for (let channel = 0; channel < inputs[0].length; channel++) {
      let peak = 0;
      for (let index = 0; index < inputs[0][channel].length; index++) {
        const value = Math.abs(inputs[0][channel][index]);
        const time = (currentFrame + index) / sampleRate;
        peak = Math.max(peak, value);
        if (value > 0.08 && time - this.last[channel] > 0.25) {
          this.last[channel] = time;
          this.port.postMessage({ ch: channel, t: time });
        }
      }
      if (channel === 5 && peak > 0.003) {
        this.port.postMessage({ ch: channel, t: currentFrame / sampleRate, peak, envelope: true });
      }
    }
    return true;
  }
}

registerProcessor('measure', Measure);
