mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: l[l.length - 1], // starting position [lng, lat]
    zoom: 15 // starting zoom
});

for (let i = 0; i < l.length; i++) {
    const loc = l[i];
    new mapboxgl.Marker()
      .setLngLat(loc)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<h5>${locname[i]}</h5>`)
      )
      .addTo(map);
  }
  
