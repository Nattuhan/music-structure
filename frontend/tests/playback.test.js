import assert from 'node:assert/strict';
import test from 'node:test';
import { createStemTransport } from '../src/stem-transport.js';
import { planStemPlayback } from '../src/playback-sync.js';

class Media extends EventTarget {
  currentTime = 0;
  readyState = 4;
  paused = true;
  muted = true;
  playbackRate = 1;
  error = null;
  reject = false;
  play() { this.paused = false; return this.reject ? Promise.reject(new Error('blocked')) : Promise.resolve(); }
  pause() { this.paused = true; }
  load() { this.error = null; }
  fire(name) { this.dispatchEvent(new Event(name)); }
}
const flush = () => new Promise(resolve => setImmediate(resolve));
const fixture = (options = {}) => {
  const clock = { time: 10, rate: 1, playing: true };
  const players = { vocals: new Media(), drums: new Media() };
  const events = [];
  const transport = createStemTransport({ getTime: () => clock.time, getRate: () => clock.rate,
    isPlaying: () => clock.playing, onChange: state => events.push(state), ...options });
  transport.setPlayers(players);
  clock.playing = false;
  const setMix = (mix, volume = 1) => transport.setMix(planStemPlayback({ stemNames: Object.keys(players), mix, mobile: false, activated: true }), mix, volume);
  setMix({ vocals: 100, drums: 100 });
  clock.playing = true;
  return { clock, players, transport, events, setMix };
};

test('全パートと一部パートの失敗は元音源に戻し、失敗パートを示す', async () => {
  for (const failed of [['vocals'], ['vocals', 'drums']]) {
    const { players, transport } = fixture();
    failed.forEach(name => { players[name].reject = true; });
    assert.equal(await transport.play(), false);
    assert.deepEqual(transport.snapshot(), { state: 'failed', failures: failed, useOriginalMix: true });
    assert.ok(Object.values(players).every(player => player.paused && player.muted));
    failed.forEach(name => { players[name].reject = false; });
    assert.equal(await transport.retry(), true);
    assert.equal(transport.snapshot().useOriginalMix, false);
  }
});

test('再生中のパートエラーも元音源へ戻る', async () => {
  const { players, transport } = fixture();
  await transport.play();
  players.drums.fire('error');
  assert.equal(transport.snapshot().state, 'failed');
  assert.equal(transport.snapshot().useOriginalMix, true);
});

test('全ミュートは音量変更・再生再開・失敗後も無音を維持する', async () => {
  const { players, transport, setMix } = fixture();
  players.vocals.reject = true;
  await transport.play();
  setMix({ vocals: 0, drums: 0 });
  setMix({ vocals: 0, drums: 0 }, 0.8);
  await transport.play();
  assert.deepEqual(transport.snapshot(), { state: 'silent', failures: [], useOriginalMix: false });
  assert.ok(Object.values(players).every(player => player.paused && player.muted));
  players.vocals.reject = false;
  setMix({ vocals: 50, drums: 0 }, 0.8);
  await flush();
  assert.equal(transport.snapshot().state, 'stems');
  assert.equal(players.vocals.volume, 0.4);
  assert.equal(players.drums.paused, true);
});

test('読み込み待ち後は最新の時刻・速度で全パートをそろえる', async () => {
  const { players, transport, clock } = fixture();
  await transport.play();
  players.drums.readyState = 2;
  players.drums.fire('waiting');
  assert.equal(transport.snapshot().state, 'waiting');
  assert.ok(Object.values(players).every(player => player.muted && player.paused));
  clock.time = 15;
  clock.rate = 0.75;
  players.drums.readyState = 4;
  players.drums.fire('canplay');
  await flush();
  assert.equal(transport.snapshot().state, 'stems');
  for (const player of Object.values(players)) {
    assert.equal(player.currentTime, 15);
    assert.equal(player.playbackRate, 0.75);
    assert.equal(player.muted, false);
  }
  clock.time = 16;
  transport.sync();
  assert.equal(players.drums.currentTime, 15, '通常再生では周期的にシークしない');
});

test('同期シークに伴うwaitingで復帰処理を繰り返さない', async () => {
  const { players, transport } = fixture();
  await transport.play();
  players.drums.seeking = true;
  players.drums.readyState = 2;
  players.drums.fire('waiting');
  assert.equal(transport.snapshot().state, 'stems');
  players.drums.seeking = false;
  players.drums.fire('waiting');
  assert.equal(transport.snapshot().state, 'waiting');
});

test('元音源の読み込み停止・復帰と待機中の一時停止を扱う', async () => {
  const { players, transport, clock } = fixture();
  await transport.play();
  transport.setMasterWaiting(true);
  clock.time = 20;
  transport.setMasterWaiting(false);
  await flush();
  assert.equal(players.vocals.currentTime, 20);
  transport.setMasterWaiting(true);
  clock.playing = false;
  transport.pause();
  transport.setMasterWaiting(false);
  await flush();
  assert.ok(Object.values(players).every(player => player.paused));
});

test('全パートのシーク完了まで基準音源を保持し、停止操作では再開しない', async () => {
  const releases = [];
  const { players, transport } = fixture({ holdMaster: () => resume => releases.push(resume) });
  players.vocals.play = () => { players.vocals.readyState = 2; return Promise.resolve(); };
  const pending = transport.play();
  await flush();
  assert.equal(transport.snapshot().state, 'starting');
  assert.deepEqual(releases, []);
  transport.pause();
  await pending;
  assert.deepEqual(releases, [false]);
  assert.equal(players.vocals.paused, true);
});

test('重複する再生通知で準備中や再生中のパートを中断しない', async () => {
  const { players, transport } = fixture();
  let resolve;
  let starts = 0;
  players.vocals.play = () => { starts++; return starts === 1 ? new Promise(done => { resolve = done; }) : Promise.resolve(); };
  const pending = transport.play();
  await transport.play();
  assert.equal(starts, 1);
  resolve();
  await pending;
  const preparedStarts = starts;
  await transport.play();
  assert.equal(starts, preparedStarts);
  assert.equal(transport.snapshot().state, 'stems');
});

test('古い非同期再生結果は曲切替後や停止後の状態を上書きしない', async () => {
  const { players, transport, clock } = fixture();
  let resolve;
  players.vocals.play = () => new Promise(done => { resolve = done; });
  const pending = transport.play();
  clock.playing = false;
  transport.pause();
  transport.destroy();
  resolve();
  await pending;
  assert.equal(transport.snapshot().state, 'original');
  players.drums.fire('error');
  assert.equal(transport.snapshot().state, 'original');
});

test('元音源を明示選択した後は復帰イベントでパートを勝手に再開しない', async () => {
  const { players, transport } = fixture();
  await transport.play();
  players.drums.readyState = 2;
  players.drums.fire('waiting');
  transport.useOriginal();
  players.drums.readyState = 4;
  players.drums.fire('canplay');
  await flush();
  assert.equal(transport.snapshot().state, 'original');
  assert.equal(players.drums.paused, true);
});
