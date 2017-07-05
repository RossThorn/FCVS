(function(){

var ageBin = [];
var ageCounter = 0;

function createMap(){

    // set map bounds
    var southWest = L.latLng(39, -98),
    northEast = L.latLng(50, -79),
    bounds = L.latLngBounds(southWest, northEast);

    //create the map
    var map = L.map('mapid', {
        center: [46, -94],
        zoom: 7,
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
    div.innerHTML = '<select id="legend1" onchange="selectTaxon(this)"><option selected="selected" value="Spruce">Spruce</option><option value="Oak">Oak</option><option value="Maple">Maple</option><option value="Pine">Pine</option><option value="Hemlock">Hemlock</option><option value="Birch">Birch</option></select>';
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};

legend1.addTo(map);

var legend2 = L.control({position: 'topright'});
legend2.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = '<select id="legend2" onchange="selectTaxon(this)"><option value="Spruce">Spruce</option><option selected="selected" value="Oak">Oak</option><option value="Maple">Maple</option><option value="Pine">Pine</option><option value="Hemlock">Hemlock</option><option value="Birch">Birch</option></select>';
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};
legend2.addTo(map);

var legend3 = L.control({position: 'topright'});
legend3.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = '<select id="legend3" onchange="selectTaxon(this)"><option value="Spruce">Spruce</option><option value="Oak">Oak</option><option selected="selected" value="Maple">Maple</option><option value="Pine">Pine</option><option value="Hemlock">Hemlock</option><option value="Birch">Birch</option></select>';
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};
legend3.addTo(map);

var legend4 = L.control({position: 'topright'});
legend4.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = '<select id="legend4" onchange="selectTaxon(this)"><option value="Spruce">Spruce</option><option value="Oak">Oak</option><option value="Maple">Maple</option><option selected="selected" value="Pine">Pine</option><option value="Hemlock">Hemlock</option><option value="Birch">Birch</option></select>';
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};
legend4.addTo(map);
 };

////////////////////////////////////////////////////////////////////////////////

function selectTaxon(legend){
  var taxon = document.getElementById(legend.id).value;
}

////////////////////////////////////////////////////////////////////////////////

//calls data to be used in petal plots
function getDatasets(map){
    //load the data

    //ajax call that retrieves data based on taxon name
    //$.ajax("http://apidev.neotomadb.org/v1/data/pollen?taxonname=picea", {
      $.ajax("data/MinnesotaPollenSites.json", {
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
console.log(datasets);
  var datasetArray = datasets.sites;


  console.log(datasetArray);
  //console.log(datasetArray.length);
  // looping through to find every dataset in each site
  for (var i = 0, l = datasetArray.length; i < l; i++){
    //console.log(datasetArray[i].Datasets);
    var datasets = datasetArray[i].Datasets;
    // looping through each individual dataset

    //a for loop to make an ajax call for each dataset based on the dataset ID (54 total in this example)
    for (var set = 0, len = datasets.length; set < len; set++){
        var obj = datasets[set];
        //console.log(obj);
        var dataID = obj.DatasetID;
        //rconsole.log(dataID);

        $.ajax("http://api.neotomadb.org/v1/data/downloads/"+dataID, {
         dataType: "json",
         success: function(response){
           //console.log(response);
           getSamples(response,map);
           //createSymbols(response,map);
           }
           });

    }


          };

    //console.log(ageBin);
  //console.log("done");
  //console.log(counter2);

};


////////////////////////////////////////////////////////////////////////////////

function getSamples(dataset, map){
    //console.log(dataset);

    var datasetData = dataset.data;
    //console.log(datasetData);
    var count = 0;
    //console.log(datasetData);
    for (var i = 0, l = datasetData.length; i < l; i++){

      // variable for array of all samples in a particular dataset
      var core = datasetData[i].Samples;
      console.log(core);

      for (var level = 0, len = core.length; level < len; level++){
        ageCounter++;
        var obj = core[level];
        var depth = obj.AnalysisUnitDepth;
        var samples = obj.SampleData;
        var sampleAge = obj.SampleAges[0].Age

        //pushes all ages of samples into the bin. Total of 2511 instances.
        ageBin.push(sampleAge);
        if (ageCounter > 2510){

          var date = new Date();
          var currentYear = date.getFullYear();

          console.log(ageBin);
          //ages all measured relative to 1950. Thus negative numbers are younger than 1950.
          var min = Math.min.apply(null, ageBin),
              max = Math.max.apply(null, ageBin);

          //numbers corrected for current year. Unsure if this will work right now. Probably not as I need to call things based on their cataloged year.
          var diffCorrect = currentYear - 1950;
          var range = max - min;
          var maxCorrect = max + diffCorrect;
          var minCorrect = min + diffCorrect;

        };
        //console.log(ageBin);
        //console.log(depth);
        //console.log(samples);
      };

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
         //console.log("yep");

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
  //console.log(counter);
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
})();
