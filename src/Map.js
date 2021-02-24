import React, { Component } from 'react';

export default class Map extends Component {
  state = { penDown: false, draggable: true, lastPos: null };
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
  path = null;

  distanceInRange = (p1, p2, maxDist) => {
    if (!p1) return false;
    const { lat: lat1, lng: lon1 } = p1;
    const { lat: lat2, lng: lon2 } = p2;

    const p = 0.017453292519943295;
    const c = Math.cos;
    const a =
      0.5 -
      c((lat2 - lat1) * p) / 2 +
      (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

    const dist = 12742 * Math.asin(Math.sqrt(a));
    console.log(dist);
    return 1000 * dist < maxDist;
  };

  createMarker = (pos) => {
    this.path.getPath().push(pos);

    return new google.maps.Marker({
      position: pos,
      map: this.map,
      title: '#' + this.path.getPath().length,
      icon: 'http://maps.google.com/mapfiles/kml/paddle/grn-blank-lv.png',
    });
  };

  handleMouseMove = (e) => {
    if (!this.state.penDown) return;
    const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    if (this.distanceInRange(this.state.lastPos, pos, 5)) return;
    this.createMarker(e.latLng);
    this.setState({ lastPos: pos });
  };

  initMap = () => {
    const mapDiv = document.getElementById('map');
    const map = new google.maps.Map(mapDiv, this.defaultOptions);
    const path = new google.maps.Polyline({
      strokeColor: '#000000',
      strokeOpacity: 1.0,
      strokeWeight: 3,
    });
    path.setMap(map);
    map.addListener('mousemove', this.handleMouseMove);
    this.map = map;
    this.path = path;
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
