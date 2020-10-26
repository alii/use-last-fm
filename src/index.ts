import { useEffect, useState } from 'react';
import { TrackImage, LastFMResponseBody, State } from './types/track';

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
  const [track, setTrack] = useState<State>({ status: 'connecting' });

  const endpoint = `//ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${token}&format=json&limit=1`;

  useEffect(() => {
    const run = async (): Promise<State> => {
      if (__DEV__) {
        console.log('[LAST.FM] Fetching');
      }

      const request = await fetch(endpoint);
      const body = (await request.json()) as LastFMResponseBody;

      const lastSong = body.recenttracks.track[0];

      if (!lastSong['@attr']?.nowplaying) {
        return {
          status: 'idle',
        };
      }

      const image = lastSong.image.find(i => {
        return i.size === imageSize;
      });

      return {
        status: 'playing',
        song: {
          name: lastSong.name,
          artist: lastSong.artist['#text'],
          art: image?.['#text'] ?? lastSong.image[0]['#text'],
          album: lastSong.album['#text'],
        },
      };
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

export * from './types/track';
