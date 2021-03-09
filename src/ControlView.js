import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Map from './Map';
import Video from './Video';
import ControlCameraIcon from '@material-ui/icons/ControlCamera';
import Chip from '@material-ui/core/Chip';
import Snackbar from '@material-ui/core/Snackbar';
import { ROSContext } from './ROSContext';
import FollowerModeSelector from './FollowerModeSelector';

class ControlView extends Component {
  static contextType = ROSContext;

  title = 'Control View';
  icon = (<ControlCameraIcon />);

  state = { 
    displayType: 'map', 
    isTipOpen: false,
    isFollowerModeSelectorOpen: false,
    selectedFollowerMode: 'geographic',
  };

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

  startFollowing = () => {
    this.setState({
      isFollowerModeSelectorOpen: true
    });
  };

  handleFollowerModeSelectorClose = () => {
    this.setState({
      isFollowerModeSelectorOpen: false
    });
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
          <Button onClick={ this.startFollowing }>Start Following</Button>
          <Button onClick={ this.stopFollowing }>Stop Following</Button>

          <Chip label={ `BAT: ${ this.context.droneBattery }%` } />
          <Chip label={ `ALT: ${ this.context.droneLocation.alt.toFixed(1) }m` } />
          <Chip label={ this.context.droneState } />
        </div>
        {this.state.displayType === 'map' && <Map />}
        {this.state.displayType === 'video' && <Video enableROISelection={ this.state.isChoosingTarget } onROISelected= { this.handleROISelected } roi={this.context.targetROI}/>}
        <Snackbar
          open={ this.state.isTipOpen }
          onClose={ this.handleTipClose }
          message="Draw a rectangle on the image to select the target" 
        />
        <FollowerModeSelector selectedValue={ this.state.selectedFollowerMode } open={ this.state.isFollowerModeSelectorOpen } onClose={ this.handleFollowerModeSelectorClose } />
      </>
    );
  }
}

export default ControlView;
