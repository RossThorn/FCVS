(function(){

var attributes = [];

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


    //call getData function
        getShapeData(map);
//         getData(map);
        $(window).on("resize", function () { $("#mapid").height($(window).height()); map.invalidateSize(); }).trigger("resize");
        $(document).ready(function() {$(window).resize(function() {
        var bodyheight = $(this).height();
        $("#page-content").height(bodyheight-70);
          }).resize();
        });


};

////////////////////////////////////////////////////////////////////////////////

function getShapeData(map){
    //load the data
    $.ajax("Data/GreatLakes.geojson", {
        dataType: "json",
        success: function(response){
          var polyAttributes = processPolyData(response);
            createPolygons(response, map, attributes);
        }
    });
};

////////////////////////////////////////////////////////////////////////////////

function processPolyData(data){
  console.log(data);
  //properties of the first feature in the dataset
  // var properties = data.features[0].properties;
  // console.log(properties);

  var properties = data.features;
  console.log(properties);

  //push each attribute name into attributes array
  for (var object in properties){
      //only take attributes with Rank values
      // if (object.indexOf("name") > -1){
      //     object.push(object);
      //     console.log(properties[object]);
      // };
      console.log(object);
  };


  return attributes;
};

///////////////////////////////////////////////////////////////////////////////

function createPolygons(data, map, attributes){
    //create a Leaflet GeoJSON layer and add it to the map
    var polyLayer = L.geoJson(data, {
      style: function(feature){
        //console.log(feature);
        var options = {
            fillColor: "tomato",
            weight: .5,
            color: "chartreuse",
            opacity: 1,
            fillOpacity: 0.8
        };

        //console.log(options.fillColor);
        return options;
      },
      // pane:"polygonsPane"
    });
   console.log(polyLayer);
//    var overlays = {
//     "Countries with<br> States": polyLayer
// };
//      L.control.layers(null,overlays,{collapsed:false}).addTo(map);
polyLayer.addTo(map);

};

///////////////////////////////////////////////////////////////////////////////




 function getData(map){
     //load the data
     // need to get centroid data for each state to implement data
     $.ajax("data/CO2centroids.geojson", {
         dataType: "json",
         success: function(response){
             var attributes = processData(response);

             //call function to create proportional symbols
             createPropSymbols(response, map, attributes);
             //call function to create sequence controls
             createSequenceControls(map, attributes);
             //call function to create legend for prop symbols
             createSymbolLegend(map,attributes);
             //create legend display for year
             createLegend (map, attributes);
             //create legend for overlay
             createPolyLegend(map);
         }
     });
 };

////////////////////////////////////////////////////////////////////////////////
 function processData(data){
     //properties of the first feature in the dataset
     var properties = data.features[0].properties;

     //push each attribute name into attributes array
     for (var attribute in properties){
         //only take attributes with population values
         if (attribute.indexOf("CO2") > -1){
             attributes.push(attribute);
         };
     };
     return attributes;
 };

 //Add circle markers for point features to the map
 function createPropSymbols(data, map, attributes){
     //create a Leaflet GeoJSON layer and add it to the map
     L.geoJson(data, {
       pointToLayer: function(feature, latlng){
          return pointToLayer(feature, latlng, attributes);

      }

    }, { pane:"pointsPane"}).addTo(map);
 };

///////////////////////////////////////////////////////////////////////////////
function pointToLayer(feature, latlng, attributes){
    //create marker options
    var options = {
        radius: 8,
        fillColor: "#5e5e5e",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.6
    };
    var attribute = attributes[0];

    //For each feature, determine its value for the selected attribute
     var attValue = Number(feature.properties[attribute]);

     //Give each feature's circle marker a radius based on its attribute value
     options.radius = calcPropRadius(attValue);

     //create circle marker layer
     var layer = L.circleMarker(latlng, options);

     //original popupContent changed to popupContent variable
        var popupContent = "<p><b>Country:</b> " + feature.properties.Country + "</p>";

        //add formatted attribute to popup content string
        var year = attribute.split("_")[1];
        popupContent += "<p><b>CO2 emissions in " + year + " (kt):</b> <br>" + Math.round(feature.properties[attribute]) + "</p>";

        //bind the popup to the circle marker
        layer.bindPopup(popupContent, {
            offset: new L.Point(0,-options.radius),
            closeButton: false
        });
        //event listeners to open popup on hover
        layer.on({
            mouseover: function(){
                this.openPopup();
            },
            mouseout: function(){
                this.closePopup();
            },
        });
     //return the circle marker to the L.geoJson pointToLayer option
     return layer;
 };

 //////////////////////////////////////////////////////////////////////////////

function calcPropRadius(attValue) {
    //scale factor to adjust symbol size evenly
    var scaleFactor = .001;
    //area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);

    return radius;
};

///////////////////////////////////////////////////////////////////////////////
// //Create new sequence controls
function createSequenceControls(map, attributes){
    var SequenceControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },
        onAdd: function (map) {
            // create the control container div with a particular class name
            var container = L.DomUtil.create('div', 'sequence-control-container');
            // create div element with the class 'overlay' and append it to the body

            //$(container).append('<button class="skip" id="reverse" title="Reverse">Reverse</button>');
            //create range input element (slider)
            $(container).append('<input class="range-slider" type="range" max="6" min="0" step="1" value="0">');
          //  $(container).append('<button class="skip" id="forward" title="Forward">Skip</button>');
          // var initialYear = attributes[0]
          // var year = initialYear.split("_")[1];
          // $(container).append('<p>'+year+'</p>');
           //kill any mouse event listeners on the map
           L.DomEvent.disableClickPropagation(container);
            $(container).on('mousedown click', function(e){

                $('.range-slider').on('input', function(){
                    var index = $(this).val();

                    updatePropSymbols(map, attributes[index]);
            });
            });
            return container;
        }
    });
    map.addControl(new SequenceControl());
  };

