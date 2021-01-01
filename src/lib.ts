import { LastFMResponseBody, State, TrackImage } from './types';

export async function fetchLastSong(
  url: string,
  imageSize: TrackImage['size'],
): Promise<State> {
  const body: LastFMResponseBody = await fetch(url).then(res => {
    return res.json();
  });

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
