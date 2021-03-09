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
  droneAirspeed: 0.0,
  targetROI: [[0, 0], [0, 0]],
  doTakeoff: () => { },
  doLand: () => { },
  doSetFollowerStatus: (enabled) => { },
  doSetTargetROI: (region) => { },
};

export const ROSContext = React.createContext(ROSContextDefaultState);

export class ROSContextProvider extends React.Component {
  state = ROSContextDefaultState;

  componentDidMount() {
    console.log('ROS Context Provider loaded.');

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

    let airspeedListener = new ROSLIB.Topic({
      ros: ros,
      name: '/drone/air_speed',
      messageType: 'std_msgs/Float64'
    });

    airspeedListener.subscribe((msg) => {
      this.setState(state => ({
        droneAirspeed: msg.data
      }));
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

    let targetROIListener = new ROSLIB.Topic({
      ros: ros,
      name: '/tracker/target_roi',
      messageType: 'alpha_target_tracker/RegionOfInterestWithFullRes'
    });

    targetROIListener.subscribe((msg) => {
      this.setState({
        targetROI: [[ msg.roi.x_offset, msg.roi.y_offset ], [ msg.roi.x_offset + msg.roi.width, msg.roi.y_offset + msg.roi.height ]]
      });
    });

    let setROIClient = new ROSLIB.Service({
      ros: ros,
      name: '/tracker/set_roi',
      serviceType: 'alpha_target_tracker/SetRegionOfInterest'
    });
    
    this.setState(state => ({
      doTakeoff: () => {
        console.log('Taking off...');
        takeoffPublisher.publish(new ROSLIB.Message({}));
      },

      doLand: () => {
        console.log('Landing...');
        landingPublisher.publish(new ROSLIB.Message({}));
      },

      doSetTargetROI: (roi, enabled = true) => {
        console.log('Set target ROI');
        const request = new ROSLIB.ServiceRequest({
          enabled,
          roi: {
            x_offset: Math.round(roi[0][0]),
            y_offset: Math.round(roi[0][1]),
            width: Math.round(roi[1][0] - roi[0][0]),
            height: Math.round(roi[1][1] - roi[0][1])
          }
        });
        setROIClient.callService(request, (resp) => {
          if (resp.success === false) {
            alert('Failed to set target ROI');
          }
        });
      }
    }));
  }

  render() {
    return <ROSContext.Provider value={this.state}>
      {this.props.children}
    </ROSContext.Provider>
  }
}