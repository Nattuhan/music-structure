const test = require("node:test");
const assert = require("node:assert/strict");
const { RELEASES_LATEST_URL, getUpdateMode, hasDeveloperIdSignature } = require("../update-policy.cjs");

test("未署名Mac版は手動更新、Windows版は自動更新を使う", () => {
  assert.equal(getUpdateMode({ packaged: true, platform: "darwin" }), "manual");
  assert.equal(getUpdateMode({ packaged: true, platform: "win32" }), "automatic");
  assert.equal(getUpdateMode({ packaged: false, platform: "darwin" }), "development");
  assert.match(RELEASES_LATEST_URL, /^https:\/\/github\.com\//);
});


test("Developer ID署名済みMac版だけ自動更新を有効にする", () => {
  assert.equal(getUpdateMode({ packaged: true, platform: "darwin", developerIdSigned: true }), "automatic");
  assert.equal(getUpdateMode({ packaged: false, platform: "darwin", developerIdSigned: true }), "development");
  assert.equal(hasDeveloperIdSignature({ status: 0, stderr: "Authority=Developer ID Application: Example (TEAM)\n" }), true);
  for (const result of [
    { status: 1, stderr: "Authority=Developer ID Application: Example (TEAM)" },
    { status: 0, stderr: "Signature=adhoc" },
    { status: 0, stderr: "Authority=Apple Development: Example" },
    { status: null, stderr: null },
  ]) assert.equal(hasDeveloperIdSignature(result), false);
});
