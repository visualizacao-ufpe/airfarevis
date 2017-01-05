/**
 * Created by felipe on 12/6/16.
 */


// import the markers javascript

// Initialize Leaflet
var mymap = L.map("mapid").setView([-8.0578381, -34.8828969], 5);

L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "Map data © <a href=\"http://openstreetmap.org\" + >OpenStreetMap</a> contributors"
}).addTo(mymap);

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this._div.innerHTML += '<div class="legend-top awesome-marker-icon-blue awesome-marker leaflet-zoom-animated leaflet-clickable"><i class="glyphicon glyphicon-plane  icon-white"></i> <p class=" info-text">Origem</p></div>';
    this._div.innerHTML += '<div class="legend-bottom awesome-marker-icon-red awesome-marker leaflet-zoom-animated leaflet-clickable"><i class="glyphicon glyphicon-plane  icon-white"></i><p class="info-text">Destino</p></div>';
    return this._div;
};

info.addTo(mymap);

var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'legend'); // create a div with a class "info"
    this._div.innerHTML += '<p> Número de Promoções </p>'
    this._div.innerHTML += '<svg width="130" height="130"></svg>'
    return this._div;

    // this._div.innerHTML += '<div class="legend-top awesome-marker-icon-blue awesome-marker leaflet-zoom-animated leaflet-clickable"><i class="glyphicon glyphicon-plane  icon-white"></i> <p class=" info-text">Origem</p></div>';
    // this._div.innerHTML += '<div class="legend-bottom awesome-marker-icon-red awesome-marker leaflet-zoom-animated leaflet-clickable"><i class="glyphicon glyphicon-plane  icon-white"></i><p class="info-text">Destino</p></div>';
    // return this._div;
};

legend.addTo(mymap);

// Create the Two Global Markers;
var originMarker = undefined;
var destinationMarker = undefined;
var blueMarker = L.AwesomeMarkers.icon({
    icon: 'plane',
    markerColor: 'blue'
});
var redMarker = L.AwesomeMarkers.icon({
    icon: 'plane',
    markerColor: 'red'
});
// creates a SVG layer on top of the map

L.svg().addTo(mymap);

// get svg layer
var mapSvg = d3.select("#mapid").select("svg").select("g").style("pointer-events", "auto");
//
// // append circles
var mapG = mapSvg.attr("class", "circles-plot");
// var color = d3.scaleThreshold()
//     .domain([700, 1400, 2100, 7000])
//     .range(["#f1eef6", "#bdc9e1", "#74a9cf", "#0570b0"]);
var color = d3.scaleLinear().domain([0,d3.max(cities.map(function(d){return d.totalOrigin}))]).range(['white', 'blue']);
// append map legend
var mapLegendSVG = d3.select(".legend.leaflet-control").select("svg");

mapLegendSVG.append("g")
  .attr("class", "legendLinear")
  .attr("transform", "translate(27,20)");

var legendLinear = d3.legendColor()
  .shapeWidth(30)
  .orient('vertical')
  .scale(color);

mapLegendSVG.select(".legendLinear")
  .call(legendLinear);

// Reduce the scope of carriers to Gol Tam Azul
cities.forEach(function (d) {
    d.LatLng = new L.LatLng(d.location.lat, d.location.lng);
    if(d.flightsDestination){
        d.flightsDestination =  d.flightsDestination.filter(function(d){return d.carrier == "Tam" || d.carrier == "Gol" || d.carrier == "Azul"})
    }
    if(d.flightsOrigin){
        d.flightsOrigin = d.flightsOrigin.filter(function(d){return d.carrier == "Tam" || d.carrier == "Gol" || d.carrier == "Azul"})
    }

    if(d.flightsOrigin) {
        if (d.flightsOrigin.length > 0) {
            $('.select-origin').append($('<option>', {
                value: d.city,
                text: d.city
            }));
        }
    }
});


