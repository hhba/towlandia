var Votaciones = function(settings) {
    var votaciones = {};

    var margin = {top: 0, right: 0, bottom: 0, left: 0},
        width = 696 - margin.left - margin.right,
        height = 696 - margin.top - margin.bottom;

    var svg, data, blocks, congressmen;

    var quadrants = [
        { index: 0, name: "0", bounds: {x0: 0, y0:0 }},
        { index: 1, name: "1", bounds: {x0: width/2, y0:0 }},
        { index: 2, name: "2", bounds: {x0: 0, y0:height/2 }},
        { index: 3, name: "3", bounds: {x0: width/2, y0:height/2 }},
    ];

    var dotRadius = 10;
    var dotsPerRow = Math.floor(width/2/dotRadius/2);

    var options = $.extend({}, settings);

    var x = d3.scale.linear()
        .domain([0,1])
        .range([0, width]);

    var y = d3.scale.linear()
        .domain([0,1])
        .range([height, 0]);

    var color = d3.scale.category10();

    var ftClient = new FTClient('AIzaSyDICo1qGOtGnd0DD3QEY_rQ2_xcFGLNYto');

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

    // Diputados
    ftClient.query({
        fields: ["*"],
        table: "1OAvsKOSuQE3NzXNKGLwQpBDj9iK3mLweHb8Lcfg"
    }, function(rows) {
        congressmen = rows.map(function(row) {
            return {
                diputadoId: row[0],
                nombre: row[1],
                distrito: row[2]
            }
        })
    });

    // Bloques
    ftClient.query({
        fields: ["*"],
        table: "1gUTqf8A-nuvBGygRnVDcSftngYZ-z9OvxBs59M0"
    }, function(rows) {
        blocks = rows.map(function(row) {
            return {
                bloqueId: row[0],
                bloque: row[1],
                color: row[2]
            }
        })
    });


    votaciones.showVote = function(asuntoId) {
        // Votaciones
        ftClient.query({
            fields: ["*"],
            table: "1KxXAg9YuF_r-1N_LAleR4QqKl4QZMHIeJh0EUf8",
            tail: "WHERE asuntoId = '" + asuntoId + "'"
        }, function(rows) {
            data = rows.map(function(row) {
                return {
                    asuntoId: row[0],
                    diputadoId: row[1],
                    bloqueId: row[2],
                    voto: row[3]
                }
            })
            update(asuntoId);
        });

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
                return {
                    type: "fixed",
                    gravity: "bottom",
                    cssClass: "tooltip fade bottom in tooltip-light",
                    updateContent: function() {
                        var content =
                            "<p><strong>" + getCongressman(d.diputadoId).nombre +"</strong></p>" +
                            "<p>" + getBlock(d.bloqueId).bloque + "</p>";
                        $(".tooltip-inner").html(content);
                    }
                }
            })

        svg.selectAll("circle")
            .transition()
            .duration(1000)
            .attr("r", dotRadius)
            .attr("fill", function(d) {
                return color(d.bloqueId);
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
        return blocks.filter(function(bloque) { return bloque.bloqueId == blockId })[0];
    }

    function getCongressman(congressmanId) {
        return congressmen.filter(function(diputado) { return diputado.diputadoId == congressmanId })[0];
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

    return votaciones;
}
