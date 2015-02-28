<!DOCTYPE html>
<head>
    <title>D&eacute;cada Votada</title>
    <meta http-equiv="Content-Type" content="text/html; charset=8851-9" />
    <link href="assets/bootstrap/css/bootstrap.css" rel="stylesheet">
    <link href="assets/flat-ui/css/flat-ui.css" rel="stylesheet">
    <link href="assets/css/style.css" rel="stylesheet"/>
<style>
body {
  font: 10px;
}

  .axis path,
  .axis line{
    fill: none;
	stroke: #fff;
  }


  .tick text{
    font-size: 12px;
	fill: #fff;
  }

  .tick line{
    opacity: 0.2;
  }
  
.line {
  fill: none;
  stroke-width: 3px;
}

 .tooltip_lines{color:#F7F7F7;
	  font-family:Tahoma;
	  font-size: 100%;
	  font-weight: 800; 
	  background-color:#424242;
          margin: 10px;
          padding-right: 10px;
          padding-left: 10px;
          padding-top: 10px;
		  padding-bottom: 10px;
	  text-align: center;
      -webkit-border-radius:10px;
      -moz-border-radius:10px;
      border-radius:10px;
        }
		
.some-box
	{
	 width: 16px;
	 height: 16px;
	 display:inline-block;
	 white-space:nowrap;
	}		
</style>
<script type="text/javascript" src="assets/js/d3.v3.min.js"></script>
<script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js"></script>
<script type="text/javascript" src="assets/bootstrap/js/bootstrap.min.js"></script>
<body>
<?php
// conectamos a la base de datos
	require('qs_connection-d.php');
	require('qs_functions.php');
	$bloc = qsrequest("bloc");
	$district = qsrequest("district");
	$mean = qsrequest("mean");

?>
<a href="?district=<?php echo $district;?>&bloc=<?php echo $bloc;?>&mean="><button type="button" class="<?php
	if ($mean == '') {
	$legend = "individuales";
	echo "btn btn-primary";
       } else {
	echo "btn btn-default";   
	   }?>">Miembros</button></a>
<a href="?district=<?php echo $district;?>&bloc=<?php echo $bloc;?>&mean=1"><button type="button" class="<?php
	if ($mean !== '') {
	echo "btn btn-primary";
	$legend = "promedio";
       } else {
	echo "btn btn-default";   
	   }?>">Promedios</button></a>
	<?php
	if ($district=='' and $bloc=='') {
	$resultmin = mysql_query("SELECT MIN(ano) as minimum FROM disciplina WHERE votos_oficialistas > 0");
	}

	if ($district!=='' and $bloc=='') {
	$resultmin = mysql_query("SELECT MIN(ano) as minimum FROM disciplina WHERE votos_oficialistas > 0 AND distrito = '$district'");
	$location = ", " . $district;
	}
	
	if ($district!=='' and $bloc!=='') {
	$resultmin = mysql_query("SELECT MIN(ano) as minimum FROM disciplina WHERE votos_oficialistas > 0 AND distrito = '$district' AND color = '$bloc'");
	$location = ", " . $district;
	}	

	if ($district=='' and $bloc!=='') {
	$resultmin = mysql_query("SELECT MIN(ano) as minimum FROM disciplina WHERE votos_oficialistas > 0 AND color = '$bloc'");
	}	
	
	$min = mysql_fetch_row($resultmin);

	if ($district=='' and $bloc=='') {
	$resultmax = mysql_query("SELECT MAX(ano) as minimum FROM disciplina WHERE votos_oficialistas > 0");
	}

	if ($district!=='' and $bloc=='') {
	$resultmax = mysql_query("SELECT MAX(ano) as minimum FROM disciplina WHERE votos_oficialistas > 0 AND distrito = '$district'");
	}
	
	if ($district!=='' and $bloc!=='') {
	$resultmax = mysql_query("SELECT MAX(ano) as minimum FROM disciplina WHERE votos_oficialistas > 0 AND distrito = '$district' AND color = '$bloc'");
	}	

	if ($district=='' and $bloc!=='') {
	$resultmax = mysql_query("SELECT MAX(ano) as minimum FROM disciplina WHERE votos_oficialistas > 0 AND color = '$bloc'");
	}	
	
	$max = mysql_fetch_row($resultmax);
	
	echo "&nbsp;&nbsp;<strong>Tasas de conformidad " . $legend . $location . ", " . $min[0] . " - " . $max[0] . "</strong>";
	?>
