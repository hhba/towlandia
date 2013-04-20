(function() {

    votaciones = {};

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var options = {

    };

    var quadrants = [
        { index: 0, name: "af", bounds: {x0: 0, y0:0 }},
        { index: 0, name: "ec", bounds: {x0: width/2, y0:0 }},
        { index: 0, name: "ab", bounds: {x0: 0, y0:height/2 }},
        { index: 0, name: "au", bounds: {x0: width/2, y0:height/2 }},
    ];

    var dotRadius = 3.5;

    votaciones.init = function(settings) {
        options = $.extend(options, settings);
        console.log("width= " + width);     //TODO(gb): Remove trace!!!
        console.log("height= " + height);     //TODO(gb): Remove trace!!!

        var x = d3.scale.linear()
            .domain([0,1])
            .range([0, width]);

        var y = d3.scale.linear()
            .domain([0,1])
            .range([height, 0]);

        var color = d3.scale.category10();

        var svg = d3.select("#plot").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Dibujo cuadrantes
        for (var i=0; i<quadrants.length; i++) {
            var quadrant = quadrants[i];
            svg.append("rect")
                .attr("x", quadrant.bounds.x0)
                .attr("y", quadrant.bounds.y0)
                .attr("width", width/2)
                .attr("height", height/2)
                .classed("quadrant", true)
                .classed(quadrant.name, true);
        }

        d3.csv("/assets/data/data.csv", function(error, data) {

//            x.domain(d3.extent(data, function(d) { return d.sepalWidth; })).nice();
//            y.domain(d3.extent(data, function(d) { return d.sepalLength; })).nice();

            svg.selectAll(".dot")
                .data(data)
                .enter().append("circle")
                .attr("class", "dot")
                .attr("r", dotRadius)
                .attr("cx", function(d) {
                    return getQuadrant(d.Voto1).bounds.x0 + dotRadius;
                })
                .attr("cy", function(d) {
                    return getQuadrant(d.Voto1).bounds.y0 + dotRadius;
                });
        });
    }

    function getQuadrant(name) {
        return quadrants.filter(function(quadrant) { return quadrant.name == name })[0];
    }

})()