var citiesCircles = mapG.selectAll("circles")
    .data(cities)
    .enter().append("circle")
    .attr("class", function (d) {
        return d.city;
    })
    .style("stroke", "black")
    .style("fill", function (d) {
        if (d.totalOrigin) {
            return color(d.totalOrigin)
        } else {
            return color(0)
        }
    })
    .attr("r", 5)
    .on("click", function (d) {
        updateOrigin(d)
        // console.log(d);
    })
    .on("contextmenu", function (d) {
        updateDestination(d)
    });


mymap.on("zoom", update);

update();

function update() {
    citiesCircles.attr("cx", function (d) {
        return mymap.latLngToLayerPoint(d.LatLng).x;
    });

    citiesCircles.attr("cy", function (d) {
        return mymap.latLngToLayerPoint(d.LatLng).y;
    });
    citiesCircles.attr("r", function (d) {
        return mymap.getZoom();
    });
}




//* Function to plot Marker on map

function updateOrigin(circle){
    addMarkerOrigin(circle);
    updateOriginSelect();

}


function addMarkerOrigin(circle) {
    if (originMarker) {
        mymap.removeLayer(originMarker);
    }
    if (destinationMarker) {
        mymap.removeLayer(destinationMarker);
    }
    originMarker = L.marker([circle.LatLng.lat, circle.LatLng.lng], {
        icon: blueMarker
    }).addTo(mymap);

    selectedOrigin = circle.city;
    filtered = gdata.filter(function(d){return d.origin == selectedOrigin});
    createDayBarChart();
    createMonthBarChart();

    // update selectbox
    var destinationForSelectedOrigin = d3.map(filtered, function(d){return d.destination}).keys().sort();

    $(".select-destination").material_select("destroy")
    $('select').prop('disabled', true);

    destinationForSelectedOrigin.forEach(function(d) {
        $('.select-destination').append($('<option>', {
            value: d,
            text: d
        }));
    });
    $('select').prop('disabled', false).prop('selected', function() {
        return this.defaultSelected;
    });
    $('select').material_select();

    // update circles
    var newDestinations = d3.nest().key(function(d){return d.destination}).entries(filtered);

    color.domain([0,d3.max(newDestinations, function(d){return d.values.length})]);

    // console.log(">>", newDestinations);
    // console.log(d3.extent(newDestinations, function(d){return d.values.length}));
    // update map legend
    d3.select(".legend.leaflet-control").select("svg").select("g").remove();

    mapLegendSVG.append("g")
    .attr("class", "legendLinear")
    .attr("transform", "translate(27,20)");

    var legendLinear = d3.legendColor()
    .shapeWidth(30)
    .orient('vertical')
    .scale(color);

    mapLegendSVG.select(".legendLinear")
    .call(legendLinear);

    d3.selectAll("circle").style("fill", "white")
    newDestinations.forEach(function(d){
        // console.log(color(d.values.length));
        d3.select("circle."+d.key).style("fill", color(d.values.length));
    });

}


function updateOriginSelect(){
    $(".select-origin.initialized").val(selectedOrigin);
    $("select").material_select();
}
function addMarkerDestination(circle) {
    if(d3.event){
        d3.event.preventDefault();
    }
    if (destinationMarker) {
        mymap.removeLayer(destinationMarker);
    }
    destinationMarker = L.marker([circle.LatLng.lat, circle.LatLng.lng], {
        icon: redMarker
    }).addTo(mymap);
    selectedDestination = circle.city;
    filteredDestination = crossfilter(filtered).all().filter(function(d){return d.destination == selectedDestination});
    createDayBarChart(filteredDestination);
    createMonthBarChart(filteredDestination);
    createSalesGraph(filteredDestination);

}

function updateDestination(circle){
    addMarkerDestination(circle);
    updateDestinationSelect(circle.city);
}

function updateDestinationSelect(city){
    $(".select-destination.initialized").val(selectedDestination);
    $("select").material_select();
}
function reset(){
    $(".select-destination.initialized.disabled").prop("selected");
}
