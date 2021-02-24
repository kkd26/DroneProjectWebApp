import React, { Component } from 'react';

export default class Map extends Component {
  state = {
    penDown: false,
    draggable: true,
    lastPos: null,
  };
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
  map = null;
  path = null;
  pathLengths = [];

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
    return 1000 * dist < maxDist;
  };

  addToPath = (pos) => {
    const segment = this.pathLengths[this.pathLengths.length - 1];
    segment.len++;
    this.path.push(pos);

    if (this.path.length % 10 === 1) {
      const marker = new google.maps.Marker({
        position: pos,
        map: this.map,
        label: '' + (((this.path.length / 10) | 0) % 100),
        icon: 'http://maps.google.com/mapfiles/kml/paddle/grn-blank-lv.png',
      });
      segment.markers.push(marker);
    }
  };

  handleMouseMove = (e) => {
    if (!this.state.penDown) return;
    const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    if (this.distanceInRange(this.state.lastPos, pos, 5)) return;
    this.addToPath(e.latLng);
    this.setState({ lastPos: pos });
  };

  initMap = () => {
    const mapDiv = document.getElementById('map');
    const map = new google.maps.Map(mapDiv, this.defaultOptions);
    const path = new google.maps.Polyline({
      strokeColor: '#FF00FF',
      strokeOpacity: 1.0,
      strokeWeight: 3,
    });
    path.setMap(map);
    map.addListener('mousemove', this.handleMouseMove);
    this.map = map;
    this.path = path.getPath();
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
    document.addEventListener('mousedown', () => {
      this.setState({ penDown: true });
      this.pathLengths.push({ len: 0, markers: [] });
    });
    document.addEventListener('mouseup', () => {
      this.setState({ penDown: false });
    });
  }

  sendPath = () => {
    const points = this.path.Lb.map((p) => ({ lat: p.lat(), lng: p.lng() }));
    console.log(points);
  };

  undo = () => {
    if (this.pathLengths.length === 0) return;
    let segment = this.pathLengths.pop();
    while (segment.len === 0 && this.pathLengths.length > 0)
      segment = this.pathLengths.pop();
    for (let i = 0; i < segment.len; i++) {
      this.path.removeAt(this.path.length - 1);
    }
    for (let i = 0; i < segment.markers.length; i++) {
      segment.markers[i].setMap(null);
    }
    segment.markers = [];
  };

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
        <button id="sendPath" onClick={this.sendPath}>
          Send path
        </button>
        <button id="undo" onClick={this.undo}>
          Undo
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
