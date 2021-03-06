import React, { Component } from 'react';
import { ROSContext } from './ROSContext';
import JSMpeg from '@julienusson/jsmpeg';

export default class Video extends Component {
  static contextType = ROSContext;
  isFirstFrame = true;

  componentDidMount = () => {
    const url = 'ws://'+document.location.hostname+':8765/';
    const canvas = document.getElementById('video-canvas');
    const jsmpeg = new JSMpeg.Player(url, {
      canvas: canvas,
      audio: false,
      protocols: []
    });
  };

  render() {
    return <canvas id="video-canvas"></canvas>;
  }
}
