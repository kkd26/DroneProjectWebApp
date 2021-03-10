export var map;

const defaultStyles = [
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
const defaultOptions = {
  center: { lat: 52.1942, lng: 21.0047 },
  zoom: 17,
  minZoom: 15,
  maxZoom: 20,
  styles: defaultStyles,
  disableDefaultUI: true,
  draggable: true,
  zoomControl: true,
  mapTypeControl: true,
};
var path = null;
export const pathLengths = [];

export const initMap = () => {
  const mapDiv = document.getElementById('map');
  map = new google.maps.Map(mapDiv, defaultOptions);
  path = new google.maps.Polyline({
    strokeColor: '#FF00FF',
    strokeOpacity: 1.0,
    strokeWeight: 3,
  });
  path.setMap(map);
  path = path.getPath();
  // locate(map);
};

export const locate = (pos) => {
  const infoWindow = new google.maps.InfoWindow();
  infoWindow.setPosition(pos);
  infoWindow.setContent('Location found.');
  infoWindow.open(map);
  map.setCenter(pos);
  map.setZoom(18);
};

export const distanceInRange = (p1, p2, maxDist) => {
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

export const sendPath = () => {
  const points = path.Kb.map((p) => ({ lat: p.lat(), lng: p.lng() }));
  console.log(points);
};

export const undo = () => {
  if (pathLengths.length === 0) return;
  let segment = pathLengths.pop();
  while (segment.len === 0 && pathLengths.length > 0)
    segment = pathLengths.pop();
  for (let i = 0; i < segment.len; i++) {
    path.removeAt(path.length - 1);
  }
  for (let i = 0; i < segment.markers.length; i++) {
    segment.markers[i].setMap(null);
  }
  segment.markers = [];
};

export const addToPath = (pos) => {
  const segment = pathLengths[pathLengths.length - 1];
  segment.len++;
  path.push(pos);

  if (path.length % 10 === 1) {
    const marker = new google.maps.Marker({
      position: pos,
      map: map,
      label: '' + (((path.length / 10) | 0) % 100),
      icon: 'http://maps.google.com/mapfiles/kml/paddle/grn-blank-lv.png',
    });
    segment.markers.push(marker);
  }
};