///////////////////////////////////////////////////////////////////////////////

  function createLegend(map, attributes){
      var LegendControl = L.Control.extend({
          options: {
              position: 'bottomright'
          },
          onAdd: function (map) {
              // create the control container with a particular class name
              var container = L.DomUtil.create('div', 'legend');
              //PUT YOUR SCRIPT TO CREATE THE TEMPORAL LEGEND HERE
              var initialYear = attributes[0]
              $(container).append("<div id='title' style='font-size:12px'><p><b>CO2 emissions in</b></p></div>")
              $(container).append("<div id='legendYear' class='leaflet-legend-control'><p><b>2007</b></p></div>");

              return container;
          }
      });

      map.addControl(new LegendControl());
  };

//////////////////////////////////////////////////////////////////////////////
//update function for tooltips only
function updatePropSymbols(map, attribute){

    map.eachLayer(function(layer){
//global variable that holds currently selected feature
//if statement that checks what is in the span tag

        if (layer.feature && layer.feature.properties[attribute]){
            //update the layer style and popup
            var props = layer.feature.properties;
                 //update each feature's radius based on new attribute values
                 var radius = calcPropRadius(props[attribute]);
                 layer.setRadius(radius);
                 var year = attribute.split("_")[1];
                 popupContent = "<p><b>Country:</b> " + props.Country + "</p>";

                 popupContent += "<p><b>CO2 emissions in " + year + " (kt):</b> <br>" + Math.round(props[attribute]) + "</p>";
                 var container = L.DomUtil.get('legendYear');
                   $(container).html('<p><b>'+year+'</b></p>');

                   updateLegend(map,attribute);
                 //replace the popup to the circle marker
                 layer.bindPopup(popupContent, {
                     offset: new L.Point(0,-radius),
                     closeButton: false
                 })

                 layer.on({
                     mouseover: function(){
                         this.openPopup();
                     },
                     mouseout: function(){
                         this.closePopup();
                     },
                 });
             };
           });

         };

