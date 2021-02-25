import React, { Component } from 'react';

class VideoView extends Component {
  title = 'Video View';
  video_source = 'http://127.0.0.1:5000/video';

  render = () => {
    return (
      <div>
        VideoView Body
        <img src={this.video_source}></img>
      </div>
    );
  };
}

export default VideoView;
