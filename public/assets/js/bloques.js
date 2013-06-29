$(document).ready(function() {
    $('.chk-bloque-ninguno').hide();

    $('.bloques').on('click', '.chk-bloque', function() {
        if($('.chk-bloque:checked').length == 0) {
            $('circle').removeClass('bloque-blur bloque-focus');
            $('.chk-bloque-ninguno').hide();
        }
        else {
            $('.chk-bloque-ninguno').show();
            var bloque = $(this).val();
            if($(this).is(':checked')) {
                $('.bloque' + bloque).addClass('bloque-focus');
                $('circle').not('.bloque' + bloque + ' bloque-focus').addClass('bloque-blur');
            }
            else
                $('.bloque' + bloque).addClass('bloque-blur').removeClass('bloque-focus');
        }
    });

    $('.bloques').on('click', '.chk-bloque-ninguno', function() {
        $('circle').removeClass('bloque-blur bloque-focus');
        $('.chk-bloque:checked').removeAttr('checked');
        $(this).hide();
    });

    // pasar a home.js

	$('.quadrant0, .quadrant2').tooltip({
		container: 'body',
		placement: 'left',
		delay: {show: 500}
	});
	$('.quadrant1, .quadrant3').tooltip({
		container: 'body',
		placement: 'right',
		delay: {show: 500}
	});

    $('#intromodal').modal();

    // ---------------

});

var blocksChecked;
function getCheckedBlocks() {
    blocksChecked = [];
    $('.chk-bloque:checked').each(function() {
        blocksChecked.push($(this).val());
    });
}
function setCheckedBlocks() {
    for(var v in blocksChecked)
        $('.chk-bloque[value="' + blocksChecked[v] + '"]').attr('checked', 'checked');
}
