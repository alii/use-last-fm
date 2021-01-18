import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useLastFM } from '../.';

const App = () => {
  const lastFM = useLastFM('aabbccsmith', '[add api token here]');

  if (lastFM.status === 'error') {
    return <p>Could not connect to Last.fm</p>;
  }

  if (lastFM.status !== 'playing') {
    return <p>Not listening to anything</p>;
  }

  return (
    <p>
      Listening to {lastFM.song.name} by {lastFM.song.artist}
    </p>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
