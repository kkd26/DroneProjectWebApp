import React, { Component } from 'react';
import Menu from './Menu';

import './index.scss';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Menu items={['Nav', 'Options', 'Tab2']} />
    );
  }
}

export default App;