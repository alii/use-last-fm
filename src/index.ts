import { useEffect, useState } from 'react';

export type TSongObject = {
  /**
   * The name of the track
   */
  name: Track['name'];
  /**
   * The name of the artist
   */
  artist: TrackArtist['#text'];
  /**
   * The URL of the album art
   */
  art: TrackImage['#text'];
  /**
   * The album name
   */
  album: TrackAlbum['#text'];
};

/** The Song Type */
export type TSong = TSongObject | 'connecting' | 'idle';

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
  imageSize: TrackImage['size'] = 'extralarge'
) => {
  const [track, setTrack] = useState<TSong>('connecting');

  const endpoint = `//ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${token}&format=json&limit=1`;

  useEffect(() => {
    const run = async (): Promise<TSong> => {
      if (__DEV__) {
        console.log('[LAST.FM] Fetching');
      }

      const request = await fetch(endpoint);
      const body = (await request.json()) as LastFMResponseBody;

      const lastSong = body.recenttracks.track[0];

      if (!lastSong['@attr']?.nowplaying) {
        return 'idle';
      }

      const image = lastSong.image.find(i => {
        return i.size === imageSize;
      });

      return {
        name: lastSong.name,
        artist: lastSong.artist['#text'],
        art: image?.['#text'] ?? lastSong.image[0]['#text'],
        album: lastSong.album['#text'],
      };
    };

    const execute = () => run().then(setTrack);

    if (__DEV__) {
      execute().then(() => console.log('[LAST.FM] Connected'));
    } else {
      execute().then();
    }

    const loop = setInterval(execute, interval);

    return () => clearInterval(loop);
  }, [endpoint, interval, imageSize]);

  return track;
};

interface LastFMResponseBody {
  /**
   * All tracks
   */
  recenttracks: RecentTracks;
}

export interface RecentTracks {
  /**
   * Attributes
   */
  '@attr': RecentTracksAttr;
  /**
   * Array of recently played tracks
   */
  track: Track[];
}

export interface RecentTracksAttr {
  /**
   * Pahe
   */
  page: string;
  /**
   * Total tracks ever listened to
   */
  total: string;
  /**
   * The username
   */
  user: string;
  /**
   * How many songs are listed per page
   */
  perPage: string;
  /**
   * Total amount of pages (total / perPage)
   */
  totalPages: string;
}

export interface Track {
  /**
   * The artist of the track
   */
  artist: TrackArtist;
  /**
   * Attributes
   */
  '@attr'?: TrackAttr;
  /**
   * MusicBrainz Identifier
   */
  mbid: string;
  /**
   * The Album
   */
  album: TrackAlbum;
  /**
   * Unsure!
   * @todo
   */
  streamable: string;
  /**
   * URL Of the song
   */
  url: string;
  /**
   * The name of the song
   */
  name: string;
  /**
   * Array of images
   */
  image: TrackImage[];
  /**
   * The date the track was made
   */
  date?: TrackDate;
}

export interface TrackArtist {
  /**
   * MusicBrainz Identifier
   */
  mbid: string;
  /**
   * Name of the artist
   */
  '#text': string;
}

export interface TrackAttr {
  /**
   * If the track is currently playing
   */
  nowplaying: string;
}

export interface TrackAlbum {
  /**
   * MusicBrainz identifier
   */
  mbid: string;
  /**
   * Album name
   */
  '#text': string;
}

export interface TrackImage {
  /**
   * Size of the image
   */
  size: 'small' | 'medium' | 'large' | 'extralarge';
  /**
   * URL to the image
   */
  '#text': string;
}

/**
 * When the song was listened to
 */
export interface TrackDate {
  /**
   * Timestamp
   */
  uts: string;
  /**
   * Human readable text
   */
  '#text': string;
}
