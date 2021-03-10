import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Map from './Map';
import Video from './Video';
import ControlCameraIcon from '@material-ui/icons/ControlCamera';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import Chip from '@material-ui/core/Chip';
import Snackbar from '@material-ui/core/Snackbar';
import { ROSContext } from './ROSContext';
import FollowerModeSelector from './FollowerModeSelector';

const DUMMY_FOLLOWER = 'dummy';

class ControlView extends Component {
  static contextType = ROSContext;

  title = 'Control View';
  icon = (<ControlCameraIcon />);

  state = {
    displayType: 'map',
    isTipOpen: false,
    isFollowerModeSelectorOpen: false,
    selectedFollowerMode: DUMMY_FOLLOWER,
  };

  toggleDisplay = () => {
    const nextDisplay = this.state.displayType == 'map' ? 'video' : 'map';
    this.setState({ displayType: nextDisplay });
  };

  enableROISelector = () => {
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

  showFollowerModeSelector = () => {
    this.setState({
      isFollowerModeSelectorOpen: true
    });
  };

  handleFollowerModeSelectorClose = (mode) => {
    this.setState({
      isFollowerModeSelectorOpen: false
    });
    this.setFollowerMode(mode);
  };

  setFollowerMode = (mode) => {
    if (this.context.followerMode != mode)
      this.context.doSetFollowerMode(mode);
  };

  render() {
    return (
      <>
        <div className="view-buttons">
          <Button onClick={this.toggleDisplay}>
            {this.state.displayType == 'map' ? 'Show video' : 'Show map'}
          </Button>
          <Button onClick={this.context.doTakeoff}>Take off</Button>
          <Button onClick={this.context.doLand} >Land</Button>
          {!this.context.trackerEnabled && <Chip label="Tracker Inactive" onDelete={this.enableROISelector} deleteIcon={<PlayCircleFilledIcon />} />}
          {this.context.trackerEnabled && <Chip label="Tracker Active" color="primary" onDelete={this.disableTracker} />}
          {this.context.followerMode === DUMMY_FOLLOWER && <Chip label="Follower Inactive" onDelete={this.showFollowerModeSelector} deleteIcon={<PlayCircleFilledIcon />} />}
          {this.context.followerMode !== DUMMY_FOLLOWER && <Chip label="Follower Active" color="primary" onDelete={() => this.setFollowerMode(DUMMY_FOLLOWER)} />}
          <Chip label={`BAT: ${this.context.droneBattery}%`} />
          <Chip label={`ALT: ${this.context.droneLocation.alt.toFixed(1)}m`} />
          <Chip label={this.context.droneState} />

        </div>
        {this.state.displayType === 'map' && <Map />}
        {this.state.displayType === 'video' && <Video enableROISelection={this.state.isChoosingTarget} onROISelected={this.handleROISelected} roi={this.context.targetROI} />}
        <Snackbar
          open={this.state.isTipOpen}
          onClose={this.handleTipClose}
          message="Draw a rectangle on the image to select the target"
        />
        <FollowerModeSelector selectedValue={this.state.selectedFollowerMode} open={this.state.isFollowerModeSelectorOpen} onClose={this.handleFollowerModeSelectorClose} />
      </>
    );
  }
}

export default ControlView;
