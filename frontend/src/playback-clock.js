// The muted original is a UI/video guide, not an audible clock. Independent
// HTMLMediaElement decoders can resume at different times even when play() is
// called in the same turn. Follow a sounding part while the stem group is live.
export const selectPlaybackClock = ({ master, players = {}, activeStems = [], state }) => {
  if (state === 'stems') {
    for (const name of activeStems) {
      const media = players[name];
      if (media && !media.paused && !media.seeking && !media.muted && media.volume > 0 && media.readyState >= 3) {
        return { media, name };
      }
    }
  }
  return { media: master, name: 'original' };
};
