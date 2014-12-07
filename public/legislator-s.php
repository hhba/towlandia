<!DOCTYPE html>
<head>
    <title>D&eacute;cada Votada</title>
    <meta http-equiv="Content-Type" content="text/html; charset=8851-9" />
    <link href="assets/bootstrap/css/bootstrap.css" rel="stylesheet">
    <link href="assets/flat-ui/css/flat-ui.css" rel="stylesheet">
    <link href="assets/css/style.css" rel="stylesheet"/>
<style>
	.some-box
	{
		width: 16px;
		height: 16px;
		display:inline-block;
		white-space:nowrap;
	}
</style>	
</head>
<body>
	<script src="assets/js/d3.v3.min.js"></script>
<?php
	require('qs_connection-s.php');
	require('qs_functions.php');
	$leg = qsrequest("leg");
?>

<div class="container">
	<div class="row">
	        <div class="span12">
	<?
	$resultnombre = mysql_query("SELECT nombre FROM disciplina WHERE diputadoId = $leg GROUP BY nombre");
	while ($row = mysql_fetch_array($resultnombre)) {
	$nombre = $row["nombre"];
	?>
            <h3><?echo $nombre;?></h3>
	<?}
	?>
			</div>
	</div>
	<div class="row">
	<table class="table table-striped" style="overflow: auto; height:324px; width:720px; text-align:center; display:block";">
	<tr>
	<th><center><small>Per&iacute;odo</small></center></th>
	<th><center><small>Bloque</small></center></th>
	<th><center><small>Votaciones</small></center></th>
	<th><center><small>Coincidencias</small></center></th>
	<th colspan="2"><center><small>Tasa de disciplina</small></center></th>
	</tr>


