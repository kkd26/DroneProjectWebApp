import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import { Player } from 'broadwayjs'
import { ROSContext } from './ROSContext';
import { decode } from 'base64-arraybuffer';
import JMuxer from 'jmuxer';

export default class Video extends Component {
  static contextType = ROSContext;
  isFirstFrame = true;

  // broadway = new Player({
  //   useWorker: true,
  //   reuseMemory: true,
  //   webgl: true
  // });

  // isFirstFrame = true;

  // componentDidMount = () => {
  //   // ugly hack
  //   document.getElementById('video').appendChild(this.broadway.canvas);

  //   let handleFrame = (frame_b64, header_b64) => {
  //     console.log('got frame');
  //     let frame = new Uint8Array(decode(frame_b64));

  //     if (this.isFirstFrame) {
  //       let header = new Uint8Array(decode(header_b64));
  //       let data = new Uint8Array([...header, ...frame]);
  //       console.log(data);
  //       this.broadway.decode(data);
  //       this.isFirstFrame = false;
  //     }
  //     else {
  //       this.broadway.decode(frame);
  //     }
  //   };

  //   this.context.doSetCameraStreamCallback(handleFrame);
  // };

  // componentWillUnmount = () => {
  //   this.context.doClearCameraStreamCallback();
  // }

  // render() {
  //   return <div id='video'></div>
  // }

  componentDidMount = () => {
    const jmuxer = new JMuxer({
      node: 'player',
      mode: 'video',
      // fps: 29.97,
      debug: true
    });

    const handleFrame = (frame_b64, header_b64) => {
      console.log('got frame');
      let frame = new Uint8Array(decode(frame_b64));

      if (this.isFirstFrame) {
        let header = new Uint8Array(decode(header_b64));
        let data = new Uint8Array([...header, ...frame]);
        // console.log(data);
        this.isFirstFrame = false;

        jmuxer.feed({video: data});
      }
      else {
        jmuxer.feed({video: frame});
      }
    };

    this.context.doSetCameraStreamCallback(handleFrame);
  };

  componentWillUnmount = () => {
    this.context.doClearCameraStreamCallback();
  }

  render() {
    return <video id='player'></video>;
  }
}
