        var ftClient = new FTClient('AIzaSyDICo1qGOtGnd0DD3QEY_rQ2_xcFGLNYto');
		var fileQuery = {
            fields:['fecha', 'hora', 'titulo', 'permalink'],
            table: '1M046BCqwBNjxe9CXbcvUUi0JT6HohC8Gq4S7gRM',
            tail: "ORDER BY fecha"
        }
        ftClient.query(fileQuery, function(rows) {
            var archive = rows.map(function(row) {
                return {
					votacion: Date.parse(row[0]).toString('dddd dd/MM/yyyy') + ' ' + row[1] + ' - ' + row[2] + '</td><td><a href="index-s.html?'+ row[3] +' " target="_blank">Votación</a>'
                }
            });	

        $(document).ready(function() {
            /* ASSOC ARRAY - Detail View */
            var json1 = archive

			$('#DynamicGridLoading').hide();

			delete json1[0]["__type"];

			$('#DynamicGrid').append(CreateDetailView(json1, "lightPro", true)).fadeIn();
			
        });
			})