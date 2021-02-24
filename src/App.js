import React, { Component } from 'react';
import Menu from './Menu';
import Map from './Map';

import './index.scss';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Menu items={['Camera', 'Control', 'Map']} />
        <Map />
      </div>
    );
  }
}

export default App;
