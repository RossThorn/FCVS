
function createMap(){


    var southWest = L.latLng(39, -98),
    northEast = L.latLng(50, -79),
    bounds = L.latLngBounds(southWest, northEast);

    //create the map
    var map = L.map('mapid', {
        center: [45, -90],
        zoom: 6,
        maxBounds: bounds,
        maxBoundsViscosity:.7,
        minZoom: 6
    });


    //add OSM base tilelayer
    L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
      	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
      	subdomains: 'abcd',
        minZoom:2
    }).addTo(map);


    // Create necessary panes in correct order
    // map.createPane("pointsPane");
    // map.createPane("polygonsPane");


//     //call getData function
//         getCountryShapeData(map);
        getData(map);
        $(window).on("resize", function () { $("#mapid").height($(window).height()-50); map.invalidateSize(); }).trigger("resize");
        $(document).ready(function() {$(window).resize(function() {
        var bodyheight = $(this).height();
        $("#page-content").height(bodyheight-70);
    }).resize();
});

};

////////////////////////////////////////////////////////////////////////////////

function getData(map){
    //load the data
    // need to get centroid data for each state to implement data
    $.ajax("data/symbol_flowers.geojson", {
        dataType: "json",
        success: function(response){
            //var attributes = processData(response);

            //L.geoJSON(response).addTo(map);

            //call function to create symbols
            createSymbols(response, map);
            // //call function to create sequence controls
            // createSequenceControls(map, attributes);
            // //call function to create legend for prop symbols
            // createSymbolLegend(map,attributes);
            // //create legend display for year
            // createLegend (map, attributes);
            // //create legend for overlay
            // createPolyLegend(map);
        }
    });
};

////////////////////////////////////////////////////////////////////////////////

//Add circle markers for point features to the map
function createSymbols(data, map){
  var points = data.features
  console.log(data.features);
  console.log(data.features[0].properties.degrees)
  for (var i = 0, l = points.length; i < l; i++){
    console.log("fired");
    var obj = data.features[i];
    var lon = obj.geometry.coordinates[1];
    var lat = obj.geometry.coordinates[0];
    var degrees = obj.properties.degrees;
    var value = obj.properties.value;

    console.log(obj);
    console.log(degrees);
    console.log(lon);
    console.log(lat);
    console.log(value);
    L.Icon.Default.prototype.options = {
    iconSize: [(6*value),(10*value)]
    // ...etc, with all the L.Icon desired/needed options.
}
    L.marker([lat,lon], {
      rotationAngle: degrees,
    //  iconSize: [(0.6*value),value]
    }).addTo(map);
  };

//   L.marker([45, -89], {
//     rotationAngle: 90
// }).addTo(map);
    //create a Leaflet GeoJSON layer and add it to the map
  //   L.geoJson(data, {
  //     pointToLayer: function(feature, latlng){
  //        return pointToLayer(feature, latlng, attributes);
  //
  //    }
  //
  //  };
};

////////////////////////////////////////////////////////////////////////////////

// function pointToLayer(feature, latlng){
//   console.log("meow");
//     //create marker options
//     var options = {
//         radius: 8,
//         fillColor: "#5e5e5e",
//         color: "#000",
//         weight: 1,
//         opacity: 1,
//         fillOpacity: 0.6
//     };
//
//     //For each feature, determine its value for the selected attribute
//      var attValue = Number(feature.properties[attribute]);
//
//      //create circle marker layer
//      var layer = L.marker(latlng, options);
//
//
//      //return the circle marker to the L.geoJson pointToLayer option
//      return layer;
//  };

 ////////////////////////////////////////////////////////////////////////////////


$(document).ready(createMap);
