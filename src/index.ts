import { useEffect, useState } from 'react';
import { TrackImage, State } from './types';
import { fetchLastSong } from './lib';

declare const __DEV__: boolean;

/**
 * Use Last.fm
 * @param username The username of the last.fm user to track
 * @param token Your API token
 * @param interval Optional, this is the internal between each request
 * @param imageSize The size of the image
 */
export const useLastFM = (
  username: string,
  token: string,
  interval: number = 15 * 1000,
  imageSize: TrackImage['size'] = 'extralarge',
) => {
  const [track, setTrack] = useState<State>({
    status: 'connecting',
    song: null,
  });

  const endpoint = `//ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${token}&format=json&limit=1`;

  useEffect(() => {
    const run = (): Promise<State> => {
      if (__DEV__) {
        console.log('[LAST.FM] Fetching');
      }

      return fetchLastSong(endpoint, imageSize);
    };

    const execute = () => run().then(setTrack);

    if (__DEV__) {
      execute().then(() => console.log('[LAST.FM] Connected'));
    } else {
      execute();
    }

    const loop = setInterval(execute, interval);

    return () => clearInterval(loop);
  }, [endpoint, interval, imageSize]);

  return track;
};

export * from './types';
