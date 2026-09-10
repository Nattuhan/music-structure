const test = require("node:test");
const assert = require("node:assert/strict");
const { isAllowedPlayerSettingKey, sanitizePlayerSettings } = require("../player-settings.cjs");

test("再生・音量・曲別補正の設定だけを保存対象にする", () => {
  assert.equal(isAllowedPlayerSettingKey("volMusic"), true);
  assert.equal(isAllowedPlayerSettingKey("bpmFactor:session-1"), true);
  assert.equal(isAllowedPlayerSettingKey("clickOffsetHalfBeat:session-1"), true);
  assert.equal(isAllowedPlayerSettingKey("cloudSecret"), false);

  assert.deepEqual(sanitizePlayerSettings({
    volMusic: 72,
    volMetro: 31,
    clickSound: "wood",
    clickPitch: "high",
    playbackRate: 0.8,
    "bpmFactor:session-1": 2,
    stemMix: { vocals: 90, drums: 55 },
    cloudSecret: "保存しない",
  }), {
    volMusic: 72,
    volMetro: 31,
    clickSound: "wood",
    clickPitch: "high",
    playbackRate: 0.8,
    "bpmFactor:session-1": 2,
    stemMix: { vocals: 90, drums: 55 },
  });
});

test("保存不能な値と巨大な設定を拒否する", () => {
  assert.deepEqual(sanitizePlayerSettings(null), {});
  assert.throws(
    () => sanitizePlayerSettings({ sidebarFolders: [{ name: "x".repeat(300_000) }] }),
    /上限/,
  );
});
