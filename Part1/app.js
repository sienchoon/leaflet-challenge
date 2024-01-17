// loading the GeoJSON data
let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"


// Creating leaflet map
let Map = L.map("map").setView([42.87, -98.38], 4);

// adding title layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(Map);

// adding colour for markers based on depth
const markerColor = (depth) => {
    if (depth > 90) {
      return "red"; // red = dangerous
    } else if (depth > 70 && depth <= 90) {
      return "darkorange";
    } else if (depth > 50 && depth <= 70) {
      return "orange";
    } else if (depth > 30 && depth <= 50) {
      return "gold";
    } else if (depth > 10 && depth <= 30) {
      return "yellow";
    } else if (depth <= 10) {
      return "lightgreen"; // least dangerous
    } else {
      return "lightgray"; // not a valid depth
    }
};

// create marker for earthquake
const mapMarker = (feature) => {
    return {
    fillOpacity: 0.70,
    fillColor: markerColor(feature.geometry.coordinates[2]),
    color: "black",
    radius: feature.properties.mag * 4, // Adjust radius based on magnitude
    weight: 0.5,
    stroke: true,
    };
};

// use d3 and load data from USGS website

d3.json(geoData).then(function(data) {
    // load the data
    L.geoJson(data, {
        pointToLayer: (feature, latlng) => {
          return L.circleMarker(latlng, {
            style: mapMarker(feature),
          });
        },
        style: mapMarker,
        onEachFeature: (feature, layer) => {
          
          // Bind a popup to each earthquake marker
          layer.bindPopup(`Location: <h3>${feature.properties.place} </h3><hr> \
               Magnitude: <b>${feature.properties.mag} </b><br> \
               Depth: <b>${feature.geometry.coordinates[2]} </b><br> \
               Time: <b>${new Date(feature.properties.time)}</b>`);
    
          // Close the popup.
          layer.closePopup();
        },
      }).addTo(Map); // Adding the data to the map.
      createLegend();
    });
    
const depthColors = ["lightgreen", "yellow", "gold", "orange", "darkorange", "red"];  // https://gis.stackexchange.com/questions/133630/adding-leaflet-legend 
function createLegend() {
let legend = L.control({ position: 'bottomright' });
legend.onAdd = function () {
  var div = L.DomUtil.create('div', 'info legend');
  labels = ["<div style='background-color: lightgray'><strong>Depth (km)</strong></div>"]; // Add a legend title.
  categories = ['-10-10', ' 10-30', ' 30-50', ' 50-70', ' 70-90', '90+']; // Add legend categories.
  for (var i = 0; i < categories.length; i++) { // Iterate over the categories and add them to the legend.
    div.innerHTML +=
      labels.push(
        '<li class="circle" style="background-color:' + depthColors[i] + '">' + categories[i] + '</li> '
      );
  }
  // Set the inner HTML of the legend element.
  div.innerHTML = '<ul style="list-style-type:none; text-align: center; font-size: 14px;">' + labels.join('') + '</ul>'
  return div;
};
legend.addTo(Map);}

