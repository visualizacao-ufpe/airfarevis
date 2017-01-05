/**
 * Created by felipe on 12/6/16.
 */
// Load Data

// Function to parse the data
var parseDate = d3.timeParse("%d/%m/%Y");

function type(d) {
    d.end = parseDate(d.end);
    d.post = parseDate(d.post);
    d.start = parseDate(d.start);
    d.price = +d.price;
    return d;
}

d3.csv("data/final_trips4.csv", type, function (data) {
    d3.select("body").style("visibility", "visible");
    // console.log("d", data);
    var gol = crossfilter(data).all().filter(function(d){return d.carrier == "Gol"})
    var tam = crossfilter(data).all().filter(function(d){return d.carrier == "Tam"})
    var azul = crossfilter(data).all().filter(function(d){return d.carrier == "Azul"})
    gdata = [].concat(gol).concat(tam).concat(azul);
    bindData = gdata;
    // Reduce the scope to only Gol Tam and Azul
    carrierDim = crossfilter(gdata).dimension(function (d) {
        return d.carrier;
    })
    $(document).ready(function() {
        $('select').material_select();
        $(".select-origin.initialized").change(function () {
            selectedOrigin = $(".select-origin.initialized").find(":selected").text();
            updateOrigin(d3.select("circle."+selectedOrigin).datum());
        });
        $(".select-destination.initialized").change(function () {
            selectedDestination = $(".select-destination.initialized").find(":selected").text();
            updateDestination(d3.select("circle."+selectedDestination).datum());
        });

    });

    createDayBarChart(gdata);
    createMonthBarChart(gdata);
    createBoxPlot();
    createSalesGraph(gdata);
});

