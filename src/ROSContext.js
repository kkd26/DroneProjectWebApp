import React, { Component } from 'react';

import ROSLIB from 'roslib'

const ROSContextDefaultState = {
  rosConnection: false,
  droneState: 'Unknown',
  droneLocation: {
    isFixed: false,
    lat: 0.0,
    lon: 0.0,
    alt: 0.0
  },
  droneBattery: 0.0,
  doTakeoff: () => {},
  doLand: () => {},
  doSetFollowerStatus: (enabled) => {},
  doSetTrackerROI: (region) => {},
  doSetCameraStreamCallback: (cb) => {},
  doClearCameraStreamCallback: () => {}
};

export const ROSContext = React.createContext(ROSContextDefaultState);

export class ROSContextProvider extends React.Component {
  state = ROSContextDefaultState;

  componentDidMount() {
    console.log('ROS Context Provider loaded.');

    let cameraFrameHeader = new Uint8Array();
    let cameraStreamCallback = undefined;

    let ros = new ROSLIB.Ros({
      url: 'ws://' + window.location.hostname + ':9090'
    });

    ros.on('connection', () => {
      this.setState(state => ({
        rosConnection: true
      }));
      console.log('Connected to ROS backend');
    });

    ros.on('error', (error) => {
      this.setState(state => ({
        rosConnection: false
      }));
      console.log('Error connecting to ROS backend: ', error)
    });

    ros.on('close', () => {
      this.setState(state => ({
        rosConnection: false
      }));
      console.log('Disconnected from ROS backend');
    });

    let stateListener = new ROSLIB.Topic({
      ros: ros,
      name: '/drone/state',
      messageType: 'std_msgs/String'
    });

    stateListener.subscribe((msg) => {
      this.setState(state => ({
        droneState: msg.data
      }));
    });

    let locationListener = new ROSLIB.Topic({
      ros: ros,
      name: '/drone/gps',
      messageType: 'sensor_msgs/NavSatFix'
    });

    locationListener.subscribe((msg) => {
      this.setState(state => ({
        droneLocation: {
          isFixed: (msg.status.status == 0),
          lat: msg.latitude,
          lon: msg.longitude,
          alt: msg.altitude
        }
      }));
    });

    let batteryListener = new ROSLIB.Topic({
      ros: ros,
      name: '/drone/battery_percentage',
      messageType: 'std_msgs/Int32'
    });

    batteryListener.subscribe((msg) => {
      this.setState(state => ({
        droneBattery: msg.data
      }));
    });

    // TODO: also available: /drone/air_speed with type std_msgs/Float64

    let cameraFrameHeaderListener = new ROSLIB.Topic({
      ros: ros,
      name: '/drone/camera_h264_header',
      messageType: 'sensor_msgs/CompressedImage'
    });

    let cameraFrameListener = undefined;

    cameraFrameHeaderListener.subscribe((msg) => {
      cameraFrameHeaderListener.unsubscribe()

      if (msg.format != 'h264_header') {
        console.log('Invalid camera header format received: ', msg.format);
        return
      }

      cameraFrameHeader = msg.data;

      cameraFrameListener = new ROSLIB.Topic({
        ros: ros,
        name: '/drone/camera_h264',
        messageType: 'sensor_msgs/CompressedImage'
      });
  
      cameraFrameListener.subscribe((msg) => {
        if (msg.format !== 'h264') {
          console.log('Invalid camera stream format received: ', msg.format);
          cameraFrameListener.unsubscribe();
          return
        }
  
        if (cameraStreamCallback) {
          cameraStreamCallback(msg.data, cameraFrameHeader);
        }
      });
    });

    let takeoffPublisher = new ROSLIB.Topic({
      ros: ros,
      name: '/teleop/takeoff',
      messageType: 'std_msgs/Empty'
    });

    let landingPublisher = new ROSLIB.Topic({
      ros: ros,
      name: '/teleop/landing',
      messageType: 'std_msgs/Empty'
    });

    this.setState(state => ({
      doTakeoff: () => {
        console.log('Taking off...');
        takeoffPublisher.publish(new ROSLIB.Message({}));
      },

      doLand: () => {
        console.log('Landing...');
        landingPublisher.publish(new ROSLIB.Message({}));
      }
    }));

    this.setState(state => ({
      doSetCameraStreamCallback: (cb) => {
        cameraStreamCallback = cb;
      },
      doClearCameraStreamCallback: () => {
        cameraStreamCallback = undefined;
      }
    }));
  }

  render() {
    return <ROSContext.Provider value={this.state}>
      {this.props.children}
    </ROSContext.Provider>
  }
}