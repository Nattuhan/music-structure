// Use a timer independent of rendering: animation frames stop in hidden windows.
// Media seconds advance at playbackRate; AudioContext seconds always advance
// in real time. Keep that conversion and reservation lifecycle in one place.
export const createMetronome = ({ getBeats, getTime, getRate, getAudioTime, isPlaying,
  emit, clear, schedule = callback => setTimeout(callback, 25), cancel = clearTimeout, lookAhead = () => 0.12 }) => {
  let generation = 0;
  let timer = 0;
  let active = false;
  let nextBeat = 0;
  let lastTime = 0;
  const align = time => {
    const index = getBeats().findIndex(beat => beat >= time - 0.02);
    nextBeat = index < 0 ? getBeats().length : index;
    lastTime = time;
  };
  const tick = token => {
    if (token !== generation || !active) return;
    if (isPlaying()) {
      const time = getTime();
      if (Math.abs(time - lastTime) > 0.25) { clear(); align(time); }
      lastTime = time;
      const rate = Math.max(0.01, Number(getRate()) || 1);
      const beats = getBeats();
      const audioTime = getAudioTime();
      while (nextBeat < beats.length && beats[nextBeat] <= time + lookAhead() * rate) {
        // Do not burst old beats after a buffering gap or a throttled timer.
        if (beats[nextBeat] >= time - 0.02) emit(audioTime + Math.max(0, (beats[nextBeat] - time) / rate));
        nextBeat += 1;
      }
    }
    timer = schedule(() => tick(token));
  };
  const stop = () => {
    active = false;
    generation += 1;
    if (timer) cancel(timer);
    timer = 0;
    clear();
  };
  const start = (time = getTime()) => {
    stop();
    active = true;
    align(time);
    const token = generation;
    timer = schedule(() => tick(token));
  };
  const reset = (time = getTime()) => {
    if (active) start(time);
    else { clear(); align(time); }
  };
  return { start, stop, reset };
};
