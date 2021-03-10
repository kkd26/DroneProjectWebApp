import React, { Component } from 'react';
import { ROSContext } from './ROSContext';
import JSMpeg from '@julienusson/jsmpeg';
import './Video.scss';

export default class Video extends Component {
  static contextType = ROSContext;

  componentDidMount = () => {
    const url = 'ws://' + document.location.hostname + ':8765/';
    const canvas = document.getElementById('video-canvas');
    const overlayCanvas = document.getElementById('overlay-canvas');
    const jsmpeg = new JSMpeg.Player(url, {
      canvas: canvas,
      audio: false,
      protocols: []
    });

    this.overlayCanvas = overlayCanvas;
  };

  componentDidUpdate = () => {
    if (this.drawing) return;
    const roi = this.props.roi;
    if (!roi) return;

    if (roi[1][0] - roi[0][0] == 0 || roi[1][1] - roi[0][1] == 0) {
      this.drawRect(null, null, this.overlayCanvas, true);
      return;
    }
    else {
      this.drawRect(roi[0], roi[1], this.overlayCanvas);
    }
  };

  getMouseLocation = (e) => {
    const c = e.target;
    const rect = c.getBoundingClientRect();
    const factor = Math.min(c.clientWidth / c.width, c.clientHeight / c.height);
    const whitespaceX = (c.clientWidth - c.width * factor) / 2.0;
    const whitespaceY = (c.clientHeight - c.height * factor) / 2.0;
    const x = (e.clientX - rect.x - whitespaceX) / factor;
    const y = (e.clientY - rect.y - whitespaceY) / factor;
    return [x, y];
  }

  handleMouseDown = (e) => {
    if (!this.props.enableROISelection) return;
    const [x, y] = this.getMouseLocation(e);
    this.drawing = {
      point1: [x, y]
    };
  };

  handleMouseMove = (e) => {
    if (!this.drawing) return;
    const [x, y] = this.getMouseLocation(e);
    this.drawing.point2 = [x, y]
    const [p1, p2] = this.normalizeRect(this.drawing.point1, this.drawing.point2)
    this.drawRect(p1, p2, e.target);
  }

  handleMouseUp = (e) => {
    if (this.drawing && this.props.onROISelected) {
      this.props.onROISelected(
        this.normalizeRect(this.drawing.point1, this.drawing.point2)
      );
    }
    this.drawing = null;
    this.drawRect(null, null, e.target, true);
  };

  normalizeRect = (p1, p2) => {
    return [
      [Math.min(p1[0], p2[0]), Math.min(p1[1], p2[1])],
      [Math.max(p1[0], p2[0]), Math.max(p1[1], p2[1])]
    ];
  };

  drawRect = (p1, p2, elem, clear = false) => {
    const ctx = elem.getContext('2d');
    ctx.clearRect(0, 0, elem.width, elem.height);
    if (clear) return;
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.rect(p1[0], p1[1], p2[0] - p1[0], p2[1] - p1[1]);
    ctx.stroke();
  }

  render() {
    return <div id="container">
      <canvas id="video-canvas"></canvas>
      <canvas id="overlay-canvas"
        width="640" height="360"
        onMouseDown={this.handleMouseDown}
        onTouchStart={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onTouchMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
        onTouchEnd={this.handleMouseUp}
        onTouchCancel={this.handleMouseUp}>
          

      </canvas>
    </div>;
  }
}
