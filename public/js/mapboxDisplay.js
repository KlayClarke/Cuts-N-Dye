mapboxgl.accessToken = mapboxToken; // mapboxToken initialized on html file as ejs
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 6, // starting zoom
});

map.addControl(new mapboxgl.FullscreenControl());
