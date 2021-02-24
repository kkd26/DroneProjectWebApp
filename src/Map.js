import React, { Component } from 'react';

export default class Map extends Component {
  initMap = () => {
    const mapDiv = document.getElementById('map');
    const locateButton = document.getElementById('locate');
    const styles = [
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
    const options = {
      center: { lat: 52.1942, lng: 21.0047 },
      zoom: 14,
      styles,
      disableDefaultUI: true,
      streetViewControl: true,
    };

    const map = new google.maps.Map(mapDiv, options);

    function createMarker(pos) {
      return new google.maps.Marker({
        position: pos,
        map,
        title: 'Hello World!',
      });
    }

    map.addListener('click', (e) => {
      console.log({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    });

    map.addListener('mousemove', (e) => {
      const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      console.log(pos);
      createMarker(pos);
    });

    const infoWindow = new google.maps.InfoWindow();

    locateButton.onclick = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
            map.setZoom(15);
          },
          () => console.log('Error while locating.')
        );
      } else {
        console.log('Couldnt access the geolocation api');
      }
    };
  };

  componentDidMount() {
    this.initMap();
  }
  render() {
    return (
      <div>
        <h1>My google map</h1>
        <button id="locate">Locate me</button>
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
