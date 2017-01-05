/**
 * Created by felipe on 12/7/16.
 */

function filterData(mean){
    var all = crossfilter(mean).all().filter(function(d){return d.origin == selectedOrigin});
    return all;
}

function  filterDataBrush(mean) {
    var all = crossfilter(mean).all().filter(function(d){
        return d.post >= minDate && d.post <= maxDate
    });
    return all;
}

function  filterDataPrice(mean) {
    var all = crossfilter(mean).all().filter(function(d){
        return d.price >= minPrice && d.price <= maxPrice;
    });
    return all;

}


