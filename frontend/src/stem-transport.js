// Own the asynchronous stem lifecycle separately from the screen. Generation
// tokens prevent a late play() result from reviving a paused or replaced song.
export const createStemTransport = ({ getTime, getRate, isPlaying, onChange, onSync = () => {} }) => {
  let players = {};
  let mix = {};
  let plan = { useOriginalMix: true, activeStems: [] };
  let state = 'original';
  let failures = [];
  let manualOriginal = false;
  let masterWaiting = false;
  let generation = 0;
  let volume = 1;
  const blocked = new Set();
  const listeners = [];
  const snapshot = () => ({ state, failures: [...failures], useOriginalMix: state !== 'stems' && state !== 'silent' });
  const notify = () => onChange(snapshot());
  const silencePlayers = () => {
    for (const player of Object.values(players)) { player.muted = true; player.pause(); }
  };
  const sync = (time = getTime(), { force = false } = {}) => {
    let maximumDrift = 0;
    for (const name of plan.activeStems) {
      const player = players[name];
      if (!player) continue;
      if (Math.abs(player.playbackRate - getRate()) > 0.001) player.playbackRate = getRate();
      if (force && player.readyState >= 1) {
        maximumDrift = Math.max(maximumDrift, Math.abs(player.currentTime - time));
        try { player.currentTime = time; } catch {}
      }
    }
    if (force && plan.activeStems.length) onSync(time, maximumDrift, plan.activeStems.length);
  };
  const baseState = () => plan.useOriginalMix ? 'original'
    : !plan.activeStems.length ? 'silent'
    : manualOriginal ? 'original'
    : failures.length ? 'failed'
    : masterWaiting || blocked.size ? 'waiting' : 'ready';
  const fail = names => {
    failures = [...new Set([...failures, ...names])];
    generation += 1;
    silencePlayers();
    state = baseState();
    notify();
  };
  const play = async () => {
    const token = ++generation;
    silencePlayers();
    state = baseState();
    if (state !== 'ready' || !isPlaying()) { notify(); return false; }
    state = 'starting';
    notify(); // Keep the original audible until every selected stem can play.
    sync(getTime(), { force: true });
    const names = [...plan.activeStems];
    const results = await Promise.allSettled(names.map(name => {
      const player = players[name];
      return player ? player.play() : Promise.reject(new Error('Missing stem'));
    }));
    if (token !== generation) return false;
    const failed = names.filter((_, i) => results[i].status === 'rejected');
    if (failed.length) { fail(failed); return false; }
    if (!isPlaying()) { pause(); return false; }
    // Downloads may have taken seconds. Rejoin the current master position,
    // never the stale position at which the request started.
    sync(getTime(), { force: true });
    state = 'stems';
    notify(); // Mute the original before making the stems audible.
    for (const name of names) players[name].muted = false;
    return true;
  };
  const pause = () => {
    generation += 1;
    silencePlayers();
    masterWaiting = false;
    state = baseState();
    notify();
  };
  const setMix = (nextPlan, nextMix, nextVolume) => {
    const changed = plan.useOriginalMix !== nextPlan.useOriginalMix || plan.activeStems.join() !== nextPlan.activeStems.join();
    plan = nextPlan;
    mix = nextMix;
    volume = nextVolume;
    failures = failures.filter(name => plan.activeStems.includes(name));
    for (const name of [...blocked]) if (!plan.activeStems.includes(name)) blocked.delete(name);
    for (const [name, player] of Object.entries(players)) {
      player.volume = volume * Math.min(100, Math.max(0, Number(mix[name]) || 0)) / 100;
    }
    if (changed) {
      if (isPlaying()) void play();
      else pause();
    }
  };
  const setPlayers = next => {
    destroy();
    players = next;
    manualOriginal = false;
    failures = [];
    for (const [name, player] of Object.entries(players)) {
      const listen = (event, handler) => {
        player.addEventListener(event, handler);
        listeners.push(() => player.removeEventListener(event, handler));
      };
      listen('error', () => {
        if (plan.activeStems.includes(name)) fail([name]);
      });
      const waiting = () => {
        // Our own group seek briefly emits waiting. Treating that as a new
        // stall would seek again on canplay and never finish recovering.
        if (state !== 'stems' || player.seeking || !plan.activeStems.includes(name) || player.readyState >= 3) return;
        blocked.add(name);
        generation += 1;
        silencePlayers();
        state = 'waiting';
        notify();
      };
      listen('waiting', waiting);
      listen('stalled', waiting);
      listen('canplay', () => {
        if (!blocked.has(name)) return;
        blocked.delete(name);
        if (!blocked.size && !masterWaiting && isPlaying()) void play();
      });
    }
    state = baseState();
    notify();
  };
  const setMasterWaiting = waiting => {
    if (masterWaiting === waiting) return;
    masterWaiting = waiting;
    if (waiting) {
      generation += 1;
      silencePlayers();
      state = baseState();
      notify();
    } else if (isPlaying()) void play();
  };
  const retry = () => {
    generation += 1;
    failures = [];
    manualOriginal = false;
    blocked.clear();
    for (const player of Object.values(players)) if (player.error) player.load();
    return play();
  };
  const useOriginal = () => {
    manualOriginal = true;
    generation += 1;
    silencePlayers();
    state = baseState();
    notify();
  };
  const destroy = () => {
    generation += 1;
    listeners.splice(0).forEach(remove => remove());
    silencePlayers();
    players = {};
    blocked.clear();
    failures = [];
    masterWaiting = false;
    manualOriginal = false;
    state = 'original';
  };
  return { setPlayers, setMix, play, pause, sync, retry, useOriginal, setMasterWaiting, destroy, snapshot };
};
