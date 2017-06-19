
function createMap(){

    // set map bounds
    var southWest = L.latLng(39, -98),
    northEast = L.latLng(50, -79),
    bounds = L.latLngBounds(southWest, northEast);

    //create the map
    var map = L.map('mapid', {
        center: [46, -91],
        zoom: 6,
        //maxBounds: bounds,
        maxBoundsViscosity:.7,
        minZoom: 4
    });

    //add base tilelayer
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">Carto</a>',
      	subdomains: 'abcd'
    }).addTo(map);


    // Create necessary panes in correct order
    // map.createPane("pointsPane");
    // map.createPane("polygonsPane");


        //call getData function
//         getCountryShapeData(map);
        getDatasets(map);

        //window resize function so map takes up entirety of screen on resize
        $(window).on("resize", function () { $("#mapid").height($(window).height()); map.invalidateSize(); }).trigger("resize");
        $(document).ready(function() {$(window).resize(function() {
        var bodyheight = $(this).height();
        $("#page-content").height(bodyheight-70);
    }).resize();
});


////////////////////Sample Taxa Input checkboxes////////////////////////////////

// // create the control
// var command = L.control({position: 'topright'});
//
// command.onAdd = function (map) {
//     var div = L.DomUtil.create('div', 'command');
//
//     div.innerHTML = '<form><input id="taxa" type="checkbox"/>Spruce</form><form><input id="taxa" type="checkbox"/>Oak</form>';
//     return div;
// };
//
// command.addTo(map);
//
//
// // add the event handler
// function handleCommand() {
//    alert("Clicked, checked = " + this.checked);
// }
//
// document.getElementById ("command").addEventListener ("click", handleCommand, false);
//


/////////////////////////Taxa Dropdown Menu////////////////////////////////////

var legend1 = L.control({position: 'topright'});
legend1.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = '<select><option selected="selected">Spruce</option><option>Oak</option><option>Maple</option><option>Pine</option><option>Hemlock</option><option>Birch</option></select>';
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};

legend1.addTo(map);

var legend2 = L.control({position: 'topright'});
legend2.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = '<select><option>Spruce</option><option selected="selected">Oak</option><option>Maple</option><option>Pine</option><option>Hemlock</option><option>Birch</option></select>';
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};
legend2.addTo(map);

var legend3 = L.control({position: 'topright'});
legend3.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = '<select><option>Spruce</option><option>Oak</option><option selected="selected">Maple</option><option>Pine</option><option>Hemlock</option><option>Birch</option></select>';
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};
legend3.addTo(map);

var legend4 = L.control({position: 'topright'});
legend4.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = '<select><option>Spruce</option><option>Oak</option><option>Maple</option><option selected="selected">Pine</option><option>Hemlock</option><option>Birch</option></select>';
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};
legend4.addTo(map);
 };

////////////////////////////////////////////////////////////////////////////////

//calls data to be used in petal plots
function getDatasets(map){
    //load the data
    
    //ajax call that retrieves data based on taxon name
    //$.ajax("http://apidev.neotomadb.org/v1/data/pollen?taxonname=picea", {
      $.ajax("http://api.neotomadb.org/v1/data/datasets?datasettype=pollen", {
        dataType: "json",
        success: function(response){
          //console.log(response);
          getSites(response,map);
          //createSymbols(response,map);
          }
          });

};

////////////////////////////////////////////////////////////////////////////////

function getSites(datasets,map){
  console.log(datasets.data);
  var datasetArray = datasets.data;
  console.log(datasetArray);
  for (var i = 0, l = datasetArray.length; i < l; i++){
    console.log(datasetArray[i]);
    // $.ajax("http://api.neotomadb.org/v1/data/datasets?datasettype=pollen", {
    //   dataType: "json",
    //   success: function(response){
    //     //console.log(response);
    //     getSites(response,map);
    //     //createSymbols(response,map);
    //     }
    //     });
    //console.log("meow");
  };
};

////////////////////////////////////////////////////////////////////////////////

//Add proportional markers for each point in data
function createSymbols(data, map){
  //console.log(data.data);
  var points = data.data
  //console.log(points[0].LatitudeNorth);
  // console.log(data.features);
  // console.log(data.features[0].properties.degrees)
  var counter = 0;
  for (var i = 0, l = points.length; i < l; i++){
    // console.log("fired");
    var obj = points[i];
    var lon = ((obj.LongitudeEast) + (obj.LongitudeWest))/2;
    var lat = ((obj.LatitudeNorth) + (obj.LatitudeSouth))/2;
    // console.log(lon);
    // console.log(lat);
    //redo this for Sequoia
    //var degrees = obj.properties.degrees;
    var value = obj.Value;


    var myIcon = L.icon({
      iconUrl:'lib/leaflet/images/LeafIcon.png',
  		iconSize: [(0.2*value),(0.3*value)],
  		iconAnchor:  [(0.1*value),(0.3*value)],
  		popupAnchor: [1, -34],
  		tooltipAnchor: [16, -28],
      });
    //console.log("blam");
    -89.8022,43.0458,-89.228,45.7484
    if (lat < 45.7484 && lat > 43.0458 && lon < -89.228 && lon > -89.8022){
      console.log(obj);
    var marker = L.marker([lat,lon], {
        //rotationAngle: degrees,
        icon: myIcon
      }).addTo(map);
      counter++;

      //original popupContent changed to popupContent variable
         var popupContent = "<p><b>Taxon:</b> " + obj.TaxonName + "</p>";

         //add formatted attribute to popup content string
         //var year = attribute.split("_")[1];
         popupContent += "<p><b>% abundance:</b> <br>" + Math.round(value/(obj.UPHE+obj.VACR)) + "</p>";
         console.log("yep");

         marker.bindPopup(popupContent)

        //  //bind the popup to the circle marker
        //  marker.bindPopup(popupContent, {
        //      offset: new L.Point(0,-options.radius),
        //      closeButton: false
        //  });
        //  console.log("uh")
        //  //event listeners to open popup on hover
        //  marker.on({
        //      mouseover: function(){
        //          this.openPopup();
        //      },
        //      mouseout: function(){
        //          this.closePopup();
        //      },
        //  });
    }





  };
  console.log(counter);
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
