(function() {

    votaciones = {};

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var options = {

    };

    var quadrants = [
        { index: 0, name: "AF", bounds: {x0: 0, y0:0 }},
        { index: 1, name: "NE", bounds: {x0: width/2, y0:0 }},
        { index: 2, name: "AB", bounds: {x0: 0, y0:height/2 }},
        { index: 3, name: "AU", bounds: {x0: width/2, y0:height/2 }},
    ];

    var dotRadius = 10;
    var dotsPerRow = Math.floor(width/2/dotRadius/2);

    votaciones.init = function(settings) {
        options = $.extend(options, settings);

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

        d3.tsv("/assets/data/bloques.tsv", function(error, bloques) {

            function getBlock(blockId) {
                return bloques.filter(function(bloque) { return bloque.id_bloque == blockId })[0];
            }

            d3.tsv("/assets/data/votaciones.tsv", function(error, data) {

                var votes = getSortedData(data, 210);
                console.log(bloques);        //TODO(gb): Remove trace!!!
                svg.selectAll(".dot")
                    .data(votes)
                    .enter().append("circle")
                    .attr("class", function(d) { return "bloque"+ d.bloqueId })
                    .attr("r", dotRadius)
                    .attr("cx", function(d, i) {
                        var quadrant = getQuadrant(d.voto);
                        var index = i % quadrant.count;
                        return quadrant.bounds.x0 + 2*dotRadius * (index % dotsPerRow) + dotRadius;
                    })
                    .attr("cy", function(d, i) {
                        var quadrant = getQuadrant(d.voto);
                        var index = i % quadrant.count;
                        var row = Math.floor(index / dotsPerRow);
                        return getQuadrant(d.voto).bounds.y0 + row * 2*dotRadius + dotRadius;
                    })
                    .attr("fill", function(d) { return getBlock(d.bloqueId).color })
                    .tooltip(function(d,i) {
                        return {
                            type: "fixed",
                            gravity: "bottom",
                            content: "<p>" + getBlock(d.bloqueId).bloque + "</p>"
                        }
                    })
            });
        });
    }

    function getQuadrant(name) {
        return quadrants.filter(function(quadrant) { return quadrant.name == name })[0];
    }

    function getSortedData(data, asuntoId) {
        var sortedData = [];
        var fitleredData = data.filter(function(datum) { return datum.asuntoId == asuntoId })

        var nest = d3.nest()
            .key(function(d) { return d.voto })
            .key(function(d) { return d.bloqueId }).sortKeys(function(a,b) { return parseInt(b) - parseInt(a)  })
            .entries(fitleredData);

        for (var i=0; i<quadrants.length; i++) {
            quadrants[i].count = 0;
        }

        for (var i=0; i<nest.length; i++) {
            for (var j=0; j<nest[i].values.length; j++) {
                for (var k=0; k<nest[i].values[j].values.length; k++) {
                    var vote = nest[i].values[j].values[k];
                    sortedData.push(vote);
                    getQuadrant(vote.voto).count += 1;
                }
            }
        }

        return sortedData;
    }



})()