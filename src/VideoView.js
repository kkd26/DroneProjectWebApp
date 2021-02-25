import React, { Component } from 'react';

class VideoView extends Component {
  title = 'Video View';
  video_source = 'http://127.0.0.1:5000/video';
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
        <img src={this.video_source}></img>
      </div>
    );
  };
}

export default VideoView;
