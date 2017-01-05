


function createDayBarChart(){
    var data = gdata.filter(function (d) {
        return d.origin == selectedOrigin && d.destination == selectedDestination &&
            minDate <= d.post && d.post <= maxDate &&
            d.price >= minPrice && d.price <= maxPrice &&
            (activeCarriers.indexOf(d.carrier) != -1);
    });
    if(data.length == 0){
        data = gdata;
    }
    d3.select(".days-svg").remove();
    var dayWidth = $(".graph-day").width();
    var dayHeight = 200;
    var dayGraph = d3.select(".graph-day").append("svg").attr("class", "days-svg").attr("width", dayWidth).attr("height", dayHeight);

    //remove previous
    var dayGraph = d3.select(".graph-day svg");
    var g = dayGraph.append("g").attr("class", "bar-days");

    var week = d3.nest().key(function (d) {
            return d.post.getDay();
        }).entries(data);
    var dow = [
        {day: "Sunday", data: undefined},
        {day: "Monday", data: undefined},
        {day: "Tuesday", data: undefined},
        {day: "Wednesday", data: undefined},
        {day: "Thursday", data: undefined},
        {day: "Friday", data: undefined},
        {day: "Saturday", data: undefined}
    ];
    week.forEach(function (d) {
        dow[d.key].data = d.values.length;
    });
    var dayScale = d3.scaleLinear().range([0,(dayWidth-100)]).domain([0,d3.max(dow, function(d){return d.data})]);
    g.selectAll("rect.days")
        .data(dow)
        .enter().append("rect")
        .attr("class", "days")
        .attr("height", 20)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("transform", function (d, i) {
            return "translate(65," + (50 + (20 * i)) + ")";
        });


    // bar width animation
    g.selectAll("rect.days")
        // .transition()
        .attr("width", function (d) {
            if (d.data) {
                return dayScale(d.data);
            } else {
                return 0.5;
            }
        });
    // bars label
    var labelScale = d3.scaleBand().range([0, 140]).domain(dow.map(function(d){return d.day}));

    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(65,50)")
      .call(d3.axisLeft(labelScale).tickSizeOuter(0));

    // bars price values

    g.selectAll("text.bar-day-value")
        .data(dow)
        .enter().append("text")
        .attr("class", "bar-day-value");

    g.selectAll("text.bar-day-value")
        .text(function(d){
            if(d.data) {
                return d.data;
            }else{
                return "0";
            }
        })
        .attr("transform", function (d, i) {
            if(d.data){
                return "translate(" + (dayScale(d.data) + 70) + "," +  (66 + (20 * i)) + ")"
            }else{
                return "translate(" + 70 + "," +  (66 + (20 * i)) + ")"
            }
        });
}

function createMonthBarChart(){
    var data = gdata.filter(function (d) {
        return d.origin == selectedOrigin && d.destination == selectedDestination &&
            minDate <= d.post && d.post <= maxDate &&
            d.price >= minPrice && d.price <= maxPrice &&
            (activeCarriers.indexOf(d.carrier) != -1);
    });
    if(data.length == 0){
        data = gdata;
    }

    d3.select(".month-svg").remove();

    var width = $(".graph-month").width();
    var height = 300;
    var dayGraph = d3.select(".graph-month").append("svg").attr("class", "month-svg").attr("width", width).attr("height", height);
    var g = dayGraph.append("g").attr("class", "bar-month");

    var month = d3.nest().key(function (d) {
        return d.post.getMonth()
    }).entries(data);

    var mon = [
        {month: "January", data: undefined},
        {month: "February", data: undefined},
        {month: "March", data: undefined},
        {month: "April", data: undefined},
        {month: "May", data: undefined},
        {month: "June", data: undefined},
        {month: "July", data: undefined},
        {month: "August", data: undefined},
        {month: "September", data: undefined},
        {month: "October", data: undefined},
        {month: "November", data: undefined},
        {month: "December", data: undefined}
    ];
    month.forEach(function (d) {
        mon[d.key].data = d.values.length;
    });
    var monthScale = d3.scaleLinear().range([0,(width-100)]).domain([0,d3.max(mon, function(d){return d.data})]);
    g.selectAll("rect.month")
        .data(mon)
        .enter().append("rect")
        .attr("class", "month")
        .attr("height", 20)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("transform", function (d, i) {
            return "translate(65," + (50 + (20 * i)) + ")";
        });


    // bar width animation
    g.selectAll("rect.month")
        // .transition()
        .attr("width", function (d) {
            if (d.data) {
                return monthScale(d.data);
            } else {
                return 0.5;
            }
        })

    // // bars label
    var labelScale = d3.scaleBand().range([0, 240]).domain(mon.map(function(d){return d.month}));

    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(65,50)")
      .call(d3.axisLeft(labelScale).tickSizeOuter(0));

    // bars price values

    g.selectAll("text.bar-day-value")
        .data(mon)
        .enter().append("text")
        .attr("class", "bar-day-value");

    g.selectAll("text.bar-day-value")
        .text(function(d){
            if(d.data) {
                return d.data;
            }else{
                return "0";
            }
        })
        .attr("transform", function (d, i) {
            if(d.data){
                return "translate(" + (monthScale(d.data) + 70) + "," +  (66 + (20 * i)) + ")"
            }else{
                return "translate(" + 70 + "," +  (66 + (20 * i)) + ")"
            }
        });
}

