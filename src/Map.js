import React, { Component } from 'react';

export default class Map extends Component {
  state = { penDown: false, draggable: true };
  defaultStyles = [
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#FF00FF' }],
    },
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
    zoom: 14,
    styles: this.defaultStyles,
    disableDefaultUI: true,
    streetViewControl: true,
    draggable: true,
  };
  map = null;

  createMarker = (pos) => {
    return new google.maps.Marker({
      position: pos,
      map: this.map,
      title: 'Hello World!',
    });
  };

  handleMouseMove = (e) => {
    if (!this.state.penDown) return;
    const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    this.createMarker(pos);
  };

  initMap = () => {
    const mapDiv = document.getElementById('map');
    const map = new google.maps.Map(mapDiv, this.defaultOptions);
    map.addListener('mousemove', this.handleMouseMove);
    this.map = map;
  };

  locate = () => {
    const infoWindow = new google.maps.InfoWindow();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          infoWindow.setPosition(pos);
          infoWindow.setContent('Location found.');
          infoWindow.open(this.map);
          this.map.setCenter(pos);
          this.map.setZoom(15);
        },
        () => console.log('Error while locating.')
      );
    } else {
      console.log('Couldnt access the geolocation api');
    }
  };

  toggleDraggable = () => {
    const draggable = !this.state.draggable;
    this.setState({ draggable });
    this.map.setOptions({ draggable });
  };

  componentDidMount() {
    this.initMap();
    document.addEventListener('mousedown', () =>
      this.setState({ penDown: true })
    );
    document.addEventListener('mouseup', () =>
      this.setState({ penDown: false })
    );
  }

  render() {
    return (
      <div>
        <h1>My google map</h1>
        <button id="locate" onClick={this.locate}>
          Locate me
        </button>
        <button id="drawToggle" onClick={this.toggleDraggable}>
          {this.state.draggable ? 'Will drag' : 'Will draw'}
        </button>
        <div
          id="map"
          style={{
            height: '400px',
            width: '100%',
          }}
        ></div>
      </div>
    );
  }
}
