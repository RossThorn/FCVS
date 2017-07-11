
////////////////////////////////////////////////////////////////////////////////
// commented out to make everything global to be reference by the fmbols function which needs to
// be global and needs to access other functions.
//(function(){

// array for the ages to be binned into
var ageBin = [];
// array for markers to be placed into and removed from. May need to be outside this function.
var markers = new Array();
var ageCounter = 0;
var map;
var boxArr;

var myIcon = L.icon({
  iconUrl:'lib/leaflet/images/LeafIcon_dkblu_lg.png',
  iconSize: [20,40],
  iconAnchor:  [10,30],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  });

function createMap(){

    // set map bounds
    var southWest = L.latLng(39, -98),
    northEast = L.latLng(50, -79),
    bounds = L.latLngBounds(southWest, northEast);

    //create the map
     map = L.map('mapid', {
        center: [46, -94],
        zoom: 7,
        //maxBounds: bounds,
        maxBoundsViscosity:.7,
        minZoom: 7
    });

    //console.log(map);

    //add base tilelayer
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">Carto</a>',
      	subdomains: 'abcd'
    }).addTo(map);

        createControls(map);

        //window resize function so map takes up entirety of screen on resize
        $(window).on("resize", function () { $("#mapid").height($(window).height()); map.invalidateSize(); }).trigger("resize");
        $(document).ready(function() {$(window).resize(function() {
        var bodyheight = $(this).height();
        $("#page-content").height(bodyheight-70);
    }).resize();
});

};



/////////////////////////Taxa Dropdown Menu////////////////////////////////////

// creates taxa dropdown to change taxa that is being displayed. Need to add option for more
// and less taxa and a cap for the maximum amount you can have (probably around 6).

function createControls(map){

var taxon1 = L.control({position: 'topright'});
taxon1.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = '<select id="taxon1" onchange="updateSymbols(this)">'+
    '<option selected="selected" value="Spruce">Spruce</option>'+
    '<option value="Oak">Oak</option>'+
    '<option value="Maple">Maple</option>'+
    '<option value="Pine">Pine</option>'+
    '<option value="Hemlock">Hemlock</option>'+
    '<option value="Birch">Birch</option></select>';
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};

taxon1.addTo(map);

var taxon2 = L.control({position: 'topright'});
taxon2.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = '<select id="taxon2" onchange="updateSymbols(this)">'+
    '<option value="Spruce">Spruce</option>'+
    '<option selected="selected" value="Oak">Oak</option>'+
    '<option value="Maple">Maple</option>'+
    '<option value="Pine">Pine</option>'+
    '<option value="Hemlock">Hemlock</option>'+
    '<option value="Birch">Birch</option></select>';
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};
taxon2.addTo(map);

var taxon3 = L.control({position: 'topright'});
taxon3.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = '<select id="taxon3" onchange="updateSymbols(this)">'+
    '<option value="Spruce">Spruce</option>'+
    '<option value="Oak">Oak</option>'+
    '<option selected="selected" value="Maple">Maple</option>'+
    '<option value="Pine">Pine</option>'+
    '<option value="Hemlock">Hemlock</option>'+
    '<option value="Birch">Birch</option></select>';
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};
taxon3.addTo(map);

var taxon4 = L.control({position: 'topright'});
taxon4.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = '<select id="taxon4" onchange="updateSymbols(this)">'+
    '<option value="Spruce">Spruce</option>'+
    '<option value="Oak">Oak</option>'+
    '<option value="Maple">Maple</option>'+
    '<option selected="selected" value="Pine">Pine</option>'+
    '<option value="Hemlock">Hemlock</option>'+
    '<option value="Birch">Birch</option></select>';
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};
taxon4.addTo(map);


// create the temporal selector. Eventually will be a slider
var tempLegend = L.control({position: 'topleft'});

tempLegend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'leaflet-control-layers-selector');

    div.innerHTML = '<form><input id="ybp1000" type="radio" checked="true" name="temporal"/>0-1000 YBP</input>'+
    '<br><input id="ybp2000" type="radio" name="temporal"/>1001-2000 YBP</input></form>';
    return div;
};

tempLegend.addTo(map);


document.getElementById ("ybp1000").addEventListener ("click", tempChange, false);
document.getElementById ("ybp2000").addEventListener ("click", tempChange, false);

var box1 = document.getElementById("taxon1").id;
var box2 = document.getElementById("taxon2").id;
var box3 = document.getElementById("taxon3").id;
var box4 = document.getElementById("taxon4").id;
boxArr = [box1,box2,box3,box4];

// function to retrieve datasets is here so box IDs can be passed
// getDatasets(map,boxArr);

};



////////////////////////////////////////////////////////////////////////////////