////////////////////////////////////////////////////////////////////////////////

 function createSymbolLegend(map, attributes){


     var LegendControl = L.Control.extend({
         options: {
             position: 'bottomright'
         },

         onAdd: function (map) {
       // create the control container with a particular class name
       var container = L.DomUtil.create('div', 'legendCircle');

       //Step 1: start attribute legend svg string
       var svg = '<svg id="attribute-legend" width="300px" height="130px">';

       //array of circle names to base loop on
       var circles = {
            max: 60,
            mean: 90,
            min: 120
        };

       //Step 2: loop to add each circle and text to svg string
       for (var circle in circles){
           //circle string
           svg += '<circle class="legend-circle" id="' + circle +
           '" fill="#a5a5a5" fill-opacity="0.8" stroke="#000000" cx="65"/>';

           //text string
           svg += '<text id="' + circle + '-text" x="135" y="' + circles[circle] + '"></text>';
       };

       //close svg string
       svg += "</svg>";

       //add attribute legend svg to container
       $(container).append(svg);


             return container;
         }
     });

     map.addControl(new LegendControl());

     updateLegend(map, attributes[0]);
 };

 //////////////////////////////////////////////////////////////////////////////

 function getCircleValues(map, attribute){
     //start with min at highest possible and max at lowest possible number
     var min = Infinity,
         max = -Infinity;

     map.eachLayer(function(layer){
         //get the attribute value
         if (layer.feature){
             var attributeValue = Number(layer.feature.properties[attribute]);

             //test for min
             if (attributeValue < min){
                 min = attributeValue;
             };

             //test for max
             if (attributeValue > max){
                 max = attributeValue;
             };
         };
     });

     //set mean
     var mean = (max + min) / 2;

     //return values as an object
     return {
         max: max,
         mean: mean,
         min: min
     };
 };

 //////////////////////////////////////////////////////////////////////////////

 //Update the legend with new attribute
 function updateLegend(map, attribute){

     //get the max, mean, and min values as an object
     var circleValues = getCircleValues(map, attribute);
     for (var key in circleValues){
       //get the radius
       var radius = calcPropRadius(circleValues[key]);

       //assign the cy and r attributes
       $('#'+key).attr({
           cy: 129 - radius,
           r: radius
       });
       //add legend text
        $('#'+key+'-text').text(Math.round(circleValues[key]*100)/100 + " kilotons");
   };
 };

 //////////////////////////////////////////////////////////////////////////////

 function createPolyLegend(map){

   var legend = L.control({position: 'bottomleft'});

   legend.onAdd = function (map) {

       var div = L.DomUtil.create('div', 'legendPoly'),
           grades = [4,3,2,1,0],
           labels = [];

      div.innerHTML += '<p><b>Climate Change Policy Grade</b></p>'

       // loop through our density intervals and generate a label with a colored square for each interval
       for (grade in grades) {
          var colorGrade = grades[grade];
           div.innerHTML +=
               '<i style="background:' + getColor(colorGrade) + '"></i>';
               //assign label to each legend symbol based on the grade
               if(colorGrade == 4){
                 div.innerHTML += '<span id="label"><b>A</b></span>'
               }
               else if (colorGrade ==3){
                 div.innerHTML +='<span id="label"><b>B</b></span>'
               }
               else if (colorGrade ==2){
                 div.innerHTML +='<span id="label"><b>C</b></span>'
               }
               else if (colorGrade ==1){
                 div.innerHTML +='<span id="label"><b>D</b></span>'
               }
               else {
                 div.innerHTML +='<span id="label"><b>No Data</b></span>'
               }



       }

       return div;
   };

   legend.addTo(map);
 };

 //////////////////////////////////////////////////////////////////////////////




$(document).ready(createMap);

})();
