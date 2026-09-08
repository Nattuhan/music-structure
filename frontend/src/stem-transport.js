// Own the asynchronous stem lifecycle separately from the screen. Generation
// tokens prevent a late play() result from reviving a paused or replaced song.
export const createStemTransport = ({ getTime, getRate, isPlaying, onChange, onSync = () => {}, holdMaster = () => () => {} }) => {
  let players = {};
  let mix = {};
  let plan = { useOriginalMix: true, activeStems: [] };
  let state = 'original';
  let failures = [];
  let manualOriginal = false;
  let masterWaiting = false;
  let generation = 0;
  let volume = 1;
  let releaseMaster = null;
  const preparations = new Set();
  const cancelPreparation = (resume = false) => {
    for (const cancel of [...preparations]) cancel();
    const release = releaseMaster;
    releaseMaster = null;
    release?.(resume);
  };
  const prepare = (player, time) => new Promise((resolve, reject) => {
    let timeout;
    const finish = error => {
      clearTimeout(timeout);
      preparations.delete(cancel);
      for (const event of ['seeked', 'canplay', 'error']) player.removeEventListener(event, ready);
      error ? reject(error) : resolve();
    };
    const cancel = () => finish(new Error('Superseded playback'));
    const ready = () => {
      if (player.error) finish(new Error('Stem unavailable'));
      else if (player.readyState >= 3 && !player.seeking) finish();
    };
    preparations.add(cancel);
    for (const event of ['seeked', 'canplay', 'error']) player.addEventListener(event, ready);
    timeout = setTimeout(() => finish(new Error('Stem seek timed out')), 5000);
    if (Math.abs(player.currentTime - time) > 0.005) {
      try { player.currentTime = time; } catch (error) { finish(error); return; }
    }
    ready();
  });
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
        // Assigning even the same currentTime can suspend decoding. Avoid a
        // second seek when the previous group alignment is already accurate.
        if (Math.abs(player.currentTime - time) > 0.02) {
          try { player.currentTime = time; } catch {}
        }
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
    cancelPreparation(true);
    silencePlayers();
    state = baseState();
    notify();
  };
  const play = async () => {
    // WaveSurfer can report the same native play transition through both its
    // reactive bridge and media events. Never pause an in-flight start twice:
    // Chromium may reject even the replacement play() with that pending abort.
    if (state === 'starting') return false;
    if (state === 'stems') return true;
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
    // Once every decoder is ready, hold the master briefly while the group
    // seeks. Seeking against a moving master leaves the seek latency as a
    // permanent offset (notably with MP3); a common paused anchor avoids it.
    releaseMaster = holdMaster();
    silencePlayers();
    const anchor = getTime();
    const prepared = await Promise.allSettled(names.map(name => prepare(players[name], anchor)));
    if (token !== generation) return false;
    const unavailable = names.filter((_, i) => prepared[i].status === 'rejected');
    if (unavailable.length) { fail(unavailable); return false; }
    // All four seeks have completed before any player resumes.
    const resumed = names.map(name => players[name].play());
    const release = releaseMaster;
    releaseMaster = null;
    release?.(true);
    const started = await Promise.allSettled(resumed);
    if (token !== generation) return false;
    const rejected = names.filter((_, i) => started[i].status === 'rejected');
    if (rejected.length) { fail(rejected); return false; }
    state = 'stems';
    notify(); // Mute the original before making the stems audible.
    for (const name of names) players[name].muted = false;
    notify(); // The audible clock is now available to dependent schedulers.
    return true;
  };
  const pause = () => {
    generation += 1;
    cancelPreparation();
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
      generation += 1;
      cancelPreparation(true);
      silencePlayers();
      state = baseState();
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
    cancelPreparation(true);
    failures = [];
    manualOriginal = false;
    blocked.clear();
    silencePlayers();
    state = baseState();
    for (const player of Object.values(players)) if (player.error) player.load();
    return play();
  };
  const useOriginal = () => {
    manualOriginal = true;
    generation += 1;
    cancelPreparation(true);
    silencePlayers();
    state = baseState();
    notify();
  };
  const destroy = () => {
    generation += 1;
    cancelPreparation();
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
