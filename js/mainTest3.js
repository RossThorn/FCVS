(function(){

var ageBin = [];
var ageCounter = 0;

var myIcon = L.icon({
  iconUrl:'lib/leaflet/images/LeafIcon.png',
  iconSize: [20,30],
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
    div.innerHTML = '<select id="taxon1" onchange="selectTaxon(this)">'+
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
    div.innerHTML = '<select id="taxon2" onchange="selectTaxon(this)">'+
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
    div.innerHTML = '<select id="taxon3" onchange="selectTaxon(this)">'+
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
    div.innerHTML = '<select id="taxon4" onchange="selectTaxon(this)">'+
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

};



////////////////////////////////////////////////////////////////////////////////

// function for changing and retrieving the value of the inner taxa to be used in
// changing the representation.
function selectTaxon(legend){
  //var taxon = document.getElementById(legend.id).value;
  console.log("yo");
};


////////////////////////////////////////////////////////////////////////////////


// add the event handler
function tempChange() {
   //alert("Clicked, checked = " + this.checked);
   var id = this.id;
   if (id == "ybp1000"){
     updateSymbols(id);


   }
   else if (id == "ybp2000"){
     updateSymbols(id);

   };
};
////////////////////////////////////////////////////////////////////////////////

//calls data to be used in petal plots
function getDatasets(map){


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
//console.log(datasets);
  var datasetArray = datasets.sites;


  console.log(datasetArray);
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

function getSamples(dataset, map){
    //console.log(dataset);

    // variable assigned to dataset (which contains site location, core, sample, and age data)
    var datasetData = dataset.data;
    //console.log(datasetData);
    // a counter
    var count = 0;
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
      var siteLoc = L.marker([siteLat,siteLon], {icon:myIcon}).addTo(map);
      //console.log(core);

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

        // variable for the age of level. 0 is used as sometimes there are multiple ages, and this is quick.
        // need to, however, ensure we are using the same aging for all (if possible)
        //gets the most recent addition in age of the sample (think about calibrated vs non-calibrated radiocarbon dates)
        var sampleAge = obj.SampleAges[obj.SampleAges.length-1].Age


      //  if sampleAge

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

          console.log(ageBin);
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

 function updateSymbols(id){
   console.log(id);
 };

$(document).ready(createMap);
})();
