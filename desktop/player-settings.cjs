const MAX_PLAYER_SETTINGS_BYTES = 256 * 1024;

const PLAYER_SETTING_KEYS = new Set([
  "volMusic",
  "volMetro",
  "playbackRate",
  "loop",
  "metro",
  "autoNext",
  "sidebarFolders",
  "sidebarFolderCollapsed",
  "sidebarRootOrder",
  "lastStructureSessionId",
  "lastOpenedAt",
  "librarySort",
  "stemMix",
  "stemLastVolume",
  "stemMixMode",
  "stemMixRestore",
]);

const PLAYER_SETTING_PREFIXES = ["bpmFactor:", "clickOffsetHalfBeat:"];

function isAllowedPlayerSettingKey(key) {
  return PLAYER_SETTING_KEYS.has(key) || PLAYER_SETTING_PREFIXES.some(prefix => key.startsWith(prefix));
}

function sanitizePlayerSettings(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};
  const sanitized = {};
  for (const [key, value] of Object.entries(input)) {
    if (!isAllowedPlayerSettingKey(key) || value === undefined) continue;
    try {
      sanitized[key] = JSON.parse(JSON.stringify(value));
    } catch {
      // Ignore values that cannot be represented in the settings file.
    }
  }
  if (Buffer.byteLength(JSON.stringify(sanitized), "utf8") > MAX_PLAYER_SETTINGS_BYTES) {
    throw new Error("再生設定の保存サイズが上限を超えています");
  }
  return sanitized;
}

module.exports = { isAllowedPlayerSettingKey, sanitizePlayerSettings };