<div id="line"></div>
<script>

var data = [
<?php
$r=0;
// miembros

if ($mean=='') {

if ($district=='' and $bloc=='') {
$resultmembers = mysql_query("SELECT miembroId, nombre, distrito, color FROM disciplina WHERE miembroId > 0 GROUP BY miembroId, nombre, distrito, color ORDER BY miembroId ASC");
}

if ($district!=='' and $bloc=='') {
$resultmembers = mysql_query("SELECT miembroId, nombre, distrito, color FROM disciplina WHERE miembroId > 0 AND distrito = '$district' GROUP BY miembroId, nombre, distrito, color ORDER BY miembroId ASC");
}

if ($district!=='' and $bloc!=='') {
$resultmembers = mysql_query("SELECT miembroId, nombre, distrito, color FROM disciplina WHERE miembroId > 0 AND distrito = '$district' AND color = '$bloc' GROUP BY miembroId, nombre, distrito, color ORDER BY miembroId ASC");
}

if ($district=='' and $bloc!=='') {
$resultmembers = mysql_query("SELECT miembroId, nombre, distrito, color FROM disciplina WHERE miembroId > 0 AND color = '$bloc' GROUP BY miembroId, nombre, distrito, color ORDER BY miembroId ASC");
}

$num = mysql_numrows($resultmembers);

while ($r < $num) {
$miembroId=mysql_result($resultmembers,$r,"miembroId");
$nombre=mysql_result($resultmembers,$r,"nombre");
$distrito=mysql_result($resultmembers,$r,"distrito");
$color=mysql_result($resultmembers,$r,"color");
?>

    {
        id: "<?php echo $miembroId;?>",
		name: "<?php echo $nombre;?>",
        district: "<?php echo $distrito;?>",
		color: "<?php echo $color;?>",
		        data: [
<?php
$rr=0;


$resultlines = mysql_query("SELECT ano, ROUND(AVG(oficialismos / votos_oficialistas),4) AS conformidad FROM disciplina WHERE miembroId = $miembroId GROUP BY ano ORDER BY ano ASC, AVG(ROUND(oficialismos / votos_oficialistas, 2)) ASC");

$numm = mysql_numrows($resultlines);
while ($rr < $numm) {
$ano=mysql_result($resultlines,$rr,"ano");
$conformidad=mysql_result($resultlines,$rr,"conformidad");

?>
				[<?php echo $ano;?>, <?php echo $conformidad;?>],
<?php
$rr++;
}
$r++;
?>
        ]
    },
<?php
}
?>
];
<?php
}

//promedios de bloque

