import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Map from './Map';
import Video from './Video';
import ControlCameraIcon from '@material-ui/icons/ControlCamera';

class ControlView extends Component {
  title = 'Control View';
  icon = (<ControlCameraIcon />);

  state = { displayType: 'map' };

  toggleDisplay = () => {
    const nextDisplay = this.state.displayType == 'map' ? 'video' : 'map';
    this.setState({ displayType: nextDisplay });
  };

  render() {
    return (
      <>
        <div className="view-buttons">
          <Button onClick={this.toggleDisplay}>
            {this.state.displayType == 'map' ? 'Show video' : 'Show map'}
          </Button>
        </div>
        {this.state.displayType === 'map' && <Map />}
        {this.state.displayType === 'video' && <Video />}
      </>
    );
  }
}

export default ControlView;
