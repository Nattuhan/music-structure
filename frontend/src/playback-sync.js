const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

export const planStemPlayback = ({ stemNames, mix, mobile, activated }) => {
  if (mobile && !activated) {
    return { useOriginalMix: true, activeStems: [] };
  }
  const activeStems = stemNames.filter(name => Number(mix?.[name] ?? 0) > 0);
  return {
    useOriginalMix: false,
    activeStems,
  };
};

export const mediaSyncAction = ({
  masterTime,
  mediaTime,
  playbackRate = 1,
  force = false,
  hardDriftSeconds = 0.2,
  softDriftSeconds = 0.035,
  maxRateCorrection = 0.04,
}) => {
  const baseRate = Math.max(0.01, Number(playbackRate) || 1);
  const drift = Number(mediaTime) - Number(masterTime);
  if (!Number.isFinite(drift)) return { playbackRate: baseRate, seekTo: null, drift: 0 };
  if (force || Math.abs(drift) >= hardDriftSeconds) {
    return { playbackRate: baseRate, seekTo: Math.max(0, Number(masterTime) || 0), drift };
  }
  if (Math.abs(drift) < softDriftSeconds) {
    return { playbackRate: baseRate, seekTo: null, drift };
  }
  const correction = clamp(-drift * 0.2, -maxRateCorrection, maxRateCorrection);
  return {
    playbackRate: baseRate * (1 + correction),
    seekTo: null,
    drift,
  };
};

export const stemGroupSyncAction = ({
  masterTime,
  mediaTimes,
  playbackRate = 1,
  force = false,
  allowResync = true,
  hardDriftSeconds = 0.075,
}) => {
  const baseRate = Math.max(0.01, Number(playbackRate) || 1);
  const target = Math.max(0, Number(masterTime) || 0);
  const drifts = (mediaTimes || [])
    .map(time => Number(time) - target)
    .filter(Number.isFinite);
  const maximumDrift = drifts.reduce(
    (maximum, drift) => Math.max(maximum, Math.abs(drift)),
    0,
  );
  return {
    playbackRate: baseRate,
    seekTo: force || (allowResync && maximumDrift >= hardDriftSeconds) ? target : null,
    maximumDrift,
  };
};