if ($mean!=='') {

if ($district=='' and $bloc=='') {
$resultmembers = mysql_query("SELECT color FROM disciplina WHERE miembroId > 0 GROUP BY color");
}

if ($district!=='' and $bloc=='') {
$resultmembers = mysql_query("SELECT color FROM disciplina WHERE miembroId > 0 AND distrito = '$district' GROUP BY color");
}

if ($district!=='' and $bloc!=='') {
$resultmembers = mysql_query("SELECT color FROM disciplina WHERE miembroId > 0 AND distrito = '$district' AND color = '$bloc' GROUP BY color");
}

if ($district=='' and $bloc!=='') {
$resultmembers = mysql_query("SELECT color FROM disciplina WHERE miembroId > 0 AND color = '$bloc' GROUP BY color");
}

$num = mysql_numrows($resultmembers);

while ($r < $num) {
$color=mysql_result($resultmembers,$r,"color");
?>
    {
		name: "<?php
$rrr = 0;
if ($district == '') {
$resultbloques = mysql_query("SELECT bloque FROM disciplina WHERE color = '$color' GROUP BY bloque");
}

if ($district !== '') {
$resultbloques = mysql_query("SELECT bloque FROM disciplina WHERE color = '$color' AND distrito = '$district' GROUP BY bloque");
}

$nummm = mysql_numrows($resultbloques);

while ($rrr < $nummm) {
$bloque=mysql_result($resultbloques,$rrr,"bloque");
if ($rrr < $nummm - 1) {
$bloques = $bloque . ", ";
} else {
$bloques = $bloque;
}
echo $bloques;
$rrr++;
}
?>",
		color: "<?php echo $color;?>",
		        data: [
<?php
$rr=0;

if ($district=='') {
$resultlines = mysql_query("SELECT ano, ROUND(AVG(oficialismos / votos_oficialistas),4) AS conformidad FROM disciplina WHERE miembroId > 0 AND color = '$color' GROUP BY ano, color ORDER BY ano ASC");
}

if ($district!=='') {
$resultlines = mysql_query("SELECT ano, ROUND(AVG(oficialismos / votos_oficialistas),4) AS conformidad FROM disciplina WHERE miembroId > 0 AND color = '$color' AND distrito = '$district' GROUP BY ano, color ORDER BY ano ASC");
}

$numm = mysql_numrows($resultlines);
while ($rr < $numm) {
$ano=mysql_result($resultlines,$rr,"ano");
$conformidad=mysql_result($resultlines,$rr,"conformidad");

?>
				[<?php echo $ano;?>, <?php echo $conformidad;?>],
<?php
$rr++;
}
$r++;
?>
        ]
    },
<?php
}
?>
];
<?php
}
?>
d3.helper = {};
 
d3.helper.tooltip = function(accessor){
    return function(selection){
        var tooltipDiv;
        var bodyNode = d3.select('body').node();
        selection.on("mouseover", function(d, i){
            // Clean up lost tooltips
            d3.select('body').selectAll('div.tooltip_lines').remove();
            // Append tooltip
            tooltipDiv = d3.select('body').append('div').attr('class', 'tooltip_lines');
            var absoluteMousePos = d3.mouse(bodyNode);
            tooltipDiv.style('left', (absoluteMousePos[0] +15)+'px')
                .style('top', (absoluteMousePos[1] - 25)+'px')
                .style('position', 'absolute')
                .style('z-index', 1001);
            // Add text using the accessor function
            var tooltipText = accessor(d, i) || '';

			var item = d3.select(this);
			
			item.attr("class", "highlight");
			
			graph.selectAll(".highlight")
			.attr("opacity", 1)
			.style("stroke-width", "8px");
			
			graph.selectAll(".line")
			.attr("opacity", 0.2); 
			//item = d3.select(this);
		
				//item.style("stroke-width", "8px")
				//.style("opacity", 1);

        })
        .on('mousemove', function(d, i) {
            // Move tooltip
            var absoluteMousePos = 0;
            tooltipDiv.style('left', (absoluteMousePos[0] + 10)+'px')
                .style('top', (absoluteMousePos[1] - 25)+'px');
            var tooltipText = accessor(d, i) || '';
            tooltipDiv.html(tooltipText);

        })
        .on("mouseout", function(d, i){
            // Remove tooltip
			setTimeout(function(){tooltipDiv.remove();}, 1);
			
			var item = d3.select(this);
			
			item.attr("class", "line");
			
			graph.selectAll(".line")
				.attr("opacity", 0.5)
				.style("stroke-width", "3px");
			});
 
    };
};
var margin = [30, 30, 30, 30];
var w = 800 - margin[1] - margin[3];
var h = 400 - margin[0] - margin[2];

var x = d3.time.scale().range([0, w]);
var y = d3.scale.linear().range([h, 0]);
var lineFunction = d3.svg.line()
	.interpolate("monotone")  
    .x(function(d) { return x(d[0]); })
    .y(function(d) { return y(d[1]); });


