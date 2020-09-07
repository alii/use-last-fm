import { useEffect, useState } from 'react';

export type TSong =
  | {
      name: string;
      artist: string;
    }
  | 'connecting'
  | 'idle';

/**
 * Use Last.fm
 * @param username The username of the last.fm user to track
 * @param token Your API token
 * @param interval Optional, this is the internal between each request
 */
export const useLastFM = (
  username: string,
  token: string,
  interval: number = 15 * 1000
) => {
  const [track, setTrack] = useState<TSong>('connecting');

  const endpoint = `//ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${token}&format=json&limit=1`;

  useEffect(() => {
    const run = async (): Promise<TSong> => {
      const request = await fetch(endpoint);
      const body = (await request.json()) as Body;

      const lastSong = body.recenttracks.track[0];

      if (!lastSong['@attr']?.nowplaying) {
        return 'idle';
      }

      return {
        name: lastSong.name,
        artist: lastSong.artist['#text'],
      };
    };

    const execute = () => run().then(setTrack);

    execute().then(() => console.log('[LAST.FM] Connected'));
    const loop = setInterval(execute, interval);

    return () => clearInterval(loop);
  }, [endpoint, interval]);

  return track;
};

export interface Body {
  recenttracks: Recenttracks;
}

export interface Recenttracks {
  '@attr': Attr;
  track: Track[];
}

export interface Attr {
  page: string;
  total: string;
  user: string;
  perPage: string;
  totalPages: string;
}

export interface Track {
  artist: Artist;
  '@attr'?: Attr2;
  mbid: string;
  album: Album;
  streamable: string;
  url: string;
  name: string;
  image: Image[];
  date?: Date;
}

export interface Artist {
  mbid: string;
  '#text': string;
}

export interface Attr2 {
  nowplaying: string;
}

export interface Album {
  mbid: string;
  '#text': string;
}

export interface Image {
  size: string;
  '#text': string;
}

export interface Date {
  uts: string;
  '#text': string;
}
