const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { updateMetadata, verifyMetadata } = require("../../scripts/macos_update_metadata.cjs");

test("署名後のZIPが変わった場合は更新情報を拒否する", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "practicelab-update-test-"));
  try {
    const archive = path.join(directory, "PracticeLab-1.2.2-arm64.zip");
    const manifest = path.join(directory, "latest-mac.yml");
    fs.writeFileSync(archive, "signed payload");
    fs.writeFileSync(manifest, JSON.stringify(updateMetadata(archive, "1.2.2")));
    verifyMetadata(archive, "1.2.2", manifest);
    fs.writeFileSync(archive, "different signed payload");
    assert.throws(() => verifyMetadata(archive, "1.2.2", manifest), /does not match/);
    assert.throws(() => updateMetadata(archive, "1.2.3"), /archive name/);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
