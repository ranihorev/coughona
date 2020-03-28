import * as Sentry from '@sentry/browser';
import AudioRecorder from 'audio-recorder-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import * as serviceWorker from './serviceWorker';

(window as any).MediaRecorder = AudioRecorder;
// if (!window.MediaRecorder) {
// }

Sentry.init({ dsn: 'https://328eab0f24314cf3a439b643ceb8f39b@sentry.io/5177832' });

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
