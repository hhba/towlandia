(function() {

    votaciones = {};

    var margin = {top: 0, right: 0, bottom: 0, left: 0},
        width = 700 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

    var options = {

    };

    var data, svg, blocks, congressmen;

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

        svg = d3.select("#cuadrantes").append("svg")
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
        d3.tsv("/assets/data/diputados.tsv", function(error, diputados) {
            congressmen = diputados;
            d3.tsv("/assets/data/bloques.tsv", function(error, bloques) {
                blocks = bloques;
                d3.tsv("/assets/data/votaciones.tsv", function(error, votaciones) {
                    data = votaciones;
                    update(1);
                });
            });
        });
    }

    votaciones.showVote = function(asuntoId) {
        update(asuntoId);
    }

    function update(asuntoId) {
        var votes = getSortedData(data, asuntoId);
        var dot = svg.selectAll(".dot")
            .data(votes)
            .enter()

        dot.append("circle")
            .attr("class", function(d) { return "dot bloque"+ d.bloqueId })
            .attr("r", 0)
            .tooltip(function(d,i) {
                var content = "<h4>" + getCongressman(d.diputadoId).nombre +"</h4>" +
                    "<p>" + getBlock(d.bloqueId).bloque + "</p>";

                return {
                    type: "fixed",
                    gravity: "bottom",
                    cssClass: "tooltip",
                    content: content
                }
            })

        svg.selectAll("circle")
            .transition()
            .duration(1000)
            .attr("r", dotRadius)
            .attr("fill", function(d) {
                return getBlock(d.bloqueId).color
            })
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

    }

    function getBlock(blockId) {
        return blocks.filter(function(bloque) { return bloque.id_bloque == blockId })[0];
    }

    function getCongressman(congressmanId) {
        return congressmen.filter(function(diputado) { return diputado.diputadoID == congressmanId })[0];
    }

    function getQuadrant(name) {
        return quadrants.filter(function(quadrant) { return quadrant.name == name })[0];
    }

    function getSortedData(thedata, asuntoId) {
        var sortedData = [];
        var fitleredData = thedata.filter(function(datum) { return datum.asuntoId == asuntoId })

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