import React, { Component } from 'react';
import Video from './Video';
import Button from '@material-ui/core/Button';
import VideocamIcon from '@material-ui/icons/Videocam';

class VideoView extends Component {
  title = 'Video View';
  icon = (<VideocamIcon />);

  state = { recording: false };

  takePicture = () => {
    console.log('Picture taken');
  };

  toggleRecording = () => {
    this.setState({ recording: !this.state.recording });
  };

  buttons = [];

  render = () => {
    return (
      <>
        <div className="view-buttons">
          <Button onClick={this.takePicture}>Take picture</Button>
          <Button onClick={this.toggleRecording}>
            {this.state.recording ? 'Stop recording' : 'Start recording'}
          </Button>
        </div>
        <Video />
      </>
    );
  };
}

export default VideoView;
