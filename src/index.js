import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

import App from './App';
import ControlView from './ControlView';

ReactDOM.render(
  <React.StrictMode>
    <App view={ControlView} />
  </React.StrictMode>,
  document.getElementById('root')
);
