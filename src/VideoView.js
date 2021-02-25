import React, { Component } from 'react';
import Video from './Video';

class VideoView extends Component {
  title = 'Video View';
  state = { recording: false };

  takePicture = () => {
    console.log('Picture taken');
  };

  toggleRecording = () => {
    this.setState({ recording: !this.state.recording });
  };

  render = () => {
    return (
      <div>
        <button onClick={this.takePicture}>Take picture</button>
        <button onClick={this.toggleRecording}>
          {this.state.recording ? 'Stop recording' : 'Start recording'}
        </button>
        <Video />
      </div>
    );
  };
}

export default VideoView;
