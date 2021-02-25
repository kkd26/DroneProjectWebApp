import React, { Component } from 'react';

export default class Video extends Component {
  video_source = 'http://127.0.0.1:5000/video';
  render() {
    return (
      <div>
        <img src={this.video_source}></img>
      </div>
    );
  }
}
