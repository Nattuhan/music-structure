// Update hashes must describe the ZIP after signing and stapling, not the build input.
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const yaml = require("js-yaml");

function updateMetadata(archive, version) {
  const name = path.basename(archive);
  if (name !== `PracticeLab-${version}-arm64.zip`) throw new Error("Unexpected Mac update archive name");
  const bytes = fs.readFileSync(archive);
  const sha512 = crypto.createHash("sha512").update(bytes).digest("base64");
  return { version, files: [{ url: name, sha512, size: bytes.length }], path: name, sha512 };
}

function verifyMetadata(archive, version, manifest) {
  const expected = updateMetadata(archive, version);
  const actual = yaml.load(fs.readFileSync(manifest, "utf8"));
  if (actual?.version !== expected.version || actual.path !== expected.path || actual.sha512 !== expected.sha512 ||
      actual.files?.length !== 1 || actual.files[0].url !== expected.path ||
      actual.files[0].sha512 !== expected.sha512 || actual.files[0].size !== expected.files[0].size) {
    throw new Error("Mac update metadata does not match the signed ZIP");
  }
}

if (require.main === module) {
  const [mode, archive, version, manifest] = process.argv.slice(2);
  if (!manifest || !["write", "verify"].includes(mode)) throw new Error("Usage: macos_update_metadata.cjs write|verify archive version latest-mac.yml");
  if (mode === "write") fs.writeFileSync(manifest, yaml.dump({ ...updateMetadata(archive, version), releaseDate: new Date().toISOString() }));
  else verifyMetadata(archive, version, manifest);
}
module.exports = { updateMetadata, verifyMetadata };
