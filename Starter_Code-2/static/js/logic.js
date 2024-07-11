// // Create a Leaflet map
// var map = L.map('map').setView([0, 0], 2);

// // Add OpenStreetMap tiles to the map
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);

// // Fetch earthquake data from the USGS API using D3
// d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson').then(function(data) {

//         // Function to set marker style based on earthquake properties
//         function getMarkerStyle(feature) {
//             return {
//                 radius: feature.properties.mag * 2,
//                 fillColor: getColor(feature.geometry.coordinates[2]),
//                 color: "#000",
//                 weight: 1,
//                 opacity: 1,
//                 fillOpacity: 0.8
//             };
//         }

//         // Function to create popup content for each earthquake marker
//         function createPopupContent(feature) {
//             return `<b>Location:</b> ${feature.properties.place}<br><b>Magnitude:</b> ${feature.properties.mag}<br><b>Depth:</b> ${feature.geometry.coordinates[2]} km`;
//         }

//         // Function to determine marker color based on earthquake depth
//         function getColor(depth) {
//             if (depth < 10) {
//                 return 'green';
//             } else if (depth < 30) {
//                 return 'yellow';
//             } else if (depth < 50) {
//                 return 'orange';
//             } else {
//                 return 'red';
//             }
//         }

//         // Create a GeoJSON layer with earthquake data
//         L.geoJSON(data, {
//             pointToLayer: function (feature, latlng) {
//                 return L.circleMarker(latlng, getMarkerStyle(feature)).bindPopup(createPopupContent(feature));
//             }
//         }).addTo(map);

// //         
//         // Create a legend for earthquake depth with colored boxes for each depth range
//         var legend = L.control({ position: 'bottomright' });

//         legend.onAdd = function (map) {
//             var div = L.DomUtil.create('div', 'info legend');
//             var depths = [0, 10, 30, 50];
//             var labels = [];
        
//             div.innerHTML += '<h4>Earthquake Depth (km)</h4>';
        
//             for (var i = 0; i < depths.length; i++) {
//                 div.innerHTML +=
//                     '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
//                     depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
//             }
        
//             return div;
//         };
//         legend.addTo(map);
//     });

// Create a Leaflet map
var map = L.map('map', {
    center: [0, 0],
    zoom: 2,
    layers: [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })
    ]
});

// Fetch earthquake data from the USGS API using D3
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson').then(function(earthquakeData) {
    // Function to set marker style based on earthquake properties
    function getMarkerStyle(feature) {
        return {
            radius: feature.properties.mag * 2,
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
    }

    // Function to create popup content for each earthquake marker
    function createPopupContent(feature) {
        return `<b>Location:</b> ${feature.properties.place}<br><b>Magnitude:</b> ${feature.properties.mag}<br><b>Depth:</b> ${feature.geometry.coordinates[2]} km`;
    }

    // Function to determine marker color based on earthquake depth
    function getColor(depth) {
        if (depth < 10) {
            return 'green';
        } else if (depth < 30) {
            return 'yellow';
        } else if (depth < 50) {
            return 'orange';
        } else {
            return 'red';
        }
    }

    // Create a GeoJSON layer with earthquake data
    var earthquakeLayer = L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, getMarkerStyle(feature)).bindPopup(createPopupContent(feature));
        }
    });

    // Fetch tectonic plates data
    d3.json('https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json').then(function(plateData) {
        var plateLayer = L.geoJSON(plateData, {
            style: function (feature) {
                return {
                    color: 'orange',
                    weight: 2
                };
            }
        });

        // Create base maps
        var baseMaps = {
            'OpenStreetMap': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }),
            'Satellite': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            })
        };

        // Create overlays
        var overlayMaps = {
            'Earthquakes': earthquakeLayer,
            'Tectonic Plates': plateLayer
        };

        // Add layer controls to the map
        L.control.layers(baseMaps, overlayMaps).addTo(map);

        // Add earthquake layer to the map
        earthquakeLayer.addTo(map);
    });

    // Create a legend for earthquake depth with colored boxes for each depth range
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        var depths = [0, 10, 30, 50];
        var labels = [];
    
        div.innerHTML += '<h4>Earthquake Depth (km)</h4>';
    
        for (var i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
        }
    
        return div;
    };
    legend.addTo(map);
});