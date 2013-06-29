$(document).ready(function() {

    // index
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

    // bloques
    $('.chk-bloque-ninguno').hide();

    $('.bloques').on('click', '.chk-bloque', function() {
        if($('.chk-bloque:checked').length == 0) {
            $('circle').removeClass('circle-blur circle-focus');
            $('.chk-bloque-ninguno').hide();
        }
        else {
            $('.chk-bloque-ninguno').show();
            var bloque = $(this).val();
            if($(this).is(':checked')) {
                $('.bloque' + bloque).addClass('circle-focus');
                $('circle').not('.bloque' + bloque + ' circle-focus').addClass('circle-blur');
            }
            else
                $('.bloque' + bloque).addClass('circle-blur').removeClass('circle-focus');
        }
    });

    $('.bloques').on('click', '.chk-bloque-ninguno', function() {
        $('circle').removeClass('circle-blur circle-focus');
        $('.chk-bloque:checked').removeAttr('checked');
        $(this).hide();
    });

    // diputados
    $('.chk-diputado-ninguno').hide();

    $('.diputados').on('click', '.chk-diputado', function() {
        if($('.chk-diputado:checked').length == 0) {
            $('circle').removeClass('circle-blur circle-focus');
            $('.chk-diputado-ninguno').hide();
        }
        else {
            $('.chk-diputado-ninguno').show();
            var diputado = $(this).val();
            if($(this).is(':checked')) {
                $('#d' + diputado).addClass('circle-focus');
                $('circle').not('#d' + diputado + ' circle-focus').addClass('circle-blur');
            }
            else
                $('#d' + diputado).addClass('circle-blur').removeClass('circle-focus');
        }
    });

    $('.diputados').on('click', '.chk-diputado-ninguno', function() {
        $('circle').removeClass('circle-blur circle-focus');
        $('.chk-diputado:checked').removeAttr('checked');
        $(this).hide();
    });

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

var congressmenChecked;
function getCheckedCongressmen() {
    congressmenChecked = [];
    $('.chk-diputado:checked').each(function() {
        congressmenChecked.push($(this).val());
    });
}
function setCheckedCongressmen() {
    for(var v in congressmenChecked)
        $('.chk-diputado[value="' + congressmenChecked[v] + '"]').attr('checked', 'checked');
}
