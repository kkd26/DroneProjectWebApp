import React, { Component } from 'react';
import Map from './Map';
import Video from './Video';

class ControlView extends Component {
  title = 'Control View';
  state = { displayType: 'map' };

  toggleDisplay = () => {
    const nextDisplay = this.state.displayType == 'map' ? 'video' : 'map';
    this.setState({ displayType: nextDisplay });
  };

  render() {
    return (
      <div>
        <button onClick={this.toggleDisplay}>
          {this.state.displayType == 'map' ? 'Show video' : 'Show map'}
        </button>
        {this.state.displayType === 'map' && <Map />}
        {this.state.displayType === 'video' && <Video />}
      </div>
    );
  }
}

export default ControlView;