<?php

	$i=0;
	$resultleg = mysql_query("SELECT ano, bloque, SUM(disciplinas) AS disciplines, SUM(votos_bloque) AS votos_bloques, distrito, color, (SUM(disciplinas) / SUM(votos_bloque)) AS indice FROM disciplina WHERE diputadoId = $leg AND votos_bloque > 0 GROUP BY ano, bloque, distrito, color ORDER BY ano ASC");
	while ($row = mysql_fetch_array($resultleg)) {
	$ano = $row["ano"];
	$disciplina = $row["disciplines"];
	$disciplinas = number_format($disciplina, 0, ',', '.');
	$distrito = $row["distrito"];
	$bloque = $row["bloque"];
	$votos_bloques = $row["votos_bloques"];
	$votos_bloque = number_format($votos_bloques, 0, ',', '.');
	$color = $row["color"];
	$indice = $row["indice"] * 100;
	$indicef = number_format($indice, 1, ',', ' ');
	$indicefi = number_format($indice, 0);
	$noindicef = 100 - $indicefi;
?>
	<tr>
		<td style="text-align: center;"><small><?echo $ano;?></small></td>
		<td style="text-align: center;"><div class="some-box" style="background-color:#<?echo $color;?>;"></div>&nbsp;<small><?echo $bloque;?></small></font></td>
		<td style="text-align: right;"><small><?echo $votos_bloque;?></small></td>
		<td style="text-align: right;"><small><?echo $disciplinas;?></small></td>
		<td style="text-align: center;"><div id="chart<?echo $i;?>"></div></td>
		<td style="text-align: right;"><small><?echo $indicef;?>%</small></td>
<script>
var w = 28;
var h = 28;
var r = h/2;
var color = d3.scale.category10();

var data = [{"label":"", "value":<?echo $indicefi;?>}, 
		   {"label":"", "value":<?echo $noindicef;?>}];


var vis = d3.select('#chart<?echo $i;?>').append("svg:svg").data([data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
var pie = d3.layout.pie().value(function(d){return d.value;});


var arc = d3.svg.arc().outerRadius(r);


var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
arcs.append("svg:path")
    .attr("fill", function(d, i){
        return color(i);
    })
    .attr("d", function (d) {
        return arc(d);
    });

// add the text
		
</script>
	</tr>
<?php
	$i++;
	}
?>
	</table>
<?php
	$ii=0;
	$resultstats = mysql_query("SELECT COUNT(nombre) AS nombres, SUM(disciplinas) AS disciplinesstat, AVG(disciplinas) AS disciplineavg, SUM(votos_bloque) AS votos_bloquesstat, AVG(votos_bloque) AS votos_bloqueavg, (SUM(disciplinas) / SUM(votos_bloque)) AS indicestat, (AVG(disciplinas) / AVG(votos_bloque)) AS indicesavg FROM disciplina WHERE diputadoId = $leg AND votos_bloque > 0");
	while ($row = mysql_fetch_array($resultstats)) {
	$nombres = $row["nombres"];
	$nombresf = number_format($nombres, 0, ',', '.');
	$statdisciplina = $row["disciplinesstat"];
	$statdisciplinas = number_format($statdisciplina, 0, ',', '.');
	$statvotos_bloques = $row["votos_bloquesstat"];
	$statvotos_bloque = number_format($statvotos_bloques, 0, ',', '.');
	$avgdisciplinas = $row["disciplineavg"];
	$avgdisciplinasf = number_format($avgdisciplinas, 0);
	$avgvotos_bloque = $row["votos_bloqueavg"];
	$avgvotos_bloquef = number_format($avgvotos_bloque, 0);
	$indicestat = $row["indicestat"] * 100;
	$indicestatf = number_format($indicestat, 1, ',', ' ');
	$indicestatfi = number_format($indicestat, 0);
	$noindicestatf = 100 - $indicestatfi;
	$avgindice = $row["indicesavg"] * 100;
	$avgindicef = number_format($avgindice, 1, ',', ' ');
	$avgindicefi = number_format($avgindice, 0);
	$noavgindicef = 100 - $avgindicefi;	
	
	?>

	<?
	$ii++;
	}
	?>	

	<table class="table table-striped" style="width:720px; text-align:center;";">
	<tr>
		<td width="52%" style="text-align: center;">Suma</td>
		<td width="16%" style="text-align: right;"><?echo $statvotos_bloque;?></td>
		<td width="16%" style="text-align: right;"><?echo $statdisciplinas;?></td>
		<td width="4%" style="text-align: center;" rowspan="2"><div id="chart_stat"></div></td>
		<td width="12%" style="text-align: center;" rowspan="2"><strong><?echo $indicestatf;?>%</strong></td>
<script>
var w = 48;
var h = 48;
var r = h/2;
var color = d3.scale.category10();

var data = [{"label":"", "value":<?echo $indicestatfi;?>}, 
		   {"label":"", "value":<?echo $noindicestatf;?>}];


var vis = d3.select('#chart_stat').append("svg:svg").data([data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
var pie = d3.layout.pie().value(function(d){return d.value;});


var arc = d3.svg.arc().outerRadius(r);


var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
arcs.append("svg:path")
    .attr("fill", function(d, i){
        return color(i);
    })
    .attr("d", function (d) {
        return arc(d);
    });

// add the text
		
</script>		
		
	</tr>
	<tr>
		<td style="text-align: center;">Promedio</td>
		<td style="text-align: right;"><?echo $avgvotos_bloquef;?></td>
		<td style="text-align: right;"><?echo $avgdisciplinasf;?>
		</td>	
	</tr>
	</table>
        <div id="viz"></div>
        <script type="text/javascript">
            
            var w = 800,
            h = 120

            // create canvas
            var svg = d3.select("#viz").append("svg:svg")
            .attr("class", "chart")
            .attr("width", w)
            .attr("height", h )
            .append("svg:g")
            .attr("transform", "translate(20,70)");

            x = d3.scale.ordinal().rangeRoundBands([0, w-100])
            y = d3.scale.linear().range([0, h-50])
            z = d3.scale.ordinal().range(["#1f77b4", "#ff7f0e", "white"])
	    // 4 columns: ID,c1,c2,c3
            var matrix = [ <?php
	$j=0;
	$resultheatstats = mysql_query("SELECT ano, (SUM(disciplinas) / SUM(votos_bloque)) AS indice FROM disciplina WHERE diputadoId= $leg GROUP BY ano ORDER BY ano ASC");
	while ($row = mysql_fetch_array($resultheatstats)) {
	$aniostat = $row["ano"];
	$indicehstat = $row["indice"] * 100;
	$indicefihstat = number_format($indicehstat, 0);
	$nindicefihstat = 100 - $indicefihstat;

	if ($nindicefihstat == 100) { $nindicefihstat = 0; }
?>
                [ <?echo $j;?>, <?echo $indicefihstat;?>, <?echo $nindicefihstat;?>, 0 ],
<?php
	$j++;
	}
?>
            ];
            var remapped =["c1","c2","c3"].map(function(dat,i){
                return matrix.map(function(d,ii){
                    return {x: ii, y: d[i+1] };
                })
            });

            var stacked = d3.layout.stack()(remapped)


            x.domain(stacked[0].map(function(d) { return d.x; }));
            y.domain([0, d3.max(stacked[stacked.length - 1], function(d) { return d.y0 + d.y; })]);


            var valgroup = svg.selectAll("g.valgroup")
            .data(stacked)
            .enter().append("svg:g")
            .attr("class", "valgroup")
            .style("fill", function(d, i) { return z(i); })
            .style("stroke", function(d, i) { return d3.rgb(z(i)).darker(); });

            // Add a rect for each date.
            var rect = valgroup.selectAll("rect")
            .data(function(d){return d;})
            .enter().append("svg:rect")
            .attr("x", function(d) { return x(d.x); })
            .attr("y", function(d) { return -y(d.y0) - y(d.y); })
            .attr("height", function(d) { return y(d.y); })
            .attr("width", 40);

        </script>
	</div>
</div>
</body>
</html>