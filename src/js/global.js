/**
 * Created by felipe on 12/6/16.
 */

//Global Variables to be setted after callbacks

var gdata = undefined;
var filtered = gdata;
var filteredDestination = undefined;
var filteredPrice = undefined;
var filteredTime = undefined;
var lastFiltered = undefined;
var selectedOrigin = undefined;
var selectedDestination = undefined;
var minPrice = undefined;
var maxPrice = undefined;
var minDate = undefined;
var maxDate = undefined;
var activeCarriers = ["Tam", "Gol", "Azul"];
var carrierDim = undefined;
var carriers = d3.scaleOrdinal()
    .domain(["Tam", "Azul", "Gol"])
    .range(["Red", "Blue", "Orange"])


var test = {
    "Tam": d3.scaleLinear().range(["#fde0dd", "#de2d26"]),
    "Azul": d3.scaleLinear().range(["#deebf7", "#3182bd"]),
    "Gol":d3.scaleLinear().range(["#fee6ce","#e6550d"])
}


// change the origem event listener



// http://www.socscistatistics.com/descriptive/histograms/

// destino distribution
/*
 1-700   	210
 701-1400	27
 1401-2100	8
 2101-7000	8
 */



// origem distribution

/*
 1-700	    210
 701-1400	27
 1401-2100	8
 2101-7000	8
 */