// temporal change used to call updateSymbols need to correct parameters
function tempChange() {
   var id = this.id;
   //console.log(map);
   if (id == "ybp1000"){
     meow();
     //updateSymbols(id);
   }
   else if (id == "ybp2000"){
     meow();
     //updateSymbols(id);
   };

   //getDatasets(map);
};
////////////////////////////////////////////////////////////////////////////////

//calls data to be used in petal plots

function getDatasets(map,boxArr){


     // ajax call that retrieves data based on taxon name. Represents a json call based
     // on Flyover Country's polygon json calls defined by user path.
  var taxonIds = ["Pinus","Picea"];
  var ageChunks = [[0,1000],[1000,2000]];
  for (var i = 0; i < taxonIds.length; i++) {
    for (var j = 0; j < ageChunks.length; j++) {
      console.log(taxonIds[i]);
      var urlBaseMN = 'http://apidev.neotomadb.org/v1/data/pollen?wkt=POLYGON'+'
      ((-97.294921875%2048.93964118139728,-96.6357421875%2043.3601336603352,-91.20849609375%2043.53560718808973,'+
      '-93.09814453125%2045.10745410539934,-92.17529296875%2046.69749299744142,-88.79150390625%2047.874907453605935,'+
      '-93.53759765625%2048.910767192107755,-97.294921875%2048.93964118139728))';
      var url = [urlBaseMN, '&taxonname=', taxonIds[i], '&ageold=', ageChunks[j][1], '&ageyoung=', ageChunks[j][0]].join('')
      $.ajax(url, {
        dataType: "json",
        success: function(response){
          //this is where we should bin and stuff
          createSymbols(response, map);
        }
      });
    }
  }


 };



////////////////////////////////////////////////////////////////////////////////

function getSites(datasets,map,boxArr){
//console.log(datasets);
  var datasetArray = datasets.sites;


  //console.log(boxArr);
  //console.log(datasetArray.length);

  // looping through to find every dataset in each site
  for (var i = 0, l = datasetArray.length; i < l; i++){
    //console.log(datasetArray[i].Datasets);
    var datasets = datasetArray[i].Datasets;


    //a for loop to make an ajax call for each dataset based on the dataset ID (54 total in this example)
    for (var set = 0, len = datasets.length; set < len; set++){
        var obj = datasets[set];
        //console.log(obj);
        var dataID = obj.DatasetID;
        //console.log(dataID);

        // ajax call based on datasetID that calls getSamples to retrieve data from each site
        // downloads are heavy and slow.
        $.ajax("http://api.neotomadb.org/v1/data/downloads/"+dataID, {
         dataType: "json",
         success: function(response){
           //console.log(response);
           getSamples(response,map);
           //createSymbols(response,map);
           }
           });

        // attempt a d3 queue in the future to load them all at the same time then use a loading icon.
        // the queue may be defined outside of the for loop. (see https://github.com/d3/d3-queue)

        // d3.queue()
        // .defer(d3.json, function())

    }


          };

  //console.log(ageBin);
  //console.log("done");
  //console.log(counter2);

};


////////////////////////////////////////////////////////////////////////////////
// function added to easily check if elements are being fired.
function meow(){
  console.log("meow");
};
////////////////////////////////////////////////////////////////////////////////


// need to pass in taxa and taxon id (for each individual box) to be searched from the ones set in input boxes.
// add taxon box id (eg. taxon1) for icon rotation and taxa value from that box as arguments.
function getSamples(dataset, map){
    //console.log(dataset);

    // variable assigned to dataset (which contains site location, core, sample, and age data)
    var datasetData = dataset.data;
    //console.log(datasetData);


    //console.log(datasetData);
    // a loop to go through each object in the dataset array (which should only be one)
    for (var i = 0, l = datasetData.length; i < l; i++){

      // variable for array of all samples in a particular dataset
      var core = datasetData[i].Samples;
      // variable to access site location data
      var site = datasetData[i].Site;
      // variables for the site's coordinates
      var siteLat = site.Latitude;
      var siteLon = site.Longitude;

      // temporary icons placed in the site locations. Need to do custom markers here
      // consider offering checkboxes with two years only rather than trying to do slider for now.
      var marker = L.marker([siteLat,siteLon], {
        icon:myIcon
      });
        map.addLayer(marker);
        markers[marker._leaflet_id] = marker;


      // loop to go through each level record in the core.
      for (var level = 0, len = core.length; level < len; level++){
        // incrementing the age counter.
        ageCounter++;
        // variable for each level in the core
        var obj = core[level];
        // variable for the depth of each level
        var depth = obj.AnalysisUnitDepth;
        // variable for array containing all samples found at a particular level in the core
        var samples = obj.SampleData;

        // gets the most recent addition in age of the sample, which is the most up to date and accurate dates
        // (think about calibrated vs non-calibrated radiocarbon dates)
        var sampleAge = obj.SampleAges[obj.SampleAges.length-1].Age

        //console.log(core);

        //pushes all ages of samples into the bin. Total of 2511 instances.
        //round each year to the
        ageBin.push(sampleAge);

        // if statement triggers once all ages are accounted for. Need a way of doing this without knowing the call since 2510 is used
        // with the knowledge of how many separate ages are being drawn.
        // postponing slider for now on age.
        if (ageCounter > 2510){

          // date for current year. just wanted the option in case I want to do YBP with an accurate present date.
          var date = new Date();
          var currentYear = date.getFullYear();

          //console.log(ageBin);
          //ages all measured relative to 1950. Thus negative numbers are younger than 1950.
          var min = Math.min.apply(null, ageBin),
              max = Math.max.apply(null, ageBin);

          //numbers corrected for current year. Unsure if this will work right now. Probably not as I need to call things based on their cataloged year.
          // will need to do this sort of correction for temporal filter, but not for searching data.

          //var diffCorrect = currentYear - 1950;
          var range = max - min;
          //console.log(range);

          //define the number of classes based on each class width being 1000 years.
          //rounded up to get everything. Equal interval classifications to bin by year
          var classNum = Math.ceil(range/1000);

          //console.log(classNum);
          // var maxCorrect = max + diffCorrect;
          // var minCorrect = min + diffCorrect;

        };
        //console.log(ageBin);
        //console.log(depth);
        //console.log(samples);
      };

    };

};


////////////////////////////////////////////////////////////////////////////////

// add taxon box id (eg. taxon1) for icon rotation and taxa value from that box as arguments.
// also need different icons based on the box the taxa is selected from (and will be rotated according to that box)

// ONLY WORKS WITH THE OLD JSON DATA NOT THE CURRENT DATA CALLS. NEEDS TO BE REDONE.

//Add proportional markers for each point in data.
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

    //can be omitted due to access to each site's lon and lat values
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

    var marker = L.marker([lat,lon], {
        //rotationAngle: degrees,
        icon: myIcon
      }).addTo(map);

      //counter++;

       //original popupContent changed to popupContent variable
       var popupContent = "<p><b>Taxon:</b> " + obj.TaxonName + "</p>";

       //add formatted attribute to popup content string
       //var year = attribute.split("_")[1];
       popupContent += "<p><b>% abundance:</b> <br>" + Math.round(value/(obj.UPHE+obj.VACR)) + "</p>";
       //console.log("yep");

       marker.bindPopup(popupContent)

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
 // function for changing and retrieving the value of the inner taxa to
 // change the representation.
 // Must be on the global scale to be called by onchange of the taxon dropdowns.
 // also must conform to temporal changes, not just changes based on taxon

 function updateSymbols(box){
   var taxon = document.getElementById(box.id).value;
   var boxID = box.id;

   if (boxID == "taxon1"){
     var degrees = 360;
   }
   else if (boxID == "taxon2"){
     var degrees = 90;
   }
   else if (boxID == "taxon3"){
     var degrees = 180;
   }
   else if (boxID == "taxon4"){
     var degrees = 270;
   };
   //console.log(map);
   //console.log(degrees);

   //if going this route, need to pass degrees so I know which onese to be removed
   getAllMarkers();

   //add new code for updating symbols here I think. resizing would take place here or adding new ones.

 };

////////////////////////////////////////////////////////////////////////////////

 // experimental extension of the marker addition.

 function getAllMarkers() {
   //console.log("fired");
   console.log(markers);

     var allMarkersObjArray = [];//new Array();
     //var allMarkersGeoJsonArray = [];//new Array();
     console.log(map._layers);

     $.each(map._layers, function (ml) {
         //console.log(ml)
         //formerly, map._layers[ml].feature
         if (markers[ml]) {
             console.log('value in Array!');
             map.removeLayer(map._layers[ml]);
             // takes too long to do. Need to do the updatesymbols call and just resize current symbols in some way.
             //getDatasets(map,boxArr);
        } else {
            console.log('Not in array');
        };



        //  {
        //      map.removeLayer(map._layers[ml]);
        //      //need to look at geojson feature part...
        //      //allMarkersGeoJsonArray.push(JSON.stringify(this.toGeoJSON()));
        //
        //  }

     })

     console.log(allMarkersObjArray);
    // console.log(allMarkersGeoJsonArray);
    // alert("total Markers : " + allMarkersGeoJsonArray.length + "\n\n" + allMarkersGeoJsonArray + "\n\n Also see your console for object view of this array" );
 }



 ////////////////////////////////////////////////////////////////////////////////

$(document).ready(createMap);

//$(".get-markers").on("click", getAllMarkers);
//})();
