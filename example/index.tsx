import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useLastFM } from '../.';

const App = () => {
  const song = useLastFM('aabbccsmith', '[add api token here]');

  if (song === 'connecting' || song === 'idle') {
    return <p>Not listening to anything</p>;
  }

  return (
    <p>
      Listening to {song.name} by {song.artist}
    </p>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
