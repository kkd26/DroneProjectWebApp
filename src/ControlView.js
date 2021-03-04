import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Map from './Map';
import Video from './Video';
import ControlCameraIcon from '@material-ui/icons/ControlCamera';
import Chip from '@material-ui/core/Chip';
import { ROSContext } from './ROSContext';

class ControlView extends Component {
  static contextType = ROSContext;

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
          <Button onClick={ this.context.doTakeoff }>Take off</Button>
          <Button onClick={ this.context.doLand } >Land</Button>

          <Chip label={ `BAT: ${ this.context.droneBattery }%` } />
          <Chip label={ `STATE: ${ this.context.droneState}` } />
          <Chip label={ `GPS: ${ this.context.droneLocation.lon}, ${this.context.droneLocation.lat}`} />
          <Chip label={ `ALT: ${ this.context.droneLocation.alt }m` } />
        </div>
        {this.state.displayType === 'map' && <Map />}
        {this.state.displayType === 'video' && <Video />}
      </>
    );
  }
}

export default ControlView;
