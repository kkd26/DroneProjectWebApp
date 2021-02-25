import React, { Component } from 'react';

export default class Map extends Component {
  defaultStyles = [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'transit',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ];
  defaultOptions = {
    center: { lat: 52.1942, lng: 21.0047 },
    zoom: 17,
    minZoom: 15,
    maxZoom: 20,
    styles: this.defaultStyles,
    disableDefaultUI: true,
    draggable: true,
    zoomControl: true,
    mapTypeControl: true,
  };
  initMap = () => {
    const mapDiv = document.getElementById('map');
    const map = new google.maps.Map(mapDiv, this.defaultOptions);
  };
  componentDidMount() {
    this.initMap();
  }
  render() {
    return (
      <div
        id="map"
        style={{
          height: '100%',
          width: '100%',
        }}
      ></div>
    );
  }
}