function createSalesGraph(data){
    $('input:checkbox').not(this).prop('checked', this.checked);
    d3.select(".sales-svg").remove();
    var width = 750;
    var height = 250;
    var salesGraph = d3.select(".graph-sales .graph-container").append("svg").attr("class", "sales-svg").attr("width", width).attr("height", height);
    d3.select(".sales-svg-filter").remove()
    var salesFilter = d3.select(".graph-sales").append("svg").attr("class", "sales-svg-filter").attr("width", (width + 20)).attr("height", 20)
    var g = salesGraph.append("g").attr("class", "bar-sales");
    var gg = salesFilter.append("g").attr("class", "bar-sales-filter");

    minDate = d3.min(data, function(d){ return d.post});
    maxDate = d3.max(data, function(d){return d.start});
    minPrice = d3.min(data, function(d){return d.price});
    maxPrice = d3.max(data, function(d){return d.price});

    var xScale =  d3.scaleTime().range([0, width]).domain([minDate,maxDate]);

    gg.append("g")
        .attr("class", "sales-graph axis axis--x")
        .attr("transform", "translate(12,0)")
        .call(d3.axisBottom(xScale).ticks(10));

    var brush = d3.brushX()
        .extent([[0, 0], [width, 10]])
        .on("brush end", brushed);

    gg.append("g")
        .attr("class", "brush")
        .attr("transform", "translate(12,0)")
        .call(brush)
        .call(brush.move, xScale.range());
    function brushed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
        var s = d3.event.selection || xScale.range();
        minDate = xScale.invert(s[0]);
        maxDate = xScale.invert(s[1]);
        console.log(minDate, maxDate);
        if(filteredDestination) {
            filteredTime = filterDataBrush(filteredDestination);
            lastFiltered = filteredTime;
            console.log(filteredTime);
            updateChart();
            createDayBarChart();
            createMonthBarChart();
            createBoxPlot();

        }
        // x.domain(s.map(x2.invert, x2));
        // focus.select(".area").attr("d", area);
        // focus.select(".axis--x").call(xAxis);
        // svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
        //     .scale(width / (s[1] - s[0]))
        //     .translate(-s[0], 0));
    }

    // append bars
    if(filteredDestination) {
        filteredDestination.sort(function (a, b) {
            return a.post - b.post;
        });

        var arrayOfLines = d3.nest()
            .key(function (d) {
                return d.carrier;
            })
            .entries(data);

        var n = [];
        arrayOfLines.forEach(function(e){
            e.values.forEach(function(e){
                var o = {
                    carrier: e.carrier,
                    price: e.price,
                    start: e.start,
                    post: e.post
                }
                n.push(o);
            });
        });

        // var carrierMap = d3.map(n, function(d){return d.carrier})
        // carriers
        //     .domain(carrierMap.keys())
        //     .range(carrierMap.keys().map(function(d){return cheat(d)}));
        //
        // console.log(n);
        // var tamNest = d3.nest().key(function(d){return d.carrier}).entries(n).filter(function(d){return d.key == "Tam"})
        // var azulNest = d3.nest().key(function(d){return d.carrier}).entries(n).filter(function(d){return d.key == "Azul"})
        // var golNest = d3.nest().key(function(d){return d.carrier}).entries(n).filter(function(d){return d.key == "Gol"})

        var priceDomain = d3.extent(n, function(d){return d.price})
        test.Tam.domain(priceDomain);
        test.Azul.domain(priceDomain);
        test.Gol.domain(priceDomain);

        // tamScale.domain(d3.extent(tamNest[0].values, function(d){return d.price}));

        d3.select(".sales-svg").attr("height", function (d) {
            // return n.length * 10
            return 250;
        })
        var sale = d3.select('.sales-svg').select(".bars").remove()
        var sale = d3.select('.sales-svg').append("g").attr("class","bars").selectAll("rect").data(n);
        var individualHeight = 250/n.length;
        var offset = 250/n.length;

        console.log(n);
        sale.enter()
            .append("rect")
            .attr("class", function(d){return d.carrier + " selected";})
            .attr("x", function(d){return xScale(d.post);})
            .attr("y", function(d, i){return (i * offset);})
            .attr("fill", function(d){
                    return test[d.carrier](d.price);
            })
            .attr("height", individualHeight) // change the height of bar according to the space
            .attr("width", function(d){ return (xScale(d.start) - xScale(d.post));})
            .on("mouseover", function(d){
                console.log(d.price);
            })
            .attr("stroke",  "white");
        sale.exit().remove();

    // create legend
        d3.select(".svg-legend").remove();

        var div = d3.select(".div-legend");

        var p = div.selectAll('p').data(carriers.domain()).enter().append('p').attr("width", 20)
        p.append("input")
            .attr("type", "checkbox")
            .attr("checked", "checked")
            .attr("class", "filled-in")
            .attr("id", function(d,i){return d})

        var label = p.append("label")
            .attr("for", function(d,i){return d})

        label.append("svg").attr("width",20).attr("height", 20).style("margin-bottom", 20)
            .append("circle")
            .attr("class", function(d){return "circle-"+d})
            .attr("r", 10)
            .attr("cx", 10)
            .attr("cy", 10)
            .attr("fill", function(d){return carriers(d)})
        label.append("text")
            .attr("class", "legend-text")
            .text(function(d){return d});


        $('input[type=checkbox]').click(function(){
            if($(this).is(':checked')){
                activeCarriers.push(this.id);
            }else{
                var v = $.inArray(this.id, activeCarriers);
                if( v >= 0){
                    activeCarriers.splice(v,1);
                }
            }

            updateChart();
            createBoxPlot();
            createMonthBarChart();
            createDayBarChart();
        });

        // add filters

        //add price filter
        //create histogram
        d3.select(".svg-price").remove();
        var svgPrice= d3.select(".div-price").append("div").append("svg").attr("class","svg-price").attr("width", 100).attr("height", 150).attr("transform", "translate(0,40)");

        var y = d3.scaleLinear()
            .rangeRound([0, 100])
            .domain(priceDomain);

        var prices = n.map(function (d) {
            return d.price;
        });

        var bins = d3.histogram()
            .domain(y.domain())
            .thresholds(y.ticks(20))
            (prices);

        var x = d3.scaleLinear()
            .domain([0, d3.max(bins, function(d) { return d.length; })])
            .range([40, 0]);

        console.log("bins", bins);
        d3.selectAll(".bar-scent").remove();

       var bar =  svgPrice.append("g")
            .attr("class", "price-filter").attr("transform", ("translate(40, 10)"))
            .selectAll(".bar-scent")
            .data(bins)
            .enter().append("g")
            .attr("class", "bar-scent")
            .attr("transform", function(d) { return "translate(0," + y(d.x0)+")"; });

        bar.append("rect")
            .attr("x", 1)
            .attr("height", 5)
            .attr("width", function(d) { return (40 - x(d.length)); });


        bar.exit().remove()
        d3.selectAll(".axis.axis--x--price").remove();
        console.log("y", y);
        svgPrice.append("g")
            .attr("class", "axis axis--y--price")
            .attr("transform", "translate(40,10)")
            .call(d3.axisLeft(y).tickValues(y.domain()));


        d3.select(".brush-price").remove();
        var priceBrush = d3.brushY()
            .extent([[0, 0], [15, 100]]);

        svgPrice.append("g")
            .attr("class", "brush-price")
            .attr("transform", "translate(40,10)")
            .call(priceBrush)
            .call(priceBrush.move, [0,100]);



        priceBrush.on("brush end", function(){
            var s = d3.event.selection || y.range();
            var borderRight = y.invert(s[0]);
            var borderLeft = y.invert(s[1]);
            maxPrice = borderLeft;
            minPrice = borderRight;
            filteredPrice = filterDataPrice(filteredDestination);
            lastFiltered = filteredPrice;
            updateChart();
            createDayBarChart();
            createMonthBarChart();
            createBoxPlot();
        });

        createBoxPlot(n);
        // createPriceFilter(n);

    }

}


