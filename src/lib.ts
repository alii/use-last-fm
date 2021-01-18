import { LastFMResponseBody, State, TrackImage } from './types';

export function parseSong(
  body: LastFMResponseBody | null,
  imageSize: TrackImage['size'],
): State {
  if (!body) {
    return {
      status: 'connecting',
      song: null,
    };
  }

  const lastSong = body.recenttracks.track?.[0];

  if (!lastSong || !lastSong['@attr']?.nowplaying) {
    return {
      status: 'idle',
      song: null,
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
      url: lastSong.url,
      album: lastSong.album['#text'],
    },
  };
}
