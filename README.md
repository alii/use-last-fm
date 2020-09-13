# use-last-fm

![CI Status](https://github.com/webmail/use-last-fm/workflows/CI/badge.svg)

Stream your currently playing song through last.fm as a react hook.

## Installation

- `npm i --save use-last-fm`
- Alternatively using **yarn**: `yarn add use-last-fm`

## Usage

```tsx
import { useLastFM } from 'use-last-fm';

export const CurrentlyPlayingSong = () => {
  const song = useLastFM('[add username here]', '[add api token here]');

  if (song === 'connecting' || song === 'idle') {
    return <p>Not listening to anything</p>;
  }

  return (
    <p>
      Listening to {song.name} by {song.artist}
    </p>
  );
};
```

A full example can be seen in the [examples](https://github.com/webmail/use-last-fm/tree/master/example) folder
