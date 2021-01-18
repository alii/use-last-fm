export interface RecentTracks {
  /**
   * Attributes
   */
  '@attr': RecentTracksAttr;
  /**
   * Array of recently played tracks
   */
  track?: Track[];
}

export interface RecentTracksAttr {
  /**
   * Page
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

export type Song = {
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
  /**
   * The URL of the track
   */
  url: Track['url'];
};

export interface LastFMResponseBody {
  /**
   * All tracks
   */
  recenttracks: RecentTracks;
}

export type State =
  | {
      status: 'connecting' | 'idle' | 'error';
      song: null;
    }
  | {
      status: 'playing';
      song: Song;
    };
