const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const {
  appendPlaybackEvent,
  sanitizePlaybackEvent,
} = require("../playback-diagnostics.cjs");

test("再生診断イベントから許可した数値だけを保存する", () => {
  const event = sanitizePlaybackEvent({
    type: "stem-resync",
    sessionId: "song/../../secret",
    audioTime: 12.345678,
    drift: 0.09123,
    secret: "保存しない",
  }, new Date("2026-08-31T00:00:00.000Z"));

  assert.deepEqual(event, {
    timestamp: "2026-08-31T00:00:00.000Z",
    type: "stem-resync",
    sessionId: "song....secret",
    audioTime: 12.3457,
    drift: 0.0912,
  });
  assert.equal(sanitizePlaybackEvent({ type: "unknown" }), null);
});

test("再生診断ログを上限で一世代ローテーションする", t => {
  const logDir = fs.mkdtempSync(path.join(os.tmpdir(), "practice-lab-playback-log-"));
  t.after(() => fs.rmSync(logDir, { recursive: true, force: true }));
  const file = path.join(logDir, "playback.ndjson");
  fs.writeFileSync(file, "x".repeat(64));

  assert.equal(appendPlaybackEvent({
    fs,
    logDir,
    input: { type: "audio-waiting", audioTime: 3.2 },
    maxBytes: 32,
  }), true);

  assert.equal(fs.readFileSync(path.join(logDir, "playback.previous.ndjson"), "utf8").length, 64);
  assert.match(fs.readFileSync(file, "utf8"), /"type":"audio-waiting"/);
});

test('出力待ち時間・各パートの時計・範囲とクリック状態を保存する', () => {
  const event = sanitizePlaybackEvent({ type: 'playback-clock', reference: 'drums',
    audioTime: 30, referenceTime: 30.08, drumsTime: 30.08, playbackRate: 0.7,
    contextTime: 42, outputContextTime: 41.72, outputLatency: 0.28,
    clickEnabled: 1, loopEnabled: 1, loopStart: 20, loopEnd: 32,
    arbitrary: 'discard',
  });
  assert.equal(event.reference, 'drums');
  assert.equal(event.outputLatency, 0.28);
  assert.equal(event.drumsTime, 30.08);
  assert.equal(event.loopStart, 20);
  assert.equal(event.arbitrary, undefined);
  assert.equal(sanitizePlaybackEvent({ type: 'audio-ratechange' }).type, 'audio-ratechange');
});
