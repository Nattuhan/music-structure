const RELEASES_LATEST_URL = "https://github.com/Nattuhan/practice-lab/releases/latest";

function hasDeveloperIdSignature(result) {
  return result.status === 0 && /^Authority=Developer ID Application:/m.test(result.stderr || "");
}

function getUpdateMode({ packaged, platform, developerIdSigned = false }) {
  if (!packaged) return "development";
  // Squirrel.Mac requires a stable signing identity across releases.
  if (platform === "darwin" && !developerIdSigned) return "manual";
  return "automatic";
}

module.exports = { RELEASES_LATEST_URL, getUpdateMode, hasDeveloperIdSignature };
