import { TrackImage, State, LastFMResponseBody } from './types';
import { parseSong } from './lib';
import useSWR from 'swr';

/**
 * Use Last.fm
 * @param username The username of the last.fm user to track
 * @param token Your API token
 * @param interval Optional, this is the interval between each request
 * @param imageSize The size of the image
 */
export function useLastFM(
  username: string,
  token: string,
  interval: number = 15 * 1000,
  imageSize: TrackImage['size'] = 'extralarge',
): State {
  const endpoint = `//ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${token}&format=json&limit=1`;

  const { data: track = null, error } = useSWR<LastFMResponseBody, Error>(
    endpoint,
    { refreshInterval: interval },
  );

  if (error) {
    return {
      status: 'error',
      song: null,
    };
  }

  try {
    return parseSong(track, imageSize);
  } catch (e) {
    return {
      status: 'error',
      song: null,
    };
  }
}

export * from './types';
