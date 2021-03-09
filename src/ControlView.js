import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Map from './Map';
import Video from './Video';
import ControlCameraIcon from '@material-ui/icons/ControlCamera';
import Chip from '@material-ui/core/Chip';
import Snackbar from '@material-ui/core/Snackbar';
import { ROSContext } from './ROSContext';

class ControlView extends Component {
  static contextType = ROSContext;

  title = 'Control View';
  icon = (<ControlCameraIcon />);

  state = { displayType: 'map', isTipOpen: false };

  toggleDisplay = () => {
    const nextDisplay = this.state.displayType == 'map' ? 'video' : 'map';
    this.setState({ displayType: nextDisplay });
  };

  enableTracker = () => {
    this.setState({
      isChoosingTarget: true,
      isTipOpen: true
    });
  };

  disableTracker = () => {
    this.context.doSetTargetROI([[0, 0], [0, 0]], false);
  }

  handleTipClose = () => {
    this.setState({
      isTipOpen: false
    });
  };

  handleROISelected = (roi) => {
    this.setState({
      isChoosingTarget: false
    });
    this.context.doSetTargetROI(roi);
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
          { !this.state.isChoosingTarget && <Button onClick={ this.enableTracker } >Choose Target</Button> }
          <Button onClick={ this.disableTracker }>Disable Tracker</Button>

          <Chip label={ `BAT: ${ this.context.droneBattery }%` } />
          <Chip label={ `STATE: ${ this.context.droneState}` } />
          <Chip label={ `ALT: ${ this.context.droneLocation.alt.toFixed(1) }m` } />
        </div>
        {this.state.displayType === 'map' && <Map />}
        {this.state.displayType === 'video' && <Video enableROISelection={ this.state.isChoosingTarget } onROISelected= { this.handleROISelected } roi={this.context.targetROI}/>}
        <Snackbar
          open={ this.state.isTipOpen }
          onClose={ this.handleTipClose }
          message="Draw a rectangle on the image to select the target" />
      </>
    );
  }
}

export default ControlView;