function updateChart() {
    var data = gdata.filter(function (d) {
        return d.origin == selectedOrigin && d.destination == selectedDestination &&
            minDate <= d.post && d.post <= maxDate &&
            d.price >= minPrice && d.price <= maxPrice &&
            (activeCarriers.indexOf(d.carrier) != -1);
    });

    var width = 750;
    var height = 250;
    var xScale =  d3.scaleTime().range([0, width]).domain([minDate,maxDate]);

    d3.select(".bars").remove();
    data.sort(function (a, b) {
        return a.start - b.start;
    });

    var arrayOfLines = d3.nest()
        .key(function (d) {
            return d.carrier;
        })
        .entries(data);

    var n = [];
    arrayOfLines.forEach(function(e){
        e.values.forEach(function(e){
            var o = {
                carrier: e.carrier,
                price: e.price,
                start: e.start,
                post: e.post
            }
            n.push(o);
        });
    });

    /* maybe */

    // var priceDomain = d3.extent(n, function(d){return d.price})
    // test.Tam.domain(priceDomain);
    // test.Azul.domain(priceDomain);
    // test.Gol.domain(priceDomain);

    d3.select(".sales-svg").attr("height", function (d) {
        // return n.length * 10
        return 250;
    })
    var sale = d3.select('.sales-svg').select(".bars").remove()
    var sale = d3.select('.sales-svg').append("g").attr("class","bars").selectAll("rect").data(n);
    var individualHeight = 250/n.length;
    var offset = 250/n.length;

    sale.enter()
        .append("rect")
        .attr("class", function(d){return d.carrier + " selected";})
        .attr("x", function(d){return xScale(d.post);})
        .attr("y", function(d, i){return (i * offset);})
        .attr("fill", function(d){
            return test[d.carrier](d.price);
            // }
            // if(_colorby == "carrier"){
            //     return cScale(d.carrier);
            // }else if(_colorby == "price"){
            //     return pScale(d.price);
            // }
        })
        .attr("height", individualHeight) // change the height of bar according to the space
        .attr("width", function(d){ return (xScale(d.start) - xScale(d.post));})
        // .on("mouseover", function(d){
        //     d3.select(".colorScale .pointer").attr("y", y(d.price));
        // })
        .attr("stroke",  "white");
    sale.exit().remove();


    // create legend
    // var width = $(".graph-legend").width();
    // var heigth = $(".graph-legend").height();
    // if(d3.select())
    d3.select(".svg-legend").remove();

    var div = d3.select(".div-legend");

    var p = div.selectAll('p').data(carriers.domain()).enter().append('p').attr("width", 20)
    p.append("input")
        .attr("type", "checkbox")
        .attr("checked", "checked")
        .attr("class", "filled-in")
        .attr("id", function(d,i){return d})

    var label = p.append("label")
        .attr("for", function(d,i){return d})

    label.append("svg").attr("width",20).attr("height", 20).style("margin-bottom", 20)
        .append("circle")
        .attr("class", function(d){return "circle-"+d})
        .attr("r", 10)
        .attr("cx", 10)
        .attr("cy", 10)
        .attr("fill", function(d){return carriers(d)})
    label.append("text")
        .attr("class", "legend-text")
        .text(function(d){return d});

    //create histogram



}

