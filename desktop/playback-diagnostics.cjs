const path = require("path");

const MAX_LOG_BYTES = 2 * 1024 * 1024;
const ALLOWED_EVENTS = new Set([
  "audio-abort",
  "audio-error",
  "audio-pause",
  "audio-play",
  "audio-playing",
  "audio-seeking",
  "audio-seeked",
  "audio-ratechange",
  "playback-clock",
  "audio-stalled",
  "audio-waiting",
  "stem-resync",
  "video-resync",
]);
const NUMBER_FIELDS = [
  "audioTime",
  "bufferedAhead",
  "duration",
  "drift",
  "forced",
  "playbackRate",
  "readyState",
  "networkState",
  "stemCount",
  "referenceTime",
  "contextTime",
  "outputContextTime",
  "outputLatency",
  "baseLatency",
  "clickEnabled",
  "loopEnabled",
  "loopStart",
  "loopEnd",
  "vocalsTime",
  "drumsTime",
  "bassTime",
  "otherTime",
];

const finiteNumber = value => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number * 10000) / 10000 : undefined;
};

const sanitizePlaybackEvent = (input, now = new Date()) => {
  const type = String(input?.type || "");
  if (!ALLOWED_EVENTS.has(type)) return null;
  const event = {
    timestamp: now.toISOString(),
    type,
  };
  const sessionId = String(input?.sessionId || "").replace(/[^a-zA-Z0-9._-]/g, "").slice(0, 160);
  if (sessionId) event.sessionId = sessionId;
  if (["original", "vocals", "drums", "bass", "other"].includes(input?.reference)) event.reference = input.reference;
  for (const key of NUMBER_FIELDS) {
    const value = finiteNumber(input?.[key]);
    if (value !== undefined) event[key] = value;
  }
  return event;
};

const appendPlaybackEvent = ({ fs, logDir, input, now = new Date(), maxBytes = MAX_LOG_BYTES }) => {
  const event = sanitizePlaybackEvent(input, now);
  if (!event) return false;
  fs.mkdirSync(logDir, { recursive: true });
  const file = path.join(logDir, "playback.ndjson");
  const previous = path.join(logDir, "playback.previous.ndjson");
  try {
    if (fs.statSync(file).size >= maxBytes) {
      if (fs.existsSync(previous)) fs.rmSync(previous);
      fs.renameSync(file, previous);
    }
  } catch {}
  fs.appendFileSync(file, `${JSON.stringify(event)}\n`, { encoding: "utf8", mode: 0o600 });
  try { fs.chmodSync(file, 0o600); } catch {}
  return true;
};

module.exports = {
  ALLOWED_EVENTS,
  MAX_LOG_BYTES,
  appendPlaybackEvent,
  sanitizePlaybackEvent,
};
