var Votaciones = function(settings) {
    var votaciones = {};

    var margin = {top: 0, right: 0, bottom: 0, left: 0},
        width = 700 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

    var svg, data, blocks, congressmen;

    var quadrants = [
        { index: 0, name: "0", bounds: {x0: 0, y0:0}, countX: 0, countY: 0, title: "Afirmativos"},
        { index: 1, name: "1", bounds: {x0: width/2, y0:0}, countX: 0, countY: 0, title: "Negativos"},
        { index: 2, name: "2", bounds: {x0: 0, y0:height/2}, countX: 0, countY: 0, title: "Abstenciones"},
        { index: 3, name: "3", bounds: {x0: width/2, y0:height/2}, countX: 0, countY: 0, title: "Ausentes"},
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

    var color = d3.scale.linear()
        .range(["white", "black"])

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
            .classed("quadrant" + quadrant.name, true)
			.attr("title", quadrant.title);
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
        color.domain([1, rows.filter(function(row) { return !row[2]}).length]);
        blocks = rows.map(function(row) {
            return {
                bloqueId: row[0],
                bloque: row[1],
                color: row[2] ? row[2] : color(row[0])
            }
        })

    });

    votaciones.showVote = function(asuntoId, success) {
        // Votaciones
        ftClient.query({
            fields: ["*"],
            table: "1GNJAVHF_7xPZFhTc_w4RLxcyiD_lAiYTgVlA0D8",
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
            showTabs();
            update(asuntoId, success);
        });
    }

    votaciones.color = color;

    function update(asuntoId, success) {
        for (var i=0; i<quadrants.length; i++) {
            quadrants[i].countX = 0;
            quadrants[i].countY = 0;
        }
        var votes = getSortedData(data);
        var dot = svg.selectAll(".dot")
            .data(votes, function(d) {
                return d.diputadoId;
            });
            dot.enter()
              .append("circle")
                .attr("class", function(d) {
                    return "dot bloque"+ d.bloqueId;
                })
				.attr("id", function(d) {
					return "d" + d.diputadoId;
				})
                .attr("r", 0);
            dot.exit()
                .attr('r', 0)
                .remove();

        svg.selectAll("circle")
            .transition()
            .duration(1000)
            .attr("r", dotRadius-1)
            .attr("fill", function(d) {
                return blocks.filter(function(block) { return block.bloqueId == d.bloqueId})[0].color;
            })
            .attr("cx", function(d) {
                var xIni = quadrants[d.voto].bounds.x0 + 5;
                var nX = quadrants[d.voto].countX;
                quadrants[d.voto].countX++;
                return xIni + ((nX % dotsPerRow) * dotRadius * 2) + dotRadius;
            })
            .attr("cy", function(d) {
                var yIni = quadrants[d.voto].bounds.y0 + 5;
                var nY = quadrants[d.voto].countY;
                quadrants[d.voto].countY++;
                var fila = Math.floor(nY / dotsPerRow);
                return yIni + (fila * dotRadius * 2) + dotRadius;
            });

        svg.selectAll("circle")
            .tooltip(function(d,i) {
                return {
                    type: "fixed",
                    gravity: "bottom",
                    cssClass: "tooltip fade bottom in tooltip-light",
                    updateContent: function() {
                        var content =
                            "<p><strong>" + getCongressman(d.diputadoId).nombre +"</strong></p>" +
                                "<p>" + getBlock(d.bloqueId).bloque + "</p>" +
                                "<p><strong>" + getCongressman(d.diputadoId).distrito + "</strong></p>";
                        ;
                        $(".tooltip-inner").html(content);
                    }
                }
            });

        if (success) {
            success.apply(null);
        }

    }
    function getBlock(blockId) {
        return blocks.filter(function(bloque) { return bloque.bloqueId == blockId })[0];
    }

    function getCongressman(congressmanId) {
        return congressmen.filter(function(diputado) { return diputado.diputadoId == congressmanId })[0];
    }

    function getSortedData(thedata) {
        var sortedData = thedata.sort(function(a, b) {
            return a.bloqueId - b.bloqueId;
        });
        return sortedData;
    }

    return votaciones;
}