var area = d3.select('#line')
			.append("svg:svg")
			.attr("class", "line-graph")
			.attr("width", w + margin[1] + margin[3])
			.attr("height", h + margin[0] + margin[2]);

var rect = area.append("rect")
			.attr("width", w + margin[1] + margin[3])
			.attr("height", h + margin[0] + margin[2])
			.style("fill", "#333");

var graph = area.append("svg:g")
			.attr("transform", "translate(" + margin[3] + "," + margin[0] + ")")
		
x.domain([
    d3.min(data, function(c) { return d3.min(c.data, function(v) { return v[0]; }); }),
    d3.max(data, function(c) { return d3.max(c.data, function(v) { return v[0]; }); })
]);

y.domain([
    d3.min(data, function(c) { return d3.min(c.data, function(v) {  return +v[1]; }); }),
    d3.max(data, function(c) { return d3.max(c.data, function(v) { return +v[1]; }); })
]);

var xScale = d3.scale.linear()
    .domain([<?php echo $min[0];?>, <?php echo $max[0];?>])
    .range([0, w]);

var yScale = d3.scale.linear()

<?php

	if ($mean=='') {
	
	if ($district=='' and $bloc=='') {
	$resultminirange = mysql_query("SELECT MIN(ROUND(oficialismos / votos_oficialistas,2)*100) as minirange FROM disciplina WHERE miembroId > 0");
	}

	if ($district!=='' and $bloc=='') {
	$resultminirange = mysql_query("SELECT MIN(ROUND(oficialismos / votos_oficialistas,2)*100) as minirange FROM disciplina WHERE miembroId > 0 AND distrito = '$district'");
	}
	
	if ($district!=='' and $bloc!=='') {
	$resultminirange = mysql_query("SELECT MIN(ROUND(oficialismos / votos_oficialistas,2)*100) as minirange FROM disciplina WHERE miembroId > 0 AND distrito = '$district' AND color = '$bloc'");
	}	

	if ($district=='' and $bloc!=='') {
	$resultminirange = mysql_query("SELECT MIN(ROUND(oficialismos / votos_oficialistas,2)*100) as minirange FROM disciplina WHERE miembroId > 0 AND color = '$bloc'");
	}	
	
	$minirange = mysql_fetch_row($resultminirange);
	
	if ($district=='' and $bloc=='') {
	$resultmaxirange = mysql_query("SELECT MAX(ROUND(oficialismos / votos_oficialistas,2)*100) as maxirange FROM disciplina WHERE miembroId > 0");
	}

	if ($district!=='' and $bloc=='') {
	$resultmaxirange = mysql_query("SELECT MAX(ROUND(oficialismos / votos_oficialistas,2)*100) as maxirange FROM disciplina WHERE miembroId > 0 AND distrito = '$district'");
	}
	
	if ($district!=='' and $bloc!=='') {
	$resultmaxirange = mysql_query("SELECT MAX(ROUND(oficialismos / votos_oficialistas,2)*100) as maxirange FROM disciplina WHERE miembroId > 0 AND distrito = '$district' AND color = '$bloc'");
	}	

	if ($district=='' and $bloc!=='') {
	$resultmaxirange = mysql_query("SELECT MAX(ROUND(oficialismos / votos_oficialistas,2)*100) as maxirange FROM disciplina WHERE miembroId > 0 AND color = '$bloc'");
	}	
	
	$maxirange = mysql_fetch_row($resultmaxirange);
	}
	
	if ($mean!=='') {
	
	if ($district=='' and $bloc=='') {
	$resultminirange = mysql_query("SELECT AVG(ROUND(oficialismos / votos_oficialistas,2)*100) as minirange FROM disciplina WHERE miembroId > 0 GROUP BY ano, color ORDER BY AVG(ROUND(oficialismos / votos_oficialistas,2)*100) ASC LIMIT 1");
	}

	if ($district!=='' and $bloc=='') {
	$resultminirange = mysql_query("SELECT AVG(ROUND(oficialismos / votos_oficialistas,2)*100) as minirange FROM disciplina WHERE miembroId > 0 AND distrito = '$district' GROUP BY ano, color ORDER BY AVG(ROUND(oficialismos / votos_oficialistas,2)*100) ASC LIMIT 1");
	}
	
	if ($district!=='' and $bloc!=='') {
	$resultminirange = mysql_query("SELECT AVG(ROUND(oficialismos / votos_oficialistas,2)*100) as minirange FROM disciplina WHERE miembroId > 0 AND distrito = '$district' AND color = '$bloc' GROUP BY ano, color ORDER BY AVG(ROUND(oficialismos / votos_oficialistas,2)*100) ASC LIMIT 1");
	}	

	if ($district=='' and $bloc!=='') {
	$resultminirange = mysql_query("SELECT AVG(ROUND(oficialismos / votos_oficialistas,2)*100) as minirange FROM disciplina WHERE miembroId > 0 AND color = '$bloc' GROUP BY ano, color ORDER BY AVG(ROUND(oficialismos / votos_oficialistas,2)*100) ASC LIMIT 1");
	}	
	
	$minirange = mysql_fetch_row($resultminirange);
	
	if ($district=='' and $bloc=='') {
	$resultmaxirange = mysql_query("SELECT AVG(ROUND(oficialismos / votos_oficialistas,2)*100) as maxirange FROM disciplina WHERE miembroId > 0 GROUP BY ano, color ORDER BY AVG(ROUND(oficialismos / votos_oficialistas,2)*100) DESC LIMIT 1");
	}

	if ($district!=='' and $bloc=='') {
	$resultmaxirange = mysql_query("SELECT AVG(ROUND(oficialismos / votos_oficialistas,2)*100) as maxirange FROM disciplina WHERE miembroId > 0 AND distrito = '$district' GROUP BY ano, color ORDER BY AVG(ROUND(oficialismos / votos_oficialistas,2)*100) DESC LIMIT 1");
	}
	
	if ($district!=='' and $bloc!=='') {
	$resultmaxirange = mysql_query("SELECT AVG(ROUND(oficialismos / votos_oficialistas,2)*100) as maxirange FROM disciplina WHERE miembroId > 0 AND distrito = '$district' AND color = '$bloc' GROUP BY ano, color ORDER BY AVG(ROUND(oficialismos / votos_oficialistas,2)*100) DESC LIMIT 1");
	}	

	if ($district=='' and $bloc!=='') {
	$resultmaxirange = mysql_query("SELECT AVG(ROUND(oficialismos / votos_oficialistas,2)*100) as maxirange FROM disciplina WHERE miembroId > 0 AND color = '$bloc' GROUP BY ano, color ORDER BY AVG(ROUND(oficialismos / votos_oficialistas,2)*100) DESC LIMIT 1");
	}	
	
	$maxirange = mysql_fetch_row($resultmaxirange);
	}	
?>
    .domain([<?php echo $minirange[0];?>, <?php echo $maxirange[0];?>])
    .range([h, 0]);

var xAxis = d3.svg.axis()
    .scale(xScale)
	.tickFormat(d3.format("d"));

var yAxis = d3.svg.axis()
    .scale(yScale)
	.orient("left");
	
var linesGroup = graph
    .append("svg:g")
    .attr("class", "lines");

var linedata;
render();

function render() {

for (var i in data) {
    linedata = data[i];
    linesGroup
        .append("path")
            .attr("d", lineFunction(linedata.data))
            .attr("class", "line")
			.attr("id", function(d, i) {
                return linedata.id})
			.attr("title", function(d, i) {
                return linedata.name})
            .attr("fill", "none")
			.attr("opacity", 0.5)
            .attr("stroke", function(d, i) {
                console.log(linedata.color);
                return "#" + linedata.color});
};


graph.selectAll(".line")
		.data(data)
		.call(d3.helper.tooltip(function(d, i)
			{console.log(d.name);return d.name}));
}
graph.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + h + ")")
		.call(xAxis);

graph.append("g")
		.attr("class", "y axis")
		.call(yAxis);
			
</script>
</body>
</html>