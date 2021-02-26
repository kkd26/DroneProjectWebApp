import React, { Component } from 'react';
import {
  map,
  pathLengths,
  initMap,
  distanceInRange,
  addToPath,
} from './map-utils';
import './Map.scss';

export default class Map extends Component {
  state = {
    penDown: false,
    draggable: true,
    lastPos: null,
  };

  handleMouseMove = (e) => {
    if (!this.state.penDown) return;
    const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    if (distanceInRange(this.state.lastPos, pos, 5)) return;
    addToPath(e.latLng);
    this.setState({ lastPos: pos });
  };

  handleMouseDown = () => {
    this.setState({ penDown: true });
    pathLengths.push({ len: 0, markers: [] });
  };

  handleMouseUp = () => {
    this.setState({ penDown: false });
  };

  componentDidMount() {
    initMap();
    document.addEventListener('mousedown', this.handleMouseDown);
    this.listener = map.addListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleMouseDown);
    google.maps.event.removeListener(this.listener);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  render() {
    return <div id="map"></div>;
  }
}