function createPriceFilter(n, priceDomain){
    d3.select(".svg-price").remove();
    var svg = d3.select(".graph-legend").append("svg").attr("class", "svg-price").attr("width", 200).attr("height",100);

    var y = d3.scaleLinear()
        .rangeRound([0, 100])
        .domain(priceDomain);

    var prices = n.map(function (d) {
        return d.price;
    });

    var bins = d3.histogram()
        .domain(y.domain())
        .thresholds(y.ticks(20))
        (prices);

    var x = d3.scaleLinear()
        .domain([0, d3.max(bins, function(d) { return d.length; })])
        .range([40, 0]);

    d3.selectAll(".bar-scent").remove();

    var bar =  svg.append("g")
        .attr("class", "price-filter").attr("transform", ("translate(50, 100)"))
        .selectAll(".bar-scent")
        .data(bins)
        .enter().append("g")
        .attr("class", "bar-scent")
        .attr("transform", function(d) { return "translate(0," + y(d.x0)+")"; });

    bar.append("rect")
        .attr("x", 1)
        .attr("height", 5)
        .attr("width", function(d) { return (40 - x(d.length)); });


    bar.exit().remove()
    d3.selectAll(".axis.axis--x--price").remove();

    svg.append("g")
        .attr("class", "axis axis--y--price")
        .attr("transform", "translate(50,100)")
        .call(d3.axisLeft(y).tickValues(y.domain()));


    d3.select(".brush-price").remove();
    var priceBrush = d3.brushY()
        .extent([[0, 0], [15, 100]]);

    svg.append("g")
        .attr("class", "brush-price")
        .attr("transform", "translate(50,100)")
        .call(priceBrush)
        .call(priceBrush.move, [0,100]);



    priceBrush.on("brush end", function(){
        var s = d3.event.selection || y.range();
        var borderRight = y.invert(s[0]);
        var borderLeft = y.invert(s[1]);
        maxPrice = borderLeft;
        minPrice = borderRight;
        filteredPrice = filterDataPrice(filteredDestination);
        lastFiltered = filteredPrice;
        updateChart();
        createDayBarChart();
        createMonthBarChart();
        createBoxPlot();
    });

}
function createBoxPlot() {
    var data = gdata.filter(function (d) {
        return d.origin == selectedOrigin && d.destination == selectedDestination &&
            minDate <= d.post && d.post <= maxDate &&
            d.price >= minPrice && d.price <= maxPrice &&
            (activeCarriers.indexOf(d.carrier) != -1);
    });

    if(data.length == 0){
        data = gdata;
    }
    var height = 300
    var width = 500;
    var margin = {"top": 20, "bottom": 20, "left":20, "right":20};
    d3.select(".box-plot").remove();
    var boxplot = d3.select(".div-box-plot").append("svg").attr("class", "box-plot").attr("height", height).attr("width", width);

    //create scale
    var domain = d3.extent(data, function(d){return d.price});

    var d = d3.nest().key(function(d){return d.carrier}).entries(data);
    var yScale = d3.scaleLinear().domain(domain).range([(height - margin.bottom - margin.top - 50), 0]);
    var price_values = [];
    d.forEach(function(d){
            var t = {};
            var s = d.values.map(function(d){
                return d.price;
            }).sort(function(a,b){return a - b});
            t.carrier = d.key;
            t.min = d3.quantile(s, 0);
            t.max = d3.quantile(s,1);
            t.median = d3.quantile(s, 0.5)
            t.fquartile = d3.quantile(s,0.25);
            t.tquartile = d3.quantile(s, 0.75);
        price_values.push(t);
    });
    var xScale = d3.scaleBand().domain(price_values.map(function(d){return d.carrier;})).range([0, (width - margin.left - margin.right)]).paddingInner([0.1])
        .paddingOuter([0.3])
        .align([0.5]);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale)
    boxplot.append("g")
        .attr("class", "axis-x-box-plot")
        .attr("transform", "translate(40,230)")
        .call(xAxis);

    boxplot.append("g")
        .attr("class", "axis-y-box-plot")
        .attr("transform", "translate(40,20)")
        .call(yAxis);

    var bbars = boxplot.append("g")
        .attr("transform", "translate(40,20)");

    var barWidth = xScale.bandwidth()/4;
    var barOffset = barWidth + barWidth/2;
    var bars = bbars.selectAll("rect.box-plot-bar")
        .append('g').attr("class", "box-plot-g").data(price_values)
        .enter()
        
    bars.append('rect')
        .attr("class", "box-plot-bar")
        .attr("width", barWidth)
        .attr("height", function(d){return -(yScale(d.tquartile) - yScale(d.fquartile))})
        .attr("x", function(d){return (xScale(d.carrier) + barOffset)})
        .attr("y", function(d){ return yScale(d.tquartile); })
        .attr("fill", "none")
        .attr("stroke", function(d){return carriers(d.carrier)})
        .on("mouseover", function(d){
            console.log(d);
        })

    //text third quantile
    bars.selectAll("text.third")
        .data(price_values)
        .enter()
        .append("text")
        .attr("class", "third")
        .attr("y", function(d){return (yScale(d.tquartile) - 10)})
        .attr("x", function(d){return xScale(d.carrier)+barOffset/2.5})
        .text(function(d){return Math.trunc(d.tquartile)})
        .style("font-size","10px");
    
    //text first quantile
    bars.selectAll("text.first")
        .data(price_values)
        .enter()
        .append("text")
        .attr("class", "third")
        .attr("y", function(d){return (yScale(d.fquartile) + 10)})
        .attr("x", function(d){return xScale(d.carrier)+barOffset/2.5})
        .text(function(d){return Math.trunc(d.fquartile)})
        .style("font-size","10px");
    
    bars.append("g").selectAll("line.median")
        .data(price_values)
        .enter()
        .append("line")
        .attr("class", "median")
        .attr("y1", function(d){return yScale(d.median)})
        .attr("y2", function(d){return yScale(d.median)})
        .attr("x1", function(d){return (xScale(d.carrier) + barOffset)})
        .attr("x2", function(d){return ((xScale(d.carrier) + barOffset) + barWidth)})
        .style("stroke", "black")
        .style("stroke-width", 1)

    //median price
    bars.selectAll("text.median")
        .data(price_values)
        .enter()
        .append("text")
        .attr("class", "median")
        .attr("y", function(d){return yScale(d.median)})
        .attr("x", function(d){return xScale(d.carrier) + barWidth * 3})
        .text(function(d){return Math.trunc(d.median)})
        .style("font-size","10px");


    bars.append("g").selectAll("line.min")
        .data(price_values)
        .enter()
        .append("line")
        .attr("class", "min")
        .attr("y1", function(d){return yScale(d.min)})
        .attr("y2", function(d){return yScale(d.min)})
        .attr("x1", function(d){return (xScale(d.carrier) + barOffset)})
        .attr("x2", function(d){return ((xScale(d.carrier) + barOffset) + barWidth)})
        .style("stroke", "black")
        .style("stroke-width", 1)

    //min price
    bars.selectAll("text.min")
        .data(price_values)
        .enter()
        .append("text")
        .attr("class", "min")
        .attr("y", function(d){return yScale(d.min)})
        .attr("x", function(d){return xScale(d.carrier) + barWidth * 3})
        .text(function(d){return Math.trunc(d.min)})
        .style("font-size","10px");


    bars.append("g").selectAll("line.max")
        .data(price_values)
        .enter()
        .append("line")
        .attr("class", "max")
        .attr("y1", function(d){return yScale(d.max)})
        .attr("y2", function(d){return yScale(d.max)})
        .attr("x1", function(d){return (xScale(d.carrier) + barOffset)})
        .attr("x2", function(d){return ((xScale(d.carrier) + barOffset) + barWidth)})
        .style("stroke", "black")
        .style("stroke-width", 1)

    //min price
    bars.selectAll("text.max")
        .data(price_values)
        .enter()
        .append("text")
        .attr("class", "max")
        .attr("y", function(d){return yScale(d.max)})
        .attr("x", function(d){return xScale(d.carrier) + barWidth * 3})
        .text(function(d){return Math.trunc(d.max)})
        .style("font-size","10px");

    bars.append("g").selectAll("line.max-third")
        .data(price_values)
        .enter()
        .append("line")
        .attr("class", "max-third")
        .attr("y1", function(d){return yScale(d.max)})
        .attr("y2", function(d){return yScale(d.tquartile)})
        .attr("x1", function(d){return (xScale(d.carrier) + xScale.bandwidth()/2)})
        .attr("x2", function(d){return (xScale(d.carrier) + xScale.bandwidth()/2)})
        .style("stroke", "black")
        .style("stroke-width", 1)
        .attr("stroke-dasharray", "5, 5");

    bars.append("g").selectAll("line.first-min")
        .data(price_values)
        .enter()
        .append("line")
        .attr("class", "first-min")
        .attr("y1", function(d){return yScale(d.fquartile)})
        .attr("y2", function(d){return yScale(d.min)})
        .attr("x1", function(d){return (xScale(d.carrier) + xScale.bandwidth()/2)})
        .attr("x2", function(d){return (xScale(d.carrier) + xScale.bandwidth()/2)})
        .style("stroke", "black")
        .style("stroke-width", 1)
        .attr("stroke-dasharray", "5, 5");

    

}