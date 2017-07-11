
function createMap(){

    // set map bounds
    var southWest = L.latLng(39, -98),
    northEast = L.latLng(50, -79),
    bounds = L.latLngBounds(southWest, northEast);

    //create the map
    var map = L.map('mapid', {
        center: [45, -90],
        zoom: 7,
        maxBounds: bounds,
        maxBoundsViscosity:.7,
        minZoom: 6
    });


    //add base tilelayer
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">Carto</a>',
      	subdomains: 'abcd',
        minZoom:2
    }).addTo(map);


    // Create necessary panes in correct order
    // map.createPane("pointsPane");
    // map.createPane("polygonsPane");


        //call getData function
//         getCountryShapeData(map);
        getData(map);

        //window resize function so map takes up entirety of screen on resize
        $(window).on("resize", function () { $("#mapid").height($(window).height()); map.invalidateSize(); }).trigger("resize");
        $(document).ready(function() {$(window).resize(function() {
        var bodyheight = $(this).height();
        $("#page-content").height(bodyheight-70);
    }).resize();
});

};

////////////////////////////////////////////////////////////////////////////////

//calls data to be used in petal plots
function getData(map){
    //load the data
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

    $.ajax("http://apidev.neotomadb.org/v1/data/pollen?taxonname=sequoia", {
        dataType: "json",
        success: function(response){
          console.log(response);
          createSymbols(response,map);
          }
          });

};

////////////////////////////////////////////////////////////////////////////////

//Add proportional markers for each point in data
function createSymbols(data, map){
  var points = data.features
  // console.log(data.features);
  // console.log(data.features[0].properties.degrees)
  for (var i = 0, l = points.length; i < l; i++){
    // console.log("fired");
    var obj = data.features[i];
    var lon = obj.geometry.coordinates[1];
    var lat = obj.geometry.coordinates[0];
    var degrees = obj.properties.degrees;
    var value = obj.properties.value;


    var myIcon_dkblu = L.icon({
      iconUrl:'lib/leaflet/images/LeafIcon_dkblu_lg.png',
      iconSize: [(2*value),(4*value)],
      iconAnchor:  [(value),(4*value)],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      });

      var myIcon_ltblu = L.icon({
        iconUrl:'lib/leaflet/images/LeafIcon_ltblu_lg.png',
        iconSize: [(2*value),(4*value)],
        iconAnchor:  [(value),(4*value)],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        });

      var myIcon_dkgrn = L.icon({
        iconUrl:'lib/leaflet/images/LeafIcon_dkgrn_lg.png',
        iconSize: [(2*value),(4*value)],
        iconAnchor:  [(value),(4*value)],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        });

      var myIcon_ltgrn = L.icon({
        iconUrl:'lib/leaflet/images/LeafIcon_ltgrn_lg.png',
        iconSize: [(2*value),(4*value)],
        iconAnchor:  [(value),(4*value)],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        });


       if (degrees == 360){
         var myIcon = myIcon_dkblu;

       } else if (degrees == 90){
         var myIcon = myIcon_ltblu;

       } else if (degrees == 180){
         var myIcon = myIcon_dkgrn;

       } else if (degrees == 270){
         var myIcon = myIcon_ltgrn;

       };
    //console.log("blam");
    //if (degrees == 360){
    var marker = L.marker([lat,lon], {
        rotationAngle: degrees,
        icon: myIcon
      }).addTo(map);
    //}

    var popupContent = "<p><b>Taxon:</b> " + obj.properties.category + "</p>";

    //add formatted attribute to popup content string
    //var year = attribute.split("_")[1];
    popupContent += "<p><b>% abundance:</b> <br>" + (value) + "%</p>";
    //console.log("yep");

    marker.bindPopup(popupContent)

      // //original popupContent changed to popupContent variable
      //
      // if (obj.properties)
      //    var popupContent = "<p><b>Taxon:</b> " + feature.properties.Country + "</p>";
      //
      //    //add formatted attribute to popup content string
      //    var year = attribute.split("_")[1];
      //    popupContent += "<p><b>CO2 emissions in " + year + " (kt):</b> <br>" + Math.round(feature.properties[attribute]) + "</p>";
      //
      //    //bind the popup to the circle marker
      //    layer.bindPopup(popupContent, {
      //        offset: new L.Point(0,-options.radius),
      //        closeButton: false
      //    });
      //    //event listeners to open popup on hover
      //    layer.on({
      //        mouseover: function(){
      //            this.openPopup();
      //        },
      //        mouseout: function(){
      //            this.closePopup();
      //        },
      //    });


  };
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
